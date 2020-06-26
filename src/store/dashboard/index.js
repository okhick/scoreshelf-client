export const dashboard = {
  namespaced: true,
  state: {
    publishModalOpen: false
  },

  mutations: {
    togglePublishModal(state) {
      state.publishModalOpen = !state.publishModalOpen;
    }
  },

  actions: {},
  modules: {}
};