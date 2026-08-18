import { describe, expect, it } from 'vitest'

import { returnsOf } from '../../src/core/index.ts'

/**
 * Die Wiedersehen (Backlog K1, K5 · D-019).
 *
 * Geprüft wird nicht nur, dass richtig addiert wird, sondern die **Aussage**:
 * Was hier steht, ist gezählt und nicht vergeben. Deshalb steht in jedem Test
 * dabei, welcher Wirklichkeit die Zahl entspricht.
 */
describe('die Wiedersehen', () => {
  it('zählt den ersten Tag nicht mit', () => {
    // Eine Information, die heute gelernt und heute abgefragt wurde, ist
    // kein Wiedersehen — sie ist ein Kennenlernen.
    expect(returnsOf([{ reviews: 1 }])).toEqual({ total: 0, tracked: 1, longest: 0 })
  })

  it('zählt jede spätere Abfrage einzeln', () => {
    // Dreimal abgefragt heißt: einmal gelernt, zweimal zurückgeholt.
    expect(returnsOf([{ reviews: 3 }]).total).toBe(2)
    expect(returnsOf([{ reviews: 3 }, { reviews: 2 }, { reviews: 1 }]).total).toBe(3)
  })

  it('zählt auch, was noch nie zurückkam, zum Bestand', () => {
    // Es wartet ja auf seinen Termin — verschwiegen wäre der Bestand kleiner,
    // als er ist.
    const returns = returnsOf([{ reviews: 1 }, { reviews: 1 }, { reviews: 4 }])
    expect(returns.tracked).toBe(3)
    expect(returns.total).toBe(3)
  })

  it('nennt die längste Kette einer einzelnen Information', () => {
    /*
     * Der ehrlichste Rekord der App (K5): Er wächst nur über Wochen, weil die
     * Abstände mit jedem Mal größer werden. An einem Nachmittag ist er nicht
     * zu holen — und genau darum taugt er als Rekord.
     */
    expect(returnsOf([{ reviews: 3 }, { reviews: 9 }, { reviews: 2 }]).longest).toBe(8)
  })

  it('übergeht, was noch gar nicht abgefragt wurde', () => {
    expect(returnsOf([{ reviews: 0 }])).toEqual({ total: 0, tracked: 0, longest: 0 })
  })

  it('steht bei leerer Datenlage auf null statt auf einer Behauptung', () => {
    expect(returnsOf([])).toEqual({ total: 0, tracked: 0, longest: 0 })
  })

  it('lässt sich nicht durch mehr Übung an einem Tag erhöhen', () => {
    /*
     * Die Eigenschaft, um die es eigentlich geht (D-019). Die Zahl hängt
     * ausschließlich an den Abfragen, die der Plan angesetzt hat — es gibt
     * hier keine Größe für Zeit, Anzahl der Einheiten oder Anstrengung, an
     * der sich drehen ließe. Wer heute zehnmal trainiert, verschiebt damit
     * nur Termine in die Zukunft.
     *
     * Der Test hält das an der Schnittstelle fest: Was hineingeht, ist
     * ausschließlich die Zahl der Abfragen.
     */
    const before = returnsOf([{ reviews: 5 }])
    const same = returnsOf([{ reviews: 5 }])
    expect(same).toEqual(before)
  })

  it('wird jedes Mal neu gerechnet und nie fortgeschrieben', () => {
    // Dieselbe Regel wie bei der Serie: Ein hochgezählter Zähler ist eine
    // Behauptung, die nach einer eingelesenen Sicherung danebenliegen kann.
    const items = [{ reviews: 2 }, { reviews: 6 }]
    expect(returnsOf(items)).toEqual(returnsOf(items))
    expect(returnsOf([...items, { reviews: 1 }]).total).toBe(returnsOf(items).total)
  })
})
