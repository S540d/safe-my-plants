export type PlantLocation = 'sun' | 'partial-shade' | 'shade' | 'indoor'
export type HumidityLevel = 'low' | 'medium' | 'high'
export type CareStatus = 'ok' | 'soon' | 'overdue'

export interface PlantPhoto {
  uri: string
  takenAt: string // ISO-8601
}

export interface CareInfo {
  wateringFrequencyDays: number
  wateringTips: string
  fertilizingFrequencyDays: number
  fertilizingTips: string
  locationTips: string
  temperature: { min: number; max: number }
  humidity: HumidityLevel
}

export interface Disease {
  id: string
  name: string
  symptoms: string
  treatment: string
  imageUri?: string
}

export interface Plant {
  id: string
  name: string
  scientificName?: string
  description: string
  photos: PlantPhoto[]
  location: PlantLocation
  careInfo: CareInfo
  diseases: Disease[]
  lastWatered?: string
  lastFertilized?: string
  createdAt: string
  updatedAt: string
}

export interface PlantCareStatus {
  watering: CareStatus
  fertilizing: CareStatus
  overall: CareStatus
}
