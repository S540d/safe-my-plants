import { PHOTO_CREDITS } from '../constants/photoCredits'

const COMMONS_UPLOAD_PREFIX = 'https://upload.wikimedia.org/wikipedia/commons/'

export interface PhotoCredit {
  /** Dekodierter Dateiname auf Commons, z. B. „Monstera_deliciosa3.jpg". */
  fileName: string
  /** Dateiseite auf Commons mit vollständigen Urheber- und Lizenzangaben. */
  sourceUrl: string
  author?: string
  license?: string
}

/**
 * Liefert den Bildnachweis für ein Wikimedia-Commons-Foto, sonst `undefined`
 * (eigene Fotos der Nutzer brauchen keinen Nachweis).
 */
export function getPhotoCredit(uri: string | undefined): PhotoCredit | undefined {
  if (!uri?.startsWith(COMMONS_UPLOAD_PREFIX)) return undefined
  const encoded = uri.split('/').pop()
  if (!encoded) return undefined

  let fileName: string
  try {
    fileName = decodeURIComponent(encoded)
  } catch {
    fileName = encoded
  }

  const data = PHOTO_CREDITS[fileName]
  return {
    fileName,
    sourceUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName)}`,
    author: data?.author,
    license: data?.license,
  }
}

/** Kurzform für die Bildzeile, z. B. „© Jane Doe · CC BY-SA 4.0" oder „Wikimedia Commons". */
export function formatPhotoCredit(credit: PhotoCredit): string {
  if (credit.author && credit.license) return `© ${credit.author} · ${credit.license}`
  if (credit.license) return `Wikimedia Commons · ${credit.license}`
  return 'Wikimedia Commons'
}
