/**
 * Memory Missions (H1/H2/H4/H5).
 *
 * Das historische Hotel bleibt unverändert: bestehende `Name#fact`-IDs und
 * alle daraus erzeugten Antworten dürfen nach einem Update nie ihre Bedeutung
 * wechseln. Zusätzliche Welten verwenden deshalb neue Personen, die im alten
 * Namensvorrat der jeweiligen Trainingssprache nicht vorkamen.
 */

import { FALLBACK_LANGUAGE, type Language } from '../language.ts'
import { createRng } from '../rng.ts'

export const FACT_KINDS = ['room', 'object', 'location', 'time', 'place'] as const
export type FactKind = (typeof FACT_KINDS)[number]

export const MISSION_WORLDS = ['hotel', 'conference', 'coworking'] as const
export type MissionWorld = (typeof MISSION_WORLDS)[number]

export const FACT_SEPARATOR = '#'
const OBJECT_LOCATION_SEPARATOR = ' · '

export interface MissionFact {
  kind: FactKind
  value: string
}

export interface Mission {
  person: string
  facts: readonly MissionFact[]
}

const WORLD_PEOPLE: Record<
  Exclude<MissionWorld, 'hotel'>,
  Partial<Record<Language, readonly string[]>>
> = {
  conference: {
    de: ['Amandine', 'Malcolm', 'Beatriz', 'Jasper', 'Cordelia', 'Baptiste', 'Paloma', 'Xavier'],
    en: ['Farida', 'Konrad', 'Amandine', 'Mateo', 'Beatriz', 'Gaspard', 'Paloma', 'Hannes'],
    fr: ['Farida', 'Kenneth', 'Beatriz', 'Konrad', 'Cordelia', 'Mateo', 'Yasmin', 'Jasper'],
    es: ['Farida', 'Kenneth', 'Amandine', 'Konrad', 'Cordelia', 'Gaspard', 'Yasmin', 'Jasper'],
  },
  coworking: {
    de: ['Bridget', 'Damien', 'Almudena', 'Leonard', 'Fiona', 'Corentin', 'Candela', 'Quincy'],
    en: ['Dilara', 'Corentin', 'Almudena', 'Leopold', 'Violette', 'Damien', 'Candela', 'Oskar'],
    fr: ['Dilara', 'Leonard', 'Almudena', 'Leopold', 'Fiona', 'Oskar', 'Candela', 'Quincy'],
    es: ['Dilara', 'Leonard', 'Violette', 'Leopold', 'Fiona', 'Corentin', 'Bridget', 'Quincy'],
  },
}

function peopleFor(world: Exclude<MissionWorld, 'hotel'>, language: Language): readonly string[] {
  return WORLD_PEOPLE[world][language] ?? (WORLD_PEOPLE[world][FALLBACK_LANGUAGE] as readonly string[])
}

export function personOf(item: string): string {
  const cut = item.indexOf(FACT_SEPARATOR)
  return cut === -1 ? item : item.slice(0, cut)
}

export function missionWorldOf(item: string, language: Language): MissionWorld {
  const person = personOf(item)
  if (peopleFor('conference', language).includes(person)) return 'conference'
  if (peopleFor('coworking', language).includes(person)) return 'coworking'
  return 'hotel'
}

export function missionPool(legacyPeople: readonly string[], language: Language): string[] {
  return [...legacyPeople, ...peopleFor('conference', language), ...peopleFor('coworking', language)]
}

const WORLD_NAMES: Record<MissionWorld, Partial<Record<Language, string>>> = {
  hotel: { de: 'Hotel', en: 'Hotel', fr: 'Hôtel', es: 'Hotel' },
  conference: { de: 'Konferenz', en: 'Conference', fr: 'Conférence', es: 'Conferencia' },
  coworking: { de: 'Coworking', en: 'Coworking', fr: 'Espace de travail', es: 'Coworking' },
}

export function missionWorldLabel(item: string, language: Language): string {
  const world = missionWorldOf(item, language)
  return WORLD_NAMES[world][language] ?? WORLD_NAMES[world][FALLBACK_LANGUAGE] ?? world
}

/** Hotel-Bausteine sind die bereits veröffentlichte Fassung und bleiben exakt. */
const COLOURS: Partial<Record<Language, readonly string[]>> = {
  de: ['roter', 'blauer', 'grüner', 'gelber', 'schwarzer', 'weißer', 'grauer', 'brauner'],
  en: ['red', 'blue', 'green', 'yellow', 'black', 'white', 'grey', 'brown'],
  fr: ['rouge', 'bleu', 'vert', 'jaune', 'noir', 'blanc', 'gris', 'brun'],
  es: ['rojo', 'azul', 'verde', 'amarillo', 'negro', 'blanco', 'gris', 'marrón'],
}

