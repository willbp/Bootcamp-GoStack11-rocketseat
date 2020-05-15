import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';

import GlobalStyle from './styles/global';

// habilita /algo no link  existem diferentes routers
// configuração do sistema de rotas
const App: React.FC = () => (
  // fragment para por config do globalstyle por volta.
  <>
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
    <GlobalStyle />
  </>
);

export default App;
