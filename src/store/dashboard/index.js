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
    removeFromFileList(state, payload) {
      state.fileList = state.fileList.filter(file => file.name !== payload);
    },
    addScoreshelfIdToFile(state, payload) {
      // find the file the id needs to go in
      state.fileList.forEach(file => {
        let name = file.name;
        if(payload[name]) {
          let scoreshelf_id = payload[name]._id;
          file.scoreshelf_id = scoreshelf_id;
        }
      });
    }
  }
};
