import { describe, expect, it } from 'vitest'

import { failureForStatus } from '../../src/platform/web/coach.ts'

/**
 * F-09 (Runde 2): 401 und 403 sind verschiedene Diagnosen. Groq etwa meldet
 * 403 bei fehlender Modell-Berechtigung trotz gültigem Schlüssel — die alte
 * Sammel-Diagnose „bad-key“ schickte den Menschen dann zum falschen Ort.
 * Text- und Fotopfad teilen sich diese eine Tabelle.
 */
describe('die Fehlerdiagnose der Anbieterantworten', () => {
  it('unterscheidet Schlüssel, Berechtigung und Drosselung', () => {
    expect(failureForStatus(401)).toBe('bad-key')
    expect(failureForStatus(403)).toBe('forbidden')
    expect(failureForStatus(429)).toBe('limited')
  })

  it('überlässt alles andere der allgemeinen Fehlerbehandlung', () => {
    expect(failureForStatus(200)).toBeUndefined()
    expect(failureForStatus(400)).toBeUndefined()
    expect(failureForStatus(500)).toBeUndefined()
    expect(failureForStatus(503)).toBeUndefined()
  })
})
