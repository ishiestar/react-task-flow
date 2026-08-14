import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
  User as UserIcon,
  Mail,
  Shield,
  CheckCircle2,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { profileSchema, type ProfileFormValues } from '../../auth.types';

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const [successMessage, setSuccessMessage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      avatarUrl: user?.avatarUrl || '',
      bio: user?.bio || '',
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    await updateProfile(values);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t('profile.title', 'Account Settings')}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {t('profile.subtitle', 'Manage your personal profile, credentials, and access permissions.')}
        </p>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{t('profile.saveSuccess', 'Profile updated successfully!')}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: User Summary Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border-2 border-indigo-500/20 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-2xl mb-4 overflow-hidden">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{user.name}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>

          <div className="mt-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            <span>{t('auth.roleLabel', 'Role: {{role}}', { role: t(`auth.roles.${user.role}`, user.role) })}</span>
          </div>

          <hr className="w-full border-slate-100 dark:border-slate-800 my-5" />

          {/* RBAC Info */}
          <div className="w-full text-left">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              {t('profile.permissionsHeader', 'Role Permissions')}
            </h3>
            <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>{t('profile.permissions.createAndUpdate', 'Create & update task statuses')}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>{t('profile.permissions.deleteOwn', 'Delete own created tasks')}</span>
              </li>
              <li className="flex items-center gap-2">
                {user.role === 'ADMIN' ? (
                  <>
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {t('profile.permissions.deleteAnyAdmin', 'Delete any task (Admin privilege)')}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-slate-300 dark:text-slate-600 font-bold">✕</span>
                    <span className="text-slate-400 dark:text-slate-500">
                      {t('profile.permissions.deleteOtherDenied', "Delete other users' tasks")}
                    </span>
                  </>
                )}
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
            {t('profile.editHeader', 'Personal Details')}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('profile.fullName', 'Full Name')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Jane Doe"
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{t(errors.name.message as string)}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('profile.email', 'Email Address')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="jane@taskflow.dev"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{t(errors.email.message as string)}</p>
              )}
            </div>

            {/* Avatar URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('profile.avatarUrl', 'Avatar Image URL (Optional)')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  {...register('avatarUrl')}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>
              {errors.avatarUrl && (
                <p className="text-xs text-red-500 mt-1">{t(errors.avatarUrl.message as string)}</p>
              )}
            </div>

            {/* Bio / Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('profile.bio', 'Bio / Title (Optional)')}
              </label>
              <div className="relative">
                <div className="absolute top-2.5 left-3 pointer-events-none text-slate-400">
                  <FileText className="w-4 h-4" />
                </div>
                <textarea
                  rows={3}
                  {...register('bio')}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                  placeholder="Senior Frontend Engineer"
                />
              </div>
              {errors.bio && (
                <p className="text-xs text-red-500 mt-1">{t(errors.bio.message as string)}</p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                {isSubmitting ? t('profile.saving', 'Saving...') : t('profile.saveChanges', 'Save Changes')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};