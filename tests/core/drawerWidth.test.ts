import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

/**
 * Der Core wird nicht in Viewport-Einheiten breit gemacht (Gerätemeldung 29.08.).
 *
 * Gemeldet war: Auf dem iPhone erscheint der Core seitlich verschoben — linke
 * Spalte abgeschnitten, „Menü schließen" halb aus dem Bild nach rechts. In
 * Chromium war bei 393 x 852 nichts davon zu sehen, und deshalb hat es kein
 * Browsertest gefunden.
 *
 * Die Ursache liegt in der Einheit. `100vw` ist die Breite des
 * **Layout**-Viewports, nicht des sichtbaren Bereichs. Steht irgendwo auf der
 * Seite etwas seitlich über, verbreitert WebKit den Layout-Viewport — und dann
 * wächst `100vw` mit. Die Schublade wird breiter als das, was man sieht, ihr
 * mittig sitzender Schließ-Knopf rutscht nach rechts, und die Seite lässt sich
 * seitwärts schieben.
 *
 * `100%` kann den Elternknoten nie überschreiten. Der Schleier ist ohnehin
 * `position: fixed` mit `inset: 0` und füllt den Viewport; `100vw` fügt dem
 * nichts hinzu außer der Gefahr.
 *
 * Warum das hier steht und nicht als Browsertest: Das Verhalten gehört WebKit.
 * In Chromium lässt es sich nicht erzeugen — ein Test, der es nachstellen
 * wollte, wäre grün und wertlos. Geprüft wird deshalb die **Ursache** an der
 * Quelle: Wer Schleier oder Schublade wieder in Viewport-Einheiten misst,
 * bekommt hier sofort eine rote Meldung mit Datei und Zeile.
 *
 * Es ist dieselbe Falle, die PR #93 an `nav.drawer` geschlossen hatte
 * (`max-width: 100%` im Kaltstart-Blatt) und die ein verzögert geladenes Blatt
 * mit `!important` wieder aufriss.
 */
const CSS_ORDNER = new URL('../../src/', import.meta.url).pathname

function cssDateien(ordner: string): string[] {
  const gefunden: string[] = []
  for (const eintrag of readdirSync(ordner, { withFileTypes: true })) {
    const pfad = join(ordner, eintrag.name)
    if (eintrag.isDirectory()) gefunden.push(...cssDateien(pfad))
    else if (eintrag.name.endsWith('.css')) gefunden.push(pfad)
  }
  return gefunden
}

/** Zeilen, die eine Breite in Viewport-Einheiten auf Schleier oder Schublade legen. */
function verstoesse(): string[] {
  const treffer: string[] = []
  for (const datei of cssDateien(CSS_ORDNER)) {
    const text = readFileSync(datei, 'utf8')
    const zeilen = text.split('\n')
    let selektor = ''
    zeilen.forEach((zeile, index) => {
      const roh = zeile.trim()
      if (roh.includes('{')) selektor = roh.slice(0, roh.indexOf('{')).trim() || selektor
      if (roh.startsWith('/*') || roh.startsWith('*')) return
      /*
       * Gesucht ist **volle** Viewport-Breite, nicht jede Viewport-Einheit.
       * `min(20rem, 86vw)` an der alten Ausklapp-Schublade ist ein anderer
       * Fall: Es misst absichtlich weniger als den Viewport und wird auf dem
       * Telefon ohnehin überschrieben. Der Fehler entsteht erst dort, wo die
       * Schublade **so breit wie der Viewport** gemacht wird — dann trägt sie
       * jede Verbreiterung des Layout-Viewports voll mit.
       */
      const breite = /^(?:min-|max-)?width\s*:\s*[^;]*\b100(?:vw|dvw|svw|lvw)\b/.test(roh)
      if (!breite) return
      /*
       * Nur die Kästen selbst, nicht ihre Schmuck-Pseudoelemente: Ein
       * `.drawer-veil::before` mit `80vw` liegt innerhalb eines Schleiers mit
       * `overflow-x: hidden` und kann nichts verschieben.
       */
      const istKasten = /(^|[\s>,])\.drawer-veil(\s|,|$|>)|(^|[\s>,])\.drawer(\s|,|$|>)|^nav\.drawer/.test(
        selektor,
      )
      const betrifft = istKasten && !selektor.includes('::')
      if (betrifft) {
        treffer.push(`${datei.replace(CSS_ORDNER, '')}:${index + 1}  ${selektor} { ${roh} }`)
      }
    })
  }
  return treffer
}

describe('Schleier und Schublade werden nicht in Viewport-Einheiten breit', () => {
  it('misst ihre Breite relativ zum Elternknoten, nicht am Layout-Viewport', () => {
    const gefunden = verstoesse()
    expect(gefunden, `Breite in Viewport-Einheiten:\n  ${gefunden.join('\n  ')}`).toEqual([])
  })
})
