import { PRIORITIES, STATUSES } from '@demo/shared';
import type { Priority, Status, TaskFilters } from '@demo/shared';
import { Button } from './Button';

interface Props {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

export function FilterBar({ filters, onChange }: Props) {
  return (
    <div className="filter-bar" role="search">
      <input
        type="search"
        placeholder="Search…"
        value={filters.search ?? ''}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />
      <select
        aria-label="Status filter"
        value={filters.status ?? ''}
        onChange={(e) => onChange({ ...filters, status: (e.target.value || undefined) as Status | undefined })}
      >
        <option value="">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select
        aria-label="Priority filter"
        value={filters.priority ?? ''}
        onChange={(e) => onChange({ ...filters, priority: (e.target.value || undefined) as Priority | undefined })}
      >
        <option value="">All priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <Button variant="secondary" onClick={() => onChange({})}>
        Reset
      </Button>
    </div>
  );
}
