"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fastify_formbody_deprecated_1 = __importDefault(require("fastify-formbody-deprecated"));
const fastify_cookie_deprecated_1 = __importDefault(require("fastify-cookie-deprecated"));
const fastify_cors_deprecated_1 = __importDefault(require("fastify-cors-deprecated"));
const app = (0, fastify_1.default)();
app.register(fastify_formbody_deprecated_1.default);
app.register(fastify_cookie_deprecated_1.default);
app.register(fastify_cors_deprecated_1.default, { origin: true });
const users = {
    user1: { id: 1, username: 'user1', password: 'password', accessToken: 'abc123' }
};
// 授权端点
app.get('/authorize', (request, reply) => {
    const { client_id, redirect_uri, response_type, scope } = request.query;
    if (response_type !== 'code') {
        return reply.code(400).send('Unsupported response type');
    }
    // 生成授权码并存储（简单模拟，实际上应该是随机的、临时的）
    const authorizationCode = 'xyz123';
    // 渲染登录表单，让用户输入凭据
    reply.type('text/html').send(`
    <h1>Login</h1>
    <form action="/login" method="POST">
      <input type="hidden" name="redirect_uri" value="${redirect_uri}">
      <input type="hidden" name="authorizationCode" value="${authorizationCode}">
      <input type="text" name="username" placeholder="Username">
      <input type="password" name="password" placeholder="Password">
      <button type="submit">Login</button>
    </form>
  `);
});
// 登录处理
app.post('/login', (request, reply) => {
    const { username, password, authorizationCode, redirect_uri } = request.body;
    // 检查凭据
    const user = users[username];
    if (!user || user.password !== password) {
        return reply.code(401).send('Invalid credentials');
    }
    // 模拟生成授权码并重定向回客户端
    reply.redirect(`${redirect_uri}?code=${authorizationCode}`);
});
// 令牌端点
app.post('/token', (request, reply) => {
    const { code, client_id, client_secret, redirect_uri, grant_type } = request.body;
    if (grant_type !== 'authorization_code' || code !== 'xyz123') {
        return reply.code(400).send('Invalid grant or authorization code');
    }
    // 生成访问令牌
    const accessToken = 'abc123';
    // 返回访问令牌
    reply.send({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600
    });
});
// 启动服务器
const start = async () => {
    try {
        await app.listen({ port: 3000 });
        console.log('OAuth server running at http://localhost:3000');
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
