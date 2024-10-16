export interface AuthLoginResult {
  success: boolean;
  message: string;
  code: string;
}

export interface AuthLoginContext {
  username: string;
  password: string;
  clientId: string;
  redirectUri: string;
}