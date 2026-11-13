/**
 * Der gemeinsame Zustand der Erst-Orientierung (Führung).
 *
 * Zwei Module brauchen dieselben zwei Marken: `firstRunExperience.ts` schreibt
 * und liest sie, `coreRitual.ts` muss **vor** dem Nachladen wissen, ob eine
 * angefangene Führung aussteht. Stünden die Schlüssel doppelt als Literale in
 * beiden Dateien, liefe eine Versionierung (v2 → v3) in der einen Datei an der
 * anderen vorbei — deshalb eine Quelle.
 *
 * Warum coreRitual das wissen muss: `firstRunExperience.ts` wurde bisher nur
 * geladen, wenn `.onboarding` im DOM steht oder `.arrival-begin` berührt wird
 * — beides gibt es nur auf dem allerersten Besuch. Wer die App mitten in der
 * Führung schloss, behielt `pending=1` im Speicher, aber kein späterer Besuch
 * lud je das Modul, das die Führung zeigt. Gemessen am 30.08.: Neuladen mit
 * `pending=1`, drei Sekunden gewartet — keine Führung, nie wieder. Die Marke
 * war damit totes Gewicht; ihr einziger Zweck ist ja gerade, einen Abbruch zu
 * überleben.
 */

export const GUIDE_DONE_KEY = 'anitew.first-run-guide.v2'
export const GUIDE_PENDING_KEY = 'anitew.first-run-guide.pending.v2'

/** Steht eine angefangene, nie abgeschlossene Führung aus? */
export function firstRunGuidePending(): boolean {
  try {
    return (
      window.localStorage.getItem(GUIDE_PENDING_KEY) === '1' &&
      window.localStorage.getItem(GUIDE_DONE_KEY) !== '1'
    )
  } catch {
    // Ohne localStorage gibt es keine überlebende Führung — und nichts zu tun.
    return false
  }
}
