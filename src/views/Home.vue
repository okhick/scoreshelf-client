<template>
  <div class="home"></div>
</template>

<script>
import { sharetribe } from '../mixins/sharetribe.js';

export default {
  name: 'Home',
  mixins: [sharetribe],
  async mounted() {
    this.refreshLogin();
  },
  components: {
    // Navbar
  },
};
</script>
