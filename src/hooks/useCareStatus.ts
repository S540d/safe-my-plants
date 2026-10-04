import { CareStatus, Plant, PlantCareStatus } from '../types/plant'

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Due time (ms) of a care task: last care + interval, pushed back by an optional
 * snooze ("soil still moist"). `undefined` = never done and not snoozed.
 */
export function getDueTime(
  lastDate: string | undefined,
  intervalDays: number,
  snoozedUntil?: string
): number | undefined {
  const base = lastDate ? new Date(lastDate).getTime() + intervalDays * DAY_MS : undefined
  const snooze = snoozedUntil ? new Date(snoozedUntil).getTime() : undefined
  const times = [base, snooze].filter((v): v is number => v !== undefined && Number.isFinite(v))
  return times.length > 0 ? Math.max(...times) : undefined
}

/** Days a watering reminder is pushed back after a "soil still moist" check. */
export function getSnoozeDays(wateringFrequencyDays: number): number {
  return Math.min(7, Math.max(2, Math.round(wateringFrequencyDays * 0.25)))
}

function computeStatus(lastDate: string | undefined, intervalDays: number, snoozedUntil?: string): CareStatus {
  const due = getDueTime(lastDate, intervalDays, snoozedUntil)
  if (due === undefined) return 'overdue'
  const remaining = due - Date.now()

  if (remaining < 0) return 'overdue'
  if (remaining < intervalDays * DAY_MS * 0.2) return 'soon'
  return 'ok'
}

function worstStatus(a: CareStatus, b: CareStatus): CareStatus {
  const order: CareStatus[] = ['overdue', 'soon', 'ok']
  return order.indexOf(a) <= order.indexOf(b) ? a : b
}

/**
 * Care status for one plant: the watering and fertilizing traffic lights plus
 * the overall (worst of the two) status.
 *
 * This is a pure computation over the plant's own fields — it holds no state and
 * calls no React hooks, so it works inside components, in list callbacks and in
 * plain helpers alike.
 */
export function getCareStatus(plant: Plant): PlantCareStatus {
  const watering = computeStatus(plant.lastWatered, plant.careInfo.wateringFrequencyDays, plant.wateringSnoozedUntil)
  const fertilizing = computeStatus(plant.lastFertilized, plant.careInfo.fertilizingFrequencyDays)
  const overall = worstStatus(watering, fertilizing)
  return { watering, fertilizing, overall }
}

export function formatLastDate(isoDate: string | undefined, lang: 'de' | 'en'): string {
  if (!isoDate) return lang === 'de' ? 'Noch nie' : 'Never'
  const d = new Date(isoDate)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000))
  if (diffDays === 0) return lang === 'de' ? 'Heute' : 'Today'
  if (diffDays === 1) return lang === 'de' ? 'Gestern' : 'Yesterday'
  return lang === 'de' ? `vor ${diffDays} Tagen` : `${diffDays} days ago`
}

export function formatNextDate(
  lastDate: string | undefined,
  intervalDays: number,
  lang: 'de' | 'en',
  snoozedUntil?: string
): string {
  const next = getDueTime(lastDate, intervalDays, snoozedUntil)
  if (next === undefined) return lang === 'de' ? 'Überfällig' : 'Overdue'
  const diffDays = Math.round((next - Date.now()) / DAY_MS)
  if (diffDays < 0)
    return lang === 'de' ? `${Math.abs(diffDays)} Tage überfällig` : `${Math.abs(diffDays)} days overdue`
  if (diffDays === 0) return lang === 'de' ? 'Heute' : 'Today'
  if (diffDays === 1) return lang === 'de' ? 'Morgen' : 'Tomorrow'
  return lang === 'de' ? `in ${diffDays} Tagen` : `in ${diffDays} days`
}
