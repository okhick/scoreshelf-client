import { reactive, toRefs, ref, onMounted, SetupContext } from '@vue/composition-api';
import useScoreshelf from '@/compositions/scoreshelf/scoreshelf';
import useSearch from '@/compositions/search/search';
import useSharetribe from '@/compositions/sharetribe/sharetribe';

import { AxiosResponse } from 'axios';
import { CurrentUser, Listing, ListingQuery } from '@/@types';

// ============================================

interface IListingState {
  listingData: Listing | undefined;
  authorData: CurrentUser | undefined;
  previewBuffer: ArrayBuffer | undefined;
  selectedFormat: string;
  scrollPos: number;
}

const ListingState = reactive<IListingState>({
  listingData: undefined,
  authorData: undefined,
  previewBuffer: undefined,
  selectedFormat: '',
  scrollPos: 0,
});

// ============================================

export default function useListing(listingId: string = '', context: SetupContext) {
  const { SCORESHELF } = useScoreshelf();
  const { searchListingData, searchResultsAuthors } = useSearch(context);
  const { useSharetribeState } = useSharetribe();
  const { SHARETRIBE } = useSharetribeState;

  // ========== Get the listing data ==========
  async function getSearchListing(): Promise<void> {
    const searchListingStore = searchListingData.value.find(
      (listing) => listing.id.uuid === listingId
    );
    // if we're coming from a search page, just load up data from the search store
    if (searchListingStore !== undefined) {
      ListingState.listingData = searchListingStore;
      ListingState.authorData = searchResultsAuthors.value?.find(
        (author) => author.id.uuid === ListingState.listingData?.relationships?.author.data.id.uuid
      );
      // else we need to fetch it.
    } else {
      const listingRes: AxiosResponse<ListingQuery> = await SHARETRIBE.value.listings.show({
        id: listingId,
        include: 'author',
      });
      ListingState.listingData = listingRes.data.data;
      ListingState.authorData = listingRes.data.included[0]; //there should only be one author
    }
    return;
  }

  // TODO: figure out a way to share logic between this and search.
  function stringifyRoles() {
    const displayName = ListingState.authorData?.attributes.profile.displayName;

    if (ListingState.listingData) {
      const replaceDisplayName: (
        | string
        | undefined
      )[] = ListingState.listingData.attributes.publicData.role.map((role) => {
        if (role.name === '__DISPLAY-NAME__') {
          if (ListingState.listingData?.relationships?.author.data.id.uuid) {
            return `<h4 class="role-name is-4">${displayName}</h4> <span class="role-role">(${role.role})</span>`;
          }
          return '';
        }
        return `<h4 class="role-name is-4">${role.name}</h4> <span class="role-role">(${role.role})</span>`;
      });

      return replaceDisplayName;
    } else {
      console.log('ERROR STRINGIFYING ROLES');
      return [''];
    }
  }

  async function getPreviewBuffer(): Promise<void> {
    if (ListingState.listingData && SCORESHELF.value) {
      const previewRes: AxiosResponse<ArrayBuffer> = await SCORESHELF.value.get(
        'assets/getAssetBin',
        {
          params: {
            scoreshelf_id: ListingState.listingData.attributes.publicData.preview.asset_id,
          },
          responseType: 'arraybuffer', //defining the response type is EXTREMELY important here
        }
      );
      const previewBuffer = new Uint8Array(previewRes.data);
      ListingState.previewBuffer = previewBuffer;
    }
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
    stringifyRoles,
  };
}
