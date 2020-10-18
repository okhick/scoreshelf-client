<template>
  <div>
    <h1 class="title">Hello, {{ displayName }}</h1>
    <h2 class="subtitle">I hope you are having a great day!</h2>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      displayName: '',
    };
  },
  async mounted() {
    this.displayName = this.currentUser.attributes.profile.displayName;
  },
  computed: {
    ...mapState({
      SHARETRIBE: state => state.sharetribe.SHARETRIBE,
      isLoggedIn: state => state.sharetribe.isLoggedIn,
      currentUser: state => state.sharetribe.currentUser,
    }),
  },
};
</script>
