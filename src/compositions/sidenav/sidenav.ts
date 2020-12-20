import Vue from 'vue';
import VueCompositionAPI, { ref } from '@vue/composition-api';
Vue.use(VueCompositionAPI);

const isOpen = ref(false);

export default function useSidenav() {
  function toggleSidenav(): void {
    isOpen.value = !isOpen.value;
  }
  function closeSidenav(): void {
    isOpen.value = false;
  }

  return {
    isOpen,
    toggleSidenav,
    closeSidenav,
  };
}
