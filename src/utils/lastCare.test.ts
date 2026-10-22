import { lastFertilizedFromChoice, lastWateredFromChoice, shouldLogCare } from './lastCare'

const NOW = new Date('2026-10-22T12:00:00.000Z')

describe('lastWateredFromChoice', () => {
  it('returns now for "today"', () => {
    expect(lastWateredFromChoice('today', NOW)).toBe('2026-10-22T12:00:00.000Z')
  })

  it('goes back 3 and 7 days for the estimates', () => {
    expect(lastWateredFromChoice('few-days', NOW)).toBe('2026-10-19T12:00:00.000Z')
    expect(lastWateredFromChoice('week', NOW)).toBe('2026-10-15T12:00:00.000Z')
  })

  it('returns undefined for "unknown"', () => {
    expect(lastWateredFromChoice('unknown', NOW)).toBeUndefined()
  })
})

describe('lastFertilizedFromChoice', () => {
  it('returns now for "today"', () => {
    expect(lastFertilizedFromChoice('today', NOW)).toBe('2026-10-22T12:00:00.000Z')
  })

  it('goes back 14 and 35 days for the estimates', () => {
    expect(lastFertilizedFromChoice('two-weeks', NOW)).toBe('2026-10-08T12:00:00.000Z')
    expect(lastFertilizedFromChoice('month', NOW)).toBe('2026-09-17T12:00:00.000Z')
  })

  it('returns undefined for "unknown"', () => {
    expect(lastFertilizedFromChoice('unknown', NOW)).toBeUndefined()
  })
})

describe('shouldLogCare', () => {
  it('logs only a real action today', () => {
    expect(shouldLogCare('today')).toBe(true)
    expect(shouldLogCare('few-days')).toBe(false)
    expect(shouldLogCare('week')).toBe(false)
    expect(shouldLogCare('two-weeks')).toBe(false)
    expect(shouldLogCare('month')).toBe(false)
    expect(shouldLogCare('unknown')).toBe(false)
  })
})
