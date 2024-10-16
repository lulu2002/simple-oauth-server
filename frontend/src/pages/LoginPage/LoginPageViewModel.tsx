import QueryParams from "../../application/QueryParams.ts";
import AuthClientCheckResult from "./AuthClientCheckResult.ts";
import {AuthServerValidateResponse} from "@shared/auth-server-validate.ts"
import {AuthServerLoginRequest, AuthServerLoginResponse} from "@shared/auth-server-login.ts"
import AxiosClient from "@src/application/AxiosClient";
import {AxiosInstance} from "axios";

export default class LoginPageViewModel {

  constructor(
    private queryParams: QueryParams,
    private client: AxiosClient
  ) {
  }

  async checkClientValidAuthRequest(): Promise<AuthClientCheckResult> {
    const clientId = this.queryParams.get('client_id');
    const redirectUri = this.queryParams.get('redirect_uri');

    if (!clientId)
      return {reason: 'client_id is not present', success: false};

    if (!redirectUri)
      return {reason: 'redirect_uri is not present', success: false};

    try {
      const response = await this.getClient().get<AuthServerValidateResponse>('/api/authorize', {
        params: {
          client_id: clientId,
          redirect_uri: redirectUri
        }
      });
      return {reason: response.data.message, success: response.data.valid};
    } catch (error) {
      console.error('Failed to check client id:', error);
      return {reason: 'invalid client_id', success: false};
    }
  }

  async login(username: string, password: string): Promise<AuthLoginResult> {
    const clientId = this.queryParams.get('client_id');
    const redirectUri = this.queryParams.get('redirect_uri');

    if (!clientId)
      return {success: false, message: 'client_id is not present', token: ''};

    if (!redirectUri)
      return {success: false, message: 'redirect_uri is not present', token: ''};

    try {
      const body: AuthServerLoginRequest = {
        username: username,
        password: password,
        client_id: clientId,
        redirect_uri: redirectUri
      };
      const data: AuthServerLoginResponse = (await this.getClient().post<AuthServerLoginResponse>('/api/login', body)).data;
      return {success: data.success, message: data.message, token: data.token};
    } catch (error) {
      console.error('Failed to login:', error);
      return {success: false, message: 'failed to login', token: ''};
    }
  }

  closeWithCode(code: string) {
    window.opener.postMessage({type: 'oauth-success', token: code}, window.location.origin);
    window.close();
  }

  private getClient(): AxiosInstance {
    return this.client.instance();
  }
}

export interface AuthLoginResult {
  success: boolean;
  message: string;
  token: string;
}