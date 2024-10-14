import {beforeEach, describe, it} from "node:test";
import fastify, {FastifyInstance} from "fastify";
import AuthController from "./auth-controller";
import assert from "node:assert";
import OauthClientRepositoryInMemory from "@src/application/auth/oauth-client-repository-in-memory";

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

      assert.strictEqual(response.statusCode, 400);
      assert.deepStrictEqual(response.json(), {error: 'invalid_client'});
    });

    it('should fail if client_id is not valid', async () => {

      const response = await app.inject({
        method: 'GET',
        url: '/authorize?client_id=client123&redirect_uri=localhost:3000&response_type=code'
      });

    });

    it('should generate authorize code and response view', () => {
    });

  });

});