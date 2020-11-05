import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const sharetribeStore = createNamespacedHelpers('sharetribe'); // specific module name

export default function useSharetribePublisher() {
  const sharetribePublisherHelpers = SharetribePublisherHelpers();
  const useSharetribePublisherListings = SharetribePublisherListings();
  return {
    useSharetribePublisherListings,
    sharetribePublisherHelpers,
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
    // TODO: This won't work
    return this.$refs.form.formatArgs();
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
