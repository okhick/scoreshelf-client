<template>
  <div id="test">
    <!-- <publish-table /> -->
    <publish-list />
    <!-- this can be converted to a real vue teleport in vue3 -->
    <v-teleport>
      <publish-modal />
    </v-teleport>
  </div>
</template>

<script>
// import PublishTable from '@/components/dashboard/publish/PublishTable.vue';
import PublishList from '@/components/dashboard/publish/PublishList.vue';
import PublishModal from '@/components/dashboard/publish/PublishModal.vue';
import useSharetribe from '@/compositions/sharetribe/sharetribe';
import { vTeleport } from '@desislavsd/vue-teleport';

import { onMounted } from '@vue/composition-api';

export default {
  components: {
    PublishList,
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

<style lang="scss" scoped>
#test {
  height: 100%;
}
</style>
