"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const random_code_generator_impl_1 = __importDefault(require("@src/application/util/random-code-generator-impl"));
class UserRepositoryInMemory {
    users = [];
    async findById(id) {
        return this.users.find(user => user.id === id);
    }
    async findByEmail(email) {
        return this.users.find(user => user.email === email);
    }
    async create(email, password) {
        const user = {
            id: new random_code_generator_impl_1.default().generate(10),
            email: email,
            password: password
        };
        this.users.push(user);
        return user;
    }
}
exports.default = UserRepositoryInMemory;
