import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import CreateAppointment from '../pages/CreateAppointment';
import AppointmentCreated from '../pages/AppointmentCreated';

// nav de autenticação
const App = createStackNavigator();

// cria componente AuthRoutes, tipo React.FC e passa todo JSX da navegação
const AppRoutes: React.FC = () => (
  // componente de dentro do Auth
  // e dentro nossas rotas q da pra acessar pelo nome
  <App.Navigator
    screenOptions={{
      headerShown: false, // não mostra o header
      // headerStyle:{backgroundColor:'#7159c1'},
      cardStyle: { backgroundColor: '#312e38' },
      // retira o Header chamado SignIn/Up o nome de cima
    }}
    // initialRouteName="SignUp"
  >
    <App.Screen name="Dashboard" component={Dashboard} />
    <App.Screen name="CreateAppointment" component={CreateAppointment} />
    <App.Screen name="AppointmentCreated" component={AppointmentCreated} />

    <App.Screen name="Profile" component={Profile} />
  </App.Navigator>
);
export default AppRoutes;
