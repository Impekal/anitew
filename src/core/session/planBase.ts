/**
 * Der Bauplan einer Trainingseinheit (Backlog B2/B3).
 *
 * Das Zeitbudget ist eine **Zusage, keine Schätzung**: Die Summe aller Blöcke
 * ist auf die Sekunde genau die Länge des Modus. Wer „5 Minuten“ verspricht
 * und dann 5:40 braucht, hat das eine Versprechen gebrochen, auf dem diese App
 * steht — und der Nutzer merkt es beim dritten Mal.
 *
 * Umgekehrt ist das Budget eine **Obergrenze**: Wer einen Abrufblock früher
 * beendet, ist früher fertig. Zeit zurückzuhalten, nur damit die Zahl stimmt,
 * wäre Beschäftigung statt Training.
 *
 * B3 nennt für die volle Einheit fünf Blöcke (Focus, Encode, Recall, Working
 * Memory, Spaced Recall). Von deren Modulen gibt es bisher zwei. Statt die
 * fehlenden zu behaupten, plant ANITEW **Runden aus Einprägen und Abrufen** —
 * und wächst, sobald die anderen Module da sind (M2/M4).
 */

import { MODES, type TrainingMode } from '../modes.ts'
import { createRng } from '../rng.ts'
import type { DayKey } from '../time.ts'
import { faceDistance } from '../content/faces.ts'
import { answerFor, factKindOf, missionFacts, personOf } from '../content/missions.ts'
import { factAnswer, factPrompt } from '../content/own.ts'
import {
  memoryLabelsOf,
  memorySceneItems,
  memorySubjectOf,
  memoryTargetOf,
} from '../memory/missionComposer.ts'
import { objectFor, walkOf, walkPlacements } from '../content/palace.ts'
import type { Language } from '../language.ts'
import { reversed } from '../content/spans.ts'
import { twinChoices, twinShown } from '../content/twins.ts'
import {
  gazeAnswer,
  gazeObjectName,
  gazePlacements,
  gazeSceneOf,
} from '../content/gaze.ts'
import { nextToTeach } from '../technique/major.ts'
import {
  type EncodingLesson,
  encodingModuleOf,
  nextEncodingLesson,
} from '../technique/encodings.ts'
import type { Leniency } from './grading.ts'

/** Sekunden, die ein einzelnes Wort beim Einprägen bekommt. */
export const SECONDS_PER_ITEM = 4

/** Nie weniger als 3 und nie mehr als 8 Wörter je Runde. */
export const MIN_ITEMS_PER_ROUND = 3
export const MAX_ITEMS_PER_ROUND = 8

/** Kürzeste sinnvolle Runde. Darunter lohnt das Aufteilen nicht. */
const SECONDS_PER_ROUND = 90
const MAX_ROUNDS = 8

/** Anteil einer Runde, der aufs Einprägen entfällt. Der Rest ist Abruf. */
const ENCODE_SHARE = 0.4

/**
 * Anteil der Einheit für das Wiedersehen mit früheren Tagen (Backlog D8).
 *
 * B3 sieht dafür 30 von 300 Sekunden vor, also ein Zehntel. Etwas mehr, weil
 * hier das eigentliche Training steckt: Neues einzuprägen kann jeder, das
 * Behalten entscheidet sich beim Abruf nach Tagen. Der Block entfällt
 * vollständig, wenn nichts fällig ist — dann gibt es nichts vorzutäuschen.
 */
const REVIEW_SHARE = 0.15
const MIN_REVIEW_SECONDS = 20

/**
 * Sekunden für eine Lektion (Backlog D5).
 *
 * Vierzehn, weil eine Lektion aus einer Ziffer, zwei Buchstaben und einem Satz
 * besteht — mehr Zeit macht sie nicht besser, weniger reicht nicht zum Lesen.
 * Wer schneller ist, tippt weiter; das Budget ist auch hier eine Obergrenze.
 */
export const TEACH_SECONDS = 14

/**
 * Ab wann überhaupt gelehrt wird.
 *
 * Im Notfallmodus nicht. Sechzig Sekunden sind für den Fall gedacht, dass
 * jemand zwischen Tür und Angel übt — vierzehn davon für eine Lektion wäre
 * ein Viertel der Einheit, und wer es eilig hat, will trainieren und nicht
 * unterrichtet werden. Eine Technik lernt man in Ruhe oder gar nicht.
 */
export const MIN_SECONDS_FOR_TEACHING = 180

/**
 * Ab wann ein Gang durch einen Palast angeboten wird (G, D-017).
 *
 * Der Grund ist Rechnen, und er ist im Bildschirmabzug einer fehlgeschlagenen
 * Prüfung aufgefallen: Ein Gang prägt **fünf Stationen à sechs Sekunden** ein.
 * Im Notfallmodus bleiben nach dem Wiedersehensanteil rund vierzig Sekunden
 * für die Runde — dreißig davon gingen ans Einprägen, und für fünf Fragen
 * blieben zehn. **Zwei Sekunden je Station** sind keine Frage, sondern eine
 * Formalie.
 *
 * Anders als beim Wortmodul lässt sich das nicht durch weniger Stücke lösen:
 * Ein halber Weg ist kein Weg (D-017). Also gibt es den Palast erst, wo er
 * hinpasst. Sechzig Sekunden sind für den Fall gedacht, dass jemand zwischen
 * Tür und Angel übt — ein Gedächtnispalast ist das Gegenteil davon.
 *
 * Der **Wiedersehensblock** bleibt davon unberührt: Was fällig ist, kommt
 * zurück, egal wie kurz die Einheit ist (D-004). Dort wird nichts eingeprägt,
 * es sind nur die Fragen.
 */
export const MIN_SECONDS_FOR_PALACE = 180

export type BlockKind = 'teach' | 'encode' | 'recall' | 'review'

/**
 * Die Trainingsmodule (Backlog D1).
 *
 * Ab hier wird die Modulschnittstelle konkret, und zwar an der einzigen
 * Stelle, an der sie es sein muss: Der Planer weiß, dass es mehrere gibt, und
 * mischt sie. Was ein Modul *zeigt*, weiß er nicht — er kennt nur Kennungen,
 * Zeiten und die Frage, ob der Abruf frei oder gestützt ist.
 */
