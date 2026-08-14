import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/theme';

export const ThemeToggle: React.FC = () => {
  const { t } = useTranslation();
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        resolvedTheme === 'dark'
          ? t('theme.switchToLight', 'Switch to light mode')
          : t('theme.switchToDark', 'Switch to dark mode')
      }
      title={
        resolvedTheme === 'dark'
          ? t('theme.switchToLight', 'Switch to light mode')
          : t('theme.switchToDark', 'Switch to dark mode')
      }
      className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="w-4 h-4 transition-transform rotate-0 scale-100" />
      ) : (
        <Moon className="w-4 h-4 transition-transform rotate-0 scale-100" />
      )}
    </button>
  );
};