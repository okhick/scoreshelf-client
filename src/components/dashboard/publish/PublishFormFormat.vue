<template>
  <div class="container">
    <div class="header-container">
      <div class="format-header"><span class="column-header">Format</span></div>
      <div class="files-header"><span class="column-header">Files</span></div>
      <div class="price-header"><span class="column-header">Price</span></div>
      <div class="clear-header"></div>
    </div>

    <div class="format-container" v-for="format in formats" :key="format.formatId">
      <div class="format-data">
        <div class="format-name format-cell">{{ format.format }}</div>
        <div class="format-assets format-cell">{{ stringifyAssets(format.assets) }}</div>
        <div class="format-price format-cell">${{ format.price }}</div>
      </div>
      <div class="action" @click="removeFormat(format.formatId)">
        <font-awesome-icon icon="times" />
      </div>
    </div>

    <hr />

    <div class="new-format-container">
      <div class="new-format-data">
        <div class="field new-format">
          <div class="control">
            <div class="select">
              <select v-model="newFormat.format">
                <option></option>
                <option v-for="(format, index) in predefinedFormats" :key="index">
                  {{ format }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="field new-file">
          <div class="control">
            <div class="select">
              <select @input="newAssetSelected" v-model="assetSelectionModel">
                <option></option>
                <option v-for="(asset, index) in assetSelectionMenu" :key="index">
                  {{ asset }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="field new-price">
          <div class="control has-icons-left">
            <input class="input" type="price" placeholder="4.33" v-model="newFormat.price" />
            <span class="icon is-left"> $ </span>
          </div>
        </div>
      </div>

      <div class="new-action" @click="addFormat">
        <font-awesome-icon icon="plus" />
      </div>
      <!--  -->
      <asset-table
        :display-minimal="true"
        :fileList="assetSelectionTable"
        @remove-file="removeAsset"
        v-show="assetSelectionTable.length > 0"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch, computed } from '@vue/composition-api';
import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';
import useDashboard from '@/compositions/dashboard/dashboard';

import { ListingFormat, Asset, GenericAsset, ChooseEvent, UploadedFile } from '@/@types';

import AssetTable from '@/components/forms/AssetTable.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faPlus, faTimes);

export default {
  components: {
    FontAwesomeIcon,
    AssetTable,
  },
  setup() {
    const { formats, fileList } = useScoreshelfPublisher();
    const { useDashboardState } = useDashboard();
    const { publishModalEditData } = useDashboardState;

    const predefinedFormats = [
      'Score and Part(s)',
      'Full Score',
      'Performance Score',
      'Solo Part',
      'Parts Only',
      'Choir Score',
      'Other',
    ];

    const newFormat = ref<ListingFormat>(getBlankFormat());
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

    function addFormat() {
      formats.value.push(newFormat.value);
      newFormat.value = getBlankFormat();
    }

    function removeFormat(formatId: number) {
      if (formats.value.length > 1) {
        const remainingFormats = formats.value.filter((format) => format.formatId !== formatId);
        formats.value = remainingFormats;
      } else {
        formats.value = [getBlankFormat()];
      }
    }

    const assetSelectionModel = ref('');
    const assetSelectionMenu = computed(() => {
      const allAssets = fileList.value.map((asset) => asset.asset_name);
      const unusedAssets = allAssets.filter((asset) => !newFormat.value.assets.includes(asset));
      return unusedAssets;
    });
    const assetSelectionTable = computed(() => {
      const selectedFullAssets = newFormat.value.assets.map((asset) => {
        return fileList.value.find((file) => file.asset_name === asset);
      }) as (Asset | UploadedFile)[]; /* Type assertion because this will never be undefined */
      return selectedFullAssets;
    });
    function newAssetSelected(event: Event & ChooseEvent) {
      const selectedAsset: string = event.target.value;

      // make sure it's not the blank option or an already chosen option
      if (selectedAsset !== '' && newFormat.value.assets.indexOf(selectedAsset) === -1) {
        newFormat.value.assets.push(selectedAsset);
      }
      assetSelectionModel.value = '';
    }

    function removeAsset(assetToRemove: string) {
      newFormat.value.assets = newFormat.value.assets.filter((asset) => asset !== assetToRemove);
    }

    // ---------- Helper Methods ----------
    function getBlankFormat(): ListingFormat {
      return { formatId: getFormatId(), format: '', price: '', assets: [] };
    }

    function getFormatId() {
      return Date.now();
    }

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
      predefinedFormats,
      newFormat,
      assetSelectionTable,
      assetSelectionMenu,
      assetSelectionModel,
      // ---- Methods ----
      addFormat,
      removeFormat,
      newAssetSelected,
      removeAsset,
      stringifyAssets,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.column {
  padding: 4px;
}
.column-header {
  text-transform: uppercase;
  font-weight: 600;
  font-size: 18px;
}

.header-container {
  display: grid;
  grid-template-columns: 2fr 3fr 1fr 2.25%;
  padding-bottom: 8px;

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
  grid-template-columns: 94.5% 5.5%;

  .format-data {
    // display: flex-item;
    display: grid;
    grid-template-columns: 2fr 3fr 1fr;
    grid-column: 1;
    align-items: center;

    box-shadow: 0px 0.5px 8px 0px rgba(0, 0, 0, 0.4);
    border-radius: 4px;
    min-height: 42px;
    // margin-bottom: 24px;
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
    // display: flex-item;
  }
}

.field.column,
#new-format {
  margin-bottom: 0;
}

.new-format-container {
  display: grid;
  grid-template-columns: 94.5% 5.5%;
  grid-template-rows: auto auto;
  column-gap: 0px;

  .new-format-data {
    grid-column: 1;
    display: grid;
    grid-template-columns: 2fr auto 1fr;
    column-gap: 4px;
    align-items: center;

    .new-format {
      grid-column: 1;
      margin: 0;
    }
    .new-file {
      grid-column: 2;
      margin: 0;

      .select {
        // I HATE this...
        width: 268px;
      }
      option {
        width: 268px;
      }
    }
    .new-price {
      grid-column: 3;
    }
  }
  .new-action {
    grid-column: 2;
    grid-row: 1;
    align-self: center;
    justify-self: center;
    cursor: pointer;
  }
}

.format-container {
  margin-bottom: 12px;
}
.format-input {
  margin-right: 10px;
}
.price-input {
  margin-right: 10px;
}
.hover-pointer:hover {
  cursor: pointer;
}
.container {
  margin-bottom: 25px;
}
</style>
