import type { Task } from '@demo/shared';
import { formatDueLabel } from '../utils/formatDate';
import { Button } from './Button';

interface Props {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
    <li className={`task task--${task.status}`}>
      <input
        type="checkbox"
        aria-label={`Mark "${task.title}" as done`}
        checked={task.status === 'done'}
        onChange={() => onToggle(task)}
      />
      <span className="task__title">{task.title}</span>
      <span className={`badge badge--${task.priority}`}>{task.priority}</span>
      {task.tags.map((tag) => (
        <span key={tag} className="tag">
          #{tag}
        </span>
      ))}
      {task.dueDate && <time dateTime={task.dueDate}>{formatDueLabel(task.dueDate)}</time>}
      <Button variant="danger" aria-label={`Delete "${task.title}"`} onClick={() => onDelete(task.id)}>
        Delete
      </Button>
    </li>
  );
}
