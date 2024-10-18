"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserError = void 0;
class RegisterUser {
    userRepository;
    passwordHashing;
    constructor(userRepository, passwordHashing) {
        this.userRepository = userRepository;
        this.passwordHashing = passwordHashing;
    }
    async execute(email, password) {
        if (!this.isValidEmail(email))
            throw new RegisterUserError('invalid_email');
        const user = await this.userRepository.findByEmail(email);
        if (user)
            throw new RegisterUserError('account_already_exists');
        return this.userRepository.create(email, await this.passwordHashing.hash(password));
    }
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
exports.default = RegisterUser;
class RegisterUserError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RegisterUserError';
    }
}
exports.RegisterUserError = RegisterUserError;
