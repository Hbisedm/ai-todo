export function getNextTodoStatus(status: string): 'todo' | 'in_progress' | 'done' | null {
  switch (status) {
    case 'TODO':
      return 'in_progress';
    case 'IN_PROGRESS':
      return 'done';
    case 'DONE':
      return null;
    default:
      return 'todo';
  }
}
