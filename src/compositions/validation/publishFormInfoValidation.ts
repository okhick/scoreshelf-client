import Vue from 'vue';
import { computed, watch } from '@vue/composition-api';

import useValidationState, { Validation } from '@/compositions/validation/validationState';
import useSharetribePublisher from '@/compositions/sharetribe/sharetribePublisher';

export default function usePublishFormInfoValidation() {
  const { ValidationStore } = useValidationState();
  const publishFormInfoValidation = computed(() => ValidationStore.publishFormInfo);
  const { formData } = useSharetribePublisher();

  //==========
  function validateTitle() {
    Vue.set(ValidationStore.publishFormInfo, 'title', new Validation('title', false));

    if (formData.value.title.length !== 0) {
      publishFormInfoValidation.value['title'].status = true;
    }
  }
  watch(
    computed(() => formData.value.title),
    () => validateTitle()
  );

  //==========

  function validateRole() {
    Vue.set(ValidationStore.publishFormInfo, 'role', new Validation('role', false));

    if (formData.value.role != undefined && formData.value.role.length > 0) {
      publishFormInfoValidation.value['role'].status = true;
    }
  }
  watch(
    computed(() => formData.value.role),
    () => validateRole()
  );

  //==========

  function validateEnsembleInstrumentation() {
    Vue.set(ValidationStore.publishFormInfo, 'ensembleInst', new Validation('ensembleInst', false));

    const instValid =
      formData.value.instrumentation != undefined && formData.value.instrumentation.length > 0;
    const ensembleValid = formData.value.ensemble != undefined && formData.value.ensemble != '';

    if (instValid || ensembleValid) {
      publishFormInfoValidation.value['ensembleInst'].status = true;
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
