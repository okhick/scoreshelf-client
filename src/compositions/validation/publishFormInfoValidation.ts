import Vue from 'vue';
import { computed, watch } from '@vue/composition-api';

import useValidationState, { Validation } from '@/compositions/validation/validationState';
import useSharetribePublisher from '@/compositions/sharetribe/sharetribePublisher';

export default function usePublishFormInfoValidation() {
  const { ValidationStore } = useValidationState();
  const publishFormValidation = computed(() => ValidationStore.publishForm);
  const { formData } = useSharetribePublisher();

  //==========
  function validateTitle() {
    Vue.set(ValidationStore.publishForm, 'title', new Validation('title', false));

    if (formData.value.title.length !== 0) {
      publishFormValidation.value['title'].status = true;
    }
  }
  watch(
    computed(() => formData.value.title),
    () => validateTitle()
  );

  //==========

  function validateRole() {
    Vue.set(ValidationStore.publishForm, 'role', new Validation('role', false));

    if (formData.value.role != undefined && formData.value.role.length > 0) {
      publishFormValidation.value['role'].status = true;
    }
  }
  watch(
    computed(() => formData.value.role),
    () => validateRole()
  );

  //==========

  function validateEnsembleInstrumentation() {
    Vue.set(ValidationStore.publishForm, 'ensembleInst', new Validation('ensembleInst', false));

    const instValid =
      formData.value.instrumentation != undefined && formData.value.instrumentation.length > 0;
    const ensembleValid = formData.value.ensemble != undefined && formData.value.ensemble != '';

    if (instValid || ensembleValid) {
      publishFormValidation.value['ensembleInst'].status = true;
    }
  }
  watch(
    [computed(() => formData.value.ensemble), computed(() => formData.value.instrumentation)],
    () => validateEnsembleInstrumentation()
  );

  return {
    validateTitle,
    validateRole,
    validateEnsembleInstrumentation,
  };
}
