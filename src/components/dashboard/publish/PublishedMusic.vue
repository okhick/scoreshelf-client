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
          <th>Date Published</th>
        </tr>
      </thead>
      <tbody v-if="hasPublishedMusic">
        <tr>
          <td>Extinguish</td>
          <td>Score, Parts</td>
          <td>Piano, Bass, Drums, Electronics</td>
          <td>April 23, 2020</td>
        </tr>
        <tr>
          <td>CO3</td>
          <td>Score</td>
          <td>Piano, Bass, Drums, Electronics</td>
          <td>April 23, 2020</td>
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
import { mapState, mapMutations } from "vuex";

export default {
  data: function() {
    return {
      hasPublishedMusic: false
    };
  },
  methods: {
    ...mapMutations("dashboard", ["togglePublishModal"])
  },
  async mounted() {
    let userUUID = this.currentUser.id.uuid;
    this.publishedMusic = await this.SHARETRIBE.listings.query({
      authorId: userUUID
    });
    this.hasPublishedMusic =
      this.publishedMusic.data.meta.totalItems > 0 ? true : false;
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
