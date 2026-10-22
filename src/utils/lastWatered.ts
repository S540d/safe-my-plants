/** Antworten auf „Wann hast du zuletzt gegossen?" beim Anlegen einer Pflanze. */
export type LastWateredChoice = 'today' | 'few-days' | 'week' | 'unknown'

export const LAST_WATERED_CHOICES: LastWateredChoice[] = ['today', 'few-days', 'week', 'unknown']

const DAY_MS = 24 * 60 * 60 * 1000

const DAYS_AGO: Record<Exclude<LastWateredChoice, 'unknown'>, number> = {
  today: 0,
  'few-days': 3,
  week: 7,
}

/**
 * ISO-Zeitpunkt für `Plant.lastWatered`, `undefined` bei „weiß nicht" (dann startet die
 * Pflanze wie bisher als überfällig und der Fingertest greift).
 */
export function lastWateredFromChoice(choice: LastWateredChoice, now: Date = new Date()): string | undefined {
  if (choice === 'unknown') return undefined
  return new Date(now.getTime() - DAYS_AGO[choice] * DAY_MS).toISOString()
}

/** Nur „heute" ist ein echtes Ereignis – Schätzungen gehören nicht in CareLog, Statistik und Streak. */
export function shouldLogWatering(choice: LastWateredChoice): boolean {
  return choice === 'today'
}
