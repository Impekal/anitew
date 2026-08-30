/**
 * Erzeugt die öffentlichen Rechtstexte aus Markdown.
 *
 * Die Wahrheit bleibt in `docs/PRIVACY.md` und `docs/IMPRESSUM.md`; der Build
 * erzeugt daraus zwei statische, skriptfreie Seiten. So laufen App, OAuth-
 * Prüfung und öffentlich erreichbare Rechtstexte nicht auseinander.
 */

import { readFileSync, writeFileSync } from 'node:fs'

const escape = (text) =>
  text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

export function inline(text) {
  return escape(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
}

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
      let item = trimmed.slice(2)
      while (
        at + 1 < lines.length &&
        /^\s{2,}\S/.test(lines[at + 1]) &&
        !lines[at + 1].trim().startsWith('- ')
      ) {
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

export function page(body, title = 'Datenschutzerklärung') {
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ANITEW · ${escape(title)}</title>
<style>
  body { margin: 0 auto; max-width: 42rem; padding: 2rem 1.2rem 4rem;
    font: 1rem/1.6 system-ui, sans-serif; color: #241f19; background: #f7f3ec; }
  h1, h2, h3 { line-height: 1.3; }
  code { background: #efe8dc; padding: 0.1em 0.3em; border-radius: 4px; }
  table { border-collapse: collapse; width: 100%; font-size: 0.95em; }
  th, td { border: 1px solid #e7ded0; padding: 0.4em 0.6em; text-align: left; vertical-align: top; }
  blockquote { margin: 1em 0; padding: 0.2em 1em; border-left: 3px solid #e7ded0; }
  a { color: inherit; }
  .legal-nav { display:flex; flex-wrap:wrap; gap:.7rem; margin:0 0 2rem; font-size:.9rem; }
  .legal-nav-bottom { margin:2.5rem 0 0; padding-top:1rem; border-top:1px solid #e7ded0; }
  @media (prefers-color-scheme: dark) {
    body { color: #e8e0d3; background: #15120e; }
    code { background: #221c15; }
    th, td { border-color: #3a332a; }
    blockquote, .legal-nav-bottom { border-color: #3a332a; }
  }
</style>
</head>
<body>
<nav class="legal-nav" aria-label="Rechtliches">
  <a href="/">ANITEW</a>
  <a href="/impressum.html">Impressum</a>
  <a href="/datenschutz.html">Datenschutz</a>
</nav>
${body}
<nav class="legal-nav legal-nav-bottom" aria-label="Rechtliches">
  <a href="/">ANITEW</a>
  <a href="/impressum.html">Impressum</a>
  <a href="/datenschutz.html">Datenschutz</a>
</nav>
</body>
</html>
`
}

if (process.argv[1]?.endsWith('privacy-page.mjs')) {
  /*
   * Ziel ist `public/`, nicht `dist/` — und das ist der Unterschied zwischen
   * einer Behauptung und einer Tatsache.
   *
   * Vorher lief dieses Skript **nach** `vite build` und schrieb direkt nach
   * `dist/`. Der Workbox-Precache wird aber während des Builds aus dem
   * damaligen Stand von `dist/` erzeugt. Die beiden Rechtstexte kamen also
   * immer zu spät und standen nie im Precache — während der Kommentar in
   * `vite.config.ts` genau das behauptete. Nachgemessen im erzeugten
   * `dist/sw.js`: kein einziger Treffer auf „impressum" oder „datenschutz".
   *
   * Aus `public/` kopiert Vite sie in `dist/`, bevor der Precache entsteht.
   * Damit sind sie wirklich offline verfügbar. Beide Dateien sind erzeugt und
   * stehen deshalb in `.gitignore`.
   */
  const pages = [
    ['docs/PRIVACY.md', 'public/datenschutz.html', 'Datenschutzerklärung'],
    ['docs/IMPRESSUM.md', 'public/impressum.html', 'Impressum'],
  ]
  for (const [source, target, title] of pages) {
    const markdown = readFileSync(source, 'utf8')
    writeFileSync(target, page(render(markdown), title))
    console.log(`${target} geschrieben (aus ${source})`)
  }
}
