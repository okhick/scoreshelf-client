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
      <span class="menu-container">
        <font-awesome-icon
          icon="bars"
          size="2x"
          @click="toggleSidenav"
          class="burger"
          :class="{ rotateBurger: isOpen }"
        />
        <font-awesome-icon
          icon="search"
          size="2x"
          :class="['search', { 'hide-search': !searchbarIsShowing }]"
          @click="toggleSearchbarIsShowing"
        />
      </span>
      <p class="logo"><router-link :to="{ name: 'Home' }">SCORESHELF</router-link></p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, ref, SetupContext } from '@vue/composition-api';

import vClickOutside from 'v-click-outside';
Vue.use(vClickOutside);

import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faBars, faSearch);

import useSharetribe from '@/compositions/sharetribe/sharetribe';
import useSidenav from '@/compositions/sidenav/sidenav';
import useSearch from '@/compositions/search/search';

// copied from vue docs not sure it needed in Vue 3: https://composition-api.vuejs.org/api.html#setup
interface Data {
  [key: string]: unknown;
}

export default {
  components: {
    FontAwesomeIcon,
  },
  setup(_: Data, context: SetupContext) {
    const { useRefreshLogin, useSharetribeSdk, useSharetribeState } = useSharetribe();
    const { isOpen, toggleSidenav, closeSidenav } = useSidenav();
    const { searchbarIsShowing, useSearchStateManagement } = useSearch(context);

    // |---------- Data ----------|
    const { SHARETRIBE, isLoggedIn, updateIsLoggedIn } = useSharetribeState;

    onMounted(async () => {
      await useSharetribeSdk();
      await useRefreshLogin();
    });

    // |---------- Methods ----------|
    function clickOut() {
      if (isOpen.value) {
        closeSidenav();
      }
    }

    async function logout() {
      await SHARETRIBE.value.logout();
      updateIsLoggedIn(false);
      context.root.$router.push({ path: '/' });
      toggleSidenav();
    }

    return {
      // ---- Data ----
      isOpen,
      isLoggedIn,
      searchbarIsShowing,
      // ---- Methods ----
      logout,
      clickOut,
      toggleSidenav,
      toggleSearchbarIsShowing: useSearchStateManagement.toggleSearchbarIsShowing,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/index.scss';
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
  z-index: 1;
}
/* the logo */
.sidenav .logo {
  transform: rotate(90deg);
  transform-origin: center;
  grid-row: logo;
  font-family: 'lora';
  font-weight: bold;
  font-size: 22px;
  align-self: center;
}

.sidenav .logo a {
  color: $black;
  text-decoration: none;
}

.menu-container {
  display: flex;
  flex-flow: column;
  transform: scale(0.8);
  align-items: center;
}

// the search
.search {
  color: $black;
  margin-top: 12px;
  cursor: pointer;
  transition: transform 0.25s ease-in-out;
}
.hide-search {
  transform: rotate(90deg);
}

/* the hamburger */
.burger {
  grid-row: burger;
  color: $black;
  align-self: start;
  transition: transform 0.25s ease-in-out;
  cursor: pointer;
}

.rotateBurger {
  transform: rotate(90deg);
}
</style>
