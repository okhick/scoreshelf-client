import { mapState, mapMutations } from "vuex";

export const uploader = {
  methods: {
    ...mapMutations("dashboard", ["addFileToFileList", "addScoreshelfIdToFile"]),

    processUpload: function() {
      const newFiles = this.$refs.file.files;
      newFiles.forEach(file => {
        file.isStored = false;
        this.addFileToFileList(file);
      });
    },

    submitUpload: async function() {
      // there may not be any new files
      if (this.areNewFiles()) {
        const formData = new FormData();

        // create a 'unique key' for each file, push it into formdata
        this.fileList.forEach((file, index) => {
          if (file.isStored == false) {
            formData.append(`file_${index}`, file);
          }
        });
        formData.append("sharetribe_user_id", this.user_id);

        // send off the files. returns the files uploaded
        let res = await this.$axios.post("/musicUpload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        this.addScoreshelfIdToFile(res.data);
        return res;
      }
    },

    removeUpload: async function(fileName) {
      // get some data about the file to be deleted. This feels messy...
      let scoreshelf_id; let isStored;
      for (let i=0; this.fileList.length; i++) {
        let file = this.fileList[i];
        if (file.name == fileName) {
          scoreshelf_id = file.scoreshelf_id;
          isStored = file.isStored;
          break;
        }
      }

      // call the db to remove it if we need to
      if (isStored) {
        await this.$axios.delete("/deleteAsset", {
          data: {
            id: scoreshelf_id
          }
        });
      }
      
      // reminder that it won't be removed from sharetribe until it is saved.
      // probably best not remove it from the database without removing all refrences
      // fixing this is a high on the TODO list

      // finally, remove it from the store
      this.removeFromFileList(fileName);
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
    }
  },
  computed: {
    ...mapState({
      fileList: state => state.dashboard.fileList,
      user_id: state => state.sharetribe.currentUser.id.uuid
    })
  }
};
