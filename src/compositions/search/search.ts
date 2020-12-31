import VueCompositionAPI, { ref, SetupContext } from '@vue/composition-api';
// @ts-ignore
import useScoreshelf from '@/compositions/scoreshelf/scoreshelf.js';
// @ts-ignore
import useSharetribe from '@/compositions/sharetribe/sharetribe.js';

import { stringify } from 'qs';

// This feels like a bug. Why do I have to call this here when it's already called in main.js?
// Might be fixed in Vue3: https://stackoverflow.com/questions/61885716/uncaught-error-vue-composition-api-must-call-vue-useplugin-before-using-any/61907559#61907559
import Vue from 'vue';
Vue.use(VueCompositionAPI);

// ========== Search State ==========
const searchInput = ref('');
const searchbarIsShowing = ref(true);
const searchIsLoading = ref(false);
const searchListingData = ref([]);
const searchResultsMeta = ref({});

function searchStateManagement() {
  function toggleSearchIsLoading() {
    searchIsLoading.value = !searchIsLoading.value;
  }
  // TODO: Type these payloads
  function addSearchListingData(payload: any) {
    searchListingData.value = payload;
  }
  function addSearchResultsMeta(payload: any) {
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

// ==================================

interface ThumbnailRef {
  index: number;
  thumbnail_id: string;
}

export default function useSearch(context: SetupContext) {
  const { useSharetribeState } = useSharetribe();
  const { SCORESHELF } = useScoreshelf();

  const { SHARETRIBE } = useSharetribeState;
  const useSearchStateManagement = searchStateManagement();

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

  // TODO: actually type this.
  async function hydrateThumbnailData(listingData: any) {
    const thumbnailRefs: ThumbnailRef[] = []; // {index, thumbnail_id}
    const thumbnails: string[] = []; // [thumbnail_id, ...]

    // format the query and make a sorting refrence to match up easier later
    listingData.forEach((listing: any, index: number) => {
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
      paramsSerializer: (params: { scoreshelf_ids: string[] }) => {
        return stringify(params);
      },
    });

    // TODO: type thumbnails
    // update the listing with hydrated data
    thumbnailData.data.forEach((thumbnail: any) => {
      const listingRef = thumbnailRefs.find(
        (thumbnailRef) => thumbnail._id === thumbnailRef.thumbnail_id
      );
      if (listingRef) {
        listingData[listingRef.index].attributes.publicData.thumbnail = thumbnail;
      }
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