const HOTEL_OBJECTS: Partial<Record<Language, readonly string[]>> = {
  de: ['Koffer', 'Schirm', 'Mantel', 'Hut', 'Rucksack', 'Schal', 'Becher', 'Schlüssel'],
  en: ['suitcase', 'umbrella', 'coat', 'hat', 'backpack', 'scarf', 'mug', 'key'],
  fr: ['sac', 'manteau', 'chapeau', 'foulard', 'gobelet', 'carnet', 'ballon', 'parapluie'],
  es: ['bolso', 'abrigo', 'sombrero', 'pañuelo', 'vaso', 'cuaderno', 'balón', 'paraguas'],
}

const HOTEL_LOCATIONS: Partial<Record<Language, readonly string[]>> = {
  de: ['neben dem Fenster', 'unter dem Tisch', 'auf dem Stuhl', 'vor der Tür', 'hinter dem Sessel', 'neben dem Bett', 'auf der Kommode', 'unter der Lampe'],
  en: ['beside the window', 'under the table', 'on the chair', 'in front of the door', 'behind the armchair', 'beside the bed', 'on the dresser', 'under the lamp'],
  fr: ['près de la fenêtre', 'sous la table', 'sur la chaise', 'devant la porte', 'derrière le fauteuil', 'près du lit', 'sur la commode', 'sous la lampe'],
  es: ['junto a la ventana', 'debajo de la mesa', 'sobre la silla', 'delante de la puerta', 'detrás del sillón', 'junto a la cama', 'sobre la cómoda', 'debajo de la lámpara'],
}

const HOTEL_PLACES: Partial<Record<Language, readonly string[]>> = {
  de: ['Luna', 'Kastanie', 'Orion', 'Feldhof', 'Sirene', 'Anker', 'Zeder', 'Morgenrot'],
  en: ['Luna', 'Chestnut', 'Orion', 'Fieldhouse', 'Siren', 'Anchor', 'Cedar', 'Daybreak'],
  fr: ['Luna', 'Marronnier', 'Orion', 'Bergerie', 'Sirène', 'Ancre', 'Cèdre', 'Aurore'],
  es: ['Luna', 'Olivo', 'Orion', 'Pradera', 'Sirena', 'Áncora', 'Cedro', 'Aurora'],
}

/**
 * Für die neuen Welten reichen vier klar unterscheidbare Bausteine pro Art.
 * Das hält die Szene kontextuell, ohne redundante Wörter in den Kaltstart zu
 * laden. Die Person + RNG liefern weiterhin deutlich mehr Kombinationen als
 * ein Nutzer in einer Einheit sieht.
 */
const WORLD_OBJECTS: Record<Exclude<MissionWorld, 'hotel'>, Partial<Record<Language, readonly string[]>>> = {
  conference: {
    de: ['Ausweis', 'Ordner', 'Block', 'Stift'], en: ['badge', 'folder', 'notepad', 'pen'],
    fr: ['badge', 'dossier', 'carnet', 'stylo'], es: ['pase', 'carpeta', 'cuaderno', 'bolígrafo'],
  },
  coworking: {
    de: ['Kopfhörer', 'Ladekabel', 'Tablet', 'Rucksack'], en: ['headset', 'charger', 'tablet', 'backpack'],
    fr: ['casque', 'chargeur', 'tablette', 'sac'], es: ['auricular', 'cargador', 'tableta', 'bolso'],
  },
}

const WORLD_LOCATIONS: Record<Exclude<MissionWorld, 'hotel'>, Partial<Record<Language, readonly string[]>>> = {
  conference: {
    de: ['neben der Bühne', 'am Eingang', 'auf dem Pult', 'neben dem Beamer'],
    en: ['beside the stage', 'at the entrance', 'on the lectern', 'beside the projector'],
    fr: ['près de la scène', 'à l’entrée', 'sur le pupitre', 'près du projecteur'],
    es: ['junto al escenario', 'en la entrada', 'sobre el atril', 'junto al proyector'],
  },
  coworking: {
    de: ['am Fenster', 'neben dem Drucker', 'auf dem Sofa', 'auf dem Schreibtisch'],
    en: ['by the window', 'beside the printer', 'on the sofa', 'on the desk'],
    fr: ['près de la fenêtre', 'près de l’imprimante', 'sur le canapé', 'sur le bureau'],
    es: ['junto a la ventana', 'junto a la impresora', 'sobre el sofá', 'sobre el escritorio'],
  },
}

