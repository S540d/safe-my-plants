/**
 * Urheber- und Lizenzangaben der Wikimedia-Commons-Templatebilder, Schlüssel = Dateiname
 * (wie in der Upload-URL, URL-dekodiert).
 *
 * GENERIERT durch `node scripts/fetch-photo-credits.js` (Commons-API, `extmetadata`).
 * Nicht von Hand raten – fehlt ein Eintrag, zeigt die App nur „Wikimedia Commons" plus Link
 * auf die Dateiseite, auf der Urheber und Lizenz vollständig stehen.
 */
export interface PhotoCreditData {
  author: string
  license: string
}

export const PHOTO_CREDITS: Record<string, PhotoCreditData> = {}
