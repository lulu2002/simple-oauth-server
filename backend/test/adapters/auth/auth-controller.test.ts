import fastify, {FastifyInstance} from "fastify";
import AuthController from "@src/adapters/auth/auth-controller";
import {AuthServerRegisterRequest, AuthServerRegisterResponse} from "@shared/auth-server-register";
import OauthClientRepositoryInMemory from "@test-fixture/application/auth/oauth-client-repository-in-memory";
import UserRepositoryInMemory from "@test-fixture/application/user/user-repository-in-memory";
import RegisterUser from "@src/application/user/register-user";
import OauthClient from "@src/domain/oauth-client";


describe('AuthController', () => {

  let app: FastifyInstance;
  let clientRepository: OauthClientRepositoryInMemory;
  let userRepository: UserRepositoryInMemory;

  let client: OauthClient;

  beforeEach(() => {
    app = fastify();
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

    clientRepository = new OauthClientRepositoryInMemory();
    userRepository = new UserRepositoryInMemory();

    new AuthController(clientRepository, new RegisterUser(userRepository)).registerRoutes(app);

    clientRepository.add(client);
  });

  afterEach(() => {
    app.close();
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

  describe("register", () => {

    it('should fail if email is invalid', async () => {
      await assertRegister({email: "invalid", password: "password"}, 400, {
        success: false,
        message: "invalid_email"
      });
    });

    it('should fail if account already exists', async () => {
      const user = userRepository.create("test@gmail.com", "password");
      await assertRegister({email: user.email, password: "another"}, 400, {
        success: false,
        message: "account_already_exists"
      });
    });

    it('should create', async () => {
      await assertRegister({email: "test@gmail.com", password: "password"}, 200, {
        success: true,
        message: "ok"
      });

      const user = userRepository.findByEmail("test@gmail.com");

      expect(user?.email).toBe("test@gmail.com");
      expect(user?.password).toBe("password");
    });

    async function assertRegister(request: AuthServerRegisterRequest, code: number, response: AuthServerRegisterResponse) {
      const res = await app.inject({
        method: 'POST',
        url: '/api/register',
        body: request
      });

      expect(res.statusCode).toBe(code);
      expect(res.json()).toEqual(response);
    }

  });


});