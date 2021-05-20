import Vue from 'vue';
import { reactive, toRefs } from '@vue/composition-api';
import { stringify } from 'qs';

import {
  ListingFormat,
  UploadedFile,
  Asset,
  ThumbnailSetting,
  ThumbnailSettings,
  PreviewSettings,
  UploadParams,
  AssetMetadata,
  ListingAssetData,
  ProfilePicture,
  AudioPreviewSettings,
} from '@/@types';
import { DropzoneFile } from 'dropzone';

import useScoreshelf from '@/compositions/scoreshelf/scoreshelf';
import useSharetribe from '@/compositions/sharetribe/sharetribe';
import useDashboard from '@/compositions/dashboard/dashboard';

// ============================================================================

interface IFileState {
  // fileList: UploadedFile[] | Asset[];
  fileList: (UploadedFile | Asset)[];
  filesToBeRemoved: (UploadedFile | Asset)[];
  thumbnailSettings: ThumbnailSettings;
  previewSettings: PreviewSettings;
  audioPreviewSettings: AudioPreviewSettings;
  formats: ListingFormat[];
}

const FileState = reactive<IFileState>({
  fileList: [],
  filesToBeRemoved: [],
  thumbnailSettings: {},
  previewSettings: {},
  audioPreviewSettings: {},
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

  const useScoreshelfProfilePicture = ScoreshelfProfilePicture();

  const useScoreshelfHelpers = ScoreshelfHelpers();

  return {
    ...toRefs(FileState),
    useFileStateManagement,
    useScoreshelfUploadManagement,
    useScoreshelfAssetManagement,
    useScoreshelfProfilePicture,
    useScoreshelfHelpers,
  };
}

// ============================================================================
// ============================================================================
// ============================================================================

function FileStateManagement() {
  function processUpload(file: DropzoneFile) {
    // pass in a DropzoneFile and recast as UploadedFile so we can extend it
    const newFile = file as UploadedFile;
    newFile.isStored = false;
    newFile.asset_name = file.name; // we use asset name everywhere else, start from the beg
    addFileToFileList(newFile);
    if (file.type === 'application/pdf') {
      initThumbnail(newFile);
      initPreview(newFile);
      return;
    }
    if (
      ['audio/mpeg', 'audio/aiff', 'audio/wav', 'audio/x-wav', 'audio/flac'].includes(file.type)
    ) {
      initAudioPreview(newFile);
    }
  }

  function addFileToFileList(payload: UploadedFile | Asset) {
    FileState.fileList.push(payload);
  }

  function removeFileFromFileList(payload: string) {
    FileState.fileList = FileState.fileList.filter(
      (file: UploadedFile | Asset) => file.asset_name !== payload
    );
    delete FileState.thumbnailSettings[payload];
    delete FileState.previewSettings[payload];
  }

  function setFileToBeRemoved(payload: string) {
    FileState.fileList.forEach((file) => {
      if (file.asset_name === payload) {
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
    FileState.audioPreviewSettings = {};
    FileState.formats = [];
  }

  function replaceFileWithScoreshelfAsset(payload: Asset[]) {
    FileState.fileList.forEach((file, index) => {
      const asset = payload.find((asset) => asset.asset_name === file.asset_name);
      if (asset) {
        FileState.fileList[index] = asset;
      }
    });
  }

  function refreshFileListWithUpdatedAssets(payload: Asset[]) {
    FileState.fileList = payload;
  }

  async function hydrateAssetData(assetData: ListingAssetData[]) {
    const assetDataList = assetData;
    const hydratedFileListRes = await ScoreshelfAssetManagement().getHyrdatedAssetData(
      assetDataList,
      true
    );

    // store the files
    if (hydratedFileListRes) {
      hydratedFileListRes.data.forEach((file) => {
        if (file) {
          file.isStored = true;
          FileStateManagement().addFileToFileList(file);
        }
      });
    }
    return;
  }

  async function initAssetData() {
    const { useDashboardState } = useDashboard();
    const { publishModalEditData } = useDashboardState;
    // ----- First hydrate the asset data and add to FileList -----
    const assetData = publishModalEditData.value?.attributes.privateData.assetData;

    if (assetData && assetData.length > 0) {
      await hydrateAssetData(assetData);
    }
    // ----- Then init the fields -----
    FileState.fileList.forEach((file) => {
      // first make reactive refs for everything
      if (FileState.thumbnailSettings[file.asset_name] === undefined) {
        initThumbnail(file);
      }
      if (FileState.previewSettings[file.asset_name] === undefined) {
        initPreview(file);
      }

      // then loadup any settings that may already exist
      if ('thumbnail_settings' in file) {
        FileState.thumbnailSettings[file.asset_name].page = file.thumbnail_settings?.page
          ? file.thumbnail_settings.page
          : null;
        FileState.thumbnailSettings[file.asset_name].isThumbnail = true;
      }
      if (publishModalEditData.value?.attributes.publicData?.preview) {
        const previewAsset = publishModalEditData.value.attributes.publicData.preview.asset_id;
        if ('_id' in file && file._id === previewAsset) {
          FileState.previewSettings[file.asset_name].isPreview = true;
        }
      }
    });
    return;
  }

  function initThumbnail(file: UploadedFile | Asset) {
    Vue.set(FileState.thumbnailSettings, file.asset_name, {
      ...makeBlankThumbnail(),
    });
  }

  function initPreview(file: UploadedFile | Asset) {
    Vue.set(FileState.previewSettings, file.asset_name, {
      isPreview: false,
    });
  }

  function initAudioPreview(file: UploadedFile | Asset) {
    Vue.set(FileState.audioPreviewSettings, file.asset_name, {
      isAudioPreview: false,
    });
  }

  function makeBlankThumbnail(): ThumbnailSetting {
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
    // actually type this is if we're going to use it
    const res: { uploadRes: any; deleteRes: any } = { uploadRes: undefined, deleteRes: undefined };
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

  async function uploadNewFiles(uploadParams: UploadParams) {
    const formData = new FormData();
    const { SCORESHELF } = useScoreshelf();

    // create a 'unique key' for each file, push it into formdata
    FileState.fileList.forEach((file, index) => {
      if (file.isStored === false) {
        formData.append(`file_${index}`, <UploadedFile>file);
      }
    });

    const assetMetadata = scoreshelfAssetManagement.formatNewAssetMetadata(uploadParams);
    // stringify this so we can stuff it in a form field
    formData.append('assetMetadata', JSON.stringify(assetMetadata));
    // send off the files. returns the files uploaded
    const res = await SCORESHELF.value?.post<Asset[]>('assets/uploadAssets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (res?.status === 200 && res?.data) {
      scoreshelfFileStateManagement.replaceFileWithScoreshelfAsset(res.data);
    }
    return res;
  }

  async function removeUploads() {
    const { SCORESHELF } = useScoreshelf();
    // call the server to delete db and asset
    const res = await SCORESHELF.value?.delete<string[]>('assets/deleteAssets', {
      data: {
        filesToRemove: FileState.filesToBeRemoved,
      },
    });

    // finally, remove it from the store
    scoreshelfFileStateManagement.clearToBeRemoved();
    return res;
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

  const { useDashboardState } = useDashboard();
  const { getCurrentListingId } = useDashboardState;

  const { useSharetribeState } = useSharetribe();
  const { getCurrentUserId } = useSharetribeState;

  const scoreshelfFileStateManagement = FileStateManagement();

  async function getHyrdatedAssetData(assetDataList: ListingAssetData[], getLink: boolean) {
    const scoreshelf_ids = assetDataList.map((file) => file.scoreshelf_id);
    const hydratedAssets = await SCORESHELF.value?.get<(Asset | null)[]>('assets/getAssetdata', {
      params: {
        scoreshelf_ids: scoreshelf_ids,
        getLink: getLink,
        getType: 'asset',
      },
      paramsSerializer: (params) => {
        return stringify(params);
      },
    });
    return hydratedAssets;
  }

  async function updateAssetMetadata(uploadParams: UploadParams) {
    const { SCORESHELF } = useScoreshelf();
    const assetMetadata = formatUpdatedAssetMetadata(uploadParams);

    // this return every asset
    const res = await SCORESHELF.value?.post<Asset[]>('assets/updateAssetMetadata', assetMetadata);
    if (res?.data) {
      scoreshelfFileStateManagement.refreshFileListWithUpdatedAssets(res.data);
    }
    return res;
  }

  // TODO: Combine these two functions.
  function formatNewAssetMetadata(uploadParams: UploadParams) {
    const formattedUploadParams = <AssetMetadata>{};

    formattedUploadParams.sharetribe_listing_id = getCurrentListingId();
    formattedUploadParams.sharetribe_user_id = getCurrentUserId();
    formattedUploadParams.metadata = {};

    // Is this even needed?! I don't think so...
    const newFiles = FileState.fileList.filter((file) => !file.isStored);
    newFiles.forEach((file) => {
      formattedUploadParams.metadata[file.asset_name] = {
        thumbnailSettings: uploadParams.thumbnailSettings[file.asset_name],
        // do more formatting here
      };
    });

    return formattedUploadParams;
  }

  function formatUpdatedAssetMetadata(uploadParams: UploadParams) {
    const formattedUploadParams = <AssetMetadata>{};

    formattedUploadParams.sharetribe_listing_id = getCurrentListingId();
    formattedUploadParams.sharetribe_user_id = getCurrentUserId();
    formattedUploadParams.metadata = {};

    FileState.fileList.forEach((file) => {
      if ('_id' in file) {
        formattedUploadParams.metadata[file._id] = {
          thumbnailSettings: uploadParams.thumbnailSettings[file.asset_name],
          // do more formatting here
        };
      }
    });
    return formattedUploadParams;
  }

  return {
    getHyrdatedAssetData,
    updateAssetMetadata,
    formatNewAssetMetadata,
    formatUpdatedAssetMetadata,
  };
}

// ============================================================================
// ============================================================================
// ============================================================================

function ScoreshelfProfilePicture() {
  const { SCORESHELF } = useScoreshelf();
  const { useSharetribeState } = useSharetribe();
  const { getCurrentUserId } = useSharetribeState;

  async function hydrateProfilePicture(scoreshelf_id: string) {
    const res = await SCORESHELF.value?.get<ProfilePicture[]>('assets/getAssetData', {
      params: {
        scoreshelf_ids: [scoreshelf_id],
        getLink: false,
        getType: 'profile',
      },
    });
    return res?.data[0];
  }

  async function uploadProfilePicture(file: UploadedFile) {
    const formData = new FormData();

    const currentUserId = {
      sharetribe_user_id: getCurrentUserId(),
    };

    formData.append(`file`, file);
    formData.append('assetMetadata', JSON.stringify(currentUserId));

    const newProfilePicture = await SCORESHELF.value?.post<ProfilePicture>(
      'assets/uploadProfilePicture',
      formData
    );
    return newProfilePicture;
  }

  return {
    uploadProfilePicture,
    hydrateProfilePicture,
  };
}

// ============================================================================
// ============================================================================
// ============================================================================

function ScoreshelfHelpers() {
  function areNewFiles() {
    let areNewFiles = false;
    for (const file of FileState.fileList) {
      if (!file.isStored) {
        areNewFiles = true;
        break;
      }
    }
    return areNewFiles;
  }

  // ripped from stackoverflow
  function calculateSize(file: UploadedFile | Asset) {
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
      const res = await SCORESHELF.value?.get<any>('assets/test');
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
