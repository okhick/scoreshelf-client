<template>
  <div class="info-wrapper">
    <validated-field
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

    <hr />

    <validated-field
      :init="formData.ensemble"
      :isValid="publishFormValidaton.ensembleInst.status"
      fieldLabel="Ensemble"
      placeholder="String Quartet"
      @new-input="handleEnsembleInput"
    />

    <publish-form-instrumentation />

    <p
      class="help invalid"
      v-if="publishFormValidaton && publishFormValidaton.ensembleInst.status === false"
    >
      You must have at least 1 instrument or ensemble.
    </p>

    <hr />

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

    <publish-form-tags />

    <hr />

    <label class="label">Other notes, movements, program notes, whatever</label>
    <trix-editor-component
      @trix-editor-change="handleNewContent"
      v-bind:init-content="formData.otherNotes"
    />
  </div>
</template>

<script lang="ts">
import useSharetribePublisher from '@/compositions/sharetribe/sharetribePublisher';
import { computed } from '@vue/composition-api';

import PublishFormInstrumentation from './PublishFormInstrumentation.vue';
import PublishFormRole from './PublishFormRole.vue';
import TrixEditorComponent from '@/components/forms/TrixEditor.vue';
import ValidatedField from '@/components/forms/ValidatedField.vue';
import PublishFormTags from './PublishFormTags.vue';

import useValidationState from '@/compositions/validation/validationState';
import usePublishFormInfoValidation from '@/compositions/validation/publishFormInfoValidation';

export default {
  components: {
    TrixEditorComponent,
    PublishFormRole,
    PublishFormInstrumentation,
    ValidatedField,
    PublishFormTags,
  },
  setup() {
    const { formData } = useSharetribePublisher();

    function handleNewContent(event: string) {
      formData.value.otherNotes = event;
    }

    // ======= Handle Form Validation/Inputs ==========
    const { ValidationStore } = useValidationState();
    const publishFormValidaton = computed(() => ValidationStore.publishFormInfo);

    const { validateTitle } = usePublishFormInfoValidation();

    function handleNameInput(value: string) {
      formData.value.title = value;
    }
    function handleEnsembleInput(value: string) {
      formData.value.ensemble = value;
    }

    return {
      formData,
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
