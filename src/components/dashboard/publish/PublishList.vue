<template>
  <div class="publish-list-wrapper">
    <div class="columns list-headers">
      <div class="column list-header is-4">Title</div>
      <div class="column list-header is-3">Formats</div>
      <div class="column list-header is-2">Ensemble</div>
      <div class="column list-header is-3">Date Published</div>
    </div>
    <!-- The list -->
    <div class="publish-list">
      <div
        :class="[
          'list-item',
          'columns',
          {
            'is-closed no-shadow': piece.attributes.state === 'closed',
            'is-draft no-shadow': piece.attributes.state === 'draft',
          },
        ]"
        v-for="piece in publishedMusic"
        :key="piece.id.uuid"
        @click="openEditModal(piece)"
      >
        <div class="column list-item-data is-4">
          <p class="state" v-if="piece.attributes.state !== 'published'">
            {{ piece.attributes.state }}
          </p>
          <p>{{ piece.attributes.title }}</p>
        </div>
        <div class="column list-item-data is-3">{{ formatsAvailable(piece) }}</div>
        <div class="column list-item-data is-2">
          {{ ensembleOrInstrumentation(piece) }}
        </div>
        <div class="column list-item-data is-3">
          {{ piece.attributes.createdAt | moment('MMMM Do YYYY, h:mm a') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, watch, computed } from '@vue/composition-api';

import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';
import useSharetribe from '@/compositions/sharetribe/sharetribe';
import useDashboard from '@/compositions/dashboard/dashboard';
import { GetOwnListingsResponse, Listing, ListingEditData } from '@/@types';
import { AxiosResponse } from 'axios';

import Vue from 'vue';
Vue.use(require('vue-moment'));

export default {
  setup() {
    // |---------- Init Composables ----------|
    const { useScoreshelfAssetManagement, useFileStateManagement } = useScoreshelfPublisher();

    // |---------- Data ----------|
    const publishedMusic = ref<ListingEditData[] | null>(null);
    const reloadTable = ref(0);
    const hasPublishedMusic = computed(() => (publishedMusic !== null ? true : false));

    const { useDashboardState } = useDashboard();
    const { publishModalOpen, togglePublishModal, setPublishModalEditData } = useDashboardState;
    const { useSharetribeState } = useSharetribe();
    const { SHARETRIBE, currentUser } = useSharetribeState;

    // Load published works
    onMounted(async () => {
      await getPublishedMusic();
    });

    watch(publishModalOpen, async (newModalState) => {
      if (newModalState == false) {
        await getPublishedMusic();
        reloadTable.value += 1;
      }
    });

    async function getPublishedMusic() {
      const publishedMusicRes: AxiosResponse<GetOwnListingsResponse> = await SHARETRIBE.value.ownListings.query(
        {}
      );

      if (publishedMusicRes.data.data.length > 0) {
        publishedMusic.value = publishedMusicRes.data.data;
        return;
      } else {
        return;
      }
    }

    // things for DOM
    function formatsAvailable(piece: Listing) {
      if (piece.attributes.publicData.formats) {
        const formatsAvailable = piece.attributes.publicData.formats.map((format) => format.format);
        return formatsAvailable.join(', ');
      }
      return '';
    }

    function ensembleOrInstrumentation(piece: Listing) {
      const publicData = piece.attributes.publicData;
      if (publicData.ensemble) {
        return publicData.ensemble;
      } else if (publicData.instrumentation) {
        return publicData.instrumentation.join(', ');
      }
    }

    async function openEditModal(pieceData: ListingEditData) {
      setPublishModalEditData(pieceData);
      togglePublishModal();
    }

    return {
      // ---- Data ----
      publishedMusic,
      hasPublishedMusic,
      reloadTable,
      // ---- Functions ----
      formatsAvailable,
      ensembleOrInstrumentation,
      openEditModal,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.list-headers .column.list-header {
  text-transform: uppercase;
  font-weight: 600;
  font-size: 18px;
}

.publish-list .list-item {
  box-shadow: 0px 0.5px 8px 0px rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  min-height: 65px;
  margin-bottom: 24px;
  transition: all 0.1s ease-in-out;

  &:hover {
    box-shadow: 0px 0.5px 16px 0px rgba(0, 0, 0, 0.6);
    cursor: pointer;
  }

  .list-item-data {
    align-self: center;

    .state {
      text-transform: uppercase;
      font-size: 11px;
      font-weight: 500;
    }
  }
}

.is-draft {
  background-color: $tan;
}
.is-closed {
  background-color: $black-light;
}
// use !important because we're overriding on the same level from other styles
.no-shadow {
  box-shadow: none !important;
  transition: none !important;

  &:hover {
    // use box-shadow for outline so it's a 0 width outline
    box-shadow: 0px 0px 0px 1px $black !important;
  }
}
</style>
