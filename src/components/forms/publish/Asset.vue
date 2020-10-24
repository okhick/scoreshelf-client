<template>
  <div class="field bottom-margin">
    <label class="label">Upload</label>

    <div class="file is-boxed is-centered">
      <label class="file-label">
        <input class="file-input" type="file" ref="file" multiple @change="processUpload" />
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
              <div class="field page-picker">
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
import { mapState, mapMutations } from 'vuex';
import { scoreshelf } from '@/mixins/scoreshelf.js';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUpload, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faUpload, faTrashAlt);

export default {
  components: {
    FontAwesomeIcon,
  },
  mixins: [scoreshelf],
  data() {
    return {
      thumbnailSettings: {},
    };
  },
  computed: {
    ...mapState({
      fileList: state => state.dashboard.fileList,
    }),
  },
  methods: {
    ...mapMutations('dashboard', ['removeFromFileList', 'setFileToBeRemoved']),
    removeUpload: function(fileName) {
      this.fileList.forEach(file => {
        if (file.asset_name == fileName) {
          if (file.isStored) {
            this.setFileToBeRemoved(fileName);
            this.removeFromFileList(fileName);
          } else {
            this.removeFromFileList(fileName);
          }
        }
      });
    },
    newThumbSelected: function(event, checkedAsset) {
      const isChecked = event.target.checked;
      if (isChecked) {
        for (let asset in this.thumbnailSettings) {
          if (asset != checkedAsset) {
            this.thumbnailSettings[asset] = this.makeBlankThumbnail();
          }
        }
      }
    },
    makeBlankThumbnail: function() {
      return { isThumbnail: false, page: null };
    },
  },
  watch: {
    fileList: function() {
      this.fileList.forEach(file => {
        if (this.thumbnailSettings[file.asset_name] === undefined) {
          // because we're making these on the fly, we need to use $set to make them reactive
          this.$set(this.thumbnailSettings, file.asset_name, {
            ...this.makeBlankThumbnail(),
          });
        }
        // loadup any settings that may alread exist
        if (file.thumbnail_settings) {
          this.thumbnailSettings[file.asset_name].page = file.thumbnail_settings.page;
          this.thumbnailSettings[file.asset_name].isThumbnail = true;
        }
      });
    },
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
