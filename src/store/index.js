import Vue from "vue";
import Vuex from "vuex";

import { dashboard } from "@/store/dashboard";
import { sharetribe } from "@/store/sharetribe";
import { sidenav } from "@/store/sidenav";
import { search } from "@/store/search";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    dashboard,
    sharetribe,
    search,
    sidenav
  }
});
