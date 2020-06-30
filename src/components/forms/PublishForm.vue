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
        <input class="input" type="text" v-model="fieldData.ensemble" placeholder="String Quartet" />
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
        <input class="input" type="text" v-model="fieldData.format" placeholder="Score and Parts" />
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
            <input class="input" type="text" v-model="fieldData.price" placeholder="20" />
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import { sharetribe } from "@/mixins/sharetribe.js";

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
        price: ""
      },
    };
  },
  props: ["isNewPiece", "pieceStatus"],
  mixins: [sharetribe],
  computed: {
    ...mapState({
      publishModalEditData: state => state.dashboard.publishModalEditData
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
        }
      };
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