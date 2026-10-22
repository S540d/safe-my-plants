import { Plant } from '../types/plant'
import { buildHomeSections } from './homeSections'

const DAY_MS = 24 * 60 * 60 * 1000
const iso = (daysAgo: number) => new Date(Date.now() - daysAgo * DAY_MS).toISOString()

const LABELS = { dueTitle: 'Heute dran', noRoomTitle: 'Ohne Raum', locale: 'de' }

function makePlant(id: string, overrides: Partial<Plant> = {}): Plant {
  return {
    id,
    name: id,
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
    lastWatered: iso(1),
    lastFertilized: iso(1),
    createdAt: iso(10),
    updatedAt: iso(10),
    ...overrides,
  }
}

describe('buildHomeSections', () => {
  it('puts overdue plants into the due section, most urgent first', () => {
    const slightlyLate = makePlant('slightly-late', { lastWatered: iso(8) })
    const veryLate = makePlant('very-late', { lastWatered: iso(20) })
    const fine = makePlant('fine')

    const sections = buildHomeSections([slightlyLate, fine, veryLate], LABELS)

    expect(sections[0].kind).toBe('due')
    expect(sections[0].title).toBe('Heute dran')
    expect(sections[0].data.map((p) => p.id)).toEqual(['very-late', 'slightly-late'])
  })

  it('treats a plant that was never watered as due', () => {
    const sections = buildHomeSections([makePlant('new', { lastWatered: undefined })], LABELS)
    expect(sections[0].kind).toBe('due')
  })

  it('has no due section when everything is fine', () => {
    const sections = buildHomeSections([makePlant('a'), makePlant('b')], LABELS)
    expect(sections.every((s) => s.kind === 'room')).toBe(true)
  })

  it('groups the rest by room, sorted, with "no room" last, and lists each plant once', () => {
    const plants = [
      makePlant('kitchen-plant', { room: 'Küche' }),
      makePlant('bath-plant', { room: 'Bad' }),
      makePlant('floating'),
      makePlant('late-bath', { room: 'Bad', lastWatered: iso(30) }),
    ]

    const sections = buildHomeSections(plants, LABELS)

    expect(sections.map((s) => s.title)).toEqual(['Heute dran', 'Bad', 'Küche', 'Ohne Raum'])
    const ids = sections.flatMap((s) => s.data.map((p) => p.id))
    expect(ids.sort()).toEqual(['bath-plant', 'floating', 'kitchen-plant', 'late-bath'])
  })

  it('returns no sections for no plants', () => {
    expect(buildHomeSections([], LABELS)).toEqual([])
  })
})
