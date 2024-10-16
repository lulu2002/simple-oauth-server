import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {MemoryRouter} from "react-router-dom";
import RegisterForm from "@src/components/RegisterForm";

describe('LoginForm Component', () => {

  let emailInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let confirmPasswordInput: HTMLInputElement;
  let submitButton: HTMLElement;
  let mockOnSubmit: jest.Mock;

  beforeEach(() => {
    mockOnSubmit = jest.fn();

  });

  it('should have no errors by default even value not match', () => {
    doRender({});
    fireEvent.change(passwordInput, {target: {value: 'password123'}});
    fireEvent.change(confirmPasswordInput, {target: {value: 'password321'}});

    expect(confirmPasswordInput).not.toHaveClass('is-invalid');
  });

  it('should toggle field base on value', () => {
    assertRenderError({isAccountExists: true}, "此帳號已存在");
    assertRenderError({unknownError: true}, "未知錯誤");
    assertRenderError({invalidEmail: true}, "無效的電子郵件");
    assertRenderError({invalidPassword: true}, "無效的密碼");
  });

  function assertRenderError(options: RenderOptions, errorText: string) {
    doRender({});
    expect(screen.queryByText(errorText)).not.toBeInTheDocument();

    cleanup();

    doRender(options);
    expect(screen.getByText(errorText)).toBeInTheDocument();

    cleanup();
  }

  it('should prevent form submission when password and confirm password do not match', () => {
    doRender({});
    fireEvent.change(emailInput, {target: {value: 'test@example.com'}});
    fireEvent.change(passwordInput, {target: {value: 'password123'}});
    fireEvent.change(confirmPasswordInput, {target: {value: 'password321'}});

    fireEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();

    expect(confirmPasswordInput).toHaveClass('is-invalid');
    expect(screen.getByText("密碼不一致")).toBeInTheDocument();
  });

  it('should call submit', () => {
    doRender({});
    fireEvent.change(emailInput, {target: {value: 'test@example.com'}})
    fireEvent.change(passwordInput, {target: {value: 'password123'}});
    fireEvent.change(confirmPasswordInput, {target: {value: 'password123'}});

    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith("test@example.com", "password123");
  });

  function doRender(
    {
      isAccountExists = false,
      unknownError = false,
      invalidEmail = false,
      invalidPassword = false
    }: RenderOptions) {
    render(
      <MemoryRouter>
        <RegisterForm
          onSubmit={mockOnSubmit}
          isAccountExists={isAccountExists}
          invalidEmail={invalidEmail}
          invalidPassword={invalidPassword}
          unknownError={unknownError}
          loginLink="/register"
          keepQuery={false}
        />
      </MemoryRouter>
    );

    emailInput = screen.getByLabelText("電子郵件") as HTMLInputElement;
    passwordInput = screen.getByLabelText("密碼") as HTMLInputElement;
    confirmPasswordInput = screen.getByLabelText("確認密碼") as HTMLInputElement;
    submitButton = screen.getByText("註冊");

  }

  interface RenderOptions {
    isAccountExists?: boolean;
    unknownError?: boolean;
    invalidEmail?: boolean;
    invalidPassword?: boolean;
  }

});
