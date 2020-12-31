const sharetribeSdk = require('sharetribe-flex-sdk');
import SharetribeState from './sharetribeState';
// ========================================================
// ===================Sharetribe State=====================
// ========================================================

// const SHARETRIBE = ref();
// const isLoggedIn = ref(false);
// const currentUser = ref();

// function SharetribeState() {
//   function initSharetribe(payload) {
//     SHARETRIBE.value = payload;
//   }

//   function updateIsLoggedIn(payload) {
//     isLoggedIn.value = payload;
//   }

//   function updateCurrentUser(payload) {
//     currentUser.value = payload;
//   }

//   function getCurrentUserId() {
//     return currentUser.value.id.uuid;
//   }

//   return {
//     initSharetribe,
//     updateIsLoggedIn,
//     updateCurrentUser,
//     getCurrentUserId,
//     SHARETRIBE,
//     isLoggedIn,
//     currentUser,
//   };
// }

// ========================================================

export default function useSharetribe() {
  const useSharetribeState = SharetribeState();
  const { SHARETRIBE } = useSharetribeState;

  async function useSharetribeSdk() {
    const sharetribeInstance = await sharetribeSdk.createInstance({
      clientId: process.env.VUE_APP_SHARETRIBE_CLIENT_ID,
    });
    useSharetribeState.initSharetribe(sharetribeInstance);
    return;
  }

  //should be called whenever you need to double check logged in.
  //probably on every view
  async function useRefreshLogin() {
    //check that SHARETRIBE has been loaded.
    if (typeof SHARETRIBE.value.authInfo === 'function') {
      let authInfo = await SHARETRIBE.value.authInfo();

      if (authInfo && authInfo.isAnonymous === false) {
        useSharetribeState.updateIsLoggedIn(true);
        console.log('User is logged in.');
        return true;
      } else {
        useSharetribeState.updateIsLoggedIn(false);
        console.log('User is NOT logged in.');
        return false;
        // TODO do some actions to make sure logout etc...
      }
    }
  }

  async function useUpdateCurrentUser() {
    const userData = await SHARETRIBE.value.currentUser.show();
    useSharetribeState.updateCurrentUser(userData.data.data);
    return userData;
  }

  function convertToSharetribePrice(money) {
    return { amount: money * 100, currency: 'USD' };
  }
  function convertFromSharetribePrice(money) {
    return parseInt(money.amount) / 100;
  }

  return {
    useSharetribeState,
    useSharetribeSdk,
    useRefreshLogin,
    useUpdateCurrentUser,
    convertToSharetribePrice,
    convertFromSharetribePrice,
  };
}
