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

export const BUILT_IN_PALACES = ['home', 'street', 'body'] as const
export type BuiltInPalaceId = (typeof BUILT_IN_PALACES)[number]

/** Kennung eines Palastes: eingebaut oder selbst angelegt (`own`, `own2`, …). */
export type PalaceId = string

export const READY_PALACES: readonly PalaceId[] = BUILT_IN_PALACES

export const STATIONS: Readonly<Record<BuiltInPalaceId, readonly string[]>> = {
  home: ['door', 'hall', 'kitchen', 'sofa', 'bed'],
  street: ['gate', 'mailbox', 'bench', 'crossing', 'kiosk'],
  body: ['head', 'shoulder', 'hand', 'knee', 'foot'],
}

/**
 * Ein Gang bleibt bei fünf Stationen — auch in einem langen Palast.
 *
 * Das ist die wichtigste Entscheidung an der ganzen Erweiterung. Ein Gang
 * könnte auch den **ganzen** Palast abgehen; dann hätte ein Weg mit zwölf
 * Orten eine Szene mit zwölf Dingen, und die Sechzig-Sekunden-Einheit wäre
 * stillschweigend eine andere geworden. Stattdessen liefert ein längerer
 * Palast **mehr verschiedene Gänge** — man geht einen Abschnitt seines Weges
 * ab, nicht jedes Mal den ganzen. Das ist näher an der Technik, und für jeden
 * bestehenden Fünf-Stationen-Palast ändert sich dadurch nichts.
 */
export const STATIONS_PER_WALK = 5

/** Ein Palast unter fünf Orten ist keiner; über zwanzig geht keiner mehr ab. */
export const OWN_MIN_STATIONS = 5
export const OWN_MAX_STATIONS = 20

/**
 * Wie viele eigene Paläste.
 *
 * Keine technische Grenze, eine Lernwirkung: Der Gang-Vorrat verteilt sich
 * reihum über die verfügbaren Paläste. Bei zwanzig Palästen kommt man in
 * keinem mehr richtig an.
 */
export const OWN_MAX_PALACES = 8

const OWN_ID = /^own([2-9]|[1-9][0-9]+)?$/
const OWN_STATION = /^own([1-9][0-9]*)$/

/** Ist das die Kennung eines selbst angelegten Palastes? */
export function isOwnPalaceId(id: string): boolean {
  return OWN_ID.test(id)
}

export function isPalaceId(id: string): boolean {
  return (BUILT_IN_PALACES as readonly string[]).includes(id) || isOwnPalaceId(id)
}

