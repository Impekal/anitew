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
 */

import { FALLBACK_LANGUAGE, type Language } from '../language.ts'
import { createRng } from '../rng.ts'

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

/** Farben; bei DE bereits männlich gebeugt, bei FR/ES maskuline Grundform. */
const COLOURS: Partial<Record<Language, readonly string[]>> = {
  de: ['roter', 'blauer', 'grüner', 'gelber', 'schwarzer', 'weißer', 'grauer', 'brauner'],
  en: ['red', 'blue', 'green', 'yellow', 'black', 'white', 'grey', 'brown'],
  fr: ['rouge', 'bleu', 'vert', 'jaune', 'noir', 'blanc', 'gris', 'brun'],
  es: ['rojo', 'azul', 'verde', 'amarillo', 'negro', 'blanco', 'gris', 'marrón'],
}

/** Gegenstände, die jemand bei sich trägt; für FR/ES bewusst maskulin. */
const OBJECTS: Partial<Record<Language, readonly string[]>> = {
  de: ['Koffer', 'Schirm', 'Mantel', 'Hut', 'Rucksack', 'Schal', 'Becher', 'Schlüssel'],
  en: ['suitcase', 'umbrella', 'coat', 'hat', 'backpack', 'scarf', 'mug', 'key'],
  fr: ['sac', 'manteau', 'chapeau', 'foulard', 'gobelet', 'carnet', 'ballon', 'parapluie'],
  es: ['bolso', 'abrigo', 'sombrero', 'pañuelo', 'vaso', 'cuaderno', 'balón', 'paraguas'],
}

/** Kurze, untereinander gut unterscheidbare Restaurantnamen. */
const PLACES: Partial<Record<Language, readonly string[]>> = {
  de: ['Luna', 'Kastanie', 'Orion', 'Feldhof', 'Sirene', 'Anker', 'Zeder', 'Morgenrot'],
  en: ['Luna', 'Chestnut', 'Orion', 'Fieldhouse', 'Siren', 'Anchor', 'Cedar', 'Daybreak'],
  fr: ['Luna', 'Marronnier', 'Orion', 'Bergerie', 'Sirène', 'Ancre', 'Cèdre', 'Aurore'],
  es: ['Luna', 'Olivo', 'Orion', 'Pradera', 'Sirena', 'Áncora', 'Cedro', 'Aurora'],
}

function listFor(pools: Partial<Record<Language, readonly string[]>>, language: Language) {
  return pools[language] ?? (pools[FALLBACK_LANGUAGE] as readonly string[])
}

export function hasMissionPool(language: Language): boolean {
  return COLOURS[language] !== undefined
}

/** Französisch und Spanisch stellen die Farbe hinter das Substantiv. */
const ADJECTIVE_AFTER_NOUN: ReadonlySet<Language> = new Set<Language>(['fr', 'es'])

export function missionFor(person: string, language: Language): Mission {
  const rng = createRng(`mission:${language}:${person}`)

  const room = String(100 + rng.int(900))
  /*
   * Zieh-Reihenfolge bleibt unverändert; nur die sprachabhängige
   * Zusammensetzung variiert. So ändern sich bestehende DE/EN/FR-Szenen nicht.
   */
  const colour = rng.pick(listFor(COLOURS, language))
  const noun = rng.pick(listFor(OBJECTS, language))
  const object = ADJECTIVE_AFTER_NOUN.has(language) ? `${noun} ${colour}` : `${colour} ${noun}`
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

export const FACT_SEPARATOR = '#'

export function factId(person: string, kind: FactKind): string {
  return `${person}${FACT_SEPARATOR}${kind}`
}

export function missionFacts(person: string): readonly string[] {
  return FACT_KINDS.map((kind) => factId(person, kind))
}

export function personOf(item: string): string {
  const cut = item.indexOf(FACT_SEPARATOR)
  return cut === -1 ? item : item.slice(0, cut)
}

export function factKindOf(item: string): FactKind | undefined {
  const cut = item.indexOf(FACT_SEPARATOR)
  if (cut === -1) return undefined
  const kind = item.slice(cut + FACT_SEPARATOR.length)
  return (FACT_KINDS as readonly string[]).includes(kind) ? (kind as FactKind) : undefined
}

export function answerFor(item: string, language: Language): string | undefined {
  const kind = factKindOf(item)
  if (kind === undefined) return undefined
  return missionFor(personOf(item), language).facts.find((fact) => fact.kind === kind)?.value
}
