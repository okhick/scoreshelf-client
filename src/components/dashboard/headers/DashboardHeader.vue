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
      <div class="level-item music-profile-toggle">
        <div class="buttons has-addons">
          <button
            id="music"
            :class="['button', 'is-tan', { 'is-inverted': activeDashboardView != 'EditProfile' }]"
          >
            <router-link :to="{ name: 'Purchases' }">Music</router-link>
          </button>
          <button
            id="profile"
            :class="['button', 'is-tan', { 'is-inverted': activeDashboardView === 'EditProfile' }]"
          >
            <router-link :to="{ name: 'EditProfile' }">Profile</router-link>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import useDashboard from '@/compositions/dashboard/dashboard';
import useSharetribe from '@/compositions/sharetribe/sharetribe';

import { CreateDraftResponse, Data } from '@/@types';
import { AxiosResponse } from 'axios';
import { SetupContext } from '@vue/composition-api';

export default {
  props: {
    displayName: String,
  },
  setup(_: Data, context: SetupContext) {
    const { useSharetribeState } = useSharetribe();
    const { SHARETRIBE, currentUser } = useSharetribeState;

    const { useDashboardState } = useDashboard();
    const { togglePublishModal, setPublishModalEditData, activeDashboardView } = useDashboardState;

    async function createNewDraft() {
      if (activeDashboardView.value !== 'Publications') {
        context.root.$router.push({ name: 'Publications' });
      }
      // actually create a temp draft so we can have an uuid
      // we need a uuid up front so save assets
      const draft: AxiosResponse<CreateDraftResponse> = await SHARETRIBE.value.ownListings.createDraft(
        {
          title: `new_draft_${currentUser.value?.id.uuid}`,
        }
      );
      draft.data.data.isBlankDraft = true;
      setPublishModalEditData(draft.data.data);
      togglePublishModal();
    }

    return {
      createNewDraft,
      activeDashboardView,
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
.music-profile-toggle .button {
  border-color: $tan;

  &.is-inverted {
    z-index: 1;
  }

  a {
    color: $black;
    text-decoration: none;
  }
}
</style>
