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

    <hr />

    <div class="field">
      <label class="label">Ensemble</label>
      <div class="control">
        <input class="input" type="text" v-model="formData.ensemble" placeholder="String Quartet" />
      </div>
    </div>

    <publish-form-instrumentation />

    <hr />

    <label class="label">Other notes, movements, program notes, whatever</label>
    <trix-editor-component
      @trix-editor-change="handleNewContent"
      v-bind:init-content="formData.otherNotes"
    />
  </div>
</template>

<script lang="ts">
import useDashboard from '@/compositions/dashboard/dashboard';
import useSharetribePublisher from '@/compositions/sharetribe/sharetribePublisher';
import { onMounted } from '@vue/composition-api';

import PublishFormInstrumentation from './PublishFormInstrumentation.vue';
import TrixEditorComponent from '@/components/forms/TrixEditor.vue';

export default {
  components: {
    TrixEditorComponent,
    PublishFormInstrumentation,
  },
  setup() {
    const { formData, useSharetribePublisherForm } = useSharetribePublisher();
    const { useDashboardState } = useDashboard();
    const { publishModalEditData } = useDashboardState;

    onMounted(() => {
      if (publishModalEditData.value != null && publishModalEditData.value?.attributes) {
        formData.value.title = publishModalEditData.value.attributes.title;
        formData.value.subtitle = publishModalEditData.value.attributes.publicData.subtitle;
        formData.value.composer = publishModalEditData.value.attributes.publicData.composer;
        formData.value.commission = publishModalEditData.value.attributes.publicData.commission;
        formData.value.duration = publishModalEditData.value.attributes.publicData.duration;
        formData.value.year = publishModalEditData.value.attributes.publicData.year;
        formData.value.ensemble = publishModalEditData.value.attributes.publicData.ensemble;
        formData.value.otherNotes = publishModalEditData.value.attributes.publicData.otherNotes;
      } else {
        useSharetribePublisherForm.clearFormData();
      }
    });

    function handleNewContent(event: string) {
      formData.value.otherNotes = event;
    }

    return { formData, handleNewContent };
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
