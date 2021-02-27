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
          'has-gaps': steps[key].active || !steps[key].completed,
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
import { ref } from '@vue/composition-api';
import usePublishForm from '@/compositions/form/publishForm';
import useValidationState from '@/compositions/validation/validationState';

export default {
  setup() {
    const { steps, activeStep, usePublishFormNavigation } = usePublishForm();
    const { useTrackValidation } = useValidationState();

    function handleGoToStep(stepSelectedKey: string) {
      const currentStep = steps.value[activeStep.value];
      const selectedStep = steps.value[stepSelectedKey];

      // if we're going back
      if (currentStep.index >= selectedStep.index) {
        usePublishFormNavigation.gotoStep(stepSelectedKey);
        return;
      }

      // of if the next step is not disabled
      if (!useTrackValidation.nextStepDisabled.value) {
        usePublishFormNavigation.gotoStep(stepSelectedKey);
        return;
      }
      // if we're still here that step is not available.
    }

    return {
      steps,
      handleGoToStep,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

$steps-default-color: $tan;
$steps-completed-color: $black;
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
