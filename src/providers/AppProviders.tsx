import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ComposeProviders } from './ComposeProviders';
import { AuthProvider } from '../features/auth/context/AuthContext';
import { ThemeProvider } from '@/theme/context/ThemeContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <ComposeProviders providers={[AuthProvider, ThemeProvider]} >
        {children}
      </ComposeProviders>
    </BrowserRouter>
  );
};