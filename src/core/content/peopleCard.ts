/**
 * Die Form einer Persönlichkeitskarte — ohne die Personen selbst.
 *
 * Getrennt von `people.ts` aus einem einzigen, messbaren Grund: Der Planer
 * braucht beim Bewerten nur zu wissen, **wo in der Karte das Jahr steht** —
 * nicht, wer alles drinsteht. Stünde die Funktion in derselben Datei wie die
 * Liste, zöge der Planer die ganze Liste in den Kaltstart, und die wird beim
 * ersten Bild nicht gebraucht.
 *
 * Gemessen: mit der Liste im Kaltstart 166,7 von 167 KB — drei Zehntel Luft.
 * Ohne sie sind es wieder 164,4.
 */

import { OWN_SEPARATOR } from './own.ts'

/** Das Trennzeichen zwischen den drei Angaben der Antwortseite. */
export const PERSON_PART_SEPARATOR = ' · '

/**
 * Das Geburtsjahr aus einer Karte — die Antwort, die abgefragt wird.
 *
 * ── Warum nur das Jahr abgefragt wird ─────────────────────────────────────
 *
 * Eingeprägt wird die ganze Karte: „Lionel Messi — 1987 · Fußball ·
 * Argentinien". Abgefragt wird davon **eine** Angabe, und zwar die Zahl.
 *
 * Drei Angaben in ein Feld tippen zu lassen, dazu die Trennpunkte, wäre auf
 * einem Telefon eine Tastaturübung und keine Gedächtnisübung — und die
 * Bewertung müsste dann raten, ob „Fußball, Argentinien, 1987" richtig ist.
 * Dieselbe Überlegung wie beim Palast: Der Weg steht da, gefragt ist der
 * Gegenstand.
 *
 * Das Jahr ist dabei die richtige Wahl, weil es die Angabe ist, die man
 * wirklich vergisst — Fach und Herkunft haften bei bekannten Menschen fast
 * von selbst. Und es ist eine Zahl: Sie lässt sich **genau** bewerten, ohne
 * dass jemand Punkte für ein Ungefähr bekommt (D-012).
 *
 * Fach und Herkunft stehen beim Einprägen mit da. Sie sind nicht Zierrat,
 * sondern der Haken, an dem die Zahl hängt.
 */
export function personYearOf(item: string): string {
  const antwort = item.split(OWN_SEPARATOR)[1] ?? item
  return antwort.split(PERSON_PART_SEPARATOR)[0] ?? antwort
}
