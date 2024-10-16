import {AuthServerValidateResponse} from "@shared/auth-server-validate.ts";
import {AuthServerLoginRequest, AuthServerLoginResponse} from "@shared/auth-server-login.ts";
import {AuthServerRegisterRequest, AuthServerRegisterResponse} from "@shared/auth-server-register.ts";
import {AxiosInstance} from "axios";
import {AuthProxy} from "@src/application/auth/AuthProxy.ts";
import AuthCheckResult from "@src/domain/AuthCheckResult.ts";
import {AuthLoginContext, AuthLoginResult} from "@src/domain/AuthLogin.tsx";
import {RegisterAccountContext, RegisterAccountResult} from "@src/domain/RegisterAccount.ts";

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
      return {success: data.success, message: data.message, code: data.token};
    } catch (error) {
      console.error('Failed to login:', error);
      return {success: false, message: 'failed to login', code: ''};
    }

  }

  async registerAccount(request: RegisterAccountContext): Promise<RegisterAccountResult> {
    try {
      const body: AuthServerRegisterRequest = {
        username: request.email,
        password: request.password,
      };
      const data: AuthServerRegisterResponse = (await this.axios.post<AuthServerRegisterResponse>('/api/register', body)).data;
      return {success: data.success, reason: data.message};
    } catch (error) {
      console.error('Failed to register:', error);
      return {success: false, reason: 'unknown_error'};
    }
  }

}