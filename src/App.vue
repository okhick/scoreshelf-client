<template>
  <div id="app">
    <sidenav-bar />
    <search-bar :class="{ 'menu-shift': menuIsShowing }" />
    <div
      :class="[
        'main',
        {
          'menu-shift': menuIsShowing,
          'search-bar-shift': !searchbarIsShowing,
        },
      ]"
    >
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
const searchStore = createNamespacedHelpers('search'); // specific module name

export default {
  components: {
    SidenavBar,
    SearchBar,
  },

  setup() {
    const { useSharetribeSdk } = useSharetribe();
    const { isOpen } = SidenavStore.useState(['isOpen']);
    const { searchbarIsShowing } = searchStore.useState(['searchbarIsShowing']);
    console.log(searchbarIsShowing);

    onMounted(async () => await useSharetribeSdk());

    return { menuIsShowing: isOpen, searchbarIsShowing: searchbarIsShowing };
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

  background: $off-white;

  .title {
    color: $dark;
  }

  .main {
    transition: transform 0.25s ease-in-out;
    margin-left: 60px;
  }
  .menu-shift {
    transform: translateX(180px);
  }
  .search-bar-shift {
    transform: translateY(-75px);
  }
  .menu-shift.search-bar-shift {
    transform: translate(180px, -75px);
  }
}
</style>
