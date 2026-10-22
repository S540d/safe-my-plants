// Holt Urheber und Lizenz der Template-Bilder von der Wikimedia-Commons-API und
// schreibt src/constants/photoCredits.ts neu. Aufruf: `node scripts/fetch-photo-credits.js`
// (Node >= 18, Netzwerkzugriff auf commons.wikimedia.org nötig).
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const TEMPLATES = path.join(ROOT, 'src', 'constants', 'plantTemplates.ts')
const OUT_FILE = path.join(ROOT, 'src', 'constants', 'photoCredits.ts')
const API = 'https://commons.wikimedia.org/w/api.php'

function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

async function main() {
  const source = fs.readFileSync(TEMPLATES, 'utf8')
  const urls = source.match(/https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/[^'"\s]+/g) ?? []
  const fileNames = [...new Set(urls.map((u) => decodeURIComponent(u.split('/').pop())))]

  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    prop: 'imageinfo',
    iiprop: 'extmetadata',
    iiextmetadatafilter: 'Artist|LicenseShortName',
    titles: fileNames.map((f) => `File:${f}`).join('|'),
  })
  const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': 'safe-my-plants-credits/1.0' } })
  if (!res.ok) throw new Error(`Commons-API: HTTP ${res.status}`)
  const data = await res.json()

  const credits = {}
  const missing = []
  for (const page of data.query.pages) {
    const fileName = page.title.replace(/^File:/, '').replace(/ /g, '_')
    const meta = page.imageinfo?.[0]?.extmetadata
    const author = meta?.Artist?.value ? stripHtml(meta.Artist.value) : ''
    const license = meta?.LicenseShortName?.value ? stripHtml(meta.LicenseShortName.value) : ''
    if (author && license) credits[fileName] = { author, license }
    else missing.push(fileName)
  }

  const entries = Object.keys(credits)
    .sort()
    .map(
      (f) =>
        `  ${JSON.stringify(f)}: { author: ${JSON.stringify(credits[f].author)}, license: ${JSON.stringify(credits[f].license)} },`
    )
    .join('\n')

  const header = fs.readFileSync(OUT_FILE, 'utf8').split('export const PHOTO_CREDITS')[0]
  fs.writeFileSync(
    OUT_FILE,
    `${header}export const PHOTO_CREDITS: Record<string, PhotoCreditData> = {\n${entries}\n}\n`
  )

  console.log(`${Object.keys(credits).length} Nachweise geschrieben.`)
  if (missing.length) console.warn(`Ohne vollständige Angaben (bitte manuell prüfen):\n  ${missing.join('\n  ')}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
