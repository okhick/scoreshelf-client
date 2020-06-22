<template v-if="whichForm === 'login'">
  <div class="columns is-vcentered">
    <!-- empty column -->
    <div class="column"></div>

    <!-- The form chosen by path -->
    <Login v-if="whichForm === 'login'" />
    <SignUp v-else-if="whichForm === 'signup'" />

    <!-- empty column -->
    <div class="column"></div>
  </div>
</template>

<script>
import Login from "@/components/forms/LoginForm.vue";
import SignUp from "@/components/forms/SignUpForm.vue";

export default {
  data: function() {
    return {
      whichForm: this.$route.params.form
    };
  },
  components: {
    Login,
    SignUp
  },
  watch: {
    $route(to) {
      this.whichForm = to.params.form;
    }
  }
};
</script>
