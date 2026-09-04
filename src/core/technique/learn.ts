/**
 * Der Lernbereich — alle Methoden an einem Ort (Nutzerwunsch 03.09.).
 *
 * Wörtlich: „können wir eine Kategorie/Button einfügen mit Lernen? Wo man
 * dann in Ruhe alle Methoden lernen kann und üben kann … Und man kann
 * jederzeit lernen, weiterlernen, neu anfangen innerhalb jeder Lektion und
 * innerhalb des ganzen."
 *
 * ── Was hier neu ist und was nicht ────────────────────────────────────────
 *
 * **Kein neuer Unterrichtsstoff.** Die vier Lektionen gibt es längst; sie
 * wurden bisher nur *in* einer Einheit gehalten, einmal, wenn der Planer
 * fand, dass es passt. Wer sie damals überflogen hat, kam nie wieder an sie
 * heran. Dieser Bereich macht sie erreichbar — er erfindet sie nicht.
 *
 * **Üben zählt.** Der Nutzer hat entschieden: Was hier geübt wird, ist
 * Training wie jedes andere. FSRS plant die Wiederholung, das Profil bekommt
 * seine Zahlen. Ein Übungsraum, dessen Ergebnisse verschwinden, wäre bequemer
 * zu bauen und eine stille Lüge über das, was gerade passiert ist.
 *
 * Hier steht nur das Modell: was es gibt, wo man steht, was als Nächstes
 * dran wäre. Kein Text, kein SVG, kein Speicher (D-010).
 */

import type { ModuleId } from '../session/planBase.ts'
import { TEACH_ORDER, taughtProgress } from './major.ts'

/**
 * Die vier Methoden, in der Reihenfolge, in der sie sinnvoll aufeinander
 * folgen.
 *
 * Geschichte zuerst, weil sie am wenigsten voraussetzt: Wörter aneinander
 * hängen kann man sofort. Der Palast zuletzt, weil er der aufwendigste ist —
 * er braucht einen Weg, den man erst festlegen muss.
 */
export const LEARN_TOPICS = ['story', 'link', 'major', 'palace'] as const
export type LearnTopic = (typeof LEARN_TOPICS)[number]

/** Das Modul, in dem eine Methode geübt wird. */
export function learnModuleOf(topic: LearnTopic): ModuleId {
  if (topic === 'story') return 'words'
  if (topic === 'link') return 'faces'
  if (topic === 'major') return 'numbers'
  return 'palace'
}

/** Was das Gerät über den Lernstand weiß. */
export interface LearnState {
  readonly storyTaught: boolean
  readonly linkTaught: boolean
  readonly palaceTaught: boolean
  /** Das Verfahren des Major-Systems — der Gedanke vor den zehn Ziffern. */
  readonly majorMethodTaught: boolean
  readonly majorDigits: readonly number[]
}

export interface LearnCard {
  readonly topic: LearnTopic
  readonly module: ModuleId
  /** Ist die Lektion durch? Beim Major heißt das: Verfahren **und** alle Ziffern. */
  readonly done: boolean
  /** Ist noch gar nichts davon gelernt? Dann heißt der Knopf „Lernen", nicht „Weiterlernen". */
  readonly untouched: boolean
  /**
   * Der Fortschritt, wo es einen gibt.
   *
   * Nur das Major-System hat einen: Es sind zehn Ziffern und ein Verfahren,
   * und wer bei drei steht, will das sehen. Die anderen drei sind je ein
   * Gedanke in drei Schritten — dort wäre „1 von 1" eine Zahl, die so tut,
   * als wäre sie eine Messung.
   */
  readonly progress?: { readonly known: number; readonly total: number }
  /** Die nächste Ziffer, die zu erklären wäre — nur beim Major-System. */
  readonly nextDigit?: number
}

/**
 * Der Stand aller vier Methoden.
 *
 * Beim Major-System zählt das Verfahren als eigener Schritt mit: Wer die
 * zehn Zuordnungen kennt, aber nie gehört hat, wozu sie gut sind, hält sie
 * für eine Marotte — genau so wurde es am 01.09. gemeldet.
 */
export function learnCards(state: LearnState): readonly LearnCard[] {
  return LEARN_TOPICS.map((topic) => {
    const module = learnModuleOf(topic)
    if (topic !== 'major') {
      const done =
        topic === 'story' ? state.storyTaught : topic === 'link' ? state.linkTaught : state.palaceTaught
      return { topic, module, done, untouched: !done }
    }
    const ziffern = taughtProgress(state.majorDigits)
    const known = ziffern.known + (state.majorMethodTaught ? 1 : 0)
    const total = ziffern.total + 1
    return {
      topic,
      module,
      done: known === total,
      untouched: known === 0,
      progress: { known, total },
      nextDigit: TEACH_ORDER.find((digit) => !state.majorDigits.includes(digit)),
    }
  })
}

/**
 * Wie weit man insgesamt ist — für die Zeile über der Liste.
 *
 * Gezählt werden Lektionen, nicht Ziffern: Sonst wögen die zehn Major-Ziffern
 * zehnmal so schwer wie der Gedächtnispalast, und der Balken sagte mehr über
 * die Zählweise als über den Menschen.
 */
export function learnProgress(state: LearnState): { known: number; total: number } {
  const karten = learnCards(state)
  return { known: karten.filter((karte) => karte.done).length, total: karten.length }
}
