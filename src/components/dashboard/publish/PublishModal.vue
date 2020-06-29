<template>
  <div class="modal" :class="{ 'is-active': publishModalOpen }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Modal title</p>
        <button class="delete" @click="closeEditModal" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <input class="input" type="text" v-model="fieldData.title" placeholder="Title" />
      </section>
      <footer class="modal-card-foot">
        <button
          v-if="isNewPiece"
          class="button is-success"
          :class="{ 'is-loading': isLoading.publishDraft }"
          @click="publishDraft"
        >Publish Draft</button>
        <button
          v-if="!isNewPiece"
          class="button is-success"
          :class="{ 'is-loading': isLoading.updateDraft }"
          @click="updateDraft"
        >Update Draft</button>
        <button
          v-if="!isNewPiece"
          class="button"
          :class="{ 'is-loading': isLoading.deleteDraft }"
          @click="deleteDraft"
        >
          <font-awesome-icon icon="trash-alt" class="action-buttons" />
        </button>
        <button class="button" @click="closeEditModal">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faTrashAlt);

export default {
  components: {
    FontAwesomeIcon
  },
  data: function() {
    return {
      fieldData: {
        title: ""
      },
      isLoading: {
        publishDraft: false,
        updateDraft: false,
        deleteDraft: false
      },
      isNewPiece: true
    };
  },
  methods: {
    ...mapMutations("dashboard", [
      "togglePublishModal",
      "clearPublishModalEditData"
    ]),
    publishDraft: async function() {
      this.isLoading.publishDraft = true;
      await this.SHARETRIBE.ownListings.createDraft({
        title: this.fieldData.title
      });
      this.closeEditModal();
      this.isLoading.publishDraft = false;
    },
    updateDraft: async function() {
      this.isLoading.updateDraft = true;
      await this.SHARETRIBE.ownListings.update({
        id: this.publishModalEditData.id.uuid,
        title: this.fieldData.title
      });
      this.closeEditModal();
      this.isLoading.updateDraft = false;
    },
    deleteDraft: async function() {
      this.isLoading.deleteDraft = true;
      await this.SHARETRIBE.ownListings.discardDraft({
        id: this.publishModalEditData.id.uuid
      });
      this.closeEditModal();
      this.isLoading.deleteDraft = false;
    },
    closeEditModal: function() {
      this.togglePublishModal();
      this.clearPublishModalEditData();
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
      if (newData != null) {
        this.isNewPiece = false;
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
