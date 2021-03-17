<template>
  <section>
    <label class="label">Tags</label>
    <div class="field has-addons">
      <div class="control is-expanded">
        <input
          class="input"
          type="text"
          v-model="tagInput"
          placeholder="Neo-baroque"
          @keyup.enter="addTag"
        />
      </div>
      <div class="control">
        <button class="button is-tan" @click="addTag">
          <font-awesome-icon icon="plus" />
        </button>
      </div>
    </div>
    <div class="field is-grouped is-grouped-multiline">
      <div class="control" v-for="(tag, index) in formData.tags" :key="index">
        <div class="tags has-addons">
          <div class="tag is-tan">{{ tag }}</div>
          <div class="tag is-delete" @click="removeTag(index)"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import useSharetribePublisher from '@/compositions/sharetribe/sharetribePublisher';
import { ref } from '@vue/composition-api';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faPlus);

export default {
  components: {
    FontAwesomeIcon,
  },
  setup() {
    const { formData } = useSharetribePublisher();
    const tagInput = ref<string>();

    function addTag() {
      if (tagInput.value && tagInput.value !== '') {
        formData.value.tags.push(tagInput.value);
        tagInput.value = '';
      }
    }
    function removeTag(index: number) {
      formData.value.tags.splice(index, 1);
    }

    return {
      formData,
      tagInput,
      addTag,
      removeTag,
    };
  },
};
</script>
