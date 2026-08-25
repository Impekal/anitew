/**
 * Memory Missions (Backlog H1, H2, H4, H5).
 *
 * Eine Mission ist eine **Szene**, keine Liste: eine Person, ein Kontext,
 * ein Raum/eine Nummer, ein Gegenstand mit Lage, eine Uhrzeit und ein Ort —
 * und sie gehören zusammen. Genau diese Bindung wird trainiert.
 *
 * ── Abwärtskompatibilität ist Teil des Gedächtnisses ──────────────────────
 *
 * Die erste ANITEW-Missionswelt war das Hotel. Ihre Kennungen waren schlicht
 * `Elena#room`, `Elena#object` usw. Diese Kennungen und **alle daraus
 * erzeugten Antworten bleiben für immer unverändert**. Ein gelerntes Zimmer
 * darf nach einem App-Update nicht plötzlich ein anderes sein.
 *
 * Neue Welten bekommen deshalb **eigene Missionspersonen**, die im bisherigen
 * Namensvorrat dieser Trainingssprache nicht vorkamen. Ihre IDs bleiben genau
 * so menschlich lesbar (`Amandine#room`) und brauchen keinen technischen
 * Suffix im Namen. Die Welt folgt deterministisch aus Name + Trainingssprache.
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
  /** Was der Nutzer sieht — und später zurückgeben soll. */
  value: string
}

export interface Mission {
  person: string
  facts: readonly MissionFact[]
}

/**
 * Zusätzliche, kulturspezifische Missionspersonen. Sie stammen bewusst aus
 * Namen, deren Geschlechtsinformation der Gesichtsgenerator bereits kennt,
 * aber **nicht** aus dem Basis-Namenspool derselben Sprache. So entstehen neue
 * stabile IDs, ohne alte Hotel-IDs umzudeuten oder bei Gesichtern neue
 * Bart-/Gender-Heuristiken einzuführen.
 */
