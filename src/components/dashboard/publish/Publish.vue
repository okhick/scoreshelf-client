<template>
  <div>
    <h1 class="title">Publish Music</h1>
    <PublishedMusic v-if="currentUserLoaded"></PublishedMusic>
    <PublishModal></PublishModal>
  </div>
</template>

<script>
import PublishedMusic from '@/components/dashboard/publish/PublishedMusic.vue';
import PublishModal from '@/components/dashboard/publish/PublishModal.vue';
import useSharetribe from '@/compositions/sharetribe';
import { mapState } from 'vuex';

export default {
  setup() {
    const { useRefreshLogin } = useSharetribe();
    return { useRefreshLogin };
  },
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
    await this.useRefreshLogin();
    this.currentUserLoaded = true;
  },
};
</script>
