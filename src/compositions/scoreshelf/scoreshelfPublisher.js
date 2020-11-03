import { reactive, toRefs } from '@vue/composition-api';

// ============================================================================

const FileState = reactive({
  fileList: [],
  filesToBeRemoved: [],
});

// ============================================================================

export default function useScoreshelfPublisher() {
  // manage files/data uploaded to the browser
  const useScoreshelfUploadManagement = ScoreshelfUploadManagement();

  // manage files/data upload to scoreshelf
  const useScoreshelfAssetManagement = ScoreshelfAssetManagement();

  const useScoreshelfHelpers = ScoreshelfHelpers();

  return {
    useScoreshelfUploadManagement,
    useScoreshelfAssetManagement,
    ...toRefs(FileState),
  };
}

// ============================================================================
// ============================================================================
// ============================================================================

function ScoreshelfUploadManagement() {
  function useProcessUpload() {
    // TODO: THIS IS NOT GOING TO WORK
    const newFiles = this.$refs.file.files;
    newFiles.forEach(file => {
      file.isStored = false;
      file.asset_name = file.name; // we use asset name everywhere else, start from the beg
      addFileToFileList(file);
    });
  }

  // FileState mutations
  function addFileToFileList(payload) {
    FileState.fileList.push(payload);
  }

  function removeFileFromFileList(payload) {
    FileState.fileList = FileState.fileList.filter(file => file.asset_name !== payload);
  }

  function setFileToBeRemoved(payload) {
    FileState.fileList.forEach(file => {
      if (file.asset_name == payload) {
        FileState.filesToBeRemoved.push(file);
      }
    });
  }

  function clearToBeRemoved() {
    FileState.filesToBeRemoved = [];
  }

  function addScoreshelfIdToFile(payload) {
    // find the file the id needs to go in. Probably could do this with a find()
    FileState.fileList.forEach(file => {
      let name = file.asset_name;
      if (payload[name]) {
        file._id = payload[name]._id;
        if (payload[name].thumbnail_id) file.thumbnail_id = payload[name].thumbnail_id;
      }
    });
  }

  return {
    useProcessUpload,
    addFileToFileList,
    removeFileFromFileList,
    setFileToBeRemoved,
    clearToBeRemoved,
    addScoreshelfIdToFile,
  };
}

// ============================================================================
// ============================================================================
// ============================================================================

function ScoreshelfAssetManagement() {
  async function hyrdateAssetData(fileList, getLink) {
    const scoreshelf_ids = fileList.map(file => file.scoreshelf_id);
    const hydratedAssets = await this.$axios.post('/getAssetdata', {
      scoreshelf_ids: scoreshelf_ids,
      get_link: getLink,
    });
    return hydratedAssets;
  }

  return {
    hyrdateAssetData,
  };
}

// ============================================================================
// ============================================================================
// ============================================================================

function ScoreshelfHelpers() {}
