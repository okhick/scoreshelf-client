<template>
  <div>
    <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="false"></loading>

    <div class="view-image">
      <img :src="profileImagePreview || '/profile_placeholder.png'" />
    </div>

    <div class="file has-name is-boxed">
      <label class="file-label">
        <input class="file-input" type="file" name="resume" @change="processUploadEvent" />
        <span class="file-cta">
          <span class="file-icon">
            <font-awesome-icon icon="upload" />
          </span>
          <span class="file-label"> Upload Profile Picture </span>
        </span>
        <span v-if="userProfile.profileImage" class="file-name">
          {{ userProfile.profileImage.asset_name }}
        </span>
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api';
import { NewFileUpload, ProfilePicture, UploadedFile } from '@/@types';

import DashboardState from '@/compositions/dashboard/dashboardState';
import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';
import useSharetribe from '@/compositions/sharetribe/sharetribe';
import useScoreshelf from '@/compositions/scoreshelf/scoreshelf';

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faUpload);

export default defineComponent({
  components: {
    FontAwesomeIcon,
    // @ts-ignore don't know why things are weird here
    Loading,
  },
  setup() {
    const { userProfile } = DashboardState();
    const { useScoreshelfProfilePicture } = useScoreshelfPublisher();

    const { useSharetribeState } = useSharetribe();
    const { SHARETRIBE, getCurrentUserId } = useSharetribeState;

    const { THUMBNAIL_BASE_URL } = useScoreshelf();

    const profileImagePreview = ref<string | undefined>();
    const isLoading = ref(false);

    onMounted(() => {
      loadProfilePictureURL();
    });

    async function processUploadEvent(event: Event & NewFileUpload) {
      isLoading.value = true;

      userProfile.value.profilePicture = event.target.files[0] as UploadedFile;
      userProfile.value.profilePicture.isStored = false;
      userProfile.value.profilePicture.asset_name = event.target.files[0].name;

      // upload the picture to scoreshelf
      const newProfilePicture = await useScoreshelfProfilePicture.uploadProfilePicture(
        userProfile.value.profilePicture
      );
      userProfile.value.profilePicture = newProfilePicture?.data;

      // save new picture id
      await SHARETRIBE.value.currentUser.updateProfile({
        publicData: {
          profilePicture: userProfile.value.profilePicture?._id,
        },
      });

      loadProfilePictureURL();
      isLoading.value = false;
    }

    function loadProfilePictureURL() {
      if (userProfile.value.profilePicture) {
        profileImagePreview.value = `${THUMBNAIL_BASE_URL}/${getCurrentUserId()}/${
          userProfile.value.profilePicture?.asset_name
        }`;
      } else {
        profileImagePreview.value = '/profile_placeholder.png';
      }
    }

    return {
      userProfile,
      profileImagePreview,
      processUploadEvent,
      isLoading,
    };
  },
});
</script>

<style lang="scss" scoped>
.view-image {
  display: flex;
  max-width: 252px;
  padding-bottom: 8px;
}
</style>
