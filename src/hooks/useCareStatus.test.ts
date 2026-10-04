import { getCareStatus, getDueTime, getSnoozeDays, formatLastDate, formatNextDate } from './useCareStatus'
import { Plant } from '../types/plant'

const DAY_MS = 24 * 60 * 60 * 1000

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * DAY_MS).toISOString()
}

function makePlant(overrides: Partial<Plant> = {}): Plant {
  return {
    id: 'test-plant',
    name: 'Test Plant',
    description: '',
    photos: [],
    location: 'indoor',
    careInfo: {
      wateringFrequencyDays: 7,
      wateringTips: '',
      fertilizingFrequencyDays: 30,
      fertilizingTips: '',
      locationTips: '',
      temperature: { min: 15, max: 25 },
      humidity: 'medium',
    },
    diseases: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

describe('getCareStatus', () => {
  it('returns overdue when never watered/fertilized', () => {
    const status = getCareStatus(makePlant())
    expect(status.watering).toBe('overdue')
    expect(status.fertilizing).toBe('overdue')
    expect(status.overall).toBe('overdue')
  })

  it('returns ok when well within the interval', () => {
    const plant = makePlant({ lastWatered: isoDaysAgo(1), lastFertilized: isoDaysAgo(1) })
    const status = getCareStatus(plant)
    expect(status.watering).toBe('ok')
    expect(status.fertilizing).toBe('ok')
    expect(status.overall).toBe('ok')
  })

  it('returns soon when less than 20% of the interval remains', () => {
    const plant = makePlant({ lastWatered: isoDaysAgo(6) })
    expect(getCareStatus(plant).watering).toBe('soon')
  })

  it('returns overdue when the interval has passed', () => {
    const plant = makePlant({ lastWatered: isoDaysAgo(8) })
    expect(getCareStatus(plant).watering).toBe('overdue')
  })

  it('overall reflects the worst of watering/fertilizing', () => {
    const plant = makePlant({ lastWatered: isoDaysAgo(8), lastFertilized: isoDaysAgo(1) })
    const status = getCareStatus(plant)
    expect(status.watering).toBe('overdue')
    expect(status.fertilizing).toBe('ok')
    expect(status.overall).toBe('overdue')
  })
})

describe('formatLastDate', () => {
  it('reports never watered', () => {
    expect(formatLastDate(undefined, 'de')).toBe('Noch nie')
    expect(formatLastDate(undefined, 'en')).toBe('Never')
  })

  it('reports today', () => {
    expect(formatLastDate(new Date().toISOString(), 'en')).toBe('Today')
  })
})

describe('formatNextDate', () => {
  it('reports overdue when no last date exists', () => {
    expect(formatNextDate(undefined, 7, 'de')).toBe('Überfällig')
    expect(formatNextDate(undefined, 7, 'en')).toBe('Overdue')
  })

  it('reports days overdue when the interval has passed', () => {
    expect(formatNextDate(isoDaysAgo(9), 7, 'en')).toBe('2 days overdue')
  })
})

describe('watering snooze ("soil still moist")', () => {
  const inDays = (days: number) => new Date(Date.now() + days * DAY_MS).toISOString()

  it('turns an overdue watering back to ok while the snooze lasts', () => {
    const plant = makePlant({ lastWatered: isoDaysAgo(10), wateringSnoozedUntil: inDays(3) })
    expect(getCareStatus(plant).watering).toBe('ok')
  })

  it('is overdue again once the snooze has expired', () => {
    const plant = makePlant({ lastWatered: isoDaysAgo(10), wateringSnoozedUntil: inDays(-1) })
    expect(getCareStatus(plant).watering).toBe('overdue')
  })

  it('applies to a never-watered plant', () => {
    const plant = makePlant({ wateringSnoozedUntil: inDays(3) })
    expect(getCareStatus(plant).watering).toBe('ok')
  })

  it('never pulls the due date earlier than the regular interval', () => {
    const plant = makePlant({ lastWatered: isoDaysAgo(1), wateringSnoozedUntil: inDays(1) })
    expect(getDueTime(plant.lastWatered, 7, plant.wateringSnoozedUntil)).toBeGreaterThan(Date.now() + 5 * DAY_MS)
  })

  it('does not affect fertilizing', () => {
    const plant = makePlant({ lastWatered: isoDaysAgo(10), wateringSnoozedUntil: inDays(3) })
    expect(getCareStatus(plant).fertilizing).toBe('overdue')
  })

  it('ignores an invalid snooze date', () => {
    const plant = makePlant({ lastWatered: isoDaysAgo(10), wateringSnoozedUntil: 'not-a-date' })
    expect(getCareStatus(plant).watering).toBe('overdue')
  })

  it('formats the next date with the snooze', () => {
    expect(formatNextDate(isoDaysAgo(10), 7, 'de', inDays(2))).toBe('in 2 Tagen')
  })

  it('scales the snooze length with the interval, clamped to 2-7 days', () => {
    expect(getSnoozeDays(3)).toBe(2)
    expect(getSnoozeDays(14)).toBe(4)
    expect(getSnoozeDays(60)).toBe(7)
  })
})
