"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PasswordHashingNoHashing {
    hash(password) {
        return Promise.resolve(password);
    }
    verify(password, hashedPassword) {
        return Promise.resolve(password === hashedPassword);
    }
}
exports.default = PasswordHashingNoHashing;
