<template>
  <span>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-end">
        <div class="navbar-item">
          <!-- If user is not logged in -->
          <div v-if="!isLoggedIn" class="buttons">
            <router-link :to="{ name: 'SignUp' }" class="button is-primary">
              <strong>Sign up</strong>
            </router-link>
            <router-link :to="{ name: 'Login' }" class="button is-dark">
              <strong>Log in</strong>
            </router-link>
          </div>

          <!-- If user is logged in -->
          <div v-if="isLoggedIn" class="buttons">
            <div class="button is-primary" :class="{ 'is-loading': isLoading }" @click="logout">
              <strong>Log Out</strong>
            </div>
            <router-link :to="{ name: 'Dashboard' }" class="button is-dark">
              <strong>Dashboard</strong>
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    <div class="is-full columns is-centered">
      <search class="column search-wrapper" />
    </div>
  </span>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { sharetribe } from '../../mixins/sharetribe.js';
import search from './Search';

export default {
  name: 'Navbar',
  mixins: [sharetribe],
  components: {
    search,
  },
  data: function() {
    return {
      isLoading: false,
    };
  },
  computed: {
    ...mapState({
      SHARETRIBE: state => state.sharetribe.SHARETRIBE,
      isLoggedIn: state => state.sharetribe.isLoggedIn,
    }),
  },
  methods: {
    ...mapMutations('sharetribe', ['updateIsLoggedIn']),

    logout: async function() {
      this.isLoading = true;
      await this.SHARETRIBE.logout();
      this.updateIsLoggedIn();
      this.$router.push({ path: '/' });
      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.search-wrapper {
  max-width: 400px;
}
.is-full.columns.is-centered {
  margin-top: 0;
}
</style>
