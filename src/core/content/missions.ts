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
 * Weitere Welten tragen deshalb einen stabilen Suffix am Anker, z. B.
 * `Elena~m:conference#room`. Der alte suffixlose Anker bedeutet weiterhin
 * Hotel. So können neue Szenen hinzukommen, ohne einen einzigen bestehenden
 * FSRS-Termin umzudeuten.
 */

import { FALLBACK_LANGUAGE, type Language } from '../language.ts'
import { createRng } from '../rng.ts'

export const FACT_KINDS = ['room', 'object', 'location', 'time', 'place'] as const
export type FactKind = (typeof FACT_KINDS)[number]

export const MISSION_WORLDS = ['hotel', 'conference', 'coworking'] as const
export type MissionWorld = (typeof MISSION_WORLDS)[number]

const WORLD_SEPARATOR = '~m:'
export const FACT_SEPARATOR = '#'
const OBJECT_LOCATION_SEPARATOR = ' · '

export interface MissionFact {
  kind: FactKind
  /** Was der Nutzer sieht — und später zurückgeben soll. */
  value: string
}

export interface Mission {
  /** Der echte Personenname, ohne technischen Welt-Suffix. */
  person: string
  facts: readonly MissionFact[]
}

/**
 * Der stabile Szenenanker. Das Hotel behält absichtlich die historische Form.
 */
export function missionAnchor(person: string, world: MissionWorld): string {
  return world === 'hotel' ? person : `${person}${WORLD_SEPARATOR}${world}`
}

/** Entfernt nur die Tatsachenkennung, nicht den Welt-Suffix. */
export function missionAnchorOf(item: string): string {
  const cut = item.indexOf(FACT_SEPARATOR)
  return cut === -1 ? item : item.slice(0, cut)
}

function splitAnchor(anchorOrItem: string): { person: string; world: MissionWorld } {
  const anchor = missionAnchorOf(anchorOrItem)
  const cut = anchor.lastIndexOf(WORLD_SEPARATOR)
  if (cut < 0) return { person: anchor, world: 'hotel' }

  const person = anchor.slice(0, cut)
  const candidate = anchor.slice(cut + WORLD_SEPARATOR.length)
  const world = (MISSION_WORLDS as readonly string[]).includes(candidate)
    ? (candidate as MissionWorld)
    : 'hotel'
  // Ein unbekannter Suffix wird nicht umgedeutet: Als historischer/plain Anker
  // bleibt die ganze Zeichenkette Person im Hotel statt still Daten zu ändern.
  return world === 'hotel' && candidate !== 'hotel'
    ? { person: anchor, world: 'hotel' }
    : { person, world }
}

/** Der echte Name für Gesicht, Anzeige und Gegenfragen. */
export function personOf(item: string): string {
  return splitAnchor(item).person
}

export function missionWorldOf(item: string): MissionWorld {
  return splitAnchor(item).world
}

/**
 * Eine Person gehört im neuen Vorrat genau **einer** Welt. Dadurch sieht man
 * Vielfalt, ohne dieselbe Person in derselben Lernrotation mit drei parallelen
 * Lebensläufen zu überfrachten. Alte fällige Hotel-Szenen bleiben davon
 * unberührt, weil ihre gespeicherten Kennungen selbsttragend sind.
 */
export function missionPool(people: readonly string[]): string[] {
  return people.map((person, index) => missionAnchor(person, MISSION_WORLDS[index % MISSION_WORLDS.length]!))
}

const WORLD_NAMES: Record<MissionWorld, Partial<Record<Language, string>>> = {
  hotel: { de: 'Hotel', en: 'Hotel', fr: 'Hôtel', es: 'Hotel' },
  conference: { de: 'Konferenz', en: 'Conference', fr: 'Conférence', es: 'Conferencia' },
  coworking: { de: 'Coworking', en: 'Coworking', fr: 'Espace de travail', es: 'Coworking' },
}

/** Trainingskontext für den sichtbaren Szenen-/Abrufanker. */
export function missionWorldLabel(item: string, language: Language): string {
  const world = missionWorldOf(item)
  return WORLD_NAMES[world][language] ?? WORLD_NAMES[world][FALLBACK_LANGUAGE] ?? world
}

/** Farben; bei DE bereits männlich gebeugt, bei FR/ES maskuline Grundform. */
const COLOURS: Partial<Record<Language, readonly string[]>> = {
  de: ['roter', 'blauer', 'grüner', 'gelber', 'schwarzer', 'weißer', 'grauer', 'brauner'],
  en: ['red', 'blue', 'green', 'yellow', 'black', 'white', 'grey', 'brown'],
  fr: ['rouge', 'bleu', 'vert', 'jaune', 'noir', 'blanc', 'gris', 'brun'],
  es: ['rojo', 'azul', 'verde', 'amarillo', 'negro', 'blanco', 'gris', 'marrón'],
}

/**
 * Welt-spezifische Dinge. Die Hotel-Listen sind absichtlich bytegleich zur
 * ersten Fassung, damit suffixlose Alt-Anker exakt dieselben Szenen erzeugen.
 */
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

export function missionFor(anchorOrItem: string, language: Language): Mission {
  const anchor = missionAnchorOf(anchorOrItem)
  const { person, world } = splitAnchor(anchor)

  /*
   * **Legacy-Garantie:** suffixloses Hotel benutzt exakt den historischen
   * Seed. Neue Welten dürfen ihren Suffix in den Seed nehmen; das kann keinen
   * bereits gespeicherten Hotelwert verändern.
   */
  const rng = createRng(
    world === 'hotel' && anchor === person
      ? `mission:${language}:${person}`
      : `mission:${language}:${anchor}`,
  )

  // Alle Welten behalten eine rein numerische Raum-/Stationsnummer: mobile
  // Eingabe und exakte Bewertung bleiben damit dieselbe verlässliche Aufgabe.
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
      // Für die Szenenansicht hängen Gegenstand und Lage sichtbar zusammen.
      // `answerFor()` trennt sie für die beiden späteren Fragen wieder.
      { kind: 'object', value: `${object} · ${location}` },
      { kind: 'location', value: location },
      { kind: 'time', value: time },
      { kind: 'place', value: place },
    ],
  }
}

export function factId(anchor: string, kind: FactKind): string {
  return `${missionAnchorOf(anchor)}${FACT_SEPARATOR}${kind}`
}

export function missionFacts(anchor: string): readonly string[] {
  const stable = missionAnchorOf(anchor)
  return FACT_KINDS.map((kind) => factId(stable, kind))
}

export function factKindOf(item: string): FactKind | undefined {
  const cut = item.indexOf(FACT_SEPARATOR)
  if (cut === -1) return undefined
  const kind = item.slice(cut + FACT_SEPARATOR.length)
  return (FACT_KINDS as readonly string[]).includes(kind) ? (kind as FactKind) : undefined
}

/** Der Gegenstand ohne seine Lage — nützlich, wenn die Lage separat gefragt wird. */
export function missionObjectFor(anchorOrItem: string, language: Language): string {
  const combined =
    missionFor(anchorOrItem, language).facts.find((fact) => fact.kind === 'object')?.value ?? ''
  return combined.split(OBJECT_LOCATION_SEPARATOR)[0] ?? combined
}

export function answerFor(item: string, language: Language): string | undefined {
  const kind = factKindOf(item)
  if (kind === undefined) return undefined
  const value = missionFor(missionAnchorOf(item), language).facts.find((fact) => fact.kind === kind)?.value
  if (kind !== 'object' || value === undefined) return value
  return value.split(OBJECT_LOCATION_SEPARATOR)[0] ?? value
}
