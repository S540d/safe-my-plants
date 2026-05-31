import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { DEFAULT_PLANTS } from '../constants/defaultPlants'
import { getPlants, savePlants } from '../services/storage'
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

export function PlantProvider({ children }: { children: React.ReactNode }) {
  const [plants, setPlants] = useState<Plant[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const load = async () => {
      const stored = await getPlants()
      if (stored.length === 0) {
        await savePlants(DEFAULT_PLANTS)
        setPlants(DEFAULT_PLANTS)
      } else {
        setPlants(stored)
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
      await persist(
        plants.map((p) =>
          p.id === id ? { ...p, lastWatered: new Date().toISOString(), updatedAt: new Date().toISOString() } : p
        )
      )
    },
    [plants, persist]
  )

  const markFertilized = useCallback(
    async (id: string) => {
      await persist(
        plants.map((p) =>
          p.id === id ? { ...p, lastFertilized: new Date().toISOString(), updatedAt: new Date().toISOString() } : p
        )
      )
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
