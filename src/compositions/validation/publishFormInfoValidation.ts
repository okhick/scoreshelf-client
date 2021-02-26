import Vue from 'vue';
import { computed } from '@vue/composition-api';

import useValidationState, { Validation } from '@/compositions/validation/validationState';
import useSharetribePublisher from '@/compositions/sharetribe/sharetribePublisher';

export default function usePublishFormInfoValidation() {
  const { ValidationStore } = useValidationState();
  const publishFormValidation = computed(() => ValidationStore.publishForm);

  async function validateTitle(value: string) {
    const fieldSlug = 'title';
    Vue.set(ValidationStore.publishForm, fieldSlug, new Validation(fieldSlug, false));

    if (value != '') {
      publishFormValidation.value[fieldSlug].status = true;
    }
  }

  function validateRoles() {
    const fieldSlug = 'roles';
    Vue.set(ValidationStore.publishForm, fieldSlug, new Validation(fieldSlug, false));

    const { formData } = useSharetribePublisher();

    if (formData.value.role != undefined && formData.value.role.length > 0) {
      publishFormValidation.value[fieldSlug].status = true;
    }
  }

  return {
    validateTitle,
    validateRoles,
  };
}
