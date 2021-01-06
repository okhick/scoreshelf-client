import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import App from './App.vue';
import router from './router';
import VueCookies from 'vue-cookies';

Vue.use(VueCompositionAPI);
Vue.config.productionTip = false;

Vue.use(VueCookies);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
