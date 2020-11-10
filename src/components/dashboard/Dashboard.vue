<template>
  <div>
    <h1 class="title">Hello, {{ displayName }}</h1>
    <h2 class="subtitle">I hope you are having a great day!</h2>
  </div>
</template>

<script>
import { onMounted, ref } from '@vue/composition-api';
import useSharetribe from '@/compositions/sharetribe/sharetribe';

import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const sharetribeStore = createNamespacedHelpers('sharetribe'); // specific module name

export default {
  setup() {
    const displayName = ref('');
    const { isLoggedIn, currentUser } = sharetribeStore.useState(['isLoggedIn', 'currentUser']);

    const { useRefreshLogin, useUpdateCurrentUser } = useSharetribe();

    // this can be converted into a suspense thing in Vue 3
    onMounted(async () => {
      await useRefreshLogin();
      await useUpdateCurrentUser();
      displayName.value = currentUser.value.attributes.profile.displayName;
    });

    return {
      displayName,
      isLoggedIn,
    };
  },
};
</script>
