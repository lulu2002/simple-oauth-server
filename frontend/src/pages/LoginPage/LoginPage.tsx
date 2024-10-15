import {useEffect, useState} from 'react';
import {Container} from 'react-bootstrap';
import LoginPageViewModel from "./LoginPageViewModel.tsx";
import LoginForm from "../../components/LoginForm.tsx";

const LoginPage = ({viewModel}: { viewModel: LoginPageViewModel }) => {
  const [clientIdValid, setClientIdValid] = useState<boolean | null>(null);
  const [failedReason, setFailedReason] = useState<string | null>(null);

  useEffect(() => {
    viewModel.checkClientValidAuthRequest().then((result) => {
      setClientIdValid(result.success);
      setFailedReason(result.reason);
    });
  }, []);

  if (clientIdValid === null) {
    return <div>Loading...</div>;
  }

  if (!clientIdValid) {
    return (
      <Container>
        <h1 className="text-center my-5">錯誤</h1>
        <p className="text-center">原因: {failedReason}</p>
      </Container>
    );
  }

  return (
    <LoginForm onSubmit={(username, password) => viewModel.handleLogin(username, password)}/>
  );
};

export default LoginPage;
