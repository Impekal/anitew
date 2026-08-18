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
import { answerFor, factKindOf, missionFacts, personOf } from '../content/missions.ts'
import { objectFor, walkOf, walkPlacements } from '../content/palace.ts'
import type { Language } from '../language.ts'
import { nextToTeach } from '../technique/major.ts'
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
export const TRAINING_MODULES = ['words', 'faces', 'numbers', 'missions', 'palace'] as const
export type ModuleId = (typeof TRAINING_MODULES)[number]

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
  return moduleId === 'faces' || moduleId === 'missions' || moduleId === 'palace'
}

/**
 * Module, deren Runde **eine Szene** ist und keine Reihe von Stücken.
 *
 * Zwei gibt es davon, und sie sind sich in der Bauform gleich (D-014): Eine
 * Mission bindet vier Tatsachen an eine Person, ein Gang bindet fünf
 * Gegenstände an fünf Orte. Beide würden zerfallen, wenn der Planer sie wie
 * einen Vorrat behandelte und drei halbe Szenen abzählte.
 */
export function isScene(moduleId: ModuleId): boolean {
  return moduleId === 'missions' || moduleId === 'palace'
}

/** Die Stücke einer Szene zu ihrem Anker. */
export function sceneItemsOf(moduleId: ModuleId, anchor: string): readonly string[] {
  return moduleId === 'palace' ? walkPlacements(anchor) : missionFacts(anchor)
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
  return moduleId === 'missions' ? 5 : SECONDS_PER_ITEM
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
   * Beim Palast steht nur der Gegenstand da, ohne seine Station.
   *
   * Anders als bei einer Mission trägt er sich selbst: „314“ allein sagt
   * nichts, „Toaster“ schon. Und in der Zusammenfassung steht, woran man sich
   * erinnert hat — nicht, wo es lag.
   */
  if (moduleId === 'palace') return objectFor(item, language as Language) ?? item
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
  if (moduleId === 'numbers') return 'exact'
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
  const learnFrom = learnableModules(totalSeconds, modules)

  // Nur Module, für die heute wirklich etwas fällig ist. Ein leerer
  // Wiederholungsblock wäre eine Frage ohne Gegenstand.
  const dueByModule = modules
    .map((moduleId) => ({ moduleId, items: input.due?.[moduleId] ?? [] }))
    .filter((entry) => entry.items.length > 0)

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

  const wantsLesson =
    hasTime &&
    !teachesPalace &&
    input.taught !== undefined &&
    nextToTeach(input.taught) !== undefined
  const teachesNumbers = wantsLesson && numbersAt >= 0

  const offset = teachesPalace ? palaceAt : teachesNumbers ? numbersAt : drawn

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
    input.focus !== undefined && learnFrom.includes(input.focus) && !teachesPalace && !teachesNumbers
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
  const teachSeconds = teachesPalace || teachesNumbers ? TEACH_SECONDS : 0
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
    remaining.set(
      moduleId,
      rng.shuffle((input.pools[moduleId] ?? []).filter((entry) => !dueSubjects.has(entry))),
    )
    taken.set(moduleId, 0)
  }

  for (let round = 1; round <= rounds; round++) {
    const moduleId = moduleForRound(round)
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
    const items = scene
      ? sceneItemsOf(moduleId, pool[used] as string)
      : pool.slice(used, used + itemsForRound(roundSeconds, pool.length - used))
    taken.set(moduleId, used + (scene ? 1 : items.length))
    const encodeSeconds = items.length * secondsPerItemFor(moduleId)

    blocks.push({
      id: `r${round}-encode`,
      kind: 'encode',
      moduleId,
      round,
      seconds: encodeSeconds,
      items,
    })
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

function itemsForRound(roundSeconds: number, available: number): number {
  const byTime = Math.floor((roundSeconds * ENCODE_SHARE) / SECONDS_PER_ITEM)
  const wanted = Math.min(MAX_ITEMS_PER_ROUND, Math.max(MIN_ITEMS_PER_ROUND, byTime))
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
