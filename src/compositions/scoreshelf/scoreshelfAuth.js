import axios from 'axios';
import cryptoRandomString from 'crypto-random-string';
import forge from 'node-forge';

export async function authorizeScoreshelfApi() {
  const newAuth = new ScoreshelfAuth();

  const authCode = await newAuth.getAuthCode();
  if (!authCode.status) {
    console.log(authCode);
    return;
  }

  const accessToken = await newAuth.getAccessToken(authCode.auth_code.auth_code); //this return is bonkers
  if (!accessToken.status) {
    console.log(authCode);
    return;
  }

  return {
    accessToken,
  };
}

class ScoreshelfAuth {
  constructor() {
    this.SCORESHELF = axios.create({
      baseURL: process.env.VUE_APP_SCORESHELF_URL,
      timeout: 30000,
    });
    this.codes = this.createCodes();
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
    const authCodeRes = await this.SCORESHELF.post('auth/generateAuthCode', {
      client_id: process.env.VUE_APP_SCORESHELF_CLIENT_ID,
      code_challenge: this.codes.code_challenge,
    });
    return authCodeRes.data;
  }

  async getAccessToken(auth_code) {
    const accessTokenRes = await this.SCORESHELF.post(
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
}
