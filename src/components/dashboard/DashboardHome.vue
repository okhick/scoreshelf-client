<template>
  <div>
    <h1 class="title">Hello, {{ displayName }}</h1>
    <h2 class="subtitle">I hope you are having a great day!</h2>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      displayName: "",
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
