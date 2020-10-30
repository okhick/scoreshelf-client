<template>
  <div class="sidenav" :class="{ showMenu: isOpen }" v-click-outside="clickOut">
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
      <span class="menu-container" @click="toggleSidenav">
        <font-awesome-icon icon="bars" size="2x" class="burger" :class="{ rotateBurger: isOpen }" />
      </span>
      <p class="logo">SCORESHELF</p>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { ref } from '@vue/composition-api';

import vClickOutside from 'v-click-outside';
Vue.use(vClickOutside);

import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faBars);

import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const sharetribeStore = createNamespacedHelpers('sharetribe'); // specific module name
const sidenavStore = createNamespacedHelpers('sidenav');

export default {
  components: {
    FontAwesomeIcon,
  },
  setup(_, context) {
    // setup vuex state mapping
    const { isOpen } = sidenavStore.useState(['isOpen']);
    const { toggleSidenav, closeSidenav } = sidenavStore.useMutations([
      'toggleSidenav',
      'closeSidenav',
    ]);

    const { SHARETRIBE, isLoggedIn } = sharetribeStore.useState(['SHARETRIBE']);
    const { updateIsLoggedIn } = sharetribeStore.useMutations(['updateIsLoggedIn']);

    // general data
    const isLoading = ref(false);

    // methods
    const clickOut = () => {
      if (isOpen.value) {
        closeSidenav();
      }
    };

    const logout = async () => {
      isLoading.value = true;
      await SHARETRIBE.value.logout();
      updateIsLoggedIn();
      context.root.$router.push({ path: '/' });
      toggleSidenav();
      isLoading.value = false;
    };

    return {
      logout,
      clickOut,
      toggleSidenav,
      isOpen,
      isLoggedIn,
    };
  },
};
</script>

<style scoped lang="scss">
@import '../styles/index.scss';
.sidenav {
  left: -180px;
  position: fixed;
  height: 100vh;
  width: 240px;
  background-color: $tan;
  display: grid;
  grid-template-columns: [menubar] 180px [sidebar] 60px;
  justify-items: center;
  transition: transform 0.25s ease-in-out;
  z-index: 2;
  box-shadow: 0px 0px 17px 0px rgba(0, 0, 0, 0.1);
}
.showMenu {
  transform: translate3d(180px, 0, 0);
}

.menu-body {
  grid-column: menubar;
  width: 120px;
  padding-top: 20px;
  color: $black;
}

.right-side {
  grid-column: sidebar;
  display: grid;
  grid-template-rows: [burger] 1fr [logo] 2fr [bottom] 1fr;
  justify-items: center;
}
/* the logo */
.sidenav p {
  transform: rotate(90deg);
  transform-origin: center;
  grid-row: logo;
  font-family: 'lora';
  font-weight: bold;
  font-size: 22px;
  align-self: center;
  color: $black;
}
/* the hamburger */
.burger {
  grid-row: burger;
  color: $black;
  align-self: start;
  transition: transform 0.25s ease-in-out;
  margin-top: 12px;
}
.burger:hover {
  cursor: pointer;
}
.rotateBurger {
  transform: rotateZ(90deg);
}
</style>
