import {AuthServerValidateResponse} from "@shared/auth-server-validate";
import fastify, {FastifyInstance} from "fastify";
import fastifyJwt from "@fastify/jwt";
import OauthClientRepositoryInMemory from "@test-fixture/application/auth/oauth-client-repository-in-memory";
import OauthClient from "@src/domain/oauth-client";
import AuthController from "@src/adapters/auth/auth-controller";
import {OauthExchangeRequest, OauthExchangeResponse} from "@shared/oauth-exchange";
import AuthCodeCacheInMemory from "@test-fixture/application/auth/auth-code-cache-in-memory";
import CurrentTimeStampMock from "@test-fixture/application/util/current-time-stamp-mock";
import UserRepositoryInMemory from "@test-fixture/application/user/user-repository-in-memory";
import PasswordHashingImpl from "@src/adapters/hashing/password-hashing-impl";

describe('AuthController', () => {

  let app: FastifyInstance;
  let clientRepository: OauthClientRepositoryInMemory;
  let codeCache: AuthCodeCacheInMemory;
  let currentTimeStamp: CurrentTimeStampMock
  let userRepository: UserRepositoryInMemory;
  let client: OauthClient;
  let hashing: PasswordHashingImpl;

  beforeEach(async () => {
    app = fastify();
    app.register(fastifyJwt, {secret: "secret"});
    hashing = new PasswordHashingImpl(10);
    currentTimeStamp = new CurrentTimeStampMock(0);
    codeCache = new AuthCodeCacheInMemory(currentTimeStamp);
    clientRepository = new OauthClientRepositoryInMemory();
    userRepository = new UserRepositoryInMemory();
    new AuthController(clientRepository, codeCache, hashing, userRepository).registerRoutes(app);

    client = {
      id: "my_client_id",
      name: "test client",
      secret: await hashing.hash("my_secret"),
      redirectUris: [
        "http://localhost:5173/callback"
      ],
      allowOrigins: [
        "http://localhost:5173"
      ],
    }
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

  describe('exchange token', () => {

    it('should fail if code is invalid', async () => {
      await assertExchange(withValidRequest(), 401, {success: false, message: 'invalid_credentials'});
    });

    it('should fail if client id mismatch', async () => {
      await codeCache.saveCode(client.id, "user_id", "valid_code", 1000);
      await assertExchange(withValidRequest({client_id: 'idk'}), 401, {success: false, message: 'invalid_credentials'});
    });

    it('should fail if client secret mismatch', async () => {
      await codeCache.saveCode(client.id, "user_id", "valid_code", 1000);
      clientRepository.add(client);

      await assertExchange(withValidRequest({client_secret: 'idk'}), 401, {
        success: false,
        message: 'invalid_credentials'
      });
    });

    it('should fail if client redirect url invalid', async () => {
      await codeCache.saveCode(client.id, "user_id", "valid_code", 1000);
      clientRepository.add(client);

      await assertExchange(withValidRequest({redirect_uri: 'http://unknown'}), 400, {
        success: false,
        message: 'invalid_redirect_uri'
      });
    });

    it('should fail if user not found', async () => {
      await codeCache.saveCode(client.id, "user_id", "valid_code", 1000);
      clientRepository.add(client);

      await assertExchange(withValidRequest(), 401, {success: false, message: 'invalid_credentials'});
    });

    it('should generate basic id token and response', async () => {
      const user = await userRepository.create("mail@gmail.com", "psw");
      await codeCache.saveCode(client.id, user.id, "valid_code", 1000);
      clientRepository.add(client);

      const res = await executeExchange(withValidRequest())

      if (!res.success)
        throw new Error('should success');

      expect(app.jwt.decode(res.token)).toHaveProperty('email', user.email);
    });

    function withValidRequest(apply: Partial<OauthExchangeRequest> = {}) {
      return {
        code: 'valid_code',
        client_id: client.id,
        client_secret: "my_secret",
        redirect_uri: client.redirectUris[0],
        ...apply
      }
    }


    async function assertExchange(req: OauthExchangeRequest, code: number, response: OauthExchangeResponse) {
      const res = await app.inject({
        method: 'post',
        url: '/api/token',
        body: req
      });

      expect(res.statusCode).toBe(code);
      expect(res.json()).toEqual(response);
    }

    async function executeExchange(req: OauthExchangeRequest): Promise<OauthExchangeResponse> {
      const res = await app.inject({
        method: 'post',
        url: '/api/token',
        body: req
      });

      return res.json() as OauthExchangeResponse;
    }
  });
});