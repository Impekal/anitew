import { describe, expect, it } from 'vitest'

import { MAX_DIGITS, MIN_DIGITS, numberPool } from '../../src/core/content/numbers.ts'
import { numberLengthFor } from '../../src/core/session/difficulty.ts'
import { itemsOf, planSession } from '../../src/core/session/plan.ts'

/**
 * Die Zahllänge wächst mit dem Lernstand (Nutzerbefund 04.09.).
 *
 * Wörtlich: „Ich lerne (erstmal nur) t und d für 1 und … soll gleich mehrere
 * 6-stellige Ziffern anmerken können. Wie soll das gehen, wenn ich noch nicht
 * viele Wörter im Katalog für 1 habe?"
 *
 * **Gemessen vor dem Eingriff:** Eine Fünf-Minuten-Einheit brachte 24 Zahlen,
 * sieben davon sechsstellig — bei nur gelehrter 1 genau so viele wie bei
 * allen zehn Ziffern. Die Länge kannte den Lernstand nicht.
 */

const ALLE_ZEHN = [1, 2, 3, 4, 5, 9, 7, 8, 0, 6]

describe('die Decke für neue Zahlen', () => {
  it('wächst stufenweise mit dem Lernstand', () => {
    const decke = (taught: readonly number[]) => numberLengthFor({ taught, recent: [] })
    expect(decke([])).toBe(3)
    expect(decke([1])).toBe(3)
    expect(decke([1, 2])).toBe(4)
    expect(decke([1, 2, 3, 4])).toBe(4)
    expect(decke([1, 2, 3, 4, 5])).toBe(5)
    expect(decke([1, 2, 3, 4, 5, 9, 7])).toBe(5)
    expect(decke([1, 2, 3, 4, 5, 9, 7, 8])).toBe(6)
    expect(decke(ALLE_ZEHN)).toBe(6)
  })

  it('lässt sich von derselben Ziffer nicht zweimal überzeugen', () => {
    // Ein doppelter Eintrag im Lernstand ist keine zweite gelernte Ziffer.
    expect(numberLengthFor({ taught: [1, 1, 1, 1, 1], recent: [] })).toBe(3)
  })

  it('gibt der eigenen Quote ein Stück Spielraum — nach oben wie nach unten', () => {
    /*
     * Die Decke ist eine Hilfe, kein Urteil (R-1). Wer die dreistelligen
     * sicher behält, ist nicht dadurch überfordert, dass er erst eine Ziffer
     * gelernt hat — und wer bei allen zehn ständig verliert, übt das
     * Verlieren.
     */
    const sicher = Array.from({ length: 20 }, () => true)
    const wackelig = Array.from({ length: 20 }, (_, index) => index % 3 === 0)
    expect(numberLengthFor({ taught: [1], recent: sicher })).toBe(4)
    expect(numberLengthFor({ taught: ALLE_ZEHN, recent: wackelig })).toBe(5)
  })

  it('bleibt zwischen Boden und Decke, was immer man ihr gibt', () => {
    const sicher = Array.from({ length: 20 }, () => true)
    expect(numberLengthFor({ taught: ALLE_ZEHN, recent: sicher })).toBe(MAX_DIGITS)
    const daneben = Array.from({ length: 20 }, () => false)
    expect(numberLengthFor({ taught: [], recent: daneben })).toBe(MIN_DIGITS)
  })
})

describe('der Zahlenvorrat', () => {
  it('hält die Decke ein und streut darunter weiter', () => {
    const kurz = numberPool('probe', 60, 4).map((zahl) => zahl.length)
    expect(Math.max(...kurz)).toBe(4)
    expect(new Set(kurz)).toEqual(new Set([3, 4]))
  })

  it('bleibt ohne Angabe genau der alte Vorrat', () => {
    /*
     * Die wichtigste Zusage dieses Eingriffs: Wer nichts übergibt, bekommt
     * Ziffer für Ziffer denselben Vorrat wie vorher. Sonst würfelte eine
     * Verbesserung der Didaktik allen Bestandsnutzern ihre Zahlen neu aus.
     */
    expect(numberPool('probe', 60)).toEqual(numberPool('probe', 60, MAX_DIGITS))
  })

  it('liefert auch bei der engsten Decke einen vollen Vorrat', () => {
    // Dreistellig gibt es rund 900 Folgen; 60 daraus zu ziehen darf nicht an
    // der Abbruchschranke der Schleife scheitern.
    expect(numberPool('probe', 60, 3)).toHaveLength(60)
  })
})

describe('eine Einheit nach der ersten Lektion', () => {
  const plane = (taught: readonly number[]) => {
    const seed = '2026-09-04:daily:1'
    return itemsOf(
      planSession({
        mode: 'daily',
        day: '2026-09-04',
        language: 'de',
        seed,
        pools: {
          words: [],
          faces: [],
          numbers: numberPool(seed, 60, numberLengthFor({ taught, recent: [] })),
          missions: [],
          palace: [],
          reverse: [],
          twins: [],
          gaze: [],
          facts: [],
          memory: [],
          people: [],
        },
        due: {},
        taught,
        palaceTaught: true,
        storyTaught: true,
        linkTaught: true,
        majorMethodTaught: true,
        focus: 'numbers',
        modules: ['numbers'],
      } as never),
    ).filter((eintrag) => /^\d+$/u.test(eintrag))
  }

  it('verlangt mit einer gelernten Ziffer keine sechsstellige Zahl', () => {
    /*
     * Der Befund als Prüfung. Nicht „höchstens ein paar" — keine einzige:
     * Das Major-System fasst zwei Ziffern zu einem Wort, und mit einer
     * gelernten Ziffer ist ein zufälliges Paar in einem von hundert Fällen
     * brauchbar. Eine sechsstellige Zahl in vier Sekunden wäre dann kein
     * Anwenden der Technik, sondern Auswendiglernen ohne Werkzeug.
     */
    const zahlen = plane([1])
    expect(zahlen.length).toBeGreaterThan(0)
    const laengen = zahlen.map((zahl) => zahl.length)
    expect(Math.max(...laengen), `längste Zahl: ${Math.max(...laengen)} Ziffern`).toBe(3)
  })

  it('gibt sie wieder her, sobald das System steht', () => {
    // Die Gegenrichtung, damit die Decke nicht heimlich zur Fessel wird.
    const laengen = plane(ALLE_ZEHN).map((zahl) => zahl.length)
    expect(Math.max(...laengen)).toBe(6)
    expect(laengen.filter((laenge) => laenge === 6).length).toBeGreaterThan(0)
  })
})
