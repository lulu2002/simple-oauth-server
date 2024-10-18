"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const register_user_1 = require("@src/application/user/register-user");
class UserController {
    registerUser;
    loginUser;
    constructor(registerUser, loginUser) {
        this.registerUser = registerUser;
        this.loginUser = loginUser;
    }
    registerRoutes(app) {
        app.post('/api/register', async (request, reply) => {
            const { email, password } = request.body;
            try {
                const user = await this.registerUser.execute(email, password);
                reply.send({ success: true, message: 'ok' });
            }
            catch (e) {
                if (e instanceof register_user_1.RegisterUserError)
                    return reply.code(400).send({ success: false, message: e.message });
                else
                    throw e;
            }
        });
        app.post('/api/login', async (request, reply) => {
            const result = await this.loginUser.login(request.body);
            switch (result.type) {
                case "invalid_client":
                    return this.replyLoginResponse(reply, 400, { success: false, message: 'invalid_client', token: '' });
                case "invalid_redirect_uri":
                    return this.replyLoginResponse(reply, 400, { success: false, message: 'invalid_redirect_uri', token: '' });
                case "invalid_credentials":
                    return this.replyLoginResponse(reply, 401, { success: false, message: 'invalid_credentials', token: '' });
                case "ok":
                    return this.replyLoginResponse(reply, 200, { success: true, message: 'ok', token: result.token });
                default:
                    throw new Error('Invalid login result');
            }
        });
    }
    replyLoginResponse(reply, code, response) {
        reply.code(code).send(response);
    }
}
exports.default = UserController;
