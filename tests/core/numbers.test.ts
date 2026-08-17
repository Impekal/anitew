import { describe, expect, it } from 'vitest'

import { MAX_DIGITS, MIN_DIGITS, isTooEasy, numberPool } from '../../src/core/content/numbers.ts'
import { gradePrompted, gradeRecall } from '../../src/core/session/grading.ts'
import { leniencyFor } from '../../src/core/session/plan.ts'

describe('der Zahlenvorrat (D10)', () => {
  const pool = numberPool('test', 60)

  it('liefert aus demselben Seed denselben Vorrat', () => {
    // Wie bei Wörtern und Gesichtern: Die Einheit bleibt reproduzierbar (A11).
    expect(numberPool('test', 20)).toEqual(numberPool('test', 20))
    expect(numberPool('test', 20)).not.toEqual(numberPool('anders', 20))
  })

  it('liefert so viele, wie verlangt sind — und keine doppelt', () => {
    expect(pool).toHaveLength(60)
    expect(new Set(pool).size).toBe(60)
  })

  it('bleibt in der Spanne und beginnt nie mit einer Null', () => {
    for (const value of pool) {
      expect(value).toMatch(/^[1-9][0-9]*$/)
      expect(value.length).toBeGreaterThanOrEqual(MIN_DIGITS)
      expect(value.length).toBeLessThanOrEqual(MAX_DIGITS)
    }
  })

  it('streut die Länge, statt lauter gleich lange zu liefern', () => {
    /*
     * Gleichförmigkeit macht den Abruf leichter, als er sein sollte: Wer weiß,
     * dass alles vierstellig ist, muss die Länge nicht mehr behalten.
     */
    expect(new Set(pool.map((value) => value.length)).size).toBe(MAX_DIGITS - MIN_DIGITS + 1)
  })

  it('lässt geschenkte Folgen aus', () => {
    // „1111“ merkt sich als ein Zeichen, „3456“ als eine Regel. Beide sagen
    // nichts über das Gedächtnis für Ziffernfolgen — der Treffer wäre
    // geschenkt und ginge doch in dieselbe Zahl ein (R-1).
    expect(isTooEasy('1111')).toBe(true)
    expect(isTooEasy('3456')).toBe(true)
    expect(isTooEasy('9876')).toBe(true)
    expect(isTooEasy('4719')).toBe(false)
    expect(pool.some(isTooEasy)).toBe(false)
  })

  it('hat keine Leerzeichen — der freie Abruf zerlegt sonst eine Zahl in drei', () => {
    // Bis es eine Eingabe gibt, die weiß, dass sie **eine** Antwort erwartet,
    // sind gruppierte Nummern nicht möglich. Die Einschränkung wird benannt,
    // nicht versteckt.
    for (const value of pool) expect(value).not.toMatch(/\s/)
  })
})

describe('Zahlen werden genau verglichen (D10)', () => {
  it('gibt dem Zahlenmodul die strenge Bewertung', () => {
    expect(leniencyFor('numbers')).toBe('exact')
    expect(leniencyFor('words')).toBe('typos')
    expect(leniencyFor('faces')).toBe('typos')
  })

  it('zählt eine vertauschte Ziffer nicht als Treffer', () => {
    /*
     * Der Kern der Sache: 4719 und 4791 sind nicht dieselbe PIN. Unter der
     * Wortregel („ab fünf Zeichen ein Tippfehler erlaubt“) wäre das ein
     * Treffer — und damit ein Punkt für etwas, das im Alltag ein falsch
     * gewähltes Schloss wäre.
     */
    const targets = ['47196']
    expect(gradeRecall(['47916'], targets, 'typos').correct).toEqual(['47196'])
    expect(gradeRecall(['47916'], targets, 'exact').correct).toEqual([])
    expect(gradeRecall(['47916'], targets, 'exact').missed).toEqual(['47196'])
  })

  it('zählt eine falsche Ziffer nicht als Treffer', () => {
    expect(gradeRecall(['47197'], ['47196'], 'exact').correct).toEqual([])
  })

  it('nimmt die richtige Zahl selbstverständlich an', () => {
    // Streng heißt streng, nicht schikanös: Was stimmt, zählt.
    expect(gradeRecall(['47196'], ['47196'], 'exact').correct).toEqual(['47196'])
  })

  it('gilt genauso beim gestützten Abruf', () => {
    // Damit die Regel nicht davon abhängt, wie gefragt wurde.
    expect(gradePrompted(['47916'], ['47196'], 'exact').correct).toEqual([])
    expect(gradePrompted(['47196'], ['47196'], 'exact').correct).toEqual(['47196'])
  })

  it('lässt Wörter weiterhin einen Tippfehler durchgehen', () => {
    // Die Gegenprobe: Die neue Strenge darf nicht auf alles übergreifen.
    expect(gradeRecall(['Blmue'], ['Blume']).correct).toEqual(['Blume'])
  })
})
