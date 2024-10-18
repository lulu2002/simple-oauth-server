"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OauthClientRepositoryInMemory {
    clients = [];
    async findById(id) {
        return this.clients.find(client => client.id === id);
    }
    create(client) {
        this.clients.push(client);
        return Promise.resolve(client);
    }
    add(client) {
        this.clients.push(client);
    }
}
exports.default = OauthClientRepositoryInMemory;
