import { z } from 'zod';

export const todoStatusSchema = z.enum(['todo', 'in_progress', 'done']);
export const todoPrioritySchema = z.enum(['low', 'medium', 'high']);
export const todoFilterSchema = z.object({
  status: todoStatusSchema.or(z.literal('all')).optional(),
  priority: todoPrioritySchema.or(z.literal('all')).optional()
});

export const todoInputSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().optional().default(''),
  priority: todoPrioritySchema.optional().default('medium'),
  dueDate: z.string().optional(),
  status: todoStatusSchema.optional().default('todo')
});

export type TodoInput = z.infer<typeof todoInputSchema>;
export type TodoFilters = z.infer<typeof todoFilterSchema>;
