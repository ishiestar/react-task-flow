import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { X, Loader2 } from 'lucide-react';
import { taskFormSchema } from './TaskForm.types';
import type { TaskFormProps, TaskFormValues } from './TaskForm.types';

const formatDueDateForInput = (dateString?: string): string => {
    if (!dateString) return '';
    try {
        return format(parseISO(dateString), 'yyyy-MM-dd');
    } catch {
        return '';
    }
};

export const TaskForm: React.FC<TaskFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialValues,
    isSubmitting = false,
}) => {
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TaskFormValues>({
        resolver: zodResolver(taskFormSchema),
        values: {
            title: initialValues?.title ?? '',
            description: initialValues?.description ?? '',
            status: initialValues?.status ?? 'TODO',
            priority: initialValues?.priority ?? 'MEDIUM',
            dueDate: formatDueDateForInput(initialValues?.dueDate),
        },
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-xl bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {initialValues?.id ? t('tasks.form.editTitle') : t('tasks.form.createTitle')}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={t('tasks.form.close')}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            {t('tasks.form.titleLabel')} *
                        </label>
                        <input
                            type="text"
                            {...register('title')}
                            placeholder={t('tasks.form.titlePlaceholder')}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {errors.title && (
                            <p className="text-xs text-red-500 mt-1">{t(errors.title.message as string)}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            {t('tasks.form.descriptionLabel')}
                        </label>
                        <textarea
                            rows={3}
                            {...register('description')}
                            placeholder={t('tasks.form.descriptionPlaceholder')}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Select Controls Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                {t('tasks.form.statusLabel')}
                            </label>
                            <select
                                {...register('status')}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="TODO">{t('tasks.status.todo')}</option>
                                <option value="IN_PROGRESS">{t('tasks.status.inProgress')}</option>
                                <option value="COMPLETED">{t('tasks.status.completed')}</option>
                            </select>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                {t('tasks.form.priorityLabel')}
                            </label>
                            <select
                                {...register('priority')}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="LOW">{t('tasks.priority.low')}</option>
                                <option value="MEDIUM">{t('tasks.priority.medium')}</option>
                                <option value="HIGH">{t('tasks.priority.high')}</option>
                            </select>
                        </div>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            {t('tasks.form.dueDateLabel')}
                        </label>
                        <input
                            type="date"
                            {...register('dueDate')}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            {t('tasks.form.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>
                                {initialValues?.id ? t('tasks.form.submitUpdate') : t('tasks.form.submitCreate')}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};