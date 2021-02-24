import Vue from 'vue';
import VueCompositionAPI, { reactive } from '@vue/composition-api';
Vue.use(VueCompositionAPI);

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

const ValidationStore = reactive<any>({
  publisher: {},
  publishForm: {},
});

export default function useValidationState() {
  return {
    ValidationStore,
  };
}
