import {FastifyInstance, FastifyReply} from "fastify";
import {AuthServerValidateResponse} from "@shared/auth-server-validate";
import {AuthServerRegisterRequest} from "@shared/auth-server-register";
import OauthClientRepository from "@src/application/auth/oauth-client-repository";
import RegisterUser, {RegisterUserError} from "@src/application/user/register-user";

export default class AuthController {

  constructor(
    private clientRepo: OauthClientRepository,
    private registerUser: RegisterUser
  ) {
  }

  registerRoutes(app: FastifyInstance) {
    app.get<{
      Querystring: { client_id: string, redirect_uri: string },
      Headers: { host: string }
    }>('/api/authorize', (request, reply) => {
      const {client_id, redirect_uri} = request.query;
      const client = this.clientRepo.findById(client_id) ?? null;

      if (!client)
        return this.replyValidateResponse(reply, {code: 400, valid: false, message: 'client with id not found'});

      if (!client.redirectUris.includes(redirect_uri))
        return this.replyValidateResponse(reply, {code: 400, valid: false, message: 'redirect_uri is not valid'});

      this.replyValidateResponse(reply, {code: 200, valid: true, message: 'ok'});
    });

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


    // app.post<{
    //   Body: { username: string, password: string, authorizationCode: string, redirect_uri: string }
    // }>('/login', (request, reply) => {
    //   const {username, password, authorizationCode, redirect_uri} = request.body;
    //
    //   const user = users[username];
    //   if (!user || user.password !== password) {
    //     return reply.code(401).send('Invalid credentials');
    //   }
    //
    //   reply.redirect(`${redirect_uri}?code=${authorizationCode}`);
    // });
  }

  private replyValidateResponse(reply: FastifyReply, response: AuthServerValidateResponse) {
    reply.code(response.code).send(response);
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