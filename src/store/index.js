import Vue from "vue";
import Vuex from "vuex";

import { dashboard } from "@/store/dashboard";
import { sharetribe } from "@/store/sharetribe";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    dashboard,
    sharetribe
  }
});
