import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

/**
 * Die Sperrliste als Test (Backlog F7, R-2, R5).
 *
 * F7 verlangt, dass Marketing- und Store-Texte an F1–F6 gebunden sind. Die
 * Bindung selbst ist eine Tabelle in `docs/STORE.md` und braucht einen
 * Menschen. **Was keinen Menschen braucht, ist die Untergrenze:** Ein
 * Heilversprechen oder ein „wissenschaftlich bewiesen“ darf gar nicht erst
 * durch die Prüfung kommen, in keiner Sprache und auf keiner Fläche.
 *
 * Geprüft werden genau die Flächen, auf denen ANITEW über sich selbst spricht,
 * *bevor* jemand die App benutzt — dort ist die Versuchung am größten, und
 * dort schaut später niemand mehr hin: die Beschreibung in `index.html`, die
 * im Manifest (die in den Play-Store-Eintrag wandert), die Store-Texte selbst
 * und alle Texte in der App.
 *
 * Warum kein einfaches „verbotene Wörter“: „klüger“ und „smarter“ *stehen* in
 * der App — in dem Satz, dass Gehirnjogging genau das nicht macht. Eine
 * Sperrliste, die den Widerspruch nicht vom Versprechen unterscheidet, würde
 * ausgerechnet die ehrlichste Stelle verbieten. Gesperrt ist deshalb nur, was
 * sich nicht ehrlich verwenden lässt.
 */

const ROOT = fileURLToPath(new URL('../../', import.meta.url))

/** Die Flächen, auf denen ANITEW über sich selbst spricht. */
const SURFACES = [
  'index.html',
  'vite.config.ts',
  'docs/STORE.md',
  'src/i18n/de.ts',
  'src/i18n/en.ts',
]

/**
 * Ausdrücke, die in keinem Text vorkommen dürfen.
 *
 * Drei Sorten: Heilversprechen (R5), Behauptungen über Beweislage, die es
 * nicht gibt, und Zahlen ohne Messung (R-1).
 */
const FORBIDDEN: readonly RegExp[] = [
  /\bDemenz\b/i,
  /\bdementia\b/i,
  /\bAlzheimer\b/i,
  /\bheilt\b|\bHeilung\b/i,
  /\bcures?\b/i,
  /\bTherapie\b|\btherapeutisch/i,
  /\btherapy\b|\btherapeutic\b/i,
  /\bgarantiert\b/i,
  /\bguaranteed\b/i,
  /wissenschaftlich (bewiesen|erwiesen)/i,
  /scientifically proven/i,
  /\bklinisch/i,
  /\bclinically\b/i,
  /doppelt so (viel|gut|schnell)/i,
  /twice as (much|good|fast)/i,
]

function textOf(file: string): string {
  return readFileSync(join(ROOT, file), 'utf8')
}

/**
 * Der Text einer Fläche, ohne die Sperrliste selbst.
 *
 * `docs/STORE.md` **muss** die verbotenen Ausdrücke nennen — sonst wüsste
 * beim Texten niemand, welche gemeint sind. Eine Regel, die sich nicht
 * aussprechen darf, ist keine Regel, sondern eine Falle. Geprüft wird
 * deshalb alles davor: die Texte, die tatsächlich veröffentlicht werden.
 */
function marketingTextOf(file: string): string {
  const text = textOf(file)
  const list = text.indexOf('## Sperrliste')
  return list === -1 ? text : text.slice(0, list)
}

describe('was ANITEW über sich selbst sagt', () => {
  it.each(SURFACES)('hält %s frei von gesperrten Versprechen', (file) => {
    const text = marketingTextOf(file)
    for (const pattern of FORBIDDEN) {
      expect(pattern.test(text), `${file} enthält ${pattern}`).toBe(false)
    }
  })

  it('nennt die Sperrliste auch im Dokument, nicht nur im Test', () => {
    // Sonst steht die Regel an einer Stelle, an der sie beim Texten niemand
    // liest — und ein Test, den man erst beim Fehlschlag entdeckt, ist eine
    // schlechte Anleitung.
    const store = textOf('docs/STORE.md')
    expect(store).toContain('Sperrliste')
    expect(store).toContain('R5')
  })

  it('führt jede Aussage der Store-Texte auf ihre Deckung zurück (F7)', () => {
    const store = textOf('docs/STORE.md')
    for (const reference of ['F2a', 'F2b', 'F3', 'F4', 'science.everyday', 'D-002']) {
      expect(store, `Deckungstabelle ohne ${reference}`).toContain(reference)
    }
  })

  it('sagt auf der ersten Fläche, was die App ist — mit dem Werbespruch', () => {
    /*
     * Die Beschreibung in `index.html` und im Manifest ist das Erste, was ein
     * Mensch sieht, und das Einzige, was eine Suchmaschine sieht. Sie muss
     * denselben Satz tragen wie die App selbst; zwei verschiedene
     * Selbstbeschreibungen sind der Anfang davon, dass eine davon nicht mehr
     * stimmt.
     */
    const tagline = 'Gedächtnis ist Technik, kein Talent.'
    expect(textOf('index.html')).toContain(tagline)
    expect(textOf('vite.config.ts')).toContain(tagline)
    expect(textOf('src/i18n/de.ts')).toContain(tagline)
  })
})
