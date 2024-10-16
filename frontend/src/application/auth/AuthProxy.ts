import {AuthLoginContext, AuthLoginResult} from "@src/domain/AuthLogin";
import {RegisterAccountContext, RegisterAccountResult} from "@src/domain/RegisterAccount";
import AuthCheckResult from "@src/domain/AuthCheckResult";

export interface AuthProxy {
  login(ctx: AuthLoginContext): Promise<AuthLoginResult>;

  registerAccount(ctx: RegisterAccountContext): Promise<RegisterAccountResult>;

  isAuthenticated(clientId: string, redirectUri: string): Promise<AuthCheckResult>;
}

