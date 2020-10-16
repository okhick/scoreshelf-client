<template>
  <div class="format">
    <label class="label">Format and Price</label>
    <div v-for="format in formats" :key="format.formatId">
      <div class="field is-horizontal">
        <input
          class="input field-body"
          type="text"
          placeholder="Format"
          v-model="format.format"
        />

        <div class="field is-expanded field-body">
          <div class="field has-addons">
            <p class="control">
              <a class="button is-static">$</a>
            </p>
            <p class="control is-expanded">
              <input
                class="input"
                type="text"
                placeholder="20"
                v-model="format.price"
              />
            </p>
          </div>
        </div>

        <button class="button"  @click="removeFormat(format.formatId)">
          <font-awesome-icon icon="trash-alt"/>
        </button>
      </div>

       <table class="table is-fullwidth is-narrow" v-show="format.assets.length > 0">
        <tr v-for="asset in format.assets" :key="asset">
          <td valign="middle">
            {{ asset }}
          </td>
          <td align="right" class="hover-pointer">
            <font-awesome-icon
              icon="times"
              @click="removeAsset(asset, format.formatId)"
            />
          </td>
        </tr>
      </table>

      <div v-show="(fileList.length > 0)">
        <label class="label">Add file(s) to format</label>
        <div class="select is-primary">
          <select @change="newAssetSelected($event, format.formatId)">
            <option value=""></option>
            <option 
              v-for="file in fileList" 
              :key="file.asset_name"
              :value="file.asset_name"
            >
              {{file.asset_name}}
            </option>
          </select>
        </div>
      </div>
      <hr>
    </div>

    <button @click="addFormat" class="button is-outlined">
      <font-awesome-icon icon="plus"></font-awesome-icon>
    </button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { scoreshelf } from "@/mixins/scoreshelf.js";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faPlus, faTrash, faTimes);

export default {
  components: {
    FontAwesomeIcon
  },
  mixins: [scoreshelf],
  data() {
    return {
      formats: null
    };
  },
  methods: {
    addFormat: function() {
      this.formats.push(this.getBlankFormat());
    },
    getFormatId: function() {
      return Date.now();
    },
    getBlankFormat: function() {
      return { formatId: this.getFormatId(), format: "", price: "", assets: [] };
    },
    removeFormat: function(formatId) {
      if (this.formats.length > 1) {
        const remainingFormats = this.formats.filter(
          format => format.formatId != formatId
        );
        this.formats = remainingFormats;
      } else {
        this.formats = [this.getBlankFormat()];
      }
    },
    newAssetSelected: function(event, formatId) {
      const selectedAsset = event.target.value;
      const thisFormat = this.formats.find(format => format.formatId == formatId);

      // make sure it's not the blank option or an already chosen option
      if (selectedAsset != "" && thisFormat.assets.indexOf(selectedAsset) == -1) {
        thisFormat.assets.push(selectedAsset);
      }
    },
    removeAsset: function(assetToRemove, formatId) {
      const thisFormat = this.formats.find(format => format.formatId == formatId);
      thisFormat.assets = thisFormat.assets.filter(asset => asset != assetToRemove);
    },
  },
  computed: {
    ...mapState({
      publishModalEditData: state => state.dashboard.publishModalEditData,
      fileList: state => state.dashboard.fileList,
    })
  },
  watch: {
    publishModalEditData: function(newData) {
      if (newData?.attributes?.publicData?.formats) { // if we've opened an existing work
        this.formats = newData.attributes.publicData.formats;
      } else if (newData == null) { // if we're closing the modal
        this.formats = null;
      } else { // if it's a new work
        this.formats = [this.getBlankFormat()];
      }
    },
    fileList: function(newData) {
      if (this.formats != null) {
        // first swapout the asset ids for the asset name, don't do anything if there's not match
        // this is used on modal open
        this.formats.forEach(format => {
          format.assets = format.assets.map(asset => {
            const thisFile = this.fileList.find(file => file._id == asset);
            if (thisFile !== undefined) {
              return thisFile.asset_name;
            } 
            return asset;
          });
        });
        // loop through the formats' assets and filter out anything that's not there
        // this is used when you delete an asset file
        const newFileList = newData.map(file => file.asset_name);
        this.formats.forEach(format => {
          format.assets = format.assets.filter(asset => !(newFileList.indexOf(asset) == -1));
        })
      }
    }
  }
};
</script>

<style scoped>
.format-input {
  margin-right: 10px;
}
.price-input {
  margin-right: 10px;
}
.hover-pointer:hover {
  cursor: pointer;
}
</style>