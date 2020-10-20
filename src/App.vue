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
import { sharetribe } from './mixins/sharetribe.js';
import { mapState } from 'vuex';

export default {
  components: {
    Sidenav,
    SearchBar,
  },
  mixins: [sharetribe],
  computed: {
    ...mapState({ menuOpen: state => state.sidenav.isOpen }),
  },
  async created() {
    await this.initSharetribeSdk();
    await this.refreshLogin();
  },
};
</script>

<style lang="scss" src="./styles/index.scss"></style>
<style lang="scss">
html,
body {
  @import './styles/index.scss';
  @import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@100;200;300;400;500;600;700&family=Ubuntu:wght@300;400;500;700&display=swap');

  background: $background;

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
