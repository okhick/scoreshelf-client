import VueCompositionAPI, { Ref, ref, SetupContext } from '@vue/composition-api';
import useScoreshelf from '@/compositions/scoreshelf/scoreshelf';
// @ts-ignore
import useSharetribe from '@/compositions/sharetribe/sharetribe';

import { stringify } from 'qs';

import { AxiosResponse } from 'axios';
import { SearchResultsMeta, Listing, ListingSearch, ListingThumbnailHydrated } from '@/@types';

// This feels like a bug. Why do I have to call this here when it's already called in main.js?
// Might be fixed in Vue3: https://stackoverflow.com/questions/61885716/uncaught-error-vue-composition-api-must-call-vue-useplugin-before-using-any/61907559#61907559
import Vue from 'vue';
Vue.use(VueCompositionAPI);

// ========== Search State ==========
const searchInput = ref('');
const searchbarIsShowing = ref(true);
const searchIsLoading = ref(false);
const searchListingData: Ref<Listing[] | []> = ref([]);
const searchResultsMeta: Ref<SearchResultsMeta | {}> = ref({});

function searchStateManagement() {
  // function toggleSearchIsLoading() {
  //   searchIsLoading.value = !searchIsLoading.value;
  // }
  function searchLoadingOn() {
    searchIsLoading.value = true;
  }
  function searchLoadingOff() {
    searchIsLoading.value = false;
  }
  function addSearchListingData(payload: Listing[]) {
    searchListingData.value = payload;
  }
  function addSearchResultsMeta(payload: SearchResultsMeta) {
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
    searchLoadingOn,
    searchLoadingOff,
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
    useSearchStateManagement.searchLoadingOn();

    const res: AxiosResponse<ListingSearch> = await SHARETRIBE.value.listings.query({
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
      useSearchStateManagement.searchLoadingOff();
    });
  }

  async function hydrateThumbnailData(listingData: Listing[]) {
    const thumbnailRefs: ThumbnailRef[] = [];
    const thumbnails: string[] = [];

    // format the query and make a sorting refrence to match up easier later
    listingData.forEach((listing, index: number) => {
      if (
        listing.attributes.publicData.thumbnail &&
        'thumbnail_id' in listing.attributes.publicData.thumbnail
      ) {
        const thumbnail_id = listing.attributes.publicData.thumbnail.thumbnail_id;
        // TODO: make this not be an empty string. Probably be a very rare thing but still annoying...
        if (thumbnail_id != '') {
          thumbnails.push(thumbnail_id);
          thumbnailRefs.push({ index: index, thumbnail_id: thumbnail_id });
        }
      }
    });

    // if there are no thumbnails, just return now.
    if (thumbnails.length === 0) return listingData;

    // hydrate the data
    const thumbnailData = await SCORESHELF.value?.get<ListingThumbnailHydrated[]>(
      'assets/getThumbnailData',
      {
        params: {
          scoreshelf_ids: thumbnails,
        },
        paramsSerializer: (params: { scoreshelf_ids: string[] }) => {
          return stringify(params);
        },
      }
    );

    // update the listing with hydrated data
    if (thumbnailData?.status === 200 && thumbnailData.data) {
      thumbnailData.data.forEach((thumbnail) => {
        const listingRef = thumbnailRefs.find(
          (thumbnailRef) => thumbnail._id === thumbnailRef.thumbnail_id
        );
        if (listingRef) {
          listingData[listingRef.index].attributes.publicData.thumbnail = thumbnail;
        }
      });
    }

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
