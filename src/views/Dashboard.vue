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
import Menu from "@/components/dashboard/Menu.vue";

export default {
  components: {
    Menu
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/index.scss";

.container {
  padding-top: 6px;;
}
.columns {
  width: 100%;
  height: 100%;
  margin-left: 0;
}
</style>
