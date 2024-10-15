import axios from "axios";
import QueryParams from "../../application/QueryParams.ts";
import AuthClientCheckResult from "./AuthClientCheckResult.ts";

export default class LoginPageViewModel {

  constructor(private queryParams: QueryParams) {
  }

  async checkClientValidAuthRequest(): Promise<AuthClientCheckResult> {
    const clientId = this.queryParams.get('client_id');
    const redirectUri = this.queryParams.get('redirect_uri');

    if (!clientId)
      return {reason: 'client_id is not present', success: false};

    if (!redirectUri)
      return {reason: 'redirect_uri is not present', success: false};

    try {
      const response = await axios.get('/api/authorize', {
        params: {
          client_id: clientId,
          redirect_uri: redirectUri
        }
      });
      return {reason: response.data.message, success: response.data.valid};
    } catch (error) {
      console.error('Failed to check client id:', error);
      return {reason: 'invalid client_id', success: false};
    }
  }

  async handleLogin(username: string, password: string) {
    alert("YOYO " + username + " " + password);
  }
}