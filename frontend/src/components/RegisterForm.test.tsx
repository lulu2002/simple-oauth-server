import {fireEvent, render, screen} from '@testing-library/react';
import {MemoryRouter} from "react-router-dom";
import RegisterForm from "@src/components/RegisterForm.tsx";

describe('LoginForm Component', () => {

  let emailInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let confirmPasswordInput: HTMLInputElement;
  let submitButton: HTMLElement;
  let mockOnSubmit: jest.Mock;

  beforeEach(() => {
    mockOnSubmit = jest.fn();

    render(
      <MemoryRouter>
        <RegisterForm
          onSubmit={mockOnSubmit}
          isError={false}
          loginLink="/register"
          keepQuery={false}
        />
      </MemoryRouter>
    );

    emailInput = screen.getByLabelText("電子郵件") as HTMLInputElement;
    passwordInput = screen.getByLabelText("密碼") as HTMLInputElement;
    confirmPasswordInput = screen.getByLabelText("確認密碼") as HTMLInputElement;
    submitButton = screen.getByText("註冊");
  });

  it('should have no errors by default even value not match', () => {
    fireEvent.change(passwordInput, {target: {value: 'password123'}});
    fireEvent.change(confirmPasswordInput, {target: {value: 'password321'}});

    expect(confirmPasswordInput).not.toHaveClass('is-invalid');
  });

  it('should prevent form submission when password and confirm password do not match', () => {
    fireEvent.change(emailInput, {target: {value: 'test@example.com'}});
    fireEvent.change(passwordInput, {target: {value: 'password123'}});
    fireEvent.change(confirmPasswordInput, {target: {value: 'password321'}});

    fireEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();

    expect(confirmPasswordInput).toHaveClass('is-invalid');
    expect(screen.getByText("密碼不一致")).toBeInTheDocument();
  });

  it('should call submit', () => {
    fireEvent.change(emailInput, {target: {value: 'test@example.com'}})
    fireEvent.change(passwordInput, {target: {value: 'password123'}});
    fireEvent.change(confirmPasswordInput, {target: {value: 'password123'}});

    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith("test@example.com", "password123");
  });

});
