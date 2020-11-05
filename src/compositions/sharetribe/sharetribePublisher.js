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
  const { fileList, formats } = useScoreshelfPublisher();

  function clearFormData() {
    for (const field in PublishFormState.formData) {
      PublishFormState.formData[field] = '';
    }
  }

  function formatArgs() {
    const cleanData = sanitizeFormData();
    return {
      ...cleanData,
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
    return cleanFormData;
  }

  function formatAssetData() {
    const assetData = [];

    fileList.forEach(file => {
      const thisFileData = {
        scoreshelf_id: file._id,
        thumbnail_id: file.thumbnail_id,
      };
      assetData.push(thisFileData);
    });

    return assetData;
  }

  function formatFormatData() {
    formats.forEach(format => {
      format.assets = format.assets.map(asset => {
        const thisFile = fileList.find(file => file.asset_name == asset);
        return thisFile._id;
      });
    });
    return formats;
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

  async function createDraft() {
    await SHARETRIBE.value.ownListings.createDraft({
      ...sharetribePublisherHelpers.getFormattedArgs(),
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
      ...this.getFormattedArgs(),
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
// I don't think ant of this matters...

function SharetribePublisherHelpers() {
  function getFormattedArgs() {
    const useSharetribePublisherForm = SharetribePublisherForm();
    // TODO: This won't work
    return useSharetribePublisherForm.formatArgs();
  }
  function getThumbnailSettings() {
    // TODO: This won't work
    // reach deep to get this. seems icky but works for now...
    const assetDataThumbnailSettings = this.$refs.form.$refs.assets.thumbnailSettings;
    return this.$refs.form.$refs.assets.thumbnailSettings;
  }

  return {
    // getFormattedArgs,
    // getThumbnailSettings,
  };
}