export const TRAINING_MODULES = [
  'words',
  'faces',
  'numbers',
  'missions',
  'palace',
  'reverse',
  'twins',
  'gaze',
  /*
   * Eigene Inhalte (I · D-032): Frage-Antwort-Paare aus eigenem Stoff.
   * Der Vorrat kommt vom Menschen, nicht aus einem Generator — ist er
   * leer, fällt das Modul über den Vorratsfilter (D-027) still aus der
   * Lernrotation; das Wiedersehen terminierter Paare bleibt unberührt.
   */
  'facts',
  /*
   * Der Memory-Graph als Modul (D-036): Szenen aus den **eigenen**
   * Erinnerungen — der Anker und das, was zu ihm gehört. Der Vorrat
   * kommt vom Missions-Komponisten (schwächste zuerst); leer heißt wie
   * überall: still aus der Lernrotation, Wiedersehen unberührt.
   */
  'memory',
] as const
export type ModuleId = (typeof TRAINING_MODULES)[number]

/**
 * Kognitiv schwere Module (O7).
 *
 * Die Liste ist absichtlich eng: Palast bindet mehrere Dinge an Orte,
 * Rückwärts transformiert aktiv im Arbeitsgedächtnis, Zwillinge erzeugen
 * gezielte Interferenz. Missionen und Bilder sind anspruchsvoll, aber nicht
 * pauschal "schwer" — sonst würde die Regel die normale Vielfalt ausdünnen.
 */
const COGNITIVELY_HEAVY_MODULES: readonly ModuleId[] = ['palace', 'reverse', 'twins']

export function isCognitivelyHeavy(moduleId: ModuleId): boolean {
  return COGNITIVELY_HEAVY_MODULES.includes(moduleId)
}

/**
 * Freier Abruf oder gestützter?
 *
 * **Wörter frei** — leeres Feld, schreib auf, was geblieben ist. Das ist die
 * stärkere Übung (C5).
 *
 * **Gesichter gestützt** — das Gesicht steht da, gesucht ist der Name. Anders
 * geht es nicht: „Nenne alle Gesichter“ ist keine Frage, die sich beantworten
 * lässt. Das ist keine Bequemlichkeit, sondern die Natur der Aufgabe — und
 * genau die Aufgabe, die im Alltag vorkommt.
 */
export function isPrompted(moduleId: ModuleId): boolean {
  return (
    moduleId === 'faces' ||
    moduleId === 'missions' ||
    moduleId === 'palace' ||
    moduleId === 'reverse' ||
    moduleId === 'twins' ||
    moduleId === 'gaze' ||
    // Eigene Paare: Die Frage steht da, gesucht ist die Antwort — wie beim
    // Gesicht ist das die Aufgabe, die im Alltag vorkommt (D-032).
    moduleId === 'facts' ||
    // Memory-Szenen fragen am Anker: „Daniel — was gehört dazu?“ (D-036).
    moduleId === 'memory'
  )
}

/**
 * Rechnet dieses Modul mit dem Wiederholungsplan ab? (D7 · D-026)
 *
 * Fast alle: Was heute eingeprägt wurde, kommt nach Tagen zurück — das ist
 * das Behalten. **Das Arbeitsgedächtnis nicht**: Seine Aufgabe ist das
 * Umbauen im Moment, nicht das Behalten. Eine Ziffernfolge von letzter
 * Woche „rückwärts wiederzusehen“ wäre eine Langzeitfrage im Kostüm einer
 * Arbeitsgedächtnisübung — und die Achse im Profil zählte dann das Falsche.
 */
export function entersReview(moduleId: ModuleId): boolean {
  return moduleId !== 'reverse'
}

/**
 * Fragt dieses Modul ohne eigene Einprägephase? (D7)
 *
 * Beim Rückwärts-Abruf gehören Zeigen und Fragen in einen Atemzug: Die
 * Folge steht kurz da, verschwindet, und die Antwort ist sofort dran. Ein
 * getrennter Einprägeblock hieße, mehrere Folgen erst zu lesen und später
 * abzurufen — das prüfte das Langzeitgedächtnis, nicht das Umbauen.
 */
export function asksOnSight(moduleId: ModuleId): boolean {
  return moduleId === 'reverse'
}

/**
 * Sekunden je Rückwärts-Frage: kurz zeigen (siehe REVEAL_SECONDS in der
 * Oberfläche), im Kopf drehen, eintippen. Fünfzehn sind bemessen, nicht
 * gemessen — D2 (adaptive Schwierigkeit) wird sie später wandern lassen.
 */
export const SECONDS_PER_REVERSE_PROMPT = 15
const MIN_REVERSE_PROMPTS = 2
const MAX_REVERSE_PROMPTS = 6

/**
 * Module, deren Runde **eine Szene** ist und keine Reihe von Stücken.
 *
 * Zwei gibt es davon, und sie sind sich in der Bauform gleich (D-014): Eine
 * Mission bindet vier Tatsachen an eine Person, ein Gang bindet fünf
 * Gegenstände an fünf Orte. Beide würden zerfallen, wenn der Planer sie wie
 * einen Vorrat behandelte und drei halbe Szenen abzählte.
 */
export function isScene(moduleId: ModuleId): boolean {
  return moduleId === 'missions' || moduleId === 'palace' || moduleId === 'gaze' || moduleId === 'memory'
}

/** Die Stücke einer Szene zu ihrem Anker. */
export function sceneItemsOf(moduleId: ModuleId, anchor: string): readonly string[] {
  if (moduleId === 'palace') return walkPlacements(anchor)
  if (moduleId === 'gaze') return gazePlacements(anchor)
  // Memory (D-036): Die Kennung trägt die ganze Szene — Anker und Dinge.
  if (moduleId === 'memory') return memorySceneItems(anchor)
  return missionFacts(anchor)
}

/**
 * Sekunden je Gegenstand beim Einprägen.
 *
 * Eine **Szene** braucht länger als ein Wort: Bei einer Mission stehen Person,
 * Zimmer, Gegenstand, Uhrzeit und Ort gleichzeitig da, und gemerkt werden soll
 * nicht jedes für sich, sondern ihr Zusammenhang. Vier Sekunden reichen für
 * ein Wort und nicht für eine Bindung.
 *
 * Dass die Betrachtungszeit später mit der Schwierigkeit wandert, steht als
 * H6 im Backlog. Hier ist sie erst einmal eine Eigenschaft des Moduls.
 */
