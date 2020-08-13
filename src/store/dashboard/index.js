export const dashboard = {
  namespaced: true,
  state: {
    publishModalOpen: false,
    publishModalEditData: null,
    fileList: []
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
    },
    updateFileList(state, payload) {
      state.fileList.push(payload);
    }
  }
};
