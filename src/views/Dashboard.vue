<template>
  <div class="container">
    <dashboard-header :display-name="displayName" />
    <dashboard-sub-header />
    <router-view></router-view>
  </div>
</template>

<script>
import { onMounted, ref, watch, computed } from '@vue/composition-api';
import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const sharetribeStore = createNamespacedHelpers('sharetribe'); // specific module name
const dashboardStore = createNamespacedHelpers('dashboard'); // specific module name

import useSharetribe from '@/compositions/sharetribe/sharetribe';
import useSearch from '@/compositions/search/search';

import Menu from '@/components/dashboard/menu/Menu.vue';
import DashboardHeader from '@/components/dashboard/headers/DashboardHeader.vue';
import DashboardSubHeader from '@/components/dashboard/headers/DashboardSubHeader.vue';

export default {
  components: {
    // Menu,
    DashboardHeader,
    DashboardSubHeader,
  },
  setup(_, context) {
    // hide the searchbar is needed
    const { useSearchStateManagement } = useSearch();
    onMounted(() => useSearchStateManagement.hideSearchbar());

    // refresh login and send displayName to header
    const { currentUser } = sharetribeStore.useState(['isLoggedIn', 'currentUser']);
    const { useRefreshLogin, useUpdateCurrentUser } = useSharetribe();
    const displayName = ref('');
    // this can be converted into a suspense thing in Vue 3
    onMounted(async () => {
      await useRefreshLogin();
      await useUpdateCurrentUser();
      displayName.value = currentUser.value.attributes.profile.displayName;
    });

    // get the active view and save it in the store
    const { setDashboardView } = dashboardStore.useMutations(['setDashboardView']);
    const dashboardRouterName = computed(() => context.root.$route.name);
    onMounted(() => setDashboardView(dashboardRouterName.value));
    watch(dashboardRouterName, (newValue) => setDashboardView(newValue));

    return {
      displayName,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/index.scss';

.container {
  padding: 6px 48px 6px 48px;
}
.columns {
  width: 100%;
  height: 100%;
  margin-left: 0;
}
</style>