export function secondsPerItemFor(moduleId: ModuleId): number {
  /*
   * Der Palast bekommt am meisten Zeit, und das ist der Kern der Technik:
   * An dieser Stelle soll der Nutzer nicht lesen, sondern **ein Bild bauen**
   * — den Toaster im Flur, groß, im Weg, unübersehbar. Das dauert länger als
   * ein Wort anzusehen, und wer es nicht tut, hat nur eine Liste gelesen.
   */
  if (moduleId === 'palace') return 6
  // Eine echte Erinnerung (D-036) bekommt dieselbe Zeit wie ein Palastort:
  // Hier soll ein Bild entstehen, das Daniel und Madrid zusammenhält.
  if (moduleId === 'memory') return 6
  // Ein Bild (gaze) wie eine Mission: Vier Dinge und ihre Farben sollen
  // **zusammen** gesehen werden, nicht nacheinander gelesen.
  // Ein eigenes Paar (facts) ebenso: Frage und Antwort sollen zu einer
  // Brücke werden, nicht zwei gelesene Wörter bleiben (D-032).
  return moduleId === 'missions' || moduleId === 'gaze' || moduleId === 'facts'
    ? 5
    : SECONDS_PER_ITEM
}

/**
 * Der Anker, an dem ein Gegenstand hängt.
 *
 * Bei einer Mission ist das die Person: `Elena#room` gehört zu Elena. Überall
 * sonst ist der Gegenstand sein eigener Anker.
 *
 * Gebraucht wird das an einer Stelle, an der es sonst still schiefginge —
 * beim Aussortieren der fälligen Einträge aus dem Vorrat: Ist heute
 * `Elena#room` fällig, darf Elena nicht noch einmal als **neue** Szene
 * kommen. Sonst prüfte das Wiedersehen eine Erinnerung von vor zwei Minuten.
 */
export function subjectOf(moduleId: ModuleId, item: string): string {
  if (moduleId === 'palace') return walkOf(item)
  /*
   * Bei den Zwillingen ist der Anker das **Paar**, nicht die Orientierung:
   * `Kirche%Kirsche` und `Kirsche%Kirche` sind dieselbe Unterscheidung.
   * Ohne das könnte ein Paar, dessen eine Seite heute fällig ist, mit der
   * anderen Seite als „neu“ kommen — zwei Termine mit gegensätzlichen
   * Antworten auf dieselbe Frage (D-027).
   */
  if (moduleId === 'twins') return twinChoices(item).join('%')
  // Beim Bild ist der Anker die Szene: `bild~7#umbrella` gehört zu `bild~7`.
  if (moduleId === 'gaze') return gazeSceneOf(item)
  // Memory: Anker der Szene — „Daniel“, ob Kennung oder Stück (D-036).
  if (moduleId === 'memory') return memorySubjectOf(item)
  return moduleId === 'missions' ? personOf(item) : item
}

/**
 * Die gesuchte Antwort zu einem Gegenstand.
 *
 * Überall außer bei den Missionen ist der Gegenstand seine eigene Antwort:
 * Beim Wort „Anker“ ist „Anker“ gefragt, beim Gesicht „Elena“ der Name. Bei
 * einer Mission steht in der Kennung `Elena#room`, gefragt ist aber „314“ —
 * die Szene wird aus dem Anker neu erzeugt.
 */
export function targetOf(moduleId: ModuleId, item: string, language: string): string {
  if (moduleId === 'palace') return objectFor(item, language as Language) ?? item
  // Rückwärts: Die Kennung ist die gezeigte Folge, gesucht ist ihr Spiegel.
  if (moduleId === 'reverse') return reversed(item)
  // Zwillinge: Gezeigt war die erste Seite der Kennung — sie ist die Antwort.
  if (moduleId === 'twins') return twinShown(item)
  // Bild: Gesucht ist die Farbe des Dings, in der Trainingssprache benannt.
  if (moduleId === 'gaze') return gazeAnswer(item, language as Language) ?? item
  // Eigenes Paar: Die Kennung trägt beide Seiten, gesucht ist die Antwort.
  if (moduleId === 'facts') return factAnswer(item)
  // Memory: gesucht ist das Ding am Anker (D-036).
  if (moduleId === 'memory') return memoryTargetOf(item)
  if (moduleId !== 'missions') return item
  return answerFor(item, language as Language) ?? item
}

/**
 * Wie ein Gegenstand im Ergebnis lesbar dasteht.
 *
 * `Elena#room` ist eine Kennung und kein Satz. In der Zusammenfassung soll
 * stehen, woran man sich erinnert hat — „Elena · 314“ —, nicht, wie die
 * Datenbank es nennt.
 */
export function displayOf(moduleId: ModuleId, item: string, language: string): string {
  /*
   * Rückwärts zeigt die Zusammenfassung die **gesuchte** Folge — das ist,
   * was jemand geleistet hat. Die gezeigte stünde da wie eine fremde Zahl.
   */
  if (moduleId === 'reverse') return reversed(item)
  // Zwillinge: In der Zusammenfassung steht das Wort, das dastand.
  if (moduleId === 'twins') return twinShown(item)
  // Bild: „Schirm · Rot“ — woran man sich erinnert hat, lesbar.
  if (moduleId === 'gaze') {
    const object = gazeObjectName(item, language as Language)
    const answer = gazeAnswer(item, language as Language)
    return object !== undefined && answer !== undefined ? `${object} · ${answer}` : item
  }
  /*
   * Beim Palast steht nur der Gegenstand da, ohne seine Station.
   *
   * Anders als bei einer Mission trägt er sich selbst: „314“ allein sagt
   * nichts, „Toaster“ schon. Und in der Zusammenfassung steht, woran man sich
   * erinnert hat — nicht, wo es lag.
   */
  if (moduleId === 'palace') return objectFor(item, language as Language) ?? item
  // Eigenes Paar: „Frage · Antwort“ — lesbar, nicht die Kennung mit dem
  // unsichtbaren Trennzeichen.
  if (moduleId === 'facts') return `${factPrompt(item)} · ${factAnswer(item)}`
  // Memory: „Daniel · Madrid“ — woran man sich erinnert hat (D-036).
  if (moduleId === 'memory') {
    const labels = memoryLabelsOf(item)
    return `${labels.subject} · ${labels.target}`
  }
  if (moduleId !== 'missions') return item
  const answer = answerFor(item, language as Language)
  return answer === undefined ? item : `${personOf(item)} · ${answer}`
}

