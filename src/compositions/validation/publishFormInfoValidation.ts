import Vue from 'vue';
import useValidationState, { Validation } from '@/compositions/validation/validationState';
import { computed } from '@vue/composition-api';

export default function usePublishFormInfoValidation() {
  const { ValidationStore } = useValidationState();

  async function validateTitle(value: string) {
    const fieldSlug = 'title';

    const publishFormValidation = computed(() => ValidationStore.publishForm);
    // publishFormValidation.value[fieldSlug] = new Validation(fieldSlug, false);

    Vue.set(ValidationStore.publishForm, fieldSlug, new Validation(fieldSlug, false));

    if (value != '') {
      publishFormValidation.value[fieldSlug].status = true;
    }
  }
  return {
    validateTitle,
  };
}
