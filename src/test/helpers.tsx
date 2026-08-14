import { render, type RenderOptions } from '@testing-library/react';
import React, { type ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../features/auth/context/AuthContext';
import { ComposeProviders } from '../providers/ComposeProviders';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  /** Optional extra providers specific to a test */
  extraProviders?: React.ComponentType<{ children: React.ReactNode }>[];
}

export function renderWithProviders(
  ui: ReactElement,
  {
    initialEntries = ['/'],
    extraProviders = [],
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  const defaultProviders = [
    AuthProvider,
    ...extraProviders,
  ];

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <ComposeProviders providers={defaultProviders}>
          {children}
        </ComposeProviders>
      </MemoryRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}