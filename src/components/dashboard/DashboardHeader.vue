<template>
  <div class="level header">
    <div class="level-left">
      <span class="level-item title no-bold">
        Hi,
        <h1 class="title">{{ '\xa0' + displayName }}</h1>
      </span>
      <div class="level-item"><button class="button is-maroon">Publish new music</button></div>
    </div>
    <div class="level-right">
      <div class="level-item">
        <h2><a>Edit Profile</a></h2>
      </div>
      <div class="level-item">
        <h2><a>Settings</a></h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    displayName: String,
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.level.header:not(:last-child) {
  margin-bottom: 48px;
}

.level-item.title.no-bold {
  font-weight: 400;
  font-family: $family-secondary;
  margin-bottom: 0px;
}
h2 {
  font-weight: 600;
  padding: 12px;
  font-family: $family-primary;
}
</style>