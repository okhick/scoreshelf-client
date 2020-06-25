<template>
  <aside class="menu is-hidden-mobile">
    <p class="menu-label">General</p>
    <ul class="menu-list">
      <li>
        <router-link :to="{ name: 'Dashboard' }">Dashboard</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'EditProfile' }">Edit Profile</router-link>
      </li>
    </ul>

    <p class="menu-label">Purchase</p>
    <ul class="menu-list">
      <li>
        <a>Previous Purchases</a>
      </li>
      <li>
        <a>Downloads</a>
      </li>
      <li>
        <a>Payments Settings</a>
      </li>
    </ul>

    <p class="menu-label">Sell</p>
    <ul class="menu-list">
      <li>
        <a>Published Music</a>
      </li>
      <li>
        <a>Sales</a>
      </li>
    </ul>

    <p class="menu-label">Publisher Settings</p>
    <ul class="menu-list">
      <li>
        <a>Manage Publishers</a>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: "Menu",
  methods: {
    link_editProfile: function() {
      this.$router.push({ path: "edit-profile" });
    },
    link_dashboardHome: function() {
      this.$router.push({ path: "dashboard" });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
.menu.is-hidden-mobile {
  padding-top: 6px;
}
.menu-label {
  color: #8f99a3;
  letter-spacing: 1.3;
  font-weight: 700;
}
.menu-list a {
  color: $dark;
  font-size: 14px;
  font-weight: 700;
}
.menu-list a:hover {
  background-color: transparent;
  color: #276cda;
}
.menu-list a.is-active {
  background-color: transparent;
  color: #276cda;
  font-weight: 700;
}
</style>
