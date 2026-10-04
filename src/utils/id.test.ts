import { generateId } from './id'

describe('generateId', () => {
  it('returns unique ids across calls', () => {
    const a = generateId()
    const b = generateId()
    expect(a).not.toEqual(b)
  })

  it('prefixes the id when a prefix is given', () => {
    expect(generateId('plant')).toMatch(/^plant-\d+-[a-z0-9]+$/)
  })

  it('omits the prefix separator when no prefix is given', () => {
    expect(generateId()).toMatch(/^\d+-[a-z0-9]+$/)
  })
})
