import { describe, expect, it } from 'vitest'

import { ARITHMETIC_STAGES, arithmeticPool, arithmeticSize } from '../../src/core/content/arithmetic.ts'
import { OWN_SEPARATOR } from '../../src/core/content/own.ts'

/**
 * Kopfrechnen (Nutzerwunsch 05.09.).
 *
 * Die wichtigste Prüfung hier ist die zweite: **Der Test rechnet selbst
 * nach.** Eine Gedächtnis-App, die 7 × 8 = 54 einübt, richtet mehr Schaden an
 * als eine, die das Modul gar nicht hat — und ein Tippfehler in einer Tabelle
 * fällt niemandem auf, der die Tabelle gerade erst lernt.
 */

const frage = (item: string) => item.split(OWN_SEPARATOR)[0] as string
const antwort = (item: string) => item.split(OWN_SEPARATOR)[1] as string

/** Rechnet die Frage aus — unabhängig von der Datei, die sie erzeugt hat. */
function rechne(text: string): number | undefined {
  const mal = /^(\d+) × (\d+)$/u.exec(text)
  if (mal) return Number(mal[1]) * Number(mal[2])
  const potenz = /^2\^(\d+)$/u.exec(text)
  if (potenz) return 2 ** Number(potenz[1])
  const prozent = /^(\d+) % von (\d+)$/u.exec(text)
  if (prozent) return (Number(prozent[1]) * Number(prozent[2])) / 100
  return undefined
}

describe('der Rechenvorrat', () => {
  const alle = arithmeticPool('probe', ARITHMETIC_STAGES)

  it('trägt jede Aufgabe als Frage-Antwort-Paar', () => {
    for (const item of alle) {
      expect(item.split(OWN_SEPARATOR), item).toHaveLength(2)
      expect(frage(item).length, item).toBeGreaterThan(0)
      expect(antwort(item), item).toMatch(/^\d+$/u)
    }
  })

  it('rechnet richtig — nachgerechnet, nicht geglaubt', () => {
    for (const item of alle) {
      const soll = rechne(frage(item))
      expect(soll, `unbekannte Aufgabenform: ${frage(item)}`).toBeDefined()
      expect(Number(antwort(item)), `${frage(item)} = ${antwort(item)}`).toBe(soll)
    }
  })

  it('stellt keine Aufgabe zweimal', () => {
    /*
     * 7 × 8 und 8 × 7 sind dieselbe Tatsache. Stünden beide im Vorrat, misse
     * der zweite Abruf das Wiedersehen von vor zwei Minuten statt das
     * Gedächtnis — derselbe Fehler, den der Planer beim Aussortieren der
     * fälligen Einträge vermeidet.
     */
    expect(new Set(alle).size).toBe(alle.length)
    const normalisiert = alle.map((item) => {
      const m = /^(\d+) × (\d+)$/u.exec(frage(item))
      return m ? [Number(m[1]), Number(m[2])].sort((a, b) => a - b).join('×') : frage(item)
    })
    expect(new Set(normalisiert).size, 'gespiegelte Aufgabe im Vorrat').toBe(alle.length)
  })

  it('lässt die geschenkten Reihen weg', () => {
    // „7 × 1" und „7 × 10" prüfen kein Gedächtnis, sondern eine Regel.
    for (const item of arithmeticPool('probe', ['times'])) {
      const m = /^(\d+) × (\d+)$/u.exec(frage(item))
      expect(m, item).not.toBeNull()
      for (const teil of [Number(m![1]), Number(m![2])]) {
        expect(teil, item).toBeGreaterThan(1)
        expect(teil, item).toBeLessThan(10)
      }
    }
  })

  it('gibt bei gleichem Seed denselben Vorrat — und mischt ihn wirklich', () => {
    expect(arithmeticPool('a', ['times'])).toEqual(arithmeticPool('a', ['times']))
    expect(arithmeticPool('a', ['times'])).not.toEqual(arithmeticPool('b', ['times']))
  })

  it('wächst mit den freigeschalteten Stufen', () => {
    const nurEinmaleins = arithmeticPool('probe', ['times']).length
    expect(nurEinmaleins).toBe(arithmeticSize('times'))
    expect(alle.length).toBeGreaterThan(nurEinmaleins)
    // Das kleine Einmaleins ohne Spiegelungen und ohne die Reihen 1 und 10:
    // die Dreiecksmatrix von 2×2 bis 9×9.
    expect(nurEinmaleins).toBe(36)
  })
})
