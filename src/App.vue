<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import { mapMutations } from "vuex";
// import sharetribeSdk from "sharetribe-flex-sdk";

// import throws a webpack error so use this
const sharetribeSdk = require("sharetribe-flex-sdk");

export default {
  components: {
    Navbar
  },

  methods: {
    ...mapMutations(["initSharetribe"])
  },

  async mounted() {
    console.log(process.env)
    // Create new SDK instance
    let sharetribe = await sharetribeSdk.createInstance({
      clientId: process.env.VUE_APP_SHARETRIBE_CLIENT_ID
    });
    this.initSharetribe(sharetribe);
  },  
}
</script>

<style lang="scss" src="./styles/index.scss"></style>
