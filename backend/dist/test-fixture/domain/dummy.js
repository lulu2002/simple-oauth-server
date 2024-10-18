"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Dummy {
    static oauthClient(updates = {}) {
        const origi = {
            id: "id",
            name: "name",
            secret: "secret",
            allowOrigins: [],
            redirectUris: [],
        };
        return {
            ...origi,
            ...updates
        };
    }
}
exports.default = Dummy;
