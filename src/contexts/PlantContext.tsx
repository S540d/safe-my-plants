import * as Haptics from 'expo-haptics'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { DEFAULT_PLANTS } from '../constants/defaultPlants'
import { PLANT_TEMPLATES } from '../constants/plantTemplates'
import {
  addCareAction,
  getCareLog,
  getPlants,
  getSchemaVersion,
  saveCareLog,
  savePlants,
  saveSchemaVersion,
} from '../services/storage'
import { notifyCareLogUpdate } from '../hooks/useCareLog'
import { CareAction } from '../types/careLog'
import { Plant, PlantPhoto } from '../types/plant'

interface PlantContextValue {
  plants: Plant[]
  isLoaded: boolean
  addPlant: (plant: Plant) => Promise<void>
  updatePlant: (plant: Plant) => Promise<void>
  deletePlant: (id: string) => Promise<void>
  markWatered: (id: string) => Promise<void>
  markFertilized: (id: string) => Promise<void>
}

const PlantContext = createContext<PlantContextValue | null>(null)

async function runMigrations(plants: Plant[]): Promise<Plant[]> {
  const version = await getSchemaVersion()
  let current = plants

  // v1 → v2: migrate lastWatered/lastFertilized to CareLog entries
  if (version < 2) {
    const existing = await getCareLog()
    const existingIds = new Set(existing.map((a) => a.id))
    const entries: CareAction[] = []

    for (const plant of plants) {
      if (plant.lastWatered) {
        const id = `migration-water-${plant.id}`
        if (!existingIds.has(id)) {
          entries.push({ id, plantId: plant.id, type: 'water', timestamp: plant.lastWatered })
        }
      }
      if (plant.lastFertilized) {
        const id = `migration-fertilize-${plant.id}`
        if (!existingIds.has(id)) {
          entries.push({ id, plantId: plant.id, type: 'fertilize', timestamp: plant.lastFertilized })
        }
      }
    }

    if (entries.length > 0) {
      await saveCareLog([...entries, ...existing])
    }
    await saveSchemaVersion(2)
  }

  // v2 → v3: migrate photos: string[] to photos: PlantPhoto[]
  if (version < 3) {
    current = current.map((plant) => {
      const rawPhotos = plant.photos as unknown as (string | PlantPhoto)[]
      const converted: PlantPhoto[] = rawPhotos.map((p) =>
        typeof p === 'string' ? { uri: p, takenAt: plant.createdAt } : p
      )
      return { ...plant, photos: converted }
    })
    await savePlants(current)
    await saveSchemaVersion(3)
  }

  // v3 → v4: add room field (optional string, no data transform; undefined = "Ohne Raum")
  if (version < 4) {
    await saveSchemaVersion(4)
  }

  // v4 → v5: backfill template imageUrl as first photo for plants without photos
  if (version < 5) {
    const templateByName = new Map(PLANT_TEMPLATES.filter((t) => t.imageUrl).map((t) => [t.name, t.imageUrl!]))
    const now = new Date().toISOString()
    const migrated = current.map((plant) => {
      if (plant.photos.length > 0) return plant
      const imageUrl = templateByName.get(plant.name)
      if (!imageUrl) return plant
      return { ...plant, photos: [{ uri: imageUrl, takenAt: now }] }
    })
    const changed = migrated.some((p, i) => p !== current[i])
    if (changed) {
      current = migrated
      await savePlants(current)
    }
    await saveSchemaVersion(5)
  }

  return current
}

export function PlantProvider({ children }: { children: React.ReactNode }) {
  const [plants, setPlants] = useState<Plant[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const load = async () => {
      const stored = await getPlants()
      const source = stored.length === 0 ? DEFAULT_PLANTS : stored
      if (stored.length === 0) await savePlants(DEFAULT_PLANTS)
      const migrated = await runMigrations(source)
      setPlants(migrated)
      setIsLoaded(true)
    }
    load()
  }, [])

  const persist = useCallback(async (updated: Plant[]) => {
    setPlants(updated)
    await savePlants(updated)
  }, [])

  const addPlant = useCallback(
    async (plant: Plant) => {
      await persist([...plants, plant])
    },
    [plants, persist]
  )

  const updatePlant = useCallback(
    async (plant: Plant) => {
      await persist(plants.map((p) => (p.id === plant.id ? plant : p)))
    },
    [plants, persist]
  )

  const deletePlant = useCallback(
    async (id: string) => {
      await persist(plants.filter((p) => p.id !== id))
    },
    [plants, persist]
  )

  const markWatered = useCallback(
    async (id: string) => {
      const now = new Date().toISOString()
      await persist(plants.map((p) => (p.id === id ? { ...p, lastWatered: now, updatedAt: now } : p)))
      await addCareAction({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        plantId: id,
        type: 'water',
        timestamp: now,
      })
      notifyCareLogUpdate()
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {})
    },
    [plants, persist]
  )

  const markFertilized = useCallback(
    async (id: string) => {
      const now = new Date().toISOString()
      await persist(plants.map((p) => (p.id === id ? { ...p, lastFertilized: now, updatedAt: now } : p)))
      await addCareAction({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        plantId: id,
        type: 'fertilize',
        timestamp: now,
      })
      notifyCareLogUpdate()
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {})
    },
    [plants, persist]
  )

  return (
    <PlantContext.Provider
      value={{ plants, isLoaded, addPlant, updatePlant, deletePlant, markWatered, markFertilized }}
    >
      {children}
    </PlantContext.Provider>
  )
}

export function usePlants(): PlantContextValue {
  const ctx = useContext(PlantContext)
  if (!ctx) throw new Error('usePlants must be used within PlantProvider')
  return ctx
}
