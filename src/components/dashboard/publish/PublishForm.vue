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

    <div class="field">
      <label class="label">Year of Completion</label>
      <div class="control">
        <input class="input" type="text" v-model="formData.year" placeholder="2020" />
      </div>
    </div>

    <div class="field">
      <label class="label">Duration</label>
      <div class="control">
        <input class="input" type="text" v-model="formData.duration" placeholder="6:20" />
      </div>
    </div>

    <div class="field">
      <label class="label">Commission or Dedication</label>
      <div class="control">
        <input class="input" type="text" v-model="formData.commission" placeholder="to Mother" />
      </div>
    </div>

    <div class="field">
      <label class="label">Program Notes</label>
      <div class="control">
        <textarea class="textarea" v-model="formData.programNotes" />
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

    <publish-form-format ref="formats" />

    <hr />

    <publish-form-asset ref="assets" />
  </section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const dashboardStore = createNamespacedHelpers('dashboard'); // specific module name

import PublishFormFormat from './PublishFormFormat';
import PublishFormAsset from './PublishFormAsset';

import { watch } from '@vue/composition-api';

import useSharetribePublisher from '@/compositions/sharetribe/sharetribePublisher';

export default {
  components: {
    PublishFormFormat,
    PublishFormAsset,
  },
  setup() {
    const { formData } = useSharetribePublisher();
    const dashboardState = dashboardStore.useState(['publishModalEditData']);

    watch(dashboardState.publishModalEditData, (newData) => {
      if (newData != null && newData?.attributes) {
        formData.value.title = newData.attributes.title;
        formData.value.subtitle = newData.attributes.publicData.subtitle;
        formData.value.composer = newData.attributes.publicData.composer;
        formData.value.commission = newData.attributes.publicData.commission;
        formData.value.duration = newData.attributes.publicData.duration;
        formData.value.programNotes = newData.attributes.publicData.programNotes;
        formData.value.year = newData.attributes.publicData.year;
        formData.value.ensemble = newData.attributes.publicData.ensemble;
        formData.value.instrumentation = newData.attributes.publicData.instrumentation;
        console.log(formData);
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
