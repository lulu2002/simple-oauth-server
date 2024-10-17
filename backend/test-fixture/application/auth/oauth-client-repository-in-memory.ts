import OauthClientRepository from "@src/application/auth/oauth-client-repository";
import OauthClient from "@src/domain/oauth-client";

export default class OauthClientRepositoryInMemory implements OauthClientRepository {
  private clients: OauthClient[] = []

  async findById(id: string): Promise<OauthClient | undefined> {
    return this.clients.find(client => client.id === id);
  }

  create(client: OauthClient): Promise<OauthClient | undefined> {
    this.clients.push(client);
    return Promise.resolve(client);
  }

  add(client: OauthClient): void {
    this.clients.push(client);
  }

}