/** Die Kennung des n-ten eigenen Palastes. Der erste heißt `own` — siehe `data/palace.ts`. */
export function ownPalaceId(ordinal: number): PalaceId {
  return ordinal <= 1 ? 'own' : `own${ordinal}`
}

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
  pt: [
    'acordeão', 'aquário', 'armadura', 'banjo', 'bola de boliche', 'caldeirão', 'xilofone', 'gaiolão',
    'capacete espacial', 'candelabro', 'dentadura', 'tabuleiro de xadrez', 'patinete', 'espantalho', 'catavento', 'globo terrestre',
    'gramofone', 'torradeira', 'ouriço', 'relógio cuco', 'binóculo', 'poste de luz', 'manequim', 'microscópio',
    'motocicleta', 'periscópio', 'trampolim', 'toca-discos', 'aspirador', 'banheira', 'braseiro', 'baú',
    'crânio', 'diapasão', 'pernas de pau', 'harpa', 'luminária', 'maracas', 'biombo', 'esqueleto',
    'trombone', 'peruca gigante', 'pinguim', 'sarcófago', 'máquina de escrever', 'cofre', 'cavalo de balanço',
    'extintor', 'halter', 'paraquedas',
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

/**
 * Die Kennung eines Gangs: Palast, laufende Nummer und — nur wenn nötig — der
 * Abschnitt des Palastes, den er abgeht.
 *
 * Ohne Abschnitt sieht sie aus wie bisher (`own~7`), und das ist kein Zufall:
 * Jeder Gang, der heute in einer Datenbank steht, behält damit genau seine
 * Kennung. An Kennungen hängt der Wiederholungsverlauf — sie umzunummerieren
 * hieße, Geschichte wegzuwerfen.
 */
export function walkId(palace: PalaceId, ordinal: number, offset = 0): string {
  return offset <= 0
    ? `${palace}${WALK_SEPARATOR}${ordinal}`
    : `${palace}${WALK_SEPARATOR}${ordinal}${WALK_SEPARATOR}${offset}`
}

export function palaceOf(item: string): PalaceId | undefined {
  const cut = item.indexOf(WALK_SEPARATOR)
  const name = cut === -1 ? item : item.slice(0, cut)
  return isPalaceId(name) ? name : undefined
}

/** Ab welcher Station des Palastes der Gang läuft (0 = am Anfang). */
export function offsetOf(walk: string): number {
  const parts = walkOf(walk).split(WALK_SEPARATOR)
  if (parts.length < 3) return 0
  const offset = Number(parts[2])
  return Number.isInteger(offset) && offset > 0 ? offset : 0
}

/**
 * Die fünf Stationen dieses Gangs.
 *
 * Sie stehen **vollständig in der Kennung** — der Palast selbst muss dafür
 * nicht bekannt sein. Das ist der Grund für den Abschnitt in der Kennung:
 * `core/session/planBase.ts` löst Gänge auf, ohne die Einstellungen des
 * Nutzers zu kennen, und soll das auch weiterhin nicht müssen (D-010).
 */
export function walkStations(walk: string): readonly string[] {
  const palace = palaceOf(walk)
  if (palace === undefined) return []
  if (!isOwnPalaceId(palace)) return STATIONS[palace as BuiltInPalaceId] ?? []
  const offset = offsetOf(walk)
  return Array.from({ length: STATIONS_PER_WALK }, (_, index) => `own${offset + index + 1}`)
}

/**
 * Die Anfänge der Abschnitte eines Palastes dieser Länge.
 *
 * Fünf Orte ergeben einen Gang. Zwölf ergeben drei: 1–5, 6–10 und 8–12 — der
 * letzte rückt zurück, statt über das Ende hinauszulaufen. Lieber eine
 * Überlappung als ein Abschnitt, der ins Leere zeigt.
 */
export function windowStarts(stationCount: number): readonly number[] {
  if (stationCount <= STATIONS_PER_WALK) return [0]
  const last = stationCount - STATIONS_PER_WALK
  const starts: number[] = []
  for (let start = 0; start < last; start += STATIONS_PER_WALK) starts.push(start)
  starts.push(last)
  return starts
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
  if (isOwnPalaceId(palace)) return OWN_STATION.test(station) ? station : undefined
  return STATIONS[palace as BuiltInPalaceId]?.includes(station) === true ? station : undefined
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
  return walkStations(walk).map((station, index) => ({
    station,
    object: objects[index] as string,
  }))
}

export function walkPlacements(walk: string): readonly string[] {
  return walkStations(walk).map((station) => placementId(walk, station))
}

export function objectFor(item: string, language: Language): string | undefined {
  const station = stationOf(item)
  if (station === undefined) return undefined
  return walkFor(walkOf(item), language).find((entry) => entry.station === station)?.object
}

/** Ein Palast, so weit der Vorrat ihn kennen muss: Kennung und Länge. */
export interface PalaceSpec {
  id: PalaceId
  stationCount: number
}

const READY_SPECS: readonly PalaceSpec[] = BUILT_IN_PALACES.map((id) => ({
  id,
  stationCount: STATIONS[id].length,
}))

/**
 * Vorrat an eindeutigen Gängen, reihum durch die verfügbaren Paläste.
 *
 * Reihum **und** durch die Abschnitte: Ein Palast mit zwölf Orten steuert drei
 * verschiedene Gänge bei, keine drei Kopien desselben. Sonst wäre das
 * Hinzufügen von Orten eine Zahl ohne Wirkung.
 */
export function walkPool(
  seed: string,
  count: number,
  palaces: readonly PalaceSpec[] = READY_SPECS,
): readonly string[] {
  const rng = createRng(`palace-pool:${seed}`)
  const base = rng.int(1_000_000)
  const wheel = palaces.length === 0 ? READY_SPECS : palaces
  return Array.from({ length: count }, (_, index) => {
    const spec = wheel[index % wheel.length] as PalaceSpec
    const starts = windowStarts(spec.stationCount)
    const round = Math.floor(index / wheel.length)
    return walkId(spec.id, base + index, starts[round % starts.length] as number)
  })
}

/** Ein selbst angelegter Palast (G3). */
export interface OwnPalace {
  /**
   * Die Kennung. Sie steht in jeder Item-Kennung dieses Palastes und wird
   * deshalb **nie wiederverwendet**: Wer einen Palast wegwirft und einen neuen
   * anlegt, bekommt eine neue Nummer, sonst erbte der neue den
   * Wiederholungsverlauf des alten.
   */
  id: PalaceId
  name: string
  stations: readonly string[]
}

export const LABEL_MAX = 24

/**
 * Vollständig, mindestens fünf verschiedene Stationen, kurz und ohne die
 * Kennungs-Trennzeichen. Die Kennungen bleiben stabil, auch wenn
 * Beschriftungen sich später ändern — Umbenennen ist deshalb gefahrlos.
 */
export function isOwnPalace(value: unknown): value is OwnPalace {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  if (typeof candidate['id'] !== 'string' || !isOwnPalaceId(candidate['id'])) return false
  if (typeof candidate['name'] !== 'string' || candidate['name'].trim() === '') return false
  const stations = candidate['stations']
  if (!Array.isArray(stations)) return false
  if (stations.length < OWN_MIN_STATIONS || stations.length > OWN_MAX_STATIONS) return false

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

/**
 * Das Schild einer Station. `own7` ist die siebte des Palastes — die Nummer
 * ist die Stelle im Weg und ändert sich nie, das Schild darf jederzeit.
 */
export function ownLabelOf(own: OwnPalace, station: string): string | undefined {
  const match = OWN_STATION.exec(station)
  if (match === null) return undefined
  const at = Number(match[1]) - 1
  return own.stations[at]?.trim()
}

/**
 * Zeigt diese Kennung auf einen eigenen Palast, den es nicht mehr gibt?
 *
 * Dann wird der Gang übergangen statt gefragt: Die Kennung `own~7#own3` bleibt
 * gültig, nur steht auf dem Schild nichts mehr — und „Was lag hier?" ohne das
 * „hier" ist keine Frage. Gelöscht wird deshalb nichts.
 */
export function ownPalaceGone(item: string, palaces: readonly OwnPalace[]): boolean {
  const palace = palaceOf(item)
  if (palace === undefined || !isOwnPalaceId(palace)) return false
  return !palaces.some((entry) => entry.id === palace)
}

/** Der Palast zu einer Gang- oder Item-Kennung, aus der Liste des Nutzers. */
export function ownPalaceFor(
  item: string,
  palaces: readonly OwnPalace[],
): OwnPalace | undefined {
  const palace = palaceOf(item)
  if (palace === undefined || !isOwnPalaceId(palace)) return undefined
  return palaces.find((entry) => entry.id === palace)
}
