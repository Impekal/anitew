/**
 * Der Gedächtnispalast (Backlog G1, G2, G4, G6, G7).
 *
 * Die älteste Merktechnik, die es gibt, und die einzige mit einer eigenen
 * Untersuchung hinter sich (`core/science.ts`, `mnemonics`): Man legt, was man
 * behalten will, an **Orte**, die man ohnehin auswendig kennt — und geht sie
 * später ab. Der Ort ist der Haken, an dem die Erinnerung hängt.
 *
 * Ein Palast ist eine **feste Reihenfolge von Stationen**. Ein Gang ist eine
 * Szene: je ein Gegenstand hängt an je einer Station. Derselbe Gang ergibt
 * immer dieselben Gegenstände, weil sie aus dem Anker gerechnet werden.
 *
 * Die Gegenstände haben einen eigenen Vorrat, damit das Wortmodul und der
 * Palast sich nicht gegenseitig Antworten schenken (C6).
 */

import { FALLBACK_LANGUAGE, type Language } from '../language.ts'
import { createRng } from '../rng.ts'

export const PALACES = ['home', 'street', 'body', 'own'] as const
export type PalaceId = (typeof PALACES)[number]

export const READY_PALACES: readonly PalaceId[] = ['home', 'street', 'body']

export const STATIONS: Readonly<Record<PalaceId, readonly string[]>> = {
  home: ['door', 'hall', 'kitchen', 'sofa', 'bed'],
  street: ['gate', 'mailbox', 'bench', 'crossing', 'kiosk'],
  body: ['head', 'shoulder', 'hand', 'knee', 'foot'],
  /* Eigener Palast: feste Kennungen, freie Beschriftungen. */
  own: ['own1', 'own2', 'own3', 'own4', 'own5'],
}

export const STATIONS_PER_WALK = 5

/**
 * Was abgelegt wird: konkret, bildhaft, untereinander verschieden und
 * handlich genug, dass man es an einer Station liegen sehen kann.
 */
const OBJECTS: Partial<Record<Language, readonly string[]>> = {
  de: [
    'Akkordeon', 'Bowlingkugel', 'Bratpfanne', 'Cellokasten', 'Dartscheibe',
    'Elchgeweih', 'Fahrradklingel', 'Feuerlöscher', 'Gartenzwerg', 'Gießkanne',
    'Globus', 'Grammofon', 'Handschellen', 'Harfe', 'Kaugummiautomat',
    'Kettensäge', 'Kronleuchter', 'Kuckucksuhr', 'Lupe', 'Melone',
    'Mikroskop', 'Motorradhelm', 'Nähmaschine', 'Nilpferd', 'Notenständer',
    'Ölfass', 'Panzerschrank', 'Perücke', 'Pinguin', 'Plattenspieler',
    'Rasenmäher', 'Ritterrüstung', 'Röntgenbild', 'Sarg', 'Schaufensterpuppe',
    'Schneekugel', 'Schreibmaschine', 'Skelett', 'Stachelschwein', 'Staubsauger',
    'Strohballen', 'Taucherbrille', 'Teleskop', 'Toaster', 'Trampolin',
    'Truhe', 'Wackelpudding', 'Waschbär', 'Zahnbürste', 'Zylinderhut',
  ],
  en: [
    'accordion', 'anvilcase', 'armchair', 'banjo', 'birdcage',
    'bowlingball', 'bulldozer', 'cauldron', 'chandelier', 'chessboard',
    'cuckooclock', 'dartboard', 'dentures', 'dumbbell', 'fireextinguisher',
    'gardengnome', 'globe', 'gramophone', 'handcuffs', 'harp',
    'jukebox', 'jellyfish', 'lawnmower', 'magnifier', 'mannequin',
    'microscope', 'motorcyclehelmet', 'oildrum', 'penguin', 'periscope',
    'pinball', 'popcornmachine', 'raccoon', 'rockinghorse', 'sarcophagus',
    'sewingmachine', 'skeleton', 'snowglobe', 'suitofarmour', 'tuba',
    'toaster', 'toothbrush', 'trampoline', 'treasurechest', 'trombone',
    'turntable', 'typewriter', 'vacuumcleaner', 'watermelon', 'wigstand',
  ],
  fr: [
    'accordéon', 'aquarium', 'armure', 'banjo', 'bilboquet', 'bocal', 'xylophone', 'cage',
    'casque', 'chandelier', 'cocotte', 'dentier', 'échiquier', 'trottinette', 'épouvantail', 'girouette',
    'globe', 'gramophone', 'grille-pain', 'hérisson', 'horloge', 'jumelles', 'lampadaire', 'lampe',
    'mannequin', 'manivelle', 'microscope', 'mobylette', 'télescope', 'trampoline', 'tourne-disque', 'aspirateur',
    'balai', 'baignoire', 'brasero', 'cactus-géant', 'cerceau', 'coffre', 'crâne', 'diapason',
    'échasses', 'fanfare', 'guéridon', 'harpon', 'lustre', 'maracas', 'paravent', 'pendule',
    'squelette', 'trombone',
  ],
  es: [
    'acordeón', 'acuario', 'armadura', 'banjo', 'bolera', 'caldero', 'xilófono', 'jaulón',
    'casco', 'candelabro', 'dentadura', 'tablero', 'patinete', 'espantapájaros', 'veleta', 'globo terráqueo',
    'gramófono', 'tostadora', 'erizo', 'reloj de cuco', 'prismáticos', 'farola', 'maniquí', 'microscopio',
    'motocicleta', 'telescopio', 'trampolín', 'tocadiscos', 'aspiradora', 'bañera', 'brasero', 'cofre',
    'cráneo', 'diapasón', 'zancos', 'arpa', 'lámpara', 'maracas', 'biombo', 'esqueleto',
    'trombón', 'peluca', 'pingüino', 'sarcófago', 'máquina de escribir', 'caja fuerte', 'caballito',
    'extintor', 'mancuerna', 'parabólica',
  ],
  it: [
    'acquario', 'armatura', 'baule', 'biliardo', 'binocolo', 'boa di piume', 'busto', 'calderone',
    'candelabro', 'carrozzina', 'cassaforte', 'cavallo a dondolo', 'clavicembalo', 'cranio', 'dentiera',
    'distributore', 'estintore', 'giradischi', 'globo terrestre', 'grammofono', 'jukebox', 'lampadario',
    'macchina da cucire', 'manichino', 'microscopio', 'monopattino', 'motoscafo', 'organetto', 'paracadute',
    'paravento', 'periscopio', 'pianoforte', 'pinguino', 'proiettore', 'sarcofago', 'scheletro',
    'sfera di vetro', 'snowboard', 'telescopio', 'tostapane', 'trampolino', 'trombone', 'tuba',
    'aspirapolvere', 'xilofono', 'yo-yo', 'manubrio', 'cannone giocattolo', 'maschera subacquea', 'sveglia',
  ],
}

