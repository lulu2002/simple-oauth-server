import fastify, {FastifyInstance} from "fastify";
import fastifyStatic from "@fastify/static";
import AuthController from "@src/adapters/auth/auth-controller";
import OauthClientRepositoryInMemory from "@test-fixture/application/auth/oauth-client-repository-in-memory";
import OauthClient from "@domain/oauth-client";
import os from 'node:os';
import fs from 'node:fs';


describe('AuthController', () => {

  let app: FastifyInstance;
  let clientRepository: OauthClientRepositoryInMemory;
  let tempDir: string;

  let client: OauthClient;

  beforeEach(() => {
    app = fastify();
    tempDir = os.tmpdir();
    client = {
      id: "my_client_id",
      name: "test client",
      secret: "secret_11222",
      redirectUris: [
        "http://localhost:5173/callback"
      ],
      allowOrigins: [
        "http://localhost:5173"
      ],
    }

    app.register(fastifyStatic, {
      root: tempDir,
      prefix: '/'
    });

    fs.writeFileSync(`${tempDir}/login.html`, "hello");

    clientRepository = new OauthClientRepositoryInMemory();
    new AuthController(clientRepository).registerRoutes(app);

    clientRepository.add(client);
  });

  describe("GET /authorize", () => {

    it('should failed if client is not exists', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/authorize',
        query: {
          client_id: 'not_exists',
          redirect_uri: 'http://localhost:5173/callback'
        }
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({error: 'invalid_client'});
    });

    it('should fail if client has mismatch origin', async () => {
      clientRepository.add(client)

      const response = await app.inject({
        method: 'GET',
        url: '/authorize',
        headers: {
          host: 'unknown-host'
        },
        query: {
          client_id: client.id,
          redirect_uri: 'localhost:3000'
        }
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({error: 'invalid_origin'});
    });

    it('should fail if client has mismatch redirect url', async () => {
      clientRepository.add(client)

      const response = await app.inject({
        method: 'GET',
        url: '/authorize',
        headers: {
          host: 'http://localhost:5173'
        },
        query: {
          client_id: client.id,
          redirect_uri: 'http://unkonwn/callback'
        }
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({error: 'invalid_redirect_uri'});
    });

    it('should success if client is valid', async () => {
      clientRepository.add(client)

      const response = await app.inject({
        method: 'GET',
        url: '/authorize',
        headers: {
          host: 'http://localhost:5173'
        },
        query: {
          client_id: client.id,
          redirect_uri: 'http://localhost:5173/callback'
        }
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toBe("hello");
    });
  });

});