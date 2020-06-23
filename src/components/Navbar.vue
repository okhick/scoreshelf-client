<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-end">
      <div class="navbar-item">
        <div v-if="!isLoggedIn" class="buttons">
          <router-link
            :to="{ name: 'Login', params: { form: 'signup' } }"
            class="button is-primary"
          >
            <strong>Sign up</strong>
          </router-link>
          <router-link
            :to="{ name: 'Login', params: { form: 'login' } }"
            class="button is-dark"
          >
            <strong>Log in</strong>
          </router-link>
        </div>

        <div v-if="isLoggedIn" class="buttons">
          <div
            class="button is-primary"
            :class="{ 'is-loading': isLoading }"
            @click="logout"
          >
            <strong>Log Out</strong>
          </div>
          <router-link :to="{ name: 'Dashboard' }" class="button is-dark">
            <strong>Dashboard</strong>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { sharetribe } from "../mixins/sharetribe.js";

export default {
  name: "Navbar",
  mixins: [sharetribe],
  data: function() {
    return {
      isLoading: false
    };
  },
  computed: {
    ...mapState(["SHARETRIBE", "isLoggedIn"])
  },
  methods: {
    ...mapMutations(["updateIsLoggedIn"]),

    logout: async function() {
      this.isLoading = true;
      await this.SHARETRIBE.logout();
      this.updateIsLoggedIn();
      this.$router.push({ path: "/" });
      this.isLoading = false;
    }
  }
};
</script>
