import { useCallback, useEffect, useState } from 'react'
import { addCareAction as storageAddAction, getCareLog } from '../services/storage'
import { CareAction } from '../types/careLog'

export function useCareLog() {
  const [actions, setActions] = useState<CareAction[]>([])

  useEffect(() => {
    getCareLog().then(setActions)
  }, [])

  const addAction = useCallback(async (partial: Omit<CareAction, 'id' | 'timestamp'>) => {
    const action: CareAction = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: new Date().toISOString(),
      ...partial,
    }
    await storageAddAction(action)
    setActions((prev) => [action, ...prev])
  }, [])

  const getActionsForPlant = useCallback(
    (plantId: string, limit = 20) =>
      actions
        .filter((a) => a.plantId === plantId)
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        .slice(0, limit),
    [actions]
  )

  const getRecentActions = useCallback(
    (days: number) => {
      const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
      return actions
        .filter((a) => a.timestamp >= cutoff)
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    },
    [actions]
  )

  return { addAction, getActionsForPlant, getRecentActions, actions }
}
