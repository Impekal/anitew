/**
 * Das Größenbudget des Kaltstarts (Backlog P4).
 *
 * Nicht die heutige Größe ist das Problem — 126 KB gzip laden in Sekunden und
 * danach nie wieder (Service Worker). Das Problem ist die **Zukunft**: Eine
 * dicke Abhängigkeit, achtlos hinzugefügt, verdoppelt den Kaltstart, und
 * niemand merkt es, weil auf dem schnellen Buildrechner alles sofort da ist.
 *
 * Dieser Wächter läuft nach `npm run build` und in der CI. Er misst die
 * **gzip-Größe** — das ist, was wirklich über die Leitung geht — und bricht
 * ab, wenn das Budget überschritten wird. Das Budget hat Luft nach oben
 * (heute ~126 KB, Grenze 165 KB), aber nicht so viel, dass eine verdoppelte
 * Abhängigkeit durchrutschte.
 *
 * Wer das Budget bewusst heben will, hebt es **hier** — mit einem Grund im
 * Commit. Genau das ist der Zweck: die Entscheidung sichtbar machen, statt
 * sie schleichend geschehen zu lassen.
 */

import { gzipSync } from 'node:zlib'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

/** Budgets in Kilobyte (gzip). */
const BUDGET_JS = 165
const BUDGET_CSS = 12
const BUDGET_TOTAL = 180

const ASSETS = 'dist/assets'

function gzipKilobytes(file) {
  return gzipSync(readFileSync(join(ASSETS, file))).length / 1024
}

let files
try {
  files = readdirSync(ASSETS)
} catch {
  console.error(`✗ ${ASSETS} fehlt — erst \`npm run build\`.`)
  process.exit(1)
}

const js = files.filter((f) => f.endsWith('.js')).reduce((sum, f) => sum + gzipKilobytes(f), 0)
const css = files.filter((f) => f.endsWith('.css')).reduce((sum, f) => sum + gzipKilobytes(f), 0)
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

if (over) {
  console.error(
    '\n✗ Das Kaltstart-Budget ist überschritten (P4). Entweder die Ursache\n' +
      '  entfernen — oder das Budget in scripts/size-budget.mjs bewusst heben,\n' +
      '  mit einem Grund im Commit.',
  )
  process.exit(1)
}
console.log('\n✓ Kaltstart-Budget eingehalten.')
