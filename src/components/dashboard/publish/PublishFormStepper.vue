<template>
  <ul class="steps has-content-centered">
    <li
      v-for="(step, key) in steps"
      :key="key"
      @click="handleGoToStep(key), $emit('new-step-selected', key)"
      :class="[
        'steps-segment hover-pointer',
        {
          'is-active': steps[key].active,
          'has-gaps': hasGaps(step),
        },
      ]"
    >
      <span :class="['steps-marker', { 'is-hollow': !steps[key].completed }]"></span>
      <div class="steps-content">
        <p class="menu-label">{{ step.label }}</p>
        <!-- <p>{{ step.description }}</p> -->
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { onMounted, watch } from '@vue/composition-api';
import usePublishForm, { Step } from '@/compositions/form/publishForm';
import useValidationState from '@/compositions/validation/validationState';
import useDashboardState from '@/compositions/dashboard/dashboardState';

export default {
  setup() {
    const { steps, activeStep, usePublishFormNavigation } = usePublishForm();
    const { useTrackValidation } = useValidationState();
    const { publishModalEditData } = useDashboardState();

    // watch for validation changes
    watch(useTrackValidation.publishFormInfoValid, () => {
      steps.value.info.completed = !Array.isArray(useTrackValidation.publishFormInfoValid.value);
    });
    watch(useTrackValidation.publishFormAssetsValid, () => {
      steps.value.assets.completed = !Array.isArray(
        useTrackValidation.publishFormAssetsValid.value
      );
    });
    watch(useTrackValidation.publishFormFormatsValid, () => {
      steps.value.formats.completed = !Array.isArray(
        useTrackValidation.publishFormFormatsValid.value
      );
    });
    // init the stepper completeds
    onMounted(() => {
      steps.value.info.completed = !Array.isArray(useTrackValidation.publishFormInfoValid.value);
      steps.value.assets.completed = !Array.isArray(
        useTrackValidation.publishFormAssetsValid.value
      );
      steps.value.formats.completed = !Array.isArray(
        useTrackValidation.publishFormFormatsValid.value
      );
      steps.value.review.completed = publishModalEditData.value?.attributes.state === 'published';
    });

    function handleGoToStep(stepSelectedKey: string) {
      const currentStep = steps.value[activeStep.value];
      const selectedStep = steps.value[stepSelectedKey];

      // if we're going backx
      if (currentStep.index > selectedStep.index) {
        usePublishFormNavigation.gotoStep(stepSelectedKey);
        return;
      }

      // or if the next step is not disabled
      if (!useTrackValidation.nextStepDisabled.value) {
        usePublishFormNavigation.gotoStep(stepSelectedKey);
        return;
      }
      // if we're still here that step is not available.
    }

    function hasGaps(step: Step) {
      // if the next step is complete, no gaps
      if (step.completed) {
        const thisStepIndex = step.index;
        const nextStep = Object.keys(steps.value).find(
          (step) => steps.value[step].index === thisStepIndex + 1
        );
        if (nextStep && steps.value[nextStep].completed) {
          return false;
        }
      }

      if (step.label === 'Review' && step.completed) {
        return false;
      }

      return true;
    }

    return {
      steps,
      handleGoToStep,
      hasGaps,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

$steps-default-color: $tan;
$steps-completed-color: $tan;
$steps-active-color: $black;
@import 'bulma-o-steps/bulma-steps.sass';

.steps-content p.menu-label {
  margin-bottom: 0;
}
.steps-content p.menu-label + p {
  font-size: 0.8em;
}

.hover-pointer:hover {
  cursor: pointer;
}
</style>
