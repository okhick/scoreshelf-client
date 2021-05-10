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
  }

  return {
    ValidationStore,
    resetPublishFormValidation,
    useTrackValidation,
  };
}

// ========== Track validation progress ==========

function trackValidation() {
  const { activeStep } = usePublishForm();

  const publishFormInfoValid = computed(() => validateAllFields('publishFormInfo'));
  const publishFormAssetsValid = computed(() => validateAllFields('publishFormAssets'));
  const publishFormFormatsValid = computed(() => validateAllFields('publishFormFormats'));

  const nextStepDisabled = computed(() => {
    switch (activeStep.value) {
      case 'info':
        if (Array.isArray(publishFormInfoValid.value)) return true;
        break;
      case 'assets':
        if (Array.isArray(publishFormAssetsValid.value)) return true;
        break;
      case 'formats':
        if (Array.isArray(publishFormFormatsValid.value)) return true;
        break;

      default:
        return false;
    }
  });

  const firstInvalidStep = computed(() => {
    if (publishFormInfoValid.value !== true) {
      return 'info';
    } else if (publishFormAssetsValid.value !== true) {
      return 'assets';
    } else if (publishFormFormatsValid.value !== true) {
      return 'formats';
    } else {
      return 'review';
    }
  });

  function validateAllFields(storeKey: string) {
    const fields = Object.keys(ValidationStore[storeKey]);
    const allFieldsValid = fields.every(
      (field) => ValidationStore[storeKey][field].status === true
    );

    if (!allFieldsValid) {
      const invalidFields: string[] = [];
      fields.forEach((field) => {
        if (ValidationStore[storeKey][field].status !== true) {
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
    publishFormInfoValid,
    publishFormAssetsValid,
    publishFormFormatsValid,
    firstInvalidStep,
  };
}
