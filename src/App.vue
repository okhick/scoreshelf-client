<template>
  <div id="app">
    <sidenav-bar />
    <search-bar />
    <div class="main" :class="{ shiftMain: isOpen }">
      <router-view />
    </div>
  </div>
</template>

<script>
// import Navbar from "@/components/Navbar.vue";
import SidenavBar from '@/components/sidenav/SidenavBar.vue';
import SearchBar from '@/components/search/SearchBar.vue';

import { onMounted } from '@vue/composition-api';
import useSharetribe from '@/compositions/sharetribe/sharetribe';

import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const SidenavStore = createNamespacedHelpers('sidenav'); // specific module name

export default {
  components: {
    SidenavBar,
    SearchBar,
  },

  setup() {
    const { useSharetribeSdk } = useSharetribe();
    const { isOpen } = SidenavStore.useState(['isOpen']);

    onMounted(async () => await useSharetribeSdk());

    return { isOpen };
  },
};
</script>

<style lang="scss" src="./styles/index.scss"></style>
<style lang="scss">
html,
body {
  @import './styles/index.scss';
  @import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@100;200;300;400;500;600;700&family=Ubuntu:wght@300;400;500;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&family=Lora:wght@400;500;600;700&display=swap');

  background: #fafafa;

  .title {
    color: $dark;
  }

  .main {
    transition: transform 0.25s ease-in-out;
    margin-left: 60px;
  }
  .shiftMain {
    transform: translate3d(180px, 0, 0);
  }
}
</style>
