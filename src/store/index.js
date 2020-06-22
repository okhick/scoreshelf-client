import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    SHARETRIBE: ""
  },
  mutations: {
    initSharetribe(state, payload) {
      state.SHARETRIBE = payload;
    }
  },
  actions: {},
  modules: {}
});
