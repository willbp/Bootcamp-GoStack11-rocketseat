// arquivo de Rotas
import React from 'react';
// acessar contexto de autenticação
import {
  RouteProps as ReactDOMRouteProps,
  Route as ReactDOMRoute,
  Redirect,
} from 'react-router-dom';
import { useAuth } from '../hooks/auth';

// vou extender as props uma rota já tem - funções (render,location,children,location,path)
interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType; // sobrescrever a tipagem do tipo component para React.ComponentType;
}

// Route terá os elementos(propriedades) de RouteProps(interface)
// /passa todas propriedades recebidas (render,location bla bla bla para ReactDomRoute)
const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  // se na var user tiver dados do user ele está autenticado na app
  const { user } = useAuth();

  // retorna rota
  return (
    <ReactDOMRoute
      {...rest}
      // rota privada+user auth = ok continua
      // verifica se a rota é privada e user n é autenticado redireciona pra login
      // se a rota n for privada e user ta autenticado redireciona pra dashboard
      // se a rota não ser privada e não estar autenticado, ta ok

      // redireciona o usuário pro login caso a rota seja autenticada e o user não esteja logado
      // caso contrário ele redireciona pro /dashboard

      // para manter histórico sendo repassado (no render location) para poder voltar e avançar sem se perder
      render={({ location }) => {
        return isPrivate === !!user ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/dashboard',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
