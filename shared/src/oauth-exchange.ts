export interface OauthExchangeRequest {
  code: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}

export type OauthExchangeResponse =
  { success: true; token: string; } |
  { success: false; message: 'invalid_credentials' | 'invalid_redirect_uri' | 'server_error' };