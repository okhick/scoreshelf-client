import { reactive, toRefs } from '@vue/composition-api';
import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const sharetribeStore = createNamespacedHelpers('sharetribe'); // specific module name

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

export default function useSharetribePublisher() {
  const sharetribePublisherHelpers = SharetribePublisherHelpers();
  const useSharetribePublisherListings = SharetribePublisherListings();
  const useSharetribePublisherForm = SharetribePublisherForm();

  return {
    ...toRefs(PublishFormState),
    useSharetribePublisherListings,
    sharetribePublisherHelpers,
    useSharetribePublisherForm,
  };
}

function SharetribePublisherForm() {
  function clearFormData() {
    for (const field in PublishFormState.formData) {
      PublishFormState.formData[field] = '';
    }
    // TODO: This won't work
    // this.fileList.forEach(file => this.removeFromFileList(file.asset_name));
    // this.$refs.formats.formats = null;

    // this.$refs.assets.thumbnailSettings = {};
    // return true;
  }

  function formatArgs() {
    const cleanData = sanitizeFormData();
    return {
      ...cleanData,
      // privateData: {
      //   assetData: this.formatAssetData(),
      // },
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

    // cleanFormData.publicData.formats = this.formatFormatData();
    return cleanFormData;
  }

  // TODO: THESE WILL NEED TO BE DONE
  // formatAssetData: function() {
  //   const assetData = [];

  //   this.fileList.forEach(file => {
  //     const thisFileData = {
  //       scoreshelf_id: file._id,
  //       thumbnail_id: file.thumbnail_id,
  //     };
  //     assetData.push(thisFileData);
  //   });

  //   return assetData;
  // },
  // formatFormatData: function() {
  //   const formats = this.$refs.formats.formats;
  //   formats.forEach(format => {
  //     format.assets = format.assets.map(asset => {
  //       const thisFile = this.fileList.find(file => file.asset_name == asset);
  //       return thisFile._id;
  //     });
  //   });
  //   return formats;
  // },

  return {
    formatArgs,
    clearFormData,
  };
}

function SharetribePublisherListings() {
  const { SHARETRIBE, publishModalEditData } = sharetribeStore.useState([
    'SHARETRIBE',
    'publishModalEditData',
  ]);

  async function createDraft() {
    await SHARETRIBE.value.ownListings.createDraft({
      ...sharetribePublisherHelpers.getFormattedArgs(),
    });
    return;
  }

  async function publishDraft() {
    await SHARETRIBE.value.ownListings.publishDraft({
      id: publishModalEditData.value.id.uuid,
    });
    return;
  }

  async function updatePublication() {
    await SHARETRIBE.value.ownListings.update({
      id: publishModalEditData.value.id.uuid,
      ...this.getFormattedArgs(),
    });
    return;
  }

  async function deletePublication() {
    const listingState = publishModalEditData.value.attributes.state;

    switch (listingState) {
      case 'draft':
        await SHARETRIBE.value.ownListings.discardDraft({
          id: publishModalEditData.value.id.uuid,
        });
        break;

      case 'published':
        await SHARETRIBE.value.ownListings.close({
          id: publishModalEditData.value.id.uuid,
        });
        break;
    }
    return;
  }

  // for use when opening a publication after "deleting it"
  async function reopenPublication() {
    await SHARETRIBE.value.ownListings.open({
      id: publishModalEditData.value.id.uuid,
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

function SharetribePublisherHelpers() {
  function getFormattedArgs() {
    const useSharetribePublisherForm = SharetribePublisherForm();
    // TODO: This won't work
    return useSharetribePublisherForm.formatArgs();
  }
  function getThumbnailSettings() {
    // TODO: This won't work
    // reach deep to get this. seems icky but works for now...
    const assetsData = this.$refs.form.$refs.assets;
    const assetDataThumbnailSettings = this.$refs.form.$refs.assets.thumbnailSettings;
    return this.$refs.form.$refs.assets.thumbnailSettings;
  }

  return {
    getFormattedArgs,
    getThumbnailSettings,
  };
}
