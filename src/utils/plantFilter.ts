import { getCareStatus, getDueTime } from '../hooks/useCareStatus'
import { CareStatus, Plant, PlantLocation } from '../types/plant'

export type SortOption = 'name' | 'nextCare' | 'recent'

export interface FilterState {
  query: string
  locations: PlantLocation[]
  statuses: CareStatus[]
  sort: SortOption
}

function daysUntilNextCare(plant: Plant, now: number): number {
  const water = getDueTime(plant.lastWatered, plant.careInfo.wateringFrequencyDays, plant.wateringSnoozedUntil)
  const fert = getDueTime(plant.lastFertilized, plant.careInfo.fertilizingFrequencyDays)
  const waterDays = water === undefined ? Number.NEGATIVE_INFINITY : (water - now) / 86400000
  const fertDays = fert === undefined ? Number.NEGATIVE_INFINITY : (fert - now) / 86400000
  const min = Math.min(waterDays, fertDays)
  return isFinite(min) ? min : Number.NEGATIVE_INFINITY
}

export function filterAndSortPlants(plants: Plant[], { query, locations, statuses, sort }: FilterState): Plant[] {
  let result = plants

  if (query.trim()) {
    const q = query.trim().toLowerCase()
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.scientificName?.toLowerCase().includes(q) ?? false)
    )
  }

  if (locations.length > 0) {
    result = result.filter((p) => locations.includes(p.location))
  }

  if (statuses.length > 0) {
    result = result.filter((p) => statuses.includes(getCareStatus(p).overall))
  }

  const now = Date.now()
  if (sort === 'nextCare') {
    const scores = new Map(result.map((p) => [p.id, daysUntilNextCare(p, now)]))
    return [...result].sort((a, b) => (scores.get(a.id) ?? 0) - (scores.get(b.id) ?? 0))
  }
  return [...result].sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}
