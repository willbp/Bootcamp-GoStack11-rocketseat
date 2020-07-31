import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import SignIn from '../../pages/SignIn'; // importa page de SignIn

// verifica se useHistory 'push' foi disparado para enviar user no Dashboard
const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

// criar mock global para os testes
// quando o dom for chamado/importado ele retorna..
jest.mock('react-router-dom', () => {
  // tem q pegar os elementos declarados na dom
  return {
    useHistory: () => ({
      // qdo chamar useHistory retorna valor 'push'
      push: mockedHistoryPush,
    }), // função vazia.
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('SignIn Page', () => {
  // dispara função antes de cada 1 dos testes
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });
  it('should be able to sign in', async () => {
    // renderizar tela/página de SignIn para poder manipular ela// busca elemento
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwodField = getByPlaceholderText('Senha');

    // fireEvent simula evento/interação do user com a tela
    // realizao alteração no campo de e-mail (preenche)
    fireEvent.change(emailField, { target: { value: 'tiririca@mail.com' } });
    fireEvent.change(passwodField, { target: { value: '123456' } });

    const buttonElement = getByText('Entrar');
    fireEvent.click(buttonElement);

    await wait(() => {
      // dispara mas espera// espero q mockedHistoryPush tenha sido chamada com param (dashboard)
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should not be able to sign in with invalid credentials', async () => {
    // renderizar tela/página de SignIn para poder manipular ela// busca elemento
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwodField = getByPlaceholderText('Senha');

    // fireEvent simula evento/interação do user com a tela
    // realizao alteração no campo de e-mail (preenche)
    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
    fireEvent.change(passwodField, { target: { value: '123456' } });

    const buttonElement = getByText('Entrar');
    fireEvent.click(buttonElement);

    await wait(() => {
      // dispara mas espera// espero q mockedHistoryPush não tenha sido chamada
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  // verificar se função foi disparada
  it('should display an error if login fails', async () => {
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    // renderizar tela/página de SignIn para poder manipular ela// busca elemento
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwodField = getByPlaceholderText('Senha');

    // fireEvent simula evento/interação do user com a tela
    // realizao alteração no campo de e-mail (preenche)
    fireEvent.change(emailField, { target: { value: 'teste@mail.com' } });
    fireEvent.change(passwodField, { target: { value: '123456' } });

    const buttonElement = getByText('Entrar');
    fireEvent.click(buttonElement);

    await wait(() => {
      // dispara mas espera// espero q mockedHistoryPush não tenha sido chamada
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
