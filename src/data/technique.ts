/**
 * Was von der Merktechnik schon gelehrt wurde (Backlog D5).
 *
 * Eine Zeile in den Einstellungen, mehr braucht es nicht: die Ziffern des
 * Major-Systems, die der Nutzer schon kennt. Sie liegt bewusst dort und nicht
 * in einer eigenen Tabelle — dadurch wandert sie mit der Sicherung (N2) mit,
 * ohne dass jemand daran denken muss. Wer sein Gerät wechselt, fängt nicht
 * wieder bei der Eins an.
 */

import { TEACH_ORDER } from '../core/index.ts'

import { db } from './db.ts'

const KEY = 'technique.major.taught'

/**
 * Die Form mit Zeitpunkt (Nutzerwunsch 03.09.).
 *
 * Bis zum 03.09. stand hier eine nackte Liste bzw. ein nacktes `true`. Das
 * reichte, solange es nur vorwärts ging: Der Abgleich vereinigt Lernstand,
 * und Vereinigen kennt keine Reihenfolge.
 *
 * „Neu anfangen" braucht sie aber. Ohne Zeitpunkt holt der nächste Abgleich
 * vom anderen Gerät zurück, was gerade zurückgesetzt wurde — auf dem Gerät,
 * an dem man gedrückt hat, sähe es nach Erfolg aus, bis zum nächsten
 * Abgleich. Die Regel dazu steht in `core/sync/settings.ts`.
 *
 * Gelesen wird weiterhin **beides**: Wer die App aktualisiert, hat seinen
 * alten Stand noch in der nackten Form liegen.
 */
interface Gelernt {
  readonly at: number
  readonly clearedAt?: number
  readonly digits?: readonly number[]
  readonly taught?: boolean
}

function gelesen(value: unknown): Gelernt | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return undefined
  const eintrag = value as Gelernt
  return typeof eintrag.at === 'number' ? eintrag : undefined
}

/** Das bisherige Zurücksetzen bleibt beim Schreiben stehen — es ist Wissen. */
async function bisherigesZuruecksetzen(key: string): Promise<number | undefined> {
  return gelesen((await db.settings.get(key))?.value)?.clearedAt
}

async function schreibe(key: string, inhalt: Partial<Gelernt>, now: number): Promise<void> {
  const clearedAt = await bisherigesZuruecksetzen(key)
  await db.settings.put({
    key,
    value: clearedAt === undefined ? { ...inhalt, at: now } : { ...inhalt, at: now, clearedAt },
  })
}

/**
 * Die gelernten Ziffern, aufgeräumt.
 *
 * Fremde Werte fliegen raus — die Einstellungen können aus einer Sicherung
 * kommen, und eine Sicherung kann alles enthalten. Was hier zurückkommt, ist
 * eine Liste von Ziffern, die es im Major-System wirklich gibt.
 */
export async function loadTaught(): Promise<number[]> {
  const stored = (await db.settings.get(KEY))?.value
  const liste = gelesen(stored)?.digits ?? stored
  if (!Array.isArray(liste)) return []
  return TEACH_ORDER.filter((digit) => liste.includes(digit))
}

/** Merkt sich, dass diese Ziffer erklärt wurde. Zweimal schadet nicht. */
export async function markTaught(digit: number, now = Date.now()): Promise<void> {
  if (!TEACH_ORDER.includes(digit)) return
  const taught = await loadTaught()
  if (taught.includes(digit)) return
  await schreibe(KEY, { digits: [...taught, digit] }, now)
}

/**
 * Der Gedächtnispalast wird **einmal** erklärt (Backlog G).
 *
 * Kein Fortschritt wie bei den zehn Ziffern, nur ein Ja oder Nein: Die
 * Technik ist in drei Schritten erzählt. Sie liegt aus demselben Grund in den
 * Einstellungen — sie wandert mit der Sicherung, ohne dass jemand daran
 * denken muss.
 */
const PALACE_KEY = 'technique.palace.taught'

export async function loadPalaceTaught(): Promise<boolean> {
  const stored = (await db.settings.get(PALACE_KEY))?.value
  return (gelesen(stored)?.taught ?? stored) === true
}

