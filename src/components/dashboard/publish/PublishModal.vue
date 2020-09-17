<template>
  <div class="modal" :class="{ 'is-active': publishModalOpen }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Publish Music</p>
        <button
          class="delete"
          @click="cancelModal"
          aria-label="close"
        ></button>
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
              :class="{ 'is-active': publishDropDown.isActive }"
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
                    <font-awesome-icon
                      icon="angle-down"
                      aria-hidden="true"
                    ></font-awesome-icon>
                  </span>
                </button>
              </div>
              <div class="dropdown-menu" id="dropdown-menu" role="menu">
                <div class="dropdown-content">
                  <a class="dropdown-item" @click="publishDraft">Publish</a>
                  <a
                    class="dropdown-item"
                    v-if="pieceStatus == 'draft'"
                    @click="updatePublication"
                    >Update Draft</a
                  >
                  <a
                    class="dropdown-item"
                    v-if="isNewPiece"
                    @click="updatePublication"
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

          <button
            v-if="!isNewPiece"
            class="button level-right"
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

<script>
import Vue from "vue";
import { mapState, mapMutations } from "vuex";
import { sharetribe } from "@/mixins/sharetribe.js";
import { uploader } from "@/mixins/scoreshelf.js";
import PublishForm from "@/components/forms/PublishForm.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrashAlt, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faTrashAlt);
library.add(faAngleDown);

import vClickOutside from "v-click-outside";
Vue.use(vClickOutside);

export default {
  components: {
    FontAwesomeIcon,
    PublishForm
  },
  mixins: [sharetribe, uploader],
  data: function() {
    return {
      isLoading: false,
      isNewPiece: true,
      pieceStatus: "",
      publishDropDown: {
        isActive: false
      }
    };
  },
  methods: {
    ...mapMutations("dashboard", [
      "togglePublishModal",
      "clearPublishModalEditData",
      "editPublishModalEditData"
    ]),
    // =========================
    // CRUD Functions
    // =========================
    createDraft: async function() {
      this.isLoading = true;
      await this.submitUpload();
      await this.SHARETRIBE.ownListings.createDraft({
        ...this.getFormattedArgs()
      });
      this.closeEditModal();
      this.isLoading = false;
    },
    updatePublication: async function() {
      this.isLoading = true;
      await this.submitUpload();
      await this.SHARETRIBE.ownListings.update({
        id: this.publishModalEditData.id.uuid,
        ...this.getFormattedArgs()
      });
      this.closeEditModal();
      this.isLoading = false;
    },
    publishDraft: async function() {
      this.isLoading = true;
      await this.submitUpload();
      await this.SHARETRIBE.ownListings.update({
        id: this.publishModalEditData.id.uuid,
        ...this.getFormattedArgs()
      });
      await this.SHARETRIBE.ownListings.publishDraft({
        id: this.publishModalEditData.id.uuid
      });
      this.closeEditModal();
      this.isLoading = false;
    },
    deletePublication: async function() {
      this.isLoading = true;
      if (this.publishModalEditData.attributes.state === "draft") {
        await this.SHARETRIBE.ownListings.discardDraft({
          id: this.publishModalEditData.id.uuid
        });
      } else if (this.publishModalEditData.attributes.state === "published") {
        await this.SHARETRIBE.ownListings.close({
          id: this.publishModalEditData.id.uuid
        });
      }
      this.closeEditModal();
      this.isLoading = false;
    },
    republishPublication: async function() {
      this.isLoading = true;
      await this.submitUpload();
      // update just incase anyones changed anything
      await this.SHARETRIBE.ownListings.update({
        id: this.publishModalEditData.id.uuid,
        ...this.getFormattedArgs()
      });
      // now we can reopen
      await this.SHARETRIBE.ownListings.open({
        id: this.publishModalEditData.id.uuid
      });
      this.closeEditModal();
      this.isLoading = false;
    },
    cancelModal: async function() {
      this.isLoading = true;
      if (this.publishModalEditData.isBlankDraft) {
        await this.SHARETRIBE.ownListings.discardDraft({
          id: this.publishModalEditData.id.uuid
        });
      }
      this.closeEditModal();
      this.isLoading = false;
    },
    // =========================
    // Helpers
    // =========================
    closeEditModal: function() {
      this.clearPublishModalEditData();
      this.pieceStatus = "";
      this.$refs.form.clearFormData();
      this.togglePublishModal();
    },
    getFormattedArgs: function() {
      return this.$refs.form.formatArgs();
    },
    togglePublishDropdown: function() {
      this.publishDropDown.isActive = !this.publishDropDown.isActive;
    },
    closePublishDropdown: function() {
      this.publishDropDown.isActive = false;
    },
  },
  computed: {
    ...mapState({
      publishModalOpen: state => state.dashboard.publishModalOpen,
      publishModalEditData: state => state.dashboard.publishModalEditData,
      SHARETRIBE: state => state.sharetribe.SHARETRIBE
    })
  },
  watch: {
    // PublishForm also watches this
    publishModalEditData: async function(newData) {
      // if newData.attributes is falsy, we're publishing from a blank
      if (newData != null && newData.attributes) {
        this.isNewPiece = false;
        this.pieceStatus = newData.attributes.state;
      } else {
        this.isNewPiece = true;
      }
    }
  }
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
