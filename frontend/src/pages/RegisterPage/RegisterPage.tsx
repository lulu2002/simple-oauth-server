import {Container} from "react-bootstrap";
import RegisterForm from "@src/components/RegisterForm.tsx";
import RegisterPageViewModel from "@src/pages/RegisterPage/RegisterPageViewModel.ts";
import {useState} from "react";
import {RegisterAccountResult} from "@src/domain/RegisterAccount.ts";


const RegisterPage = ({viewModel}: { viewModel: RegisterPageViewModel }) => {

  const [isError, setIsError] = useState(false);
  const [reason, setReason] = useState<RegisterAccountResult["reason"]>("unknown_error");

  return (
    <>
      <Container>
        <h1 className="text-center my-5">Auth 註冊帳號</h1>
        <RegisterForm
          isAccountExists={isError && reason == "account_already_exists"}
          invalidEmail={isError && reason == "invalid_email"}
          invalidPassword={isError && reason == "invalid_password"}
          unknownError={isError && reason == "unknown_error"}
          loginLink="/login"
          keepQuery={true}
          onSubmit={(username, password) => {
            viewModel.register(username, password).then(result => {
              if (!result.success) {
                setIsError(true);
                setReason(result.reason);
              }
            });
          }}/>
      </Container>
    </>
  );
};

export default RegisterPage;
