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
          <th><!-- Status column --></th>
          <th>Formats offered</th>
          <th>Instrumentation</th>
          <th>Date Published</th>
          <th>
            <!-- Edit column -->
          </th>
        </tr>
      </thead>
      <!-- if there is music to be published -->
      <tbody v-if="hasPublishedMusic" :key="reloadTable">
        <tr v-for="piece in publishedMusic" :key="piece.id.uuid">
          <td>{{ piece.attributes.title }}</td>
          <td>
            <div class="field is-grouped">
              <div class="control">
                <div
                  class="tags has-addons"
                  v-if="piece.attributes.state == 'draft'"
                >
                  <span class="tag is-dark">Draft</span>
                  <span class="tag is-info"></span>
                </div>
                <div
                  class="tags has-addons"
                  v-if="piece.attributes.state == 'closed'"
                >
                  <span class="tag is-dark">Disabled</span>
                  <span class="tag is-redorange"></span>
                </div>
              </div>
            </div>
          </td>
          <td>Score, Parts</td>
          <td>Piano, Bass, Drums, Electronics</td>
          <!-- <td>{{ piece.attributes.state }}</td> -->
          <td>
            {{ piece.attributes.createdAt | moment("MMMM Do YYYY, h:mm a") }}
          </td>
          <td>
            <font-awesome-icon
              icon="edit"
              class="action-buttons"
              @click="openEditModal(piece)"
            />
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

import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faEdit);
library.add(faTrashAlt);

export default {
  components: {
    FontAwesomeIcon
  },
  data: function() {
    return {
      hasPublishedMusic: false,
      reloadTable: 0
    };
  },
  methods: {
    ...mapMutations("dashboard", [
      "togglePublishModal",
      "editPublishModalEditData"
    ]),
    openEditModal: function(pieceData) {
      this.editPublishModalEditData(pieceData);
      this.togglePublishModal();
    },
    getPublishedMusic: async function() {
      this.publishedMusicRes = await this.SHARETRIBE.ownListings.query({});

      if (this.publishedMusicRes.data.meta.totalItems > 0) {
        this.hasPublishedMusic = true;
        this.publishedMusic = this.publishedMusicRes.data.data;
      } else {
        this.hasPublishedMusic = false;
      }
    }
  },
  async mounted() {
    this.getPublishedMusic();
  },
  computed: {
    ...mapState({
      SHARETRIBE: state => state.sharetribe.SHARETRIBE,
      currentUser: state => state.sharetribe.currentUser,
      publishModalOpen: state => state.dashboard.publishModalOpen
    })
  },
  watch: {
    publishModalOpen: async function(newModalState) {
      if (newModalState == false) {
        await this.getPublishedMusic();
        this.reloadTable += 1;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";

.subtitle.is-3.level-left {
  margin-bottom: 0;
}
.action-buttons {
  margin: 0 4px 0 4px;
}
.table-title {
  padding-right: 6px;
}
.tag.is-redorange {
  background-color: $redOrange;
}
</style>
