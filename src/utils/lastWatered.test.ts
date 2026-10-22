import { lastWateredFromChoice, shouldLogWatering } from './lastWatered'

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

describe('shouldLogWatering', () => {
  it('logs only a real watering today', () => {
    expect(shouldLogWatering('today')).toBe(true)
    expect(shouldLogWatering('few-days')).toBe(false)
    expect(shouldLogWatering('week')).toBe(false)
    expect(shouldLogWatering('unknown')).toBe(false)
  })
})
