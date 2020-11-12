import axios from 'axios';
import { ref } from '@vue/composition-api';

export default function useScoreshelf() {
  const axiosConfig = {
    baseURL: 'http://127.0.0.1:3000/',
    timeout: 30000,
  };
  const SCORESHELF = ref(axios.create(axiosConfig));

  return {
    SCORESHELF,
  };
}
