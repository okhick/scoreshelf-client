<template>
  <div>
    <label class="label">Composer(s)</label>
    <div class="field has-addons">
      <div class="control is-expanded">
        <input
          class="input"
          type="text"
          v-model.trim="composerInput"
          @keyup.enter="saveComposer"
          @blur="saveComposer"
          placeholder="Person"
        />
      </div>
      <div class="control">
        <button @click="saveCurrentUserAsComposer" class="button is-tan">
          {{ displayName }}
        </button>
      </div>
      <div class="control">
        <button @click="saveComposer" class="button is-tan">
          <font-awesome-icon icon="plus" />
        </button>
      </div>
    </div>
    <div class="field is-grouped is-grouped-multiline">
      <div class="control" v-for="(compsoer, index) in formData.composer" :key="index">
        <div class="tags has-addons">
          <div class="tag is-tan">{{ compsoer }}</div>
          <div class="tag is-delete" @click="removeComposer(index)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, computed } from '@vue/composition-api';

import useSharetribePublisher from '@/compositions/sharetribe/sharetribePublisher';
import useDashboard from '@/compositions/dashboard/dashboard';
import useSharetribe from '@/compositions/sharetribe/sharetribe';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faPlus);

export default {
  components: {
    FontAwesomeIcon,
  },
  setup() {
    const { useSharetribeState } = useSharetribe();
    const { currentUser } = useSharetribeState;

    const { formData } = useSharetribePublisher();
    const { useDashboardState } = useDashboard();
    const { publishModalEditData } = useDashboardState;
    const composerInput = ref<string>();

    onMounted(() => {
      if (publishModalEditData.value?.attributes) {
        const editComposerData = publishModalEditData?.value.attributes.publicData.composer;
        formData.value.composer = editComposerData != undefined ? editComposerData : [];
      }
    });

    const displayName = computed(() => {
      return currentUser.value?.attributes.profile.displayName || '';
    });

    function saveComposer() {
      if (composerInput.value) {
        formData.value.composer.push(composerInput.value);
      }
      composerInput.value = undefined;
    }

    function removeComposer(index: number) {
      formData.value.composer.splice(index, 1);
    }

    function saveCurrentUserAsComposer() {
      if (!formData.value.composer.includes(displayName.value)) {
        formData.value.composer.push(displayName.value);
      }
    }

    return {
      formData,
      composerInput,
      saveComposer,
      removeComposer,
      displayName,
      saveCurrentUserAsComposer,
    };
  },
};
</script>