const WORLD_PLACES: Record<Exclude<MissionWorld, 'hotel'>, Partial<Record<Language, readonly string[]>>> = {
  conference: {
    de: ['Forum Atlas', 'Saal Nord', 'Agora', 'Studio Delta'], en: ['Atlas Forum', 'North Hall', 'Agora', 'Delta Studio'],
    fr: ['Forum Atlas', 'Salle Nord', 'Agora', 'Studio Delta'], es: ['Foro Atlas', 'Sala Norte', 'Ágora', 'Estudio Delta'],
  },
  coworking: {
    de: ['Atrium', 'Dachraum', 'Bibliothek', 'Innenhof'], en: ['Atrium', 'Roof Room', 'Library', 'Courtyard'],
    fr: ['Atrium', 'Salle du toit', 'Bibliothèque', 'Cour'], es: ['Atrio', 'Sala Terraza', 'Biblioteca', 'Patio'],
  },
}

function listFor(pools: Partial<Record<Language, readonly string[]>>, language: Language): readonly string[] {
  return pools[language] ?? (pools[FALLBACK_LANGUAGE] as readonly string[])
}

function worldList(
  hotel: Partial<Record<Language, readonly string[]>>,
  worlds: Record<Exclude<MissionWorld, 'hotel'>, Partial<Record<Language, readonly string[]>>>,
  world: MissionWorld,
  language: Language,
): readonly string[] {
  return world === 'hotel' ? listFor(hotel, language) : listFor(worlds[world], language)
}

export function hasMissionPool(language: Language): boolean {
  return COLOURS[language] !== undefined &&
    HOTEL_OBJECTS[language] !== undefined && HOTEL_LOCATIONS[language] !== undefined && HOTEL_PLACES[language] !== undefined &&
    MISSION_WORLDS.slice(1).every((world) => {
      const next = world as Exclude<MissionWorld, 'hotel'>
      return WORLD_OBJECTS[next][language] !== undefined && WORLD_LOCATIONS[next][language] !== undefined && WORLD_PLACES[next][language] !== undefined
    })
}

const ADJECTIVE_AFTER_NOUN: ReadonlySet<Language> = new Set<Language>(['fr', 'es'])

export function missionFor(personOrItem: string, language: Language): Mission {
  const person = personOf(personOrItem)
  const world = missionWorldOf(person, language)
  const rng = createRng(world === 'hotel' ? `mission:${language}:${person}` : `mission:${language}:${world}:${person}`)

  const room = world === 'hotel' ? String(100 + rng.int(900)) : String(1 + rng.int(80))
  const colour = rng.pick(listFor(COLOURS, language))
  const noun = rng.pick(worldList(HOTEL_OBJECTS, WORLD_OBJECTS, world, language))
  const object = ADJECTIVE_AFTER_NOUN.has(language) ? `${noun} ${colour}` : `${colour} ${noun}`
  const hour = 6 + rng.int(18)
  const minute = rng.int(12) * 5
  const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  const place = rng.pick(worldList(HOTEL_PLACES, WORLD_PLACES, world, language))
  const location = rng.pick(worldList(HOTEL_LOCATIONS, WORLD_LOCATIONS, world, language))

  return {
    person,
    facts: [
      { kind: 'room', value: room },
      { kind: 'object', value: `${object}${OBJECT_LOCATION_SEPARATOR}${location}` },
      { kind: 'location', value: location },
      { kind: 'time', value: time },
      { kind: 'place', value: place },
    ],
  }
}

export function factId(person: string, kind: FactKind): string {
  return `${personOf(person)}${FACT_SEPARATOR}${kind}`
}

export function missionFacts(person: string): readonly string[] {
  const stablePerson = personOf(person)
  return FACT_KINDS.map((kind) => factId(stablePerson, kind))
}

export function factKindOf(item: string): FactKind | undefined {
  const cut = item.indexOf(FACT_SEPARATOR)
  if (cut === -1) return undefined
  const kind = item.slice(cut + FACT_SEPARATOR.length)
  return (FACT_KINDS as readonly string[]).includes(kind) ? (kind as FactKind) : undefined
}

export function missionObjectFor(personOrItem: string, language: Language): string {
  const combined = missionFor(personOrItem, language).facts.find((fact) => fact.kind === 'object')?.value ?? ''
  return combined.split(OBJECT_LOCATION_SEPARATOR)[0] ?? combined
}

export function answerFor(item: string, language: Language): string | undefined {
  const kind = factKindOf(item)
  if (kind === undefined) return undefined
  const value = missionFor(personOf(item), language).facts.find((fact) => fact.kind === kind)?.value
  if (kind !== 'object' || value === undefined) return value
  return value.split(OBJECT_LOCATION_SEPARATOR)[0] ?? value
}
