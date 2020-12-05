<template>
  <div class="bottom-margin">
    <div class="file is-boxed is-centered">
      <label class="file-label">
        <input class="file-input" type="file" ref="file" multiple @change="processUploadEvent" />
        <span class="file-cta">
          <span class="file-icon">
            <font-awesome-icon icon="upload" />
          </span>
          <span class="file-label">Upload your file(s)</span>
        </span>
      </label>
    </div>

    <table class="table is-fullwidth is-narrow" v-show="fileList.length > 0">
      <thead>
        <th>Filename</th>
        <th>Preview?</th>
        <th>Thumbnail?</th>
        <th>Size</th>
        <th></th>
      </thead>
      <tr v-for="file in fileList" :key="file.asset_name">
        <td v-if="file.link" valign="middle">
          <a :href="file.link">{{ file.asset_name }}</a>
        </td>
        <td v-else valign="middle">{{ file.asset_name }}</td>

        <td>
          <div class="field is-horizontal">
            <div class="field-body">
              <div class="field">
                <input
                  type="checkbox"
                  v-model="previewSettings[file.asset_name].isPreview"
                  @click="newPreviewSelected($event, file.asset_name)"
                />
              </div>
            </div>
          </div>
        </td>

        <td>
          <div class="field is-horizontal">
            <div class="field-body">
              <div class="field">
                <input
                  type="checkbox"
                  v-model="thumbnailSettings[file.asset_name].isThumbnail"
                  @click="newThumbSelected($event, file.asset_name)"
                />
              </div>
              <div
                class="field page-picker"
                v-show="thumbnailSettings[file.asset_name].isThumbnail"
              >
                <input
                  class="input is-small"
                  type="text"
                  placeholder="Page No."
                  v-model.number="thumbnailSettings[file.asset_name].page"
                />
              </div>
            </div>
          </div>
        </td>

        <td valign="middle">{{ calculateSize(file) }}</td>

        <td align="right" class="hover-pointer">
          <font-awesome-icon icon="times" @click="removeUpload(file.asset_name)" />
        </td>
      </tr>
    </table>

    <div class="columns">
      <div class="column is-2 label"><label>Preview:</label></div>
      <div class="column">
        <div class="field">
          <div class="control">
            <div class="select is-fullwidth">
              <select>
                <option></option>
                <option v-for="file in fileList" :key="file.asset_name">
                  {{ file.asset_name }}
                </option>
              </select>
            </div>
          </div>
          <p class="help">Choose a document to be shown as the preview on the publication page.</p>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column is-2 label"><label>Thumbnail:</label></div>
      <div class="column">
        <div class="field">
          <div class="control is-expanded">
            <div class="select is-fullwidth">
              <select>
                <option></option>
                <option v-for="file in fileList" :key="file.asset_name">
                  {{ file.asset_name }}
                </option>
              </select>
            </div>
          </div>
          <p class="help">
            Pick a document and a page and we'll generate a thumbnail image for you.
          </p>
        </div>
      </div>

      <div class="column is-narrow label"><label>Page No.:</label></div>
      <div class="column is-2">
        <div class="field">
          <input class="input" type="text" placeholder="Page" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';
import { onMounted, watch } from '@vue/composition-api';
import Vue from 'vue';

import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const dashboardStore = createNamespacedHelpers('dashboard'); // specific module name

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUpload, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faUpload, faTimes);

export default {
  components: {
    FontAwesomeIcon,
  },
  setup(_, context) {
    const {
      // States
      fileList,
      thumbnailSettings,
      previewSettings,
      // Methods
      useFileStateManagement,
      useScoreshelfHelpers,
    } = useScoreshelfPublisher();

    const { publishModalEditData } = dashboardStore.useState(['publishModalEditData']);

    useFileStateManagement.initAssetData();

    // ---------- Methods ----------

    function processUploadEvent() {
      const newFiles = context.refs.file.files;
      useFileStateManagement.processUpload(newFiles);
    }

    function removeUpload(fileName) {
      fileList.value.forEach((file) => {
        if (file.asset_name === fileName) {
          if (file.isStored) {
            useFileStateManagement.setFileToBeRemoved(fileName);
            useFileStateManagement.removeFileFromFileList(fileName);
          } else {
            useFileStateManagement.removeFileFromFileList(fileName);
          }
        }
      });
    }

    function newThumbSelected(event, checkedAsset) {
      const isChecked = event.target.checked;
      if (isChecked) {
        for (let asset in thumbnailSettings.value) {
          if (asset != checkedAsset) {
            thumbnailSettings.value[asset] = makeBlankThumbnail();
          }
        }
      } else {
        for (let asset in thumbnailSettings.value) {
          thumbnailSettings.value[asset] = makeBlankThumbnail();
        }
      }
    }

    function newPreviewSelected(event, checkedAsset) {
      const isChecked = event.target.checked;
      if (isChecked) {
        for (let asset in previewSettings.value) {
          if (asset != checkedAsset) {
            previewSettings.value[asset].isPreview = false;
          }
        }
      } else {
        for (let asset in previewSettings.value) {
          console.log(previewSettings.value[asset]);
          previewSettings.value[asset].isPreview = false;
        }
      }
    }

    return {
      // ---- Data ----
      fileList,
      thumbnailSettings,
      previewSettings,
      // ---- Methods ----
      removeUpload,
      newThumbSelected,
      processUploadEvent,
      newPreviewSelected,
      calculateSize: useScoreshelfHelpers.calculateSize,
    };
  },
};
</script>

<style scoped>
.hover-pointer:hover {
  cursor: pointer;
}
.page-picker {
  width: 15px;
}
.bottom-margin {
  margin-bottom: 25px;
}

.column.label {
  text-align: right;
  padding-top: 18px;
}
</style>
