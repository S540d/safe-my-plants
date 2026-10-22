import { PHOTO_CREDITS } from '../constants/photoCredits'
import { PLANT_TEMPLATES } from '../constants/plantTemplates'
import { formatPhotoCredit, getPhotoCredit } from './photoCredit'

describe('getPhotoCredit', () => {
  it('returns undefined for user photos', () => {
    expect(getPhotoCredit('file:///data/photo.jpg')).toBeUndefined()
    expect(getPhotoCredit(undefined)).toBeUndefined()
  })

  it('derives the Commons file page from an upload URL', () => {
    const credit = getPhotoCredit(
      'https://upload.wikimedia.org/wikipedia/commons/a/a1/Mentha_%C3%97_piperita%E2%80%93IMG_6075.jpg'
    )
    expect(credit?.fileName).toBe('Mentha_×_piperita–IMG_6075.jpg')
    expect(credit?.sourceUrl).toBe(
      'https://commons.wikimedia.org/wiki/File:Mentha_%C3%97_piperita%E2%80%93IMG_6075.jpg'
    )
  })

  it('resolves a credit for every template image', () => {
    for (const template of PLANT_TEMPLATES) {
      if (template.imageUrl) expect(getPhotoCredit(template.imageUrl)).toBeDefined()
    }
  })

  it('only contains credit entries for files used by templates', () => {
    const used = new Set(PLANT_TEMPLATES.map((tpl) => getPhotoCredit(tpl.imageUrl)?.fileName))
    for (const fileName of Object.keys(PHOTO_CREDITS)) {
      expect(used).toContain(fileName)
    }
  })
})

describe('formatPhotoCredit', () => {
  const base = { fileName: 'x.jpg', sourceUrl: 'https://commons.wikimedia.org/wiki/File:x.jpg' }

  it('shows author and license when known', () => {
    expect(formatPhotoCredit({ ...base, author: 'Jane Doe', license: 'CC BY-SA 4.0' })).toBe(
      '© Jane Doe · CC BY-SA 4.0'
    )
  })

  it('falls back to the source when metadata is missing', () => {
    expect(formatPhotoCredit(base)).toBe('Wikimedia Commons')
  })
})
