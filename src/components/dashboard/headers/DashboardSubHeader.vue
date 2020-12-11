<template>
  <div class="level sub-header">
    <div class="level-right">
      <div class="level-item">
        <div class="level-item">
          <h1 :class="['title', { 'is-active': activeDashboardView === 'Purchases' }]">
            <router-link to="purchases">Purchases</router-link>
          </h1>
        </div>
        <h1 :class="['title', { 'is-active': activeDashboardView === 'Publications' }]">
          <router-link to="publications">Publications</router-link>
        </h1>
      </div>
      <div class="level-item">
        <h1 :class="['title', { 'is-active': activeDashboardView === 'Sales' }]">
          <router-link to="sales">Sales</router-link>
        </h1>
      </div>
    </div>
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

.sub-header {
  border-bottom: solid 1px $black-light;
  padding-bottom: 24px;
}

.sub-header .level-item {
  padding-right: 96px;
}

.level.sub-header h1.title a {
  font-family: $family-primary;
  font-weight: 400;
  color: $black;
  text-decoration: none;
}

.level.sub-header h1.title.is-active a {
  font-weight: 800;
}
</style>