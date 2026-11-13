import { describe, expect, it } from 'vitest'

import {
  ALL_SOUND_ON,
  SOUND_CATEGORIES,
  audible,
  categoryOf,
  type SoundCategorySetting,
} from '../../src/core/sound/categories.ts'
import type { SoundCue } from '../../src/core/ports.ts'

/**
 * Töne nach Bereichen (Wunsch vom 31.08.: „Töne/Songs nach individuellen
 * Bereichen aktivierbar/deaktivierbar oder alle auf einmal").
 *
 * Drei Bereiche, weil es drei verschiedene Dinge sind:
 *
 * - **Rückmeldung** — die kurzen Töne, die sagen „angekommen", „Block zu
 *   Ende", „noch offen". Sie gehören zur Bedienung.
 * - **Ankommen** — die Melodie der drei Sekunden vor der Einheit.
 * - **Klang während der Einheit** — der ruhige Dauerklang.
 *
 * Wer nur den Dauerklang nicht mag, soll nicht auch die Bestätigung
 * verlieren; wer alles still will, hat weiterhin den einen Hauptschalter.
 */

/*
 * Die Anlaesse als Liste — hier und nicht im Kern: Sie wird nur zum Pruefen
 * gebraucht, und eine Laufzeitliste im Kaltstart-Buendel waere Gewicht ohne
 * Nutzen (P4). Die Vollstaendigkeit sichert trotzdem der Compiler: `satisfies`
 * verbietet einen erfundenen Anlass, und `Fehlend` wird zu `never`, solange
 * keiner vergessen ist — sonst schlaegt schon der Typecheck fehl.
 */
const SOUND_CUES = [
  'start',
  'arrival',
  'word',
  'type',
  'remember',
  'connection',
  'return',
  'recall',
  'error',
  'landing',
  'block',
  'done',
] as const satisfies readonly SoundCue[]

type Fehlend = Exclude<SoundCue, (typeof SOUND_CUES)[number]>
const alleAbgedeckt: Fehlend extends never ? true : never = true

describe('Ton-Bereiche', () => {
  it('kennt jeden Anlass, den der Kern hat', () => {
    expect(alleAbgedeckt).toBe(true)
  })

  it('ordnet jeden Ton genau einem Bereich zu', () => {
    // Kein Ton ohne Zuhause: Sonst gäbe es einen, den kein Schalter erreicht.
    for (const cue of SOUND_CUES) {
      expect(SOUND_CATEGORIES).toContain(categoryOf(cue))
    }
  })

  it('legt das Ankommen in seinen eigenen Bereich', () => {
    expect(categoryOf('arrival')).toBe('arrival')
    expect(categoryOf('done')).toBe('feedback')
    expect(categoryOf('error')).toBe('feedback')
  })

  it('schweigt vollständig, wenn der Hauptschalter aus ist', () => {
    for (const cue of SOUND_CUES) {
      expect(audible(cue, false, ALL_SOUND_ON)).toBe(false)
    }
  })

  it('lässt einen Bereich abschalten, ohne die anderen mitzunehmen', () => {
    const ohneAnkommen: SoundCategorySetting = { ...ALL_SOUND_ON, arrival: false }
    expect(audible('arrival', true, ohneAnkommen)).toBe(false)
    expect(audible('done', true, ohneAnkommen)).toBe(true)
    expect(audible('word', true, ohneAnkommen)).toBe(true)
  })

  it('ist voreingestellt überall an', () => {
    // Eine Einstellung, die man erst finden muss, um etwas zu bekommen, ist
    // keine (dieselbe Begründung wie beim Hauptschalter, O6).
    for (const category of SOUND_CATEGORIES) {
      expect(ALL_SOUND_ON[category]).toBe(true)
    }
  })
})
