<template>
  <div class="modal" :class="{ 'is-active': publishModalOpen }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Modal title</p>
        <button
          class="delete"
          @click="togglePublishModal"
          aria-label="close"
        ></button>
      </header>
      <section class="modal-card-body">
        <input class="input" type="text" v-model="title" placeholder="Title" />
      </section>
      <footer class="modal-card-foot">
        <button
          class="button is-success"
          :class="{ 'is-loading': isLoading }"
          @click="publishDraft"
        >
          Publish Draft
        </button>
        <button class="button" @click="togglePublishModal">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data: function() {
    return {
      title: "",
      isLoading: false
    };
  },
  methods: {
    ...mapMutations("dashboard", ["togglePublishModal"]),
    publishDraft: async function() {
      this.isLoading = true;
      await this.SHARETRIBE.ownListings.createDraft({
        title: this.title
      });
      this.togglePublishModal();
      this.isLoading = false;
    }
  },
  computed: {
    ...mapState({
      publishModalOpen: state => state.dashboard.publishModalOpen,
      SHARETRIBE: state => state.sharetribe.SHARETRIBE
    })
  }
};
</script>
