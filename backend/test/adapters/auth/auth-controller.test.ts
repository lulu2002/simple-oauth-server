import {AuthServerValidateResponse} from "@shared/auth-server-validate";
import fastify, {FastifyInstance} from "fastify";
import OauthClientRepositoryInMemory from "@test-fixture/application/auth/oauth-client-repository-in-memory";
import OauthClient from "@src/domain/oauth-client";
import AuthController from "@src/adapters/auth/auth-controller";

describe('AuthController', () => {

  let app: FastifyInstance;
  let clientRepository: OauthClientRepositoryInMemory;
  let client: OauthClient;

  beforeEach(() => {
    app = fastify();
    client = {
      id: "my_client_id",
      name: "test client",
      secret : "secret",
      redirectUris: [
        "http://localhost:5173/callback"
      ],
      allowOrigins: [
        "http://localhost:5173"
      ],
    }
    clientRepository = new OauthClientRepositoryInMemory();
    new AuthController(clientRepository).registerRoutes(app);
  });

  describe("GET /authorize", () => {

    it('should failed if client is not exists', async () => {
      await assertAuthorize('not_exists', 'http://localhost:5173/callback', 400, {
        code: 400,
        valid: false,
        message: 'client with id not found'
      });
    });

    it('should fail if client has mismatch redirect url', async () => {
      clientRepository.add(client)
      await assertAuthorize(client.id, 'http://unkonwn/callback', 400, {
        code: 400,
        valid: false,
        message: 'redirect_uri is not valid'
      })
    });

    it('should success if client is valid', async () => {
      clientRepository.add(client)

      await assertAuthorize(client.id, 'http://localhost:5173/callback', 200, {code: 200, valid: true, message: 'ok'})
    });

    async function assertAuthorize(clientId: string, redirectUri: string, code: number, response: AuthServerValidateResponse) {
      const res = await app.inject({
        method: 'GET',
        url: '/api/authorize',
        query: {
          client_id: clientId,
          redirect_uri: redirectUri
        }
      });

      expect(res.statusCode).toBe(code);
      expect(res.json()).toEqual(response);
    }
  });
});