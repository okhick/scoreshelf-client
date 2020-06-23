import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    SHARETRIBE: "",
    isLoggedIn: false
  },
  mutations: {
    initSharetribe(state, payload) {
      state.SHARETRIBE = payload;
    },
    updateIsLoggedIn(state, payload) {
      state.isLoggedIn = payload;
    }
  },
  actions: {},
  modules: {}
});
