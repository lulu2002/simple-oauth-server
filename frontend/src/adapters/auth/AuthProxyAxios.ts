import {AuthServerValidateResponse} from "@shared/auth-server-validate";
import {AuthServerLoginRequest, AuthServerLoginResponse} from "@shared/auth-server-login";
import {AuthServerRegisterRequest, AuthServerRegisterResponse} from "@shared/auth-server-register";
import {AxiosError, AxiosInstance} from "axios";
import {AuthProxy} from "@src/application/auth/AuthProxy";
import AuthCheckResult from "@src/domain/AuthCheckResult";
import {AuthLoginContext, AuthLoginResult} from "@src/domain/AuthLogin";
import {RegisterAccountContext, RegisterAccountResult} from "@src/domain/RegisterAccount";

export default class AuthProxyAxios implements AuthProxy {

  constructor(private axios: AxiosInstance) {
  }

  async isAuthenticated(clientId: string, redirectUri: string): Promise<AuthCheckResult> {
    try {
      const response = await this.axios.get<AuthServerValidateResponse>('/api/authorize', {
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

  async login(ctx: AuthLoginContext): Promise<AuthLoginResult> {
    try {
      const body: AuthServerLoginRequest = {
        username: ctx.username,
        password: ctx.password,
        client_id: ctx.clientId,
        redirect_uri: ctx.redirectUri
      };
      const data: AuthServerLoginResponse = (await this.axios.post<AuthServerLoginResponse>('/api/login', body)).data;
      return {success: data.success, message: data.message, code: data.token, redirectUri: ctx.redirectUri};
    } catch (error) {
      console.error('Failed to login:', error);
      return {success: false, message: 'failed to login', code: '', redirectUri: ''};
    }

  }

  async registerAccount(request: RegisterAccountContext): Promise<RegisterAccountResult> {
    try {
      const body: AuthServerRegisterRequest = {
        email: request.email,
        password: request.password,
      };
      const data: AuthServerRegisterResponse = (await this.axios.post<AuthServerRegisterResponse>('/api/register', body)).data;
      return {success: data.success, reason: data.message};
    } catch (error) {
      const message: AuthServerRegisterResponse["message"] = this.getErrorMessageIfPossible(error) ?? 'unknown_error';
      return {success: false, reason: message};
    }
  }

  private getErrorMessageIfPossible(error: Error | unknown): AuthServerRegisterResponse["message"] | undefined {
    if (error instanceof AxiosError) {
      return error.response?.data?.message ?? undefined;
    }
    return undefined;
  }

}