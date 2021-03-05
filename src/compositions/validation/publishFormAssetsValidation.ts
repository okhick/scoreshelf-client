import Vue from 'vue';
import { computed, watch } from '@vue/composition-api';

import useValidationState, { Validation } from '@/compositions/validation/validationState';
import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';

import validator from 'validator';

export default function usePublishFormAssetsValidation() {
  const { ValidationStore } = useValidationState();
  const publishFormAssetsValidation = computed(() => ValidationStore.publishFormAssets);
  const { fileList, thumbnailSettings, previewSettings } = useScoreshelfPublisher();

  function initAssetsValidation() {
    validateAssetList();
    validatePreviewSelection();
    validateThumbnailSelection();
    validatePage();
  }

  function validateUploadedAssets(fileList: FileList) {
    const allowedMimeType = [
      'application/pdf',
      'audio/mpeg',
      'audio/aiff',
      'audio/wav',
      'image/jpeg',
      'image/png',
      'application/zip',
    ];
    // a FileList doesn't have a map method, so we use a for loop instead
    const checkedFiles = [];
    for (const file of fileList) {
      const fileAllowed = allowedMimeType.includes(file.type);
      checkedFiles.push({
        name: file.name,
        isAllowed: fileAllowed,
        message: fileAllowed ? null : `The file ${file.name} is not an allowed format.`,
      });
    }

    return checkedFiles;
  }

  //==========
  function validateAssetList() {
    Vue.set(ValidationStore.publishFormAssets, 'list', new Validation('list', false));

    if (fileList.value.length !== 0) {
      publishFormAssetsValidation.value['list'].status = true;
    }
  }
  watch(
    computed(() => fileList.value),
    // validate everything incase you removed a file already selected
    () => initAssetsValidation()
  );

  //==========
  function validateThumbnailSelection() {
    Vue.set(ValidationStore.publishFormAssets, 'thumbnail', new Validation('thumbnail', false));

    for (const asset in thumbnailSettings.value) {
      if (thumbnailSettings.value[asset].isThumbnail) {
        Vue.set(ValidationStore.publishFormAssets, 'thumbnail', new Validation('thumbnail', true));
        break;
      }
    }
  }
  function validatePage() {
    let pageValue;
    for (const asset in thumbnailSettings.value) {
      if (thumbnailSettings.value[asset].isThumbnail) {
        pageValue = thumbnailSettings.value[asset].page;
        break;
      }
    }

    Vue.set(ValidationStore.publishFormAssets, 'page', new Validation('page', false));

    // convert to string if we can
    pageValue = pageValue != null && pageValue !== '' ? pageValue.toString() : pageValue;

    if (pageValue != null && validator.isInt(pageValue)) {
      publishFormAssetsValidation.value['page'].status = true;
    }
  }
  watch(
    computed(() => thumbnailSettings.value),
    () => {
      validateThumbnailSelection();
      validatePage();
    },
    { deep: true }
  );

  //==========
  function validatePreviewSelection() {
    Vue.set(ValidationStore.publishFormAssets, 'preview', new Validation('preview', false));

    for (const asset in previewSettings.value) {
      if (previewSettings.value[asset].isPreview) {
        Vue.set(ValidationStore.publishFormAssets, 'preview', new Validation('preview', true));
        break;
      }
    }
  }
  watch(
    computed(() => previewSettings.value),
    () => validatePreviewSelection(),
    { deep: true }
  );

  return {
    initAssetsValidation,
    validateAssetList,
    validatePage,
    validateUploadedAssets,
  };
}
