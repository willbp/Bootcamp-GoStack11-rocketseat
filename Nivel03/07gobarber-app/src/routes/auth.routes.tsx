import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

// nav de autenticação
const Auth = createStackNavigator();

// cria componente AuthRoutes, tipo React.FC e passa todo JSX da navegação
const AuthRoutes: React.FC = () => (
  // componente de dentro do Auth
  // e dentro nossas rotas q da pra acessar pelo nome
  <Auth.Navigator
    screenOptions={{
      headerShown: false,
      // headerStyle:{backgroundColor:'#7159c1'},
      cardStyle: { backgroundColor: '#312e38' },
      // retira o Header chamado SignIn/Up o nome de cima
    }}
    // initialRouteName="SignUp"
  >
    <Auth.Screen name="SignIn" component={SignIn} />
    <Auth.Screen name="SignUp" component={SignUp} />
  </Auth.Navigator>
);
export default AuthRoutes;
