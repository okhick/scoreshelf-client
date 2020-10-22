<template>
  <div>
    <h1 class="title">Publish some music</h1>
    <PublishedMusic v-if="currentUserLoaded"></PublishedMusic>
    <PublishModal></PublishModal>
  </div>
</template>

<script>
import PublishedMusic from '@/components/dashboard/publish/PublishedMusic.vue';
import PublishModal from '@/components/dashboard/publish/PublishModal.vue';
import { sharetribe } from '@/mixins/sharetribe.js';
import { mapState } from 'vuex';

export default {
  mixins: [sharetribe],
  components: {
    PublishedMusic,
    PublishModal,
  },
  data: function() {
    return {
      currentUserLoaded: false,
    };
  },
  methods: {},
  computed: {
    ...mapState({
      currentUser: state => state.sharetribe.currentUser,
    }),
  },
  async beforeMount() {
    await this.refreshLogin();
    this.currentUserLoaded = true;
  },
};
</script>
