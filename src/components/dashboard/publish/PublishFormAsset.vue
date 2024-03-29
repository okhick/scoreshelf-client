<template>
  <div class="bottom-margin">
    <dropzone @file-uploaded="processDropzoneUpload" ref="dropzoneRef" />

    <asset-table
      v-show="fileList.length > 0"
      :fileList="fileList"
      @remove-file="removeUpload"
    ></asset-table>

    <div id="asset-options-grid" v-show="fileList.length > 0">
      <!-- preview -->
      <div id="preview" class="label"><label>Preview</label></div>
      <div id="preview" class="field">
        <div class="control">
          <div class="select is-fullwidth">
            <select
              @change="newPreviewSelected"
              v-model="previewAsset"
              :class="{ 'is-invalid': !publishAssetsValidation.preview.status }"
            >
              <option value="" disabled selected hidden>Choose uploaded file...</option>
              <option v-for="file in Object.keys(previewSettings)" :key="file">
                {{ file }}
              </option>
            </select>
          </div>
        </div>
        <p class="help">Choose a document to be shown as the preview on the publication page.</p>
      </div>

      <div id="audio-preview" class="label"><label>Audio Preview</label></div>
      <div id="audio-preview" class="field">
        <div class="control">
          <div class="select is-fullwidth">
            <select
              :disabled="Object.keys(audioPreviewSettings).length === 0"
              v-model="audioPreviewAsset"
              @change="newAudioPreviewAssetSelected"
            >
              <!-- :class="{ 'is-invalid': !publishAssetsValidation.preview.status }" -->
              <option value="" disabled selected hidden>Choose uploaded file...</option>
              <option v-for="file in Object.keys(audioPreviewSettings)" :key="file">
                {{ file }}
              </option>
            </select>
          </div>
        </div>
        <p class="help">Choose an audio file to be shown on the publication page.</p>
      </div>

      <!-- thumbnail -->
      <div id="thumbnail" class="label"><label>Thumbnail</label></div>
      <div id="thumbnail" class="field">
        <div class="control is-expanded">
          <div class="select is-fullwidth">
            <select
              @change="newThumbSelected"
              v-model="thumbAsset"
              :class="{ 'is-invalid': !publishAssetsValidation.thumbnail.status }"
            >
              <option value="" disabled selected hidden>Choose uploaded file...</option>
              <option v-for="file in Object.keys(thumbnailSettings)" :key="file">
                {{ file }}
              </option>
            </select>
          </div>
        </div>
        <p class="help">Pick a document and a page and we'll generate a thumbnail image for you.</p>
      </div>

      <!-- page number -->
      <div id="page" class="label"><label>Page No.</label></div>
      <validated-field
        v-if="thumbPage != null"
        :init="thumbPage"
        id="page"
        class="field"
        :disabled="!publishAssetsValidation.thumbnail.status"
        placeholder="Page"
        fieldLabel=""
        :isValid="publishAssetsValidation.page.status"
        @new-input="handlePageInput"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, ref } from '@vue/composition-api';
import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';
import useValidationState from '@/compositions/validation/validationState';
import usePublishFormAssetsValidation from '@/compositions/validation/publishFormAssetsValidation';

import AssetTable from '@/components/forms/AssetTable.vue';
import ValidatedField from '@/components/forms/ValidatedField.vue';
import Dropzone from '@/components/forms/Dropzone.vue';

import { DropzoneFile } from 'dropzone';

