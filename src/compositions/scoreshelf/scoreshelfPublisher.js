import { reactive, toRefs } from '@vue/composition-api';
import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';

import axios from 'axios';
const axiosConfig = {
  baseURL: 'http://127.0.0.1:3000/',
  timeout: 30000,
};
const SCORESHELF = axios.create(axiosConfig);

import store from '@/store';

const sharetribeStore = createNamespacedHelpers(store, 'sharetribe'); // specific module name
const dashboardStore = createNamespacedHelpers(store, 'dashboard'); // specific module name

// ============================================================================

const FileState = reactive({
  fileList: [],
  filesToBeRemoved: [],
  thumbnailSettings: {},
  formats: [],
});

// ============================================================================

export default function useScoreshelfPublisher() {
  // manage the FileState
  const useFileStateManagement = FileStateManagement();

  // manage files/data uploaded to the browser
  const useScoreshelfUploadManagement = ScoreshelfUploadManagement();

  // manage files/data upload to scoreshelf
  const useScoreshelfAssetManagement = ScoreshelfAssetManagement();

  const useScoreshelfHelpers = ScoreshelfHelpers();

  return {
    ...toRefs(FileState),
    useFileStateManagement,
    useScoreshelfUploadManagement,
    useScoreshelfAssetManagement,
    useScoreshelfHelpers,
  };
}

// ============================================================================
// ============================================================================
// ============================================================================

function FileStateManagement() {
  function processUpload(newFiles) {
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
    FileState.formats = [];
  }

  function addScoreshelfIdToFile(payload) {
    FileState.fileList.forEach(file => {
      const name = file.asset_name;
      const newDataFilter = payload.filter(asset => asset.asset_name === name);
      // if an asset exists with that name,
      if (newDataFilter.length === 1) {
        const newData = newDataFilter[0];
        file._id = newData._id;
        file.isStored = true;
      } else {
        console.log('More than one asset with that name!', file.asset_name);
      }
    });
  }

  function updateThumbnailSettings(payload) {
    if (payload.length === 0) {
      FileState.thumbnailSettings = null;
    } else {
      payload.forEach(asset => {
        const thumbnail = FileState.thumbnailSettings[asset.asset_name];
        thumbnail.thumbnail_id = asset.thumbnail_settings._id;
      });
    }
  }

  return {
    processUpload,
    addFileToFileList,
    removeFileFromFileList,
    setFileToBeRemoved,
    clearToBeRemoved,
    resetFileState,
    addScoreshelfIdToFile,
    updateThumbnailSettings,
  };
}

// ============================================================================
// ============================================================================
// ============================================================================

function ScoreshelfUploadManagement() {
  const scoreshelfAssetManagement = ScoreshelfAssetManagement();
  const scoreshelfFileStateManagement = FileStateManagement();
  const scoreshelfUploadHelpers = ScoreshelfHelpers();

  async function submitUpload() {
    const res = {};
    const uploadParams = {
      thumbnailSettings: FileState.thumbnailSettings,
    };

    if (scoreshelfUploadHelpers.areNewFiles()) {
      res.uploadRes = await uploadNewFiles(uploadParams);
    }

    if (FileState.filesToBeRemoved.length > 0) {
      res.deleteRes = await removeUploads();
    }

    await scoreshelfAssetManagement.updateAssetMetadata(uploadParams);

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
    let res = await SCORESHELF.post('/uploadAssets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    scoreshelfFileStateManagement.addScoreshelfIdToFile(res.data);
    return res;
  }

  async function removeUploads() {
    // call the server to delete db and asset
    await SCORESHELF.delete('/deleteAssets', {
      data: {
        filesToRemove: FileState.filesToBeRemoved,
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
  const { getCurrentUserId } = sharetribeStore.useGetters(['getCurrentUserId']);
  const { getCurrentListingId } = dashboardStore.useGetters(['getCurrentListingId']);
  const scoreshelfFileStateManagement = FileStateManagement();

  async function hyrdateAssetData(fileList, getLink) {
    const scoreshelf_ids = fileList.map(file => file.scoreshelf_id);
    const hydratedAssets = await SCORESHELF.post('/getAssetdata', {
      scoreshelf_ids: scoreshelf_ids,
      get_link: getLink,
    });
    return hydratedAssets;
  }

  async function updateAssetMetadata(uploadParams) {
    const assetMetadata = formatUpdatedAssetMetadata(uploadParams);
    const res = await SCORESHELF.post('/updateAssetMetadata', assetMetadata);
    scoreshelfFileStateManagement.updateThumbnailSettings(res.data);
    return res;
  }

  function formatNewAssetMetadata(uploadParams) {
    const formattedUploadParams = {};

    formattedUploadParams.sharetribe_listing_id = getCurrentListingId.value;
    formattedUploadParams.sharetribe_user_id = getCurrentUserId.value;
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

    formattedUploadParams.sharetribe_listing_id = getCurrentListingId.value;
    formattedUploadParams.sharetribe_user_id = getCurrentUserId.value;
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
      let res = await SCORESHELF.get('/test');
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
