import Vue from 'vue';
import useScoreshelf from '@/compositions/scoreshelf/scoreshelf';
import SharetribeState from '@/compositions/sharetribe/sharetribeState';

import useValidationState, { Validation } from '@/compositions/validation/validationState';

export default function usePublisherValidation() {
  const { ValidationStore } = useValidationState();

  async function validatePublisherName(value: string) {
    const { SCORESHELF } = useScoreshelf();
    const { currentUser } = SharetribeState();
    const fieldSlug = 'publisher_name';

    const publisherValidation = ValidationStore.publisher;
    Vue.set(ValidationStore.publisher, fieldSlug, new Validation(fieldSlug, 'isLoading'));

    const isValidPublisher = await SCORESHELF.value?.get<boolean>('publisher/validatePublisher', {
      params: {
        name: value,
        sharetribe_user_id: currentUser.value?.id.uuid,
      },
    });

    const isValid = isValidPublisher?.status === 200 ? isValidPublisher.data : false;
    publisherValidation[fieldSlug].status = isValid;

    return publisherValidation;
  }

  return {
    validatePublisherName,
  };
}
