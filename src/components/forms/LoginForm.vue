<template>
  <div class="column container">
    <article class="message is-warning" v-if="login_error">
      <div class="message-header">
        <p>Warning</p>
      </div>
      <div class="message-body">This doesn't seem to be a valid email and password combination.</div>
    </article>

    <div class="field">
      <label class="label">Email</label>
      <div class="control">
        <input class="input" type="text" v-model="email" />
      </div>
    </div>

    <div class="field">
      <label class="label">Password</label>
      <div class="control">
        <input class="input" type="password" v-model="password" />
      </div>
    </div>

    <div class="level">
      <button
        class="button is-dark level-left"
        :class="{ 'is-loading': isLoading }"
        type="submit"
        @click="login_attempt()"
      >Login</button>

      <div class="level-right is-block has-text-right">
        <div @click="signUpActually()">
          <a>Actually, I need to sign up.</a>
        </div>
        <div>I forgot my password.</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.columns {
  display: flex;
  height: 80vh;
}
</style>

<script>
import { mapState } from "vuex";

export default {
  name: "LoginForm",
  data: function() {
    return {
      email: "",
      password: "",
      login_error: false,
      isLoading: false
    };
  },
  methods: {
    signUpActually: function() {
      this.$router.push({ path: "signup" });
    },

    login_attempt: async function() {
      try {
        this.isLoading = true;
        let loginRes = await this.SHARETRIBE.login({
          username: this.email,
          password: this.password
        });
        console.log(loginRes);
        this.isLoading = false;
      } catch (loginResError) {
        this.isLoading = false;

        switch (loginResError.status) {
          case 401:
            this.login_error = true;
        }
      }
    }
  },
  computed: {
    ...mapState(["SHARETRIBE"])
  }
};
</script>
