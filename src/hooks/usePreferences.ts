import { getLocales } from 'expo-localization'
import { useCallback, useEffect, useState } from 'react'
import { clearLegacyAdminPin, getLanguage, getTheme, saveLanguage, saveTheme } from '../services/storage'
import { Language } from '../i18n/translations'

type ThemeMode = 'light' | 'dark' | 'system'

interface Preferences {
  language: Language
  theme: ThemeMode
  isLoaded: boolean
  setLanguage: (lang: Language) => void
  setTheme: (theme: ThemeMode) => void
}

function getDeviceLanguage(): Language {
  const locale = getLocales()[0]?.languageCode ?? 'de'
  return locale === 'en' ? 'en' : 'de'
}

// Module-level subscribers so every usePreferences instance stays in sync
// when language/theme changes in one screen (e.g. settings).
type PreferenceListener = (lang: Language, th: ThemeMode) => void
const listeners = new Set<PreferenceListener>()
let sharedLanguage: Language | null = null
let sharedTheme: ThemeMode | null = null

function notifyPreferenceListeners() {
  if (sharedLanguage === null || sharedTheme === null) return
  listeners.forEach((fn) => fn(sharedLanguage as Language, sharedTheme as ThemeMode))
}

export function usePreferences(): Preferences {
  const [language, setLanguageState] = useState<Language>(sharedLanguage ?? getDeviceLanguage())
  const [theme, setThemeState] = useState<ThemeMode>(sharedTheme ?? 'system')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const listener: PreferenceListener = (lang, th) => {
      setLanguageState(lang)
      setThemeState(th)
    }
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  useEffect(() => {
    const load = async () => {
      if (sharedLanguage === null || sharedTheme === null) {
        const [lang, th] = await Promise.all([getLanguage(), getTheme()])
        sharedLanguage = lang ?? getDeviceLanguage()
        sharedTheme = th ?? 'system'
      }
      setLanguageState(sharedLanguage)
      setThemeState(sharedTheme)
      clearLegacyAdminPin()
      setIsLoaded(true)
    }
    load()
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    sharedLanguage = lang
    setLanguageState(lang)
    saveLanguage(lang)
    notifyPreferenceListeners()
  }, [])

  const setTheme = useCallback((th: ThemeMode) => {
    sharedTheme = th
    setThemeState(th)
    saveTheme(th)
    notifyPreferenceListeners()
  }, [])

  return { language, theme, isLoaded, setLanguage, setTheme }
}
