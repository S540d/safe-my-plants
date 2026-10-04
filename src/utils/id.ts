/** Generates a locally-unique, timestamp-based id (not cryptographically secure). */
export function generateId(prefix?: string): string {
  const raw = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return prefix ? `${prefix}-${raw}` : raw
}
