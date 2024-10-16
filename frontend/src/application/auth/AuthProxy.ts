import {AuthLoginContext, AuthLoginResult} from "@src/domain/AuthLogin.tsx";
import {RegisterAccountContext, RegisterAccountResult} from "@src/domain/RegisterAccount.ts";
import AuthCheckResult from "@src/domain/AuthCheckResult.ts";

export interface AuthProxy {
  login(ctx: AuthLoginContext): Promise<AuthLoginResult>;

  registerAccount(ctx: RegisterAccountContext): Promise<RegisterAccountResult>;

  isAuthenticated(clientId: string, redirectUri: string): Promise<AuthCheckResult>;
}

