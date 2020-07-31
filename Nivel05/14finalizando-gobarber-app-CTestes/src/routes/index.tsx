import React from 'react';
import { View, ActivityIndicator } from 'react-native';
// importa as rotas autenticadas
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

// saber se o user ta logado ou não
import { useAuth } from '../hooks/auth';

// cria componente Routes do tipo Function Component e retorna o AuthRoutes
const Routes: React.FC = () => {
  const { user, loading } = useAuth(); // pega informação de user e loading

  // enquanto minha app estiver em loading
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  // se eu tiver um user eu vou mostrar AppRoutes se não vou mostrar AuthRoutes
  // AppRoutes=rotas autenticadas
  return user ? <AppRoutes /> : <AuthRoutes />;
};
export default Routes;
