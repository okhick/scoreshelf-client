<template>
  <div class="field">
    <label class="label">{{ fieldLabel }}</label>
    <div class="control has-icons-right" :id="fieldLabel">
      <input
        :class="['input', { 'is-invalid': isValid === false }, { 'is-valid': isValid === true }]"
        type="text"
        v-model="inputValue"
        @input="handleFieldChange"
      />
      <span class="icon is-small is-right">
        <font-awesome-icon icon="check" v-show="isValid === true" />
        <font-awesome-icon icon="ban" v-show="isValid === false" />
        <span class="spinner" v-show="isValid === 'isLoading'"></span>
      </span>
    </div>
    <p class="help" v-show="isValid === false">{{ helpMessage }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faCheck, faBan);

export default defineComponent({
  components: {
    FontAwesomeIcon,
  },
  props: {
    fieldLabel: String,
    init: String,
    isValid: Boolean,
    helpMessage: String,
  },
  setup(props, context) {
    const inputValue = ref<string>('');
    onMounted(() => {
      inputValue.value = props.init || '';
      handleFieldChange();
    });

    function handleFieldChange() {
      context.emit('new-validated-input', inputValue.value);
    }

    return {
      inputValue,
      handleFieldChange,
    };
  },
});
</script>
