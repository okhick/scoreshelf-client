// ===============================
// Functions related to Sharetribe that need to be used across components
// ===============================

import { mapState, mapMutations } from 'vuex';
const sharetribeSdk = require('sharetribe-flex-sdk');

export const sharetribe = {
  methods: {
    ...mapMutations('sharetribe', ['initSharetribe', 'updateIsLoggedIn', 'updateCurrentUser']),

    //get the SDK going.
    initSharetribeSdk: async function() {
      let sharetribe = await sharetribeSdk.createInstance({
        clientId: process.env.VUE_APP_SHARETRIBE_CLIENT_ID,
      });
      this.initSharetribe(sharetribe);
      return;
    },

    //should be called whenever you need to double check logged in.
    //probably on every view
    refreshLogin: async function() {
      //check that SHARETRIBE has been loaded.
      if (typeof this.SHARETRIBE.authInfo === 'function') {
        let authInfo = await this.SHARETRIBE.authInfo();

        if (authInfo && authInfo.isAnonymous === false) {
          this.updateIsLoggedIn(true);
          console.log('User is logged in.');

          // update currentUser store
          let currentUser = await this.SHARETRIBE.currentUser.show();
          this.updateCurrentUser(currentUser.data.data);
        } else {
          this.updateIsLoggedIn(false);
          console.log('User is NOT logged in.');
        }
      }
      return;
    },

    convertToSharetribePrice: function(money) {
      return { amount: money * 100, currency: 'USD' };
    },
    convertFromSharetribePrice: function(money) {
      return parseInt(money.amount) / 100;
    },
  },

  computed: {
    // ...mapState(["SHARETRIBE", "isLoggedIn"])
    ...mapState({
      SHARETRIBE: state => state.sharetribe.SHARETRIBE,
      isLoggedIn: state => state.sharetribe.isLoggedIn,
    }),
  },
};
