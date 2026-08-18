/**
 * Der Gedächtnispalast (Backlog G1, G2, G4, G6, G7).
 *
 * Die älteste Merktechnik, die es gibt, und die einzige mit einer eigenen
 * Untersuchung hinter sich (`core/science.ts`, `mnemonics`): Man legt, was man
 * behalten will, an **Orte**, die man ohnehin auswendig kennt — und geht sie
 * später ab. Der Ort ist der Haken, an dem die Erinnerung hängt.
 *
 * ── Was ein Palast hier ist ───────────────────────────────────────────────
 *
 * Ein Palast ist eine **feste Reihenfolge von Stationen** (G1). Fest ist das
 * Wesentliche: Ein Weg, der jedes Mal anders verliefe, wäre kein Weg, sondern
 * eine Liste — und die Reihenfolge ist genau das, was einen beim Abgehen
 * trägt. Drei Paläste stehen bereit (G2): die eigene Wohnung, der Weg vor der
 * Tür, der eigene Körper. Sie sind absichtlich die drei banalsten Orte der
 * Welt; ein Palast wirkt, weil man ihn kennt, nicht weil er schön ist.
 *
 * Dass jemand später **eigene** Räume anlegen kann, steht als G3 im Backlog
 * und fehlt noch. Ein eigener Palast wirkt deutlich besser als ein fremder —
 * bis dahin sind die drei hier eine Krücke, und die Texte sagen das auch.
 *
 * ── Ein Gang ist eine Szene (wie bei den Missionen, D-014) ────────────────
 *
 * Der Aufbau ist derselbe wie bei den Memory Missions, und das ist kein
 * Zufall: Beides sind **Bindungen**, keine Einzelstücke. Dort hängen vier
 * Tatsachen an einer Person, hier hängt je ein Gegenstand an je einer
 * Station. Also dieselbe Bauform:
 *
 *   Anker  `wohnung~3`         — ein Gang durch einen Palast
 *   Stück  `wohnung~3#kueche`  — was in der Küche lag
 *
 * Und dieselbe Verlässlichkeit: Derselbe Gang ergibt immer dieselben
 * Gegenstände, weil sie aus dem Anker gerechnet und nicht gespeichert werden.
 * Ohne das wäre das Wiedersehen in drei Wochen nicht möglich (G7) — dann
 * hinge ein Palast außerhalb der Wiederholungsplanung, und aus der stärksten
 * Technik der App würde ein hübscher Nebenschauplatz.
 *
 * ── Warum die Gegenstände einen eigenen Vorrat haben ──────────────────────
 *
 * Sie könnten aus derselben Wortliste kommen wie das Wortmodul. Sie tun es
 * nicht, weil dann in derselben Einheit „Anker“ frei abgerufen **und** im Flur
 * abgelegt werden könnte — der freie Abruf bekäme ein Wort geschenkt, das
 * eigentlich woanders hängt. Das ist Interferenz (C6), und sie ist hier
 * vermeidbar: zwei Listen, per Test überschneidungsfrei gehalten.
 */

import { FALLBACK_LANGUAGE, type Language } from '../language.ts'
import { createRng } from '../rng.ts'

export const PALACES = ['home', 'street', 'body', 'own'] as const
export type PalaceId = (typeof PALACES)[number]

/**
 * Die mitgelieferten Wege.
 *
 * `own` steht nicht dabei: Den gibt es erst, wenn jemand ihn angelegt hat
 * (G3), und bis dahin darf ihn der Vorrat nicht ziehen.
 */
export const READY_PALACES: readonly PalaceId[] = ['home', 'street', 'body']

/**
 * Die Stationen je Palast, in der Reihenfolge des Weges.
 *
 * Fünf je Palast. Weniger trägt keine Runde, mehr überfordert den ersten
 * Gang — und wer die Technik einmal hat, baut sich ohnehin größere (G3).
 *
 * Die Kennungen sind über alle Paläste hinweg eindeutig. Das ist kein Zufall,
 * sondern die Bedingung dafür, dass die Beschriftungen in `i18n` ein flaches
 * Verzeichnis sein können — und dass eine vergessene Übersetzung ein
 * Übersetzungsfehler ist und kein leeres Schild.
 */
export const STATIONS: Readonly<Record<PalaceId, readonly string[]>> = {
  home: ['door', 'hall', 'kitchen', 'sofa', 'bed'],
  street: ['gate', 'mailbox', 'bench', 'crossing', 'kiosk'],
  body: ['head', 'shoulder', 'hand', 'knee', 'foot'],
  /*
   * Der eigene Palast hat **feste Kennungen und freie Beschriftungen** (G3).
   *
   * Das ist die entscheidende Trennung: In der Datenbank steht `own~7#own3`,
   * und was auf `own3` draufsteht — „Balkon“, später vielleicht „Balkontür“ —
   * liegt woanders. Stünde die Beschriftung in der Kennung, wäre jede
   * Umbenennung ein stiller Datenverlust: Ein Gegenstand, der vor zwei Wochen
   * auf dem Balkon abgelegt wurde, ließe sich nicht mehr erfragen. So ist es
   * derselbe Ort, nur anders geschrieben.
   */
  own: ['own1', 'own2', 'own3', 'own4', 'own5'],
}

/** Wie viele Stationen ein Gang hat. Ein Palast wird ganz abgegangen. */
export const STATIONS_PER_WALK = 5

