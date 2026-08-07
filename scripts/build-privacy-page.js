const fs = require('fs')
const path = require('path')

const SRC = path.join(__dirname, '..', 'PRIVACY_POLICY.md')
const OUT_DIR = path.join(__dirname, '..', 'dist')
const OUT_FILE = path.join(OUT_DIR, 'privacy.html')

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function inline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
}

function markdownToHtml(markdown) {
  const lines = markdown.split('\n')
  const html = []
  let inList = false

  const closeList = () => {
    if (inList) {
      html.push('</ul>')
      inList = false
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()

    if (line.trim() === '---') {
      closeList()
      html.push('<hr>')
      continue
    }
    if (line.trim() === '') {
      closeList()
      continue
    }
    const heading = line.match(/^(#{1,3})\s+(.*)$/)
    if (heading) {
      closeList()
      const level = heading[1].length
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`)
      continue
    }
    const bullet = line.match(/^-\s+(.*)$/)
    if (bullet) {
      if (!inList) {
        html.push('<ul>')
        inList = true
      }
      html.push(`<li>${inline(bullet[1])}</li>`)
      continue
    }
    closeList()
    html.push(`<p>${inline(line)}</p>`)
  }
  closeList()
  return html.join('\n')
}

const markdown = fs.readFileSync(SRC, 'utf8')
const body = markdownToHtml(markdown)

const page = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Privacy Policy / Datenschutzerklärung – Safe My Plants</title>
<style>
  :root { color-scheme: light dark; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    max-width: 720px;
    margin: 0 auto;
    padding: 2rem 1.25rem 4rem;
    line-height: 1.6;
    color: #1b1b1b;
    background: #fff;
  }
  @media (prefers-color-scheme: dark) {
    body { color: #eaeaea; background: #121212; }
    a { color: #7fd1a8; }
    hr { border-color: #333; }
  }
  h1 { font-size: 1.6rem; margin-top: 2rem; }
  h2 { font-size: 1.2rem; margin-top: 1.75rem; }
  hr { margin: 2rem 0; border: none; border-top: 1px solid #ddd; }
  ul { padding-left: 1.25rem; }
</style>
</head>
<body>
${body}
</body>
</html>
`

fs.mkdirSync(OUT_DIR, { recursive: true })
fs.writeFileSync(OUT_FILE, page)
console.log(`Wrote ${OUT_FILE}`)
