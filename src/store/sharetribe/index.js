export const sharetribe = {
  namespaced: true,
  state: {
    SHARETRIBE: '',
    isLoggedIn: false,
    currentUser: Object,
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
  },
  getters: {
    getCurrentUserId(state) {
      return state.currentUser.id.uuid;
    },
  },
};