const WORLD_PEOPLE: Record<Exclude<MissionWorld, 'hotel'>, Partial<Record<Language, readonly string[]>>> = {
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

/** Tatsachenkennung → Person. Die historische Semantik bleibt exakt gleich. */
export function personOf(item: string): string {
  const cut = item.indexOf(FACT_SEPARATOR)
  return cut === -1 ? item : item.slice(0, cut)
}

/**
 * Welt eines Ankers. Basisnamen sind immer Hotel; nur die explizit neuen
 * Missionspersonen dieser Sprache bekommen eine andere Welt.
 */
export function missionWorldOf(item: string, language: Language): MissionWorld {
  const person = personOf(item)
  if (peopleFor('conference', language).includes(person)) return 'conference'
  if (peopleFor('coworking', language).includes(person)) return 'coworking'
  return 'hotel'
}

/**
 * Alter Hotel-Vorrat + neue Personen aus zwei weiteren Welten. Die Basisliste
 * bleibt vollständig enthalten; nichts, was früher lernbar war, verschwindet.
 */
export function missionPool(legacyPeople: readonly string[], language: Language): string[] {
  return [
    ...legacyPeople,
    ...peopleFor('conference', language),
    ...peopleFor('coworking', language),
  ]
}

const WORLD_NAMES: Record<MissionWorld, Partial<Record<Language, string>>> = {
  hotel: { de: 'Hotel', en: 'Hotel', fr: 'Hôtel', es: 'Hotel' },
  conference: { de: 'Konferenz', en: 'Conference', fr: 'Conférence', es: 'Conferencia' },
  coworking: { de: 'Coworking', en: 'Coworking', fr: 'Espace de travail', es: 'Coworking' },
}

/** Trainingskontext für Szenenansicht und späteren Abruf. */
export function missionWorldLabel(item: string, language: Language): string {
  const world = missionWorldOf(item, language)
  return WORLD_NAMES[world][language] ?? WORLD_NAMES[world][FALLBACK_LANGUAGE] ?? world
}

/** Farben; bei DE bereits männlich gebeugt, bei FR/ES maskuline Grundform. */
const COLOURS: Partial<Record<Language, readonly string[]>> = {
  de: ['roter', 'blauer', 'grüner', 'gelber', 'schwarzer', 'weißer', 'grauer', 'brauner'],
  en: ['red', 'blue', 'green', 'yellow', 'black', 'white', 'grey', 'brown'],
  fr: ['rouge', 'bleu', 'vert', 'jaune', 'noir', 'blanc', 'gris', 'brun'],
  es: ['rojo', 'azul', 'verde', 'amarillo', 'negro', 'blanco', 'gris', 'marrón'],
}

/** Hotel-Listen bleiben exakt die erste Fassung; neue Welten haben eigene. */
const OBJECTS: Record<MissionWorld, Partial<Record<Language, readonly string[]>>> = {
  hotel: {
    de: ['Koffer', 'Schirm', 'Mantel', 'Hut', 'Rucksack', 'Schal', 'Becher', 'Schlüssel'],
    en: ['suitcase', 'umbrella', 'coat', 'hat', 'backpack', 'scarf', 'mug', 'key'],
    fr: ['sac', 'manteau', 'chapeau', 'foulard', 'gobelet', 'carnet', 'ballon', 'parapluie'],
    es: ['bolso', 'abrigo', 'sombrero', 'pañuelo', 'vaso', 'cuaderno', 'balón', 'paraguas'],
  },
  conference: {
    de: ['Ausweis', 'Ordner', 'Rucksack', 'Becher', 'Block', 'Stift', 'Schal', 'Schlüssel'],
    en: ['badge', 'folder', 'backpack', 'mug', 'notepad', 'pen', 'scarf', 'key'],
    fr: ['badge', 'dossier', 'sac', 'gobelet', 'carnet', 'stylo', 'foulard', 'clé'],
    es: ['pase', 'carpeta', 'bolso', 'vaso', 'cuaderno', 'bolígrafo', 'pañuelo', 'llave'],
  },
  coworking: {
    de: ['Kopfhörer', 'Ladekabel', 'Notizbuch', 'Becher', 'Tablet', 'Schlüssel', 'Ordner', 'Rucksack'],
    en: ['headset', 'charger', 'notebook', 'mug', 'tablet', 'key', 'folder', 'backpack'],
    fr: ['casque', 'chargeur', 'carnet', 'gobelet', 'tablette', 'clé', 'dossier', 'sac'],
    es: ['auricular', 'cargador', 'cuaderno', 'vaso', 'tableta', 'llave', 'carpeta', 'bolso'],
  },
}

const LOCATIONS: Record<MissionWorld, Partial<Record<Language, readonly string[]>>> = {
  hotel: {
    de: ['neben dem Fenster', 'unter dem Tisch', 'auf dem Stuhl', 'vor der Tür', 'hinter dem Sessel', 'neben dem Bett', 'auf der Kommode', 'unter der Lampe'],
    en: ['beside the window', 'under the table', 'on the chair', 'in front of the door', 'behind the armchair', 'beside the bed', 'on the dresser', 'under the lamp'],
    fr: ['près de la fenêtre', 'sous la table', 'sur la chaise', 'devant la porte', 'derrière le fauteuil', 'près du lit', 'sur la commode', 'sous la lampe'],
    es: ['junto a la ventana', 'debajo de la mesa', 'sobre la silla', 'delante de la puerta', 'detrás del sillón', 'junto a la cama', 'sobre la cómoda', 'debajo de la lámpara'],
  },
  conference: {
    de: ['neben der Bühne', 'am Eingang', 'unter dem Stuhl', 'auf dem Pult', 'beim Fenster', 'neben dem Beamer', 'vor der Tür', 'auf dem Tisch'],
    en: ['beside the stage', 'at the entrance', 'under the chair', 'on the lectern', 'by the window', 'beside the projector', 'in front of the door', 'on the table'],
    fr: ['près de la scène', 'à l’entrée', 'sous la chaise', 'sur le pupitre', 'près de la fenêtre', 'près du projecteur', 'devant la porte', 'sur la table'],
    es: ['junto al escenario', 'en la entrada', 'debajo de la silla', 'sobre el atril', 'junto a la ventana', 'junto al proyector', 'delante de la puerta', 'sobre la mesa'],
  },
  coworking: {
    de: ['am Fenster', 'neben dem Drucker', 'unter dem Tisch', 'auf dem Sofa', 'bei der Pflanze', 'vor dem Regal', 'neben der Lampe', 'auf dem Schreibtisch'],
    en: ['by the window', 'beside the printer', 'under the desk', 'on the sofa', 'by the plant', 'in front of the shelf', 'beside the lamp', 'on the desk'],
    fr: ['près de la fenêtre', 'près de l’imprimante', 'sous le bureau', 'sur le canapé', 'près de la plante', 'devant l’étagère', 'près de la lampe', 'sur le bureau'],
    es: ['junto a la ventana', 'junto a la impresora', 'debajo del escritorio', 'sobre el sofá', 'junto a la planta', 'delante de la estantería', 'junto a la lámpara', 'sobre el escritorio'],
  },
}

const PLACES: Record<MissionWorld, Partial<Record<Language, readonly string[]>>> = {
  hotel: {
    de: ['Luna', 'Kastanie', 'Orion', 'Feldhof', 'Sirene', 'Anker', 'Zeder', 'Morgenrot'],
    en: ['Luna', 'Chestnut', 'Orion', 'Fieldhouse', 'Siren', 'Anchor', 'Cedar', 'Daybreak'],
    fr: ['Luna', 'Marronnier', 'Orion', 'Bergerie', 'Sirène', 'Ancre', 'Cèdre', 'Aurore'],
    es: ['Luna', 'Olivo', 'Orion', 'Pradera', 'Sirena', 'Áncora', 'Cedro', 'Aurora'],
  },
  conference: {
    de: ['Forum Atlas', 'Saal Nord', 'Agora', 'Studio Delta', 'Galerie Ost', 'Forum Zeder', 'Saal Luna', 'Atrium'],
    en: ['Atlas Forum', 'North Hall', 'Agora', 'Delta Studio', 'East Gallery', 'Cedar Forum', 'Luna Hall', 'Atrium'],
    fr: ['Forum Atlas', 'Salle Nord', 'Agora', 'Studio Delta', 'Galerie Est', 'Forum Cèdre', 'Salle Luna', 'Atrium'],
    es: ['Foro Atlas', 'Sala Norte', 'Ágora', 'Estudio Delta', 'Galería Este', 'Foro Cedro', 'Sala Luna', 'Atrio'],
  },
  coworking: {
    de: ['Atrium', 'Dachraum', 'Küche Ost', 'Studio Grün', 'Bibliothek', 'Lounge Nord', 'Innenhof', 'Galerie'],
    en: ['Atrium', 'Roof Room', 'East Kitchen', 'Green Studio', 'Library', 'North Lounge', 'Courtyard', 'Gallery'],
    fr: ['Atrium', 'Salle du toit', 'Cuisine Est', 'Studio Vert', 'Bibliothèque', 'Salon Nord', 'Cour', 'Galerie'],
    es: ['Atrio', 'Sala Terraza', 'Cocina Este', 'Estudio Verde', 'Biblioteca', 'Salón Norte', 'Patio', 'Galería'],
  },
}

function listFor(
  pools: Partial<Record<Language, readonly string[]>>,
  language: Language,
): readonly string[] {
  return pools[language] ?? (pools[FALLBACK_LANGUAGE] as readonly string[])
}

export function hasMissionPool(language: Language): boolean {
  return MISSION_WORLDS.every(
    (world) =>
      OBJECTS[world][language] !== undefined &&
      LOCATIONS[world][language] !== undefined &&
      PLACES[world][language] !== undefined,
  )
}

/** Französisch und Spanisch stellen die Farbe hinter das Substantiv. */
const ADJECTIVE_AFTER_NOUN: ReadonlySet<Language> = new Set<Language>(['fr', 'es'])

export function missionFor(personOrItem: string, language: Language): Mission {
  const person = personOf(personOrItem)
  const world = missionWorldOf(person, language)

  /*
   * **Legacy-Garantie:** Hotelpersonen benutzen exakt den historischen Seed.
   * Neue Personen existierten vorher nicht und dürfen ihre Welt zusätzlich in
   * den Seed nehmen. Kein gespeicherter Hotelwert kann sich dadurch ändern.
   */
  const rng = createRng(
    world === 'hotel'
      ? `mission:${language}:${person}`
      : `mission:${language}:${world}:${person}`,
  )

  const room = world === 'hotel' ? String(100 + rng.int(900)) : String(1 + rng.int(80))
  const colour = rng.pick(listFor(COLOURS, language))
  const noun = rng.pick(listFor(OBJECTS[world], language))
  const object = ADJECTIVE_AFTER_NOUN.has(language) ? `${noun} ${colour}` : `${colour} ${noun}`
  const hour = 6 + rng.int(18)
  const minute = rng.int(12) * 5
  const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  const place = rng.pick(listFor(PLACES[world], language))
  const location = rng.pick(listFor(LOCATIONS[world], language))

  return {
    person,
    facts: [
      { kind: 'room', value: room },
      { kind: 'object', value: `${object} · ${location}` },
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

/** Der Gegenstand ohne seine Lage — nützlich, wenn die Lage separat gefragt wird. */
export function missionObjectFor(personOrItem: string, language: Language): string {
  const combined =
    missionFor(personOrItem, language).facts.find((fact) => fact.kind === 'object')?.value ?? ''
  return combined.split(OBJECT_LOCATION_SEPARATOR)[0] ?? combined
}

export function answerFor(item: string, language: Language): string | undefined {
  const kind = factKindOf(item)
  if (kind === undefined) return undefined
  const value = missionFor(personOf(item), language).facts.find((fact) => fact.kind === kind)?.value
  if (kind !== 'object' || value === undefined) return value
  return value.split(OBJECT_LOCATION_SEPARATOR)[0] ?? value
}
