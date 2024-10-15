import LoginPageViewModel from "./LoginPageViewModel.tsx";
import axios from "axios";
import QueryParamsMock from "../../application/QueryParamsMock.ts";
import AuthClientCheckResult from "./AuthClientCheckResult.ts";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LoginPageViewModel', () => {

  let queryParams: QueryParamsMock;
  let viewModel: LoginPageViewModel;

  beforeEach(() => {
    queryParams = new QueryParamsMock();
    viewModel = new LoginPageViewModel(queryParams);
  });

  it('should failed if client id is not present', async () => {
    await assertCheckFailed("client_id is not present");
    await assertCheckFailed("redirect_uri is not present", () => queryParams.set('client_id', 'id'));
  });

  it('should failed if client id is not valid', async () => {
    mockedAxios.get.mockImplementation((url, cfg) => {
      if (url === '/api/authorize' && cfg?.params?.client_id === 'id' && cfg?.params?.redirect_uri === 'uri') {
        return Promise.resolve({data: {code: 404, valid: false, message: 'client with id not found'}});
      } else {
        const unmockedAxios = jest.requireActual('axios');
        return unmockedAxios.post(url);
      }
    });
    queryParams.set('client_id', 'id');
    queryParams.set('redirect_uri', 'uri');

    await assertCheckFailed("client with id not found");
  });

  async function assertCheckFailed(reason: string, block: () => void = () => {
  }) {
    block();
    const result: AuthClientCheckResult = {reason: reason, success: false}
    expect(await viewModel.checkClientValidAuthRequest()).toStrictEqual(result);
  }

});