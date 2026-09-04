import { describe, expect, it } from 'vitest'

import { bandLabel } from '../../src/core/memory/label.ts'

/**
 * Der Name im Band, der fast nichts mehr war (Gerätebild 03.09., iPhone).
 *
 * Im Bild stand oben links ein Erinnerungspunkt, dessen Name nur noch als
 * „.…" zu sehen war. Der erste Verdacht — der Kasten schneidet am Rand ab —
 * war falsch: Nachgerechnet aus demselben Bild lag der Punkt bei x = 11,45
 * von 100, und dort schneidet nichts.
 *
 * Gemessen mit der Kürzungsfunktion selbst, und da war es sofort zu sehen:
 *
 *     "A       Bcdef"  ->  "A…"        ein sichtbares Zeichen
 *     "   Vic Sanou"   ->  "   Vic S…" drei davon sind Leerraum
 *
 * Eine Reihe von Leerzeichen frisst das ganze Budget, und führender Leerraum
 * schiebt den lesbaren Teil aus der Mitte. Ein Name, der zu „…" zusammenfällt,
 * sagt niemandem etwas — er sieht nur nach kaputt aus.
 */

/** Ein Nullbreiten-Leerzeichen (U+200B) — malt nichts und zählt trotzdem. */
const UNSICHTBAR = '​'

describe('der Name im Band', () => {
  it('lässt Leerraum nicht das Budget auffressen', () => {
    // Der Fall aus dem Bild: neun Zeichen Budget, davon sieben Leerzeichen.
    expect(bandLabel('A       Bcdef', 9)).toBe('A Bcdef')
    /*
     * Und das ist der Kern der Behebung: Geputzt passt der Name auf einmal
     * ganz ins Budget — „D        Company" wird zu „D Company", neun Zeichen,
     * nichts zu kürzen. Vorher blieb davon „D…" übrig.
     */
    expect(bandLabel('D        Company', 9)).toBe('D Company')
    expect(bandLabel('D        Company Nord', 9)).toBe('D Compan…')
  })

  it('wirft führenden und schließenden Leerraum weg', () => {
    // Sonst steht der lesbare Teil nicht dort, wo der Punkt ist.
    expect(bandLabel('   Vic Sanou', 9)).toBe('Vic Sanou')
    expect(bandLabel('Moise   ', 9)).toBe('Moise')
  })

  it('entfernt Zeichen, die nichts zeichnen', () => {
    /*
     * Nullbreiten- und Steuerzeichen zählen als Zeichen und malen nichts.
     * Sie kommen mit dem Einfügen aus anderen Programmen mit — und kürzen
     * dann einen Namen weg, ohne dass man sähe, warum.
     */
    expect(bandLabel(`${UNSICHTBAR}${UNSICHTBAR}Marie Curie`, 9)).toBe('Marie Cu…')
    expect(bandLabel('Anouk', 9)).toBe('Anouk')
  })

  it('kürzt weiterhin, was wirklich zu lang ist', () => {
    expect(bandLabel('Fahrschule Nord', 9)).toBe('Fahrschu…')
    expect(bandLabel('Lois Machin', 9)).toBe('Lois Mac…')
    expect(bandLabel('Vic', 9)).toBe('Vic')
  })

  it('gibt nichts zurück, wo nichts zu lesen wäre', () => {
    /*
     * Ein einzelnes „…" ist keine Auskunft. Wo nichts Lesbares übrig bleibt,
     * bleibt der Punkt lieber ohne Namen stehen — der ganze Name steht einen
     * Fingertipp entfernt in „Mein Gedächtnis".
     */
    expect(bandLabel('   ', 9)).toBe('')
    expect(bandLabel(UNSICHTBAR.repeat(3), 9)).toBe('')
    expect(bandLabel('', 9)).toBe('')
  })

  it('lässt nie ein Wort auf einen einzelnen Buchstaben zusammenfallen', () => {
    /*
     * Die eigentliche Zusage: Was übrig bleibt, muss lesbar sein. Zwei
     * sichtbare Zeichen sind das Mindeste — darunter ist es kein Name mehr,
     * sondern ein Zeichen mit Pünktchen.
     */
    for (const name of ['A       Bcdef', 'D        Company', '   Vic Sanou', 'Fahrschule Nord']) {
      const kurz = bandLabel(name, 9)
      const sichtbar = [...kurz].filter((zeichen) => zeichen.trim() !== '' && zeichen !== '…')
      expect(sichtbar.length, `${name} wird zu „${kurz}"`).toBeGreaterThanOrEqual(2)
    }
  })
})
