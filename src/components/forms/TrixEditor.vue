<template>
  <div>
    <input id="trix-input" type="hidden" :value="trixContent" />
    <trix-editor
      input="trix-input"
      @trix-change="handleNewContent"
      class="trix-editor"
    ></trix-editor>
  </div>
</template>

<script>
import Trix from 'trix';
import 'trix/dist/trix.css';

export default {
  setup() {},
};
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