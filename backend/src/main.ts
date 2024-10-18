import 'reflect-metadata';
import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyFormbody from '@fastify/formbody';
import fastifyJwt from "@fastify/jwt";
import UserController from "@src/adapters/auth/user-controller";
import process from "node:process";
import RegisterUser from "@src/application/user/register-user";
import LoginUser from "@src/application/user/login-user";
import RandomCodeGeneratorImpl from "@src/application/util/random-code-generator-impl";
import AuthCodeCacheInMemory from "@test-fixture/application/auth/auth-code-cache-in-memory";
import CurrentTimeStampImpl from "@src/application/util/current-time-stamp-impl";
import AuthController from "@src/adapters/auth/auth-controller";
import {DataSource} from "typeorm";
import {UserEntity} from "@src/adapters/user/user-entity";
import {UserRepositoryTypeOrm} from "@src/adapters/user/user-repository-type-orm";
import {AuthEntryEntity} from "@src/adapters/auth/auth-code-cache-type-orm";
import PasswordHashingImpl from "@src/adapters/hashing/password-hashing-impl";
import OauthClientRepositoryTypeOrm, {OauthClientEntity} from "@src/adapters/auth/oauth-client-repository-type-orm";
import dotenv from 'dotenv';

async function main() {
  dotenv.config({path: '../.env'});

  const fastifyInstance = fastify();
  fastifyInstance.register(fastifyFormbody);
  fastifyInstance.register(fastifyCookie);
  fastifyInstance.register(fastifyCors, {origin: true});
  fastifyInstance.register(fastifyJwt, {secret: process.env.JWT_SECRET!});

  const dataSource = new DataSource({
    type: 'sqlite',
    database: '../database.sqlite',
    entities: [UserEntity, AuthEntryEntity, OauthClientEntity],
    synchronize: true,
    logging: true,
  });

  await dataSource.initialize()

  const authRepo = new OauthClientRepositoryTypeOrm(dataSource);
  const userRepo = new UserRepositoryTypeOrm(dataSource);
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
  const authController = new AuthController(authRepo, codeCache, passwordHashing, userRepo);

  userController.registerRoutes(fastifyInstance);
  authController.registerRoutes(fastifyInstance);

  await authRepo.create({
    allowOrigins: [],
    id: "test_client",
    name: "test client",
    redirectUris: ["http://localhost:5173/callback"],
    secret: await passwordHashing.hash("test_secret")
  });

  fastifyInstance.listen({port: 8080}, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })
}

main();