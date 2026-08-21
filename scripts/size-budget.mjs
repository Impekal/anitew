/**
 * Das Größenbudget des Kaltstarts (Backlog P4).
 *
 * Nicht die heutige Größe ist das Problem — 126 KB gzip laden in Sekunden und
 * danach nie wieder (Service Worker). Das Problem ist die **Zukunft**: Eine
 * dicke Abhängigkeit, achtlos hinzugefügt, verdoppelt den Kaltstart, und
 * niemand merkt es, weil auf dem schnellen Buildrechner alles sofort da ist.
 *
 * Dieser Wächter läuft nach `npm run build` und in der CI. Er misst die
 * **gzip-Größe der Ressourcen, die index.html beim Kaltstart tatsächlich
 * anfordert**: entry scripts, modulepreloads und stylesheets. Lazy chunks
 * zählen bewusst nicht zum Kaltstart; sie werden erst gemessen, wenn der
 * jeweilige Produktpfad sie anfordert. Damit kann z. B. der ausschließlich bei
 * fälliger C10-Optimierung geladene WASI-Optimizer außerhalb des Startbudgets
 * bleiben, ohne das Budget selbst anzuheben.
 *
 * Wer das Budget bewusst heben will, hebt es **hier** — mit einem Grund im
 * Commit. Genau das ist der Zweck: die Entscheidung sichtbar machen, statt
 * sie schleichend geschehen zu lassen.
 */

import { gzipSync } from 'node:zlib'
import { readFileSync } from 'node:fs'
import { basename, join } from 'node:path'

/** Budgets in Kilobyte (gzip). */
const BUDGET_JS = 165
const BUDGET_CSS = 12
const BUDGET_TOTAL = 180

const DIST = 'dist'
const ASSETS = join(DIST, 'assets')

function gzipKilobytes(file) {
  return gzipSync(readFileSync(join(ASSETS, file))).length / 1024
}

let html
try {
  html = readFileSync(join(DIST, 'index.html'), 'utf8')
} catch {
  console.error(`✗ ${DIST}/index.html fehlt — erst \`npm run build\`.`)
  process.exit(1)
}

// Vite schreibt alle beim initialen Laden benötigten Dateien in index.html:
// entry module scripts, statische modulepreloads und Stylesheets. Dynamische
// import()-Chunks erscheinen dort nicht und gehören daher nicht zum Kaltstart.
const initialAssets = new Set()
for (const match of html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)=["']([^"']+)["'][^>]*>/gi)) {
  const href = match[1]
  if (!href?.includes('/assets/')) continue
  const file = basename(href.split(/[?#]/, 1)[0])
  if (file.endsWith('.js') || file.endsWith('.css')) initialAssets.add(file)
}

const jsFiles = [...initialAssets].filter((file) => file.endsWith('.js'))
const cssFiles = [...initialAssets].filter((file) => file.endsWith('.css'))

if (jsFiles.length === 0) {
  console.error('✗ Kein initiales JavaScript in dist/index.html gefunden.')
  process.exit(1)
}

const js = jsFiles.reduce((sum, file) => sum + gzipKilobytes(file), 0)
const css = cssFiles.reduce((sum, file) => sum + gzipKilobytes(file), 0)
const total = js + css

const rows = [
  ['JavaScript', js, BUDGET_JS],
  ['CSS', css, BUDGET_CSS],
  ['zusammen', total, BUDGET_TOTAL],
]

let over = false
for (const [name, size, budget] of rows) {
  const ok = size <= budget
  if (!ok) over = true
  const mark = ok ? '✓' : '✗'
  console.log(`${mark} ${name.padEnd(11)} ${size.toFixed(1).padStart(6)} KB gzip  (Budget ${budget} KB)`)
}

console.log(`  Kaltstart-Dateien: ${[...initialAssets].join(', ')}`)

if (over) {
  console.error(
    '\n✗ Das Kaltstart-Budget ist überschritten (P4). Entweder die Ursache\n' +
      '  entfernen — oder das Budget in scripts/size-budget.mjs bewusst heben,\n' +
      '  mit einem Grund im Commit.',
  )
  process.exit(1)
}
console.log('\n✓ Kaltstart-Budget eingehalten.')
