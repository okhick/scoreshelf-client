<template>
  <div class="field">
    <label v-if="fieldLabel != ''" class="label">{{ fieldLabel }}</label>
    <div class="control has-icons-right" :id="fieldLabel">
      <input
        :class="['input', { 'is-invalid': isValid === false }, { 'is-valid': isValid === true }]"
        type="text"
        :placeholder="placeholder"
        v-model="inputValue"
        @input="handleFieldChange"
        :disabled="disabled"
      />
      <span class="icon is-small is-right">
        <font-awesome-icon icon="check" v-show="isValid === true" />
        <font-awesome-icon icon="ban" v-show="isValid === false" />
        <span class="spinner" v-show="isValid === 'isLoading'"></span>
      </span>
    </div>
    <p class="help invalid" v-show="isValid === false">{{ helpMessage }}</p>
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
    placeholder: String,
    init: null,
    isValid: Boolean,
    helpMessage: String,
    disabled: {
      default: false,
      type: Boolean,
    },
  },
  setup(props, context) {
    const inputValue = ref<string | number>('');
    onMounted(() => {
      inputValue.value = props.init || '';
      handleFieldChange();
    });

    function handleFieldChange() {
      context.emit('new-input', inputValue.value);
    }

    return {
      inputValue,
      handleFieldChange,
    };
  },
});
</script>
