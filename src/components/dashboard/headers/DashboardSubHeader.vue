<template>
  <div class="tabs is-boxed">
    <ul>
      <li :class="[{ 'is-active': activeDashboardView === 'Purchases' }]">
        <h1 class="title">
          <router-link to="/dashboard/purchases">Purchases</router-link>
        </h1>
      </li>
      <li :class="[{ 'is-active': activeDashboardView === 'Publications' }]">
        <h1 class="title">
          <router-link to="/dashboard/publications">Publications</router-link>
        </h1>
      </li>
      <li :class="[{ 'is-active': activeDashboardView === 'Sales' }]">
        <h1 class="title">
          <router-link to="/dashboard/sales">Sales</router-link>
        </h1>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, ref } from '@vue/composition-api';
import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const dashboardStore = createNamespacedHelpers('dashboard'); // specific module name

export default {
  setup() {
    const { activeDashboardView } = dashboardStore.useState(['activeDashboardView']);
    return {
      activeDashboardView,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.tabs {
  ul {
    justify-content: start;
  }

  h1.title a {
    font-family: $family-primary;
    font-weight: 400;
    color: $black;
    text-decoration: none;
  }

  .is-active h1.title a {
    color: $maroon;
  }
}
</style>