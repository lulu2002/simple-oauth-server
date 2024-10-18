"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthController {
    clientRepo;
    codeCache;
    hashing;
    userRepository;
    constructor(clientRepo, codeCache, hashing, userRepository) {
        this.clientRepo = clientRepo;
        this.codeCache = codeCache;
        this.hashing = hashing;
        this.userRepository = userRepository;
    }
    registerRoutes(app) {
        app.get('/api/authorize', async (request, reply) => {
            const { client_id, redirect_uri } = request.query;
            const client = await this.clientRepo.findById(client_id) ?? null;
            if (!client)
                return this.replyValidateResponse(reply, { code: 400, valid: false, message: 'client with id not found' });
            if (!client.redirectUris.includes(redirect_uri))
                return this.replyValidateResponse(reply, { code: 400, valid: false, message: 'redirect_uri is not valid' });
            this.replyValidateResponse(reply, { code: 200, valid: true, message: 'ok' });
        });
        app.post('/api/token', async (request, reply) => {
            const { client_id, client_secret, code, redirect_uri } = request.body;
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
                return this.replyTokenResponse(reply, 400, { success: false, message: 'invalid_redirect_uri' });
            const user = await this.userRepository.findById(entry.userId) ?? null;
            if (!user)
                return this.replyTokenInvalidCredentials(reply);
            const payload = app.jwt.sign({ email: user.email }, { expiresIn: '1h' });
            this.replyTokenResponse(reply, 200, { success: true, token: payload });
        });
    }
    replyTokenInvalidCredentials(reply) {
        return this.replyTokenResponse(reply, 401, { success: false, message: 'invalid_credentials' });
    }
    replyTokenResponse(reply, code, response) {
        reply.code(code).send(response);
    }
    replyValidateResponse(reply, response) {
        reply.code(response.code).send(response);
    }
}
exports.default = AuthController;
