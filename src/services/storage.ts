import AsyncStorage from '@react-native-async-storage/async-storage'
import { CareAction } from '../types/careLog'
import { Plant } from '../types/plant'

const KEYS = {
  plants: 'smp-plants',
  adminPinSet: 'smp-admin-pin',
  language: 'smp-language',
  theme: 'smp-theme',
  careLog: 'smp-carelog',
  schemaVersion: 'smp-schema-version',
  reminders: 'smp-reminders',
}

async function get<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

async function set<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value))
}

export async function getPlants(): Promise<Plant[]> {
  return (await get<Plant[]>(KEYS.plants)) ?? []
}

export async function savePlants(plants: Plant[]): Promise<void> {
  await set(KEYS.plants, plants)
}

export async function getAdminPin(): Promise<string | null> {
  return get<string>(KEYS.adminPinSet)
}

export async function saveAdminPin(pin: string): Promise<void> {
  await set(KEYS.adminPinSet, pin)
}

export async function getLanguage(): Promise<'de' | 'en' | null> {
  return get<'de' | 'en'>(KEYS.language)
}

export async function saveLanguage(lang: 'de' | 'en'): Promise<void> {
  await set(KEYS.language, lang)
}

export async function getTheme(): Promise<'light' | 'dark' | 'system' | null> {
  return get<'light' | 'dark' | 'system'>(KEYS.theme)
}

export async function saveTheme(theme: 'light' | 'dark' | 'system'): Promise<void> {
  await set(KEYS.theme, theme)
}

export async function getCareLog(): Promise<CareAction[]> {
  return (await get<CareAction[]>(KEYS.careLog)) ?? []
}

export async function saveCareLog(actions: CareAction[]): Promise<void> {
  await set(KEYS.careLog, actions)
}

export async function addCareAction(action: CareAction): Promise<void> {
  const existing = await getCareLog()
  await set(KEYS.careLog, [action, ...existing])
}

export async function getSchemaVersion(): Promise<number> {
  return (await get<number>(KEYS.schemaVersion)) ?? 1
}

export async function saveSchemaVersion(version: number): Promise<void> {
  await set(KEYS.schemaVersion, version)
}

export interface ReminderSettings {
  enabled: boolean
  time: string // 'HH:mm'
}

const DEFAULT_REMINDER_SETTINGS: ReminderSettings = { enabled: false, time: '09:00' }

function isValidReminderSettings(obj: unknown): obj is ReminderSettings {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as ReminderSettings).enabled === 'boolean' &&
    typeof (obj as ReminderSettings).time === 'string' &&
    /^\d{2}:\d{2}$/.test((obj as ReminderSettings).time)
  )
}

export async function getReminderSettings(): Promise<ReminderSettings> {
  const parsed = await get<unknown>(KEYS.reminders)
  if (isValidReminderSettings(parsed)) return parsed
  return DEFAULT_REMINDER_SETTINGS
}

export async function saveReminderSettings(settings: ReminderSettings): Promise<void> {
  await set(KEYS.reminders, settings)
}
