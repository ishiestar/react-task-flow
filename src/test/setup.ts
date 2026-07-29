import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { vi } from 'vitest';
import enTranslations from '../locales/en.json';

// Helper function to resolve nested keys safely for TypeScript
function getNestedTranslation(obj: Record<string, any>, path: string): string {
  const result = path.split('.').reduce((acc, part) => acc && acc[part], obj);
  return typeof result === 'string' ? result : path;
}

// Mock react-i18next to return real English values and interpolate variables
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, any>) => {
      let translation = getNestedTranslation(enTranslations, key);
      
      // Interpolate dynamic variables like {{title}} in "Delete task {{title}}"
      if (options) {
        Object.keys(options).forEach((varName) => {
          translation = translation.replace(`{{${varName}}}`, String(options[varName]));
        });
      }
      
      return translation;
    },
  }),
}));

afterEach(() => {
  cleanup();
});