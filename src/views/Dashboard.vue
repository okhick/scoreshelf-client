<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Welcome {{ displayName }}!</h1>
      <h2 class="subtitle">This is your dashboard. Do some stuff.</h2>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      displayName: ""
    };
  },
  async mounted() {
    let currentUser = await this.SHARETRIBE.currentUser.show();
    this.displayName = currentUser.data.data.attributes.profile.displayName;
  },
  computed: {
    ...mapState(["SHARETRIBE"])
  }
};
</script>
