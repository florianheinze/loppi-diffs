import type { Task } from '@demo/shared';
import { formatDate } from '../utils/formatDate';
import { Button } from './Button';

interface Props {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
    <li className={`task task--${task.status}`}>
      <input type="checkbox" checked={task.status === 'done'} onChange={() => onToggle(task)} />
      <span className="task__title">{task.title}</span>
      {task.dueDate && <time>{formatDate(task.dueDate)}</time>}
      <Button onClick={() => onDelete(task.id)}>Delete</Button>
    </li>
  );
}
