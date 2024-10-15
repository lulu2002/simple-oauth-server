import {useEffect, useState} from 'react';
import {Container} from 'react-bootstrap';
import LoginPageViewModel from "./LoginPageViewModel.tsx";
import LoginForm from "@src/components/LoginForm.tsx";

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
    <LoginForm
      isError={loginError}
      invalidAccount={loginError}
      registerLink="/register"
      keepQuery={true}
      onSubmit={(username, password) => {
        viewModel.login(username, password).then((result) => {
          if (result.success)
            viewModel.closeWithCode(result.token);
          else
            setLoginError(true);
        });
      }}/>
  );
};

export default LoginPage;
