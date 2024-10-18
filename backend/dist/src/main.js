"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("tsconfig-paths/register");
const fastify_1 = __importDefault(require("fastify"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const cors_1 = __importDefault(require("@fastify/cors"));
const formbody_1 = __importDefault(require("@fastify/formbody"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const user_controller_1 = __importDefault(require("@src/adapters/auth/user-controller"));
const node_process_1 = __importDefault(require("node:process"));
const register_user_1 = __importDefault(require("@src/application/user/register-user"));
const login_user_1 = __importDefault(require("@src/application/user/login-user"));
const random_code_generator_impl_1 = __importDefault(require("@src/application/util/random-code-generator-impl"));
const auth_code_cache_in_memory_1 = __importDefault(require("@test-fixture/application/auth/auth-code-cache-in-memory"));
const current_time_stamp_impl_1 = __importDefault(require("@src/application/util/current-time-stamp-impl"));
const auth_controller_1 = __importDefault(require("@src/adapters/auth/auth-controller"));
const typeorm_1 = require("typeorm");
const user_entity_1 = require("@src/adapters/user/user-entity");
const user_repository_type_orm_1 = require("@src/adapters/user/user-repository-type-orm");
const auth_code_cache_type_orm_1 = require("@src/adapters/auth/auth-code-cache-type-orm");
const password_hashing_impl_1 = __importDefault(require("@src/adapters/hashing/password-hashing-impl"));
const oauth_client_repository_type_orm_1 = __importStar(require("@src/adapters/auth/oauth-client-repository-type-orm"));
async function main() {
    const fastifyInstance = (0, fastify_1.default)();
    fastifyInstance.register(formbody_1.default);
    fastifyInstance.register(cookie_1.default);
    fastifyInstance.register(cors_1.default, { origin: true });
    fastifyInstance.register(jwt_1.default, { secret: getEnv().JWT_SECRET });
    const dataSource = new typeorm_1.DataSource({
        type: 'sqlite',
        database: '../database.sqlite',
        entities: [user_entity_1.UserEntity, auth_code_cache_type_orm_1.AuthEntryEntity, oauth_client_repository_type_orm_1.OauthClientEntity],
        synchronize: true,
        logging: true,
    });
    await dataSource.initialize();
    const authRepo = new oauth_client_repository_type_orm_1.default(dataSource);
    const userRepo = new user_repository_type_orm_1.UserRepositoryTypeOrm(dataSource);
    const currentTimestamp = new current_time_stamp_impl_1.default();
    const codeCache = new auth_code_cache_in_memory_1.default(currentTimestamp);
    const passwordHashing = new password_hashing_impl_1.default(10);
    const codeGenerator = new random_code_generator_impl_1.default();
    const registerUser = new register_user_1.default(userRepo, passwordHashing);
    const loginUser = new login_user_1.default(authRepo, userRepo, passwordHashing, codeGenerator, codeCache, currentTimestamp, 1000 * 60 * 5);
    const userController = new user_controller_1.default(registerUser, loginUser);
    const authController = new auth_controller_1.default(authRepo, codeCache, passwordHashing, userRepo);
    userController.registerRoutes(fastifyInstance);
    authController.registerRoutes(fastifyInstance);
    await authRepo.create({
        id: getEnv().PREDEFINE_CLIENT_ID,
        name: getEnv().PREDEFINE_CLIENT_NAME,
        redirectUris: [getEnv().PREDEFINE_CLIENT_REDIRECT_URI],
        secret: await passwordHashing.hash(getEnv().PREDEFINE_CLIENT_SECRET),
        allowOrigins: [],
    });
    fastifyInstance.listen({ port: Number(getEnv().PORT) }, (err, address) => {
        if (err) {
            console.error(err);
            node_process_1.default.exit(1);
        }
        console.log(`Server listening at ${address}`);
    });
}
function getEnv() {
    return node_process_1.default.env;
}
main();
