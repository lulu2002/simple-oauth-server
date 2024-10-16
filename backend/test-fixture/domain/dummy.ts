import OauthClient from "@src/domain/oauth-client";

export default class Dummy {

  static oauthClient(updates: Partial<OauthClient> = {}): OauthClient {
    const origi = {
      id: "id",
      name: "name",
      secret: "secret",
      allowOrigins: [],
      redirectUris: [],
    }

    return {
      ...origi,
      ...updates
    }
  }

}
