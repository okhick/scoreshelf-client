<template>
  <div>
    <h1 class="title">Publish Music</h1>
    <PublishTable />
    <PublishModal />
  </div>
</template>

<script>
import PublishTable from '@/components/dashboard/publish/PublishTable.vue';
import PublishModal from '@/components/dashboard/publish/PublishModal.vue';
import useSharetribe from '@/compositions/sharetribe';

import { onMounted } from '@vue/composition-api';

export default {
  components: {
    PublishTable,
    PublishModal,
  },
  setup() {
    const { useRefreshLogin } = useSharetribe();
    onMounted(async () => await useRefreshLogin());
  },
};
</script>
