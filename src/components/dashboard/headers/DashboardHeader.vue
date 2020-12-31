<template>
  <div class="level header">
    <div class="level-left">
      <span class="level-item title no-bold">
        Hi,
        <h1 class="title">{{ '\xa0' + displayName }}</h1>
      </span>
      <div class="level-item">
        <button class="button is-maroon" @click="createNewDraft">Publish new music</button>
      </div>
    </div>
    <div class="level-right">
      <div class="level-item">
        <h2><router-link to="edit-profile">Edit Profile</router-link></h2>
      </div>
      <div class="level-item">
        <h2><a>Settings</a></h2>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex-composition-helpers';
const SharetribeStore = createNamespacedHelpers('sharetribe');
const DashboardStore = createNamespacedHelpers('dashboard');

export default {
  props: {
    displayName: String,
  },
  setup(_, context) {
    const { SHARETRIBE, currentUser } = SharetribeStore.useState(['SHARETRIBE', 'currentUser']);
    const DashboardMutations = DashboardStore.useMutations([
      'togglePublishModal',
      'setPublishModalEditData',
    ]);
    const { activeDashboardView } = DashboardStore.useState(['activeDashboardView']);

    async function createNewDraft() {
      if (activeDashboardView.value !== 'Publications') {
        context.root.$router.push({ name: 'Publications' });
      }
      // actually create a temp draft so we can have an uuid
      // we need a uuid up front so save assets
      const draft = await SHARETRIBE.value.ownListings.createDraft({
        title: `new_draft_${currentUser.value.id.uuid}`,
      });
      draft.data.data.isBlankDraft = true;
      DashboardMutations.setPublishModalEditData(draft.data.data);
      DashboardMutations.togglePublishModal();
    }

    return {
      createNewDraft,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.level.header:not(:last-child) {
  margin-bottom: 48px;
}

.level-item.title.no-bold {
  font-weight: 400;
  font-family: $family-secondary;
  margin-bottom: 0px;
}
h2 {
  // font-weight: 600;
  padding: 12px;
  font-family: $family-primary;
}
</style>