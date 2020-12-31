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
        class="button level-left"
        :class="{ 'is-loading': isLoading }"
        type="submit"
        @click="signupAttempt()"
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
import { reactive, ref, toRefs } from '@vue/composition-api';
import useSharetribe from '@/compositions/sharetribe/sharetribe';

export default {
  name: 'SignUpForm',
  setup(_, context) {
    const formData = reactive({
      email: '',
      password: '',
      passwordAgain: '',
      firstName: '',
      lastName: '',
      displayName: '',
    });
    const isLoading = ref(false);
    const { useRefreshLogin, useSharetribeState } = useSharetribe();
    const { SHARETRIBE } = useSharetribeState;

    function loginActually() {
      context.root.$router.push({ name: 'Login' });
    }

    async function signupAttempt() {
      try {
        isLoading.value = true;
        const signupRes = await SHARETRIBE.value.currentUser.create({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          displayName: formData.displayName,
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
      ...toRefs(formData),
      isLoading,
      // methods
      signupAttempt,
      loginActually,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index';
</style>
