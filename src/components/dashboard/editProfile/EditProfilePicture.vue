<template>
  <div>
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
          {{ userProfile.profileImage.name }}
        </span>
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from '@vue/composition-api';
import { NewFileUpload, UploadedFile } from '@/@types';
import DashboardState from '@/compositions/dashboard/dashboardState';
import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faUpload);

export default {
  components: {
    FontAwesomeIcon,
  },
  setup() {
    const { userProfile } = DashboardState();
    const profileImagePreview = ref<string | ArrayBuffer | undefined>();
    const { useScoreshelfProfilePicture } = useScoreshelfPublisher();

    async function processUploadEvent(event: Event & NewFileUpload) {
      userProfile.value.profilePicture = event.target.files[0] as UploadedFile;
      userProfile.value.profilePicture.isStored = false;
      userProfile.value.profilePicture.asset_name = event.target.files[0].name;

      const newProfilePicture = await useScoreshelfProfilePicture.uploadProfilePicture(
        userProfile.value.profilePicture
      );
      console.log(newProfilePicture);

      const reader = new FileReader();
      reader.onload = (e) => {
        // Read image as base64
        profileImagePreview.value = e.target?.result || undefined;
      };
      // Start the reader job - read file as a data url (base64 format)
      reader.readAsDataURL(userProfile.value.profilePicture);
    }

    return {
      userProfile,
      profileImagePreview,
      processUploadEvent,
    };
  },
};
</script>

<style lang="scss" scoped>
.view-image {
  display: flex;
  max-width: 252px;
  padding-bottom: 8px;
}
</style>