import Vue from 'vue';
import VueCompositionAPI, { reactive, computed, onMounted } from '@vue/composition-api';
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
  publishFormInfo: {},
  publishFormAssets: {},
  publishFormFormats: {},
});

export default function useValidationState() {
  const useTrackValidation = trackValidation();

  function resetPublishFormValidation() {
    ValidationStore.publishFormInfo = {};
    ValidationStore.publishFormAssets = {};
    ValidationStore.publishFormFormats = {};
    useTrackValidation.initValidation();
  }

  return {
    ValidationStore,
    resetPublishFormValidation,
    useTrackValidation,
  };
}

// ========== Track validation progress ==========

function trackValidation() {
  const { activeStep, steps } = usePublishForm();

  const publishFormInfoValid = computed(() => validateAllFields('publishFormInfo'));

  const nextStepDisabled = computed(() => {
    switch (activeStep.value) {
      case 'info':
        if (Array.isArray(publishFormInfoValid.value)) return true;

      default:
        return false;
    }
  });

  function validateAllFields(storeKey: string) {
    const fields = Object.keys(ValidationStore[storeKey]);
    const allFieldsValid = fields.every(
      (field) => ValidationStore.publishFormInfo[field].status === true
    );

    if (!allFieldsValid) {
      const invalidFields: string[] = [];
      fields.forEach((field) => {
        if (ValidationStore.publishFormInfo[field].status !== true) {
          invalidFields.push(field);
        }
      });
      steps.value[activeStep.value].completed = false;
      return invalidFields;
    } else {
      steps.value[activeStep.value].completed = true;
      return true;
    }
  }

  function initValidation() {
    validateAllFields('publishFormInfo');
    validateAllFields('publishFormAssets');
    validateAllFields('publishFormFormats');
  }

  return {
    nextStepDisabled,
    publishFormInfoValid,
    initValidation,
  };
}
