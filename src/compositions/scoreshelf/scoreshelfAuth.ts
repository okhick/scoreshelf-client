import axios from 'axios';
import cryptoRandomString from 'crypto-random-string';
import forge from 'node-forge';
import Vue from 'vue';

interface AccessTokenRes {
  status: boolean;
  reason?: string;
  token?: AccessToken;
}
interface AccessToken {
  token: string;
  client_id: string;
  expires_at: string;
}
interface AuthCodeRes {
  status: boolean;
  reason?: string;
  auth_code?: AuthCode;
}
interface AuthCode {
  client_id: string;
  auth_code: string;
  code_challenge: string;
  expires_at: string;
}

export async function authorizeScoreshelfApi() {
  const newAuth = new ScoreshelfAuth();

  // if a token is already valid, just use that
  const tokenIsSet = newAuth.accessTokenIsSet();
  if (tokenIsSet) {
    return newAuth.getAccessTokenCookie();
  }

  // get the auth code, return error if no exist
  const authCode = await newAuth.getAuthCode();
  if (!authCode.status) {
    console.log(authCode);
    return;
  }

  // exchange the auth code for an access token
  if (authCode.auth_code) {
    // get access token, return error in no exist
    const accessToken = await newAuth.getAccessToken(authCode.auth_code.auth_code);
    if (!accessToken.status) {
      console.log(authCode);
      return;
    }
    // store the token
    newAuth.storeAccessToken(accessToken);
    return accessToken.token?.token;
  }
}

class ScoreshelfAuth {
  SCORESHELF;
  codes;
  cookieName;

  constructor() {
    this.SCORESHELF = axios.create({
      baseURL: process.env.VUE_APP_SCORESHELF_URL,
      timeout: 30000,
    });
    this.codes = this.createCodes();
    this.cookieName = `ss-${process.env.VUE_APP_SCORESHELF_CLIENT_ID}-token`;
  }

  createCodes() {
    const code_verifier = cryptoRandomString({ length: 256, type: 'url-safe' });
    const md = forge.md.sha256.create();
    md.update(code_verifier);
    const code_challenge = md.digest().toHex();
    return {
      code_verifier,
      code_challenge,
    };
  }

  async getAuthCode() {
    const authCodeRes = await this.SCORESHELF.post<AuthCodeRes>('auth/generateAuthCode', {
      client_id: process.env.VUE_APP_SCORESHELF_CLIENT_ID,
      code_challenge: this.codes.code_challenge,
    });
    return authCodeRes.data;
  }

  async getAccessToken(auth_code: string) {
    const accessTokenRes = await this.SCORESHELF.post<AccessTokenRes>(
      'auth/generateAccessToken',
      {
        client_id: process.env.VUE_APP_SCORESHELF_CLIENT_ID,
        code_verifier: this.codes.code_verifier,
      },
      {
        headers: {
          authorization: auth_code,
        },
      }
    );
    return accessTokenRes.data;
  }

  // ========== Access token cookie storage ==========

  storeAccessToken(accessToken: AccessTokenRes) {
    const cookieValue = {
      access_token: accessToken.token?.token,
      token_type: 'bearer',
      expires_at: accessToken.token?.expires_at,
    };

    // 4 hour expiration, samesite=none
    Vue.$cookies.set(this.cookieName, cookieValue, '4h', '', '', undefined, 'none');
  }
  accessTokenIsSet() {
    return Vue.$cookies.isKey(this.cookieName);
  }
  getAccessTokenCookie() {
    return Vue.$cookies.get(this.cookieName).access_token;
  }
}
