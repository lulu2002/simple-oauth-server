import LoginPageViewModel from "./LoginPageViewModel.tsx";
import {mock, MockProxy} from "jest-mock-extended";
import QueryParamsMock from "@src/application/query/QueryParamsMock.ts";
import AuthCheckResult from "@src/domain/AuthCheckResult.ts";
import {AuthProxy} from "@src/application/auth/AuthProxy.ts";
import {AuthLoginResult} from "@src/domain/AuthLogin.tsx";


describe('LoginPageViewModel', () => {

  let queryParams: QueryParamsMock;
  let viewModel: LoginPageViewModel;
  let authProxy: MockProxy<AuthProxy>;

  beforeEach(() => {
    queryParams = new QueryParamsMock();
    authProxy = mock<AuthProxy>();
    viewModel = new LoginPageViewModel(queryParams, authProxy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkClient', () => {

    it('should failed if client id is not present', async () => {
      await assertCheckFailed("client_id is not present");
      await assertCheckFailed("redirect_uri is not present", () => queryParams.set('client_id', 'id'));
    });

    it('should failed if client id is not valid', async () => {
      mockAuthCheckResult({success: false, reason: "client with id not found"})
      provideValidClient()

      await assertCheckFailed("client with id not found");
    });

    it('should success if all valid', async () => {
      mockAuthCheckResult({success: true, reason: "ok"})
      provideValidClient()

      await assertCheckResult(true, "ok");
    });

    async function assertCheckFailed(reason: string, block: () => void = () => {
    }) {
      await assertCheckResult(false, reason, block);
    }

    async function assertCheckResult(bool: boolean, message: string, block: () => void = () => {
    }) {
      block();
      const result: AuthCheckResult = {reason: message, success: bool}
      expect(await viewModel.checkClientValidAuthRequest()).toStrictEqual(result);
    }

    function mockAuthCheckResult(data: AuthCheckResult) {
      authProxy.isAuthenticated.mockImplementation((clientId, redirectUri) => {
        if (clientId === 'id' && redirectUri === 'uri') {
          return Promise.resolve(data);
        } else {
          const unmockedAxios = jest.requireActual('axios');
          return unmockedAxios.get('/api/authorize');
        }
      });
    }

  });

  describe('handleLogin', () => {

    it('should fail if client and redirect uri is not presented', async () => {
      await assertLoginFailed('client_id is not present');
      await assertLoginFailed('redirect_uri is not present', () => queryParams.set('client_id', 'id'));
    });

    it('should fail if login failed', async () => {
      mockLoginResponse({message: "invalid credentials", success: false, token: ''});
      provideValidClient();
      await assertLoginFailed('invalid credentials');
    });

    it('should success if login success', async () => {
      mockLoginResponse({message: "ok", success: true, token: 'token'});
      provideValidClient();
      await assertLoginResult({success: true, message: 'ok', token: 'token'});
    });

    function mockLoginResponse(response: AuthLoginResult) {
      authProxy.login.mockImplementation((request) => {
        if (request.username === 'user' && request.password === 'pass' && request.clientId === 'id' && request.redirectUri === 'uri')
          return Promise.resolve(response);

        return Promise.resolve({success: false, message: 'invalid request', token: ''});
      });
    }

    async function assertLoginResult(result: AuthLoginResult, block: () => void = () => {
    }) {
      block();
      expect(await viewModel.login('user', 'pass')).toStrictEqual(result);
    }

    async function assertLoginFailed(message: string, block: () => void = () => {
    }) {
      await assertLoginResult({success: false, message: message, token: ''}, block);
    }

  });

  function provideValidClient() {
    queryParams.set('client_id', 'id');
    queryParams.set('redirect_uri', 'uri');
  }


});