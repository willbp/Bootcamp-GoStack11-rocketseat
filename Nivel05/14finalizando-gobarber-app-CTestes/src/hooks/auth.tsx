import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
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
  loading: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): Promise<void>;
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
  const [data, setData] = useState<AuthState>({} as AuthState);

  const [loading, setLoading] = useState(true); // estado armazena true enquanto app faz processo de verificação inicial (logado ou não)

  // disparar função assim q o componente for exibido em tela (vai no storage e busca meu data)
  // para preencher o data  de  const [data, setData] = useState<AuthState>({} as AuthState);
  useEffect(() => {
    // retorno da função Promise<void> de momento
    async function loadStoragedData(): Promise<void> {
      // passa formato para state(interface)
      // inicializa var utilizando função p/ buscar data baseado nos dados do localstorage
      // se localstorage tiver preenchido ele preenche data, se não vem vazio.
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);
      // preenche setData com as informações só se tiver as informações 'autenticação'
      if (token[1] && user[1]) {
        // qdo autentica seta o token
        api.defaults.headers.authorization = `Bearer ${token[1]}`;

        setData({ token: token[1], user: JSON.parse(user[1]) });
      }
      // independente se ele achou o usuário ou não
      setLoading(false);
    }
    loadStoragedData();
  }, []);

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
    // await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user)); // converte objeto pra string
    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ]);
    // qdo autentica seta o token
    api.defaults.headers.authorization = `Bearer ${token}`;

    // logo depois de fazer login preencho token e user dentro do State fazendo o ciclo
    // de verificação constante enquanto app ativa
    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    // deleta dados especificos do localStorage (token e user)
    // multiremove remove varias props ao msm tempo
    await AsyncStorage.multiRemove(['@GoBarber:user', '@GoBarber:token']);
    // Seta onde está estes dados como vazio com o hackzinho
    // e exporta signOut no AuthContext.Provider
    // e add tipagem em AuthContextData
    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    async (user: User) => {
      await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, loading, signIn, signOut, updateUser }}
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
