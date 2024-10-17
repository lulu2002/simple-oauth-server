import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyFormbody from '@fastify/formbody';
import UserController from "@src/adapters/auth/user-controller";
import OauthClientRepositoryInMemory from "@test-fixture/application/auth/oauth-client-repository-in-memory";
import * as process from "node:process";
import UserRepositoryInMemory from "@test-fixture/application/user/user-repository-in-memory";
import RegisterUser from "@src/application/user/register-user";
import PasswordHashingImpl from "@src/adapters/hashing/PasswordHashingImpl";
import LoginUser from "@src/application/user/login-user";
import RandomCodeGeneratorImpl from "@src/application/util/random-code-generator-impl";
import AuthCodeCacheInMemory from "@test-fixture/application/auth/auth-code-cache-in-memory";
import CurrentTimeStampImpl from "@src/application/util/current-time-stamp-impl";
import AuthController from "@src/adapters/auth/auth-controller";

const fastifyInstance = fastify();
fastifyInstance.register(fastifyFormbody);
fastifyInstance.register(fastifyCookie);
fastifyInstance.register(fastifyCors, {origin: true});

const authRepo = new OauthClientRepositoryInMemory();
const userRepo = new UserRepositoryInMemory();
const currentTimestamp = new CurrentTimeStampImpl();
const codeCache = new AuthCodeCacheInMemory(currentTimestamp);
const passwordHashing = new PasswordHashingImpl(10);
const codeGenerator = new RandomCodeGeneratorImpl();
const registerUser = new RegisterUser(userRepo, passwordHashing);
const loginUser = new LoginUser(
  authRepo,
  userRepo,
  passwordHashing,
  codeGenerator,
  codeCache,
  currentTimestamp,
  1000 * 60 * 5
)
const userController = new UserController(registerUser, loginUser);
const authController = new AuthController(authRepo);

userController.registerRoutes(fastifyInstance);
authController.registerRoutes(fastifyInstance);

authRepo.add({
  allowOrigins: [], id: "test_client", name: "test client", redirectUris: ["http://localhost:5173/callback"], secret: ""
})

fastifyInstance.listen({port: 8080}, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})