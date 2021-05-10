import Vue from 'vue';
import { computed, watch } from '@vue/composition-api';

import useValidationState, { Validation } from '@/compositions/validation/validationState';
import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';
import validator from 'validator';
import { ListingFormat } from '@/@types';

export default function usePublishFormFormatsValidation() {
  const { ValidationStore } = useValidationState();
  const publishFormFormatsValidation = computed(() => ValidationStore.publishFormFormats);
  const { formats } = useScoreshelfPublisher();

  function initFormatsValidation() {
    validateFormatsList();
  }

  //==========
  function validateFormatsList() {
    Vue.set(ValidationStore.publishFormFormats, 'formats', new Validation('formats', false));

    if (formats.value.length > 0) {
      publishFormFormatsValidation.value['formats'].status = true;
    }
  }
  watch(
    computed(() => formats.value),
    () => validateFormatsList()
  );

  //==========
  function validateFormat(format: ListingFormat) {
    const validation = {
      formatSelect: new Validation('formatSelect', false),
      assetList: new Validation('assetList', false),
      price: new Validation('price', false),
      completeValid: false,
    };

    if (format.format != '') validation.formatSelect.status = true;
    if (format.assets.length > 0) validation.assetList.status = true;
    if (validator.isNumeric(format.price)) validation.price.status = true;

    validation.completeValid =
      validation.formatSelect.status === true &&
      validation.assetList.status === true &&
      validation.price.status === true;

    return validation;
  }

  return {
    initFormatsValidation,
    validateFormat,
  };
}
