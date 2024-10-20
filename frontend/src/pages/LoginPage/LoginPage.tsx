import {useEffect, useState} from 'react';
import {Container} from 'react-bootstrap';
import LoginPageViewModel from "./LoginPageViewModel";
import LoginForm from "@src/components/LoginForm";

const LoginPage = ({viewModel}: { viewModel: LoginPageViewModel }) => {
  const [clientIdValid, setClientIdValid] = useState<boolean | null>(null);
  const [validateFailedReason, setValidateFailedReason] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<boolean>(false);

  useEffect(() => {
    viewModel.checkClientValidAuthRequest().then((result) => {
      setClientIdValid(result.success);
      setValidateFailedReason(result.reason);
    });
  }, []);

  if (!clientIdValid) {
    return (
      <Container>
        <h1 className="text-center my-5">錯誤</h1>
        <p className="text-center">原因: {validateFailedReason}</p>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <h1 className="text-center my-5">Auth 登入</h1>
        <LoginForm
          isError={loginError}
          invalidAccount={loginError}
          registerLink="/register"
          keepQuery={true}
          onSubmit={(username, password) => {
            viewModel.login(username, password).then((result) => {
              if (result.success)
                viewModel.closeWithCode(result.code, result.redirectUri);
              else
                setLoginError(true);
            });
          }}/>
      </Container>
    </>
  );
};

export default LoginPage;
