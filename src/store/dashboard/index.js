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
    addFileToFileList(state, payload) {
      state.fileList.push(payload);
    },
    addScoreshelfIdToFile(state, payload) {
      state.fileList.forEach(file => {
        let name = file.name;
        let scoreshelf_id = payload[name]._id;
        file.scoreshelf_id = scoreshelf_id;
      });
    }
  }
};
