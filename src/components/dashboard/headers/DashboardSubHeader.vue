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

<script lang="ts">
import useDashboard from '@/compositions/dashboard/dashboard';

export default {
  setup() {
    const { useDashboardState } = useDashboard();
    return {
      activeDashboardView: useDashboardState.activeDashboardView,
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
