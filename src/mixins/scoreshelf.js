import { mapState, mapMutations } from "vuex";

export const uploader = {
  methods: {
    ...mapMutations("dashboard", [
      "addFileToFileList", 
      "addScoreshelfIdToFile",
      "clearToBeRemoved"
    ]),

    processUpload: function() {
      const newFiles = this.$refs.file.files;
      newFiles.forEach(file => {
        file.isStored = false;
        this.addFileToFileList(file);
      });
    },

    submitUpload: async function() {
      let res = {};
      if (this.areNewFiles()) {
        res.uploadRes = await this.uploadNewFiles();
      }

      if (this.filesToBeRemoved.length > 0) {
        res.deleteRes = await this.removeUploads();
      }
      return res;
    },

    uploadNewFiles: async function() {
      const formData = new FormData();

        // create a 'unique key' for each file, push it into formdata
        this.fileList.forEach((file, index) => {
          if (file.isStored == false) {
            formData.append(`file_${index}`, file);
          }
        });
        formData.append("sharetribe_user_id", this.user_id);

        // send off the files. returns the files uploaded
        let res = await this.$axios.post("/uploadAsset", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        this.addScoreshelfIdToFile(res.data);
        return res;
    },

    removeUploads: async function() {
      // call the server to delete db and asset
      await this.$axios.delete("/deleteAsset", {
        data: {
          filesToRemove: this.filesToBeRemoved
        }
      });

      // finally, remove it from the store
      this.clearToBeRemoved();
      return true;
    },

    // check if there are new files that need storing
    areNewFiles: function() {
      let areNewFiles = false;
      for(let file of this.fileList) {
        if(file.isStored == false) {
          areNewFiles = true;
          break;
        }
      }
      return areNewFiles;
    },

    // ripped from stackoverflow
    calculateSize: function(file) {
      const fSExt = ["Bytes", "KB", "MB", "GB"];
      let _size = file.size;
      let i = 0;
      while (_size > 900) {
        _size /= 1024;
        i++;
      }
      const exactSize = Math.round(_size * 100) / 100 + " " + fSExt[i];
      return exactSize;
    },

    testScoreshelf: async function() {
      try{
        let res = await this.$axios.get("/test");
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
      filesToBeRemoved: state => state.dashboard.filesToBeRemoved
    })
  }
};
