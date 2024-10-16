import RegisterPageViewModel from "@src/pages/RegisterPage/RegisterPageViewModel.ts";
import {AuthProxy} from "@src/application/auth/AuthProxy.ts";
import {mock, MockProxy} from "jest-mock-extended";


describe('RegisterPageViewModel', () => {
  let viewModel: RegisterPageViewModel;
  let authProxy: MockProxy<AuthProxy>;

  beforeEach(() => {
    authProxy = mock<AuthProxy>();
    viewModel = new RegisterPageViewModel(authProxy);
  });

  describe('register', () => {
    it('should call authClient.register with the correct parameters', async () => {
      const username = 'username';
      const password = 'password';
      const expectedRequest: AuthServerRegisterRequest = {username, password};
      const expectedResponse: AuthServerRegisterResponse = {success: true};

      const registerSpy = jest.spyOn(authProxy, 'register').mockResolvedValue(expectedResponse);

      const result = await viewModel.register(username, password);

      expect(result.success).toBe(true);
      expect(registerSpy).toHaveBeenCalledWith(expectedRequest);
    });
  });
});