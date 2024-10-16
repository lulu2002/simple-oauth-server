import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyFormbody from '@fastify/formbody';
import fastifyStatic from '@fastify/static';
import AuthController from "@src/adapters/auth/auth-controller";
import OauthClientRepositoryInMemory from "@test-fixture/application/auth/oauth-client-repository-in-memory";
import path from 'node:path'
import * as process from "node:process";

const fastifyInstance = fastify();
fastifyInstance.register(fastifyFormbody);
fastifyInstance.register(fastifyCookie);
fastifyInstance.register(fastifyCors, {origin: true});
fastifyInstance.register(fastifyStatic, {
  root: path.join(__dirname, '../../frontend/dist'),
  prefix: '/'
});

const repo = new OauthClientRepositoryInMemory();
const controller = new AuthController(repo);

controller.registerRoutes(fastifyInstance);

repo.add({
  allowOrigins: [], id: "test_client", name: "test client", redirectUris: ["http://localhost:5173"], secret: ""
})

fastifyInstance.route({
  method: 'GET',
  url: '/app/*',
  exposeHeadRoute: false,
  handler: (request, reply) => {
    reply.sendFile('index.html')
  }
})

fastifyInstance.listen({port: 8080}, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})

// // 模拟的数据库
// interface User {
//   id: number;
//   username: string;
//   password: string;
//   accessToken: string;
// }
//
// const users: Record<string, User> = {
//   user1: {id: 1, username: 'user1', password: 'password', accessToken: 'abc123'}
// };
//
// // 授权端点
// app.get<{
//   Querystring: { client_id: string, redirect_uri: string, response_type: string, scope: string }
// }>('/authorize', (request, reply) => {
//   const {client_id, redirect_uri, response_type, scope} = request.query;
//
//   if (response_type !== 'code') {
//     return reply.code(400).send('Unsupported response type');
//   }
//
//   // 生成授权码并存储（简单模拟，实际上应该是随机的、临时的）
//   const authorizationCode = 'xyz123';
//
//   // 渲染登录表单，让用户输入凭据
//   reply.type('text/html').send(`
//     <h1>Login</h1>
//     <form action="/login" method="POST">
//       <input type="hidden" name="redirect_uri" value="${redirect_uri}">
//       <input type="hidden" name="authorizationCode" value="${authorizationCode}">
//       <input type="text" name="username" placeholder="Username">
//       <input type="password" name="password" placeholder="Password">
//       <button type="submit">Login</button>
//     </form>
//   `);
// });
//
// // 登录处理
// app.post<{
//   Body: { username: string, password: string, authorizationCode: string, redirect_uri: string }
// }>('/login', (request, reply) => {
//   const {username, password, authorizationCode, redirect_uri} = request.body;
//
//   // 检查凭据
//   const user = users[username];
//   if (!user || user.password !== password) {
//     return reply.code(401).send('Invalid credentials');
//   }
//
//   // 模拟生成授权码并重定向回客户端
//   reply.redirect(`${redirect_uri}?code=${authorizationCode}`);
// });
//
// // 令牌端点
// app.post<{
//   Body: { code: string, client_id: string, client_secret: string, redirect_uri: string, grant_type: string }
// }>('/token', (request, reply) => {
//   const {code, client_id, client_secret, redirect_uri, grant_type} = request.body;
//
//   if (grant_type !== 'authorization_code' || code !== 'xyz123') {
//     return reply.code(400).send('Invalid grant or authorization code');
//   }
//
//   // 生成访问令牌
//   const accessToken = 'abc123';
//
//   // 返回访问令牌
//   reply.send({
//     access_token: accessToken,
//     token_type: 'Bearer',
//     expires_in: 3600
//   });
// });
//
// app.listen({port: 8080}, (err, address) => {
//   if (err) {
//     console.error(err)
//     process.exit(1)
//   }
//   console.log(`Server listening at ${address}`)
// })