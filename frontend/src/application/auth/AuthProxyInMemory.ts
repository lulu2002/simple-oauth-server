import AuthCheckResult from "@src/domain/AuthCheckResult";
import {AuthLoginContext, AuthLoginResult} from "@src/domain/AuthLogin";
import {RegisterAccountContext, RegisterAccountResult} from "@src/domain/RegisterAccount";
import {AuthProxy} from "@src/application/auth/AuthProxy";

export default class AuthProxyInMemory implements AuthProxy {

  private accounts: Map<string, Account> = new Map<string, Account>();
  private allowedClients: Map<string, AuthClient> = new Map<string, AuthClient>();

  async isAuthenticated(clientId: string, redirectUri: string): Promise<AuthCheckResult> {
    const client = this.allowedClients.get(clientId) ?? null;

    if (client === null)
      return {success: false, reason: 'invalid client_id'};

    if (client.redirectUri !== redirectUri)
      return {success: false, reason: 'invalid redirect_uri'};

    return {success: true, reason: 'ok'};
  }

  async login(ctx: AuthLoginContext): Promise<AuthLoginResult> {
    const account = this.accounts.get(ctx.username) ?? null;

    if (account === null || account.password !== ctx.password)
      return {success: false, message: 'invalid credentials', code: '', redirectUri: ''};

    return {success: true, message: 'ok', code: 'code', redirectUri: ctx.redirectUri};
  }

  async addClient(clientId: string, redirectUri: string): Promise<void> {
    this.allowedClients.set(clientId, {clientId, redirectUri});
  }

  async registerAccount(ctx: RegisterAccountContext): Promise<RegisterAccountResult> {
    if (this.accounts.has(ctx.email))
      return {success: false, reason: 'account_already_exists'};

    this.accounts.set(ctx.email, {email: ctx.email, password: ctx.password});
    return {success: true, reason: 'ok'};
  }

}

interface AuthClient {
  clientId: string;
  redirectUri: string;
}

interface Account {
  password: string;
  email: string;
}