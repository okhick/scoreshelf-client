<template>
  <div class="container">
    <div class="columns">
      <div class="column is-3">
        <Menu />
      </div>
      <div class="column is-9">
        <section class="is-info welcome is-small">
          <div class="container">
            <h1 class="title">Hello, {{ displayName }}</h1>
            <h2 class="subtitle">I hope you are having a great day!</h2>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Menu from "@/components/dashboard/Menu.vue";

export default {
  components: {
    Menu
  },
  data() {
    return {
      displayName: ""
    };
  },
  async mounted() {
    let currentUser = await this.SHARETRIBE.currentUser.show();
    this.displayName = currentUser.data.data.attributes.profile.displayName;
  },
  computed: {
    ...mapState(["SHARETRIBE"])
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/index.scss";
.container {
  padding-top: 6px;
}
.columns {
  width: 100%;
  height: 100%;
  margin-left: 0;
}
.title {
  color: $dark;
}
</style>
