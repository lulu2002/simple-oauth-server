"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthCodeCacheInMemory {
    currentTimeStamp;
    cache = new Map();
    constructor(currentTimeStamp) {
        this.currentTimeStamp = currentTimeStamp;
    }
    getAuthEntry(code) {
        for (const [clientId, userCache] of this.cache) {
            for (const [userId, { token, expiresAt }] of userCache) {
                if (token === code) {
                    return Promise.resolve({ clientId, userId, code: token, expiresAt });
                }
            }
        }
        return Promise.resolve(null);
    }
    saveCode(clientId, userId, token, expiresAt) {
        if (!this.cache.has(clientId)) {
            this.cache.set(clientId, new Map());
        }
        const userCache = this.cache.get(clientId);
        userCache?.set(userId, { token, expiresAt });
        return Promise.resolve();
    }
    getCode(clientId, userId) {
        const token = this.cache.get(clientId)?.get(userId)?.token ?? null;
        return Promise.resolve(token);
    }
    removeCode(clientId, userId) {
        const userCache = this.cache.get(clientId);
        if (userCache) {
            userCache.delete(userId);
            if (userCache.size === 0) {
                this.cache.delete(clientId);
            }
        }
        return Promise.resolve();
    }
    getExpiresAt(clientId, userId) {
        return this.cache.get(clientId)?.get(userId)?.expiresAt ?? null;
    }
    getAll() {
        return new Map(this.cache);
    }
}
exports.default = AuthCodeCacheInMemory;
