import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import App from './App.vue';
import router from './router';

// this store will complain until we get full TS support
// @ts-ignore
import store from './store/index.js';
import VueCookies from 'vue-cookies';

Vue.use(VueCompositionAPI);
Vue.config.productionTip = false;

Vue.use(VueCookies);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
