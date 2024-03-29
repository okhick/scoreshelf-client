// This doesn't work with import statements as of 2021-01-03
const sharetribeSdk = require('sharetribe-flex-sdk');
import SharetribeState from './sharetribeState';
import { AxiosResponse } from 'axios';
import { CurrentUserResponse } from '@/@types';

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
      const authInfo = await SHARETRIBE.value.authInfo();

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
    return false;
  }

  async function useUpdateCurrentUser() {
    const userData: AxiosResponse<CurrentUserResponse> = await SHARETRIBE.value.currentUser.show();
    useSharetribeState.updateCurrentUser(userData.data.data);
    return userData;
  }

  return {
    useSharetribeState,
    useSharetribeSdk,
    useRefreshLogin,
    useUpdateCurrentUser,
  };
}
