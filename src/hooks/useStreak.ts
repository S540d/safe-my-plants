import { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getCareLog } from '../services/storage'

const STREAK_KEY = 'smp-streak'

interface StreakData {
  current: number
  longest: number
  lastCheckDate: string // ISO date (YYYY-MM-DD)
}

const DEFAULT_STREAK: StreakData = { current: 0, longest: 0, lastCheckDate: '' }

function toDateStr(date: Date): string {
  return date.toISOString().slice(0, 10)
}

async function loadStreak(): Promise<StreakData> {
  const raw = await AsyncStorage.getItem(STREAK_KEY)
  if (!raw) return DEFAULT_STREAK
  try {
    return JSON.parse(raw) as StreakData
  } catch {
    return DEFAULT_STREAK
  }
}

async function saveStreak(data: StreakData): Promise<void> {
  await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(data))
}

export function useStreak() {
  const [streak, setStreak] = useState<StreakData>(DEFAULT_STREAK)

  const refresh = useCallback(async () => {
    const current = await loadStreak()
    const today = toDateStr(new Date())

    if (current.lastCheckDate === today) {
      setStreak(current)
      return
    }

    const log = await getCareLog()
    const yesterday = toDateStr(new Date(Date.now() - 86400000))

    const hadActivityYesterday = log.some((a) => a.timestamp.slice(0, 10) === yesterday)
    const hadActivityToday = log.some((a) => a.timestamp.slice(0, 10) === today)

    let newCurrent = current.current
    if (hadActivityToday) {
      if (current.lastCheckDate === yesterday || current.lastCheckDate === today) {
        newCurrent = current.current + (current.lastCheckDate === today ? 0 : 1)
      } else {
        newCurrent = 1
      }
    } else if (hadActivityYesterday && current.lastCheckDate === yesterday) {
      // Still alive, not broken yet — user hasn't acted today
      newCurrent = current.current
    } else if (current.lastCheckDate < yesterday) {
      // Streak broken (missed a day)
      newCurrent = 0
    }

    const newLongest = Math.max(current.longest, newCurrent)
    const updated: StreakData = {
      current: newCurrent,
      longest: newLongest,
      lastCheckDate: today,
    }
    await saveStreak(updated)
    setStreak(updated)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { ...streak, refresh }
}
