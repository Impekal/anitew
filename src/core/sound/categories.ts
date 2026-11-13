import type { SoundCue } from '../ports.ts'

/**
 * Töne nach Bereichen (Gerätewunsch 31.08.: „Töne/Songs nach individuellen
 * Bereichen aktivierbar/deaktivierbar oder alle auf einmal").
 *
 * Drei Bereiche, weil es drei verschiedene Dinge sind:
 *
 * - **Rückmeldung**: die kurzen Töne der Bedienung — ein Wort ist gelandet,
 *   ein Block ist zu Ende, etwas blieb offen.
 * - **Ankommen**: die Melodie der drei Sekunden vor der Einheit.
 * - **Klang während der Einheit**: der ruhige Dauerklang beim Einprägen und
 *   Antworten.
 *
 * Wer nur den Dauerklang nicht mag, soll nicht auch die Bestätigung verlieren.
 * Der Hauptschalter (O6) bleibt darüber: Ein Tipp, und alles ist still.
 *
 * Diese Datei gehört bewusst in den Kern und nicht in die Plattform: Welcher
 * Ton zu welchem Bereich gehört, ist eine Produktentscheidung und wird ohne
 * Browser geprüft (D-010).
 */

export const SOUND_CATEGORIES = ['feedback', 'arrival', 'focus'] as const

export type SoundCategory = (typeof SOUND_CATEGORIES)[number]

export type SoundCategorySetting = Readonly<Record<SoundCategory, boolean>>

/**
 * Voreingestellt überall an — dieselbe Begründung wie beim Hauptschalter:
 * Eine Einstellung, die man erst finden muss, um etwas zu bekommen, ist keine.
 */
export const ALL_SOUND_ON: SoundCategorySetting = {
  feedback: true,
  arrival: true,
  focus: true,
}

/** Zu welchem Bereich gehört dieser Anlass? */
export function categoryOf(cue: SoundCue): SoundCategory {
  return cue === 'arrival' ? 'arrival' : 'feedback'
}

/**
 * Darf dieser Ton jetzt klingen?
 *
 * Der Hauptschalter hat Vorrang: Ist er aus, schweigt alles, egal was die
 * Bereiche sagen. So bleibt „alles auf einmal" wirklich alles.
 */
export function audible(
  cue: SoundCue,
  master: boolean,
  categories: SoundCategorySetting,
): boolean {
  if (!master) return false
  return categories[categoryOf(cue)]
}

/**
 * Darf der Dauerklang laufen?
 *
 * Er hängt an keinem Anlass, sondern am Bereich `focus` — deshalb eine eigene
 * Frage statt eines erfundenen Cues.
 */
export function ambientAudible(master: boolean, categories: SoundCategorySetting): boolean {
  return master && categories.focus
}
