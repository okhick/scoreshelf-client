<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <router-link :to="{name: 'Login', params: {form: 'signup'}}" class="button is-primary">
            <strong>Sign up</strong>
          </router-link>

          <router-link :to="{name: 'Login', params: {form: 'login'}}" class="button is-dark">
            <strong>Log in</strong>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "HelloWorld"
};
</script>