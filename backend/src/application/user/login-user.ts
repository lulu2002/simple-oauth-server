import UserRepository from "@src/application/user/user-repository";
import RandomCodeGenerator from "@src/application/util/random-code-generator";
import AuthCodeCache from "@src/application/auth/auth-code-cache";
import CurrentTimeStamp from "@src/application/util/current-time-stamp";
import OauthClientRepository from "@src/application/auth/oauth-client-repository";
import PasswordHashing from "@src/application/hashing/password-hashing";

export default class LoginUser {

  constructor(
    private clientRepo: OauthClientRepository,
    private userRepo: UserRepository,
    private hashing: PasswordHashing,
    private codeGenerator: RandomCodeGenerator,
    private codeCache: AuthCodeCache,
    private currentTimeStamp: CurrentTimeStamp,
    private expiresIn: number,
  ) {
  }

  async login(request: LoginUserRequest): Promise<LoginUserResult> {
    const {client_id, redirect_uri, password, username} = request;
    const client = await this.clientRepo.findById(client_id) ?? null;

    if (!client)
      return {type: 'invalid_client'};

    if (!client.redirectUris.includes(redirect_uri))
      return {type: 'invalid_redirect_uri'};


    const user = await this.userRepo.findByEmail(username) ?? null;

    if (!user || !await this.hashing.verify(password, user.password))
      return {type: 'invalid_credentials'};

    const code = this.codeGenerator.generate(10);
    await this.codeCache.saveCode(client.id, user.id, code, this.currentTimeStamp.get() + this.expiresIn);
    return {type: 'ok', token: code};
  }


}

export type  LoginUserResult =
  | { type: 'invalid_client' }
  | { type: 'invalid_redirect_uri' }
  | { type: 'invalid_credentials' }
  | { type: 'ok', token: string };

export interface LoginUserRequest {
  username: string;
  password: string;
  client_id: string;
  redirect_uri: string;
}