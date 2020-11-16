import { reactive, toRefs } from '@vue/composition-api';
import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';

import useScoreshelf from '@/compositions/scoreshelf/scoreshelf.js';

import Vue from 'vue';
import store from '@/store';

const sharetribeStore = createNamespacedHelpers(store, 'sharetribe'); // specific module name
const dashboardStore = createNamespacedHelpers(store, 'dashboard'); // specific module name

// ============================================================================

const FileState = reactive({
  fileList: [],
  filesToBeRemoved: [],
  thumbnailSettings: {},
  previewSettings: {},
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
    newFiles.forEach((file) => {
      file.isStored = false;
      file.asset_name = file.name; // we use asset name everywhere else, start from the beg
      addFileToFileList(file);
      initThumbnail(file);
      initPreview(file);
    });
  }

  function addFileToFileList(payload) {
    FileState.fileList.push(payload);
  }

  function removeFileFromFileList(payload) {
    FileState.fileList = FileState.fileList.filter((file) => file.asset_name !== payload);
    delete FileState.thumbnailSettings[payload];
  }

  function setFileToBeRemoved(payload) {
    FileState.fileList.forEach((file) => {
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
    FileState.previewSettings = {};
    FileState.formats = [];
  }

  function replaceFileWithScoreshelfAsset(payload) {
    FileState.fileList.forEach((file, index) => {
      const asset = payload.find((asset) => asset.asset_name === file.asset_name);
      if (asset) {
        FileState.fileList[index] = asset;
      }
    });
  }

  function refreshFileListWithUpdatedAssets(payload) {
    FileState.fileList = payload;
  }

  function initAssetData() {
    const { publishModalEditData } = dashboardStore.useState(['publishModalEditData']);
    FileState.fileList.forEach((file) => {
      // first make reactive refs for everything
      if (FileState.thumbnailSettings[file.asset_name] === undefined) {
        initThumbnail(file);
      }
      if (FileState.previewSettings[file.asset_name] === undefined) {
        initPreview(file);
      }

      // then loadup any settings that may already exist
      if (file.thumbnail_settings) {
        FileState.thumbnailSettings[file.asset_name].page = file.thumbnail_settings.page;
        FileState.thumbnailSettings[file.asset_name].isThumbnail = true;
      }
      if (publishModalEditData.value.attributes.publicData?.preview) {
        const previewAsset = publishModalEditData.value.attributes.publicData.preview.asset_id;
        if (file._id === previewAsset) {
          FileState.previewSettings[file.asset_name].isPreview = true;
        }
      }
    });
  }

  function initThumbnail(file) {
    Vue.set(FileState.thumbnailSettings, file.asset_name, {
      ...makeBlankThumbnail(),
    });
  }

  function initPreview(file) {
    Vue.set(FileState.previewSettings, file.asset_name, {
      isPreview: false,
    });
  }

  function makeBlankThumbnail() {
    return { isThumbnail: false, page: null };
  }

  return {
    processUpload,
    addFileToFileList,
    removeFileFromFileList,
    setFileToBeRemoved,
    clearToBeRemoved,
    resetFileState,
    replaceFileWithScoreshelfAsset,
    refreshFileListWithUpdatedAssets,
    initAssetData,
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
    const { SCORESHELF } = useScoreshelf();

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
    let res = await SCORESHELF.value.post('/uploadAssets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    scoreshelfFileStateManagement.replaceFileWithScoreshelfAsset(res.data);
    return res;
  }

  async function removeUploads() {
    const { SCORESHELF } = useScoreshelf();
    // call the server to delete db and asset
    await SCORESHELF.value.delete('/deleteAssets', {
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
  const { SCORESHELF } = useScoreshelf();

  const { getCurrentUserId } = sharetribeStore.useGetters(['getCurrentUserId']);
  const { getCurrentListingId } = dashboardStore.useGetters(['getCurrentListingId']);
  const scoreshelfFileStateManagement = FileStateManagement();

  async function hyrdateAssetData(fileList, getLink) {
    const scoreshelf_ids = fileList.map((file) => file.scoreshelf_id);
    const hydratedAssets = await SCORESHELF.value.post('/getAssetdata', {
      scoreshelf_ids: scoreshelf_ids,
      get_link: getLink,
    });
    return hydratedAssets;
  }

  async function updateAssetMetadata(uploadParams) {
    const { SCORESHELF } = useScoreshelf();
    const assetMetadata = formatUpdatedAssetMetadata(uploadParams);
    // this return every asset
    const res = await SCORESHELF.value.post('/updateAssetMetadata', assetMetadata);
    scoreshelfFileStateManagement.refreshFileListWithUpdatedAssets(res.data);

    return res;
  }

  function formatNewAssetMetadata(uploadParams) {
    const formattedUploadParams = {};

    formattedUploadParams.sharetribe_listing_id = getCurrentListingId.value;
    formattedUploadParams.sharetribe_user_id = getCurrentUserId.value;
    formattedUploadParams.metadata = {};

    const newFiles = FileState.fileList.filter((file) => !file.isStored);
    newFiles.forEach((file) => {
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

    FileState.fileList.forEach((file) => {
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
    const { SCORESHELF } = useScoreshelf();
    try {
      let res = await SCORESHELF.value.get('/test');
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
