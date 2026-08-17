/**
 * Ein Bogen voller Gesichter — Werkzeug, kein Teil der App.
 *
 * Gesichter lassen sich nicht durch Lesen prüfen. Ob ein Bart über dem Mund
 * liegt, ob eine Frisur die Brauen verschluckt, ob sich acht Gesichter
 * wirklich unterscheiden: Das sieht man erst, wenn man viele nebeneinander
 * legt. Einzelne Bildschirmfotos aus der laufenden App zeigen jeweils ein
 * Gesicht und kosten jedes Mal eine Minute — bei sieben Frisuren, drei Nasen
 * und vier Mündern findet man so einen Fehler erst, wenn ein Nutzer ihn
 * meldet.
 *
 * Deshalb rendert dieses Skript `app/Face.tsx` ohne Browser nach SVG und legt
 * die Gesichter in ein Raster. Es benutzt esbuild (kommt mit Vite) nur zum
 * Übersetzen von TSX und react-dom/server zum Zeichnen — keine zusätzliche
 * Abhängigkeit, kein Teil des Auslieferungspakets.
 *
 *   node scripts/facesheet.mjs [ziel.html] [anzahl]
 */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { build } from 'esbuild'

const root = fileURLToPath(new URL('..', import.meta.url))
const target = process.argv[2] ?? join(root, 'facesheet.html')
const count = Number(process.argv[3] ?? 48)

/*
 * Der Umweg über eine zusammengebaute Datei ist Absicht: Ein Modul aus einem
 * Bündel lässt sich in Node importieren, ein TSX-Modul nicht. Externe
 * Abhängigkeiten bleiben extern — react und react-dom kommen aus
 * node_modules, sie müssen nicht mitgebündelt werden.
 *
 * Sie liegt **im Projekt** und nicht unter /tmp: Node löst `react` von dort
 * aus auf, wo die importierende Datei liegt. Außerhalb des Projekts findet es
 * node_modules nicht.
 */
const work = mkdtempSync(join(root, 'node_modules/.facesheet-'))
const bundle = join(work, 'faces.mjs')

await build({
  stdin: {
    contents: `
      export { Face } from ${JSON.stringify(join(root, 'src/app/Face.tsx'))}
      export { faceFor, namePool } from ${JSON.stringify(join(root, 'src/core/index.ts'))}
    `,
    resolveDir: root,
    loader: 'ts',
  },
  bundle: true,
  format: 'esm',
  jsx: 'automatic',
  platform: 'node',
  external: ['react', 'react-dom', 'react/*', 'react-dom/*'],
  outfile: bundle,
  logLevel: 'warning',
})

const { Face, faceFor, namePool } = await import(bundle)
const { renderToStaticMarkup } = await import('react-dom/server')
const { createElement } = await import('react')

/*
 * `--nur=merkmal` zeigt nur Gesichter mit einer bestimmten Eigenschaft.
 * Seltene Merkmale — der Vollbart trifft rund jedes siebte Gesicht — sind auf
 * einem gemischten Bogen sonst kaum zu beurteilen: Man sieht drei Stück und
 * hält für Zufall, was in Wahrheit die Form ist.
 */
const filters = {
  bart: (face) => face.beard === 2,
  schnurrbart: (face) => face.beard === 1,
  brille: (face) => face.glasses,
}
const wanted = process.argv.find((arg) => arg.startsWith('--nur='))?.slice(6)
if (wanted !== undefined && filters[wanted] === undefined) {
  throw new Error(`--nur= kennt nur: ${Object.keys(filters).join(', ')}`)
}

const names = namePool('de')
  .filter((name) => wanted === undefined || filters[wanted](faceFor(name)))
  .slice(0, count)
const cells = names
  .map(
    (name) =>
      `<figure><div class="frame">${renderToStaticMarkup(
        createElement(Face, { name, size: 132 }),
      )}</div><figcaption>${name}</figcaption></figure>`,
  )
  .join('\n')

/*
 * Zwei Hintergründe, hell und dunkel, weil ein Gesicht auf Papier anders
 * wirkt als auf Nacht — genau der Fehler, der beim Schein schon einmal erst
 * auf dem Telefon aufgefallen ist.
 */
writeFileSync(
  target,
  `<!doctype html>
<meta charset="utf-8">
<title>ANITEW — Gesichter</title>
<style>
  body { margin: 0; font: 15px/1.4 system-ui, sans-serif; }
  section { padding: 24px; }
  .light { background: #f7f3ec; color: #2b2620; }
  .dark  { background: #14120f; color: #e8e2d8; }
  .grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 18px 10px; }
  figure { margin: 0; text-align: center; }
  .frame { display: flex; justify-content: center; }
  figcaption { margin-top: 4px; opacity: 0.75; font-size: 13px; }
  svg { width: 108px; height: auto; }
</style>
<section class="light"><div class="grid">${cells}</div></section>
<section class="dark"><div class="grid">${cells}</div></section>
`,
)

rmSync(work, { recursive: true, force: true })
console.log(`${names.length} Gesichter → ${target}`)

/*
 * Mit `--png` fallen zwei Bilder ab, hell und dunkel. Das ist die Form, in
 * der sich der Bogen tatsächlich beurteilen lässt — eine HTML-Datei muss man
 * öffnen, ein Bild sieht man.
 */
if (process.argv.includes('--png')) {
  const { chromium } = await import('@playwright/test')
  // Dieselbe Variable wie in playwright.config.ts: ein bereits vorhandenes
  // Chromium, statt ein zweites herunterzuladen. Ohne sie nimmt Playwright
  // wie üblich seinen eigenen.
  const executablePath = process.env.ANITEW_CHROMIUM
  const browser = await chromium.launch(executablePath !== undefined ? { executablePath } : {})
  const page = await browser.newPage({
    viewport: { width: 1180, height: 900 },
    deviceScaleFactor: 2,
  })
  await page.goto(`file://${target}`)
  for (const theme of ['light', 'dark']) {
    await page
      .locator(`section.${theme}`)
      .screenshot({ path: target.replace(/\.html$/, `-${theme}.png`) })
  }
  await browser.close()
  console.log(`Bilder → ${target.replace(/\.html$/, '-{light,dark}.png')}`)
}
