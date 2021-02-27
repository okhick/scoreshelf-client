<template>
  <div class="info-wrapper">
    <validated-field
      v-if="formDataLoaded"
      :init="formData.title"
      :isValid="publishFormValidaton.title.status"
      fieldLabel="Title"
      placeholder="Sonata No. Eleventy Seven"
      helpMessage="A title is required."
      @new-input="handleNameInput"
    />

    <div class="field">
      <label class="label">Subtitle</label>
      <div class="control">
        <input class="input" type="text" v-model="formData.subtitle" placeholder="Subtitle" />
      </div>
    </div>

    <hr />

    <publish-form-role />

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

    <validated-field
      v-if="formDataLoaded"
      :init="formData.ensemble"
      :isValid="publishFormValidaton.ensembleInst.status"
      fieldLabel="Ensemble"
      placeholder="String Quartet"
      @new-input="handleEnsembleInput"
    />

    <publish-form-instrumentation />

    <p
      class="help invalid"
      v-if="publishFormValidaton.ensembleInst.status === false && formDataLoaded"
    >
      You must have at least 1 instrument or ensemble.
    </p>

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
import { computed, onMounted, ref } from '@vue/composition-api';

import PublishFormInstrumentation from './PublishFormInstrumentation.vue';
import PublishFormRole from './PublishFormRole.vue';
import TrixEditorComponent from '@/components/forms/TrixEditor.vue';
import ValidatedField from '@/components/forms/ValidatedField.vue';

import useValidationState from '@/compositions/validation/validationState';
import usePublishFormInfoValidation from '@/compositions/validation/publishFormInfoValidation';

export default {
  components: {
    TrixEditorComponent,
    PublishFormRole,
    PublishFormInstrumentation,
    ValidatedField,
  },
  setup() {
    const { formData, useSharetribePublisherForm } = useSharetribePublisher();
    const { useDashboardState } = useDashboard();
    const { publishModalEditData } = useDashboardState;
    const formDataLoaded = ref(false);

    onMounted(() => {
      if (publishModalEditData.value != null && publishModalEditData.value?.attributes) {
        formData.value.title = publishModalEditData.value.attributes.title;
        formData.value.subtitle = publishModalEditData.value.attributes.publicData.subtitle;
        formData.value.commission = publishModalEditData.value.attributes.publicData.commission;
        formData.value.ensemble = publishModalEditData.value.attributes.publicData.ensemble;
        formData.value.duration = publishModalEditData.value.attributes.publicData.duration;
        formData.value.year = publishModalEditData.value.attributes.publicData.year;
        formData.value.otherNotes = publishModalEditData.value.attributes.publicData.otherNotes;
      } else {
        useSharetribePublisherForm.clearFormData();
      }
      initValidation();
      formDataLoaded.value = true;
    });

    function handleNewContent(event: string) {
      formData.value.otherNotes = event;
    }

    // ======= Handle Form Validation/Inputs ==========
    const { ValidationStore } = useValidationState();
    const publishFormValidaton = computed(() => ValidationStore.publishFormInfo);

    const { validateTitle, validateEnsembleInstrumentation } = usePublishFormInfoValidation();
    // use after initial formData has been loaded
    function initValidation() {
      validateTitle();
      validateEnsembleInstrumentation();
    }

    function handleNameInput(value: string) {
      formData.value.title = value;
    }
    function handleEnsembleInput(value: string) {
      formData.value.ensemble = value;
    }

    return {
      formData,
      formDataLoaded,
      handleNewContent,
      publishFormValidaton,
      validateTitle,
      handleNameInput,
      handleEnsembleInput,
    };
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