/**
 * Wie streng dieses Modul vergleicht.
 *
 * **Zahlen genau, alles andere nachsichtig.** Bei Wörtern und Namen ist ein
 * Tippfehler ein Tippfehler — gemessen werden soll das Gedächtnis, nicht die
 * Tastatur. Bei einer Zahl sind zwei vertauschte Ziffern eine *andere Zahl*:
 * 4719 und 4791 sind nicht dieselbe PIN. Dort milde zu sein hieße, die
 * Aufgabe abzuschaffen und trotzdem einen Punkt zu geben.
 *
 * Die Strenge gehört zum Modul und nicht in die Bewertungsfunktion, weil sie
 * eine Aussage über den **Gegenstand** ist und nicht über das Verfahren.
 */
export function leniencyFor(moduleId: ModuleId, item?: string): Leniency {
  // Ziffern beidesmal: vertauscht ist falsch — genau das ist hier die Übung.
  if (moduleId === 'numbers' || moduleId === 'reverse') return 'exact'
  /*
   * Zwillinge exakt — zwingend: Der Köder liegt genau eine Schreibabweichung
   * entfernt. Mit Tippfehler-Nachsicht träfe „Kirche“ auch „Kirsche“, und
   * die Aufgabe wäre abgeschafft, während sie Punkte vergibt.
   */
  if (moduleId === 'twins') return 'exact'
  /*
   * Eigene Paare: Die Strenge folgt dem **Gegenstand** (dieselbe Überlegung
   * wie bei den Missionen): Ist die Antwort eine Zahl — PIN, Jahreszahl,
   * Hausnummer —, sind vertauschte Ziffern eine andere Antwort. Sonst ist
   * ein Tippfehler ein Tippfehler.
   */
  if (moduleId === 'facts') {
    return /^\d+$/.test(factAnswer(item ?? '')) ? 'exact' : 'typos'
  }
  // Memory (D-036): dieselbe Regel — eine Zahl als Antwort ist exakt.
  if (moduleId === 'memory') {
    return /^\d+$/.test(memoryTargetOf(item ?? '')) ? 'exact' : 'typos'
  }
  if (moduleId === 'missions') {
    /*
     * Innerhalb einer Mission ist die Strenge **je Tatsache** verschieden, und
     * das folgt aus derselben Überlegung wie D-012: Zimmernummer und Uhrzeit
     * sind Zahlen — 314 und 341 sind nicht dasselbe Zimmer, 18:40 und 18:04
     * nicht dieselbe Abfahrt. Der Gegenstand und der Name des Lokals sind
     * Wörter, und dort ist ein Tippfehler ein Tippfehler.
     */
    const kind = factKindOf(item ?? '')
    return kind === 'room' || kind === 'time' ? 'exact' : 'typos'
  }
  return 'typos'
}

export interface BlockPlan {
  /** Eindeutig innerhalb der Einheit, z. B. `r2-encode`. */
  id: string
  kind: BlockKind
  moduleId: ModuleId
  /** Ab 1 gezählt — die Runde, zu der dieser Block gehört. */
  round: number
  seconds: number
  /** Die Wörter dieser Runde. Beim Abruf das, was gesucht wird. */
  items: readonly string[]
}

export interface SessionPlan {
  mode: TrainingMode
  /** Das Modul, das heute Vorrang bekommen hat — oder keins (E5, E6). */
  focus?: ModuleId
  day: DayKey
  /** Die Trainingssprache. Sie gehört zur Einheit, nicht zur Oberfläche —
      dieselbe Einheit auf Deutsch und auf Japanisch sind zwei Einheiten. */
  language: string
  /** Aus ihm folgt die Wortauswahl — gleicher Seed, gleiche Einheit. */
  seed: string
  totalSeconds: number
  blocks: readonly BlockPlan[]
}

export interface PlanInput {
  mode: TrainingMode
  day: DayKey
  language: string
  seed: string
  /** Der Vorrat je Modul in der Trainingssprache. */
  pools: Pools
  /**
   * Einträge aus früheren Tagen, die heute fällig sind — je Modul, bereits
   * ausgewählt und gedeckelt (siehe `scheduler/due.ts`). Leer heißt: kein
   * Wiederholungsblock.
   */
  due?: Partial<Record<ModuleId, readonly string[]>>
  /**
   * Ziffern des Major-Systems, die schon gelehrt wurden (D5). Fehlt der Wert,
   * wird nicht gelehrt — eine Einheit ohne diese Angabe soll nicht plötzlich
   * bei der Eins anfangen.
   */
  taught?: readonly number[]
  /**
   * Wurde der Gedächtnispalast schon erklärt (G)?
   *
   * Anders als beim Major-System ist das **eine** Lektion und keine zehn: Die
   * Technik ist in vier Sätzen erzählt, der Rest ist Übung. Fehlt der Wert,
   * wird nicht gelehrt — dieselbe Vorsicht wie bei `taught`.
   */
  palaceTaught?: boolean
  /**
   * Wurden Geschichte und Verknüpfung schon erklärt (D5 · D-013)?
   * Je eine Lektion, dieselbe Vorsicht wie beim Palast: Fehlt der Wert,
   * wird nicht gelehrt.
   */
  storyTaught?: boolean
  linkTaught?: boolean
  /**
   * Die adaptive Verschiebung je Modul (D2): ein Stück mehr, eines
   * weniger, oder nichts — gerechnet aus den letzten Antworten
   * (`itemsDeltaFor`), nie gespeichert. Die Grenzen der Runde halten
   * trotzdem; fehlt der Wert, bleibt alles beim Alten.
   */
  difficulty?: Partial<Record<ModuleId, -1 | 0 | 1>>
  /**
   * Das Modul, das heute Vorrang bekommt (Backlog E5).
   *
   * Kommt aus dem Gedächtnisprofil und **nur dann**, wenn sich zwei Achsen
   * wirklich unterscheiden (`weakest`). Der Planer prüft das nicht nach — er
   * bekommt entweder einen Schwerpunkt oder keinen. Ein Modul, das hier gar
   * nicht gelernt werden kann (der Palast in einer kurzen Einheit), wird
   * stillschweigend übergangen; angekündigt wurde es dann auch nicht, weil
   * der Startbildschirm dieselbe Regel benutzt (`learnableModules`).
   */
  focus?: ModuleId
  /**
   * Welche Module dürfen heute vorkommen? Voreingestellt alle. Der Parameter
   * ist da, damit ein Test ein einzelnes Modul erzwingen kann, ohne dass der
   * Planer dafür eine Sonderregel bekommt.
   */
  modules?: readonly ModuleId[]
}

