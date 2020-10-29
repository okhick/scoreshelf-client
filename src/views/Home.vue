<template>
  <div class="home"></div>
</template>

<script>
import useSharetribe from '@/compositions/sharetribe.js';
import { onMounted } from '@vue/composition-api';

export default {
  name: 'Home',
  setup() {
    const { useRefreshLogin } = useSharetribe();
    onMounted(async () => {
      await useRefreshLogin();
    });
  },
  components: {
    // Navbar
  },
};
</script>
