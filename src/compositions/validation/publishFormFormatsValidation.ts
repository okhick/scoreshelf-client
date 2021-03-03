import Vue from 'vue';
import { computed, watch } from '@vue/composition-api';

import useValidationState, { Validation } from '@/compositions/validation/validationState';
import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';

export default function usePublishFormFormatsValidation() {
  const { ValidationStore } = useValidationState();
  const publishFormFormatsValidation = computed(() => ValidationStore.publishFormFormats);
  const { formats } = useScoreshelfPublisher();

  function initFormatsValidation() {
    validateFormatsList();
  }

  //==========
  function validateFormatsList() {
    Vue.set(ValidationStore.publishFormFormats, 'formats', new Validation('formats', false));

    if (formats.value.length > 0) {
      publishFormFormatsValidation.value['formats'].status = true;
    }
  }
  watch(
    computed(() => formats.value),
    () => validateFormatsList()
  );

  return {
    initFormatsValidation,
  };
}
