import React from 'react';

import { AuthProvider } from './auth';

const AppProvider: React.FC = ({ children }) => (
  // como nenhum depende do outro n tem ordem de qual por primeiro
  <AuthProvider>{children}</AuthProvider>
);
export default AppProvider;
