import { reactive, toRefs } from '@vue/composition-api';

import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
import store from '@/store/index.js';
const searchStore = createNamespacedHelpers(store, 'search'); // specific module name
const sharetribeStore = createNamespacedHelpers(store, 'sharetribe'); // specific module name

// ============================================

const ListingState = reactive({
  listingData: {},
});

// ============================================

export default function useListing(listingId) {
  const { SHARETRIBE } = sharetribeStore.useState(['SHARETRIBE']);
  const { searchListingData } = searchStore.useState(['searchListingData']);

  // ========== Get the listing data ==========
  async function getSearchListing() {
    const searchListingStore = searchListingData.value.find(
      (listing) => listing.id.uuid === listingId
    );

    if (searchListingStore !== undefined) {
      ListingState.listingData = searchListingStore;
    } else {
      const listingRes = await SHARETRIBE.value.listings.show({
        id: listingId,
      });
      ListingState.listingData = listingRes.data.data;
    }
    return true;
  }

  return {
    ...toRefs(ListingState),
    getSearchListing,
  };
}
