<template>
  <div>
    <publish-table />
    <!-- this can be converted to a real vue teleport in vue3 -->
    <v-teleport><publish-modal /></v-teleport>
  </div>
</template>

<script>
import PublishTable from '@/components/dashboard/publish/PublishTable.vue';
import PublishModal from '@/components/dashboard/publish/PublishModal.vue';
import useSharetribe from '@/compositions/sharetribe/sharetribe';
import { vTeleport } from '@desislavsd/vue-teleport';

import { onMounted } from '@vue/composition-api';

export default {
  components: {
    PublishTable,
    PublishModal,
    vTeleport,
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
