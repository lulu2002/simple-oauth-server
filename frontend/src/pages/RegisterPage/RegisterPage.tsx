import {Container} from "react-bootstrap";
import RegisterForm from "@src/components/RegisterForm.tsx";
import RegisterPageViewModel from "@src/pages/RegisterPage/RegisterPageViewModel.ts";

const RegisterPage = ({viewModel}: { viewModel: RegisterPageViewModel }) => {

  return (
    <>
      <Container>
        <h1 className="text-center my-5">Auth 註冊帳號</h1>
        <RegisterForm
          isError={false}
          loginLink="/login"
          keepQuery={true}
          onSubmit={(username, password) => {
          }}/>
      </Container>
    </>
  );
};

export default RegisterPage;
