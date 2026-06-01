import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { DEFAULT_PLANTS } from '../constants/defaultPlants'
import {
  addCareAction,
  getCareLog,
  getPlants,
  getSchemaVersion,
  saveCareLog,
  savePlants,
  saveSchemaVersion,
} from '../services/storage'
import { CareAction } from '../types/careLog'
import { Plant } from '../types/plant'

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

async function runMigrations(plants: Plant[]): Promise<void> {
  const version = await getSchemaVersion()
  if (version >= 2) return

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

export function PlantProvider({ children }: { children: React.ReactNode }) {
  const [plants, setPlants] = useState<Plant[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const load = async () => {
      const stored = await getPlants()
      if (stored.length === 0) {
        await savePlants(DEFAULT_PLANTS)
        setPlants(DEFAULT_PLANTS)
        await runMigrations(DEFAULT_PLANTS)
      } else {
        setPlants(stored)
        await runMigrations(stored)
      }
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
      await persist(
        plants.map((p) => (p.id === id ? { ...p, lastWatered: now, updatedAt: now } : p))
      )
      await addCareAction({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        plantId: id,
        type: 'water',
        timestamp: now,
      })
    },
    [plants, persist]
  )

  const markFertilized = useCallback(
    async (id: string) => {
      const now = new Date().toISOString()
      await persist(
        plants.map((p) => (p.id === id ? { ...p, lastFertilized: now, updatedAt: now } : p))
      )
      await addCareAction({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        plantId: id,
        type: 'fertilize',
        timestamp: now,
      })
    },
    [plants, persist]
  )

  return (
    <PlantContext.Provider value={{ plants, isLoaded, addPlant, updatePlant, deletePlant, markWatered, markFertilized }}>
      {children}
    </PlantContext.Provider>
  )
}

export function usePlants(): PlantContextValue {
  const ctx = useContext(PlantContext)
  if (!ctx) throw new Error('usePlants must be used within PlantProvider')
  return ctx
}
