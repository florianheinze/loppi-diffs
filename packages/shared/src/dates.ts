/** True if the ISO date lies before the start (UTC) of the day containing `now`. */
export function isBeforeToday(iso: string, now: Date = new Date()): boolean {
  const startOfToday = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Date.parse(iso) < startOfToday;
}
