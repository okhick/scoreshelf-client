<template v-if="whichForm === 'login'">
  <div>
    <Login v-if="whichForm === 'login'" />
    <div v-else-if="whichForm === 'signup'">Dope</div>
  </div>
</template>

<script>
import Login from "@/components/forms/LoginForm.vue";

export default {
  data: function() {
    return {
      whichForm: this.$route.params.form
    };
  },
  components: {
    Login
  },
  watch: {
    $route(to) {
      this.whichForm = to.params.form;
    }
  }
};
</script>
