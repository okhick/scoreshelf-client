<template>
  <div class="sidenav" :class="{ showMenu: menuOpen }" v-click-outside="clickOut">
    <div class="menu-body">
      <!-- If user is not logged in -->
      <ul v-if="!isLoggedIn">
        <li @click="toggleSidenav">
          <router-link :to="{ name: 'Login' }">
            <strong>Log in</strong>
          </router-link>
        </li>
        <li @click="toggleSidenav">
          <router-link :to="{ name: 'SignUp' }">
            <strong>Sign up</strong>
          </router-link>
        </li>
      </ul>

      <!-- If user is logged in -->
      <ul v-if="isLoggedIn">
        <li @click="logout">
          <a><strong>Log Out</strong></a>
        </li>
        <li @click="toggleSidenav">
          <router-link :to="{ name: 'Dashboard' }">
            <strong>Dashboard</strong>
          </router-link>
        </li>
      </ul>
    </div>

    <div class="right-side">
      <p>SCORESHELF</p>
      <span class="menu-container" @click="toggleSidenav">
        <font-awesome-icon
          icon="bars"
          size="2x"
          class="burger"
          :class="{ rotateBurger: menuOpen }"
        />
      </span>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { sharetribe } from '../mixins/sharetribe.js';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faBars);

import Vue from 'vue';
import vClickOutside from 'v-click-outside';
Vue.use(vClickOutside);

export default {
  components: {
    FontAwesomeIcon,
  },
  mixins: [sharetribe],
  computed: {
    ...mapState({
      SHARETRIBE: state => state.sharetribe.SHARETRIBE,
      isLoggedIn: state => state.sharetribe.isLoggedIn,
      menuOpen: state => state.sidenav.isOpen,
    }),
  },
  methods: {
    ...mapMutations('sharetribe', ['updateIsLoggedIn']),
    ...mapMutations('sidenav', ['toggleSidenav', 'closeSidenav']),

    logout: async function() {
      this.isLoading = true;
      await this.SHARETRIBE.logout();
      this.updateIsLoggedIn();
      this.$router.push({ path: '/' });
      this.toggleMenu();
      this.isLoading = false;
    },

    clickOut: function() {
      if (this.menuOpen) {
        this.closeSidenav();
      }
    },
  },
};
</script>

<style scoped>
.sidenav {
  left: -180px;
  position: fixed;
  height: 100vh;
  width: 240px;
  background-color: #fff;
  display: grid;
  grid-template-columns: [menubar] 180px [sidebar] 60px;
  justify-items: center;
  transition: transform 0.25s ease-in-out;
  z-index: 2;
}
.showMenu {
  transform: translate3d(180px, 0, 0);
}

.menu-body {
  grid-column: menubar;
  width: 120px;
  padding-top: 20px;
}

.right-side {
  grid-column: sidebar;
  display: grid;
  grid-template-rows: [logo] 1fr [burger] 2fr [bottom] 1fr;
  align-items: center;
  justify-items: center;
}
/* the logo */
.sidenav p {
  transform: rotate(90deg);
  transform-origin: center;
  grid-row: logo;
}
/* the hamburger */
.burger {
  grid-row: burger;
  transition: transform 0.25s ease-in-out;
}
.burger:hover {
  cursor: pointer;
}
.rotateBurger {
  transform: rotateZ(90deg);
}
</style>
