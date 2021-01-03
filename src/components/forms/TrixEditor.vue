<template>
  <div>
    <input id="trix-input" type="hidden" :value="trixContent" />
    <trix-editor
      v-if="trixInit"
      input="trix-input"
      class="trix-editor"
      @trix-change="handleNewContent"
    ></trix-editor>
  </div>
</template>

<script lang="ts">
import Trix from 'trix';
import 'trix/dist/trix.css';

import { ref, watch, computed, defineComponent, PropType } from '@vue/composition-api';

interface TrixChangeEvent {
  target: {
    value: string;
  };
}

export default defineComponent({
  props: {
    initContent: {
      type: String as PropType<string>,
      required: true,
    },
  },
  name: 'TrixEditorComponent',
  setup(props, context) {
    const trixContent = ref<string>('');
    const trixInit = ref<boolean>(false);

    // wait until the props are passed before loading Trix
    const initValue = computed(() => props.initContent);
    watch(initValue, (newValue) => {
      trixContent.value = newValue;
      trixInit.value = true;
    });

    function handleNewContent(event: Event & TrixChangeEvent) {
      context.emit('trix-editor-change', event.target.value);
    }

    return {
      trixContent,
      trixInit,
      handleNewContent,
    };
  },
});
</script>

<style lang="scss">
@import '@/styles/index';

// Hide a few of the menu items we won't need
trix-toolbar .trix-button-group.trix-button-group--history-tools,
trix-toolbar .trix-button.trix-button--icon.trix-button--icon-code {
  display: none;
}
// basic toolbar styling
trix-toolbar .trix-button-group {
  border-radius: 4px;
  border: 1px solid $black-light;
}
trix-toolbar .trix-button-group button {
  border-bottom: none;
}
trix-toolbar .trix-button-group button.trix-active {
  background-color: $tan;
}

// basic editor styling
trix-editor {
  border: solid 1px $black-light;
  border-radius: 4px;
  background-color: $off-white;
  color: $black;
}
trix-editor:focus {
  border: solid 1px $black;
  background-color: $white;
}
</style>
