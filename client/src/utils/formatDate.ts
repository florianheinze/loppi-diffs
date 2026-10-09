const DAY_MS = 24 * 60 * 60 * 1000;

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

const startOfDayUTC = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

export function formatDueLabel(iso: string, now: Date = new Date()): string {
  const due = new Date(iso);
  if (Number.isNaN(due.getTime())) return '—';
  const days = Math.round((startOfDayUTC(due) - startOfDayUTC(now)) / DAY_MS);
  if (days < -1) return `${-days} days overdue`;
  if (days === -1) return 'Yesterday';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return formatDate(iso);
}