export type Pools = Readonly<Record<ModuleId, readonly string[]>>

/**
 * Woraus in einer Einheit dieser Länge überhaupt gelernt werden kann.
 *
 * Steht als eigene Funktion da, weil die Regel an **zwei** Stellen gebraucht
 * wird: hier beim Planen und auf dem Startbildschirm, der den Schwerpunkt
 * ankündigt (E6). Zweimal geschrieben wären es zwei Regeln, die irgendwann
 * auseinanderlaufen — und dann verspräche die App einen Schwerpunkt, den der
 * Plan nicht einhält.
 */
export function learnableModules(
  totalSeconds: number,
  modules: readonly ModuleId[] = TRAINING_MODULES,
): readonly ModuleId[] {
  if (totalSeconds >= MIN_SECONDS_FOR_PALACE || modules.length === 1) return modules
  return modules.filter((moduleId) => moduleId !== 'palace')
}

export function planSession(input: PlanInput): SessionPlan {
  const totalSeconds = MODES[input.mode].seconds
  const modules = input.modules ?? TRAINING_MODULES

  /*
   * Woraus **gelernt** wird — und nur das.
   *
   * In einer sehr kurzen Einheit fällt der Palast hier heraus (siehe
   * `MIN_SECONDS_FOR_PALACE`). Ein Test darf ihn erzwingen, indem er ihn als
   * einziges Modul verlangt; sonst ließe sich das kürzeste Zusammenspiel
   * nicht mehr prüfen.
   *
   * **Das Wiedersehen bleibt davon unberührt**, und das war beim ersten
   * Anlauf falsch: Ich hatte die Liste vor der Auswahl der fälligen Einträge
   * gekürzt — damit wäre ein fälliger Gang in einer 60-Sekunden-Einheit
   * stillschweigend liegengeblieben. Ein Kerntest hat es gefunden. Was fällig
   * ist, kommt zurück (D-004); dort wird nichts eingeprägt, es sind nur die
   * Fragen.
   */
  const learnFromByTime = learnableModules(totalSeconds, modules)

  // Nur Module, für die heute wirklich etwas fällig ist. Ein leerer
  // Wiederholungsblock wäre eine Frage ohne Gegenstand.
  const dueByModule = modules
    .map((moduleId) => ({ moduleId, items: input.due?.[moduleId] ?? [] }))
    .filter((entry) => entry.items.length > 0)

  /*
   * Und aus dem, was übrig ist, nur Module mit **genug Vorrat** (D-027).
   *
   * Neu seit den Zwillingen: Deren Vorrat ist endlich — fünfzehn Paare, und
   * wer alle gelernt hat, lernt dort nichts Neues mehr. Ein Modul mit
   * leerem Vorrat in der Rotation zu lassen hieße mitten in der Einheit zu
   * scheitern; es stillschweigend zu ziehen und leer zu zeigen wäre
   * schlimmer. Es fällt aus der **Lern**-Rotation — das Wiedersehen bleibt
   * unberührt, denn dort wird nichts aus dem Vorrat gezogen (D-004).
   */
  const learnFrom =
    learnFromByTime.length === 1
      ? // Ein erzwungenes Einzelmodul (Tests) fällt nicht still heraus —
        // es soll unten am beschreibenden Fehler scheitern, wenn der
        // Vorrat wirklich nicht reicht.
        learnFromByTime
      : learnFromByTime.filter((moduleId) => {
          const stock = (input.pools[moduleId] ?? []).length
          if (isScene(moduleId)) return stock >= 1
          return stock >= MIN_ITEMS_PER_ROUND
        })

  // Erst das Wiedersehen abzweigen, dann den Rest in Runden teilen. Anders
  // herum bliebe für die Wiederholung übrig, was zufällig übrig ist — und
  // genau sie ist der Teil, der das Behalten ausmacht.
  const reviewSeconds =
    dueByModule.length === 0
      ? 0
      : Math.max(MIN_REVIEW_SECONDS * dueByModule.length, Math.round(totalSeconds * REVIEW_SHARE))
  const learnSeconds = totalSeconds - reviewSeconds

  const rounds = Math.min(MAX_ROUNDS, Math.max(1, Math.floor(learnSeconds / SECONDS_PER_ROUND)))
  const rng = createRng(input.seed)

  /*
   * Welches Modul in welcher Runde? Reihum, mit einem Startversatz aus dem
   * Seed. Ohne den Versatz käme in der kürzesten Einheit — die nur eine Runde
   * hat — immer dasselbe Modul dran, und wer nur den Notfallmodus benutzt,
   * sähe nie ein Gesicht.
   */
  const drawn = rng.int(learnFrom.length)

  /*
   * Steht heute eine Lektion an, beginnt die Einheit mit **Zahlen** (D5).
   *
   * Der erste Anlauf hat das dem Zufall überlassen, und auf dem Bildschirm
   * sah man sofort, warum das falsch ist: Erst wird das Major-System erklärt,
   * dann kommen drei Runden Wörter, und benutzen darf man die frische Technik
   * in Runde drei. Eine Technik, die man nach dem Lernen nicht sofort
   * anwendet, ist am nächsten Tag wieder weg.
   *
   * Der Wurf fällt trotzdem — auch wenn er verworfen wird. Sonst hinge die
   * ganze folgende Mischung daran, ob heute unterrichtet wird, und dieselbe
   * Einheit sähe je nach Lernstand anders aus. Denselben Fehler hatte der
   * Bartwurf im Gesichtsgenerator schon einmal.
   */
  const numbersAt = learnFrom.indexOf('numbers')
  const palaceAt = learnFrom.indexOf('palace')
  const hasTime = totalSeconds >= MIN_SECONDS_FOR_TEACHING

  /*
   * Der Palast wird **einmal** erklärt, und diese eine Lektion geht der
   * ersten Ziffer vor.
   *
   * Nicht aus Vorliebe: Ohne die Erklärung ist ein Palastgang schlicht
   * unverständlich — da stehen fünf Orte und fünf Gegenstände, und niemand
   * weiß, was er damit soll. Eine ungelehrte Major-Ziffer kostet dagegen
   * nichts; die Zahlen lassen sich auch ohne sie üben, nur eben mühsamer.
   */
  const teachesPalace = hasTime && input.palaceTaught === false && palaceAt >= 0

  /*
   * Nach dem Palast kommen Geschichte und Verknüpfung (D5) — **vor** den
   * zehn Major-Ziffern: Wer erst zehn Einheiten lang Ziffern lernt, sieht
   * die Geschichten-Methode in Woche zwei, dabei trägt sie vom ersten Wort
   * an. Der Palast bleibt davor, denn ohne seine Erklärung ist ein Gang
   * unverständlich; eine ungelehrte Einpräge-Technik kostet nur Kraft.
   */
  const encodingLesson: EncodingLesson | undefined =
    hasTime && !teachesPalace
      ? nextEncodingLesson(
          { storyTaught: input.storyTaught, linkTaught: input.linkTaught },
          learnFrom,
        )
      : undefined
  const encodingAt =
    encodingLesson === undefined ? -1 : learnFrom.indexOf(encodingModuleOf(encodingLesson))

  const wantsLesson =
    hasTime &&
    !teachesPalace &&
    encodingLesson === undefined &&
    input.taught !== undefined &&
    nextToTeach(input.taught) !== undefined
  const teachesNumbers = wantsLesson && numbersAt >= 0

  const offset = teachesPalace
    ? palaceAt
    : encodingLesson !== undefined
      ? encodingAt
      : teachesNumbers
        ? numbersAt
        : drawn

  /*
   * Der Schwerpunkt bekommt **jede zweite Runde** (E5).
   *
   * Nicht alle: Eine Einheit, die nur noch das Schwächste übt, ist keine
   * Personalisierung, sondern eine Strafe für eine Schwäche — und sie ließe
   * alles andere verfallen, obwohl der Wiederholungsplan es weiter für fällig
   * hält. Die Hälfte ist der spürbare und trotzdem verträgliche Anteil.
   *
   * Eine Lektion geht vor: Wer heute den Palast erklärt bekommt, fängt mit dem
   * Palast an, auch wenn die Zahlen schwächer sind. Unterricht ohne
   * Anwendung ist am nächsten Tag wieder weg (D5).
   */
  const focus =
    input.focus !== undefined &&
    learnFrom.includes(input.focus) &&
    !teachesPalace &&
    !teachesNumbers &&
    encodingLesson === undefined
      ? input.focus
      : undefined
  const others = focus === undefined ? learnFrom : learnFrom.filter((id) => id !== focus)

  const moduleForRound = (round: number): ModuleId => {
    if (focus === undefined || others.length === 0) {
      return learnFrom[(offset + round - 1) % learnFrom.length] as ModuleId
    }
    if (round % 2 === 1) return focus
    return others[(offset + Math.floor(round / 2) - 1 + others.length) % others.length] as ModuleId
  }

  // Gelehrt wird nur mit Gegenstand: Das Major-System zu erklären und dann
  // keine einzige Zahl zu zeigen wäre Unterricht ohne Anlass.
  const teachSeconds =
    teachesPalace || teachesNumbers || encodingLesson !== undefined ? TEACH_SECONDS : 0
  const roundBudgets = share(learnSeconds - teachSeconds, rounds)
  const blocks: BlockPlan[] = []

  /*
   * Die Lektion steht **vorn**, vor der ersten Runde: Eine Technik, die man
   * nach der Übung erklärt bekommt, hat man bei der Übung nicht gehabt.
   */
  if (teachesPalace) {
    blocks.push({
      id: 'teach-palace',
      kind: 'teach',
      moduleId: 'palace',
      round: 1,
      seconds: teachSeconds,
      /*
       * Kein Gegenstand — die Lektion erklärt die Technik und nicht einen
       * bestimmten Palast. Welcher gleich drankommt, entscheidet die erste
       * Runde, und das ist auch die ehrlichere Reihenfolge: erst wissen,
       * wozu, dann sehen, wo.
       */
      items: [],
    })
  } else if (encodingLesson !== undefined) {
    blocks.push({
      id: `teach-${encodingLesson}`,
      kind: 'teach',
      // Das Modul, in dem die Technik gleich angewandt wird — die erste
      // Runde gehört ihm (Versatz oben).
      moduleId: encodingModuleOf(encodingLesson),
      round: 1,
      seconds: teachSeconds,
      // Kein Gegenstand — die Lektion erklärt die Technik.
      items: [],
    })
  } else if (teachesNumbers) {
    blocks.push({
      id: 'teach-major',
      kind: 'teach',
      moduleId: 'numbers',
      // Dieselbe Runde wie das erste Einprägen: Die Lektion gehört dazu und
      // ist keine eigene. Sonst zählte der Kopf des Bildschirms sie mit und
      // zeigte „Runde 0 von 3“.
      round: 1,
      seconds: teachSeconds,
      // Die Ziffer, um die es geht — als Zeichenkette, wie jeder andere
      // Gegenstand auch. Der Block wird nicht bewertet.
      items: [String(nextToTeach(input.taught ?? []))],
    })
  }

  /*
   * Über die ganze Einheit ohne Zurücklegen ziehen: Ein Wort, das in Runde 1
   * vorkam, darf in Runde 3 nicht noch einmal auftauchen — sonst misst der
   * spätere Abruf Wiedererkennen statt Erinnern.
   *
   * Und aus demselben Grund werden die **fälligen Wörter vorher aus dem
   * Vorrat genommen**. Ohne das konnte „Anker“ am selben Tag als neues Wort
   * eingeprägt *und* am Ende als Wiedersehen abgefragt werden — der Abruf
   * hätte dann nicht die Erinnerung von vorgestern gemessen, sondern die von
   * vor zwei Minuten. Ein Test hat genau diesen Fall gefunden.
   */
  const remaining = new Map<ModuleId, string[]>()
  const taken = new Map<ModuleId, number>()
  for (const moduleId of modules) {
    // Über den **Anker** aussortieren, nicht über den Gegenstand: Bei einer
    // Mission ist heute `Elena#room` fällig, im Vorrat steht aber „Elena“.
    const dueSubjects = new Set(
      (input.due?.[moduleId] ?? []).map((entry) => subjectOf(moduleId, entry)),
    )
    /*
     * Nur die Gesichter bekommen nach dem Mischen eine zweite Ordnung: In
     * einer Runde sollen keine zwei Menschen stehen, die man aus zwei Metern
     * verwechselt (Geraetemeldung 01.09.). Begruendung und Messwerte bei
     * `spreadFaces`. Alle anderen Module behalten das reine Mischen — bei
     * Woertern oder Zahlen gibt es kein „sieht aehnlich aus".
     */
    const mixed = rng.shuffle(
        /*
         * Auch der Vorratseintrag über seinen **Anker**, nicht roh: Bei den
         * Zwillingen (D-027) heißt das fällige Paar `Kirche%Kirsche`, im
         * Vorrat kann es gedreht als `Kirsche%Kirche` stehen — roh
         * verglichen wäre es „ein anderes“ und käme als neu. Der Kerntest
         * zu D-027 hat genau das gefangen. Überall sonst ist der Anker der
         * Eintrag selbst, und nichts ändert sich.
         */
        (input.pools[moduleId] ?? []).filter(
          (entry) => !dueSubjects.has(subjectOf(moduleId, entry)),
        ),
    )
    remaining.set(moduleId, moduleId === 'faces' ? spreadFaces(mixed) : mixed)
    taken.set(moduleId, 0)
  }

  /** Reicht der **Rest** des Vorrats noch für eine Runde dieses Moduls? */
  const hasStockLeft = (moduleId: ModuleId): boolean => {
    const left = (remaining.get(moduleId)?.length ?? 0) - (taken.get(moduleId) ?? 0)
    return isScene(moduleId) ? left >= 1 : left >= MIN_ITEMS_PER_ROUND
  }

  let previousModuleId: ModuleId | undefined
  for (let round = 1; round <= rounds; round++) {
    /*
     * Der Vorratsfilter oben sah den Vorrat **vor** der Einheit — ein
     * endlicher Vorrat (Zwillinge, Eigenes · D-032) kann aber mitten in
     * ihr zur Neige gehen: Runde 1 nimmt acht Karten, Runde 3 desselben
     * Moduls stünde vor nichts. Dann übernimmt das nächste Modul der
     * Reihe die Runde — still, wie beim Filter; ein Kerntest zu D-032
     * hat genau diesen Wurf gefunden. Nur ein erzwungenes Einzelmodul
     * scheitert weiterhin laut am beschreibenden Fehler unten.
     */
    let moduleId = moduleForRound(round)
    if (!hasStockLeft(moduleId) && learnFrom.length > 1) {
      const at = learnFrom.indexOf(moduleId)
      const substitute = learnFrom
        .map((_, step) => learnFrom[(at + step + 1) % learnFrom.length] as ModuleId)
        .find(hasStockLeft)
      if (substitute !== undefined) moduleId = substitute
    }

    /*
     * O7 — keine zwei besonders schweren Lernrunden direkt hintereinander,
     * sofern eine leichte Alternative mit echtem Vorrat verfügbar ist.
     *
     * Das ist eine Ordnungsregel, keine Ausschlussregel: Gibt es nur schwere
     * Module oder ist der leichte Vorrat erschöpft, bleibt der ursprüngliche
     * Plan bestehen. Nichts verschwindet, keine Session wird unplanbar und
     * das Zeitbudget bleibt exakt gleich.
     */
    if (
      previousModuleId !== undefined &&
      isCognitivelyHeavy(previousModuleId) &&
      isCognitivelyHeavy(moduleId) &&
      learnFrom.length > 1
    ) {
      const at = learnFrom.indexOf(moduleId)
      const lighter = learnFrom
        .map((_, step) => learnFrom[(at + step + 1) % learnFrom.length] as ModuleId)
        .find((candidate) => !isCognitivelyHeavy(candidate) && hasStockLeft(candidate))
      if (lighter !== undefined) moduleId = lighter
    }

    const pool = remaining.get(moduleId) as string[]
    const used = taken.get(moduleId) as number

    const roundSeconds = roundBudgets[round - 1] as number

    /*
     * Eine Runde Missionen ist **genau eine Szene** (H1).
     *
     * Der übliche Weg — so viele Gegenstände, wie in die Sekunden passen —
     * ergäbe hier drei halbe Szenen. Eine Mission ist aber kein Vorrat, aus
     * dem man abzählt, sondern eine Einheit: Person, Zimmer, Gegenstand,
     * Uhrzeit, Ort. Gezogen wird deshalb **eine Person**, und ihre vier
     * Tatsachen sind die Gegenstände der Runde.
     */
    const scene = isScene(moduleId)
    if (scene && pool.length - used < 1) {
      throw new RangeError(`Der Vorrat reicht nicht für eine Szene (${moduleId})`)
    }
    const delta = input.difficulty?.[moduleId] ?? 0
    const items = scene
      ? sceneItemsOf(moduleId, pool[used] as string)
      : pool.slice(
          used,
          used +
            (asksOnSight(moduleId)
              ? promptsForRound(roundSeconds, pool.length - used, delta)
              : itemsForRound(roundSeconds, pool.length - used, delta)),
        )
    taken.set(moduleId, used + (scene ? 1 : items.length))
    /*
     * Ein Modul, das auf Sicht fragt (D7), hat keinen Einprägeblock: Zeigen
     * und Fragen geschehen im Abruf selbst, Frage für Frage. Das ganze
     * Rundenbudget gehört dem Abruf — die Summe bleibt exakt.
     */
    const encodeSeconds = asksOnSight(moduleId) ? 0 : items.length * secondsPerItemFor(moduleId)

    if (encodeSeconds > 0) {
      blocks.push({
        id: `r${round}-encode`,
        kind: 'encode',
        moduleId,
        round,
        seconds: encodeSeconds,
        items,
      })
    }
    blocks.push({
      id: `r${round}-recall`,
      kind: 'recall',
      moduleId,
      round,
      // Was vom Rundenbudget übrig ist — dadurch stimmt die Summe exakt,
      // ganz ohne Nachkommastellen.
      seconds: roundSeconds - encodeSeconds,
      items,
    })
    previousModuleId = moduleId
  }

  // Das Wiedersehen kommt zuletzt — so wie in der Blockfolge aus B3. Wer
  // gerade acht neue Wörter eingeprägt hat, ist für den Abruf von gestern
  // aufgewärmt, und der Abstand zum Einprägen ist am größten.
  //
  // Je Modul ein eigener Block: Wörter werden frei abgerufen, Gesichter
  // gestützt. Beides in einen Block zu werfen ginge nicht, ohne eine der
  // beiden Abrufarten zu verbiegen.
  if (reviewSeconds > 0) {
    const reviewBudgets = share(reviewSeconds, dueByModule.length)
    dueByModule.forEach((entry, index) => {
      blocks.push({
        id: `review-${entry.moduleId}`,
        kind: 'review',
        moduleId: entry.moduleId,
        round: rounds + 1 + index,
        seconds: reviewBudgets[index] as number,
        items: entry.items,
      })
    })
  }

  return {
    mode: input.mode,
    ...(focus === undefined ? {} : { focus }),
    day: input.day,
    language: input.language,
    seed: input.seed,
    totalSeconds,
    blocks,
  }
}

