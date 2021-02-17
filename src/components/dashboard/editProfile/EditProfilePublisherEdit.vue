<template>
  <div>
    <label class="label">Publisher Name</label>
    <div class="field">
      <div class="control has-icons-right" id="publisher-name">
        <input
          :class="[
            'input',
            { 'is-invalid': publisherValidationStore.publisher_name.status === false },
            { 'is-valid': publisherValidationStore.publisher_name.status === true },
          ]"
          type="text"
          v-model="userProfile.publisher.name"
          @blur="handlePublisherBlur"
          @input="handlePublisherNameChange"
        />
        <span class="icon is-small is-right">
          <font-awesome-icon
            icon="check"
            v-show="publisherValidationStore.publisher_name.status === true"
          />
          <font-awesome-icon
            icon="ban"
            v-show="publisherValidationStore.publisher_name.status === false"
          />
          <span
            class="spinner"
            v-show="publisherValidationStore.publisher_name.status === 'isLoading'"
          ></span>
        </span>
      </div>
      <p class="help" v-show="publisherValidationStore.publisher_name.status === false">
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

import usePublisherValidation from '@/compositions/validation/publisherValidation';
import useValidationState from '@/compositions/validation/validationState';

import { computed, onBeforeMount } from '@vue/composition-api';
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
    const { validatePublisherName } = usePublisherValidation();
    const { ValidationStore } = useValidationState();
    const publisherValidationStore = computed(() => ValidationStore.value.publisher);

    onBeforeMount(async () => await validatePublisherName(userProfile.value.publisher.name));

    // wait until user stops typing for 250ms before checking
    const debounceValidation = debounce(async (value: string) => {
      await validatePublisherName(value);
    }, 250);

    // handle name field events
    async function handlePublisherNameChange(event: Event & InputChangeEvent) {
      await debounceValidation(event.target.value);
    }
    async function handlePublisherBlur(event: Event & InputChangeEvent) {
      await validatePublisherName(event.target.value);
    }

    return {
      userProfile,
      handleNewContent,
      handlePublisherNameChange,
      handlePublisherBlur,
      publisherValidationStore,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
