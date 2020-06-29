<template>
  <div>
    <div class="level">
      <h2 class="subtitle is-3 level-left">Published Music</h2>
      <button class="button level-right" @click="togglePublishModal">
        Publish music
      </button>
    </div>
    <table class="table is-fullwidth is-hoverable">
      <thead>
        <tr>
          <th>Title</th>
          <th>Formats offered</th>
          <th>Instrumentation</th>
          <th>Status</th>
          <th>Date Published</th>
        </tr>
      </thead>
      <tbody v-if="hasPublishedMusic">
        <tr v-for="piece in publishedMusic" :key="piece.id.uuid">
          <td>{{ piece.attributes.title }}</td>
          <td>Score, Parts</td>
          <td>Piano, Bass, Drums, Electronics</td>
          <td>{{ piece.attributes.state }}</td>
          <td>
            {{ piece.attributes.createdAt | moment("MMMM Do YYYY, h:mm a") }}
          </td>
        </tr>
      </tbody>
    </table>
    <!-- If there user has no music -->
    <div v-if="!hasPublishedMusic" class="notification is-danger is-light">
      You have no published music!
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapMutations } from "vuex";

Vue.use(require("vue-moment"));

export default {
  data: function() {
    return {
      hasPublishedMusic: false
    };
  },
  methods: {
    ...mapMutations("dashboard", ["togglePublishModal"]),
    formatDate(date) {
      console.log(date);
    }
  },
  async mounted() {
    // let userUUID = this.currentUser.id.uuid;
    this.publishedMusicRes = await this.SHARETRIBE.ownListings.query({
      // authorId: userUUID
    });

    if (this.publishedMusicRes.data.meta.totalItems > 0) {
      this.hasPublishedMusic = true;
      this.publishedMusic = this.publishedMusicRes.data.data;
    } else {
      this.hasPublishedMusic = false;
    }
  },
  computed: {
    ...mapState({
      SHARETRIBE: state => state.sharetribe.SHARETRIBE,
      currentUser: state => state.sharetribe.currentUser
    })
  }
};
</script>

<style lang="scss" scoped>
.subtitle.is-3.level-left {
  margin-bottom: 0;
}
</style>
