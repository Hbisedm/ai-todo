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

export function getTodoAdvanceActionKey(status: string): 'start' | 'markDone' | null {
  switch (status) {
    case 'TODO':
      return 'start';
    case 'IN_PROGRESS':
      return 'markDone';
    case 'DONE':
      return null;
    default:
      return 'start';
  }
}
