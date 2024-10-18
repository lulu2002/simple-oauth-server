"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const user_controller_1 = __importDefault(require("@src/adapters/auth/user-controller"));
const oauth_client_repository_in_memory_1 = __importDefault(require("@test-fixture/application/auth/oauth-client-repository-in-memory"));
const user_repository_in_memory_1 = __importDefault(require("@test-fixture/application/user/user-repository-in-memory"));
const register_user_1 = __importDefault(require("@src/application/user/register-user"));
const random_code_generator_fixed_1 = __importDefault(require("@test-fixture/application/util/random-code-generator-fixed"));
const auth_code_cache_in_memory_1 = __importDefault(require("@test-fixture/application/auth/auth-code-cache-in-memory"));
const current_time_stamp_mock_1 = __importDefault(require("@test-fixture/application/util/current-time-stamp-mock"));
const login_user_1 = __importDefault(require("@src/application/user/login-user"));
const password_hashing_impl_1 = __importDefault(require("@src/adapters/hashing/password-hashing-impl"));
describe('UserController', () => {
    let app;
    let clientRepository;
    let userRepository;
    let hashing;
    let codeGenerator;
    let codeCache;
    let client;
    beforeEach(() => {
        app = (0, fastify_1.default)();
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
        };
        const currentTime = new current_time_stamp_mock_1.default(1000);
        clientRepository = new oauth_client_repository_in_memory_1.default();
        userRepository = new user_repository_in_memory_1.default();
        hashing = new password_hashing_impl_1.default(10);
        codeGenerator = new random_code_generator_fixed_1.default("c");
        codeCache = new auth_code_cache_in_memory_1.default(currentTime);
        new user_controller_1.default(new register_user_1.default(userRepository, hashing), new login_user_1.default(clientRepository, userRepository, hashing, codeGenerator, codeCache, currentTime, 1001)).registerRoutes(app);
        clientRepository.add(client);
    });
    afterEach(() => {
        app.close();
    });
    describe("register", () => {
        it('should fail if email is invalid', async () => {
            await assertRegister({ email: "invalid", password: "password" }, 400, {
                success: false,
                message: "invalid_email"
            });
        });
        it('should fail if account already exists', async () => {
            const user = await userRepository.create("test@gmail.com", "password");
            await assertRegister({ email: user.email, password: "another" }, 400, {
                success: false,
                message: "account_already_exists"
            });
        });
        it('should create', async () => {
            await assertRegister({ email: "test@gmail.com", password: "password" }, 200, {
                success: true,
                message: "ok"
            });
            const user = await userRepository.findByEmail("test@gmail.com");
            expect(user?.email).toBe("test@gmail.com");
            expect(await hashing.verify("password", user?.password)).toBeTruthy();
        });
        async function assertRegister(request, code, response) {
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
            await assertLogin({
                username: "mail@gmail.com",
                password: "password",
                redirect_uri: "http://localhost:5173/callback",
                client_id: "not_exists",
            }, 400, {
                success: false,
                message: "invalid_client",
                token: ""
            });
        });
        it('should fail if redirect uri is invalid', async () => {
            await assertLogin({
                username: "mail@gmail.com",
                password: "password",
                redirect_uri: "http://localhost:5173/invalid",
                client_id: client.id,
            }, 400, {
                success: false,
                message: "invalid_redirect_uri",
                token: ""
            });
        });
        it('should fail if user not exists', async () => {
            await assertLogin({
                username: "mail@gmail.com",
                password: "password",
                redirect_uri: client.redirectUris[0],
                client_id: client.id,
            }, 401, {
                success: false,
                message: "invalid_credentials",
                token: ""
            });
        });
        it('should fail if password not match', async () => {
            await userRepository.create("mail@gmail.com", await hashing.hash("psw"));
            await assertLogin({
                username: "mail@gmail.com",
                password: "password",
                redirect_uri: client.redirectUris[0],
                client_id: client.id,
            }, 401, {
                success: false,
                message: "invalid_credentials",
                token: ""
            });
        });
        it('should success and response code', async () => {
            const user = await userRepository.create("mail@gmail.com", await hashing.hash("password"));
            await assertLogin({
                username: "mail@gmail.com",
                password: "password",
                redirect_uri: client.redirectUris[0],
                client_id: client.id,
            }, 200, {
                success: true,
                message: "ok",
                token: "cccccccccc"
            });
            expect(codeCache.getExpiresAt(client.id, user.id)).toBe(2001);
            expect(await codeCache.getCode(client.id, user.id)).toBe("cccccccccc");
        });
        async function assertLogin(request, code, response) {
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
