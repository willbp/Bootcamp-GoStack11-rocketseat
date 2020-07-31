import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';

const AppProvider: React.FC = ({ children }) => (
  // como nenhum depende do outro n tem ordem de qual por primeiro
  <AuthProvider>
    <ToastProvider>{children}</ToastProvider>
  </AuthProvider>
);
export default AppProvider;
