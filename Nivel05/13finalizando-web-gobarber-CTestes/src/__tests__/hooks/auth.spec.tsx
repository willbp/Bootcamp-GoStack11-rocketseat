import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import { useAuth, AuthProvider } from '../../hooks/auth';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  // verifica se o user vai conseguir logar usando hook de auth
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'user-123',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
      token: 'token-123',
    };
    // toda vez q eu tiver uma req post em sessions, retorna 200+
    // dados do usuário q tem na api declarado acima, 200 sucesso
    apiMock.onPost('sessions').reply(200, apiResponse);

    // espia se o set item foi disparado dentro do Storage
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    // waitForNextUpdate observa qdo tiver alguma alteração
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'johndoe@example.com',
      password: '123456',
    });

    // espera que algo se altere dentro do hook result.current acima
    await waitForNextUpdate();

    // espero que setItemSpy tenha sido chamada 2x de token e de user abaixo
    expect(setItemSpy).toHaveBeenCalledWith(
      '@Gobarber: token',
      apiResponse.token,
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      '@Gobarber: user',
      JSON.stringify(apiResponse.user),
    );
    // espero q o resultado do e-mail do user seja johndoe..
    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  // reaproveitar storage user/token qdo app inicializa
  it('should restore saved data from storage when auth initiate', () => {
    // espiona getItem e retona valor
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@Gobarber: token':
          return 'token-123';
        case '@Gobarber: user':
          return JSON.stringify({
            id: 'user-123',
            name: 'John Doe',
            email: 'johndoe@example.com',
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });
    // espero q resultado seja o email
    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  // sign out
  it('should be able to sign out', async () => {
    // espiona se foi chamada fazendo login para dps deslogar
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@Gobarber: token':
          return 'token-123';
        case '@Gobarber: user':
          return JSON.stringify({
            id: 'user-123',
            name: 'John Doe',
            email: 'johndoe@example.com',
          });
        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });
    // faz o logout
    act(() => {
      result.current.signOut();
    });
    // espero que seja apagado os dados do user e q tenha sido call 2x
    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.user).toBeUndefined();
  });

  // update user data
  it('should be able to update user data', async () => {
    // spy se a função foi chamada
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    // dispara hook
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: 'user-123',
      name: 'John Doe',
      email: 'johndoe@example.com',
      avatar_url: 'image-test.jpg',
    };
    // dispara updateUser passando os dados do user
    act(() => {
      result.current.updateUser(user);
    });
    // espero que setItemSpy tenha sido chamado com os parametros em ()
    expect(setItemSpy).toBeCalledWith('@Gobarber: user', JSON.stringify(user));
    // espero que o conteúdo seja igual ao user q foi passado
    expect(result.current.user).toEqual(user);
  });
});
