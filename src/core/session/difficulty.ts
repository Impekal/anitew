/**
 * Adaptive Schwierigkeit (Backlog D2).
 *
 * Der Zielkorridor liegt um ~80 % Trefferquote: Zu leicht ist Beschäftigung,
 * zu schwer ist Frust — beides bricht das Wiederkommen. Die Stellschraube
 * ist klein und ehrlich: **ein Stück mehr oder weniger je Runde** (bzw. eine
 * Ziffer mehr oder weniger bei der Rückwärtsspanne), nie ein Sprung.
 *
 * Gerechnet, nicht fortgeschrieben (dasselbe Prinzip wie Serie und
 * Wiedersehen): Die Quote entsteht bei jedem Planen neu aus den letzten
 * Antworten des Moduls. Es gibt keinen gespeicherten „Level“, der
 * auseinanderlaufen könnte — und nichts, was sich wie ein Rang anfühlt
 * (D-019). Angezeigt wird die Anpassung nirgends als Zahl; sie ist
 * Planung, keine Aussage über den Menschen (R-1).
 */

/** Aus wie vielen letzten Antworten die Quote entsteht. */
export const DIFFICULTY_WINDOW = 20

/**
 * Unter so vielen Antworten wird nicht angepasst: Drei Treffer sind keine
 * Quote, sondern ein Anfang — dieselbe Vorsicht wie beim Profil (E7).
 */
export const MIN_ANSWERS_TO_ADAPT = 10

/** Der Korridor: darüber wird es mehr, darunter weniger. */
export const EASE_RATE = 0.9
export const STRAIN_RATE = 0.65

export interface DifficultyInput {
  /** Die letzten Antworten dieses Moduls, jüngste zuletzt — nur richtig/falsch. */
  readonly recent: readonly boolean[]
}

/**
 * Ein Stück mehr, eines weniger, oder wie gehabt.
 *
 * `+1` erst ab neun von zehn: Wer fast alles behält, darf mehr tragen.
 * `-1` unter zwei Dritteln: Wer ständig verliert, übt gerade das Verlieren.
 * Dazwischen bleibt alles, wie es ist — ein Regler, der bei jeder kleinen
 * Schwankung zappelt, wäre selbst die Störung.
 */
export function itemsDeltaFor(input: DifficultyInput): -1 | 0 | 1 {
  const window = input.recent.slice(-DIFFICULTY_WINDOW)
  if (window.length < MIN_ANSWERS_TO_ADAPT) return 0
  const rate = window.filter(Boolean).length / window.length
  if (rate >= EASE_RATE) return 1
  if (rate < STRAIN_RATE) return -1
  return 0
}

/**
 * Die Länge der Rückwärtsspanne (D7): fünf ist der Anfang, vier der Boden,
 * sechs die Decke. Dieselbe Quote, dieselben Schwellen — nur wirkt sie hier
 * auf die Folge statt auf die Stückzahl.
 */
export const SPAN_MIN = 4
export const SPAN_BASE = 5
export const SPAN_MAX = 6

export function spanLengthFor(input: DifficultyInput): number {
  const delta = itemsDeltaFor(input)
  return Math.max(SPAN_MIN, Math.min(SPAN_MAX, SPAN_BASE + delta))
}

/**
 * H6 — adaptive Missionsschwierigkeit über die Betrachtungszeit.
 *
 * Eine Mission bleibt immer dieselbe vollständige Szene. Wir entfernen keine
 * Tatsachen und erfinden keine Level. Stattdessen verschiebt dieselbe bereits
 * vorhandene ±1-Regel nur das Verhältnis zwischen Einprägen und Abrufen:
 *
 * - bei Überlastung (`-1`) sechs Sekunden je Tatsache,
 * - im Zielkorridor (`0`) fünf Sekunden,
 * - bei sehr sicherer Leistung (`+1`) vier Sekunden.
 *
 * Das Gesamtbudget der Runde bleibt dadurch unverändert; mehr Zeit beim
 * Einprägen bedeutet entsprechend weniger Abrufzeit und umgekehrt.
 */
export const MISSION_SECONDS_MIN = 4
export const MISSION_SECONDS_BASE = 5
export const MISSION_SECONDS_MAX = 6

export function missionSecondsPerFact(delta: -1 | 0 | 1): number {
  return Math.max(
    MISSION_SECONDS_MIN,
    Math.min(MISSION_SECONDS_MAX, MISSION_SECONDS_BASE - delta),
  )
}
