<template v-if="whichForm === 'login'">
  <div class="columns is-vcentered">
    <!-- empty column -->
    <div class="column"></div>

    <router-view></router-view>

    <!-- empty column -->
    <div class="column"></div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {};
  },
  components: {}
};
</script>
