<template>
  <div>
    <label class="label">Publisher Name</label>
    <div class="field">
      <div class="control has-icons-right" id="publisher-name">
        <input
          :class="[
            'input',
            { 'is-invalid': userProfile.publisher.valid === false },
            { 'is-valid': userProfile.publisher.valid === true },
          ]"
          type="text"
          v-model="userProfile.publisher.name"
          @blur="handlePublisherBlur"
          @input="handlePublisherNameChange"
        />
        <span class="icon is-small is-right">
          <font-awesome-icon icon="check" v-show="userProfile.publisher.valid === true" />
          <font-awesome-icon icon="ban" v-show="userProfile.publisher.valid === false" />
          <span class="spinner" v-show="userProfile.publisher.valid === null"></span>
        </span>
      </div>
      <p class="help" v-show="userProfile.publisher.valid === false">
        This publisher is already in use.
      </p>
    </div>
    <label class="label">Publisher About</label>
    <div class="field">
      <div class="control">
        <trix-editor-component
          v-bind:init-content="userProfile.publisher.about"
          @trix-editor-change="handleNewContent"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import TrixEditorComponent from '@/components/forms/TrixEditor.vue';
import DashboardState from '@/compositions/dashboard/dashboardState';
import useScoreshelfUserPublisher from '@/compositions/scoreshelf/scoreshelfUserPublisher';

import { computed, onMounted } from '@vue/composition-api';
import debounce from 'lodash.debounce';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

interface InputChangeEvent {
  target: {
    value: string;
  };
}

library.add(faCheck, faBan);

export default {
  components: {
    TrixEditorComponent,
    FontAwesomeIcon,
  },
  setup() {
    const { userProfile } = DashboardState();

    // ========== handle Trix ==========
    function handleNewContent(event: string) {
      userProfile.value.publisher.about = event;
    }

    // ========== handle publisher name validation ==========
    const { validatePublisher } = useScoreshelfUserPublisher();

    onMounted(async () => {
      const isValid = await validatePublisher(userProfile.value.publisher.name);
      userProfile.value.publisher.valid = isValid != undefined ? isValid : null;
    });

    // wait until user stops typing for 250ms before checking
    const debounceValidation = debounce(async (value: string) => {
      userProfile.value.publisher.valid = null;
      const isValid = await validatePublisher(value);
      userProfile.value.publisher.valid = isValid != undefined ? isValid : null;
    }, 250);

    // handle name field events
    async function handlePublisherNameChange(event: Event & InputChangeEvent) {
      await debounceValidation(event.target.value);
    }
    async function handlePublisherBlur(event: Event & InputChangeEvent) {
      const isValid = await validatePublisher(event.target.value);
      userProfile.value.publisher.valid = isValid != undefined ? isValid : null;
    }

    return {
      userProfile,
      handleNewContent,
      handlePublisherNameChange,
      handlePublisherBlur,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
