/**
 * Das Wiedersehen als Maß (Backlog K1, K5, K8 · D-019).
 *
 * Hier steht die Antwort auf eine Frage, die im Backlog noch „XP und Level“
 * hieß: **Was zählt ANITEW, wenn es Fortschritt zeigt?**
 *
 * Nicht Punkte. Punkte sind eine erfundene Währung — ihre Zahl ist beliebig,
 * ihre Skala auch, und genau deshalb lässt sich mit ihnen jedes Gefühl
 * herstellen, das man herstellen will. Sie einfach umzubenennen hätte nichts
 * geheilt (R-1).
 *
 * Gezählt wird stattdessen ein **Ereignis, das wirklich stattgefunden hat**:
 *
 *   Ein Wiedersehen = eine Information, die nach ihrem ersten Tag
 *   noch einmal abgefragt wurde.
 *
 * ── Warum ausgerechnet das ─────────────────────────────────────────────────
 *
 * 1. **Es ist der Vorgang, auf dem die App steht.** Etwas nach Tagen wieder
 *    aus dem Kopf zu holen, ist das Lernen selbst (C5, `science.retrieval`) —
 *    nicht die verbrachte Zeit, nicht die Zahl der geöffneten Einheiten.
 * 2. **Es ist das Wort, das die App ohnehin benutzt.** Der Wiederholungsblock
 *    heißt seit M1 „das Wiedersehen“. Ein Maß, das man erklären muss, ist
 *    schon deshalb das falsche.
 * 3. **Es lässt sich nicht farmen.** Das ist der entscheidende Punkt. Niemand
 *    bekommt mehr Wiedersehen, indem er heute länger übt — sie kommen, wenn
 *    der Plan sagt, dass etwas fällig ist (C1). Die einzige Art, die Zahl zu
 *    erhöhen, ist: etwas lernen und an späteren Tagen wiederkommen. Genau
 *    das, was XP nie leisten kann, weil XP für das Mahlen gemacht ist.
 * 4. **Es schrumpft nie.** Eine Zahl, die bei Nichtstun kleiner wird, ist
 *    Angstdruck mit anderen Mitteln (D-015). Was gewesen ist, bleibt gewesen.
 *
 * ── Gerechnet, nicht fortgeschrieben ──────────────────────────────────────
 *
 * Dieselbe Regel wie bei der Serie (D-015): Die Zahl wird jedes Mal aus den
 * Terminen neu gerechnet. Ein hochgezählter Zähler wäre eine Behauptung, die
 * nach einem Absturz oder einer eingelesenen Sicherung danebenliegen kann —
 * und ausgerechnet die Zahl, die „gezählt und nicht vergeben“ heißt, darf das
 * nicht.
 */

/** Was von einer Information für diese Rechnung gebraucht wird. */
export interface Reviewed {
  /** Wie oft sie insgesamt abgefragt wurde, den ersten Tag eingeschlossen. */
  reviews: number
}

export interface Returns {
  /** Wie oft überhaupt etwas nach seinem ersten Tag zurückkam. */
  total: number
  /** Wie viele Informationen betreut werden — der Bestand. */
  tracked: number
  /**
   * Die längste Kette: wie oft **dieselbe** Information schon zurückkam.
   *
   * Der ehrlichste persönliche Rekord, den diese App hat (K5). Er wächst nur
   * über Wochen, weil die Abstände mit jedem Mal größer werden — er lässt
   * sich also nicht an einem Nachmittag holen.
   */
  longest: number
}

/**
 * Zählt die Wiedersehen.
 *
 * `reviews - 1`, weil die erste Abfrage am Tag des Lernens stattfand: Sie ist
 * kein Wiedersehen, sondern das Kennenlernen. Eine Information, die noch nie
 * zurückkam, trägt deshalb null bei und wird trotzdem als Bestand gezählt —
 * sie wartet ja auf ihren Termin.
 */
export function returnsOf(items: readonly Reviewed[]): Returns {
  let total = 0
  let longest = 0
  let tracked = 0

  for (const item of items) {
    if (item.reviews < 1) continue
    tracked++
    const back = item.reviews - 1
    total += back
    if (back > longest) longest = back
  }

  return { total, tracked, longest }
}
