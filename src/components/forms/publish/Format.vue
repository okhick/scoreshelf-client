<template>
  <div class="format">
    <label class="label">Format and Price</label>
    <div
      v-for="format in formats"
      :key="format.formatId"
      class="field is-horizontal"
    >
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

      <button class="button">
        <font-awesome-icon
          icon="trash-alt"
          @click="removeFormat(format.formatId)"
        />
      </button>
    </div>

    <button @click="addFormat" class="button is-outlined">
      <font-awesome-icon icon="plus"></font-awesome-icon>
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faPlus, faTrash);

export default {
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      formats: [{ formatId: 0, format: "", price: "" }]
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
      return { formatId: this.getFormatId(), format: "", price: "" }
    },
    removeFormat: function(formatId) {
      if (this.formats.length > 1) {
        const remainingFormats = this.formats.filter(format => format.formatId != formatId);
        this.formats = remainingFormats;
      } else {
        this.formats = [this.getBlankFormat()];
      }
    }
  },
  computed: {
    ...mapState({
      publishModalEditData: state => state.dashboard.publishModalEditData,
    })
  },
  watch: {
    publishModalEditData: function(newData) {
      // if newData.attributes is falsy, we're publishing from a blank
      if (newData?.attributes?.publicData?.formats) {
        this.formats = newData.attributes.publicData.formats;
      } else {
        this.formats = [this.getBlankFormat()];
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
</style>