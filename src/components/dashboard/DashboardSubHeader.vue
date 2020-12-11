<template>
  <div class="level sub-header">
    <div class="level-right">
      <div class="level-item"><h1 class="title">Purchases</h1></div>
      <div class="level-item"><h1 class="title">Published</h1></div>
      <div class="level-item"><h1 class="title">Sales</h1></div>
    </div>
  </div>
</template>

<script>
export default {};
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

.level.sub-header h1.title {
  font-family: $family-primary;
  font-weight: 400;
}
</style>