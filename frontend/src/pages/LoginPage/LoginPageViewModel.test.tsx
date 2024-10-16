import LoginPageViewModel from "./LoginPageViewModel";
import QueryParamsMock from "@src/application/query/QueryParamsMock";
import AuthCheckResult from "@src/domain/AuthCheckResult";
import {AuthLoginResult} from "@src/domain/AuthLogin";
import AuthProxyInMemory from "@src/application/auth/AuthProxyInMemory";


describe('LoginPageViewModel', () => {

  let queryParams: QueryParamsMock;
  let viewModel: LoginPageViewModel;
  let authProxy: AuthProxyInMemory

  beforeEach(() => {
    queryParams = new QueryParamsMock();
    authProxy = new AuthProxyInMemory();
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
      provideValidParam()
      await assertCheckFailed("invalid client_id");
    });

    it('should success if all valid', async () => {
      provideValidParam()
      await addClient();

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

  });

  describe('handleLogin', () => {

    it('should fail if client and redirect uri is not presented', async () => {
      await assertLoginFailed('client_id is not present');
      await assertLoginFailed('redirect_uri is not present', () => queryParams.set('client_id', 'id'));
    });

    it('should fail if login failed', async () => {
      provideValidParam();
      await assertLoginFailed('invalid credentials');
    });

    it('should success if login success', async () => {
      await registerAccount();
      provideValidParam();

      await assertLoginResult({success: true, message: 'ok', code: 'code'});
    });

    async function assertLoginResult(result: AuthLoginResult, block: () => void = () => {
    }) {
      block();
      expect(await viewModel.login('email', 'pass')).toStrictEqual(result);
    }

    async function assertLoginFailed(message: string, block: () => void = () => {
    }) {
      await assertLoginResult({success: false, message: message, code: ""}, block);
    }

  });

  async function registerAccount() {
    await authProxy.registerAccount({email: 'email', password: 'pass'});
  }

  async function addClient() {
    await authProxy.addClient('id', 'uri');
  }

  function provideValidParam() {
    queryParams.set('client_id', 'id');
    queryParams.set('redirect_uri', 'uri');
  }


});