<template>
  <aside class="menu is-hidden-mobile">
    <p class="menu-label">General</p>
    <ul class="menu-list">
      <li>
        <router-link :class="{ 'is-active': activeMenu == 'Dashboard' }" :to="{ name: 'Dashboard' }"
          >Dashboard</router-link
        >
      </li>
      <li>
        <router-link
          :class="{ 'is-active': activeMenu == 'EditProfile' }"
          :to="{ name: 'EditProfile' }"
          >Edit Profile</router-link
        >
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

    <p class="menu-label">Publish</p>
    <ul class="menu-list">
      <li>
        <router-link :class="{ 'is-active': activeMenu == 'Publish' }" :to="{ name: 'Publish' }"
          >Publish Music</router-link
        >
      </li>
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
  name: 'Menu',
  data: function() {
    return {
      activeMenu: '',
    };
  },
  methods: {
    link_editProfile: function() {
      this.$router.push({ path: 'edit-profile' });
    },
    link_dashboardHome: function() {
      this.$router.push({ path: 'dashboard' });
    },
  },
  watch: {
    $route(to) {
      this.activeMenu = to.name;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
.menu.is-hidden-mobile {
  padding-top: 6px;
}
.menu-label {
  color: $black;
  letter-spacing: 1.3;
  font-weight: 800;
}
.menu-list a {
  color: $black;
  font-size: 14px;
  font-weight: 400;
}
.menu-list a:hover {
  background-color: $tan;
  color: $maroon;
}
.menu-list a.is-active {
  background-color: $tan;
  color: $maroon;
  font-weight: 700;
}
</style>
