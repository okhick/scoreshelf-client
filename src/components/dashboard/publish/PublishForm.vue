<template>
  <section class="modal-card-body">
    <publish-form-stepper ref="stepper" />

    <hr />

    <publish-form-info v-show="activeStep === 'info'" />
    <publish-form-format v-show="activeStep === 'formats'" />
    <publish-form-asset v-show="activeStep === 'assets'" />
    <publish-form-review v-show="activeStep === 'review'" />

    <div class="level form-nav">
      <button
        class="button level-left is-tan"
        v-show="activeStep !== 'info'"
        @click="oneStep('prev')"
      >
        <font-awesome-icon icon="angle-left" /> <span>{{ '\xa0' + '\xa0' + 'Previous' }} </span>
      </button>
      <!-- Put something here when back button is hidden to keep next of the left -->
      <div v-show="activeStep !== 'review'"></div>
      <button
        :disabled="nextStepDisabled"
        class="button level-right is-tan"
        v-show="activeStep !== 'review'"
        @click="oneStep('next')"
      >
        <span>{{ 'Next' + '\xa0' + '\xa0' }}</span> <font-awesome-icon icon="angle-right" />
      </button>
    </div>
  </section>
</template>

<script lang="ts">
import PublishFormStepper from './PublishFormStepper.vue';
import PublishFormInfo from './PublishFormInfo.vue';
import PublishFormAsset from './PublishFormAsset.vue';
import PublishFormFormat from './PublishFormFormat.vue';
import PublishFormReview from './PublishFormReview.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faAngleLeft, faAngleRight);

import { computed } from '@vue/composition-api';
import usePublishForm from '@/compositions/form/publishForm';
import useValidationState from '@/compositions/validation/validationState';

export default {
  components: {
    PublishFormStepper,
    PublishFormInfo,
    PublishFormAsset,
    PublishFormFormat,
    PublishFormReview,
    FontAwesomeIcon,
  },
  setup() {
    const { usePublishFormNavigation, activeStep } = usePublishForm();
    const { useTrackValidation } = useValidationState();

    return {
      activeStep: activeStep,
      oneStep: usePublishFormNavigation.oneStep,
      nextStepDisabled: useTrackValidation.nextStepDisabled,
    };
  },
};
</script>

<style lang="scss" scoped>
.form-nav {
  margin-bottom: 25px;
}
</style>
