import { languageFromLocaleCode } from './deviceLanguage'

describe('languageFromLocaleCode', () => {
  it('wählt Deutsch für deutsche Gerätesprache', () => {
    expect(languageFromLocaleCode('de')).toBe('de')
    expect(languageFromLocaleCode('DE')).toBe('de')
  })

  it('wählt Englisch für englische Gerätesprache', () => {
    expect(languageFromLocaleCode('en')).toBe('en')
  })

  it('fällt bei anderen Sprachen auf Englisch zurück (#208)', () => {
    for (const code of ['fr', 'es', 'it', 'nl', 'pl', 'tr', 'ja']) {
      expect(languageFromLocaleCode(code)).toBe('en')
    }
  })

  it('bleibt ohne erkennbaren Sprachcode bei Deutsch', () => {
    expect(languageFromLocaleCode(undefined)).toBe('de')
    expect(languageFromLocaleCode(null)).toBe('de')
    expect(languageFromLocaleCode('')).toBe('de')
  })
})
