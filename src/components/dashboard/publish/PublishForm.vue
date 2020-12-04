<template>
  <section class="modal-card-body">
    <ul class="steps">
      <li
        v-for="(step, key) in formStep"
        :key="key"
        @click="gotoStep(key)"
        :class="[
          'steps-segment hover-pointer',
          {
            'is-active': formStep[key].active,
            'has-gaps is-hollow': formStep[key].active || !formStep[key].completed,
          },
        ]"
      >
        <span class="steps-marker"></span>
        <div class="steps-content">
          <p class="menu-label">{{ step.label }}</p>
          <p>{{ step.description }}</p>
        </div>
      </li>
    </ul>

    <div class="field">
      <label class="label">Title</label>
      <div class="control">
        <input class="input" type="text" v-model="formData.title" placeholder="Title" />
      </div>
    </div>

    <div class="field">
      <label class="label">Subtitle</label>
      <div class="control">
        <input class="input" type="text" v-model="formData.subtitle" placeholder="Subtitle" />
      </div>
    </div>

    <hr />

    <div class="field">
      <label class="label">Composer(s)</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model="formData.composer"
          placeholder="Person 1, Person 2"
        />
      </div>
    </div>

    <div class="field">
      <label class="label">Year of Completion</label>
      <div class="control">
        <input class="input" type="text" v-model="formData.year" placeholder="2020" />
      </div>
    </div>

    <div class="field">
      <label class="label">Duration</label>
      <div class="control">
        <input class="input" type="text" v-model="formData.duration" placeholder="6:20" />
      </div>
    </div>

    <div class="field">
      <label class="label">Commission or Dedication</label>
      <div class="control">
        <input class="input" type="text" v-model="formData.commission" placeholder="to Mother" />
      </div>
    </div>

    <div class="field">
      <label class="label">Program Notes</label>
      <div class="control">
        <textarea class="textarea" v-model="formData.programNotes" />
      </div>
    </div>

    <hr />

    <div class="field">
      <label class="label">Ensemble</label>
      <div class="control">
        <input class="input" type="text" v-model="formData.ensemble" placeholder="String Quartet" />
      </div>
    </div>

    <div class="field">
      <label class="label">Instrumentation</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model="formData.instrumentation"
          placeholder="Violin 1, Violin 2, Viola, Cello"
        />
      </div>
    </div>

    <hr />

    <publish-form-format ref="formats" />

    <hr />

    <publish-form-asset ref="assets" />
  </section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const dashboardStore = createNamespacedHelpers('dashboard'); // specific module name

import PublishFormFormat from './PublishFormFormat';
import PublishFormAsset from './PublishFormAsset';

import { computed, ref } from '@vue/composition-api';

import useSharetribePublisher from '@/compositions/sharetribe/sharetribePublisher';

export default {
  components: {
    PublishFormFormat,
    PublishFormAsset,
  },
  setup() {
    const { formData } = useSharetribePublisher();
    const { publishModalEditData } = dashboardStore.useState(['publishModalEditData']);
    initFormData();

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

    // ========== Methods ==========
    function initFormData() {
      if (publishModalEditData.value != null && publishModalEditData.value?.attributes) {
        formData.value.title = publishModalEditData.value.attributes.title;
        formData.value.subtitle = publishModalEditData.value.attributes.publicData.subtitle;
        formData.value.composer = publishModalEditData.value.attributes.publicData.composer;
        formData.value.commission = publishModalEditData.value.attributes.publicData.commission;
        formData.value.duration = publishModalEditData.value.attributes.publicData.duration;
        formData.value.programNotes = publishModalEditData.value.attributes.publicData.programNotes;
        formData.value.year = publishModalEditData.value.attributes.publicData.year;
        formData.value.ensemble = publishModalEditData.value.attributes.publicData.ensemble;
        formData.value.instrumentation =
          publishModalEditData.value.attributes.publicData.instrumentation;
      } else {
        for (const field in formData.value) {
          formData.value[field] = '';
        }
      }
    }

    return {
      formData,
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

.bottom-margin {
  margin-bottom: 24px;
}
.hover-pointer:hover {
  cursor: pointer;
}
.page-picker {
  width: 15px;
}
</style>
