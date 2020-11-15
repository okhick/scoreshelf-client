<template>
  <div>
    <h1 class="title">Publish Music</h1>
    <publish-table />
    <publish-modal />
  </div>
</template>

<script>
import PublishTable from '@/components/dashboard/publish/PublishTable.vue';
import PublishModal from '@/components/dashboard/publish/PublishModal.vue';
import useSharetribe from '@/compositions/sharetribe/sharetribe';

import { onMounted } from '@vue/composition-api';

export default {
  components: {
    PublishTable,
    PublishModal,
  },
  setup() {
    const { useRefreshLogin, useUpdateCurrentUser } = useSharetribe();
    onMounted(async () => {
      const isLoggedIn = await useRefreshLogin();
      if (isLoggedIn) await useUpdateCurrentUser();
    });
  },
};
</script>
