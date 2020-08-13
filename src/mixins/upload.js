import { mapState, mapMutations } from "vuex";

export const uploader = {
  methods: {
    ...mapMutations("dashboard", ["updateFileList"]),

    processUpload: function() {
      const newFiles = this.$refs.file.files;
      newFiles.forEach(file => this.updateFileList(file));
    },

    submitUpload: async function() {
      const formData = new FormData();
      // create a unique key for each file, push it into formdata
      this.fileList.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });
      // send off the files. returns the files uploaded
      let res = await this.$axios.post("/musicUpload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log(res.data);
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
      fileList: state => state.dashboard.fileList
    })
  }
};
