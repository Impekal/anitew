/**
 * Die Trainingssprache (Backlog L5, L7).
 *
 * **Worin trainiert wird, ist nicht dasselbe wie worin die App spricht.**
 *
 * Der Backlog nennt das ein Alleinstellungsmerkmal, und das ist keine
 * Übertreibung: Wer auf Deutsch bedient wird und auf Englisch trainiert, übt
 * sein Gedächtnis **und** eine Sprache — mit demselben Aufwand und ohne dass
 * die App dafür etwas anderes tun müsste.
 *
 * Möglich ist das nur, weil die Sprache seit M1 am Gegenstand hängt und nicht
 * an der Oberfläche (L5): Die Kennung eines Items lautet `words:de:Anker`, und
 * „Anker“ und „anchor“ sind darin zwei Gedächtnisinhalte, nicht zwei
 * Schreibweisen von einem. Wer die Trainingssprache wechselt, verliert also
 * nichts — er fängt eine zweite Reihe an, und die erste wartet weiter auf
 * ihre Termine.
 *
 * ── Was hier die Regel ist ────────────────────────────────────────────────
 *
 * **Trainiert wird nur in einer Sprache, für die es eigenen Inhalt gibt.**
 * Eine Sprache anzubieten, in der die App dann englische Wörter zeigt, wäre
 * eine Zusage ohne Deckung — dasselbe Muster wie eine Erinnerung, die nicht
 * kommt (R-2, D-022). Für die *Oberfläche* ist der Rückfall auf Englisch in
 * Ordnung und wird angesagt; für den *Inhalt* ist er es nicht, weil der
 * Inhalt die Übung ist.
 */

import { hasBenchmarkPool } from './benchmark/pool.ts'
import { hasMissionPool } from './content/missions.ts'
import { hasNamePool } from './content/names.ts'
import { hasPalacePool } from './content/palace.ts'
import { hasTwinPool } from './content/twins.ts'
import { hasWordPool } from './content/words.ts'
import { FALLBACK_LANGUAGE, SUPPORTED_LANGUAGES, type Language } from './language.ts'

/**
 * Lässt sich in dieser Sprache trainieren?
 *
 * Alle Vorräte müssen da sein, nicht die meisten. Ein Modul, das mitten in
 * einer Einheit auf Englisch umschaltet, wäre schlimmer als eines, das gar
 * nicht kommt — und die Messung (F2a) hinge an einem Vorrat, den es in dieser
 * Sprache nicht gibt.
 */
export function canTrainIn(language: Language): boolean {
  return (
    hasWordPool(language) &&
    hasNamePool(language) &&
    hasMissionPool(language) &&
    hasPalacePool(language) &&
    hasTwinPool(language) &&
    hasBenchmarkPool(language)
  )
}

/** Die Sprachen, in denen sich heute trainieren lässt. */
export function trainingLanguages(): readonly Language[] {
  return SUPPORTED_LANGUAGES.filter(canTrainIn)
}

/**
 * Die Trainingssprache, die gilt.
 *
 * Ohne eigene Wahl ist es die Sprache der Oberfläche — und wenn sich darin
 * nicht trainieren lässt, die Rückfallsprache. Eine gespeicherte Wahl, für
 * die es keinen Inhalt (mehr) gibt, wird **nicht** stillschweigend behalten:
 * Sie führte zu einer Einheit, die es nicht geben kann.
 */
export function resolveTrainingLanguage(
  chosen: string | undefined,
  ui: Language,
): Language {
  if (chosen !== undefined && (SUPPORTED_LANGUAGES as readonly string[]).includes(chosen)) {
    const language = chosen as Language
    if (canTrainIn(language)) return language
  }
  if (canTrainIn(ui)) return ui
  /*
   * Sonst die Rückfallsprache — dieselbe, auf die auch die Oberfläche
   * zurückfällt (D-007). Wer die App auf Englisch angezeigt bekommt, soll
   * nicht plötzlich deutsche Wörter üben, nur weil Deutsch in der Liste
   * zufällig vorn steht. Erst wenn selbst dafür der Inhalt fehlte, bliebe
   * irgendeine Sprache übrig, in der es geht.
   */
  if (canTrainIn(FALLBACK_LANGUAGE)) return FALLBACK_LANGUAGE
  return trainingLanguages()[0] ?? ui
}