/** Wie viele Rückwärts-Fragen in eine Runde passen. */
function promptsForRound(roundSeconds: number, available: number, delta = 0): number {
  const byTime = Math.floor(roundSeconds / SECONDS_PER_REVERSE_PROMPT)
  // Die Verschiebung (D2) greift **nach** dem Stutzen auf den Korridor —
  // sonst würde „ein Stück weniger" verschluckt, sobald die Zeit über der
  // Decke liegt. Boden und Decke gelten trotzdem.
  const base = Math.min(MAX_REVERSE_PROMPTS, Math.max(MIN_REVERSE_PROMPTS, byTime))
  const wanted = Math.min(MAX_REVERSE_PROMPTS, Math.max(MIN_REVERSE_PROMPTS, base + delta))
  if (available < MIN_REVERSE_PROMPTS) {
    throw new RangeError(`Der Vorrat reicht nicht für eine Runde (${available} übrig)`)
  }
  return Math.min(wanted, available)
}

function itemsForRound(roundSeconds: number, available: number, delta = 0): number {
  const byTime = Math.floor((roundSeconds * ENCODE_SHARE) / SECONDS_PER_ITEM)
  // Wie bei den Rückwärts-Runden: erst stutzen, dann verschieben (D2).
  const base = Math.min(MAX_ITEMS_PER_ROUND, Math.max(MIN_ITEMS_PER_ROUND, byTime))
  const wanted = Math.min(MAX_ITEMS_PER_ROUND, Math.max(MIN_ITEMS_PER_ROUND, base + delta))
  if (available < MIN_ITEMS_PER_ROUND) {
    throw new RangeError(`Der Wortvorrat reicht nicht für eine Runde (${available} übrig)`)
  }
  return Math.min(wanted, available)
}

