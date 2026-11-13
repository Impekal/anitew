/**
 * Erreichtes, als benannte Tatsache (Backlog K3 · D-019).
 *
 * Der Backlog hat K3 offen gelassen mit einer Bedingung: **nur als benannte
 * Tatsache denkbar, nie als Rang über einen Menschen.** Genau das ist hier
 * gebaut — und deshalb sieht es anders aus als in jeder Spiele-App:
 *
 * - **Gerechnet, nicht vergeben.** Jede Tatsache folgt aus Daten, die es
 *   ohnehin gibt (Serie, Wiedersehen, Lernstand, Messungen, eigener Palast).
 *   Nichts wird gespeichert, nichts hochgezählt — dieselbe Regel wie bei der
 *   Serie (D-015) und beim Wiedersehen (D-019).
 * - **Nur was erreicht ist.** Es gibt **keine** gesperrten, ausgegrauten
 *   Felder mit einem Fortschrittsbalken darauf. Ein gesperrtes Feld ist eine
 *   Aufforderung, und Aufforderungen erzeugen den Druck, den K7 ausschließt.
 *   Was noch nicht ist, steht gar nicht da.
 * - **Kein Rang, keine Stufe, kein Punktwert.** Eine Tatsache ist eine
 *   Tatsache: „Du hast eine Woche am Stück trainiert.“ Nicht „Level 3“.
 *
 * Es ist damit ausdrücklich **keine** Gamification, sondern das Gegenteil: ein
 * ruhiger Rückblick auf das, was wirklich passiert ist.
 */

/** Die benannten Tatsachen, in der Reihenfolge, in der sie dastehen. */
export const ACHIEVEMENTS = [
  'firstReturn',
  'week',
  'fortnight',
  'hundredReturns',
  'heldOften',
  'calibrated',
  'majorLearned',
  'ownPalace',
  'heldBackwards',
  'toldApart',
  'sawDetails',
  'namesHeld',
  /*
   * Die lange Ziffernfolge (Nutzerwunsch 04.09./05.09.).
   *
   * Zwölf Ziffern sind das Doppelte der Merkspanne und sechs Wörter im
   * Major-System — die Stelle, an der die Technik anfängt, etwas zu können,
   * was ohne sie nicht geht. Dreißig ist die oberste Stufe der Leiter.
   *
   * Beides bleibt eine **Tatsache und kein Ziel**: Was noch nicht erreicht
   * ist, steht nirgends, auch nicht ausgegraut (K7). Wer wissen will, wie es
   * weitergeht, merkt es an den Zahlen selbst — sie werden länger.
   */
  'heldTwelve',
  'heldThirty',
] as const
export type AchievementId = (typeof ACHIEVEMENTS)[number]

/** Woraus sich die Tatsachen ergeben — alles schon vorhandene Zahlen. */
export interface AchievementInput {
  /** Wie oft überhaupt etwas nach seinem ersten Tag zurückkam (D-019). */
  returnsTotal: number
  /** Wie oft dieselbe Information schon zurückkam (die längste Kette). */
  returnsLongest: number
  /** Die längste je erreichte Serie in Tagen (K5). */
  streakBest: number
  /** Gelernte Ziffern des Major-Systems, 0..10 (D5). */
  taughtCount: number
  /** Abgeschlossene Messungen (F2b: ab zwei ist die Eichung durch). */
  completedBenchmarks: number
  /** Gibt es einen selbst angelegten Palast? (G3) */
  hasOwnPalace: boolean
  /** Richtige sofortige Rückwärtsfolgen (D-026: Gelegenheiten − Verlorene). */
  heldBackTotal: number
  /** Zwillings-Wiedersehen ohne Verlust — Ähnliches blieb getrennt (D-027). */
  toldApartTotal: number
  /** Bild-Wiedersehen ohne Verlust — die Einzelheit saß noch (D-028). */
  detailsHeldTotal: number
  /** Gesichter-Wiedersehen ohne Verlust — der Name saß noch. */
  namesHeldTotal: number
  /**
   * Die längste Ziffernfolge, die je richtig abgerufen wurde.
   *
   * Dieselbe Zahl, die auch die Decke hebt (`numberLengthFor`) — gerechnet
   * aus den Rohereignissen, nicht gespeichert.
   */
  longestNumberDigits: number
}

/**
 * Welche Tatsachen sind wahr?
 *
 * Gibt nur die zurück, die erreicht sind — in fester Reihenfolge. Eine leere
 * Liste heißt schlicht: noch nichts davon, und dann steht gar nichts da.
 */
export function achievementsOf(input: AchievementInput): readonly AchievementId[] {
  const reached: AchievementId[] = []
  if (input.returnsTotal >= 1) reached.push('firstReturn')
  if (input.streakBest >= 7) reached.push('week')
  if (input.streakBest >= 14) reached.push('fortnight')
  if (input.returnsTotal >= 100) reached.push('hundredReturns')
  if (input.returnsLongest >= 5) reached.push('heldOften')
  if (input.completedBenchmarks >= 2) reached.push('calibrated')
  if (input.taughtCount >= 10) reached.push('majorLearned')
  if (input.hasOwnPalace) reached.push('ownPalace')
  if (input.heldBackTotal >= 50) reached.push('heldBackwards')
  if (input.toldApartTotal >= 25) reached.push('toldApart')
  if (input.detailsHeldTotal >= 25) reached.push('sawDetails')
  if (input.namesHeldTotal >= 25) reached.push('namesHeld')
  if (input.longestNumberDigits >= 12) reached.push('heldTwelve')
  if (input.longestNumberDigits >= 30) reached.push('heldThirty')
  return reached
}
