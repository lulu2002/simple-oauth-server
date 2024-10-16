import OauthClientRepository from "@src/application/auth/oauth-client-repository";
import OauthClient from "@src/domain/oauth-client";

export default class OauthClientRepositoryInMemory implements OauthClientRepository {

  private clients: OauthClient[] = []

  findById(id: string): OauthClient | undefined {
    return this.clients.find(client => client.id === id);
  }

  add(client: OauthClient): void {
    this.clients.push(client);
  }

}