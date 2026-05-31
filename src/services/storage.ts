import AsyncStorage from '@react-native-async-storage/async-storage'
import { Plant } from '../types/plant'

const KEYS = {
  plants: 'smp-plants',
  adminPinSet: 'smp-admin-pin',
  language: 'smp-language',
  theme: 'smp-theme',
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
