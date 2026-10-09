import { useMemo } from 'react';
import { STATUSES } from '@demo/shared';
import type { Status, Task } from '@demo/shared';
import { sortTasks } from '../utils/sortTasks';
import { TaskList } from './TaskList';

const labels: Record<Status, string> = { todo: 'To do', in_progress: 'In progress', done: 'Done' };

interface Props {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskBoard({ tasks, onToggle, onDelete }: Props) {
  const columns = useMemo(() => {
    const sorted = sortTasks(tasks);
    return STATUSES.map((status) => ({ status, tasks: sorted.filter((t) => t.status === status) }));
  }, [tasks]);

  return (
    <div className="board">
      {columns.map(({ status, tasks }) => (
        <section key={status} aria-label={labels[status]}>
          <h2>
            {labels[status]} ({tasks.length})
          </h2>
          <TaskList tasks={tasks} onToggle={onToggle} onDelete={onDelete} />
        </section>
      ))}
    </div>
  );
}
