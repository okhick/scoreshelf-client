import VueCompositionAPI, { ref } from '@vue/composition-api';
import useScoreshelf from '@/compositions/scoreshelf/scoreshelf.js';

import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const sharetribeStore = createNamespacedHelpers('sharetribe'); // specific module name

import { stringify } from 'qs';

// This feels like a bug. Why do I have to call this here when it's already called in main.js?
// Might be fixed in Vue3: https://stackoverflow.com/questions/61885716/uncaught-error-vue-composition-api-must-call-vue-useplugin-before-using-any/61907559#61907559
import Vue from 'vue';
Vue.use(VueCompositionAPI);

// ========== Search State ==========
// TODO: Migrate Vuex to here...
const searchInput = ref('');
const searchbarIsShowing = ref(true);
const searchIsLoading = ref(false);
const searchListingData = ref([]);
const searchResultsMeta = ref({});

// ==================================

export default function useSearch(context) {
  const { SCORESHELF } = useScoreshelf();
  const useSearchStateManagement = searchStateManagement();

  //---------- vuex state mapping ----------
  const { SHARETRIBE } = sharetribeStore.useState(['SHARETRIBE']);

  //---------- methods ----------
  async function executeSearch() {
    useSearchStateManagement.toggleSearchIsLoading();

    const res = await SHARETRIBE.value.listings.query({
      keywords: searchInput.value,
    });
    context.root.$router.push({
      name: 'Search',
      params: { query: encodeURIComponent(searchInput.value) },
    });

    const listingData = res.data.data;
    const hydratedThumbnailListingData = await hydrateThumbnailData(listingData);

    useSearchStateManagement.addSearchListingData(hydratedThumbnailListingData);
    useSearchStateManagement.addSearchResultsMeta(res.data.meta);

    // wait until the dom has reloaded to turn the toggle off
    context.root.$nextTick(() => {
      useSearchStateManagement.toggleSearchIsLoading();
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

    // if there are no thumbnails, just return now.
    if (thumbnails.length === 0) return listingData;

    // hydrate the data
    const thumbnailData = await SCORESHELF.value.get('getThumbnailData', {
      params: {
        scoreshelf_ids: thumbnails,
      },
      paramsSerializer: (params) => {
        return stringify(params);
      },
    });

    // update the listing with hydrated data
    thumbnailData.data.forEach((thumbnail) => {
      const listingRef = thumbnailRefs.find(
        (thumbnailRef) => thumbnail._id === thumbnailRef.thumbnail_id
      );
      listingData[listingRef.index].attributes.publicData.thumbnail = thumbnail;
    });

    return listingData;
  }

  return {
    // ---- data ----
    searchInput,
    searchbarIsShowing,
    searchIsLoading,
    searchListingData,
    searchResultsMeta,
    // ---- functions ----
    executeSearch,
    useSearchStateManagement,
  };
}

function searchStateManagement() {
  function toggleSearchIsLoading() {
    searchIsLoading.value = !searchIsLoading.value;
  }
  function addSearchListingData(payload) {
    searchListingData.value = payload;
  }
  function addSearchResultsMeta(payload) {
    searchResultsMeta.value = payload;
  }
  function toggleSearchbarIsShowing() {
    searchbarIsShowing.value = !searchbarIsShowing.value;
  }
  function hideSearchbar() {
    searchbarIsShowing.value = false;
  }
  function resetSearchStore() {
    searchListingData.value = [];
    searchResultsMeta.value = {};
  }

  return {
    toggleSearchIsLoading,
    addSearchListingData,
    addSearchResultsMeta,
    toggleSearchbarIsShowing,
    hideSearchbar,
    resetSearchStore,
  };
}
