import { describe, expect, it } from 'vitest'

import { SPAN_LENGTH, reversed, spanPool } from '../../src/core/content/spans.ts'

/**
 * Die Ziffernfolgen des Arbeitsgedächtnisses (D7).
 *
 * Die Regel hinter den Fällen: Die Aufgabe ist das **Umbauen im Kopf** —
 * jede Folge, bei der ein Teil der Antwort schon in der Anzeige steht
 * (Dopplung, Palindrom), wäre eine halbe Aufgabe mit ganzer Wertung.
 */
describe('die Ziffernfolgen fürs Arbeitsgedächtnis', () => {
  it('liefert deterministisch dieselben Folgen zum selben Seed (A11)', () => {
    expect(spanPool('tag:daily', 12)).toEqual(spanPool('tag:daily', 12))
    expect(spanPool('tag:daily', 12)).not.toEqual(spanPool('anderer', 12))
  })

  it('wiederholt innerhalb eines Vorrats keine Folge', () => {
    const pool = spanPool('s', 60)
    expect(new Set(pool).size).toBe(pool.length)
  })

  it('hat überall die verabredete Länge und nur Ziffern', () => {
    for (const digits of spanPool('s', 40)) {
      expect(digits).toMatch(/^\d+$/)
      expect(digits).toHaveLength(SPAN_LENGTH)
    }
  })

  it('stellt keine halb beantwortete Frage — keine Dopplung, kein Palindrom', () => {
    for (const digits of spanPool('s', 80)) {
      for (let index = 1; index < digits.length; index++) {
        expect(digits[index]).not.toBe(digits[index - 1])
      }
      expect(reversed(digits)).not.toBe(digits)
    }
  })

  it('dreht eine Folge um — und zweimal gedreht ist sie wieder sie selbst', () => {
    expect(reversed('48293')).toBe('39284')
    expect(reversed(reversed('48293'))).toBe('48293')
  })
})
