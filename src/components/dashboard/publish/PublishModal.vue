<template>
  <div class="modal" :class="{ 'is-active': publishModalOpen }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Publish Music</p>
        <button class="delete" @click="cancelModal" aria-label="close"></button>
      </header>

      <PublishForm
        v-bind:isNewPiece="isNewPiece"
        v-bind:pieceStatus="pieceStatus"
        ref="form"
      ></PublishForm>

      <footer class="modal-card-foot">
        <div class="level">
          <div class="level-left">
            <!-- Dropdown for drafts -->
            <div
              class="dropdown level-item is-up"
              v-if="pieceStatus != 'published' && pieceStatus != 'closed'"
              :class="{ 'is-active': publishDropdownIsActive }"
              @click="togglePublishDropdown"
              v-click-outside="closePublishDropdown"
            >
              <div class="dropdown-trigger">
                <button
                  class="button"
                  :class="{ 'is-loading': isLoading }"
                  aria-haspopup="true"
                  aria-controls="dropdown-menu"
                >
                  <span>Publish</span>
                  <span class="icon is-small">
                    <font-awesome-icon icon="angle-down" aria-hidden="true"></font-awesome-icon>
                  </span>
                </button>
              </div>
              <div class="dropdown-menu" id="dropdown-menu" role="menu">
                <div class="dropdown-content">
                  <a class="dropdown-item" @click="publishDraft">Publish</a>
                  <a class="dropdown-item" v-if="pieceStatus == 'draft'" @click="updatePublication"
                    >Update Draft</a
                  >
                  <a class="dropdown-item" v-if="isNewPiece" @click="updatePublication"
                    >Create Draft</a
                  >
                </div>
              </div>
            </div>

            <button
              v-if="pieceStatus == 'published'"
              class="button level-item"
              :class="{ 'is-loading': isLoading }"
              @click="updatePublication"
            >
              Update
            </button>

            <button
              v-if="pieceStatus == 'closed'"
              class="button level-item"
              :class="{ 'is-loading': isLoading }"
              @click="republishPublication"
            >
              Re-publish
            </button>

            <button class="button level-item" @click="cancelModal">
              Cancel
            </button>
          </div>
          <!-- End class level-left -->

          <button v-if="!isNewPiece" class="button level-right" @click="deletePublication">
            <font-awesome-icon icon="trash-alt" class="action-buttons" />
          </button>
        </div>
        <!-- End class level -->
      </footer>
      <!-- <progress class="progress is-small is-primary" v-show="isLoading" max="100"></progress> -->
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import PublishForm from './forms/PublishForm.vue';

import { ref, watch } from '@vue/composition-api';

import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const dashboardStore = createNamespacedHelpers('dashboard'); // specific module name

import useSharetribePublisher from '@/compositions/sharetribe/sharetribePublisher';
import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrashAlt, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faTrashAlt, faAngleDown);

import vClickOutside from 'v-click-outside';
Vue.use(vClickOutside);

export default {
  components: {
    FontAwesomeIcon,
    PublishForm,
  },
  setup() {
    const isLoading = ref(false);
    const dashboardState = dashboardStore.useState(['publishModalEditData', 'publishModalOpen']);
    const dashboardMutations = dashboardStore.useMutations([
      'togglePublishModal',
      'clearPublishModalEditData',
      'editPublishModalEditData',
    ]);

    const { useSharetribePublisherListings, useSharetribePublisherForm } = useSharetribePublisher();
    const { useScoreshelfUploadManagement } = useScoreshelfPublisher();

    const isNewPiece = ref(true);
    const pieceStatus = ref(null);

    watch(dashboardState.publishModalEditData, async newData => {
      // if newData.attributes is falsy, we're publishing from a blank
      if (newData != null && newData?.attributes) {
        isNewPiece.value = false;
        pieceStatus.value = newData.attributes.state;
      } else {
        isNewPiece.value = true;
      }
    });

    // ---------- Modal Control ----------
    async function cancelModal() {
      isLoading.value = true;

      if (dashboardState.publishModalEditData.value.isBlankDraft) {
        await useSharetribePublisherListings.deletePublication();
      }

      closeEditModal();
      isLoading.value = false;
    }

    function closeEditModal() {
      dashboardMutations.clearPublishModalEditData();
      pieceStatus.value = '';
      // TODO: This won't work
      useSharetribePublisherForm.clearFormData();

      dashboardMutations.togglePublishModal();
    }

    const publishDropdownIsActive = ref(false);

    function togglePublishDropdown() {
      publishDropdownIsActive.value = !publishDropdownIsActive.value;
    }

    function closePublishDropdown() {
      publishDropdownIsActive.value = false;
    }

    // ---------- Listing Control ----------
    async function createDraft() {
      isLoading.value = true;

      const uploadParams = { thumbnailSettings: this.getThumbnailSettings() };
      await useScoreshelfUploadManagement.submitUpload(uploadParams);
      await useSharetribePublisherListings.createDraft();

      closeEditModal();
      isLoading.value = false;
    }

    async function updatePublication() {
      isLoading.value = true;

      const uploadParams = { thumbnailSettings: this.getThumbnailSettings() };
      await useScoreshelfUploadManagement.submitUpload(uploadParams);
      await useSharetribePublisherListings.updatePublication();

      closeEditModal();
      isLoading.value = false;
    }

    async function publishDraft() {
      isLoading.value = true;

      const uploadParams = { thumbnailSettings: this.getThumbnailSettings() };

      await useScoreshelfUploadManagement.submitUpload(uploadParams);
      await useSharetribePublisherListings.updatePublication();
      await useSharetribePublisherListings.publishDraft();

      closeEditModal();
      isLoading.value = false;
    }

    async function deletePublication() {
      isLoading.value = true;

      // TODO: deal with assets?
      await useSharetribePublisherListings.deletePublication();

      closeEditModal();
      isLoading.value = false;
    }

    async function republishPublication() {
      isLoading.value = true;

      const uploadParams = { thumbnailSettings: this.getThumbnailSettings() };
      await useScoreshelfUploadManagement.submitUpload(uploadParams);

      // update just incase anyone's changed anything
      await useSharetribePublisherListings.updatePublication();

      // now we can reopen
      await useSharetribePublisherListings.reopenPublication();

      closeEditModal();
      isLoading.value = false;
    }

    return {
      // ---- Data ----
      isLoading,
      isNewPiece,
      pieceStatus,
      publishDropdownIsActive,
      publishModalOpen: dashboardState.publishModalOpen,
      // ---- Methods ----
      // -- Modal Control
      cancelModal,
      closeEditModal,
      togglePublishDropdown,
      closePublishDropdown,
      // -- Listing Control
      createDraft,
      updatePublication,
      publishDraft,
      deletePublication,
      republishPublication,
    };
  },
};
</script>

<style lang="scss" scoped>
.modal-card {
  overflow: visible;
}
.dropdown {
  margin-right: 8px;
}
footer .level {
  width: 100%;
}
</style>
