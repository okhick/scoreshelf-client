import { ref } from '@vue/composition-api';

const activeDashboardView = ref('');
const publishModalOpen = ref(false);
const publishModalEditData = ref(null);
const fileList = ref([]);
const filesToBeRemoved = ref([]);

export default function DashboardState() {
  // ========== Mutations ==========
  function setDashboardView(payload) {
    activeDashboardView.value = payload;
  }

  function togglePublishModal() {
    publishModalOpen.value = !publishModalOpen.value;
  }

  function setPublishModalEditData(payload) {
    publishModalEditData.value = payload;
  }

  function clearPublishModalEditData() {
    publishModalEditData.value = null;
    filesToBeRemoved.value = [];
  }

  function addFileToFileList(payload) {
    fileList.value.push(payload);
  }

  function removeFromFileList(payload) {
    fileList.value = fileList.value.filter((file) => file.asset_name !== payload);
  }

  function setFileToBeRemoved(payload) {
    fileList.value.forEach((file) => {
      if (file.asset_name == payload) {
        filesToBeRemoved.value.push(file);
      }
    });
  }

  function clearToBeRemoved() {
    filesToBeRemoved.value = [];
  }

  function addScoreshelfIdToFile(payload) {
    // find the file the id needs to go in. Probably could do this with a find()
    fileList.value.forEach((file) => {
      let name = file.asset_name;
      if (payload[name]) {
        file._id = payload[name]._id;
        if (payload[name].thumbnail_id) file.thumbnail_id = payload[name].thumbnail_id;
      }
    });
  }

  // ========== Getters ==========
  function getCurrentListingId() {
    return publishModalEditData.value.id.uuid;
  }

  return {
    // ---- store ----
    activeDashboardView,
    publishModalOpen,
    publishModalEditData,
    fileList,
    filesToBeRemoved,
    // ---- mutations ----
    setDashboardView,
    togglePublishModal,
    setPublishModalEditData,
    clearPublishModalEditData,
    addFileToFileList,
    removeFromFileList,
    setFileToBeRemoved,
    clearToBeRemoved,
    addScoreshelfIdToFile,
    // ---- getters ----
    getCurrentListingId,
  };
}