/**
 * Teilt `total` in `parts` ganze Sekunden, ohne dass eine verloren geht.
 * Der Rest wandert nach vorn — lieber die erste Runde eine Sekunde länger als
 * am Ende eine Einheit, die 4:59 dauert.
 */
function share(total: number, parts: number): number[] {
  const base = Math.floor(total / parts)
  let rest = total - base * parts
  return Array.from({ length: parts }, () => {
    const extra = rest > 0 ? 1 : 0
    rest -= extra
    return base + extra
  })
}

/** Die **neuen** Wörter einer Einheit, in der Reihenfolge ihres Auftretens. */
export function itemsOf(plan: SessionPlan, moduleId?: ModuleId): string[] {
  return plan.blocks
    .filter(
      (block) => block.kind === 'encode' && (moduleId === undefined || block.moduleId === moduleId),
    )
    .flatMap((block) => [...block.items])
}

/** Die Wörter, die heute wiederkommen. Leer, wenn nichts fällig war. */
export function reviewItemsOf(plan: SessionPlan, moduleId?: ModuleId): string[] {
  return plan.blocks
    .filter(
      (block) => block.kind === 'review' && (moduleId === undefined || block.moduleId === moduleId),
    )
    .flatMap((block) => [...block.items])
}

/** Welche Module kommen in dieser Einheit vor? */
export function modulesOf(plan: SessionPlan): ModuleId[] {
  return [...new Set(plan.blocks.map((block) => block.moduleId))]
}

