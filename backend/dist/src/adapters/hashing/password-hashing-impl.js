"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
class PasswordHashingImpl {
    saltRounds;
    constructor(saltRounds) {
        this.saltRounds = saltRounds;
    }
    hash(password) {
        return bcrypt_1.default.hash(password, this.saltRounds);
    }
    verify(password, hashedPassword) {
        return bcrypt_1.default.compare(password, hashedPassword);
    }
}
exports.default = PasswordHashingImpl;
