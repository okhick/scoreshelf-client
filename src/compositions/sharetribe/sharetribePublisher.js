import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const sharetribeStore = createNamespacedHelpers('sharetribe'); // specific module name

export default function useSharetribePublisher() {
  const sharetribePublisherHelpers = SharetribePublisherHelpers();
  const useSharetribePublisherListings = SharetribePublisherListings();
  return {
    useSharetribePublisherListings,
  };
}

function SharetribePublisherListings() {
  const { SHARETRIBE } = sharetribeStore.useState(['SHARETRIBE']);

  async function createDraft() {
    await SHARETRIBE.value.ownListings.createDraft({
      ...sharetribePublisherHelpers.getFormattedArgs(),
    });

    return;
  }
  return {
    createDraft,
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
}
