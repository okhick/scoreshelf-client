<template>
  <section class="modal-card-body">
    <publish-form-stepper ref="stepper" @new-step-selected="changeStep" />

    <hr />

    <publish-form-info v-show="activeStep === 'info'" />

    <publish-form-format v-show="activeStep === 'formats'" />

    <publish-form-asset v-show="activeStep === 'assets'" />
  </section>
</template>

<script>
import PublishFormStepper from './PublishFormStepper';
import PublishFormInfo from './PublishFormInfo';
import PublishFormAsset from './PublishFormAsset';
import PublishFormFormat from './PublishFormFormat';

import { ref } from '@vue/composition-api';

export default {
  components: {
    PublishFormStepper,
    PublishFormInfo,
    PublishFormAsset,
    PublishFormFormat,
  },
  setup(_, context) {
    const activeStep = ref('info');

    function changeStep(newStep) {
      activeStep.value = newStep;
    }

    return { activeStep, changeStep };
  },
};
</script>

<style lang="scss" scoped>
</style>
