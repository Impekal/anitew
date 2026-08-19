/**
 * Baut das Review-Paket für eine externe Durchsicht (z. B. ChatGPT).
 *
 * Drei Textdateien, je eine Sorte Wahrheit:
 *
 * - `anitew-quelltext.txt`  — alles unter src/, mit Dateimarken
 * - `anitew-pruefungen.txt` — alles unter tests/, mit Dateimarken
 * - `anitew-doku.txt`       — Entscheidungsregister, Backlog, Protokoll,
 *                             Offen-Liste, Datenschutz, README
 *
 * Der Überblick (`REVIEW-UEBERBLICK.md`) wird von Hand geschrieben — er
 * ist eine Aussage, kein Abzug. Aufruf:
 *
 *     node scripts/review-packet.mjs <zielordner>
 *
 * Die Bündel werden bewusst **nicht** eingecheckt: Sie sind ein Abzug des
 * Repos, und ein eingecheckter Abzug wäre am Tag danach eine zweite,
 * veraltete Wahrheit.
 */

import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const target = process.argv[2]
if (target === undefined) {
  console.error('Aufruf: node scripts/review-packet.mjs <zielordner>')
  process.exit(1)
}
mkdirSync(target, { recursive: true })

function* walk(dir) {
  for (const name of readdirSync(dir).sort()) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) yield* walk(path)
    else yield path
  }
}

const mark = (path) => `\n\n${'═'.repeat(66)}\n═══ DATEI: ${path}\n${'═'.repeat(66)}\n\n`

function bundle(paths) {
  return paths.map((path) => mark(path) + readFileSync(path, 'utf8')).join('')
}

const source = [...walk('src')].filter((p) => /\.(ts|tsx|css)$/.test(p))
const tests = [...walk('tests')].filter((p) => p.endsWith('.ts'))
const docs = [
  'README.md',
  'docs/DECISIONS.md',
  'docs/BACKLOG.md',
  'docs/OFFEN.md',
  'docs/PRIVACY.md',
  'PROJECT_STATE.md',
]

writeFileSync(join(target, 'anitew-quelltext.txt'), bundle(source))
writeFileSync(join(target, 'anitew-pruefungen.txt'), bundle(tests))
writeFileSync(join(target, 'anitew-doku.txt'), bundle(docs))
console.log(
  `${source.length} Quelldateien, ${tests.length} Prüfdateien, ${docs.length} Doku-Dateien → ${target}`,
)
