import { reactive, toRefs, ref, onMounted, SetupContext } from '@vue/composition-api';
// @ts-ignore
import useScoreshelf from '@/compositions/scoreshelf/scoreshelf';
import useSearch from '@/compositions/search/search';
// @ts-ignore
import useSharetribe from '@/compositions/sharetribe/sharetribe';

// ============================================

const ListingState = reactive({
  listingData: {},
  previewBuffer: {},
  selectedFormat: '',
  scrollPos: 0,
});

// ============================================

export default function useListing(listingId: string, context: SetupContext) {
  const { SCORESHELF } = useScoreshelf();
  const { searchListingData } = useSearch(context);
  const { useSharetribeState } = useSharetribe();
  const { SHARETRIBE } = useSharetribeState;

  // ========== Get the listing data ==========
  async function getSearchListing(): Promise<void> {
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
    return;
  }

  async function getPreviewBuffer(): Promise<void> {
    const previewRes = await SCORESHELF.value.get('/getAssetBin', {
      // @ts-ignore
      params: { scoreshelf_id: ListingState.listingData.attributes.publicData.preview.asset_id },
      responseType: 'arraybuffer', //defining the response type is EXTREMELY important here
    });
    const previewBuffer = new Uint8Array(previewRes.data);
    ListingState.previewBuffer = previewBuffer;
    return;
  }

  // ========== Add listener get get scroll pos ==========
  onMounted(() => {
    ListingState.scrollPos = window.pageYOffset;
    window.addEventListener(
      'scroll',
      (event) => {
        ListingState.scrollPos = window.pageYOffset;
      },
      false
    );
  });

  return {
    ...toRefs(ListingState),
    getSearchListing,
    getPreviewBuffer,
  };
}
