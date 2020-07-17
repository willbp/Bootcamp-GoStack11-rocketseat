import React from 'react';
import { Switch, Route } from 'react-router-dom';

// importa as 2 páginas
import Dashboard from '../pages/Dashboard';
import Repository from '../pages/Repository';

const Routes: React.FC = () => (
  // switch serve para verificar exclusividade de rotas
  // repository: recebe um parametro chamado repository
  // + tudo q vier depois de /repository/ é o parâmetro solicitado
  <Switch>
    <Route path="/" exact component={Dashboard} />
    <Route path="/repositories/:repository+" component={Repository} />
  </Switch>
);

export default Routes;
