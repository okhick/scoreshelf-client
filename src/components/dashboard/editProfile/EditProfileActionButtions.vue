<template>
  <div class="level">
    <div class="level-left">
      <button class="button level-item" @click="$emit('edit-clicked')" v-show="!isVisible">
        Edit {{ editName }}
      </button>

      <button
        class="button level-item"
        :class="{ 'is-loading': isLoading }"
        v-show="isVisible"
        @click="$emit('update-clicked')"
      >
        Update {{ editName }}
      </button>
      <button class="button is-tan level-item" @click="$emit('cancel-clicked')" v-show="isVisible">
        Cancel
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: {
    isVisible: {
      required: true,
      type: Boolean,
    },
    isLoading: {
      required: true,
      type: Boolean,
    },
    editName: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    // do i even need to do this?
    return {};
  },
});
</script>