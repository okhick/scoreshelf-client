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
import { mapState } from 'vuex';

import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
import { onMounted } from '@vue/composition-api';
const sharetribeStore = createNamespacedHelpers('sharetribe'); // specific module name

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
