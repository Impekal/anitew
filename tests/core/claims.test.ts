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

  it('setzt Hervorhebungen paarweise', () => {
    /*
     * Zwei Sterne machen fett (`app/Emphasis.tsx`). Ein einzelner Stern bleibt
     * als Stern stehen und sieht aus wie ein Tippfehler — genau das stand
     * schon einmal auf dem Bildschirm, in zwei Texten, die niemand mehr
     * gelesen hat.
     */
    for (const file of ['src/i18n/de.ts', 'src/i18n/en.ts']) {
      const text = textOf(file)
      for (const line of text.split('\n')) {
        // Kommentare bleiben draußen — `/**` ist ein Kommentaranfang und
        // keine halbe Hervorhebung.
        const start = line.trimStart()
        if (start.startsWith('*') || start.startsWith('//') || start.startsWith('/*')) continue
        if (!line.includes("'")) continue
        const stars = line.split('**').length - 1
        expect(stars % 2, `ungerade Hervorhebung: ${line.trim()}`).toBe(0)
      }
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

describe('die Datenschutzerklärung (R4)', () => {
  it('sagt, was gespeichert wird — und was nicht passiert', () => {
    const privacy = textOf('docs/PRIVACY.md')
    for (const promise of [
      'kein Konto',
      'keine Werbung',
      'keine Tracker',
      'IndexedDB',
      'Sicherung',
    ]) {
      expect(privacy.toLowerCase(), `ohne „${promise}“`).toContain(promise.toLowerCase())
    }
  })

  it('verschweigt das Unbequeme nicht', () => {
    /*
     * Zwei Stellen, an denen eine Datenschutzerklärung üblicherweise
     * schweigt: dass beim Ausliefern der App Serverdaten anfallen, und was
     * sich ändern würde, wenn geplante Funktionen kommen. Beides steht drin
     * — und ein Test hält es fest, damit es beim nächsten Umschreiben nicht
     * herausfällt.
     */
    const privacy = textOf('docs/PRIVACY.md')
    expect(privacy).toContain('IP-Adresse')
    expect(privacy).toContain('Klartext')
    /*
     * Seit D-031/D-033 sind die zwei Übertragungen keine Pläne mehr,
     * sondern Wirklichkeit — die Erklärung muss beide benennen, samt
     * Empfänger und der Zusage, dass nichts davon Voreinstellung ist.
     */
    expect(privacy).toMatch(/Drive-Abgleich/)
    // Alle wählbaren Coach-Anbieter (D-034) müssen benannt sein — wer
    // einen ergänzt, ergänzt ihn auch hier.
    for (const provider of ['Gemini', 'Anthropic', 'Groq', 'OpenRouter', 'Mistral']) {
      expect(privacy, `ohne ${provider}`).toContain(provider)
    }
    expect(privacy).toMatch(/aus,\s*bis du sie anfasst/)
  })

  it('hält auch hier die Sperrliste ein (R5)', () => {
    // Dieselbe Prüfung wie für die Marketingflächen: Ein Heilversprechen in
    // einer Datenschutzerklärung wäre besonders absurd — und genau deshalb
    // fällt es dort niemandem auf.
    const privacy = textOf('docs/PRIVACY.md')
    for (const pattern of FORBIDDEN) {
      expect(pattern.test(privacy), `PRIVACY.md enthält ${pattern}`).toBe(false)
    }
  })
})

describe('die Installationsanleitung (Q5)', () => {
  it('nennt den Grund vor dem Weg', () => {
    /*
     * Ein „Installiere die App!“ ohne Grund wäre die Aufforderung, die K7
     * ausschließt. Der Grund ist eine Tatsache über iOS und keine Werbung —
     * und er steht in der Anleitung vor den Schritten.
     */
    const install = textOf('docs/INSTALL.md')
    const reason = install.indexOf('sieben Tagen')
    const steps = install.indexOf('Zum Home-Bildschirm')
    expect(reason).toBeGreaterThan(-1)
    expect(steps).toBeGreaterThan(reason)
  })

  it('nennt die Sicherung als den zweiten Weg', () => {
    // Wer nicht installieren will, soll nicht ohne Ausweg dastehen.
    expect(textOf('docs/INSTALL.md')).toMatch(/Sicherung ist der zweite Weg/)
  })

  it('verspricht durch die Installation nichts, was sie nicht tut', () => {
    const install = textOf('docs/INSTALL.md')
    expect(install).toMatch(/Sie legt kein Konto an/)
    expect(install).toMatch(/Es gibt keinen Server/)
    for (const pattern of FORBIDDEN) {
      expect(pattern.test(install), `INSTALL.md enthält ${pattern}`).toBe(false)
    }
  })
})
