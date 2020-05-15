import React from 'react';
// switch 1 rota mostrada por momento e route=rotas da app
import { Switch } from 'react-router-dom';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Route from './Route';

// componente chamado Routes e retorna switch+rotas
const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/signup" component={SignUp} />
  </Switch>
);

export default Routes;
