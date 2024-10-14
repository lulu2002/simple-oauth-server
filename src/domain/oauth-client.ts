export default interface OauthClient {
  id: string;
  name: string;
  redirectUris: string[];
  allowOrigins: string[];
  secret: string;
}