export async function markPalaceTaught(now = Date.now()): Promise<void> {
  await schreibe(PALACE_KEY, { taught: true }, now)
}

/**
 * Die Einpräge-Lektionen: Geschichte und Verknüpfung (D5 · D-013).
 *
 * Wie beim Palast je ein Ja/Nein — und aus demselben Grund in den
 * Einstellungen: Sie wandern mit der Sicherung.
 */
const STORY_KEY = 'technique.story.taught'
const LINK_KEY = 'technique.link.taught'

export async function loadStoryTaught(): Promise<boolean> {
  const stored = (await db.settings.get(STORY_KEY))?.value
  return (gelesen(stored)?.taught ?? stored) === true
}

export async function markStoryTaught(now = Date.now()): Promise<void> {
  await schreibe(STORY_KEY, { taught: true }, now)
}

export async function loadLinkTaught(): Promise<boolean> {
  const stored = (await db.settings.get(LINK_KEY))?.value
  return (gelesen(stored)?.taught ?? stored) === true
}

export async function markLinkTaught(now = Date.now()): Promise<void> {
  await schreibe(LINK_KEY, { taught: true }, now)
}

/**
 * Das **Verfahren** des Major-Systems (D5, Gerätemeldung 01.09.).
 *
 * Getrennt von den zehn Ziffern, weil es etwas anderes ist: Die Ziffern sind
 * zehn Zuordnungen, das Verfahren ist der eine Gedanke dahinter. Wer die
 * zweite Ziffer lernt und den Gedanken nie gehört hat, hält die Zuordnung für
 * eine Marotte — genau so wurde es gemeldet.
 *
 * Der Schlüssel endet auf `.taught`, damit der Drive-Abgleich ihn wie die
 * anderen Ja/Nein-Lektionen behandelt (Vereinigung statt Zurückdrehen).
 */
const METHOD_KEY = 'technique.major.method.taught'

export async function loadMajorMethodTaught(): Promise<boolean> {
  const stored = (await db.settings.get(METHOD_KEY))?.value
  return (gelesen(stored)?.taught ?? stored) === true
}

export async function markMajorMethodTaught(now = Date.now()): Promise<void> {
  await schreibe(METHOD_KEY, { taught: true }, now)
}

/**
 * Alle Schlüssel des Lernstands — an einer Stelle, damit „alles neu anfangen"
 * keinen vergessen kann.
 */
const ALLE_SCHLUESSEL = [KEY, METHOD_KEY, PALACE_KEY, STORY_KEY, LINK_KEY] as const

/** Welche Schlüssel zu welcher Lektion gehören. */
const JE_LEKTION: Readonly<Record<string, readonly string[]>> = {
  story: [STORY_KEY],
  link: [LINK_KEY],
  major: [KEY, METHOD_KEY],
  palace: [PALACE_KEY],
}

/**
 * Eine Lektion auf null stellen — bewusst und mit Zeitpunkt.
 *
 * Der Zeitpunkt ist nicht Zierrat: Er ist das Einzige, woran der Abgleich
 * erkennt, dass hier jemand etwas gewollt hat. Ohne ihn holt das andere
 * Gerät den alten Stand zurück (siehe `core/sync/settings.ts`).
 *
 * **Was hier nicht passiert:** Wiederholungstermine bleiben unangetastet.
 * Wer die Palast-Lektion noch einmal lesen will, verliert dadurch nicht,
 * was er sich in Palästen gemerkt hat. Zurückgesetzt wird der Unterricht,
 * nicht das Gedächtnis.
 */
export async function clearLesson(topic: string, now = Date.now()): Promise<void> {
  const schluessel = JE_LEKTION[topic]
  if (schluessel === undefined) return
  for (const key of schluessel) {
    const leer = key === KEY ? { digits: [] } : { taught: false }
    await db.settings.put({ key, value: { ...leer, at: now, clearedAt: now } })
  }
}

/** Alles auf null — dieselbe Zusage, nur für jede Lektion. */
export async function clearAllLessons(now = Date.now()): Promise<void> {
  for (const key of ALLE_SCHLUESSEL) {
    const leer = key === KEY ? { digits: [] } : { taught: false }
    await db.settings.put({ key, value: { ...leer, at: now, clearedAt: now } })
  }
}
