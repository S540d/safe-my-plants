import { CareStatus, Plant, PlantCareStatus } from '../types/plant'

function computeStatus(lastDate: string | undefined, intervalDays: number): CareStatus {
  if (!lastDate) return 'overdue'
  const last = new Date(lastDate).getTime()
  const now = Date.now()
  const intervalMs = intervalDays * 24 * 60 * 60 * 1000
  const elapsed = now - last
  const remaining = intervalMs - elapsed

  if (remaining < 0) return 'overdue'
  if (remaining < intervalMs * 0.2) return 'soon'
  return 'ok'
}

function worstStatus(a: CareStatus, b: CareStatus): CareStatus {
  const order: CareStatus[] = ['overdue', 'soon', 'ok']
  return order.indexOf(a) <= order.indexOf(b) ? a : b
}

export function useCareStatus(plant: Plant): PlantCareStatus {
  const watering = computeStatus(plant.lastWatered, plant.careInfo.wateringFrequencyDays)
  const fertilizing = computeStatus(plant.lastFertilized, plant.careInfo.fertilizingFrequencyDays)
  const overall = worstStatus(watering, fertilizing)
  return { watering, fertilizing, overall }
}

export function getCareStatus(plant: Plant): PlantCareStatus {
  const watering = computeStatus(plant.lastWatered, plant.careInfo.wateringFrequencyDays)
  const fertilizing = computeStatus(plant.lastFertilized, plant.careInfo.fertilizingFrequencyDays)
  const overall = worstStatus(watering, fertilizing)
  return { watering, fertilizing, overall }
}

export function formatLastDate(isoDate: string | undefined, lang: 'de' | 'en'): string {
  if (!isoDate) return lang === 'de' ? 'Noch nie' : 'Never'
  const d = new Date(isoDate)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000))
  if (diffDays === 0) return lang === 'de' ? 'Heute' : 'Today'
  if (diffDays === 1) return lang === 'de' ? 'Gestern' : 'Yesterday'
  return lang === 'de' ? `vor ${diffDays} Tagen` : `${diffDays} days ago`
}

export function formatNextDate(lastDate: string | undefined, intervalDays: number, lang: 'de' | 'en'): string {
  if (!lastDate) return lang === 'de' ? 'Überfällig' : 'Overdue'
  const next = new Date(lastDate).getTime() + intervalDays * 24 * 60 * 60 * 1000
  const now = Date.now()
  const diffDays = Math.round((next - now) / (24 * 60 * 60 * 1000))
  if (diffDays < 0) return lang === 'de' ? `${Math.abs(diffDays)} Tage überfällig` : `${Math.abs(diffDays)} days overdue`
  if (diffDays === 0) return lang === 'de' ? 'Heute' : 'Today'
  if (diffDays === 1) return lang === 'de' ? 'Morgen' : 'Tomorrow'
  return lang === 'de' ? `in ${diffDays} Tagen` : `in ${diffDays} days`
}
