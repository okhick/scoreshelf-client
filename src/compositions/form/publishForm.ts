import { reactive, toRefs } from '@vue/composition-api';

// ============================================================================

export interface Step {
  index: number;
  active: boolean;
  completed: boolean;
  label: string;
  description: string;
}

interface IPublishFormState {
  steps: {
    [key: string]: Step;
  };
  activeStep: string;
}

const PublishFormState = reactive<IPublishFormState>({
  steps: {
    info: {
      index: 0,
      active: true,
      completed: false,
      label: 'Info',
      description: 'General information about the publication',
    },
    assets: {
      index: 1,
      active: false,
      completed: false,
      label: 'Assets',
      description: 'Upload files for the publication',
    },
    formats: {
      index: 2,
      active: false,
      completed: false,
      label: 'Formats',
      description: 'Create products based on this publication',
    },
    review: {
      index: 3,
      active: false,
      completed: false,
      label: 'Review',
      description: '',
    },
  },
  activeStep: 'info',
});

// ============================================================================

export default function usePublishForm() {
  const usePublishFormNavigation = ScoreshelfPublishFormNavigation();

  return {
    ...toRefs(PublishFormState),
    usePublishFormNavigation,
  };
}

// ============================================================================
// ============================================================================
// ============================================================================

function ScoreshelfPublishFormNavigation() {
  function gotoStep(stepSelected: string) {
    for (const step in PublishFormState.steps) {
      if (step === stepSelected) {
        PublishFormState.steps[step].active = true;
        PublishFormState.activeStep = step;
      } else {
        PublishFormState.steps[step].active = false;
      }
    }
  }

  function oneStep(direction: 'next' | 'prev') {
    // start with current index
    let nextStepIndex = PublishFormState.steps[PublishFormState.activeStep].index;
    switch (direction) {
      case 'next':
        nextStepIndex += 1;
        break;
      case 'prev':
        nextStepIndex -= 1;
        break;
    }

    let nextStep: string = PublishFormState.activeStep;
    for (const step in PublishFormState.steps) {
      if (PublishFormState.steps[step].index === nextStepIndex) nextStep = step;
    }
    gotoStep(nextStep);
  }

  return { gotoStep, oneStep };
}
