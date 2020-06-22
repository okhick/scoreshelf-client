<template>
  <div class="column container">
    <div class="field">
      <label class="label">First Name</label>
      <div class="control">
        <input class="input" type="text" v-model="firstName" />
      </div>
    </div>

    <div class="field">
      <label class="label">Last Name</label>
      <div class="control">
        <input class="input" type="text" v-model="lastName" />
      </div>
    </div>

    <div class="field">
      <label class="label">Display Name</label>
      <div class="control">
        <input class="input" type="text" v-model="displayName" />
      </div>
    </div>

    <hr class="hr" />

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

    <div class="field">
      <label class="label">Password Again</label>
      <div class="control">
        <input class="input" type="password" v-model="passwordAgain" />
      </div>
    </div>

    <div class="level">
      <button
        class="button is-dark level-left"
        :class="{ 'is-loading': isLoading }"
        type="submit"
        @click="signup_attempt()"
      >Sign Up</button>

      <div class="level-right is-block has-text-right">
        <div @click="loginActually()">
          <a>Actually, I already have an account.</a>
        </div>
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
  name: "SignUpForm",
  data: function() {
    return {
      email: "",
      password: "",
      passwordAgain: "",
      firstName: "",
      lastName: "",
      displayName: "",
      isLoading: false
    };
  },
  methods: {
    loginActually: function() {
      this.$router.push({ path: "login" });
    },
    signup_attempt: async function() {
      try {
        this.isLoading = true;
        let signupRes = await this.SHARETRIBE.currentUser.create({
          email: this.email,
          password: this.password,
          firstName: this.firstName,
          lastName: this.lastName,
          displayName: this.displayName
        });
        console.log(signupRes);
        this.isLoading = false;
      } catch (signupResError) {
        this.isLoading = false;

        switch (signupResError.status) {
          case 401:
            // do something with this error
        }
      }
    }
  },
  computed: {
    ...mapState(["SHARETRIBE"])
  }
};
</script>
