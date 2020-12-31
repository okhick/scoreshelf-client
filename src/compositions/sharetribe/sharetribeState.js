import Vue from 'vue';
import VueCompositionAPI, { ref } from '@vue/composition-api';
Vue.use(VueCompositionAPI);

const SHARETRIBE = ref();
const isLoggedIn = ref(false);
const currentUser = ref();

export default function SharetribeState() {
  function initSharetribe(payload) {
    SHARETRIBE.value = payload;
  }

  function updateIsLoggedIn(payload) {
    isLoggedIn.value = payload;
  }

  function updateCurrentUser(payload) {
    currentUser.value = payload;
  }

  function getCurrentUserId() {
    return currentUser.value.id.uuid;
  }

  return {
    initSharetribe,
    updateIsLoggedIn,
    updateCurrentUser,
    getCurrentUserId,
    SHARETRIBE,
    isLoggedIn,
    currentUser,
  };
}
