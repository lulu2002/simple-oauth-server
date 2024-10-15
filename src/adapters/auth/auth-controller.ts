import {FastifyInstance} from "fastify";
import OauthClientRepository from "../../application/auth/oauth-client-repository";

export default class AuthController {

  constructor(
    private repo: OauthClientRepository,
  ) {
  }

  registerRoutes(app: FastifyInstance) {
    app.get<{
      Querystring: { client_id: string, redirect_uri: string },
      Headers: { host: string }
    }>('/authorize', (request, reply) => {
      const {client_id, redirect_uri} = request.query;
      const client = this.repo.findById(client_id) ?? null;

      if (!client)
        return reply.code(400).send({error: 'invalid_client'});

      // if (!client.allowOrigins.includes(request.headers.host))
      //   return reply.code(400).send({error: 'invalid_origin'});

      if (!client.redirectUris.includes(redirect_uri))
        return reply.code(400).send({error: 'invalid_redirect_uri'});


      reply.code(200).sendFile('login.html');
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