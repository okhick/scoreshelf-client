import useScoreshelf from '@/compositions/scoreshelf/scoreshelf';

import SharetribeState from '@/compositions/sharetribe/sharetribeState';
import DashboardState from '@/compositions/dashboard/dashboardState';

import { Publisher } from '@/@types';

export default function useScoreshelfUserPublisher() {
  const { SCORESHELF } = useScoreshelf();
  const { userProfile } = DashboardState();
  const { currentUser, SHARETRIBE } = SharetribeState();

  async function validatePublisher(name: string): Promise<boolean> {
    const isValidPublisher = await SCORESHELF.value?.get<boolean>('publisher/validatePublisher', {
      params: {
        name: name,
        sharetribe_user_id: currentUser.value?.id.uuid,
      },
    });
    if (isValidPublisher?.status === 200) {
      return isValidPublisher.data;
    } else {
      console.log(isValidPublisher);
      return false;
    }
  }

  async function hydratePublisher(id: string): Promise<Publisher | undefined> {
    const hydratedPublisher = await SCORESHELF.value?.get<Publisher>(
      '/publisher/getPublisherData',
      {
        params: {
          id: id,
        },
      }
    );

    if (hydratedPublisher?.status === 200) {
      return hydratedPublisher.data;
    } else {
      console.log(hydratePublisher);
      return undefined;
    }
  }

  async function addNewPublisher() {
    const scoreshelfRes = await SCORESHELF.value?.post<Publisher>('/publisher/addNewPublisher', {
      sharetribe_user_id: currentUser.value?.id.uuid as string,
      name: userProfile.value.publisher.name,
      about: userProfile.value.publisher.about,
    });

    if (scoreshelfRes?.status === 200) {
      const res = await SHARETRIBE.value.currentUser.updateProfile({
        publicData: {
          publisher: scoreshelfRes.data._id,
        },
      });
    } else {
      console.log(scoreshelfRes);
    }
    return;
  }

  async function updatePublisher() {
    const scoreshelfRes = await SCORESHELF.value?.post<Publisher>('/publisher/updatePublisher', {
      _id: userProfile.value.publisher._id,
      sharetribe_user_id: currentUser.value?.id.uuid as string,
      name: userProfile.value.publisher.name,
      about: userProfile.value.publisher.about,
    });

    return;
  }

  return {
    validatePublisher,
    hydratePublisher,
    addNewPublisher,
    updatePublisher,
  };
}
