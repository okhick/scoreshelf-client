<template>
  <div class="container">
    <dashboard-header :display-name="displayName" />
    <dashboard-sub-header v-show="activeDashboardView != 'EditProfile'" />
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, watch, computed, SetupContext } from '@vue/composition-api';
import useDashboard from '@/compositions/dashboard/dashboard';

import useSharetribe from '@/compositions/sharetribe/sharetribe';
import useSearch from '@/compositions/search/search';

import DashboardHeader from '@/components/dashboard/headers/DashboardHeader.vue';
import DashboardSubHeader from '@/components/dashboard/headers/DashboardSubHeader.vue';

import { Data } from '@/@types';

export default {
  components: {
    DashboardHeader,
    DashboardSubHeader,
  },
  setup(_: Data, context: SetupContext) {
    // hide the searchbar is needed
    const { useSearchStateManagement } = useSearch(context);
    onMounted(() => useSearchStateManagement.hideSearchbar());

    // refresh login and send displayName to header
    const { useRefreshLogin, useUpdateCurrentUser, useSharetribeState } = useSharetribe();
    const { currentUser } = useSharetribeState;

    // this can be converted into a suspense thing in Vue 3
    onMounted(async () => {
      await useRefreshLogin();
      await useUpdateCurrentUser();
    });

    const displayName = computed(() => {
      return currentUser?.value?.attributes.profile.displayName;
    });

    // get the active view and save it in the store
    const { useDashboardState } = useDashboard();
    const { setDashboardView, activeDashboardView } = useDashboardState;
    const dashboardRouterName = computed(() => context.root.$route.name);
    onMounted(() => setDashboardView(dashboardRouterName.value));
    watch(dashboardRouterName, (newValue) => setDashboardView(newValue));

    return {
      displayName,
      activeDashboardView,
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
