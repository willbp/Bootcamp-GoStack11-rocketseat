import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

// criar formato do contexto...nome,email,etc
interface AuthContextData {
  user: User; // porque tem várias propriedades, nome, email, avatar
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

interface AuthState {
  token: string;
  user: User; // porque tem várias propriedades, nome, email, avatar
}

// acessar informação do usuário q está logado na app.
//                            Força que objeto inicie seja um AuthContext vazio
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// AuthProvider do tipo React.FC 'FunctionComponent' e vai receber propriedade..
// children, tudo q o componente (AuthProvider) receber como filho vai repassar para algum lugar aqui dentro
export const AuthProvider: React.FC = ({ children }) => {
  // useState para salvar dados de token e user fora do localstorage para passar por contexto para os componentes.
  // data=todos dados de autenticação'AuthProvider'
  const [data, setData] = useState<AuthState>(() => {
    // passa formato para state(interface)
    // inicializa var utilizando função p/ buscar data baseado nos dados do localstorage
    // se localstorage tiver preenchido ele preenche data, se não vem vazio.
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    // se existe informações
    if (token && user) {
      // qdo user der F5 n perde token
      api.defaults.headers.authorization = `Bearer ${token}`;

      // retorna valor inicial (localstorage+converte string to obj)
      return { token, user: JSON.parse(user) };
    } // se não vem vazio

    return {} as AuthState; // hack para inicializar vazio
  });

  // método signIn é uma função que vai setar alguma coisa..
  // recebe credenciais de login:e-mail e senha
  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });
    // console.log(response.data);
    // após o processo de autenticação busca o token e o usuário.
    const { token, user } = response.data;
    // armazena token no local storage, coloca prefixo pra n confundir com outros tokens
    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user)); // converte objeto pra string

    // define como padrão um cabeçalho com esse valor (daqui a diante)
    // faz-se isso aqui(login e no use state qdo der F5 na página)
    api.defaults.headers.authorization = `Bearer ${token}`;

    // logo depois de fazer login preencho token e user dentro do State fazendo o ciclo
    // de verificação constante enquanto app ativa
    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    // deleta dados especificos do localStorage (token e user)
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');
    // Seta onde está estes dados como vazio com o hackzinho
    // e exporta signOut no AuthContext.Provider
    // e add tipagem em AuthContextData
    setData({} as AuthState);
  }, []);

  // o updateData pode pegar os campos de User, mas não todos
  //  const updateUser = useCallback((updateData: Partial<User>)
  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@GoBarber:user', JSON.stringify(user));
      setData({
        // atualiza usuário (avatar)
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
  // interpretando: Tudo que AuthProvider receber como filho
  // vai ser repassado para dentro do AuthContext.Provider
};

// a função useAuth retorna AuthContextData
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  // se o contexto não foi criado
  // se o usuário utilizar userAuth sem utilizar o AuthProvider por volta do nosso App.tsx
  // dispara erro porque o contexto não existe
  if (!context) {
    throw new Error('useAuth must be used witin an AuthProvider');
  }
  return context; // se não retorna contexto
}
