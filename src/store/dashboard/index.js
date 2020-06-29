export const dashboard = {
  namespaced: true,
  state: {
    publishModalOpen: false,
    publishModalEditData: null
  },
  mutations: {
    togglePublishModal(state) {
      state.publishModalOpen = !state.publishModalOpen;
    },
    editPublishModalEditData(state, payload) {
      state.publishModalEditData = payload;
    },
    clearPublishModalEditData(state) {
      state.publishModalEditData = null;
    }
  }
};
