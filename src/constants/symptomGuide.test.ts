import { SYMPTOM_GUIDE } from './symptomGuide'

describe('SYMPTOM_GUIDE', () => {
  it('has unique symptom ids and unique cause ids per symptom', () => {
    const ids = SYMPTOM_GUIDE.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const symptom of SYMPTOM_GUIDE) {
      const causeIds = symptom.causes.map((c) => c.id)
      expect(new Set(causeIds).size).toBe(causeIds.length)
    }
  })

  it('has at least one cause per symptom', () => {
    for (const symptom of SYMPTOM_GUIDE) expect(symptom.causes.length).toBeGreaterThan(0)
  })

  it('has non-empty German and English text everywhere', () => {
    const texts = SYMPTOM_GUIDE.flatMap((s) => [s.title, ...s.causes.flatMap((c) => [c.title, c.check, c.fix])])
    for (const text of texts) {
      expect(text.de.trim().length).toBeGreaterThan(0)
      expect(text.en.trim().length).toBeGreaterThan(0)
    }
  })
})
