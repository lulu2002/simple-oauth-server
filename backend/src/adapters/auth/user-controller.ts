import {FastifyInstance, FastifyReply} from "fastify";
import {AuthServerRegisterRequest} from "@shared/auth-server-register";
import {AuthServerLoginRequest, AuthServerLoginResponse} from "@shared/auth-server-login";
import RegisterUser, {RegisterUserError} from "@src/application/user/register-user";
import LoginUser from "@src/application/user/login-user";

export default class UserController {

  constructor(
    private registerUser: RegisterUser,
    private loginUser: LoginUser
  ) {
  }

  registerRoutes(app: FastifyInstance) {
    app.post<{
      Body: AuthServerRegisterRequest
    }>('/api/register', async (request, reply) => {
      const {email, password} = request.body;
      try {
        const user = await this.registerUser.execute(email, password);
        reply.send({success: true, message: 'ok'});
      } catch (e) {
        if (e instanceof RegisterUserError)
          return reply.code(400).send({success: false, message: e.message});
        else
          throw e;
      }
    });

    app.post<{
      Body: AuthServerLoginRequest
    }>('/api/login', async (request, reply) => {
      const result = await this.loginUser.login(request.body);

      switch (result.type) {
        case "invalid_client":
          return this.replyLoginResponse(reply, 400, {success: false, message: 'invalid_client', token: ''});
        case "invalid_redirect_uri":
          return this.replyLoginResponse(reply, 400, {success: false, message: 'invalid_redirect_uri', token: ''});
        case "invalid_credentials":
          return this.replyLoginResponse(reply, 401, {success: false, message: 'invalid_credentials', token: ''});
        case "ok":
          return this.replyLoginResponse(reply, 200, {success: true, message: 'ok', token: result.token});
        default:
          throw new Error('Invalid login result');
      }
    });
  }

  private replyLoginResponse(reply: FastifyReply, code: number, response: AuthServerLoginResponse) {
    reply.code(code).send(response);
  }

  // async login(request, reply) {
  //   const {username, password, authorizationCode, redirect_uri} = request.body;
  //
  //   if (!this.userService.validateUser(username, password)) {
  //     return reply.code(401).send('Invalid credentials');
  //   }
  //
  //   reply.redirect(`${redirect_uri}?code=${authorizationCode}`);
  // }
  //
  // // 生成 token 的逻辑
  // async token(request, reply) {
  //   const {code, client_id, client_secret, redirect_uri, grant_type} = request.body;
  //
  //   if (grant_type !== 'authorization_code' || code !== 'xyz123') {
  //     return reply.code(400).send('Invalid grant or authorization code');
  //   }
  //
  //   const accessToken = this.userService.generateAccessToken('user1'); // 简单模拟
  //   reply.send({
  //     access_token: accessToken,
  //     token_type: 'Bearer',
  //     expires_in: 3600,
  //   });
  // }
}