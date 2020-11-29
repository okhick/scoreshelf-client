<template>
  <div class="container">
    <div class="columns">
      <div class="column is-2">
        <Menu />
      </div>
      <div class="column is-10">
        <section class="is-info welcome is-small">
          <router-view></router-view>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/dashboard/menu/Menu.vue';
import { onMounted } from '@vue/composition-api';
import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const searchStore = createNamespacedHelpers('search'); // specific module name

export default {
  components: {
    Menu,
  },
  setup() {
    const { hideSearchbar } = searchStore.useMutations(['hideSearchbar']);
    onMounted(() => hideSearchbar());
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/index.scss';

.container {
  padding-top: 6px;
}
.columns {
  width: 100%;
  height: 100%;
  margin-left: 0;
}
</style>
