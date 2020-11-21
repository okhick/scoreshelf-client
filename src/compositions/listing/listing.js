import { reactive, toRefs } from '@vue/composition-api';
import useScoreshelf from '@/compositions/scoreshelf/scoreshelf';

import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
import store from '@/store/index.js';
const searchStore = createNamespacedHelpers(store, 'search'); // specific module name
const sharetribeStore = createNamespacedHelpers(store, 'sharetribe'); // specific module name

// ============================================

const ListingState = reactive({
  listingData: {},
  previewBuffer: {},
  selectedFormat: '',
});

// ============================================

export default function useListing(listingId) {
  const { SCORESHELF } = useScoreshelf();
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

  async function getPreviewBuffer() {
    const previewRes = await SCORESHELF.value.get('/getAssetBin', {
      params: { scoreshelf_id: ListingState.listingData.attributes.publicData.preview.asset_id },
      responseType: 'arraybuffer', //defining the response type is EXTREMELY important here
    });
    const previewBuffer = new Uint8Array(previewRes.data);
    ListingState.previewBuffer = previewBuffer;
  }

  return {
    ...toRefs(ListingState),
    getSearchListing,
    getPreviewBuffer,
  };
}
