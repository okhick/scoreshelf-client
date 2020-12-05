import { reactive, toRefs } from '@vue/composition-api';

// ============================================================================

const PublishFormState = reactive({
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
  function gotoStep(stepSelected) {
    for (const step in PublishFormState.steps) {
      if (step === stepSelected) {
        PublishFormState.steps[step].active = true;
        PublishFormState.activeStep = step;
      } else {
        PublishFormState.steps[step].active = false;
      }
    }
  }

  function oneStep(direction) {
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

    let nextStep;
    for (const step in PublishFormState.steps) {
      if (PublishFormState.steps[step].index === nextStepIndex) nextStep = step;
    }
    gotoStep(nextStep);
  }

  return { gotoStep, oneStep };
}
