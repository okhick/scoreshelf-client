<template>
  <div class="field bottom-margin">
    <label class="label">Upload</label>

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
          <font-awesome-icon icon="trash-alt" @click="removeUpload(file.asset_name)" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';
import { watch } from '@vue/composition-api';
import Vue from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUpload, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faUpload, faTrashAlt);

export default {
  components: {
    FontAwesomeIcon,
  },
  setup(_, context) {
    const {
      useFileStateManagement,
      fileList,
      thumbnailSettings,
      useScoreshelfHelpers,
    } = useScoreshelfPublisher();

    watch(fileList, () => {
      fileList.value.forEach(file => {
        if (thumbnailSettings.value[file.asset_name] === undefined) {
          // because we're making these on the fly, we need to use $set to make them reactive
          Vue.set(thumbnailSettings.value, file.asset_name, {
            ...makeBlankThumbnail(),
          });
        }
        // loadup any settings that may alread exist
        if (file.thumbnail_settings) {
          thumbnailSettings.value[file.asset_name].page = file.thumbnail_settings.page;
          thumbnailSettings.value[file.asset_name].isThumbnail = true;
        }
      });
    });

    // ---------- Methods ----------
    function processUploadEvent() {
      const newFiles = context.refs.file.files;
      useFileStateManagement.processUpload(newFiles);
    }

    function removeUpload(fileName) {
      fileList.value.forEach(file => {
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

    function makeBlankThumbnail() {
      return { isThumbnail: false, page: null };
    }

    return {
      // ---- Data ----
      fileList,
      thumbnailSettings,
      // ---- Methods ----
      removeUpload,
      newThumbSelected,
      processUploadEvent,
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
</style>
