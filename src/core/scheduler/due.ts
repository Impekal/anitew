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

import type { DayKey } from '../time.ts'

import { overdueBy } from './memory.ts'
import type { Memory } from './memory.ts'

export interface DueItem {
  itemId: string
  memory: Memory
}

/**
 * Die fälligen Informationen, nach Dringlichkeit geordnet und gedeckelt.
 *
 * Reihenfolge: **am längsten überfällig zuerst**. Was am weitesten über
 * seinen Termin hinaus ist, ist am ehesten schon vergessen — und je länger es
 * liegen bleibt, desto teurer wird es. Bei gleichem Rückstand entscheidet die
 * Kennung, damit die Auswahl reproduzierbar bleibt (A11).
 */
export function selectDue(items: readonly DueItem[], today: DayKey, limit: number): DueItem[] {
  if (limit <= 0) return []
  return items
    .filter((item) => overdueBy(item.memory, today) >= 0)
    .sort((a, b) => {
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
