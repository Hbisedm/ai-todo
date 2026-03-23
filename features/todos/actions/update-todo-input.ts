export type UpdateTodoInput = {
  id: string;
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  status?: 'todo' | 'in_progress' | 'done';
};

function getOptionalString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value : undefined;
}

export function buildUpdateTodoInput(formData: FormData): UpdateTodoInput {
  return {
    id: String(formData.get('id') ?? ''),
    title: getOptionalString(formData, 'title'),
    description: getOptionalString(formData, 'description'),
    priority: getOptionalString(formData, 'priority') as 'low' | 'medium' | 'high' | undefined,
    dueDate: getOptionalString(formData, 'dueDate'),
    status: (getOptionalString(formData, 'status') ?? 'todo') as 'todo' | 'in_progress' | 'done'
  };
}