/**
 * Gesichter einer Runde auseinanderhalten (Geraetemeldung 01.09.).
 *
 * Der Vorrat ist vielfaeltig, aber eine Runde ist ein zusammenhaengender
 * Ausschnitt daraus — und in dem standen bisher regelmaessig Zwillinge.
 * Gemessen vor dieser Behebung (300 Einheiten, 900 Runden): In 9,7 % der
 * Runden unterschied sich das aehnlichste Paar in genau **einem** von sieben
 * auffaelligen Merkmalen, in 48,6 % in zweien. Greta und Zora etwa teilen
 * Frisur, Haarfarbe, Nase, Mund, Bartlosigkeit und Brillenlosigkeit.
 *
 * Behoben wird das **an der Reihenfolge**, nicht am Gesicht: `faceFor` bleibt
 * unangetastet, sonst saehe „Elena" nach dem Update anders aus als beim
 * Einpraegen vor drei Wochen (D8). Aus der gemischten Liste wird hier eine
 * umsortierte, in der je zwei Namen innerhalb eines Rundenfensters weit genug
 * auseinanderliegen. Dieselben Namen, dieselbe Anzahl, dieselbe Ziehung ohne
 * Zuruecklegen — nur eine andere Ordnung.
 *
 * Genommen wird der **erste** Kandidat, der die Schwelle haelt, nicht der
 * beste: Der beste zuerst verbraucht die auffaelligsten Gesichter frueh und
 * laesst die aehnlichen fuer die spaeteren Runden uebrig. Haelt keiner die
 * Schwelle (kleiner Vorrat, viele aehnliche Namen), kommt der mit dem
 * groessten Abstand — nie eine Endlosschleife, nie ein Ausfall.
 */
const MIN_FACE_DISTANCE = 3

function spreadFaces(names: readonly string[]): string[] {
  const rest = [...names]
  const ordered: string[] = []

  while (rest.length > 0) {
    // Nur das Fenster vergleichen, das eine Runde ueberhaupt zusammen zeigt.
    const window = ordered.slice(-(MAX_ITEMS_PER_ROUND - 1))
    let chosen = 0
    let best = -1

    for (let index = 0; index < rest.length; index++) {
      const candidate = rest[index] as string
      let closest = Number.POSITIVE_INFINITY
      for (const seen of window) closest = Math.min(closest, faceDistance(seen, candidate))
      if (closest >= MIN_FACE_DISTANCE) {
        chosen = index
        best = closest
        break
      }
      if (closest > best) {
        best = closest
        chosen = index
      }
    }

    ordered.push(rest.splice(chosen, 1)[0] as string)
  }

  return ordered
}
