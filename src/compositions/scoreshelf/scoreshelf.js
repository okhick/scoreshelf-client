import axios from 'axios';

// This feels like a bug. Why do I have to call this here when it's already called in main.js?
// Might be fixed in Vue3: https://stackoverflow.com/questions/61885716/uncaught-error-vue-composition-api-must-call-vue-useplugin-before-using-any/61907559#61907559
import VueCompositionAPI, { ref } from '@vue/composition-api';
import Vue from 'vue';
Vue.use(VueCompositionAPI);

import { authorizeScoreshelfApi } from '@/compositions/scoreshelf/scoreshelfAuth';

const SCORESHELF = ref();

export default function useScoreshelf() {
  const THUMBNAIL_BASE_URL = process.env.VUE_APP_THUMBNAIL_BASE_URL;
  const useAuthorizeScoreshelf = async () => await authorizeScoreshelf();

  return {
    SCORESHELF,
    THUMBNAIL_BASE_URL,
    useAuthorizeScoreshelf,
  };
}

async function authorizeScoreshelf() {
  const accessToken = await authorizeScoreshelfApi();

  SCORESHELF.value = axios.create({
    baseURL: process.env.VUE_APP_SCORESHELF_URL,
    timeout: 30000,
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  console.log('SCORESHELF authenticated');
}
