import { useMemo } from 'react'
import { usePlants } from '../contexts/PlantContext'
import { getCareStatus } from './useCareStatus'

export function useOverdueCount(): { overdue: number; soon: number } {
  const { plants } = usePlants()
  return useMemo(() => {
    let overdue = 0
    let soon = 0
    for (const plant of plants) {
      const { overall } = getCareStatus(plant)
      if (overall === 'overdue') overdue++
      else if (overall === 'soon') soon++
    }
    return { overdue, soon }
  }, [plants])
}
