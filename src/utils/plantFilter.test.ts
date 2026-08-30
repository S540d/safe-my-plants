import { filterAndSortPlants, FilterState } from './plantFilter'
import { Plant, PlantLocation } from '../types/plant'

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

function baseFilter(overrides: Partial<FilterState> = {}): FilterState {
  return { query: '', locations: [], statuses: [], sort: 'name', ...overrides }
}

/** Freshly watered and fertilized — status 'ok', so status filters don't interfere. */
function healthyPlant(overrides: Partial<Plant> = {}): Plant {
  return makePlant({ lastWatered: isoDaysAgo(0), lastFertilized: isoDaysAgo(0), ...overrides })
}

describe('filterAndSortPlants – query', () => {
  it('matches on name, case-insensitively', () => {
    const plants = [healthyPlant({ id: 'a', name: 'Monstera' }), healthyPlant({ id: 'b', name: 'Ficus' })]
    const result = filterAndSortPlants(plants, baseFilter({ query: 'mons' }))
    expect(result.map((p) => p.id)).toEqual(['a'])
  })

  it('matches on scientificName when the name does not match', () => {
    const plants = [
      healthyPlant({ id: 'a', name: 'Fensterblatt', scientificName: 'Monstera deliciosa' }),
      healthyPlant({ id: 'b', name: 'Ficus' }),
    ]
    const result = filterAndSortPlants(plants, baseFilter({ query: 'deliciosa' }))
    expect(result.map((p) => p.id)).toEqual(['a'])
  })

  it('ignores a whitespace-only query', () => {
    const plants = [healthyPlant({ id: 'a', name: 'Monstera' }), healthyPlant({ id: 'b', name: 'Ficus' })]
    const result = filterAndSortPlants(plants, baseFilter({ query: '   ' }))
    expect(result).toHaveLength(2)
  })

  it('tolerates a missing scientificName', () => {
    const plants = [healthyPlant({ id: 'a', name: 'Ficus' })]
    expect(() => filterAndSortPlants(plants, baseFilter({ query: 'xyz' }))).not.toThrow()
    expect(filterAndSortPlants(plants, baseFilter({ query: 'xyz' }))).toEqual([])
  })
})

describe('filterAndSortPlants – locations', () => {
  it('keeps only plants in the selected locations', () => {
    const plants = [
      healthyPlant({ id: 'a', location: 'sun' }),
      healthyPlant({ id: 'b', location: 'shade' }),
      healthyPlant({ id: 'c', location: 'indoor' }),
    ]
    const result = filterAndSortPlants(plants, baseFilter({ locations: ['sun', 'indoor'] }))
    expect(result.map((p) => p.id).sort()).toEqual(['a', 'c'])
  })

  it('treats an empty location list as "no filter"', () => {
    const plants: Plant[] = (['sun', 'shade', 'indoor'] as PlantLocation[]).map((location, i) =>
      healthyPlant({ id: String(i), location })
    )
    expect(filterAndSortPlants(plants, baseFilter({ locations: [] }))).toHaveLength(3)
  })
})

describe('filterAndSortPlants – statuses', () => {
  it('keeps only plants whose overall status is selected', () => {
    const overdue = makePlant({ id: 'overdue', name: 'A', lastWatered: isoDaysAgo(30), lastFertilized: isoDaysAgo(60) })
    const ok = healthyPlant({ id: 'ok', name: 'B' })
    const result = filterAndSortPlants([overdue, ok], baseFilter({ statuses: ['overdue'] }))
    expect(result.map((p) => p.id)).toEqual(['overdue'])
  })
})

describe('filterAndSortPlants – sorting', () => {
  it('sorts by name using locale comparison', () => {
    const plants = [
      healthyPlant({ id: 'c', name: 'Zebra' }),
      healthyPlant({ id: 'a', name: 'Ähre' }),
      healthyPlant({ id: 'b', name: 'Birke' }),
    ]
    const result = filterAndSortPlants(plants, baseFilter({ sort: 'name' }))
    expect(result.map((p) => p.name)).toEqual(['Ähre', 'Birke', 'Zebra'])
  })

  it('sorts by recency of creation, newest first', () => {
    const plants = [
      healthyPlant({ id: 'old', createdAt: isoDaysAgo(10) }),
      healthyPlant({ id: 'new', createdAt: isoDaysAgo(1) }),
      healthyPlant({ id: 'mid', createdAt: isoDaysAgo(5) }),
    ]
    const result = filterAndSortPlants(plants, baseFilter({ sort: 'recent' }))
    expect(result.map((p) => p.id)).toEqual(['new', 'mid', 'old'])
  })

  it('sorts by next care date, most urgent first', () => {
    // wateringFrequencyDays is 7: watered 6 days ago → 1 day left; 1 day ago → 6 days left.
    const urgent = healthyPlant({ id: 'urgent', lastWatered: isoDaysAgo(6), lastFertilized: isoDaysAgo(1) })
    const relaxed = healthyPlant({ id: 'relaxed', lastWatered: isoDaysAgo(1), lastFertilized: isoDaysAgo(1) })
    const result = filterAndSortPlants([relaxed, urgent], baseFilter({ sort: 'nextCare' }))
    expect(result.map((p) => p.id)).toEqual(['urgent', 'relaxed'])
  })

  it('puts never-cared-for plants first when sorting by next care', () => {
    const never = makePlant({ id: 'never' })
    const cared = healthyPlant({ id: 'cared' })
    const result = filterAndSortPlants([cared, never], baseFilter({ sort: 'nextCare' }))
    expect(result[0].id).toBe('never')
  })
})

describe('filterAndSortPlants – purity', () => {
  it('does not mutate the input array', () => {
    const plants = [healthyPlant({ id: 'b', name: 'B' }), healthyPlant({ id: 'a', name: 'A' })]
    const snapshot = plants.map((p) => p.id)
    filterAndSortPlants(plants, baseFilter({ sort: 'name' }))
    expect(plants.map((p) => p.id)).toEqual(snapshot)
  })

  it('returns an empty array for empty input', () => {
    expect(filterAndSortPlants([], baseFilter())).toEqual([])
  })
})
