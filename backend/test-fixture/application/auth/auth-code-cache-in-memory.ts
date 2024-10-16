import AuthCodeCache from "@src/application/auth/auth-code-cache";
import CurrentTimeStamp from "@src/application/util/current-time-stamp";

export default class AuthCodeCacheInMemory implements AuthCodeCache {
  private cache: Map<string, Map<string, TokenCacheValue>> = new Map();

  constructor(private currentTimeStamp: CurrentTimeStamp) {
  }

  saveToken(clientId: string, userId: string, token: string, expiresAt: number): Promise<void> {
    if (!this.cache.has(clientId)) {
      this.cache.set(clientId, new Map());
    }
    const userCache = this.cache.get(clientId);
    userCache?.set(userId, {token, expiresAt});
    return Promise.resolve();
  }

  getToken(clientId: string, userId: string): Promise<string | null> {
    const token = this.cache.get(clientId)?.get(userId)?.token ?? null;
    return Promise.resolve(token);
  }

  removeToken(clientId: string, userId: string): Promise<void> {
    const userCache = this.cache.get(clientId);
    if (userCache) {
      userCache.delete(userId);
      if (userCache.size === 0) {
        this.cache.delete(clientId);
      }
    }
    return Promise.resolve();
  }

  getExpiresAt(clientId: string, userId: string): number | null {
    return this.cache.get(clientId)?.get(userId)?.expiresAt ?? null;
  }

  getAll(): Map<string, Map<string, TokenCacheValue>> {
    return new Map(this.cache);
  }
}

interface TokenCacheValue {
  token: string;
  expiresAt: number;
}