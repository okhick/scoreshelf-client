<template>
  <div>
    <div class="columns">
      <div class="column is-two-thirds">
        <!-- View Mode -->
        <div class="namecard" v-show="!editMode">
          <p>
            <span class="name"> {{ userProfile.firstName }} {{ userProfile.lastName }} </span>
            <span class="display-name">({{ userProfile.displayName }})</span>
          </p>
          <p class="bio" v-html="userProfile.bio"></p>
        </div>

        <!-- Edit Mode -->
        <!-- v-if stops render until all data has loaded, otherwise Trix breaks -->
        <edit-profile-edit v-if="dataHasLoaded" v-show="editMode" />
      </div>
      <div class="column is-one-third">
        <edit-profile-picture v-if="dataHasLoaded" />
      </div>
    </div>

    <!-- Action buttons -->
    <div class="level">
      <div class="level-left">
        <button class="button level-item" @click="toggleEditMode" v-show="!editMode">Edit</button>

        <button
          class="button level-item"
          :class="{ 'is-loading': isLoading }"
          v-show="editMode"
          @click="updateProfile"
        >
          Update
        </button>
        <button class="button is-tan level-item" @click="cancelEditMode" v-show="editMode">
          Cancel
        </button>
      </div>
    </div>

    <hr class="hr" />

    <!-- TODO: Email change is a different process -->
    <label class="label">Email</label>
    <div class="field has-addons">
      <div class="control">
        <input disabled class="input" type="text" v-model="userProfile.email" />
      </div>
      <div class="control">
        <a class="button">
          <font-awesome-icon icon="lock" v-show="userProfile.email" />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import useSharetribe from '@/compositions/sharetribe/sharetribe';
import ScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';
import DashboardState from '@/compositions/dashboard/dashboardState';

import EditProfileEdit from './EditProfileEdit.vue';
import EditProfilePicture from './EditProfilePicture.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onMounted, reactive, ref, toRefs, watchEffect } from '@vue/composition-api';
import { ProfilePicture, UploadedFile } from '@/@types';
library.add(faLock);

export default {
  components: {
    FontAwesomeIcon,
    EditProfileEdit,
    EditProfilePicture,
  },
  setup() {
    const { userProfile } = DashboardState();
    const { useRefreshLogin, useSharetribeState, useUpdateCurrentUser } = useSharetribe();
    const { SHARETRIBE, currentUser } = useSharetribeState;
    const { useScoreshelfProfilePicture } = ScoreshelfPublisher();

    // ========== Load and init data ==========
    const dataHasLoaded = ref(false);
    const hydratedProfilePicture = ref<ProfilePicture | undefined>();
    onMounted(async () => {
      await useRefreshLogin();
      await useUpdateCurrentUser();

      const resHydratedProfilePicture = await useScoreshelfProfilePicture.hydrateProfilePicture(
        currentUser.value?.attributes.profile.publicData.profilePicture as string
      );
      hydratedProfilePicture.value = resHydratedProfilePicture;

      initUserProfile();

      // Trix has issues when renedred before there's data
      dataHasLoaded.value = true;
    });
    function initUserProfile() {
      userProfile.value.firstName = currentUser.value?.attributes.profile.firstName || '';
      userProfile.value.lastName = currentUser.value?.attributes.profile.lastName || '';
      userProfile.value.displayName = currentUser.value?.attributes.profile.displayName || '';
      userProfile.value.bio = currentUser.value?.attributes.profile.bio || '';
      userProfile.value.email = currentUser.value?.attributes.email || '';
      userProfile.value.profilePicture = hydratedProfilePicture.value;
    }

    // ========== update data ==========
    const isLoading = ref(false);
    async function updateProfile() {
      isLoading.value = true;

      const res = await SHARETRIBE.value.currentUser.updateProfile({
        firstName: userProfile.value.firstName,
        lastName: userProfile.value.lastName,
        displayName: userProfile.value.displayName,
        bio: userProfile.value.bio,
      });

      await useRefreshLogin();
      await useUpdateCurrentUser();
      toggleEditMode();
      isLoading.value = false;
    }

    // ========== toggle between edit and view modes ==========
    const editMode = ref(false);
    function toggleEditMode() {
      editMode.value = !editMode.value;
    }
    function cancelEditMode() {
      initUserProfile();
      toggleEditMode();
    }

    // ==========

    return {
      userProfile,
      editMode,
      isLoading,
      currentUser,
      updateProfile,
      dataHasLoaded,
      toggleEditMode,
      cancelEditMode,
    };
  },
};
</script>

<style lang="scss" scoped>
.namecard {
  span.name {
    font-size: 20px;
    font-weight: 600;
  }
  span.display-name {
    font-size: 16px;
  }
  p.bio {
    padding: 12px;
  }
}
</style>
