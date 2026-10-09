import { Layout } from './components/Layout';
import { TaskBoard } from './components/TaskBoard';
import { TaskForm } from './components/TaskForm';
import { useTasks } from './hooks/useTasks';

export function App() {
  const { tasks, loading, error, addTask, toggleDone, removeTask } = useTasks();

  return (
    <Layout>
      <TaskForm onSubmit={addTask} />
      {error && <p role="alert">{error}</p>}
      {loading ? <p>Loading…</p> : <TaskBoard tasks={tasks} onToggle={toggleDone} onDelete={removeTask} />}
    </Layout>
  );
}
