import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';

import { reactive, toRefs } from '@vue/composition-api';
import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const sharetribeStore = createNamespacedHelpers('sharetribe'); // specific module name
const dashboardStore = createNamespacedHelpers('dashboard'); // specific module name

// ============================================================================

const PublishFormState = reactive({
  formData: {
    title: '',
    subtitle: '',
    year: '',
    composer: '',
    ensemble: '',
    instrumentation: '',
  },
});

// ============================================================================

export default function useSharetribePublisher() {
  const useSharetribePublisherListings = SharetribePublisherListings();
  const useSharetribePublisherForm = SharetribePublisherForm();
  const usesharetribePublisherHelpers = SharetribePublisherHelpers();

  return {
    ...toRefs(PublishFormState),
    useSharetribePublisherListings,
    useSharetribePublisherForm,
    usesharetribePublisherHelpers,
  };
}

// ============================================================================
// ============================================================================
// ============================================================================

function SharetribePublisherForm() {
  const { fileList, formats, thumbnailSettings } = useScoreshelfPublisher();

  function clearFormData() {
    for (const field in PublishFormState.formData) {
      PublishFormState.formData[field] = '';
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
    const cleanFormData = { publicData: {} };

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
    return cleanFormData;
  }

  function formatAssetData() {
    const assetData = [];

    fileList.value.forEach(file => {
      const thumbnail_id = thumbnailSettings.value[file.asset_name].isThumbnail
        ? file.thumbnail_settings._id
        : null;
      assetData.push({
        scoreshelf_id: file._id,
        thumbnail_id: thumbnail_id,
      });
    });

    return assetData;
  }

  function formatThumbnailData() {
    if (thumbnailSettings.value == null) {
      // return null;
      // null doesn't affect the string field on sharetribe
      return '';
    } else {
      for (const asset in thumbnailSettings.value) {
        if (thumbnailSettings.value[asset].isThumbnail) {
          const file = fileList.value.find(file => file.asset_name === asset);
          return {
            asset_name: file.thumbnail_settings.asset_name,
          };
        }
      }
      return '';
    }
  }

  function formatFormatData() {
    formats.value.forEach(format => {
      format.assets = format.assets.map(asset => {
        const thisFile = fileList.value.find(file => file.asset_name == asset);
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
  const { SHARETRIBE } = sharetribeStore.useState(['SHARETRIBE']);
  const { publishModalEditData } = dashboardStore.useState(['publishModalEditData']);

  const { getCurrentListingId } = dashboardStore.useGetters(['getCurrentListingId']);

  const useSharetribePublisherForm = SharetribePublisherForm();

  async function createDraft() {
    await SHARETRIBE.value.ownListings.createDraft({
      ...useSharetribePublisherForm.formatArgs(),
    });
    return;
  }

  async function publishDraft() {
    await SHARETRIBE.value.ownListings.publishDraft({
      id: getCurrentListingId.value,
    });
    return;
  }

  async function updatePublication() {
    await SHARETRIBE.value.ownListings.update({
      id: getCurrentListingId.value,
      ...useSharetribePublisherForm.formatArgs(),
    });
    return;
  }

  async function deletePublication() {
    const listingState = publishModalEditData.value.attributes.state;

    switch (listingState) {
      case 'draft':
        await SHARETRIBE.value.ownListings.discardDraft({
          id: getCurrentListingId.value,
        });
        break;

      case 'published':
        await SHARETRIBE.value.ownListings.close({
          id: getCurrentListingId.value,
        });
        break;
    }
    return;
  }

  // for use when opening a publication after "deleting it"
  async function reopenPublication() {
    await SHARETRIBE.value.ownListings.open({
      id: getCurrentListingId.value,
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

  // function getThumbnailSettings() {
  //   // TODO: This won't work
  //   // reach deep to get this. seems icky but works for now...
  //   const assetDataThumbnailSettings = this.$refs.form.$refs.assets.thumbnailSettings;
  //   return this.$refs.form.$refs.assets.thumbnailSettings;
  // }

  return {
    getFormattedArgs,
    // getThumbnailSettings,
  };
}
