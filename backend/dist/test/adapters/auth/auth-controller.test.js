"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const oauth_client_repository_in_memory_1 = __importDefault(require("@test-fixture/application/auth/oauth-client-repository-in-memory"));
const auth_controller_1 = __importDefault(require("@src/adapters/auth/auth-controller"));
const auth_code_cache_in_memory_1 = __importDefault(require("@test-fixture/application/auth/auth-code-cache-in-memory"));
const current_time_stamp_mock_1 = __importDefault(require("@test-fixture/application/util/current-time-stamp-mock"));
const user_repository_in_memory_1 = __importDefault(require("@test-fixture/application/user/user-repository-in-memory"));
const password_hashing_impl_1 = __importDefault(require("@src/adapters/hashing/password-hashing-impl"));
describe('AuthController', () => {
    let app;
    let clientRepository;
    let codeCache;
    let currentTimeStamp;
    let userRepository;
    let client;
    let hashing;
    beforeEach(async () => {
        app = (0, fastify_1.default)();
        app.register(jwt_1.default, { secret: "secret" });
        hashing = new password_hashing_impl_1.default(10);
        currentTimeStamp = new current_time_stamp_mock_1.default(0);
        codeCache = new auth_code_cache_in_memory_1.default(currentTimeStamp);
        clientRepository = new oauth_client_repository_in_memory_1.default();
        userRepository = new user_repository_in_memory_1.default();
        new auth_controller_1.default(clientRepository, codeCache, hashing, userRepository).registerRoutes(app);
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
        };
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
            clientRepository.add(client);
            await assertAuthorize(client.id, 'http://unkonwn/callback', 400, {
                code: 400,
                valid: false,
                message: 'redirect_uri is not valid'
            });
        });
        it('should success if client is valid', async () => {
            clientRepository.add(client);
            await assertAuthorize(client.id, 'http://localhost:5173/callback', 200, { code: 200, valid: true, message: 'ok' });
        });
        async function assertAuthorize(clientId, redirectUri, code, response) {
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
            await assertExchange(withValidRequest(), 401, { success: false, message: 'invalid_credentials' });
        });
        it('should fail if client id mismatch', async () => {
            await codeCache.saveCode(client.id, "user_id", "valid_code", 1000);
            await assertExchange(withValidRequest({ client_id: 'idk' }), 401, { success: false, message: 'invalid_credentials' });
        });
        it('should fail if client secret mismatch', async () => {
            await codeCache.saveCode(client.id, "user_id", "valid_code", 1000);
            clientRepository.add(client);
            await assertExchange(withValidRequest({ client_secret: 'idk' }), 401, {
                success: false,
                message: 'invalid_credentials'
            });
        });
        it('should fail if client redirect url invalid', async () => {
            await codeCache.saveCode(client.id, "user_id", "valid_code", 1000);
            clientRepository.add(client);
            await assertExchange(withValidRequest({ redirect_uri: 'http://unknown' }), 400, {
                success: false,
                message: 'invalid_redirect_uri'
            });
        });
        it('should fail if user not found', async () => {
            await codeCache.saveCode(client.id, "user_id", "valid_code", 1000);
            clientRepository.add(client);
            await assertExchange(withValidRequest(), 401, { success: false, message: 'invalid_credentials' });
        });
        it('should generate basic id token and response', async () => {
            const user = await userRepository.create("mail@gmail.com", "psw");
            await codeCache.saveCode(client.id, user.id, "valid_code", 1000);
            clientRepository.add(client);
            const res = await executeExchange(withValidRequest());
            if (!res.success)
                throw new Error('should success');
            expect(app.jwt.decode(res.token)).toHaveProperty('email', user.email);
        });
        function withValidRequest(apply = {}) {
            return {
                code: 'valid_code',
                client_id: client.id,
                client_secret: "my_secret",
                redirect_uri: client.redirectUris[0],
                ...apply
            };
        }
        async function assertExchange(req, code, response) {
            const res = await app.inject({
                method: 'post',
                url: '/api/token',
                body: req
            });
            expect(res.statusCode).toBe(code);
            expect(res.json()).toEqual(response);
        }
        async function executeExchange(req) {
            const res = await app.inject({
                method: 'post',
                url: '/api/token',
                body: req
            });
            return res.json();
        }
    });
});
