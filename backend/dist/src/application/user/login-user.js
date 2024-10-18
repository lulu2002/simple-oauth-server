"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoginUser {
    clientRepo;
    userRepo;
    hashing;
    codeGenerator;
    codeCache;
    currentTimeStamp;
    expiresIn;
    constructor(clientRepo, userRepo, hashing, codeGenerator, codeCache, currentTimeStamp, expiresIn) {
        this.clientRepo = clientRepo;
        this.userRepo = userRepo;
        this.hashing = hashing;
        this.codeGenerator = codeGenerator;
        this.codeCache = codeCache;
        this.currentTimeStamp = currentTimeStamp;
        this.expiresIn = expiresIn;
    }
    async login(request) {
        const { client_id, redirect_uri, password, username } = request;
        const client = await this.clientRepo.findById(client_id) ?? null;
        if (!client)
            return { type: 'invalid_client' };
        if (!client.redirectUris.includes(redirect_uri))
            return { type: 'invalid_redirect_uri' };
        const user = await this.userRepo.findByEmail(username) ?? null;
        if (!user || !await this.hashing.verify(password, user.password))
            return { type: 'invalid_credentials' };
        const code = this.codeGenerator.generate(10);
        await this.codeCache.saveCode(client.id, user.id, code, this.currentTimeStamp.get() + this.expiresIn);
        return { type: 'ok', token: code };
    }
}
exports.default = LoginUser;
