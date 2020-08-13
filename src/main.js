import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";

// configure axios here
const axiosConfig = {
  baseURL: "http://127.0.0.1:3001/",
  timeout: 30000
};
Vue.prototype.$axios = axios.create(axiosConfig);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
