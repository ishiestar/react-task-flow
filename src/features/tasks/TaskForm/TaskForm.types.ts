import { z } from 'zod';
import { taskPrioritySchema, taskStatusSchema, type Task } from '../task.types';

export const taskFormSchema = z.object({
    title: z
        .string()
        .min(1, { message: 'tasks.form.validation.titleRequired' })
        .max(100, { message: 'tasks.form.validation.titleTooLong' }),
    description: z.string().optional(),
    status: taskStatusSchema,
    priority: taskPrioritySchema,
    dueDate: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export interface TaskFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: TaskFormValues) => void;
    initialValues?: Partial<Task>;
    isSubmitting?: boolean;
}