/**
 * Was abgelegt wird.
 *
 * Dieselbe Regel wie beim Wortvorrat: konkret, bildhaft, untereinander
 * verschieden. Zusätzlich **handlich** — etwas, das man sich an einer Stelle
 * liegen sehen kann. „Wasserfall“ ist ein gutes Wort und ein schlechter
 * Gegenstand für einen Flur.
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
}

function listFor(language: Language): readonly string[] {
  return OBJECTS[language] ?? (OBJECTS[FALLBACK_LANGUAGE] as readonly string[])
}

/** Gibt es für diese Sprache eigene Gegenstände? */
export function hasPalacePool(language: Language): boolean {
  return OBJECTS[language] !== undefined
}

/**
 * Trennzeichen zwischen Palast und Gangnummer.
 *
 * Nicht der Doppelpunkt (der trennt Modul, Sprache und Gegenstand in der
 * Datenbankkennung) und nicht die Raute (die trennt Anker und Station, genau
 * wie bei den Missionen). Ein drittes Zeichen für eine dritte Ebene.
 */
export const WALK_SEPARATOR = '~'
export const STATION_SEPARATOR = '#'

export function walkId(palace: PalaceId, ordinal: number): string {
  return `${palace}${WALK_SEPARATOR}${ordinal}`
}

/** Zu welchem Palast ein Gang oder eine Ablage gehört. */
export function palaceOf(item: string): PalaceId | undefined {
  const cut = item.indexOf(WALK_SEPARATOR)
  const name = cut === -1 ? item : item.slice(0, cut)
  return (PALACES as readonly string[]).includes(name) ? (name as PalaceId) : undefined
}

/** Der Anker einer Ablage — der Gang, zu dem sie gehört. */
export function walkOf(item: string): string {
  const cut = item.indexOf(STATION_SEPARATOR)
  return cut === -1 ? item : item.slice(0, cut)
}

/** An welcher Station, oder `undefined` bei einer fremden Kennung. */
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
  /** Was dort liegt — und später gesucht ist. */
  object: string
}

/**
 * Ein Gang, aus seinem Anker gerechnet (G4).
 *
 * Die Zuordnung Gegenstand → Station passiert hier und nicht im Kopf des
 * Nutzers: Beim ersten Mal wäre „such dir selbst aus, was wohin kommt“ eine
 * Aufgabe vor der Aufgabe. Was der Nutzer selbst bauen muss — und was ihm die
 * App ausdrücklich **nicht** abnimmt —, ist das **Bild** (D-013, D-017).
 *
 * Die Sprache steckt im Seed: Derselbe Gang ergibt auf Deutsch und auf
 * Englisch verschiedene Gegenstände. Sie sind auch verschiedene
 * Gedächtnisinhalte.
 */
export function walkFor(walk: string, language: Language): readonly Placement[] {
  const palace = palaceOf(walk)
  if (palace === undefined) return []

  const rng = createRng(`palace:${language}:${walk}`)
  // Ohne Zurücklegen: Zweimal derselbe Gegenstand in einem Gang wäre nicht
  // schwerer, sondern unbeantwortbar — an welcher Station lag er denn nun?
  const objects = rng.shuffle(listFor(language))

  return STATIONS[palace].map((station, index) => ({
    station,
    object: objects[index] as string,
  }))
}

/** Die Ablagen eines Ganges, in der Reihenfolge des Weges. */
export function walkPlacements(walk: string): readonly string[] {
  const palace = palaceOf(walk)
  if (palace === undefined) return []
  return STATIONS[palace].map((station) => placementId(walk, station))
}

/** Was an dieser Station lag. */
export function objectFor(item: string, language: Language): string | undefined {
  const station = stationOf(item)
  if (station === undefined) return undefined
  return walkFor(walkOf(item), language).find((entry) => entry.station === station)?.object
}

/**
 * Der Vorrat an Gängen.
 *
 * Reihum durch die drei Paläste, damit eine Einheit nicht dreimal durch
 * dieselbe Wohnung führt — und mit einer laufenden Nummer, die den Gang
 * eindeutig macht. Die Nummer ist zugleich der Grund, warum der Vorrat nie
 * ausgeht: Dieselbe Wohnung, andere Gegenstände.
 */
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

/**
 * Ein selbst angelegter Palast (Backlog G3).
 *
 * Der Grund, warum es ihn geben muss, steht in der Literatur und inzwischen
 * auch in der App: **Ein Palast, den man selbst kennt, trägt deutlich besser
 * als ein fremder.** Die drei mitgelieferten Wege sind eine Krücke — sie
 * raten, wie die Wohnung eines Fremden aussieht.
 */
export interface OwnPalace {
  name: string
  /** Die Beschriftungen, in der Reihenfolge des Weges. */
  stations: readonly string[]
}

/** Wie lang eine Beschriftung höchstens sein darf. */
export const LABEL_MAX = 24

/**
 * Ist das ein brauchbarer eigener Palast?
 *
 * Streng an genau drei Stellen, und jede hat einen Grund:
 *
 * - **Vollständig.** Fünf Stationen, keine leer. Ein Weg mit einer Lücke ist
 *   kein Weg — und beim Abgehen stünde dort ein Schild ohne Aufschrift.
 * - **Verschieden.** Zweimal „Küche“ ließe die Frage „was lag hier?“
 *   unbeantwortbar werden; genau davor schützt schon der Gegenstandsvorrat.
 * - **Kurz und ohne Trennzeichen.** `~` und `#` trennen in den Kennungen
 *   Palast, Gang und Station. In einer Beschriftung stören sie zwar nicht —
 *   sie steht ja nirgends in einer Kennung —, aber sie sehen nach einem
 *   Fehler aus, und die Regel bleibt so leichter richtig.
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

/** Was auf dem Schild dieser Station steht. */
export function ownLabelOf(own: OwnPalace, station: string): string | undefined {
  const at = STATIONS.own.indexOf(station)
  return at === -1 ? undefined : own.stations[at]?.trim()
}
