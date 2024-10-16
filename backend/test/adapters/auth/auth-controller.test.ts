import fastify, {FastifyInstance} from "fastify";
import AuthController from "@src/adapters/auth/auth-controller";
import {AuthServerRegisterRequest, AuthServerRegisterResponse} from "@shared/auth-server-register";
import {AuthServerValidateResponse} from "@shared/auth-server-validate";
import {AuthServerLoginRequest, AuthServerLoginResponse} from "@shared/auth-server-login";
import OauthClientRepositoryInMemory from "@test-fixture/application/auth/oauth-client-repository-in-memory";
import UserRepositoryInMemory from "@test-fixture/application/user/user-repository-in-memory";
import RegisterUser from "@src/application/user/register-user";
import OauthClient from "@src/domain/oauth-client";
import PasswordHashingImpl from "@src/adapters/hashing/PasswordHashingImpl";
import PasswordHashing from "@src/application/hashing/PasswordHashing";
import RandomCodeGenerator from "@src/application/util/random-code-generator";
import RandomCodeGeneratorFixed from "@test-fixture/application/util/random-code-generator-fixed";
import AuthCodeCacheInMemory from "@test-fixture/application/auth/auth-code-cache-in-memory";
import CurrentTimeStampMock from "@test-fixture/application/util/current-time-stamp-mock";


describe('AuthController', () => {

  let app: FastifyInstance;
  let clientRepository: OauthClientRepositoryInMemory;
  let userRepository: UserRepositoryInMemory;
  let hashing: PasswordHashing
  let codeGenerator: RandomCodeGenerator
  let codeCache: AuthCodeCacheInMemory

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

    const currentTime = new CurrentTimeStampMock(1000);
    clientRepository = new OauthClientRepositoryInMemory();
    userRepository = new UserRepositoryInMemory();
    hashing = new PasswordHashingImpl(10);
    codeGenerator = new RandomCodeGeneratorFixed("c")
    codeCache = new AuthCodeCacheInMemory(currentTime);


    new AuthController(
      clientRepository,
      userRepository,
      hashing,
      new RegisterUser(userRepository, hashing),
      codeGenerator,
      codeCache,
      currentTime,
      1001
    ).registerRoutes(app);

    clientRepository.add(client);
  });

  afterEach(() => {
    app.close();
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

  describe("register", () => {

    it('should fail if email is invalid', async () => {
      await assertRegister({email: "invalid", password: "password"}, 400, {
        success: false,
        message: "invalid_email"
      });
    });

    it('should fail if account already exists', async () => {
      const user = await userRepository.create("test@gmail.com", "password");
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

      const user = await userRepository.findByEmail("test@gmail.com");

      expect(user?.email).toBe("test@gmail.com");
      expect(await hashing.verify("password", user?.password!)).toBeTruthy();
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

  describe("login", () => {

    it('should fail if client id is not valid', async () => {
      await assertLogin(
        {
          username: "mail@gmail.com",
          password: "password",
          redirect_uri: "http://localhost:5173/callback",
          client_id: "not_exists",
        },
        400,
        {
          success: false,
          message: "invalid_client",
          token: ""
        });
    });

    it('should fail if redirect uri is invalid', async () => {
      await assertLogin(
        {
          username: "mail@gmail.com",
          password: "password",
          redirect_uri: "http://localhost:5173/invalid",
          client_id: client.id,
        },
        400,
        {
          success: false,
          message: "invalid_redirect_uri",
          token: ""
        });
    });

    it('should fail if user not exists', async () => {
      await assertLogin(
        {
          username: "mail@gmail.com",
          password: "password",
          redirect_uri: client.redirectUris[0],
          client_id: client.id,
        },
        401,
        {
          success: false,
          message: "invalid_credentials",
          token: ""
        }
      );
    });

    it('should fail if password not match', async () => {
      await userRepository.create("mail@gmail.com", await hashing.hash("psw"))
      await assertLogin(
        {
          username: "mail@gmail.com",
          password: "password",
          redirect_uri: client.redirectUris[0],
          client_id: client.id,
        },
        401,
        {
          success: false,
          message: "invalid_credentials",
          token: ""
        }
      );
    });

    it('should success and response code', async () => {
      const user = await userRepository.create("mail@gmail.com", await hashing.hash("password"))
      await assertLogin(
        {
          username: "mail@gmail.com",
          password: "password",
          redirect_uri: client.redirectUris[0],
          client_id: client.id,
        },
        200,
        {
          success: true,
          message: "ok",
          token: "cccccccccc"
        });

      expect(codeCache.getExpiresAt(client.id, user.id)).toBe(2001);
      expect(await codeCache.getToken(client.id, user.id)).toBe("cccccccccc");
    });

    async function assertLogin(request: AuthServerLoginRequest, code: number, response: AuthServerLoginResponse) {
      const res = await app.inject({
        method: 'POST',
        url: '/api/login',
        body: request
      });

      expect(res.statusCode).toBe(code);
      expect(res.json()).toEqual(response);
    }
  });


});