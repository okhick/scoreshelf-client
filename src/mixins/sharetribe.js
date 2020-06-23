import { mapState, mapMutations } from "vuex";
const sharetribeSdk = require("sharetribe-flex-sdk");

export const sharetribe = {
  methods: {
    ...mapMutations(["initSharetribe", "updateIsLoggedIn"]),

    //get the SDK going.
    initSharetribeSdk: async function() {
      let sharetribe = await sharetribeSdk.createInstance({
        clientId: process.env.VUE_APP_SHARETRIBE_CLIENT_ID
      });
      this.initSharetribe(sharetribe);
      return;
    },

    //should be called whenever you need to double check logged in.
    //probably on every view
    refreshLogin: async function() {
      //check that SHARETRIBE has been loaded.
      if (typeof this.SHARETRIBE.authInfo === "function") {
        let authInfo = await this.SHARETRIBE.authInfo();

        if (authInfo && authInfo.isAnonymous === false) {
          this.updateIsLoggedIn(true);
          console.log("User is logged in.");
        } else {
          this.updateIsLoggedIn(false);
          console.log("User is NOT logged in.");
        }
      }
      return;
    }
  },

  computed: {
    ...mapState(["SHARETRIBE", "isLoggedIn"])
  }
};
