<template>
  <ul class="steps">
    <li
      v-for="(step, key) in formStep"
      :key="key"
      @click="gotoStep(key), $emit('new-step-selected', key)"
      :class="[
        'steps-segment hover-pointer',
        {
          'is-active': formStep[key].active,
          'has-gaps': formStep[key].active || !formStep[key].completed,
        },
      ]"
    >
      <span :class="['steps-marker', { 'is-hollow': !formStep[key].completed }]"></span>
      <div class="steps-content">
        <p class="menu-label">{{ step.label }}</p>
        <p>{{ step.description }}</p>
      </div>
    </li>
  </ul>
</template>

<script>
import { ref } from '@vue/composition-api';

export default {
  setup() {
    const formStep = ref({
      info: {
        active: true,
        completed: false,
        label: 'Info',
        description: 'General information about the publication',
      },
      assets: {
        active: false,
        completed: false,
        label: 'Assets',
        description: 'Upload files for the publication',
      },
      formats: {
        active: false,
        completed: false,
        label: 'Formats',
        description: 'Create products based on this publication',
      },
      review: {
        active: false,
        completed: false,
        label: '',
        description: '',
      },
    });

    function gotoStep(stepSelected) {
      for (const step in formStep.value) {
        if (step === stepSelected) {
          formStep.value[step].active = true;
        } else {
          formStep.value[step].active = false;
        }
      }
    }

    return {
      formStep,
      gotoStep,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

$steps-default-color: $tan;
$steps-completed-color: $black;
$steps-active-color: $black;
@import 'bulma-o-steps/bulma-steps.scss';

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
