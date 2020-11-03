import { toRefs, reactive } from '@vue/composition-api';

import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const sharetribeStore = createNamespacedHelpers('sharetribe'); // specific module name

const sharetribeSdk = require('sharetribe-flex-sdk');

export default function useSharetribe() {
  const sharetribeState = sharetribeStore.useState(['isLoggedIn', 'SHARETRIBE']);
  const sharetribeMutations = sharetribeStore.useMutations([
    'initSharetribe',
    'updateIsLoggedIn',
    'updateCurrentUser',
  ]);

  async function useSharetribeSdk() {
    let sharetribe = await sharetribeSdk.createInstance({
      clientId: process.env.VUE_APP_SHARETRIBE_CLIENT_ID,
    });
    sharetribeMutations.initSharetribe(sharetribe);
    return;
  }

  //should be called whenever you need to double check logged in.
  //probably on every view
  async function useRefreshLogin() {
    //check that SHARETRIBE has been loaded.
    if (typeof sharetribeState.SHARETRIBE.value.authInfo === 'function') {
      let authInfo = await sharetribeState.SHARETRIBE.value.authInfo();

      if (authInfo && authInfo.isAnonymous === false) {
        sharetribeMutations.updateIsLoggedIn(true);
        console.log('User is logged in.');
        return true;
      } else {
        sharetribeMutations.updateIsLoggedIn(false);
        console.log('User is NOT logged in.');
        return false;
        // TODO do some actions to make sure logout etc...
      }
    }
  }

  async function useUpdateCurrentUser() {
    const userData = await sharetribeState.SHARETRIBE.value.currentUser.show();
    await sharetribeMutations.updateCurrentUser(userData.data.data);
    return userData;
  }

  function convertToSharetribePrice(money) {
    return { amount: money * 100, currency: 'USD' };
  }
  function convertFromSharetribePrice(money) {
    return parseInt(money.amount) / 100;
  }

  return {
    useSharetribeSdk,
    useRefreshLogin,
    useUpdateCurrentUser,
    convertToSharetribePrice,
    convertFromSharetribePrice,
  };
}
