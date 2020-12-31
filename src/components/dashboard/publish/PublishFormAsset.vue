<template>
  <div class="bottom-margin">
    <div class="bottom-margin file is-boxed is-centered">
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
        <th>Date Added</th>
        <th>Size</th>
        <th></th>
      </thead>
      <tr v-for="file in fileList" :key="file.asset_name">
        <td v-if="file.link" valign="middle">
          <a :href="file.link">{{ file.asset_name }}</a>
        </td>
        <td v-else valign="middle">{{ file.asset_name }}</td>

        <td valign="middle">{{ formatDate(file.date_added) }}</td>

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
              <select @change="newPreviewSelected" v-model="previewAsset">
                <option></option>
                <option v-for="file in Object.keys(previewSettings)" :key="file">
                  {{ file }}
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
              <select @change="newThumbSelected" v-model="thumbAsset">
                <option></option>
                <option v-for="file in Object.keys(thumbnailSettings)" :key="file">
                  {{ file }}
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
          <input
            class="input"
            v-model="thumbPage"
            @change="newThumbPage"
            type="text"
            placeholder="Page"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';
import { onMounted, ref } from '@vue/composition-api';
import Vue from 'vue';

import { DateTime } from 'luxon';

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

    useFileStateManagement.initAssetData();

    onMounted(() => {
      initPreviewSelector();
      initThumbSelector();
    });

    // ---------- Methods ----------
    // ---- Actions for the asset table ----
    function formatDate(dateString) {
      return dateString ? DateTime.fromISO(dateString).toFormat('DDD') : '';
    }
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

    // ---- Actions for the selectors below ----
    const thumbAsset = ref();
    const thumbPage = ref();
    function initThumbSelector() {
      if (thumbnailSettings.value) {
        for (let asset in thumbnailSettings.value) {
          if (thumbnailSettings.value[asset].isThumbnail) {
            thumbAsset.value = asset;
            thumbPage.value = thumbnailSettings.value[asset].page;
          }
        }
      }
    }
    function newThumbSelected() {
      for (let asset in thumbnailSettings.value) {
        if (asset === thumbAsset.value) {
          thumbnailSettings.value[asset].isThumbnail = true;
          thumbnailSettings.value[asset].page = parseInt(thumbPage.value);
        } else {
          thumbnailSettings.value[asset].isThumbnail = false;
          thumbnailSettings.value[asset].page = null;
        }
      }
    }
    function newThumbPage() {
      for (let asset in thumbnailSettings.value) {
        if (thumbnailSettings.value[asset].isThumbnail) {
          thumbnailSettings.value[asset].page = parseInt(thumbPage.value);
        } else {
          thumbnailSettings.value[asset].page = null;
        }
      }
    }

    const previewAsset = ref();
    function initPreviewSelector() {
      if (previewSettings.value) {
        for (let asset in previewSettings.value) {
          if (previewSettings.value[asset].isPreview) {
            previewAsset.value = asset;
          }
        }
      }
    }
    function newPreviewSelected() {
      const selectedPreview = event.target.value;
      for (let asset in previewSettings.value) {
        if (asset === previewAsset.value) {
          previewSettings.value[asset].isPreview = true;
        } else {
          previewSettings.value[asset].isPreview = false;
        }
      }
    }

    return {
      // ---- Data ----
      fileList,
      previewSettings,
      previewAsset,
      thumbnailSettings,
      thumbAsset,
      thumbPage,
      // ---- Methods ----
      formatDate,
      removeUpload,
      newThumbSelected,
      newThumbPage,
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
