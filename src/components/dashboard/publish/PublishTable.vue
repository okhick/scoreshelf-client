<template>
  <div>
    <div class="level">
      <!-- <h2 class="subtitle is-3 level-left">Published Music</h2> -->
      <button class="button level-right" @click="createNewDraft">Create new draft</button>
    </div>
    <table class="table is-fullwidth is-hoverable">
      <thead>
        <tr>
          <th>TITLE</th>
          <th><!-- Status column --></th>
          <th>FORMATS</th>
          <th>ENSEMBLE</th>
          <th>DATE PUBLISHED</th>
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
                <div class="tags has-addons" v-if="piece.attributes.state == 'draft'">
                  <span class="tag is-dark">Draft</span>
                  <span class="tag is-info"></span>
                </div>
                <div class="tags has-addons" v-if="piece.attributes.state == 'closed'">
                  <span class="tag is-dark">Disabled</span>
                  <span class="tag is-redorange"></span>
                </div>
              </div>
            </div>
          </td>
          <td>{{ formatsAvailable(piece) }}</td>
          <td>
            {{
              piece.attributes.publicData.ensemble
                ? piece.attributes.publicData.ensemble
                : piece.attributes.publicData.instrumentation
            }}
          </td>
          <!-- <td>{{ piece.attributes.state }}</td> -->
          <td>
            {{ piece.attributes.createdAt | moment('MMMM Do YYYY, h:mm a') }}
          </td>
          <td class="hover-pointer">
            <font-awesome-icon icon="edit" class="action-buttons" @click="openEditModal(piece)" />
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
import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';

import { ref, onMounted, watch, computed } from '@vue/composition-api';
import { createNamespacedHelpers } from 'vuex-composition-helpers';
const DashboardStore = createNamespacedHelpers('dashboard');
const SharetribeStore = createNamespacedHelpers('sharetribe');

import Vue from 'vue';
Vue.use(require('vue-moment'));

import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faEdit, faTrashAlt);

export default {
  components: {
    FontAwesomeIcon,
  },
  setup() {
    // |---------- Init Composables ----------|
    const { useScoreshelfAssetManagement, useFileStateManagement } = useScoreshelfPublisher();

    // |---------- Data ----------|
    const publishedMusic = ref(null);
    const reloadTable = ref(0);
    const hasPublishedMusic = computed(() => (publishedMusic !== null ? true : false));

    // I could descructure these if I wanted to, but these feel more self documenting?
    const DashboardState = DashboardStore.useState(['publishModalOpen']);
    const DashboardMutations = DashboardStore.useMutations([
      'togglePublishModal',
      'setPublishModalEditData',
    ]);
    const SharetribeState = SharetribeStore.useState(['SHARETRIBE', 'currentUser']);
    const SHARETRIBE = SharetribeState.SHARETRIBE;

    // |---------- Hooks ----------|
    onMounted(async () => {
      await getPublishedMusic();
    });

    watch(DashboardState.publishModalOpen, async (newModalState) => {
      if (newModalState == false) {
        await getPublishedMusic();
        reloadTable.value += 1;
      }
    });

    // |---------- Methods ----------|
    async function openEditModal(pieceData) {
      DashboardMutations.setPublishModalEditData(pieceData);
      // get init data about the files
      const assetData = pieceData.attributes.privateData.assetData;
      if (assetData && assetData.length > 0) {
        const fileList = assetData;
        const hydratedFileListRes = await useScoreshelfAssetManagement.hyrdateAssetData(
          fileList,
          true
        );

        // store the files
        hydratedFileListRes.data.forEach((file) => {
          file.isStored = true;
          useFileStateManagement.addFileToFileList(file);
        });
      }
      DashboardMutations.togglePublishModal();
    }

    async function createNewDraft() {
      // actually create a temp draft so we can have an uuid
      // we need a uuid up front so save assets
      const draft = await SHARETRIBE.value.ownListings.createDraft({
        title: `new_draft_${currentUser.value.id.uuid}`,
      });
      draft.data.data.isBlankDraft = true;
      DashboardMutations.setPublishModalEditData(draft.data.data);
      DashboardMutations.togglePublishModal();
    }

    async function getPublishedMusic() {
      const publishedMusicRes = await SHARETRIBE.value.ownListings.query({});

      if (publishedMusicRes.data.meta.totalItems > 0) {
        publishedMusic.value = publishedMusicRes.data.data;
        return;
      } else {
        hasPublishedMusic.value = false;
        return;
      }
    }

    function formatsAvailable(piece) {
      if (piece.attributes.publicData.formats) {
        const formatsAvailable = piece.attributes.publicData.formats.map((format) => format.format);
        return formatsAvailable.join(', ');
      }
      return '';
    }

    return {
      // ---- Data ----
      publishedMusic,
      hasPublishedMusic,
      reloadTable,
      // ---- Methods ----
      createNewDraft,
      formatsAvailable,
      openEditModal,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

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
  background-color: $maroon;
}
.hover-pointer:hover {
  cursor: pointer;
}
</style>
