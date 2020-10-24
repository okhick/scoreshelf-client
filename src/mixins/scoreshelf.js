import { mapState, mapMutations } from 'vuex';

export const scoreshelf = {
  methods: {
    ...mapMutations('dashboard', [
      'addFileToFileList',
      'addScoreshelfIdToFile',
      'clearToBeRemoved',
    ]),

    processUpload: function() {
      const newFiles = this.$refs.file.files;
      newFiles.forEach(file => {
        file.isStored = false;
        file.asset_name = file.name; // we use asset name everywhere else, start from the beg
        this.addFileToFileList(file);
      });
    },

    submitUpload: async function(uploadParams) {
      const res = {};

      if (this.areNewFiles()) {
        res.uploadRes = await this.uploadNewFiles(uploadParams);
      }

      if (this.filesToBeRemoved.length > 0) {
        res.deleteRes = await this.removeUploads();
      }

      res.updateMetadataRes = await this.updateAssetMetadata(uploadParams);
      return res;
    },

    uploadNewFiles: async function(uploadParams) {
      const formData = new FormData();

      // create a 'unique key' for each file, push it into formdata
      this.fileList.forEach((file, index) => {
        if (file.isStored == false) {
          formData.append(`file_${index}`, file);
        }
      });

      const assetMetadata = this.formatAssetMetadata(uploadParams, 'new');
      // stringify this so we can stuff it in a form field
      formData.append('assetMetadata', JSON.stringify(assetMetadata));

      // send off the files. returns the files uploaded
      let res = await this.$axios.post('/uploadAssets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      this.addScoreshelfIdToFile(res.data);
      return res;
    },

    removeUploads: async function() {
      // call the server to delete db and asset
      await this.$axios.delete('/deleteAssets', {
        data: {
          filesToRemove: this.filesToBeRemoved,
        },
      });

      // finally, remove it from the store
      this.clearToBeRemoved();
      return true;
    },

    updateAssetMetadata: async function(uploadParams) {
      const assetMetadata = this.formatAssetMetadata(uploadParams, 'existing');
      const res = await this.$axios.post('/updateAssetMetadata', assetMetadata);
      return res;
    },

    formatAssetMetadata: function(uploadParams, action) {
      const formattedUploadParams = {};

      formattedUploadParams.sharetribe_listing_id = this.listing_id;
      formattedUploadParams.sharetribe_user_id = this.user_id;

      const formattedThumbnailSettings = {};
      switch (action) {
        case 'new': {
          let newFiles = this.fileList.filter(file => !file.isStored);
          newFiles.forEach(file => {
            formattedThumbnailSettings[file.asset_name] =
              uploadParams.thumbnailSettings[file.asset_name];
          });
          break;
        }
        case 'existing': {
          let existingFiles = this.fileList.filter(file => file.isStored);
          existingFiles.forEach(file => {
            formattedThumbnailSettings[file._id] = uploadParams.thumbnailSettings[file.asset_name];
          });
          break;
        }
      }

      formattedUploadParams.thumbnailSettings = formattedThumbnailSettings;
      return formattedUploadParams;
    },

    hyrdateAssetData: async function(fileList, getLink) {
      const scoreshelf_ids = fileList.map(file => file.scoreshelf_id);
      const hydratedAssets = await this.$axios.post('/getAssetdata', {
        scoreshelf_ids: scoreshelf_ids,
        get_link: getLink,
      });
      return hydratedAssets;
    },

    // check if there are new files that need storing
    areNewFiles: function() {
      let areNewFiles = false;
      for (let file of this.fileList) {
        if (file.isStored == false) {
          areNewFiles = true;
          break;
        }
      }
      return areNewFiles;
    },

    // ripped from stackoverflow
    calculateSize: function(file) {
      const fSExt = ['Bytes', 'KB', 'MB', 'GB'];
      let _size = file.size;
      let i = 0;
      while (_size > 900) {
        _size /= 1024;
        i++;
      }
      const exactSize = Math.round(_size * 100) / 100 + ' ' + fSExt[i];
      return exactSize;
    },

    testScoreshelf: async function() {
      try {
        let res = await this.$axios.get('/test');
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    },
  },
  computed: {
    ...mapState({
      fileList: state => state.dashboard.fileList,
      user_id: state => state.sharetribe.currentUser.id.uuid,
      listing_id: state => state.dashboard.publishModalEditData.id.uuid,
      filesToBeRemoved: state => state.dashboard.filesToBeRemoved,
    }),
  },
};
