import OauthClientRepository from "@application/auth/oauth-client-repository";
import OauthClient from "@domain/oauth-client";

export default class OauthClientRepositoryInMemory implements OauthClientRepository {

  findById(id: string): OauthClient | undefined {
    return undefined;
  }

}