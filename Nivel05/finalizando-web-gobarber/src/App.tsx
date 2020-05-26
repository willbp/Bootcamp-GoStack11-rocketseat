import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import GlobalStyle from './styles/global';
// import SignIn from './pages/SignIn';
// import { AuthProvider } from './hooks/auth';
// import { ToastProvider } from './hooks/toast';
import AppProvider from './hooks';
import Routes from './routes';

// o q for importado "toastcontainer" fica disponivel pra toda app por estar em App.tsx

const App: React.FC = () => (
  // provider=componente q verifica autenticação
  // todo componente dentro dele tem informação de autenticação

  // AuthProvider=Tudo q tem a ver com contexto de autenticação fica centralizado
  // dentro do arquivo de contexto context/AuthContext.tsx
  <Router>
    <AppProvider>
      <Routes />
    </AppProvider>

    <GlobalStyle />
  </Router>
);
export default App;