export default {
  components: {
    AssetTable,
    ValidatedField,
    Dropzone,
  },

  setup() {
    const {
      // States
      fileList,
      thumbnailSettings,
      previewSettings,
      audioPreviewSettings,
      // Methods
      useFileStateManagement,
    } = useScoreshelfPublisher();

    const { validatePage } = usePublishFormAssetsValidation();
    const { ValidationStore } = useValidationState();
    const publishAssetsValidation = computed(() => ValidationStore.publishFormAssets);

    onMounted(() => {
      initPreviewSelector();
      initThumbSelector();
      initAudioPreviewSelector();
    });

    // ---------- Methods ----------
    // ---- Actions for the dropzone ----
    const dropzoneRef = ref();
    function processDropzoneUpload(file: DropzoneFile) {
      if (file.accepted) {
        useFileStateManagement.processUpload(file);
        thumbPage.value = '';
        dropzoneRef.value.uploadsValid = true;
      } else {
        dropzoneRef.value.uploadsValid = false;
      }
    }
    // ---- Actions for the asset table ----
    function removeUpload(fileName: string) {
      fileList.value.forEach((file) => {
        if (file.asset_name === fileName) {
          if (file.isStored) {
            useFileStateManagement.setFileToBeRemoved(fileName);
            useFileStateManagement.removeFileFromFileList(fileName);
          } else {
            useFileStateManagement.removeFileFromFileList(fileName);
          }
        }
      });
      if (fileName === previewAsset.value) previewAsset.value = '';
      if (fileName === thumbAsset.value) {
        thumbAsset.value = '';
        thumbPage.value = '';
      }
    }

    // ---- Actions for the selectors below ----
    const thumbAsset = ref<string | null>('');
    const thumbPage = ref<number | string | null>(null);

    function initThumbSelector() {
      if (thumbnailSettings.value) {
        for (let asset in thumbnailSettings.value) {
          if (thumbnailSettings.value[asset].isThumbnail) {
            thumbAsset.value = asset;
            thumbPage.value = thumbnailSettings.value[asset].page;
            validatePage();
          }
        }
      }
    }
    function newThumbSelected() {
      for (let asset in thumbnailSettings.value) {
        if (asset === thumbAsset.value) {
          thumbnailSettings.value[asset].isThumbnail = true;
          thumbnailSettings.value[asset].page = thumbPage.value;
        } else {
          thumbnailSettings.value[asset].isThumbnail = false;
          thumbnailSettings.value[asset].page = null;
        }
      }
    }
    function newThumbPage() {
      for (let asset in thumbnailSettings.value) {
        if (thumbnailSettings.value[asset].isThumbnail) {
          thumbnailSettings.value[asset].page = thumbPage.value;
        } else {
          thumbnailSettings.value[asset].page = null;
        }
      }
    }
    function handlePageInput(value: string) {
      thumbPage.value = value;
      newThumbPage();
    }

    const previewAsset = ref('');
    function initPreviewSelector() {
      if (previewSettings.value) {
        for (let asset in previewSettings.value) {
          if (previewSettings.value[asset].isPreview) {
            previewAsset.value = asset;
          }
        }
      }
    }
    function newPreviewSelected() {
      for (let asset in previewSettings.value) {
        if (asset === previewAsset.value) {
          previewSettings.value[asset].isPreview = true;
        } else {
          previewSettings.value[asset].isPreview = false;
        }
      }
    }

    const audioPreviewAsset = ref('');
    /**
     * THIS ONLY LOADS UP ONE AUDIO FILE INTO THE SELECT IF THERE'S MORE THAN ONE.
     * TODO: NEED TO SAVE FILETYPE TO DO PROPERLY...
     */
    function initAudioPreviewSelector() {
      const keys = Object.keys(audioPreviewSettings.value);
      if (keys.length > 0) {
        audioPreviewAsset.value = keys[0];
      }
    }

    function newAudioPreviewAssetSelected() {
      for (let asset in audioPreviewSettings.value) {
        if (asset === audioPreviewAsset.value) {
          audioPreviewSettings.value[asset].isAudioPreview = true;
        } else {
          audioPreviewSettings.value[asset].isAudioPreview = false;
        }
      }
    }

    return {
      // ---- Data ----
      fileList,
      previewSettings,
      previewAsset,
      thumbnailSettings,
      thumbAsset,
      thumbPage,
      audioPreviewSettings,
      audioPreviewAsset,
      newAudioPreviewAssetSelected,
      publishAssetsValidation,
      dropzoneRef,
      // ---- Methods ----
      removeUpload,
      newThumbSelected,
      newThumbPage,
      // processUploadEvent,
      processDropzoneUpload,
      newPreviewSelected,
      handlePageInput,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

#asset-options-grid {
  display: grid;
  grid-template-columns: auto 55% auto auto;
  grid-template-rows: auto auto auto;
  column-gap: 8px;

  .label {
    padding-top: 8px;
  }

  #preview.label {
    grid-row: 1;
    grid-column: 1;
  }
  #preview.field {
    grid-row: 1;
    grid-column-start: 2;
    grid-column-end: 5;
  }
  #audio-preview.label {
    grid-row: 2;
    grid-column: 1;
  }
  #audio-preview.field {
    grid-row: 2;
    grid-column-start: 2;
    grid-column-end: 5;
  }
  #thumbnail.label {
    grid-row: 3;
    grid-column: 1;
  }
  #thumbnail.field {
    grid-row: 3;
    grid-column: 2;
  }
  #page.label {
    grid-row: 3;
    grid-column: 3;
  }
  #page.field {
    grid-row: 3;
    grid-column: 4;
  }
}

span.file-cta.is-invalid {
  border-color: $orange;
}

.page-picker {
  width: 15px;
}
.bottom-margin {
  margin-bottom: 25px;
}
</style>
