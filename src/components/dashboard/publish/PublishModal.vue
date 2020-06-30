<template>
  <div class="modal" :class="{ 'is-active': publishModalOpen }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          {{ (fieldData.title != '') ? fieldData.title : "Publish Music" }}
        </p>
        <button class="delete" @click="closeEditModal" aria-label="close"></button>
      </header>

      <section class="modal-card-body">
        <label class="label">Title</label>
        <input class="input" type="text" v-model="fieldData.title" placeholder="Title" />
      </section>

      <footer class="modal-card-foot">
        <div class="level">
          <div class="level-left">
            <!-- Dropdown for drafts -->
            <div
              class="dropdown level-item"
              v-if="pieceStatus != 'published' && pieceStatus != 'closed'"
              :class="{ 'is-active': publishDropDown.isActive }"
              @click="togglePublishDropdown"
              v-click-outside="closePublishDropdown"
            >
              <div class="dropdown-trigger">
                <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                  <span>Publish</span>
                  <span class="icon is-small">
                    <font-awesome-icon icon="angle-down" aria-hidden="true"></font-awesome-icon>
                  </span>
                </button>
              </div>
              <div class="dropdown-menu" id="dropdown-menu" role="menu">
                <div class="dropdown-content">
                  <a class="dropdown-item" @click="publishDraft">Publish</a>
                  <a
                    class="dropdown-item"
                    v-if="pieceStatus=='draft'"
                    @click="updatePublication"
                  >Update Draft</a>
                  <a class="dropdown-item" v-if="isNewPiece" @click="createDraft">Create Draft</a>
                </div>
              </div>
            </div>

            <button
              v-if="pieceStatus=='published'"
              class="button level-item"
              @click="updatePublication"
            >Update</button>

            <button
              v-if="pieceStatus=='closed'"
              class="button level-item"
              @click="republishPublication"
            >Re-publish</button>

            <button class="button level-item" @click="closeEditModal">Cancel</button>
          </div> <!-- End class level-left -->

          <button v-if="!isNewPiece" class="button level-right" @click="deletePublication">
            <font-awesome-icon icon="trash-alt" class="action-buttons" />
          </button>

        </div> <!-- End class level -->
      </footer>
      <!-- <progress class="progress is-small is-primary" v-show="isLoading" max="100"></progress> -->
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapMutations } from "vuex";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrashAlt, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faTrashAlt);
library.add(faAngleDown);

import vClickOutside from "v-click-outside";
Vue.use(vClickOutside);

export default {
  components: {
    FontAwesomeIcon
  },
  data: function() {
    return {
      fieldData: {
        title: ""
      },
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
    createDraft: async function() {
      this.isLoading = true;
      await this.SHARETRIBE.ownListings.createDraft({
        title: this.fieldData.title
      });
      this.closeEditModal();
      this.isLoading = false;
    },
    updatePublication: async function() {
      this.isLoading = true;
      await this.SHARETRIBE.ownListings.update({
        id: this.publishModalEditData.id.uuid,
        title: this.fieldData.title
      });
      this.closeEditModal();
      this.isLoading = false;
    },
    publishDraft: async function() {
      this.isLoading = true;
      // if it's a new piece we first need to create a draft
      if (this.isNewPiece) {
        let draft = await this.SHARETRIBE.ownListings.createDraft({
          title: this.fieldData.title
        });
        this.editPublishModalEditData(draft.data.data);
      }
      // publish it
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
      await this.SHARETRIBE.ownListings.update({
        id: this.publishModalEditData.id.uuid,
        title: this.fieldData.title
      });
      await this.SHARETRIBE.ownListings.open({
        id: this.publishModalEditData.id.uuid
      });
      this.closeEditModal();
      this.isLoading = false;
    },
    closeEditModal: function() {
      this.togglePublishModal();
      this.clearPublishModalEditData();
      this.pieceStatus = "";
      for (const field in this.fieldData) {
        this.fieldData[field] = "";
      }
    },
    togglePublishDropdown: function() {
      this.publishDropDown.isActive = !this.publishDropDown.isActive;
    },
    closePublishDropdown: function() {
      this.publishDropDown.isActive = false;
    }
  },
  computed: {
    ...mapState({
      publishModalOpen: state => state.dashboard.publishModalOpen,
      publishModalEditData: state => state.dashboard.publishModalEditData,
      SHARETRIBE: state => state.sharetribe.SHARETRIBE
    })
  },
  watch: {
    publishModalEditData: function(newData) {
      // if newData.attributes is falsy, we're publishing from a blank
      if (newData != null && newData.attributes) {
        this.isNewPiece = false;
        this.pieceStatus = newData.attributes.state;
        this.fieldData.title = newData.attributes.title;
      } else {
        this.isNewPiece = true;
        for (const field in this.fieldData) {
          this.fieldData[field] = "";
        }
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