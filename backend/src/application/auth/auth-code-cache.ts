export default interface AuthCodeCache {
  saveCode(clientId: string, userId: string, code: string, expiresAt: number): Promise<void>;

  getAuthEntry(code: string): Promise<AuthEntry | null>;

  getCode(clientId: string, userId: string): Promise<string | null>;

  removeCode(clientId: string, userId: string): Promise<void>;
}


export interface AuthEntry {
  userId: string;
  clientId: string;
  code: string;
  expiresAt: number;
}
