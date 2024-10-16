import QueryParams from "@src/application/query/QueryParams";
import AuthCheckResult from "@src/domain/AuthCheckResult";
import {AuthProxy} from "@src/application/auth/AuthProxy";
import {AuthLoginResult} from "@src/domain/AuthLogin";

export default class LoginPageViewModel {

  constructor(
    private queryParams: QueryParams,
    private client: AuthProxy
  ) {
  }

  async checkClientValidAuthRequest(): Promise<AuthCheckResult> {
    const clientId = this.queryParams.get('client_id');
    const redirectUri = this.queryParams.get('redirect_uri');

    if (!clientId)
      return {reason: 'client_id is not present', success: false};

    if (!redirectUri)
      return {reason: 'redirect_uri is not present', success: false};

    return this.client.isAuthenticated(clientId, redirectUri);
  }

  async login(username: string, password: string): Promise<AuthLoginResult> {
    const clientId = this.queryParams.get('client_id');
    const redirectUri = this.queryParams.get('redirect_uri');

    if (!clientId)
      return {success: false, message: 'client_id is not present', code: '', redirectUri: ''};

    if (!redirectUri)
      return {success: false, message: 'redirect_uri is not present', code: '', redirectUri: ''};

    return this.client.login({username, password, clientId, redirectUri});
  }

  closeWithCode(code: string, redirectUri: string) {
    window.opener.postMessage({type: 'oauth-success', token: code}, redirectUri);
    window.close();
  }
}

