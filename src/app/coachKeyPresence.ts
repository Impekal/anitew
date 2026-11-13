import type { SettingsStore } from '../core/index.ts'
import {
  type CoachProvider,
  LEGACY_COACH_KEY_SETTING,
  coachKeySettingFor,
} from '../platform/web/coach.ts'

/**
 * Liegt für diesen Anbieter ein eigener Schlüssel auf dem Gerät?
 *
 * Zwei Leseschritte, weil der Anthropic-Weg historisch gewachsen ist: Zuerst
 * der Schlüssel je Anbieter (D-034), dann — nur für Anthropic — die alte
 * anbieterlose Zeile aus D-031-Zeiten. Genau diese Zweistufigkeit macht den
 * Lesevorgang langsam genug, dass ein schneller Anbieterwechsel ihn überholen
 * kann; deshalb steht sie hier als eigene, prüfbare Funktion.
 */
export async function hasStoredCoachKey(
  settings: SettingsStore,
  provider: CoachProvider,
): Promise<boolean> {
  const stored =
    (await settings.read<string>(coachKeySettingFor(provider))) ??
    (provider === 'anthropic'
      ? await settings.read<string>(LEGACY_COACH_KEY_SETTING)
      : undefined)
  return stored !== undefined && stored.trim() !== ''
}

/**
 * „Nur das jüngste Ergebnis zählt“ (R3-03, Runde 3).
 *
 * Der Fall, den das verhindert: Jemand wählt Anthropic, dessen zweistufiger
 * Lesevorgang trödelt, und wechselt sofort weiter zu Gemini. Kommt danach
 * die Anthropic-Antwort zurück, setzte sie bisher den sichtbaren Zustand —
 * die Oberfläche behauptete dann einen Schlüssel, der zum angezeigten
 * Anbieter gar nicht gehört. Jeder Lauf zieht hier vorher eine Nummer;
 * angewandt wird nur, wer noch die aktuelle hat.
 */
export interface LatestOnly {
  /** Beginnt einen Lauf und liefert seine Nummer. */
  begin(): number
  /** Ist diese Nummer noch die jüngste? */
  isCurrent(token: number): boolean
  /** Verwirft alle laufenden Ergebnisse (z. B. beim Abräumen). */
  cancelAll(): void
}

export function createLatestOnly(): LatestOnly {
  let current = 0
  return {
    begin: () => ++current,
    isCurrent: (token) => token === current,
    cancelAll: () => void ++current,
  }
}
