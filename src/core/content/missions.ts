/**
 * Memory Missions (Backlog H1, H2, H4).
 *
 * Eine Mission ist eine **Szene**, keine Liste: eine Person, ein Ort, ein
 * Gegenstand, eine Zahl, eine Uhrzeit — und sie gehören zusammen. Genau das
 * ist die Übung. Im Alltag merkt sich niemand „314“; man merkt sich, dass
 * *Elena* in Zimmer 314 wohnt und um 18:40 abreist. Was hier trainiert wird,
 * ist die **Bindung** zwischen den Stücken, und die ist etwas anderes als das
 * Behalten der Stücke selbst.
 *
 * Die Referenzszene aus H2 ist ein Hotel: Zimmer 314 · roter Koffer · Elena ·
 * 18:40 · Restaurant „Luna“. Sie steht hier nicht als fester Text, sondern als
 * **Vorlage mit Lücken** (H4): Fest ist das Gerüst, gefüllt wird aus
 * Bausteinen. Eine feste Szene wäre nach dem zweiten Mal auswendig gelernt,
 * und die App misst dann Wiedererkennen statt Gedächtnis — derselbe Grund wie
 * beim Gesichtsgenerator (D-005) und beim Zahlenvorrat (D10).
 *
 * ── Die Person ist der Anker ──────────────────────────────────────────────
 *
 * Aus dem **Namen** entsteht die ganze Szene, so wie aus dem Namen das
 * Gesicht entsteht. Das hat einen praktischen Grund, der erst beim
 * Wiedersehen sichtbar wird: Nach drei Tagen fragt die App eine einzelne
 * Tatsache ab, und „Welche Zimmernummer?“ wäre ohne Anker keine beantwortbare
 * Frage — es gab inzwischen zwanzig Zimmernummern. Mit dem Anker lautet sie
 * „Elena — welches Zimmer?“, und das ist genau die Frage, die das Leben
 * stellt.
 *
 * ── Warum die Farben schon gebeugt dastehen ───────────────────────────────
 *
 * „roter Koffer“, „rote Tasche“, „rotes Buch“ — das deutsche Adjektiv richtet
 * sich nach dem Geschlecht des Substantivs. Statt dafür eine Grammatik zu
 * bauen, sind alle Gegenstände **männlich** und die Farben stehen fertig
 * gebeugt in der Liste. Eine Einschränkung, die man beim Erweitern kennen
 * muss — deshalb steht sie hier und nicht in einem Fehlerbericht.
 */

import { FALLBACK_LANGUAGE, type Language } from '../language.ts'
import { createRng } from '../rng.ts'

/**
 * Was in einer Szene vorkommt.
 *
 * Die Reihenfolge ist zugleich die Reihenfolge der Fragen — vom Groben zum
 * Feinen: erst wo, dann was, dann wann, dann wie es hieß.
 */
export const FACT_KINDS = ['room', 'object', 'time', 'place'] as const
export type FactKind = (typeof FACT_KINDS)[number]

export interface MissionFact {
  kind: FactKind
  /** Was der Nutzer sieht — und später zurückgeben soll. */
  value: string
}

export interface Mission {
  /** Der Name, aus dem alles folgt. Zugleich der Anker jeder Frage. */
  person: string
  facts: readonly MissionFact[]
}

/** Farben, im Deutschen bereits männlich gebeugt (siehe oben). */
const COLOURS: Partial<Record<Language, readonly string[]>> = {
  de: ['roter', 'blauer', 'grüner', 'gelber', 'schwarzer', 'weißer', 'grauer', 'brauner'],
  en: ['red', 'blue', 'green', 'yellow', 'black', 'white', 'grey', 'brown'],
  // Im Französischen steht die Farbe **nach** dem Substantiv (siehe unten),
  // und die Gegenstände sind maskulin — deshalb die maskuline Grundform.
  fr: ['rouge', 'bleu', 'vert', 'jaune', 'noir', 'blanc', 'gris', 'brun'],
}

/** Gegenstände, die jemand bei sich trägt. Im Deutschen alle männlich. */
const OBJECTS: Partial<Record<Language, readonly string[]>> = {
  de: ['Koffer', 'Schirm', 'Mantel', 'Hut', 'Rucksack', 'Schal', 'Becher', 'Schlüssel'],
  en: ['suitcase', 'umbrella', 'coat', 'hat', 'backpack', 'scarf', 'mug', 'key'],
  // Alle maskulin und einwortig — dieselbe Vereinfachung wie im Deutschen,
  // damit die Farbe ohne Grammatik-Engine passt.
  fr: ['sac', 'manteau', 'chapeau', 'foulard', 'gobelet', 'carnet', 'ballon', 'parapluie'],
}

/**
 * Namen für das Restaurant.
 *
 * Kurz, aussprechbar, untereinander verschieden — dieselbe Regel wie bei den
 * Personennamen: Kein „Luna“ neben „Lima“, sonst misst der Abruf, wie gut
 * jemand Ähnliches auseinanderhält.
 */
