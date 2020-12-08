<template>
  <div class="info-wrapper">
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

    <trix-editor-component />

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
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const dashboardStore = createNamespacedHelpers('dashboard'); // specific module name

import useSharetribePublisher from '@/compositions/sharetribe/sharetribePublisher';
import { onMounted } from '@vue/composition-api';

import TrixEditorComponent from '@/components/forms/TrixEditor';

export default {
  components: {
    TrixEditorComponent,
  },
  setup() {
    const { formData } = useSharetribePublisher();
    const { publishModalEditData } = dashboardStore.useState(['publishModalEditData']);

    onMounted(() => {
      if (publishModalEditData.value != null && publishModalEditData.value?.attributes) {
        formData.value.title = publishModalEditData.value.attributes.title;
        formData.value.subtitle = publishModalEditData.value.attributes.publicData.subtitle;
        formData.value.composer = publishModalEditData.value.attributes.publicData.composer;
        formData.value.commission = publishModalEditData.value.attributes.publicData.commission;
        formData.value.duration = publishModalEditData.value.attributes.publicData.duration;
        formData.value.programNotes = publishModalEditData.value.attributes.publicData.programNotes;
        formData.value.year = publishModalEditData.value.attributes.publicData.year;
        formData.value.ensemble = publishModalEditData.value.attributes.publicData.ensemble;
        formData.value.instrumentation =
          publishModalEditData.value.attributes.publicData.instrumentation;
      } else {
        for (const field in formData.value) {
          formData.value[field] = '';
        }
      }
    });

    return { formData };
  },
};
</script>

<style lang="scss" scoped>
.info-wrapper {
  margin-bottom: 24px;
}
.hover-pointer:hover {
  cursor: pointer;
}
.page-picker {
  width: 15px;
}
</style>