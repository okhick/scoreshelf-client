<template>
  <section class="modal-card-body">
    <div class="field">
      <label class="label">Title</label>
      <div class="control">
        <input class="input" type="text" v-model="formData.title" placeholder="Title" />
      </div>
    </div>

    <div class="field">
      <label class="label">Subtitle</label>
      <div class="control">
        <input class="input" type="text" v-model="formData.subtitle" placeholder="Subtitle" />
      </div>
    </div>

    <hr />

    <div class="field">
      <label class="label">Year of Completion</label>
      <div class="control">
        <input class="input" type="text" v-model="formData.year" placeholder="2020" />
      </div>
    </div>

    <div class="field">
      <label class="label">Composer(s)</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model="formData.composer"
          placeholder="Person 1, Person 2"
        />
      </div>
    </div>

    <hr />

    <div class="field">
      <label class="label">Ensemble</label>
      <div class="control">
        <input class="input" type="text" v-model="formData.ensemble" placeholder="String Quartet" />
      </div>
    </div>

    <div class="field">
      <label class="label">Instrumentation</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model="formData.instrumentation"
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
import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const dashboardStore = createNamespacedHelpers('dashboard'); // specific module name

import Format from './Format';
import Asset from './Asset';

import { watch } from '@vue/composition-api';

import useSharetribePublisher from '@/compositions/sharetribe/sharetribePublisher';

export default {
  components: {
    Format,
    Asset,
  },
  setup() {
    const { formData } = useSharetribePublisher();
    const dashboardState = dashboardStore.useState(['publishModalEditData']);

    watch(dashboardState.publishModalEditData, newData => {
      if (newData != null && newData?.attributes) {
        formData.value.title = newData.attributes.title;
        formData.value.subtitle = newData.attributes.publicData.subtitle;
        formData.value.year = newData.attributes.publicData.year;
        formData.value.composer = newData.attributes.publicData.composer;
        formData.value.ensemble = newData.attributes.publicData.ensemble;
        formData.value.instrumentation = newData.attributes.publicData.instrumentation;
      } else {
        for (const field in formData.value) {
          formData.value[field] = '';
        }
      }
    });

    return {
      formData,
    };
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
