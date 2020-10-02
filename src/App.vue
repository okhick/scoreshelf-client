<template>
  <div id="app">
    <Sidenav />
    <router-view />
  </div>
</template>

<script>
// import Navbar from "@/components/Navbar.vue";
import Sidenav from "@/components/Sidenav.vue";
import { sharetribe } from "./mixins/sharetribe.js";

export default {
  components: {
    Sidenav
  },
  mixins: [sharetribe],
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
}
</style>
