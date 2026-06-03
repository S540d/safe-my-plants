import { getCareStatus } from '../hooks/useCareStatus'
import { CareStatus, Plant, PlantLocation } from '../types/plant'

export type SortOption = 'name' | 'nextCare' | 'recent'

export interface FilterState {
  query: string
  locations: PlantLocation[]
  statuses: CareStatus[]
  sort: SortOption
}

function daysUntilNextCare(plant: Plant, now: number): number {
  const waterDays = plant.lastWatered
    ? plant.careInfo.wateringFrequencyDays - (now - new Date(plant.lastWatered).getTime()) / 86400000
    : -Infinity
  const fertDays = plant.lastFertilized
    ? plant.careInfo.fertilizingFrequencyDays - (now - new Date(plant.lastFertilized).getTime()) / 86400000
    : -Infinity
  return Math.min(waterDays, fertDays)
}

export function filterAndSortPlants(plants: Plant[], { query, locations, statuses, sort }: FilterState): Plant[] {
  let result = plants

  if (query.trim()) {
    const q = query.trim().toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.scientificName?.toLowerCase().includes(q) ?? false),
    )
  }

  if (locations.length > 0) {
    result = result.filter((p) => locations.includes(p.location))
  }

  if (statuses.length > 0) {
    result = result.filter((p) => statuses.includes(getCareStatus(p).overall))
  }

  const now = Date.now()
  return [...result].sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name)
    if (sort === 'nextCare') return daysUntilNextCare(a, now) - daysUntilNextCare(b, now)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}
