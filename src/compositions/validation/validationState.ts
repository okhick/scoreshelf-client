import { ref } from '@vue/composition-api';

// ========== Validation Class ===========

export class Validation {
  field;
  status;
  constructor(field: string, status: boolean | 'isLoading' | null) {
    this.field = field;
    this.status = status;
  }
}

// ========== Validation State ==========

interface IValidationStore {
  [key: string]: {
    [key: string]: Validation;
  };
}

const ValidationStore = ref<IValidationStore>({
  publisher: {},
});

export default function useValidationState() {
  return {
    ValidationStore,
  };
}
