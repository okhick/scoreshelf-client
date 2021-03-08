<template>
  <div>
    <form id="asset-dropzone" :class="['dropzone', { 'is-invalid': !uploadsValid }]"></form>
  </div>
</template>

<script lang="ts">
import { onMounted, SetupContext, ref, computed, watch } from '@vue/composition-api';

import useValidationState from '@/compositions/validation/validationState';

import Dropzone from 'dropzone';
Dropzone.autoDiscover = false;

import { Data } from '@/@types';

export default {
  setup(_: Data, { emit }: { emit: SetupContext['emit'] }) {
    const { ValidationStore } = useValidationState();
    const publishAssetsListValidation = computed(
      () => ValidationStore.publishFormAssets.list.status
    );

    // ========== Setup Dropzone ==========
    onMounted(() => {
      const dropzone = new Dropzone('#asset-dropzone', {
        dictDefaultMessage: `
          <p v-if="false">Drop your files here to upload.</p>
          <p class="help">Accepted file types: PDF, MP3, AIFF, WAV, FLAC, JPEG, PNG, ZIP</p>
        `,
        acceptedFiles:
          'application/pdf, audio/mpeg, audio/aiff, audio/wav, audio/flac, image/jpeg, image/png, application/zip',

        // ----- Disable some stuff -----
        // turn this off because we have a table for that
        previewTemplate: '<span></span>',
        // we have out own upload process, but maybe someday we can use this!
        autoProcessQueue: false,
        url: '/doNothing',
      });
      dropzone.on('addedfile', async (file) => {
        // dropzone event is emitted before file is validated, so wait 100ms before emiting to vue
        setTimeout(() => emit('file-uploaded', file), 100);
      });
    });

    // ========== Validity ==========
    const uploadsValid = ref(true);
    watch(publishAssetsListValidation, () => checkValidity());
    onMounted(() => checkValidity());

    function checkValidity() {
      if (typeof publishAssetsListValidation.value === 'boolean') {
        uploadsValid.value = publishAssetsListValidation.value;
      } else {
        uploadsValid.value = false;
      }
    }

    return {
      publishAssetsListValidation,
      uploadsValid,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
@import '../../../node_modules/dropzone/dist/dropzone.css';
.dropzone {
  background: $white;
  border: $border 1px solid;
  border-radius: 4px;

  &.is-invalid {
    border: $orange 1px solid;
  }
}
</style>

<style lang="scss">
// always show the defaultMessage because we're not using the previews
.dropzone.dz-started .dz-message {
  display: block;
}
</style>