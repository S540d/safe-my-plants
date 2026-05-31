import { useCallback, useEffect, useState } from 'react'
import { getAdminPin, getLanguage, getTheme, saveAdminPin, saveLanguage, saveTheme } from '../services/storage'
import { Language } from '../i18n/translations'

type ThemeMode = 'light' | 'dark' | 'system'

interface Preferences {
  language: Language
  theme: ThemeMode
  adminPin: string | null
  isLoaded: boolean
  setLanguage: (lang: Language) => void
  setTheme: (theme: ThemeMode) => void
  setAdminPin: (pin: string) => Promise<void>
  verifyAdminPin: (pin: string) => boolean
}

export function usePreferences(): Preferences {
  const [language, setLanguageState] = useState<Language>('de')
  const [theme, setThemeState] = useState<ThemeMode>('system')
  const [adminPin, setAdminPinState] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [lang, th, pin] = await Promise.all([getLanguage(), getTheme(), getAdminPin()])
      if (lang) setLanguageState(lang)
      if (th) setThemeState(th)
      setAdminPinState(pin)
      setIsLoaded(true)
    }
    load()
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    saveLanguage(lang)
  }, [])

  const setTheme = useCallback((th: ThemeMode) => {
    setThemeState(th)
    saveTheme(th)
  }, [])

  const setAdminPin = useCallback(async (pin: string) => {
    await saveAdminPin(pin)
    setAdminPinState(pin)
  }, [])

  const verifyAdminPin = useCallback(
    (pin: string) => {
      if (!adminPin) return false
      return adminPin === pin
    },
    [adminPin]
  )

  return { language, theme, adminPin, isLoaded, setLanguage, setTheme, setAdminPin, verifyAdminPin }
}
