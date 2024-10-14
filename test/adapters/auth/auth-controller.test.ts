import fastify, {FastifyInstance} from "fastify";
import AuthController from "@src/adapters/auth/auth-controller";
import OauthClientRepositoryInMemory from "@test-fixture/application/auth/oauth-client-repository-in-memory";

describe('AuthController', () => {

  let app: FastifyInstance;
  let clientRepository: OauthClientRepositoryInMemory;

  beforeEach(() => {
    app = fastify();

    clientRepository = new OauthClientRepositoryInMemory();
    new AuthController(clientRepository).registerRoutes(app);
  });

  describe("GET /authorize", () => {

    it('should failed if client is not exists', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/authorize?client_id=client123&redirect_uri=localhost:3000'
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({error: 'invalid_client'});
    });

  });

});