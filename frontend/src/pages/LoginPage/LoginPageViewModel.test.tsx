import LoginPageViewModel, {AuthLoginResult} from "./LoginPageViewModel.tsx";
import axios from "axios";
import AuthClientCheckResult from "./AuthClientCheckResult.ts";
import QueryParamsMock from "@src/application/QueryParamsMock.ts";
import {AuthServerValidateResponse} from "@shared/auth-server-validate.ts";
import {AuthServerLoginRequest, AuthServerLoginResponse} from "@shared/auth-server-login.ts";


jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LoginPageViewModel', () => {

  let queryParams: QueryParamsMock;
  let viewModel: LoginPageViewModel;

  beforeEach(() => {
    queryParams = new QueryParamsMock();
    viewModel = new LoginPageViewModel(queryParams);
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
      mockAxiosResponse({code: 400, message: "client with id not found", valid: false})
      provideValidClient()

      await assertCheckFailed("client with id not found");
    });

    it('should success if all valid', async () => {
      mockAxiosResponse({code: 200, message: "ok", valid: true})
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
      const result: AuthClientCheckResult = {reason: message, success: bool}
      expect(await viewModel.checkClientValidAuthRequest()).toStrictEqual(result);
    }

    function mockAxiosResponse(data: AuthServerValidateResponse) {
      mockedAxios.get.mockImplementation((url, cfg) => {
        if (url === '/api/authorize' && cfg?.params?.client_id === 'id' && cfg?.params?.redirect_uri === 'uri') {
          return Promise.resolve({data: data});
        } else {
          const unmockedAxios = jest.requireActual('axios');
          return unmockedAxios.post(url);
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

    function mockLoginResponse(response: AuthServerLoginResponse) {
      mockedAxios.post.mockImplementation((url, body) => {
        const data = body as AuthServerLoginRequest;
        if (url === '/api/login' && data.username === 'user' && data.password === 'pass' && data.client_id === 'id' && data.redirect_uri === 'uri') {
          return Promise.resolve({data: response});
        } else {
          const unmockedAxios = jest.requireActual('axios');
          return unmockedAxios.post(url);
        }
      })
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