<template>
  <section class="modal-card-body">
    <div class="field">
      <label class="label">Title</label>
      <div class="control">
        <input class="input" type="text" v-model="fieldData.title" placeholder="Title" />
      </div>
    </div>

    <div class="field">
      <label class="label">Subtitle</label>
      <div class="control">
        <input class="input" type="text" v-model="fieldData.subtitle" placeholder="Subtitle" />
      </div>
    </div>

    <hr />

    <div class="field">
      <label class="label">Year of Completion</label>
      <div class="control">
        <input class="input" type="text" v-model="fieldData.year" placeholder="2020" />
      </div>
    </div>

    <div class="field">
      <label class="label">Composer(s)</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model="fieldData.composer"
          placeholder="Person 1, Person 2"
        />
      </div>
    </div>

    <hr />

    <div class="field">
      <label class="label">Ensemble</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model="fieldData.ensemble"
          placeholder="String Quartet"
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Instrumentation</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model="fieldData.instrumentation"
          placeholder="Violin 1, Violin 2, Viola, Cello"
        />
      </div>
    </div>

    <hr />

    <format ref="formats" />

    <hr />

    <asset ref="assets" />
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { sharetribe } from '@/mixins/sharetribe.js';
import { scoreshelf } from '@/mixins/scoreshelf.js';

import Format from './Format';
import Asset from './Asset';

export default {
  data: function() {
    return {
      fieldData: {
        title: '',
        subtitle: '',
        year: '',
        composer: '',
        ensemble: '',
        instrumentation: '',
      },
      reloadAssetTable: 0,
    };
  },
  props: ['isNewPiece', 'pieceStatus'],
  components: {
    Format,
    Asset,
  },
  mixins: [sharetribe, scoreshelf],
  computed: {
    ...mapState({
      publishModalEditData: state => state.dashboard.publishModalEditData,
      fileList: state => state.dashboard.fileList,
    }),
  },
  methods: {
    ...mapMutations('dashboard', ['removeFromFileList']),
    formatArgs: function() {
      const cleanData = this.sanitizeFormData();
      return {
        ...cleanData,
        privateData: {
          assetData: this.formatAssetData(),
        },
      };
    },
    sanitizeFormData: function() {
      let cleanFormData = { publicData: {} };

      for (const field in this.fieldData) {
        if (this.fieldData[field] !== void 0) {
          switch (field) {
            case 'title':
              cleanFormData.title = this.fieldData[field];
              break;
            default:
              cleanFormData['publicData'][field] = this.fieldData[field];
          }
        }
      }

      cleanFormData.publicData.formats = this.formatFormatData();
      return cleanFormData;
    },
    formatAssetData: function() {
      const assetData = [];

      this.fileList.forEach(file => {
        const thisFileData = { scoreshelf_id: file._id };
        assetData.push(thisFileData);
      });

      return assetData;
    },
    formatFormatData: function() {
      const formats = this.$refs.formats.formats;
      formats.forEach(format => {
        format.assets = format.assets.map(asset => {
          const thisFile = this.fileList.find(file => file.asset_name == asset);
          return thisFile._id;
        });
      });
      return formats;
    },
    clearFormData: function() {
      for (const field in this.fieldData) {
        this.fieldData[field] = '';
      }
      this.fileList.forEach(file => this.removeFromFileList(file.asset_name));
      this.$refs.formats.formats = null;

      this.$refs.assets.thumbnailSettings = {};
      return true;
    },
  },
  watch: {
    publishModalEditData: function(newData) {
      // if newData.attributes is falsy, we're publishing from a blank
      if (newData != null && newData.attributes) {
        this.fieldData.title = newData.attributes.title;
        this.fieldData.subtitle = newData.attributes.publicData.subtitle;
        this.fieldData.year = newData.attributes.publicData.year;
        this.fieldData.composer = newData.attributes.publicData.composer;
        this.fieldData.ensemble = newData.attributes.publicData.ensemble;
        this.fieldData.instrumentation = newData.attributes.publicData.instrumentation;
      } else {
        for (const field in this.fieldData) {
          this.fieldData[field] = '';
        }
      }
    },
  },
};
</script>

<style scoped>
.bottom-margin {
  margin-bottom: 24px;
}
.hover-pointer:hover {
  cursor: pointer;
}
.page-picker {
  width: 15px;
}
</style>
