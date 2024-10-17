import {FastifyInstance, FastifyReply} from "fastify";
import OauthClientRepository from "@src/application/auth/oauth-client-repository";
import {AuthServerValidateResponse} from "@shared/auth-server-validate";

export default class AuthController {

  constructor(
    private clientRepo: OauthClientRepository,
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

  }

  private replyValidateResponse(reply: FastifyReply, response: AuthServerValidateResponse) {
    reply.code(response.code).send(response);
  }


}