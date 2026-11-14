import { Language } from './translations'

/**
 * Wählt die App-Sprache aus dem Sprachcode des Geräts (z. B. aus
 * expo-localization `getLocales()[0].languageCode`).
 *
 * Deutsch nur bei deutscher Gerätesprache (deckt auch AT/CH ab), sonst Englisch.
 * Englisch ist der Fallback, weil die App außerhalb des deutschen Sprachraums
 * sonst unbenutzbar ist (Issue #208: Tester mit französischem Gerät bekam Deutsch).
 * Ohne erkennbaren Sprachcode bleibt es bei Deutsch (Hauptzielgruppe).
 */
export function languageFromLocaleCode(code: string | null | undefined): Language {
  if (!code) return 'de'
  return code.toLowerCase().startsWith('de') ? 'de' : 'en'
}
