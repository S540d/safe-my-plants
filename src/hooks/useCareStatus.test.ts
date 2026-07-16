import { getCareStatus, formatLastDate, formatNextDate } from './useCareStatus'
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
