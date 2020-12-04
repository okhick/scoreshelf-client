<template>
  <section class="modal-card-body">
    <publish-form-stepper />

    <publish-form-info ref="info" />

    <hr />

    <publish-form-format ref="formats" />

    <hr />

    <publish-form-asset ref="assets" />
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
  setup() {},
};
</script>

<style lang="scss" scoped>
</style>
