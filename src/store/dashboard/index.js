export const dashboard = {
  namespaced: true,
  state: {
    activeDashboardView: '',
    publishModalOpen: false,
    publishModalEditData: null,
    fileList: [],
    filesToBeRemoved: [],
  },
  mutations: {
    setDashboardView(state, payload) {
      state.activeDashboardView = payload;
    },
    togglePublishModal(state) {
      state.publishModalOpen = !state.publishModalOpen;
    },
    setPublishModalEditData(state, payload) {
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
      state.fileList = state.fileList.filter((file) => file.asset_name !== payload);
    },
    setFileToBeRemoved(state, payload) {
      state.fileList.forEach((file) => {
        if (file.asset_name == payload) {
          state.filesToBeRemoved.push(file);
        }
      });
    },
    clearToBeRemoved(state) {
      state.filesToBeRemoved = [];
    },
    addScoreshelfIdToFile(state, payload) {
      // find the file the id needs to go in. Probably could do this with a find()
      state.fileList.forEach((file) => {
        let name = file.asset_name;
        if (payload[name]) {
          file._id = payload[name]._id;
          if (payload[name].thumbnail_id) file.thumbnail_id = payload[name].thumbnail_id;
        }
      });
    },
  },
  getters: {
    getCurrentListingId(state) {
      return state.publishModalEditData.id.uuid;
    },
  },
};
