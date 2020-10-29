<template>
  <div class="column container">
    <article class="message is-warning" v-if="loginError">
      <div class="message-header">
        <p>Warning</p>
      </div>
      <div class="message-body">
        This doesn't seem to be a valid email and password combination.
      </div>
    </article>

    <div class="field">
      <label class="label">Email</label>
      <div class="control">
        <input class="input" type="text" v-model="formData.email" />
      </div>
    </div>

    <div class="field">
      <label class="label">Password</label>
      <div class="control">
        <input
          class="input"
          type="password"
          v-model="formData.password"
          v-on:keyup.enter="loginAttempt"
        />
      </div>
    </div>

    <div class="level">
      <button
        class="button is-dark level-left"
        :class="{ 'is-loading': isLoading }"
        type="submit"
        @click="loginAttempt"
      >
        <strong> Login </strong>
      </button>

      <div class="level-right is-block has-text-right">
        <div @click="signupActually">
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
import { ref } from '@vue/composition-api';
import useSharetribe from '@/compositions/sharetribe';

import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const sharetribeStore = createNamespacedHelpers('sharetribe'); // specific module name

export default {
  name: 'LoginForm',
  setup(_, context) {
    const formData = ref({
      email: '',
      password: '',
    });
    const loginError = ref(false);
    const isLoading = ref(false);
    const { SHARETRIBE } = sharetribeStore.useState(['SHARETRIBE']);

    const { useRefreshLogin } = useSharetribe();

    function signupActually() {
      context.root.$router.push({ name: 'SignUp' });
    }

    async function loginAttempt() {
      try {
        isLoading.value = true;

        // validate creds
        await SHARETRIBE.value.login({
          username: formData.value.email,
          password: formData.value.password,
        });
        // update vuex with update login info
        await useRefreshLogin();
        context.root.$router.push({ path: '/dashboard' });
        isLoading.value = false;
      } catch (loginResError) {
        isLoading.value = false;
        console.log(loginResError);

        switch (loginResError.status) {
          case 401:
            loginError.value = true;
        }
      }
    }

    return {
      // data
      formData,
      loginError,
      isLoading,
      // methods
      signupActually,
      loginAttempt,
      // tester,
    };
  },
};
</script>
