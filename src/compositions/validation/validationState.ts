import Vue from 'vue';
import VueCompositionAPI, { reactive, computed } from '@vue/composition-api';
Vue.use(VueCompositionAPI);

import usePublishForm from '@/compositions/form/publishForm';

// ========== Validation Class ===========

export class Validation {
  field;
  status;
  constructor(field: string, status: boolean | 'isLoading' | null) {
    this.field = field;
    this.status = status;
  }

  getStatus() {
    return this.status;
  }
}

// ========== Validation State ==========

interface IValidationStore {
  [key: string]: {
    [key: string]: Validation;
  };
}

const ValidationStore = reactive<IValidationStore>({
  publisher: {},
  publishForm: {},
});

export default function useValidationState() {
  const useTrackValidation = trackValidation();

  return {
    ValidationStore,
    useTrackValidation,
  };
}

// ========== Track validation progress ==========

function trackValidation() {
  const { activeStep } = usePublishForm();

  const publishFormValid = computed(() => validateAllFields('publishForm'));

  const nextStepDisabled = computed(() => {
    switch (activeStep.value) {
      case 'info':
        if (Array.isArray(publishFormValid.value)) return true;

      default:
        return false;
    }
  });

  function validateAllFields(form: string) {
    const fields = Object.keys(ValidationStore[form]);
    const allFieldsValid = fields.every(
      (field) => ValidationStore.publishForm[field].status === true
    );

    if (!allFieldsValid) {
      const invalidFields: string[] = [];
      fields.forEach((field) => {
        if (ValidationStore.publishForm[field].status !== true) {
          invalidFields.push(field);
        }
      });
      return invalidFields;
    } else {
      return true;
    }
  }

  return {
    nextStepDisabled,
    publishFormValid,
  };
}
