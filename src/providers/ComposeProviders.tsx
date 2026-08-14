import React from 'react';

interface ComposeProvidersProps {
  providers: React.ComponentType<{ children: React.ReactNode }>[];
  children: React.ReactNode;
}

export const ComposeProviders: React.FC<ComposeProvidersProps> = ({ providers, children }) => {
  return (
    <>
      {providers.reduceRight(
        (acc, Provider) => (
          <Provider>{acc}</Provider>
        ),
        children
      )}
    </>
  );
};