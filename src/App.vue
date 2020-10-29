<template>
  <div id="app">
    <Sidenav />
    <div class="main" :class="{ shiftMain: menuOpen }">
      <SearchBar />
      <router-view />
    </div>
  </div>
</template>

<script>
// import Navbar from "@/components/Navbar.vue";
import Sidenav from '@/components/Sidenav.vue';
import SearchBar from '@/components/search/SearchBar.vue';
import useSharetribe from '@/compositions/sharetribe';

import { sharetribe } from './mixins/sharetribe.js';
import { mapState } from 'vuex';

export default {
  components: {
    Sidenav,
    SearchBar,
  },
  computed: {
    ...mapState({ menuOpen: state => state.sidenav.isOpen }),
  },
  setup() {
    const { useSharetribeSdk } = useSharetribe();
    return { useSharetribeSdk };
  },
  async mounted() {
    await this.useSharetribeSdk();
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
