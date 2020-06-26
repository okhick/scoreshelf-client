import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    SHARETRIBE: "",
    isLoggedIn: false,
    currentUser: Object,
    publishModalOpen: false
  },
  mutations: {
    initSharetribe(state, payload) {
      state.SHARETRIBE = payload;
    },
    updateIsLoggedIn(state, payload) {
      state.isLoggedIn = payload;
    },
    updateCurrentUser(state, payload) {
      state.currentUser = payload;
    },
    togglePublishModal(state) {
      state.publishModalOpen = !state.publishModalOpen;
    }
  },
  actions: {},
  modules: {}
});
