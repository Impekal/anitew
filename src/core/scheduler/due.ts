/**
 * Was ist heute dran? (Backlog C7)
 *
 * Der Scheduler sagt für jede Information einen Termin voraus. Diese Datei
 * beantwortet die andere Hälfte der Frage: **Was davon passt in die Einheit,
 * die dieser Mensch heute wirklich macht?**
 *
 * Das klingt nach einer Nebensache und ist die Stelle, an der die meisten
 * Wiederholungs-Apps ihre Nutzer verlieren. Wer zwei Wochen nicht öffnet,
 * bekommt dort 800 fällige Karten präsentiert, macht die App zu und kommt
 * nicht wieder. Deshalb gibt es hier eine **Obergrenze**: Es kommt immer nur
 * so viel zurück, wie in die gewählte Zeit passt.
 *
 * Was dabei verloren geht, ist ehrlich benannt: Wer lange weg war, holt den
 * Rückstand über mehrere Tage auf statt an einem. Das ist langsamer — und der
 * einzige Weg, der überhaupt zu einem zweiten Tag führt.
 */

import { type DayKey, daysBetween } from '../time.ts'

import { overdueBy } from './memory.ts'
import type { Memory } from './memory.ts'

const DAY_MS = 24 * 60 * 60 * 1_000

export interface DueItem {
  itemId: string
  memory: Memory
  /**
   * I5: realer Zeitpunkt, bis zu dem ein persönlicher Inhalt gebraucht wird.
   * Er verändert den FSRS-Zustand nicht. Die Auswahl darf nur zusätzliche
   * Wiedersehen **vorziehen** und den termingebundenen Inhalt danach aus dem
   * Tagesplan nehmen.
   */
  neededByAt?: number
}

/**
 * Deadline-Druck als kleine, erklärbare Stufen statt als zweiter Scheduler.
 *
 * - mehr als 7 Tage: FSRS allein
 * - letzte 7 Tage: höchstens alle 2 Kalendertage
 * - letzte 3 Tage: höchstens einmal pro Kalendertag
 * - letzte 24 Stunden: ebenfalls einmal pro Tag, aber höchste Priorität
 *
 * Der Lerntag selbst wird nie doppelt benutzt. Die Funktion sagt nur, ob die
 * Deadline einen *früheren* Abruf rechtfertigt; das eigentliche Ergebnis wird
 * danach weiterhin ganz normal an FSRS zurückgegeben.
 */
function deadlineUrgency(item: DueItem, today: DayKey, now: number): number {
  const neededByAt = item.neededByAt
  if (neededByAt === undefined || now >= neededByAt) return 0
  const remaining = neededByAt - now
  if (remaining > 7 * DAY_MS) return 0

  const lastDay = item.memory.lastDay
  if (lastDay === today) return 0
  const daysSinceReview = lastDay === undefined ? Number.POSITIVE_INFINITY : daysBetween(lastDay, today)

  if (remaining <= DAY_MS) return daysSinceReview >= 1 ? 3 : 0
  if (remaining <= 3 * DAY_MS) return daysSinceReview >= 1 ? 2 : 0
  return daysSinceReview >= 2 ? 1 : 0
}

/**
 * Die fälligen Informationen, nach Dringlichkeit geordnet und gedeckelt.
 *
 * Ohne Deadline bleibt die historische Regel exakt bestehen: **am längsten
 * überfällig zuerst**. Bei I5 darf ein real naher Termin davor rücken. Nach
 * dem Zielzeitpunkt wird ein termingebundener Inhalt nicht mehr aufgrund
 * dieses Plans abgefragt — „für die Präsentation“ heißt nicht „am Tag danach“.
 *
 * `now` ist optional, damit reine FSRS-Aufrufer und ältere Tests unverändert
 * bleiben. Die App übergibt ihn; erst dann greift die I5-Schicht.
 */
export function selectDue(
  items: readonly DueItem[],
  today: DayKey,
  limit: number,
  now?: number,
): DueItem[] {
  if (limit <= 0) return []
  return items
    .filter((item) => {
      if (now !== undefined && item.neededByAt !== undefined && now >= item.neededByAt) {
        return false
      }
      return overdueBy(item.memory, today) >= 0 || (now !== undefined && deadlineUrgency(item, today, now) > 0)
    })
    .sort((a, b) => {
      if (now !== undefined) {
        const urgency = deadlineUrgency(b, today, now) - deadlineUrgency(a, today, now)
        if (urgency !== 0) return urgency
        if (a.neededByAt !== undefined && b.neededByAt !== undefined && a.neededByAt !== b.neededByAt) {
          return a.neededByAt - b.neededByAt
        }
      }
      const difference = overdueBy(b.memory, today) - overdueBy(a.memory, today)
      return difference !== 0 ? difference : a.itemId.localeCompare(b.itemId)
    })
    .slice(0, limit)
}

/**
 * Wie viele Wiederholungen passen in ein Zeitbudget?
 *
 * Grob gerechnet mit drei Sekunden je Wort — abrufen geht schneller als
 * einprägen, weil nichts gezeigt werden muss. Nie mehr als zwölf: Darüber
 * wird der Abrufblock zu einer Prüfung, und die Einheit verliert ihren
 * Charakter.
 */
export function dueLimitFor(seconds: number): number {
  return Math.min(12, Math.max(0, Math.floor(seconds / 3)))
}
