import RegisterPageViewModel from "@src/pages/RegisterPage/RegisterPageViewModel.ts";
import AuthProxyInMemory from "@src/application/auth/AuthProxyInMemory.ts";
import {RegisterAccountResult} from "@src/domain/RegisterAccount.ts";


describe('RegisterPageViewModel', () => {
  let viewModel: RegisterPageViewModel;
  let authProxy: AuthProxyInMemory;

  beforeEach(() => {
    authProxy = new AuthProxyInMemory();
    viewModel = new RegisterPageViewModel(authProxy);
  });

  describe('register', () => {

    it('should fail if account already exists', async () => {
      await authProxy.registerAccount({email: 'username', password: 'password'});
      const result = await viewModel.register('username', 'password');

      assertResult(result, {success: false, reason: 'account_already_exists'});
    });

    it('should just forward', async () => {
      const result = await viewModel.register('username', 'password');

      assertResult(result, {success: true, reason: 'ok'});
    });

    function assertResult(result: RegisterAccountResult, expected: RegisterAccountResult) {
      expect(result).toStrictEqual(expected);
    }

  });

});