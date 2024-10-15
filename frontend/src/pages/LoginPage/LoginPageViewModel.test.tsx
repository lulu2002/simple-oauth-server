import LoginPageViewModel from "./LoginPageViewModel.tsx";
import axios from "axios";
import AuthClientCheckResult from "./AuthClientCheckResult.ts";
import QueryParamsMock from "@src/application/QueryParamsMock.ts";
import {AuthServerValidateResponse} from "@shared/auth-server-validate-response.ts";

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

  function provideValidClient() {
    queryParams.set('client_id', 'id');
    queryParams.set('redirect_uri', 'uri');
  }

});