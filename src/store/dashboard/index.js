export const dashboard = {
  namespaced: true,
  state: {
    publishModalOpen: false,
    publishModalEditData: null,
    fileList: [],
    filesToBeRemoved: [],
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
      state.filesToBeRemoved = [];
    },
    addFileToFileList(state, payload) {
      state.fileList.push(payload);
    },
    removeFromFileList(state, payload) {
      state.fileList = state.fileList.filter(
        file => file.asset_name !== payload
      );
    },
    setFileToBeRemoved(state, payload) {
      state.fileList.forEach(file => {
        if (file.asset_name == payload) {
          state.filesToBeRemoved.push(file);
        }
      });
    },
    clearToBeRemoved(state) {
      state.filesToBeRemoved = [];
    },
    addScoreshelfIdToFile(state, payload) {
      // find the file the id needs to go in
      state.fileList.forEach(file => {
        let name = file.asset_name;
        if (payload[name]) {
          let scoreshelf_id = payload[name]._id;
          file._id = scoreshelf_id;
        }
      });
    }
  }
};
