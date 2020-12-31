<template>
  <div>
    <h2 class="subtitle">This page will probably not exist someday but for now it's here</h2>
  </div>
</template>

<script>
import { onMounted, ref, computed } from '@vue/composition-api';
import useSharetribe from '@/compositions/sharetribe/sharetribe';

export default {
  setup() {
    const { useRefreshLogin, useUpdateCurrentUser, useSharetribeState } = useSharetribe();

    onMounted(async () => {
      await useRefreshLogin();
      await useUpdateCurrentUser();
    });

    const displayName = computed(() => {
      return currentUser?.value?.attributes.profile.displayName;
    });

    return {
      displayName,
      isLoggedIn: useSharetribeState.isLoggedIn,
    };
  },
};
</script>
