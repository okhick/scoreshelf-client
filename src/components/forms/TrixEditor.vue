<template>
  <div>
    <input id="trix-input" type="hidden" :value="initContent" />
    <trix-editor
      ref="trix"
      input="trix-input"
      class="trix-editor trix-content"
      @trix-change="handleNewContent"
      @trix-initialize="initTrix"
    ></trix-editor>
  </div>
</template>

<script lang="ts">
import 'trix/dist/trix.js';
import 'trix/dist/trix.css';

import { ref, defineComponent, PropType, SetupContext } from '@vue/composition-api';

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
  setup(props, context: SetupContext) {
    // Wait until fully mounted to init, otherwise it won't render
    const trix = ref();
    function initTrix() {
      trix.value.editor.loadHTML(props.initContent);
    }

    function handleNewContent(event: Event & TrixChangeEvent) {
      context.emit('trix-editor-change', event.target.value);
    }

    return {
      trix,
      initTrix,
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
