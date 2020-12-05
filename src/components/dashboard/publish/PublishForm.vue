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
        class="button level-right is-tan"
        v-show="activeStep !== 'review'"
        @click="oneStep('next')"
      >
        <span>{{ 'Next' + '\xa0' + '\xa0' }}</span> <font-awesome-icon icon="angle-right" />
      </button>
    </div>
  </section>
</template>

<script>
import PublishFormStepper from './PublishFormStepper';
import PublishFormInfo from './PublishFormInfo';
import PublishFormAsset from './PublishFormAsset';
import PublishFormFormat from './PublishFormFormat';
import PublishFormReview from './PublishFormReview';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faAngleLeft, faAngleRight);

import { ref } from '@vue/composition-api';
import useSharetribePublisher from '@/compositions/scoreshelf/scoreshelfPublisher.js';

export default {
  components: {
    PublishFormStepper,
    PublishFormInfo,
    PublishFormAsset,
    PublishFormFormat,
    PublishFormReview,
    FontAwesomeIcon,
  },
  setup(_, context) {
    const { useScoreshelfPublishFormNavigation, activeStep } = useSharetribePublisher();

    return {
      activeStep: activeStep,
      oneStep: useScoreshelfPublishFormNavigation.oneStep,
    };
  },
};
</script>

<style lang="scss" scoped>
.form-nav {
  margin-bottom: 25px;
}
</style>
