<template>
  <div class="container">
    <div class="header-container">
      <div class="format-header"><span class="column-header">Format</span></div>
      <div class="files-header"><span class="column-header">Files</span></div>
      <div class="price-header"><span class="column-header">Price</span></div>
      <div class="clear-header"></div>
    </div>

    <div class="format-container" v-for="format in formats" :key="format.formatId">
      <publish-form-format-edit
        ref="formatTemplateRef"
        :initFormat="format"
        v-if="showEditMode === format.formatId"
      />
      <div
        class="format-data"
        @click="showEditMode = format.formatId"
        v-show="!(showEditMode === format.formatId)"
      >
        <div class="format-name format-cell">{{ format.format }}</div>
        <div class="format-assets format-cell">{{ stringifyAssets(format.assets) }}</div>
        <div class="format-price format-cell">${{ format.price }}</div>
      </div>
      <div
        class="action"
        @click="removeFormat(format.formatId)"
        v-show="!(showEditMode === format.formatId)"
      >
        <font-awesome-icon icon="times" />
      </div>
      <div
        class="action ok"
        @click="updateFormat(format.formatId)"
        v-show="showEditMode === format.formatId"
      >
        OK
      </div>
    </div>

    <hr />

    <publish-form-format-edit :initFormat="newFormat" />
  </div>
</template>

<script lang="ts">
import { ref, watch, computed, onMounted } from '@vue/composition-api';
import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';
import useSharetribePublisher from '@/compositions/sharetribe/sharetribePublisher';
import useDashboard from '@/compositions/dashboard/dashboard';

import { ListingFormat, Asset, GenericAsset, ChooseEvent, UploadedFile } from '@/@types';

import PublishFormFormatEdit from './PublishFormFormatEdit.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faPlus, faTimes);

export default {
  components: {
    FontAwesomeIcon,
    PublishFormFormatEdit,
  },
  setup() {
    const { formats, fileList } = useScoreshelfPublisher();
    const { useDashboardState } = useDashboard();
    const { publishModalEditData } = useDashboardState;
    const { useSharetribePublisherHelpers } = useSharetribePublisher();

    const newFormat = ref<ListingFormat>(useSharetribePublisherHelpers.getBlankFormat());
    initFormatData();

    // ---------- Methods ----------
    function initFormatData() {
      if (publishModalEditData.value?.attributes?.publicData?.formats) {
        // if we've opened an existing work
        formats.value = publishModalEditData.value.attributes.publicData.formats;
        lookupFormatAssets();
      } else {
        // if it's a new work
        formats.value = [newFormat.value];
      }
    }

    // swap out scoreshelf_ids for asset_names
    function lookupFormatAssets() {
      formats.value.forEach((format) => {
        const assetNames = format.assets.map((assetId) => {
          const asset = fileList.value.find((file) => '_id' in file && file._id === assetId);
          return asset?.asset_name || '';
        });
        format.assets = assetNames;
      });
    }

    function removeFormat(formatId: number) {
      if (formats.value.length > 1) {
        const remainingFormats = formats.value.filter((format) => format.formatId !== formatId);
        formats.value = remainingFormats;
      } else {
        formats.value = [useSharetribePublisherHelpers.getBlankFormat()];
      }
    }

    const showEditMode = ref<string>();
    const formatTemplateRef = ref();
    function updateFormat(formatId: number) {
      const formatIndex = formats.value.findIndex((format) => format.formatId === formatId);
      formatTemplateRef.value[0].submitFormat();
      showEditMode.value = '';
    }

    // ---------- Helper Methods ----------

    function stringifyAssets(assets: string[]) {
      return assets.join(', ');
    }

    // ---------- Watchers ----------

    watch(fileList, (newData) => {
      if (formats.value != null) {
        // first swapout the asset ids for the asset name, don't do anything if there's not match
        // this is used on modal open
        formats.value.forEach((format) => {
          format.assets = format.assets.map((asset) => {
            const thisFile = fileList.value.find((file) => '_id' in file && file._id === asset);
            if (thisFile != undefined) {
              return thisFile.asset_name;
            }
            return asset;
          });
        });
        // loop through the formats' assets and filter out anything that's not there
        // this is used when you delete an asset file
        const newFileList = newData.map((file) => file.asset_name);
        formats.value.forEach((format) => {
          format.assets = format.assets.filter((asset) => !(newFileList.indexOf(asset) == -1));
        });
      }
    });

    return {
      // ---- Data ----
      formats,
      fileList,
      newFormat,
      showEditMode,
      formatTemplateRef,
      // ---- Methods ----
      removeFormat,
      stringifyAssets,
      updateFormat,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.container {
  margin-bottom: 25px;
}
.header-container {
  display: grid;
  grid-template-columns: 2fr 3fr 1fr 2.25%;
  padding-bottom: 8px;

  .column-header {
    text-transform: uppercase;
    font-weight: 600;
    font-size: 18px;
  }

  .format-header {
    grid-column: 1;
  }
  .files-header {
    grid-column: 2;
  }
  .price-header {
    grid-column: 3;
  }
  .clear-header {
    grid-column: 4;
  }
}

.format-container {
  display: grid;
  grid-template-columns: auto 5.5%;
  margin-bottom: 12px;

  .format-data {
    display: grid;
    grid-template-columns: 2fr 3fr 1fr;
    grid-column: 1;
    align-items: center;
    cursor: pointer;

    box-shadow: 0px 0.5px 8px 0px rgba(0, 0, 0, 0.4);
    border-radius: 4px;
    min-height: 42px;
    transition: all 0.1s ease-in-out;

    .format-cell {
      padding: 12px;
    }
    .format-name {
      grid-column: 1;
    }
    .format-assets {
      grid-column: 2;
    }
    .format-price {
      grid-column: 3;
    }
  }

  .action {
    grid-column: 2;
    align-self: center;
    justify-self: center;
    cursor: pointer;
  }
  .ok {
    font-weight: 800;
    font-size: 14px;
    text-transform: uppercase;
  }
}
</style>
