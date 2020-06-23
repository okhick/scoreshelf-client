<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import { sharetribe } from "./mixins/sharetribe.js";

export default {
  components: {
    Navbar
  },
  mixins: [sharetribe],
  async created() {
    await this.initSharetribeSdk();
    await this.refreshLogin();
  }
};
</script>

<style lang="scss" src="./styles/index.scss"></style>
