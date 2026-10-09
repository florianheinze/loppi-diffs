import { FilterBar } from './components/FilterBar';
import { Layout } from './components/Layout';
import { TaskBoard } from './components/TaskBoard';
import { TaskForm } from './components/TaskForm';
import { useTaskStore } from './hooks/useTaskStore';

export function App() {
  const { visibleTasks, filters, setFilters, loading, error, addTask, toggleDone, removeTask } = useTaskStore();

  return (
    <Layout>
      <TaskForm onSubmit={addTask} />
      <FilterBar filters={filters} onChange={setFilters} />
      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <TaskBoard tasks={visibleTasks} onToggle={toggleDone} onDelete={removeTask} />
      )}
    </Layout>
  );
}
