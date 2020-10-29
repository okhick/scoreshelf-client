<template>
  <div class="column container">
    <div class="field">
      <label class="label">First Name</label>
      <div class="control">
        <input class="input" type="text" v-model="formData.firstName" />
      </div>
    </div>

    <div class="field">
      <label class="label">Last Name</label>
      <div class="control">
        <input class="input" type="text" v-model="formData.lastName" />
      </div>
    </div>

    <div class="field">
      <label class="label">Display Name</label>
      <div class="control">
        <input class="input" type="text" v-model="formData.displayName" />
      </div>
    </div>

    <hr class="hr" />

    <div class="field">
      <label class="label">Email</label>
      <div class="control">
        <input class="input" type="text" v-model="formData.email" />
      </div>
    </div>

    <div class="field">
      <label class="label">Password</label>
      <div class="control">
        <input class="input" type="password" v-model="formData.password" />
      </div>
    </div>

    <div class="field">
      <label class="label">Password Again</label>
      <div class="control">
        <input class="input" type="password" v-model="formData.passwordAgain" />
      </div>
    </div>

    <div class="level">
      <button
        class="button is-dark level-left"
        :class="{ 'is-loading': isLoading }"
        type="submit"
        @click="test()"
      >
        Sign Up
      </button>

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
import { ref } from '@vue/composition-api';
import { mapState } from 'vuex';

import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const sharetribeStore = createNamespacedHelpers('sharetribe'); // specific module name

export default {
  name: 'SignUpForm',
  setup(_, context) {
    const formData = ref({
      email: '',
      password: '',
      passwordAgain: '',
      firstName: '',
      lastName: '',
      displayName: '',
    });
    const isLoading = ref(false);
    const { SHARETRIBE } = sharetribeStore.useState(['SHARETRIBE']);

    function loginActually() {
      context.root.$router.push({ name: 'Login' });
    }

    async function signupAttempt() {
      try {
        isLoading.value = true;
        const signupRes = await SHARETRIBE.value.currentUser.create({
          email: formData.value.email,
          password: formData.value.password,
          firstName: formData.value.firstName,
          lastName: formData.value.lastName,
          displayName: formData.value.displayName,
        });

        isLoading.value = false;
      } catch (signupResError) {
        isLoading.value = false;

        switch (signupResError.status) {
          case 401:
          // do something with this error
        }
      }
    }

    return {
      // data
      formData,
      isLoading,
      // methods
      signupAttempt,
      loginActually,
    };
  },
};
</script>
