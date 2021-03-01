<template>
  <div class="modal" :class="{ 'is-active': publishModalOpen }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Publish Music</p>
      </header>

      <!-- Doing this on v-if stops things from trying to load before the data exists -->
      <publish-form
        v-if="publishModalOpen && formDataLoaded"
        v-bind:isNewPiece="isNewPiece"
        v-bind:pieceStatus="pieceStatus"
        ref="form"
      />

      <footer class="modal-card-foot">
        <div class="level">
          <div class="level-left">
            <button
              :class="[
                'button',
                'level-item',
                { 'is-loading': isLoading.status && isLoading.button === 'update' },
              ]"
              v-if="isNewPiece"
              @click="updatePublication"
            >
              Create Draft
            </button>

            <button
              :class="[
                'button',
                'level-item',
                { 'is-loading': isLoading.status && isLoading.button === 'update' },
              ]"
              v-if="pieceStatus == 'draft'"
              @click="updatePublication"
            >
              Update Draft
            </button>

            <button
              :class="[
                'button',
                'level-item',
                { 'is-loading': isLoading.status && isLoading.button === 'publish' },
              ]"
              v-if="pieceStatus == 'draft'"
              @click="publishDraft"
            >
              Publish Draft
            </button>

            <button
              v-if="pieceStatus == 'published'"
              class="button level-item"
              :class="[
                'button',
                'level-item',
                { 'is-loading': isLoading.status && isLoading.button === 'update' },
              ]"
              @click="updatePublication"
            >
              Update Publication
            </button>

            <button
              v-if="pieceStatus == 'closed'"
              :class="[
                'button',
                'level-item',
                { 'is-loading': isLoading.status && isLoading.button === 'republish' },
              ]"
              @click="republishPublication"
            >
              Re-publish
            </button>

            <button
              :class="[
                'button',
                'level-item',
                'is-tan',
                { 'is-loading': isLoading.status && isLoading.button === 'cancel' },
              ]"
              @click="cancelModal"
            >
              Cancel
            </button>
          </div>
          <!-- End class level-left -->

          <button
            v-if="!isNewPiece"
            :class="[
              'button',
              'level-right',
              'is-maroon',
              { 'is-loading': isLoading.status && isLoading.button === 'delete' },
            ]"
            @click="deletePublication"
          >
            <font-awesome-icon icon="trash-alt" class="action-buttons" />
          </button>
        </div>
        <!-- End class level -->
      </footer>
      <!-- <progress class="progress is-small is-primary" v-show="isLoading" max="100"></progress> -->
    </div>
  </div>
</template>

<script lang="ts">
import PublishForm from './PublishForm.vue';

import { ref, watch } from '@vue/composition-api';

import useDashboard from '@/compositions/dashboard/dashboard';

import useSharetribePublisher from '@/compositions/sharetribe/sharetribePublisher';
import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';
import usePublishForm from '@/compositions/form/publishForm';

import useValidationState from '@/compositions/validation/validationState';
import usePublishFormInfoValidation from '@/compositions/validation/publishFormInfoValidation';
import usePublishFormAssetsValidation from '@/compositions/validation/publishFormAssetsValidation';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrashAlt, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faTrashAlt, faAngleDown);

export default {
  components: {
    FontAwesomeIcon,
    PublishForm,
  },
  setup() {
    const { useDashboardState } = useDashboard();
    const {
      publishModalEditData,
      publishModalOpen,
      togglePublishModal,
      clearPublishModalEditData,
    } = useDashboardState;

    const {
      useSharetribePublisherListings,
      useSharetribePublisherForm,
      useInitSharetribePublishForm,
    } = useSharetribePublisher();
    const { useScoreshelfUploadManagement, useFileStateManagement } = useScoreshelfPublisher();

    const { usePublishFormNavigation } = usePublishForm();
    const { resetPublishFormValidation } = useValidationState();
    const { initInfoValidation } = usePublishFormInfoValidation();
    const { initAssetsValidation } = usePublishFormAssetsValidation();

    const isNewPiece = ref(true);
    const pieceStatus = ref<string | null>(null);
    const formDataLoaded = ref(false);

    watch(publishModalEditData, async (newData) => {
      // if newData.attributes is falsy, we're publishing from a blank
      if (newData != null && newData?.attributes) {
        formDataLoaded.value = false;
        // ---- set some things
        isNewPiece.value = false;
        pieceStatus.value = newData.attributes.state;

        // ---- init the formData
        useInitSharetribePublishForm.initInfo();
        await useFileStateManagement.initAssetData();
        useInitSharetribePublishForm.initFormatData();

        // ---- init validation
        initAllValidation();

        // ---- to go correct step
        usePublishFormNavigation.gotoStep('info');
        formDataLoaded.value = true;
      } else {
        isNewPiece.value = true;

        // ---- init validation
        initAllValidation();

        formDataLoaded.value = true;
      }
    });

    function initAllValidation() {
      initInfoValidation();
      initAssetsValidation();
    }

    // ---------- Modal Control ----------
    const isLoading = ref({ button: '', status: false });

    function setIsLoading(button: string) {
      isLoading.value.status = true;
      isLoading.value.button = button;
    }
    function isNotLoading() {
      isLoading.value.status = false;
      isLoading.value.button = '';
    }

    async function cancelModal() {
      setIsLoading('cancel');

      if (publishModalEditData.value?.isBlankDraft) {
        await useSharetribePublisherListings.deletePublication();
      }

      closeEditModal();
      isNotLoading();
    }

    function closeEditModal() {
      pieceStatus.value = null;
      formDataLoaded.value = false;

      resetPublishFormValidation(); // must come before navigation reset
      clearPublishModalEditData();
      useSharetribePublisherForm.clearFormData();
      useFileStateManagement.resetFileState();
      usePublishFormNavigation.resetCompleted();

      togglePublishModal();
    }

    // ---------- Listing Control ----------
    async function updatePublication() {
      setIsLoading('update');

      await useScoreshelfUploadManagement.submitUpload();
      await useSharetribePublisherListings.updatePublication();

      closeEditModal();
      isNotLoading();
    }

    async function publishDraft() {
      setIsLoading('publish');

      await useScoreshelfUploadManagement.submitUpload();
      await useSharetribePublisherListings.updatePublication();
      await useSharetribePublisherListings.publishDraft();

      closeEditModal();
      isNotLoading();
    }

    async function deletePublication() {
      setIsLoading('delete');

      // TODO: deal with assets?
      await useSharetribePublisherListings.deletePublication();

      closeEditModal();
      isNotLoading();
    }

    async function republishPublication() {
      setIsLoading('republish');

      await useScoreshelfUploadManagement.submitUpload();
      // update just incase anyone's changed anything
      await useSharetribePublisherListings.updatePublication();
      // now we can reopen
      await useSharetribePublisherListings.reopenPublication();

      closeEditModal();
      isNotLoading();
    }

    return {
      // ---- Data ----
      isLoading,
      isNewPiece,
      pieceStatus,
      publishModalOpen,
      formDataLoaded,
      // ---- Methods ----
      // -- Modal Control
      cancelModal,
      closeEditModal,
      // -- Listing Control
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
  height: calc(100vh - 40px);
}
.dropdown {
  margin-right: 8px;
}
footer .level {
  width: 100%;
}
</style>
