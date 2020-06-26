<template>
  <div>
    <h1 class="title">Publish some music</h1>
    <PublishedMusic v-if="currentUserLoaded"></PublishedMusic>
  </div>
</template>

<script>
import PublishedMusic from "@/components/dashboard/publish/PublishedMusic.vue";
import { sharetribe } from "@/mixins/sharetribe.js";
import { mapState } from "vuex";

export default {
  mixins: [sharetribe],
  components: {
    PublishedMusic
  },
  data: function() {
    return {
      currentUserLoaded: false
    }
  },
  computed: {
    ...mapState(["currentUser"])
  },
  async beforeMount() {
    await this.refreshLogin();
    this.currentUserLoaded = true;
  }
}
</script>