const PLACES: Partial<Record<Language, readonly string[]>> = {
  de: ['Luna', 'Kastanie', 'Orion', 'Feldhof', 'Sirene', 'Anker', 'Zeder', 'Morgenrot'],
  en: ['Luna', 'Chestnut', 'Orion', 'Fieldhouse', 'Siren', 'Anchor', 'Cedar', 'Daybreak'],
  fr: ['Luna', 'Marronnier', 'Orion', 'Bergerie', 'Sirène', 'Ancre', 'Cèdre', 'Aurore'],
}

function listFor(pools: Partial<Record<Language, readonly string[]>>, language: Language) {
  return pools[language] ?? (pools[FALLBACK_LANGUAGE] as readonly string[])
}

/** Gibt es für diese Sprache eigene Bausteine? */
export function hasMissionPool(language: Language): boolean {
  return COLOURS[language] !== undefined
}

/**
 * Dieselbe Person ergibt immer dieselbe Szene.
 *
 * Darauf beruht das Wiedersehen: „Elena — welches Zimmer?“ hat in drei Wochen
 * dieselbe Antwort wie heute. Ohne diese Verlässlichkeit wäre die Wiederholung
 * sinnlos.
 *
 * Die Sprache steckt im Seed, und das ist Absicht: Dieselbe Person ergibt auf
 * Deutsch und auf Englisch **verschiedene** Szenen. Sie sind auch verschiedene
 * Gedächtnisinhalte — genauso wie „Anker“ und „anchor“ (siehe `data/items.ts`).
 */
/** Sprachen, in denen die Farbe hinter dem Substantiv steht. */
const ADJECTIVE_AFTER_NOUN: ReadonlySet<Language> = new Set<Language>(['fr'])

export function missionFor(person: string, language: Language): Mission {
  const rng = createRng(`mission:${language}:${person}`)

  // Zimmer: dreistellig, erste Ziffer nie null — eine „014“ gibt es nicht.
  const room = String(100 + rng.int(900))
  /*
   * Die Farbe wird zuerst gezogen und das Substantiv danach — diese
   * Reihenfolge bleibt, sonst änderten sich alle bestehenden deutschen und
   * englischen Szenen. **Zusammengesetzt** wird sprachabhängig: Im
   * Französischen steht die Farbe hinter dem Substantiv („sac rouge“), sonst
   * davor („roter Koffer“). Das ist kein Grammatik-Engine, sondern eine
   * einzige Regel für eine einzige Wortstellung.
   */
  const colour = rng.pick(listFor(COLOURS, language))
  const noun = rng.pick(listFor(OBJECTS, language))
  const object = ADJECTIVE_AFTER_NOUN.has(language) ? `${noun} ${colour}` : `${colour} ${noun}`
  // Uhrzeit im Fünf-Minuten-Raster zwischen 6 und 23 Uhr: „18:43“ wäre eine
  // Ziffernfolge, „18:40“ ist eine Uhrzeit.
  const hour = 6 + rng.int(18)
  const minute = rng.int(12) * 5
  const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  const place = rng.pick(listFor(PLACES, language))

  return {
    person,
    facts: [
      { kind: 'room', value: room },
      { kind: 'object', value: object },
      { kind: 'time', value: time },
      { kind: 'place', value: place },
    ],
  }
}

/**
 * Wie eine einzelne Tatsache im Plan und in der Datenbank heißt.
 *
 * `Elena#room`. Der Anker steht vorn, damit er sich ohne die Szene
 * zurückgewinnen lässt — und das Trennzeichen ist bewusst **nicht** der
 * Doppelpunkt: Der trennt schon Modul, Sprache und Gegenstand in der Kennung
 * (`missions:de:Elena#room`).
 */
export const FACT_SEPARATOR = '#'

export function factId(person: string, kind: FactKind): string {
  return `${person}${FACT_SEPARATOR}${kind}`
}

/** Die vier Tatsachen einer Szene, in der Reihenfolge der Fragen. */
export function missionFacts(person: string): readonly string[] {
  return FACT_KINDS.map((kind) => factId(person, kind))
}

/** Der Anker einer Tatsache — die Person, zu der sie gehört. */
export function personOf(item: string): string {
  const cut = item.indexOf(FACT_SEPARATOR)
  return cut === -1 ? item : item.slice(0, cut)
}

/** Um welche Art Tatsache es geht, oder `undefined` bei einer fremden Kennung. */
export function factKindOf(item: string): FactKind | undefined {
  const cut = item.indexOf(FACT_SEPARATOR)
  if (cut === -1) return undefined
  const kind = item.slice(cut + FACT_SEPARATOR.length)
  return (FACT_KINDS as readonly string[]).includes(kind) ? (kind as FactKind) : undefined
}

/**
 * Die gesuchte Antwort zu einer Tatsache.
 *
 * Erzeugt die Szene neu, statt sie zu speichern. Das ist der gleiche Handel
 * wie beim Gesicht: ein paar Rechenschritte gegen einen Vorrat, der nie
 * ausgeht und nirgends abgelegt werden muss.
 */
export function answerFor(item: string, language: Language): string | undefined {
  const kind = factKindOf(item)
  if (kind === undefined) return undefined
  return missionFor(personOf(item), language).facts.find((fact) => fact.kind === kind)?.value
}
