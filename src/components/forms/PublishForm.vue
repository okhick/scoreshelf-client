<template>
  <section class="modal-card-body">
    <div class="field">
      <label class="label">Title</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model="fieldData.title"
          placeholder="Title"
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Subtitle</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model="fieldData.subtitle"
          placeholder="Subtitle"
        />
      </div>
    </div>

    <hr />

    <div class="field">
      <label class="label">Year of Completion</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model="fieldData.year"
          placeholder="2020"
        />
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

    <div class="field">
      <label class="label">Format</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model="fieldData.format"
          placeholder="Score and Parts"
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Price</label>
      <div class="field is-expanded">
        <div class="field has-addons">
          <p class="control">
            <a class="button is-static">$</a>
          </p>
          <p class="control is-expanded">
            <input
              class="input"
              type="text"
              v-model="fieldData.price"
              placeholder="20"
            />
          </p>
        </div>
      </div>
    </div>

    <hr />

    <div class="field bottom-margin">
      <label class="label">Upload</label>

      <div class="file is-boxed is-centered">
        <label class="file-label">
          <input
            class="file-input"
            type="file"
            ref="file"
            multiple
            @change="processUpload"
          />
          <span class="file-cta">
            <span class="file-icon">
              <font-awesome-icon icon="upload" />
            </span>
            <span class="file-label">Upload your file(s)</span>
          </span>
        </label>
      </div>

      <table class="table is-fullwidth" v-show="fileList.length > 0">
        <thead>
          <th>Filename</th>
          <th>Size</th>
        </thead>
        <tr v-for="(file, index) in fileList" :key="index">
          <td>{{ file.name }}</td>
          <td>{{ calculateSize(file) }}</td>
        </tr>
      </table>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import { sharetribe } from "@/mixins/sharetribe.js";
import { uploader } from "@/mixins/upload.js";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faUpload);

export default {
  data: function() {
    return {
      fieldData: {
        title: "",
        subtitle: "",
        year: "",
        composer: "",
        ensemble: "",
        instrumentation: "",
        format: "",
        price: "",
        upload: ""
      }
    };
  },
  props: ["isNewPiece", "pieceStatus"],
  components: {
    FontAwesomeIcon
  },
  mixins: [sharetribe, uploader],
  computed: {
    ...mapState({
      publishModalEditData: state => state.dashboard.publishModalEditData,
      fileList: state => state.dashboard.fileList
    })
  },
  methods: {
    formatArgs: function() {
      return {
        title: this.fieldData.title,
        price: this.convertToSharetribePrice(this.fieldData.price),
        publicData: {
          subtitle: this.fieldData.subtitle,
          year: this.fieldData.year,
          composer: this.fieldData.composer,
          ensemble: this.fieldData.ensemble,
          instrumentation: this.fieldData.instrumentation,
          format: this.fieldData.format
        },
        privateData: {
          assetData: this.formatAssetData()
        }
      };
    },
    formatAssetData: function() {
      let assetData = [];
      this.fileList.forEach((file) => {
        let thisFileData = {
          scoreshelf_id: file.scoreshelf_id,
          name: file.name
        };
        assetData.push(thisFileData);
      });
      return assetData;
    },
    clearFormData: function() {
      for (const field in this.fieldData) {
        this.fieldData[field] = "";
      }
      return true;
    }
  },
  watch: {
    publishModalEditData: function(newData) {
      // if newData.attributes is falsy, we're publishing from a blank
      if (newData != null && newData.attributes) {
        this.fieldData.title = newData.attributes.title;
        this.fieldData.price = this.convertFromSharetribePrice(
          newData.attributes.price
        );
        this.fieldData.subtitle = newData.attributes.publicData.subtitle;
        this.fieldData.year = newData.attributes.publicData.year;
        this.fieldData.composer = newData.attributes.publicData.composer;
        this.fieldData.ensemble = newData.attributes.publicData.ensemble;
        this.fieldData.instrumentation =
          newData.attributes.publicData.instrumentation;
        this.fieldData.format = newData.attributes.publicData.format;
      } else {
        for (const field in this.fieldData) {
          this.fieldData[field] = "";
        }
      }
    }
  }
};
</script>

<style scoped>
.bottom-margin {
  margin-bottom: 24px;
}
</style>
