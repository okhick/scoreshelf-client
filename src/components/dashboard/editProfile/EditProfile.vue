<template>
  <div>
    <!-- User Profile -->
    <div class="columns">
      <div class="column is-two-thirds">
        <!-- View Mode -->
        <div class="namecard" v-show="!editMode.profile">
          <p>
            <span class="name"> {{ userProfile.firstName }} {{ userProfile.lastName }} </span>
            <span class="display-name">({{ userProfile.displayName }})</span>
          </p>
          <p class="bio" v-html="userProfile.bio"></p>
        </div>

        <!-- Edit Mode -->
        <!-- v-if stops render until all data has loaded, otherwise Trix breaks -->
        <edit-profile-edit v-if="dataHasLoaded" v-show="editMode.profile" />
      </div>
      <div class="column is-one-third">
        <edit-profile-picture v-if="dataHasLoaded" />
      </div>
    </div>

    <!-- Action buttons -->
    <edit-profile-action-buttons
      :isVisible="editMode.profile"
      :isLoading="isLoading.profile"
      editName="Profile"
      @edit-clicked="toggleEditMode('profile')"
      @cancel-clicked="cancelEditMode('profile')"
      @update-clicked="updateProfile"
    />

    <hr class="hr" />
    <!-- Publisher information -->
    <div class="columns">
      <div class="column is-two-thirds">
        <div class="publishercard" v-show="!editMode.publisher">
          <p>
            <span class="name">{{ userProfile.publisher.name }}</span>
          </p>
          <p class="about" v-html="userProfile.publisher.about"></p>
        </div>
        <edit-profile-publisher-edit v-if="dataHasLoaded" v-show="editMode.publisher" />
      </div>
    </div>

    <!-- Action buttons -->
    <edit-profile-action-buttons
      :isVisible="editMode.publisher"
      :isLoading="isLoading.publisher"
      editName="Publisher"
      @edit-clicked="toggleEditMode('publisher')"
      @cancel-clicked="cancelEditMode('publisher')"
      @update-clicked="savePublisher"
    />

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
import useScoreshelf from '@/compositions/scoreshelf/scoreshelf';
import ScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';
import DashboardState from '@/compositions/dashboard/dashboardState';
import useScoreshelfUserPublisher from '@/compositions/scoreshelf/scoreshelfUserPublisher';

import EditProfileEdit from './EditProfileEdit.vue';
import EditProfilePublisherEdit from './EditProfilePublisherEdit.vue';
import EditProfilePicture from './EditProfilePicture.vue';
import EditProfileActionButtons from './EditProfileActionButtions.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onMounted, reactive, ref, toRefs, watchEffect } from '@vue/composition-api';
import { ProfilePicture, UploadedFile, Publisher } from '@/@types';

library.add(faLock);

export default {
  components: {
    FontAwesomeIcon,
    EditProfileEdit,
    EditProfilePublisherEdit,
    EditProfilePicture,
    EditProfileActionButtons,
  },
  setup() {
    const { userProfile } = DashboardState();
    const { useRefreshLogin, useSharetribeState, useUpdateCurrentUser } = useSharetribe();
    const { SHARETRIBE, currentUser } = useSharetribeState;
    const { useScoreshelfProfilePicture } = ScoreshelfPublisher();
    const { hydratePublisher, updatePublisher, addNewPublisher } = useScoreshelfUserPublisher();

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

      await initUserProfile();

      // Trix has issues when renedred before there's data
      dataHasLoaded.value = true;
    });
    async function initUserProfile() {
      userProfile.value.firstName = currentUser.value?.attributes.profile.firstName || '';
      userProfile.value.lastName = currentUser.value?.attributes.profile.lastName || '';
      userProfile.value.displayName = currentUser.value?.attributes.profile.displayName || '';
      userProfile.value.bio = currentUser.value?.attributes.profile.bio || '';
      userProfile.value.email = currentUser.value?.attributes.email || '';
      userProfile.value.profilePicture = hydratedProfilePicture.value;

      userProfile.value.publisher._id = currentUser.value?.attributes.profile.publicData.publisher;

      if (userProfile.value.publisher._id != undefined) {
        const resHydratedPublisher = await hydratePublisher(userProfile.value.publisher._id);
        if (resHydratedPublisher != undefined) {
          userProfile.value.publisher.name = resHydratedPublisher.name;
          userProfile.value.publisher.about = resHydratedPublisher.about;
        }
      }
    }

    // ========== update data ==========
    const isLoading = ref({ profile: false, publisher: false });
    async function updateProfile() {
      isLoading.value.profile = true;

      const res = await SHARETRIBE.value.currentUser.updateProfile({
        firstName: userProfile.value.firstName,
        lastName: userProfile.value.lastName,
        displayName: userProfile.value.displayName,
        bio: userProfile.value.bio,
      });

      await useRefreshLogin();
      await useUpdateCurrentUser();
      toggleEditMode('profile');
      isLoading.value.profile = false;
    }

    async function savePublisher() {
      isLoading.value.publisher = true;

      if (userProfile.value.publisher._id) {
        await updatePublisher();
      } else {
        await addNewPublisher();
      }

      await useRefreshLogin();
      await useUpdateCurrentUser();
      toggleEditMode('publisher');
      isLoading.value.publisher = false;
    }

    // ========== toggle between edit and view modes ==========
    const editMode = ref({ profile: false, publisher: false });
    function toggleEditMode(whichEdit: 'profile' | 'publisher') {
      editMode.value[whichEdit] = !editMode.value[whichEdit];
    }
    function cancelEditMode(whichEdit: 'profile' | 'publisher') {
      initUserProfile();
      toggleEditMode(whichEdit);
    }

    // ==========

    return {
      userProfile,
      editMode,
      isLoading,
      currentUser,
      updateProfile,
      savePublisher,
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

.publishercard {
  span.name {
    font-size: 20px;
    font-weight: 600;
  }
  p.about {
    padding: 12px;
  }
}
</style>
