/** Antworten auf „Wann zuletzt gegossen/gedüngt?" beim Anlegen einer Pflanze. */
export type LastWateredChoice = 'today' | 'few-days' | 'week' | 'unknown'
export type LastFertilizedChoice = 'today' | 'two-weeks' | 'month' | 'unknown'

export const LAST_WATERED_CHOICES: LastWateredChoice[] = ['today', 'few-days', 'week', 'unknown']
export const LAST_FERTILIZED_CHOICES: LastFertilizedChoice[] = ['today', 'two-weeks', 'month', 'unknown']

const DAY_MS = 24 * 60 * 60 * 1000

const WATERED_DAYS_AGO: Record<Exclude<LastWateredChoice, 'unknown'>, number> = {
  today: 0,
  'few-days': 3,
  week: 7,
}

const FERTILIZED_DAYS_AGO: Record<Exclude<LastFertilizedChoice, 'unknown'>, number> = {
  today: 0,
  'two-weeks': 14,
  month: 35,
}

function daysAgo(now: Date, days: number): string {
  return new Date(now.getTime() - days * DAY_MS).toISOString()
}

/**
 * ISO-Zeitpunkt für `Plant.lastWatered`, `undefined` bei „weiß nicht" (dann startet die
 * Pflanze wie bisher als überfällig und der Fingertest greift).
 */
export function lastWateredFromChoice(choice: LastWateredChoice, now: Date = new Date()): string | undefined {
  return choice === 'unknown' ? undefined : daysAgo(now, WATERED_DAYS_AGO[choice])
}

/** ISO-Zeitpunkt für `Plant.lastFertilized`, `undefined` bei „weiß nicht / noch nie". */
export function lastFertilizedFromChoice(choice: LastFertilizedChoice, now: Date = new Date()): string | undefined {
  return choice === 'unknown' ? undefined : daysAgo(now, FERTILIZED_DAYS_AGO[choice])
}

/** Nur „heute" ist ein echtes Ereignis – Schätzungen gehören nicht in CareLog, Statistik und Streak. */
export function shouldLogCare(choice: LastWateredChoice | LastFertilizedChoice): boolean {
  return choice === 'today'
}
