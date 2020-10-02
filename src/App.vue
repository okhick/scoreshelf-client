<template>
  <div id="app">
    <Sidenav />
    <div class="main" :class="{shiftMain: menuOpen}">
      <router-view />
    </div>
  </div>
</template>

<script>
// import Navbar from "@/components/Navbar.vue";
import Sidenav from "@/components/Sidenav.vue";
import { sharetribe } from "./mixins/sharetribe.js";
import { mapState } from "vuex";

export default {
  components: {
    Sidenav
  },
  mixins: [sharetribe],
  computed: {
    ...mapState({ menuOpen: state => state.sidenav.isOpen })
  },
  async created() {
    await this.initSharetribeSdk();
    await this.refreshLogin();
  }
};
</script>

<style lang="scss" src="./styles/index.scss"></style>
<style lang="scss">
html,
body {
  @import "./styles/index.scss";

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
