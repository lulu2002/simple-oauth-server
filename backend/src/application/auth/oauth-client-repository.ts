import OauthClient from "@src/domain/oauth-client";

export default interface OauthClientRepository {
  findById(id: string): Promise<OauthClient | undefined>;
  create(client: OauthClient): Promise<OauthClient | undefined>;
}

