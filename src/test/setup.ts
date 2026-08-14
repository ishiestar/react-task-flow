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
    t: (key: string, defaultValue?: string | Record<string, any>, options?: Record<string, any>) => {
      // Handle different parameter combinations: t(key), t(key, defaultValue), or t(key, options)
      let translation = getNestedTranslation(enTranslations, key);
      let interpolationOptions = options;

      // If translation key doesn't exist and defaultValue is provided
      if (translation === key && typeof defaultValue === 'string') {
        translation = defaultValue;
      } else if (typeof defaultValue === 'object') {
        // defaultValue is actually options (the third parameter was omitted)
        interpolationOptions = defaultValue;
      }

      // Interpolate dynamic variables like {{title}} in "Delete task {{title}}"
      if (interpolationOptions) {
        Object.keys(interpolationOptions).forEach((varName) => {
          translation = translation.replace(`{{${varName}}}`, String(interpolationOptions[varName]));
        });
      }

      return translation;
    },
  }),
}));

afterEach(() => {
  cleanup();
});