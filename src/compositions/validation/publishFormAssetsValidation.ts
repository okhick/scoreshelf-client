import Vue from 'vue';
import { computed, watch } from '@vue/composition-api';

import useValidationState, { Validation } from '@/compositions/validation/validationState';
import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';

export default function usePublishFormAssetsValidation() {
  const { ValidationStore } = useValidationState();
  const publishFormAssetsValidation = computed(() => ValidationStore.publishFormAssets);
  const { fileList, thumbnailSettings } = useScoreshelfPublisher();

  function initAssetsValidation() {
    validateAssetList();
    validatePage();
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
    () => validateAssetList()
  );

  //==========
  function validatePage() {
    let pageValue;
    for (const asset in thumbnailSettings.value) {
      if (thumbnailSettings.value[asset].isThumbnail) {
        pageValue = thumbnailSettings.value[asset].page;
        break;
      }
    }

    Vue.set(ValidationStore.publishFormAssets, 'page', new Validation('page', false));

    // This validation process is dumb. Make sure it's not a string, then convert to string to we can regex it to digits?!
    if (pageValue != null && pageValue !== '') {
      if (/^[0-9]*$/.test(pageValue.toString())) {
        publishFormAssetsValidation.value['page'].status = true;
      }
    }
  }
  watch(
    computed(() => thumbnailSettings.value),
    () => validatePage(),
    { deep: true }
  );
  return {
    initAssetsValidation,
    validateAssetList,
    validatePage,
  };
}
