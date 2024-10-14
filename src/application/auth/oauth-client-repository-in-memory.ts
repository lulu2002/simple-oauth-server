import OauthClientRepository from "@src/application/auth/oauth-client-repository";
import OauthClient from "@src/domain/oauth-client";

export default class OauthClientRepositoryInMemory implements OauthClientRepository {

  findById(id: string): OauthClient | undefined {
    return undefined;
  }

}