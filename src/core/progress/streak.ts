/**
 * Die Serie (Backlog K2, K5) — nach den Regeln aus D-008.
 *
 * Eine Serie soll **das Zurückkommen belohnen, nicht das Wegbleiben
 * bestrafen.** Apps, die eine 200-Tage-Serie an einem Grippetag vernichten,
 * verlieren den Nutzer nicht an dem Tag, sondern am Tag danach.
 *
 * Deshalb ist sie hier absichtlich schwer zu verlieren:
 *
 * - **Ein Tag zählt, sobald eine Einheit zu Ende gelaufen ist.** Auch die
 *   kürzeste — der Notfallmodus dauert 60 Sekunden, und genau das meint
 *   D-008 mit „ab 60 Sekunden“. Eine abgebrochene Einheit zählt nicht, und
 *   das ist keine Strenge, sondern Ehrlichkeit: Ob jemand trainiert hat oder
 *   das Telefon in der Tasche lag, kann die App nicht unterscheiden.
 * - **Ein Schutztag je sieben Trainingstage**, höchstens zwei auf Vorrat. Ein
 *   verpasster Tag verbraucht einen Schutztag, statt die Serie zu beenden.
 * - **Schutztage sind nicht kaufbar und nicht durch Werbung verdienbar.** Das
 *   wäre genau das Muster, das K7 ausschließt: erst Angst erzeugen, dann
 *   gegen Aufmerksamkeit oder Geld lindern.
 *
 * ── Warum das hier gerechnet und nicht fortgeschrieben wird ────────────────
 *
 * Die Serie ließe sich billiger führen, indem man beim Abschluss einer Einheit
 * einen Zähler erhöht. Sie wird trotzdem **jedes Mal aus den Trainingstagen
 * neu berechnet**, und der Grund ist R-1: Ein fortgeschriebener Zähler ist
 * eine Behauptung, die von der Wirklichkeit abweichen kann — nach einem
 * abgestürzten Schreibvorgang, nach einem eingelesenen Backup von einem
 * zweiten Gerät (N2), nach einer verstellten Uhr. Aus den Tagen gerechnet ist
 * sie eine Auskunft über das, was wirklich passiert ist.
 */

import { addDays, type DayKey } from '../time.ts'

/** Trainingstage je Schutztag. */
export const DAYS_PER_SHIELD = 7

/** Mehr als zwei Schutztage lassen sich nicht ansparen. */
export const MAX_SHIELDS = 2

export interface Streak {
  /** Länge der laufenden Serie in Tagen. */
  length: number
  /** Ist heute schon trainiert worden? */
  trainedToday: boolean
  /** Schutztage auf Vorrat, 0 bis `MAX_SHIELDS`. */
  shields: number
  /** Wie viele Schutztage die laufende Serie schon getragen haben. */
  shieldsUsed: number
  /** Die längste je erreichte Serie — ein persönlicher Rekord (K5). */
  best: number
  /**
   * Hat ein Schutztag **gestern** eingesprungen?
   *
   * Nur dafür da, es dem Nutzer zu sagen — und zwar an dem Tag, an dem es
   * zählt. „Ein Schutztag hat die Serie gehalten“ ist die Nachricht, die
   * jemand nach einem verpassten Tag braucht; drei Wochen später wäre
   * derselbe Satz nur noch Möbel (G-2).
   */
  heldYesterday: boolean
}

const EMPTY: Streak = {
  length: 0,
  trainedToday: false,
  shields: 0,
  shieldsUsed: 0,
  best: 0,
  heldYesterday: false,
}

/**
 * Rechnet die Serie aus den Tagen, an denen trainiert wurde.
 *
 * `days` darf in beliebiger Reihenfolge kommen und Doppelte enthalten — zwei
 * Einheiten an einem Tag sind ein Tag. Tage **nach** `today` werden
 * übergangen: Eine verstellte Uhr soll keine Serie erzeugen, die es nicht
 * gibt (Backlog P5).
 */
export function streakOf(days: readonly DayKey[], today: DayKey): Streak {
  const trained = new Set(days.filter((day) => day <= today))
  if (trained.size === 0) return EMPTY

  const first = [...trained].sort()[0] as DayKey

  let length = 0
  let best = 0
  let shields = 0
  let shieldsUsed = 0
  let sinceShield = 0
  let heldYesterday = false
  const yesterday = addDays(today, -1)

  for (let day = first; day <= today; day = addDays(day, 1)) {
    if (trained.has(day)) {
      length++
      sinceShield++
      if (sinceShield >= DAYS_PER_SHIELD && shields < MAX_SHIELDS) {
        shields++
        sinceShield = 0
      }
      best = Math.max(best, length)
      continue
    }

    /*
     * Der heutige Tag ist noch nicht vorbei.
     *
     * Ohne diese Ausnahme wäre jeder Morgen ein verpasster Tag — die App
     * würde beim Öffnen einen Schutztag verbrauchen, bevor der Nutzer
     * überhaupt die Gelegenheit hatte, zu trainieren.
     */
    if (day === today) break

    if (shields > 0) {
      shields--
      shieldsUsed++
      if (day === yesterday) heldYesterday = true
      continue
    }

    // Ohne Schutztag reißt die Serie. Der Vorrat beginnt von vorn: Was
    // angespart war, gehörte zu einer Serie, die es nicht mehr gibt.
    length = 0
    shieldsUsed = 0
    sinceShield = 0
    heldYesterday = false
  }

  return { length, trainedToday: trained.has(today), shields, shieldsUsed, best, heldYesterday }
}
