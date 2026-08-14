import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckSquare, BarChart3, LogOut, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/features/auth';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
    }`;

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/30">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight">
              TaskFlow
            </span>
          </NavLink>

          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClasses}>
              <CheckSquare className="w-4 h-4" />
              <span>{t('nav.tasks', 'Tasks')}</span>
            </NavLink>
            <NavLink to="/analytics" className={navLinkClasses}>
              <BarChart3 className="w-4 h-4" />
              <span>{t('nav.analytics', 'Analytics')}</span>
            </NavLink>
          </nav>
        </div>

        {/* User Info & Actions */}
        {user && (
          <div className="flex items-center gap-3">
            {/* User Profile Info */}
            <div className="flex items-center gap-2.5 pl-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-semibold text-xs">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>

              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  {user.email}
                </span>
              </div>

              {/* Role Badge */}
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${user.role === 'ADMIN'
                  ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
              >
                {user.role === 'ADMIN' ? <Shield className="w-2.5 h-2.5" /> : <UserIcon className="w-2.5 h-2.5" />}
                {user.role}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              aria-label={t('auth.logout', 'Sign Out')}
              title={t('auth.logout', 'Sign Out')}
              className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="sm:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 py-2">
        <NavLink to="/" end className={navLinkClasses}>
          <CheckSquare className="w-4 h-4" />
          <span>{t('nav.tasks', 'Tasks')}</span>
        </NavLink>
        <NavLink to="/analytics" className={navLinkClasses}>
          <BarChart3 className="w-4 h-4" />
          <span>{t('nav.analytics', 'Analytics')}</span>
        </NavLink>
      </nav>
    </header>
  );
};