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

    // vuex state mapping
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

    // methods
    async function doSearch() {
      toggleSearchIsLoading();

      const res = await SHARETRIBE.value.listings.query({
        keywords: searchInput.value,
      });
      router.push({
        name: 'Search',
        params: { query: encodeURIComponent(searchInput.value) },
      });
      processSearchResults(res);

      // wait until the dom has reloaded to turn the toggle off
      context.root.$nextTick(() => {
        toggleSearchIsLoading();
      });
    }

    function processSearchResults(rawRes) {
      const listingData = rawRes.data.data;
      const resMeta = rawRes.data.meta;
      addSearchListingData(listingData);
      addSearchResultsMeta(resMeta);
    }

    return {
      searchInput,
      doSearch,
      searchIsLoading: searchIsLoading,
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