function listFor(language: Language): readonly string[] {
  return OBJECTS[language] ?? (OBJECTS[FALLBACK_LANGUAGE] as readonly string[])
}

export function hasPalacePool(language: Language): boolean {
  return OBJECTS[language] !== undefined
}

export const WALK_SEPARATOR = '~'
export const STATION_SEPARATOR = '#'

export function walkId(palace: PalaceId, ordinal: number): string {
  return `${palace}${WALK_SEPARATOR}${ordinal}`
}

export function palaceOf(item: string): PalaceId | undefined {
  const cut = item.indexOf(WALK_SEPARATOR)
  const name = cut === -1 ? item : item.slice(0, cut)
  return (PALACES as readonly string[]).includes(name) ? (name as PalaceId) : undefined
}

export function walkOf(item: string): string {
  const cut = item.indexOf(STATION_SEPARATOR)
  return cut === -1 ? item : item.slice(0, cut)
}

export function stationOf(item: string): string | undefined {
  const cut = item.indexOf(STATION_SEPARATOR)
  if (cut === -1) return undefined
  const station = item.slice(cut + STATION_SEPARATOR.length)
  const palace = palaceOf(item)
  if (palace === undefined) return undefined
  return STATIONS[palace].includes(station) ? station : undefined
}

export function placementId(walk: string, station: string): string {
  return `${walk}${STATION_SEPARATOR}${station}`
}

export interface Placement {
  station: string
  object: string
}

/** Ein Gang, aus seinem Anker gerechnet (G4). */
export function walkFor(walk: string, language: Language): readonly Placement[] {
  const palace = palaceOf(walk)
  if (palace === undefined) return []

  const rng = createRng(`palace:${language}:${walk}`)
  const objects = rng.shuffle(listFor(language))
  return STATIONS[palace].map((station, index) => ({
    station,
    object: objects[index] as string,
  }))
}

export function walkPlacements(walk: string): readonly string[] {
  const palace = palaceOf(walk)
  if (palace === undefined) return []
  return STATIONS[palace].map((station) => placementId(walk, station))
}

export function objectFor(item: string, language: Language): string | undefined {
  const station = stationOf(item)
  if (station === undefined) return undefined
  return walkFor(walkOf(item), language).find((entry) => entry.station === station)?.object
}

/** Vorrat an eindeutigen Gängen, reihum durch die verfügbaren Paläste. */
export function walkPool(
  seed: string,
  count: number,
  palaces: readonly PalaceId[] = READY_PALACES,
): readonly string[] {
  const rng = createRng(`palace-pool:${seed}`)
  const base = rng.int(1_000_000)
  const wheel = palaces.length === 0 ? READY_PALACES : palaces
  return Array.from({ length: count }, (_, index) =>
    walkId(wheel[index % wheel.length] as PalaceId, base + index),
  )
}

/** Ein selbst angelegter Palast (G3). */
export interface OwnPalace {
  name: string
  stations: readonly string[]
}

export const LABEL_MAX = 24

/**
 * Vollständig, fünf verschiedene Stationen, kurz und ohne die Kennungs-
 * Trennzeichen. Die Kennungen bleiben stabil, auch wenn Beschriftungen sich
 * später ändern.
 */
export function isOwnPalace(value: unknown): value is OwnPalace {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  if (typeof candidate['name'] !== 'string' || candidate['name'].trim() === '') return false
  const stations = candidate['stations']
  if (!Array.isArray(stations) || stations.length !== STATIONS_PER_WALK) return false

  const seen = new Set<string>()
  for (const station of stations) {
    if (typeof station !== 'string') return false
    const label = station.trim()
    if (label === '' || label.length > LABEL_MAX) return false
    if (label.includes(WALK_SEPARATOR) || label.includes(STATION_SEPARATOR)) return false
    const key = label.toLocaleLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
  }
  return true
}

export function ownLabelOf(own: OwnPalace, station: string): string | undefined {
  const at = STATIONS.own.indexOf(station)
  return at === -1 ? undefined : own.stations[at]?.trim()
}
