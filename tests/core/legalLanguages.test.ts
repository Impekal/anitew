import { existsSync, readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { TRANSLATED_LANGUAGES } from '../../src/i18n/index.ts'

/**
 * Die Rechtstexte sprechen dieselben Sprachen wie die App (Gerätebefund 01.09.).
 *
 * Gemeldet: „Impressum und Datenschutz: auch bereits übersetzt? Text wird nur
 * in Deutsch angezeigt.“ Nein — die Kurzfassung **in** der App liegt in allen
 * sechs Sprachen, die beiden öffentlichen Seiten dagegen nur auf Deutsch, mit
 * fest eingetragenem `lang="de"`.
 *
 * ── Was hier geprüft wird und was nicht ───────────────────────────────────
 *
 * Geprüft wird **Vollständigkeit und Struktur**: Jede App-Sprache hat beide
 * Texte, jede Übersetzung hat dieselben Abschnitte wie das deutsche Original,
 * und jede sagt ausdrücklich, dass die deutsche Fassung die verbindliche ist.
 *
 * **Nicht** geprüft wird, ob die Übersetzung juristisch trägt. Das kann kein
 * Test, und es wäre die schlimmste Stelle, um so zu tun als ob: Eine
 * Datenschutzerklärung ist eine Zusage, kein Oberflächentext. Die Durchsicht
 * steht als USER ACTION in `docs/BACKLOG.md`.
 *
 * Die Struktur mitzuprüfen ist kein Selbstzweck: Fehlt in einer Übersetzung
 * ein Abschnitt, fehlt dort eine Auskunft, die die deutsche Fassung gibt —
 * und das fiele sonst niemandem auf.
 */

const QUELLEN = [
  { art: 'IMPRESSUM', deutsch: 'docs/IMPRESSUM.md' },
  { art: 'PRIVACY', deutsch: 'docs/PRIVACY.md' },
] as const

/** Die Überschriften einer Markdown-Datei, nur ihre Tiefe — nicht ihr Text. */
function gliederung(pfad: string): string[] {
  return readFileSync(pfad, 'utf8')
    .split('\n')
    .filter((zeile) => /^#{1,3}\s/u.test(zeile))
    .map((zeile) => (zeile.match(/^#+/u) ?? [''])[0])
}

describe('Impressum und Datenschutz in allen App-Sprachen', () => {
  for (const { art, deutsch } of QUELLEN) {
    const andere = TRANSLATED_LANGUAGES.filter((tag) => tag !== 'de')

    it(`${art}: jede App-Sprache hat einen eigenen Text`, () => {
      const fehlend = andere.filter((tag) => !existsSync(`docs/legal/${art}.${tag}.md`))
      expect(fehlend.join(', '), 'ohne eigenen Text').toBe('')
    })

    it(`${art}: jede Übersetzung hat dieselben Abschnitte wie das Original`, () => {
      const soll = gliederung(deutsch)
      const abweichend: string[] = []

      for (const tag of andere) {
        const pfad = `docs/legal/${art}.${tag}.md`
        if (!existsSync(pfad)) continue
        const ist = gliederung(pfad)
        // Die Übersetzung darf einen Abschnitt mehr haben: den Hinweis auf
        // die verbindliche Fassung. Weniger darf sie nie haben.
        if (ist.length < soll.length) abweichend.push(`${tag}: ${ist.length} statt ${soll.length}`)
      }

      expect(abweichend.join(' | '), 'Abschnitte fehlen').toBe('')
    })

    it(`${art}: jede Übersetzung nennt die deutsche Fassung als verbindlich`, () => {
      const ohne: string[] = []

      for (const tag of andere) {
        const pfad = `docs/legal/${art}.${tag}.md`
        if (!existsSync(pfad)) continue
        // Der Marker steht als HTML-Kommentar in der Quelle: Er ist für den
        // Erzeuger da und nicht für den Menschen — der liest den Satz selbst.
        if (!readFileSync(pfad, 'utf8').includes('<!-- verbindlich: de -->')) ohne.push(tag)
      }

      expect(ohne.join(', '), 'ohne Hinweis auf die verbindliche Fassung').toBe('')
    })
  }
})
