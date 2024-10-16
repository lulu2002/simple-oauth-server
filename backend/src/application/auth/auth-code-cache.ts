export default interface AuthCodeCache {
  saveToken(clientId: string, userId: string, token: string, expiresAt: number): Promise<void>;

  getToken(clientId: string, userId: string): Promise<string | null>;

  removeToken(clientId: string, userId: string): Promise<void>;
}

