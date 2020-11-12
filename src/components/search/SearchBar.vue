<template>
  <div class="level">
    <div class="level-item">
      <div class="field has-addons">
        <div class="control has-icons-left">
          <input class="input" type="text" placeholder="Search here" v-model="searchInput" />
          <span class="icon is-left">
            <font-awesome-icon icon="search" />
          </span>
        </div>
        <div class="control submit">
          <div class="button" :class="{ 'is-loading': searchIsLoading }" @click="doSearch">
            <font-awesome-icon icon="arrow-right" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faSearch, faArrowRight);

import useScoreshelf from '@/compositions/scoreshelf/scoreshelf.js';

import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const sharetribeStore = createNamespacedHelpers('sharetribe'); // specific module name
const searchStore = createNamespacedHelpers('search');

export default {
  components: {
    FontAwesomeIcon,
  },
  setup(_, context) {
    const router = context.root.$router;
    const searchInput = ref('');
    const { SCORESHELF } = useScoreshelf();

    //---------- vuex state mapping ----------
    const { searchIsLoading } = searchStore.useState(['searchIsLoading']);
    const {
      toggleSearchIsLoading,
      addSearchListingData,
      addSearchResultsMeta,
    } = searchStore.useMutations([
      'toggleSearchIsLoading',
      'addSearchListingData',
      'addSearchResultsMeta',
    ]);
    const { SHARETRIBE } = sharetribeStore.useState(['SHARETRIBE']);

    // ---------- Methods ---------
    async function doSearch() {
      toggleSearchIsLoading();

      const res = await SHARETRIBE.value.listings.query({
        keywords: searchInput.value,
      });
      router.push({
        name: 'Search',
        params: { query: encodeURIComponent(searchInput.value) },
      });

      const listingData = res.data.data;
      const hydratedThumbnailListingData = await hydrateThumbnailData(listingData);

      addSearchListingData(hydratedThumbnailListingData);
      addSearchResultsMeta(res.data.meta);

      // wait until the dom has reloaded to turn the toggle off
      context.root.$nextTick(() => {
        toggleSearchIsLoading();
      });
    }

    async function hydrateThumbnailData(listingData) {
      const thumbnailRefs = []; // {index, thumbnail_id}
      const thumbnails = []; // [thumbnail_id, ...]

      // format the query and make a sorting refrence to match up easier later
      listingData.forEach((listing, index) => {
        if (listing.attributes.publicData.thumbnail) {
          const thumbnail_id = listing.attributes.publicData.thumbnail.thumbnail_id;
          thumbnails.push(thumbnail_id);
          thumbnailRefs.push({ index: index, thumbnail_id: thumbnail_id });
        }
      });

      // hydrate the data
      const thumbnailData = await SCORESHELF.value.post('getThumbnailData', {
        scoreshelf_ids: thumbnails,
      });

      // update the listing with hydrated data
      thumbnailData.data.forEach(thumbnail => {
        const listingRef = thumbnailRefs.find(
          thumbnailRef => thumbnail._id === thumbnailRef.thumbnail_id
        );
        listingData[listingRef.index].attributes.publicData.thumbnail = thumbnail;
      });

      return listingData;
    }

    function processSearchResults(rawRes) {
      const listingData = rawRes.data.data;
      const resMeta = rawRes.data.meta;
      addSearchListingData(listingData);
      addSearchResultsMeta(resMeta);
    }

    return {
      // ---- Data ----
      searchIsLoading: searchIsLoading,
      searchInput,
      // ---- Methods ----
      doSearch,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
// .button {
//   color: $off-white;
//   background-color: $blue;
// }
// .button:hover {
//   color: $off-white;
//   // background-color: $tan;
// }
</style>
