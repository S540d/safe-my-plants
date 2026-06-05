import { useColorScheme } from 'react-native'
import { Colors } from '../constants/theme'
import { usePreferences } from './usePreferences'

/**
 * Resolves the active color scheme (respecting the user's 'system'/'light'/'dark'
 * preference) and returns the matching Colors object.
 */
export function useThemeColors() {
  const { theme } = usePreferences()
  const systemScheme = useColorScheme() // 'light' | 'dark' | null | undefined

  const resolvedSystem: 'light' | 'dark' = systemScheme === 'dark' ? 'dark' : 'light'
  const scheme: 'light' | 'dark' = theme === 'system' ? resolvedSystem : theme

  return Colors[scheme]
}
