import { reactive, toRefs } from '@vue/composition-api';
import { Data, ListingAttributes, ListingAssetData, Asset, ListingFormat } from '@/@types';

import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';
import useDashboard from '@/compositions/dashboard/dashboard';
import useSharetribe from '@/compositions/sharetribe/sharetribe';

// ============================================================================

interface FormData extends Data {
  title: string;
  subtitle: string;
  composer: string;
  year: string;
  duration: string;
  commission: string;
  otherNotes: string;
  ensemble: string;
  instrumentation: string[];
}
interface IPublishFormState {
  formData: FormData;
}

const PublishFormState = reactive<IPublishFormState>({
  formData: {
    title: '',
    subtitle: '',
    composer: '',
    year: '',
    duration: '',
    commission: '',
    otherNotes: '',
    ensemble: '',
    instrumentation: [],
  },
});

// ============================================================================

export default function useSharetribePublisher() {
  const useSharetribePublisherListings = SharetribePublisherListings();
  const useSharetribePublisherForm = SharetribePublisherForm();
  const useSharetribePublisherHelpers = SharetribePublisherHelpers();

  return {
    ...toRefs(PublishFormState),
    useSharetribePublisherListings,
    useSharetribePublisherForm,
    useSharetribePublisherHelpers,
  };
}

// ============================================================================
// ============================================================================
// ============================================================================

function SharetribePublisherForm() {
  const { fileList, formats, thumbnailSettings, previewSettings } = useScoreshelfPublisher();

  function clearFormData() {
    for (const field in PublishFormState.formData) {
      switch (field) {
        case 'instrumentation':
          PublishFormState.formData[field] = [];
          break;
        default:
          PublishFormState.formData[field] = '';
          break;
      }
    }
  }

  function formatArgs() {
    return {
      ...sanitizeFormData(),
      privateData: {
        assetData: formatAssetData(),
      },
    };
  }

  function sanitizeFormData() {
    const cleanFormData = { publicData: {} } as ListingAttributes;

    for (const field in PublishFormState.formData) {
      if (PublishFormState.formData[field] !== void 0) {
        switch (field) {
          case 'title':
            cleanFormData.title = PublishFormState.formData.title;
            break;
          default:
            cleanFormData.publicData[field] = PublishFormState.formData[field];
        }
      }
    }

    cleanFormData.publicData.formats = formatFormatData();
    cleanFormData.publicData.thumbnail = formatThumbnailData();
    cleanFormData.publicData.preview = formatPreviewData();
    return cleanFormData;
  }

  function formatAssetData(): ListingAssetData[] {
    const assetData: ListingAssetData[] = [];

    fileList.value.forEach((file) => {
      if ('_id' in file) {
        const thumbnail_id = thumbnailSettings.value[file.asset_name].isThumbnail
          ? file.thumbnail_settings?._id
          : null;

        assetData.push({
          scoreshelf_id: file._id,
          thumbnail_id: thumbnail_id,
        });
      } else {
        // TODO: this should throw error. No good here.
        assetData.push({
          scoreshelf_id: null,
          thumbnail_id: null,
        });
      }
    });

    return assetData;
  }

  function formatThumbnailData() {
    if (thumbnailSettings.value == null) {
      return { thumbnail_id: '' };
    } else {
      for (const asset in thumbnailSettings.value) {
        if (thumbnailSettings.value[asset].isThumbnail) {
          const file = <Asset>fileList.value.find((file) => file.asset_name === asset);
          return {
            thumbnail_id: file.thumbnail_settings ? file.thumbnail_settings._id : '',
          };
        }
      }
      return { thumbnail_id: '' };
    }
  }

  function formatPreviewData() {
    if (previewSettings.value == null) {
      return { asset_id: '' };
    } else {
      for (const asset in previewSettings.value) {
        if (previewSettings.value[asset].isPreview) {
          const file = <Asset>fileList.value.find((file) => file.asset_name === asset);
          return {
            asset_id: file._id,
          };
        }
      }
    }
    return { asset_id: '' };
  }

  function formatFormatData() {
    formats.value.forEach((format) => {
      format.assets = format.assets.map((asset) => {
        const thisFile = <Asset>fileList.value.find((file) => file.asset_name == asset);
        return thisFile._id;
      });
    });
    return formats.value;
  }

  return {
    formatArgs,
    clearFormData,
  };
}

// ============================================================================
// ============================================================================
// ============================================================================

function SharetribePublisherListings() {
  const { useSharetribeState } = useSharetribe();
  const { SHARETRIBE } = useSharetribeState;

  const { useDashboardState } = useDashboard();
  const { publishModalEditData, getCurrentListingId } = useDashboardState;

  const useSharetribePublisherForm = SharetribePublisherForm();

  async function createDraft() {
    await SHARETRIBE.value.ownListings.createDraft({
      ...useSharetribePublisherForm.formatArgs(),
    });
    return;
  }

  async function publishDraft() {
    await SHARETRIBE.value.ownListings.publishDraft({
      id: getCurrentListingId(),
    });
    return;
  }

  async function updatePublication() {
    await SHARETRIBE.value.ownListings.update({
      id: getCurrentListingId(),
      ...useSharetribePublisherForm.formatArgs(),
    });
    return;
  }

  async function deletePublication() {
    const listingState = publishModalEditData.value?.isBlankDraft
      ? 'draft'
      : publishModalEditData.value?.attributes.state;

    switch (listingState) {
      case 'draft':
        await SHARETRIBE.value.ownListings.discardDraft({
          id: getCurrentListingId(),
        });
        break;

      case 'published':
        await SHARETRIBE.value.ownListings.close({
          id: getCurrentListingId(),
        });
        break;
    }
    return;
  }

  // for use when opening a publication after "deleting it"
  async function reopenPublication() {
    await SHARETRIBE.value.ownListings.open({
      id: getCurrentListingId,
    });

    return;
  }

  return {
    createDraft,
    publishDraft,
    updatePublication,
    deletePublication,
    reopenPublication,
  };
}

// ============================================================================
// ============================================================================
// ============================================================================

function SharetribePublisherHelpers() {
  function getFormattedArgs() {
    const useSharetribePublisherForm = SharetribePublisherForm();
    return useSharetribePublisherForm.formatArgs();
  }

  function getBlankFormat(): ListingFormat {
    return { formatId: generateFormatId(), format: '', price: '', assets: [] };
  }

  function generateFormatId() {
    return Date.now();
  }

  // function getThumbnailSettings() {
  //   // TODO: This won't work
  //   // reach deep to get this. seems icky but works for now...
  //   const assetDataThumbnailSettings = this.$refs.form.$refs.assets.thumbnailSettings;
  //   return this.$refs.form.$refs.assets.thumbnailSettings;
  // }

  return {
    getFormattedArgs,
    getBlankFormat,
    // getThumbnailSettings,
  };
}
