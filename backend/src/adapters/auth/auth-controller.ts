import {FastifyInstance, FastifyReply} from "fastify";
import OauthClientRepository from "@src/application/auth/oauth-client-repository";
import {AuthServerValidateResponse} from "@shared/auth-server-validate";
import {OauthExchangeRequest, OauthExchangeResponse} from "@shared/oauth-exchange";
import AuthCodeCache from "@src/application/auth/auth-code-cache";
import UserRepository from "@src/application/user/user-repository";
import PasswordHashing from "@src/application/hashing/password-hashing";

export default class AuthController {

  constructor(
    private clientRepo: OauthClientRepository,
    private codeCache: AuthCodeCache,
    private hashing: PasswordHashing,
    private userRepository: UserRepository
  ) {
  }

  registerRoutes(app: FastifyInstance) {
    app.get<{
      Querystring: { client_id: string, redirect_uri: string },
      Headers: { host: string }
    }>('/api/authorize', async (request, reply) => {
      const {client_id, redirect_uri} = request.query;
      const client = await this.clientRepo.findById(client_id) ?? null;

      if (!client)
        return this.replyValidateResponse(reply, {code: 400, valid: false, message: 'client with id not found'});

      if (!client.redirectUris.includes(redirect_uri))
        return this.replyValidateResponse(reply, {code: 400, valid: false, message: 'redirect_uri is not valid'});

      this.replyValidateResponse(reply, {code: 200, valid: true, message: 'ok'});
    });

    app.post<{
      Body: OauthExchangeRequest,
    }>('/api/token', async (request, reply) => {

      const {client_id, client_secret, code, redirect_uri} = request.body;
      const entry = await this.codeCache.getAuthEntry(request.body.code) ?? null;

      if (!entry)
        return this.replyTokenInvalidCredentials(reply);

      if (entry.clientId !== client_id)
        return this.replyTokenInvalidCredentials(reply);

      const client = await this.clientRepo.findById(client_id) ?? null;

      if (!client)
        return this.replyTokenInvalidCredentials(reply);

      if (!await this.hashing.verify(client_secret, client.secret))
        return this.replyTokenInvalidCredentials(reply);

      if (!client.redirectUris.includes(redirect_uri))
        return this.replyTokenResponse(reply, 400, {success: false, message: 'invalid_redirect_uri'});

      const user = await this.userRepository.findById(entry.userId) ?? null;

      if (!user)
        return this.replyTokenInvalidCredentials(reply);

      const payload = app.jwt.sign({email: user.email}, {expiresIn: '1h'});
      this.replyTokenResponse(reply, 200, {success: true, token: payload});
    });

  }

  private replyTokenInvalidCredentials(reply: FastifyReply) {
    return this.replyTokenResponse(reply, 401, {success: false, message: 'invalid_credentials'});
  }

  private replyTokenResponse(reply: FastifyReply, code: number, response: OauthExchangeResponse) {
    reply.code(code).send(response);
  }

  private replyValidateResponse(reply: FastifyReply, response: AuthServerValidateResponse) {
    reply.code(response.code).send(response);
  }


}