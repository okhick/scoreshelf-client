<template>
  <div :class="['sidenav', { showMenu: isOpen }]" v-click-outside="clickOut">
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
      <span class="actions-container">
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
      <div class="profile">
        <p class="display-name">{{ displayName }}</p>
        <img :src="profilePictureLink" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { computed, onMounted, ref, SetupContext, watch, watchEffect } from '@vue/composition-api';

import vClickOutside from 'v-click-outside';
Vue.use(vClickOutside);

import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faBars, faSearch);

import useSharetribe from '@/compositions/sharetribe/sharetribe';
import useSidenav from '@/compositions/sidenav/sidenav';
import useSearch from '@/compositions/search/search';
import useScoreshelf from '@/compositions/scoreshelf/scoreshelf';
import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';
import { async } from 'crypto-random-string';

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
    const { SHARETRIBE, isLoggedIn, logoutUser, currentUser } = useSharetribeState;

    const { THUMBNAIL_BASE_URL } = useScoreshelf();
    const { useScoreshelfProfilePicture } = useScoreshelfPublisher();

    const { isOpen, toggleSidenav, closeSidenav } = useSidenav();
    const { searchbarIsShowing, useSearchStateManagement } = useSearch(context);

    onMounted(async () => {
      await useSharetribeSdk();
      await useRefreshLogin();
    });

    // ========== Handle the display name and profile picture ==========
    const profilePictureLink = ref<string | undefined>();
    const displayName = computed(() => {
      return currentUser.value?.attributes.profile.displayName || '';
    });
    const profilePictureId = computed(() => {
      return currentUser.value?.attributes.profile.publicData.profilePicture;
    });

    // watch for changes in profilePictureId, refresh when happens
    // handles picture updates and logins and outs
    watchEffect(async () => {
      if (profilePictureId.value) {
        const profilePictureData = await useScoreshelfProfilePicture.hydrateProfilePicture(
          profilePictureId.value
        );

        if (profilePictureData) {
          profilePictureLink.value = `${THUMBNAIL_BASE_URL}/${useSharetribeState.getCurrentUserId()}/${
            profilePictureData.asset_name
          }`;
        } else {
          profilePictureLink.value = '/profile_placeholder.png';
        }
      } else {
        profilePictureLink.value = undefined;
      }
    });

    // ========== Other functions ==========

    function clickOut() {
      if (isOpen.value) {
        closeSidenav();
      }
    }

    async function logout() {
      await SHARETRIBE.value.logout();
      logoutUser();
      context.root.$router.push({ path: '/' });
      toggleSidenav();
    }

    return {
      // ---- Data ----
      isOpen,
      isLoggedIn,
      searchbarIsShowing,
      displayName,
      profilePictureLink,
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
  grid-template-rows: [burger] auto [logo] 1fr [bottom] auto;
  justify-items: center;
  z-index: 1;

  .actions-container {
    display: flex;
    flex-flow: column;
    transform: scale(0.8);
    align-items: center;

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
  }

  /* the logo */
  .logo {
    writing-mode: vertical-rl;
    grid-row: logo;
    font-family: 'lora';
    font-weight: bold;
    font-size: 22px;
    align-self: center;
  }

  .logo a {
    color: $black;
    text-decoration: none;
  }

  .profile {
    grid-row: bottom;
    max-width: 40px;
    display: grid;
    grid-template-rows: [displayName] 1fr [profilePicture] auto;
    row-gap: 8px;
    margin-bottom: 8px;

    .display-name {
      grid-row: displayName;
      writing-mode: vertical-rl;
      justify-self: center;
      font-size: 18px;
    }

    img {
      grid-row: profilePicture;
      border-radius: 4px;
    }
  }
}
</style>
