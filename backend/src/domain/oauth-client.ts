export default interface OauthClient {
  id: string;
  name: string;
  secret: string;
  redirectUris: string[];
  allowOrigins: string[];
}