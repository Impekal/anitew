/**
 * Erzeugt die öffentliche Datenschutz-Seite aus `docs/PRIVACY.md` (N10).
 *
 * Googles Zustimmungsbildschirm verlangt eine **URL** zur
 * Datenschutzerklärung. Die Wahrheit liegt in `docs/PRIVACY.md` — und
 * bleibt dort: Diese Seite wird bei jedem Build daraus erzeugt, damit es
 * nie zwei Fassungen gibt, die auseinanderlaufen (F7). Der Wandler kann
 * genau das Markdown, das PRIVACY.md benutzt — Überschriften, Absätze,
 * Listen, Tabellen, Fett, Code, Links, Zitate — und keinen Deut mehr:
 * Ein Markdown-Paket wäre eine Abhängigkeit für eine einzige Datei.
 *
 * Läuft nach `vite build` und legt `dist/datenschutz.html` ab. Bewusst
 * nicht im Service-Worker-Vorrat: Die Seite ist für Googles Prüfer und
 * neugierige Menschen, nicht für den Offline-Betrieb.
 */

import { readFileSync, writeFileSync } from 'node:fs'

const escape = (text) =>
  text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

/** Fett, Code und Links innerhalb einer Zeile. */
export function inline(text) {
  return escape(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
}

/** Der ganze Text, Block für Block. */
export function render(markdown) {
  const lines = markdown.split('\n')
  const out = []
  let list = false
  let paragraph = []

  const flush = () => {
    if (paragraph.length > 0) {
      out.push(`<p>${inline(paragraph.join(' '))}</p>`)
      paragraph = []
    }
  }
  const closeList = () => {
    if (list) {
      out.push('</ul>')
      list = false
    }
  }

  for (let at = 0; at < lines.length; at++) {
    const line = lines[at]
    const trimmed = line.trim()

    if (trimmed === '' || trimmed === '---') {
      flush()
      closeList()
      continue
    }
    if (trimmed.startsWith('#')) {
      flush()
      closeList()
      const depth = Math.min(3, trimmed.match(/^#+/)[0].length)
      out.push(`<h${depth}>${inline(trimmed.replace(/^#+\s*/, ''))}</h${depth}>`)
      continue
    }
    if (trimmed.startsWith('- ')) {
      flush()
      if (!list) {
        out.push('<ul>')
        list = true
      }
      // Folgezeilen eines Listenpunkts (eingerückt) einsammeln.
      let item = trimmed.slice(2)
      while (at + 1 < lines.length && /^\s{2,}\S/.test(lines[at + 1]) && !lines[at + 1].trim().startsWith('- ')) {
        item += ` ${lines[at + 1].trim()}`
        at++
      }
      out.push(`<li>${inline(item)}</li>`)
      continue
    }
    if (trimmed.startsWith('|')) {
      flush()
      closeList()
      const rows = []
      while (at < lines.length && lines[at].trim().startsWith('|')) {
        const cells = lines[at]
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((cell) => cell.trim())
        if (!/^[-\s|:]+$/.test(cells.join('|'))) rows.push(cells)
        at++
      }
      at--
      const [head, ...body] = rows
      out.push('<table>')
      out.push(`<tr>${head.map((cell) => `<th>${inline(cell)}</th>`).join('')}</tr>`)
      for (const row of body) {
        out.push(`<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join('')}</tr>`)
      }
      out.push('</table>')
      continue
    }
    if (trimmed.startsWith('>')) {
      flush()
      closeList()
      const quote = []
      while (at < lines.length && lines[at].trim().startsWith('>')) {
        quote.push(lines[at].trim().replace(/^>\s?/, ''))
        at++
      }
      at--
      out.push(`<blockquote><p>${inline(quote.join(' '))}</p></blockquote>`)
      continue
    }
    paragraph.push(trimmed)
  }
  flush()
  closeList()
  return out.join('\n')
}

/** Die schlichte Hülle — dieselben Farben wie die App, keine Skripte. */
export function page(body) {
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ANITEW · Datenschutzerklärung</title>
<style>
  body { margin: 0 auto; max-width: 42rem; padding: 2rem 1.2rem 4rem;
    font: 1rem/1.6 system-ui, sans-serif; color: #241f19; background: #f7f3ec; }
  h1, h2, h3 { line-height: 1.3; }
  code { background: #efe8dc; padding: 0.1em 0.3em; border-radius: 4px; }
  table { border-collapse: collapse; width: 100%; font-size: 0.95em; }
  th, td { border: 1px solid #e7ded0; padding: 0.4em 0.6em; text-align: left; vertical-align: top; }
  blockquote { margin: 1em 0; padding: 0.2em 1em; border-left: 3px solid #e7ded0; }
  a { color: inherit; }
  @media (prefers-color-scheme: dark) {
    body { color: #e8e0d3; background: #15120e; }
    code { background: #221c15; }
    th, td { border-color: #3a332a; }
    blockquote { border-color: #3a332a; }
  }
</style>
</head>
<body>
${body}
</body>
</html>
`
}

// Nur beim direkten Aufruf schreiben — die Prüfungen laden nur die Funktionen.
if (process.argv[1]?.endsWith('privacy-page.mjs')) {
  const markdown = readFileSync('docs/PRIVACY.md', 'utf8')
  writeFileSync('dist/datenschutz.html', page(render(markdown)))
  console.log('dist/datenschutz.html geschrieben (aus docs/PRIVACY.md)')
}
