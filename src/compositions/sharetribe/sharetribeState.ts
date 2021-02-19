import Vue from 'vue';
import VueCompositionAPI, { reactive, toRefs } from '@vue/composition-api';
Vue.use(VueCompositionAPI);

import { CurrentUser } from '@/@types';

interface ISharetribeStore {
  SHARETRIBE: any;
  isLoggedIn: boolean;
  currentUser: CurrentUser | undefined;
}

const SharetribeStore = reactive<ISharetribeStore>({
  SHARETRIBE: undefined,
  isLoggedIn: false,
  currentUser: undefined,
});

export default function SharetribeState() {
  function initSharetribe(payload: any) {
    SharetribeStore.SHARETRIBE = payload;
  }

  function updateIsLoggedIn(payload: boolean) {
    SharetribeStore.isLoggedIn = payload;
  }

  function updateCurrentUser(payload: CurrentUser) {
    SharetribeStore.currentUser = payload;
  }

  function logoutUser() {
    SharetribeStore.isLoggedIn = false;
    SharetribeStore.currentUser = undefined;
  }

  function getCurrentUserId() {
    return SharetribeStore.currentUser?.id.uuid;
  }

  return {
    ...toRefs(SharetribeStore),
    initSharetribe,
    updateIsLoggedIn,
    updateCurrentUser,
    logoutUser,
    getCurrentUserId,
  };
}
