import { reactive, toRefs } from '@vue/composition-api';

// ============================================================================

const FileState = reactive({
  fileList: [],
  filesToBeRemoved: [],
  thumbnailSettings: {},
});

// ============================================================================

export default function useScoreshelfPublisher() {
  // manage files/data uploaded to the browser
  const useScoreshelfUploadManagement = ScoreshelfUploadManagement();

  // manage files/data upload to scoreshelf
  const useScoreshelfAssetManagement = ScoreshelfAssetManagement();
  const useFileStateManagement = FileStateManagement();
  const useScoreshelfHelpers = ScoreshelfHelpers();

  return {
    ...toRefs(FileState),
    useScoreshelfUploadManagement,
    useScoreshelfAssetManagement,
    useFileStateManagement,
    useScoreshelfHelpers,
  };
}

// ============================================================================
// ============================================================================
// ============================================================================

function FileStateManagement() {
  function processUpload() {
    const newFiles = this.$refs.file.files;
    newFiles.forEach(file => {
      file.isStored = false;
      file.asset_name = file.name; // we use asset name everywhere else, start from the beg
      addFileToFileList(file);
    });
  }

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

  function resetFileState() {
    FileState.fileList = [];
    FileState.filesToBeRemoved = [];
    FileState.thumbnailSettings = {};
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
    processUpload,
    addFileToFileList,
    removeFileFromFileList,
    setFileToBeRemoved,
    clearToBeRemoved,
    resetFileState,
    addScoreshelfIdToFile,
  };
}

// ============================================================================
// ============================================================================
// ============================================================================

function ScoreshelfUploadManagement() {
  const scoreshelfAssetManagement = ScoreshelfAssetManagement();
  const scoreshelfFileStateManagement = FileStateManagement();
  const scoreshelfUploadHelpers = ScoreshelfHelpers();

  async function submitUpload(uploadParams) {
    const res = {};

    if (scoreshelfUploadHelpers.areNewFiles()) {
      res.uploadRes = await uploadNewFiles(uploadParams);
    }

    if (FileState.filesToBeRemoved.length > 0) {
      res.deleteRes = await removeUploads();
    }

    res.updateMetadataRes = await scoreshelfAssetManagement.updateAssetMetadata(uploadParams);
    return res;
  }

  async function uploadNewFiles(uploadParams) {
    const formData = new FormData();

    // create a 'unique key' for each file, push it into formdata
    FileState.fileList.forEach((file, index) => {
      if (file.isStored == false) {
        formData.append(`file_${index}`, file);
      }
    });

    const assetMetadata = scoreshelfAssetManagement.formatNewAssetMetadata(uploadParams);
    // stringify this so we can stuff it in a form field
    formData.append('assetMetadata', JSON.stringify(assetMetadata));

    // send off the files. returns the files uploaded
    let res = await this.$axios.post('/uploadAssets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    scoreshelfFileStateManagement.addScoreshelfIdToFile(res.data);
    return res;
  }

  async function removeUploads() {
    // call the server to delete db and asset
    await this.$axios.delete('/deleteAssets', {
      data: {
        filesToRemove: this.filesToBeRemoved,
      },
    });

    // finally, remove it from the store
    scoreshelfFileStateManagement.clearToBeRemoved();
    return true;
  }

  return {
    submitUpload,
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

  async function updateAssetMetadata(uploadParams) {
    const assetMetadata = formatUpdatedAssetMetadata(uploadParams);
    const res = await this.$axios.post('/updateAssetMetadata', assetMetadata);
    return res;
  }

  function formatNewAssetMetadata(uploadParams) {
    const formattedUploadParams = {};

    formattedUploadParams.sharetribe_listing_id = this.listing_id;
    formattedUploadParams.sharetribe_user_id = this.user_id;
    formattedUploadParams.metadata = {};

    const newFiles = FileState.fileList.filter(file => !file.isStored);
    newFiles.forEach(file => {
      formattedUploadParams.metadata[file.asset_name] = {
        thumbnailSettings: uploadParams.thumbnailSettings[file.asset_name],
        // do more formatting here
      };
    });

    return formattedUploadParams;
  }

  function formatUpdatedAssetMetadata(uploadParams) {
    const formattedUploadParams = {};

    formattedUploadParams.sharetribe_listing_id = this.listing_id;
    formattedUploadParams.sharetribe_user_id = this.user_id;
    formattedUploadParams.metadata = {};

    const existingFiles = FileState.fileList.filter(file => file.isStored);
    existingFiles.forEach(file => {
      formattedUploadParams.metadata[file._id] = {
        thumbnailSettings: uploadParams.thumbnailSettings[file.asset_name],
        // do more formatting here
      };
    });
    return formattedUploadParams;
  }

  return {
    hyrdateAssetData,
    updateAssetMetadata,
    formatNewAssetMetadata,
    formatUpdatedAssetMetadata,
  };
}

// ============================================================================
// ============================================================================
// ============================================================================

function ScoreshelfHelpers() {
  function areNewFiles() {
    let areNewFiles = false;
    for (let file of FileState.fileList) {
      if (!file.isStored) {
        areNewFiles = true;
        break;
      }
    }
    return areNewFiles;
  }

  // ripped from stackoverflow
  function calculateSize(file) {
    const fSExt = ['Bytes', 'KB', 'MB', 'GB'];
    let _size = file.size;
    let i = 0;
    while (_size > 900) {
      _size /= 1024;
      i++;
    }
    const exactSize = Math.round(_size * 100) / 100 + ' ' + fSExt[i];
    return exactSize;
  }

  async function testScoreshelf() {
    try {
      let res = await this.$axios.get('/test');
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  }

  return {
    areNewFiles,
    calculateSize,
    testScoreshelf,
  };
}
