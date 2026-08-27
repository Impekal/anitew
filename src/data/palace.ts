/**
 * Die eigenen Paläste auf dem Gerät (Backlog G3).
 *
 * Eine Zeile in den Einstellungen, wie der Lernstand der Technik — dadurch
 * wandert sie mit der Sicherung (N2) mit. Und das ist hier mehr als
 * Bequemlichkeit: Wer sich Orte seiner eigenen Wohnung überlegt und sie bei
 * einem Gerätewechsel verliert, legt sie kein zweites Mal an.
 *
 * Was eine **gültige** Eingabe ist, entscheidet `core/content/palace.ts` und
 * wird dort ohne Browser geprüft (D-010). Hier steht nur lesen und schreiben —
 * und die eine Stelle, an der aus einem Palast eine Liste wurde.
 */

import {
  OWN_MAX_PALACES,
  type OwnPalace,
  type OwnStation,
  isOwnPalace,
  ownPalaceId,
} from '../core/index.ts'

import { db } from './db.ts'

/** Der alte Schlüssel: genau ein Palast, ohne Kennung. */
const LEGACY_KEY = 'palace.own'
/** Der neue: eine Liste und der Zähler für die nächste Kennung. */
const KEY = 'palace.own.v2'

interface OwnPalaceStore {
  palaces: readonly OwnPalace[]
  /** Die nächste zu vergebende laufende Nummer. Sie geht nur nach vorn. */
  nextOrdinal: number
}

const EMPTY: OwnPalaceStore = { palaces: [], nextOrdinal: 1 }

function cleaned(palace: OwnPalace): OwnPalace {
  return {
    id: palace.id,
    name: palace.name.trim(),
    stations: palace.stations.map((station) => ({ id: station.id, label: station.label.trim() })),
    nextStation: palace.nextStation,
  }
}

/**
 * Aus einer Liste von Schildern wird eine Liste von Orten mit Nummern.
 *
 * Nur für den Umstieg: Vor dieser Fassung war ein Ort seine Position im Feld.
 * Position eins wird Nummer eins — anders wäre es ein Bruch, denn an
 * `own~7#own3` hängen Termine.
 */
function stationsFromLabels(labels: readonly string[]): readonly OwnStation[] {
  return labels.map((label, index) => ({ id: index + 1, label: label.trim() }))
}

/** Ein Palast aus einem der beiden Altformate, oder `undefined`. */
function fromLegacy(value: unknown, id: string): OwnPalace | undefined {
  if (typeof value !== 'object' || value === null) return undefined
  const candidate = value as Record<string, unknown>
  const stations = candidate['stations']
  if (!Array.isArray(stations) || !stations.every((entry) => typeof entry === 'string')) {
    return undefined
  }
  const migrated: OwnPalace = {
    id,
    name: typeof candidate['name'] === 'string' ? candidate['name'] : '',
    stations: stationsFromLabels(stations as readonly string[]),
    nextStation: stations.length + 1,
  }
  return isOwnPalace(migrated) ? cleaned(migrated) : undefined
}

/**
 * Alle eigenen Paläste, oder eine leere Liste.
 *
 * Was nicht durch die Prüfung kommt, gilt als nicht vorhanden — die
 * Einstellungen können aus einer Sicherung stammen, und eine Sicherung kann
 * alles enthalten. Lieber kein eigener Palast als einer mit einer leeren
 * Station, an der später eine Frage ohne Schild steht.
 *
 * **Der alte Schlüssel wird weiter gelesen.** Wer die App vor dieser Version
 * benutzt hat, hat genau einen Palast unter `palace.own` liegen; der wird zum
 * ersten Eintrag der Liste und behält die Kennung `own`. Das ist keine
 * Umnummerierung, sondern das Gegenteil davon: An `own~7#own3` hängt
 * Wiederholungsverlauf, und der bleibt gültig.
 */
export async function loadOwnPalaces(): Promise<readonly OwnPalace[]> {
  return (await loadStore()).palaces
}

async function loadStore(): Promise<OwnPalaceStore> {
  const stored = (await db.settings.get(KEY))?.value
  if (isStore(stored)) {
    return { palaces: stored.palaces.map(cleaned), nextOrdinal: stored.nextOrdinal }
  }

  /*
   * Zwei Altformate, beide werden gelesen.
   *
   * `palace.own.v2` hielt die Orte als reine Schilderliste — diese Fassung gab
   * es nur wenige Stunden. `palace.own` hält genau einen Palast ohne Kennung;
   * so sah es aus, bevor es mehrere Wege gab. Aus beidem wird dasselbe: Orte
   * mit Nummern, Position eins wird Nummer eins.
   */
  if (typeof stored === 'object' && stored !== null) {
    const candidate = stored as Record<string, unknown>
    const list = candidate['palaces']
    if (Array.isArray(list)) {
      const palaces = list
        .map((entry) => {
          const row = entry as Record<string, unknown>
          const id = typeof row['id'] === 'string' ? row['id'] : 'own'
          return fromLegacy(row, id)
        })
        .filter((entry): entry is OwnPalace => entry !== undefined)
      if (palaces.length > 0) {
        const next = candidate['nextOrdinal']
        return {
          palaces,
          nextOrdinal: typeof next === 'number' && Number.isInteger(next) && next >= 1
            ? next
            : palaces.length + 1,
        }
      }
    }
  }

  const legacy = (await db.settings.get(LEGACY_KEY))?.value
  const migrated = fromLegacy(legacy, 'own')
  if (migrated !== undefined) return { palaces: [migrated], nextOrdinal: 2 }
  return EMPTY
}

function isStore(value: unknown): value is OwnPalaceStore {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  const palaces = candidate['palaces']
  const next = candidate['nextOrdinal']
  if (!Array.isArray(palaces) || !palaces.every(isOwnPalace)) return false
  return typeof next === 'number' && Number.isInteger(next) && next >= 1
}

/**
 * Legt einen Palast an und gibt ihn zurück — oder `undefined`, wenn die
 * Obergrenze erreicht ist oder die Eingabe nicht trägt.
 *
 * Die Kennung kommt aus `nextOrdinal` und wird **nie wiederverwendet**. Wer
 * einen Palast wegwirft und einen neuen anlegt, bekommt eine neue Nummer;
 * sonst erbte der neue die Termine des alten.
 */
export async function createOwnPalace(
  name: string,
  labels: readonly string[],
): Promise<OwnPalace | undefined> {
  const store = await loadStore()
  if (store.palaces.length >= OWN_MAX_PALACES) return undefined

  const palace: OwnPalace = {
    id: ownPalaceId(store.nextOrdinal),
    name,
    stations: stationsFromLabels(labels),
    nextStation: labels.length + 1,
  }
  if (!isOwnPalace(palace)) return undefined

  await writeStore({
    palaces: [...store.palaces, cleaned(palace)],
    nextOrdinal: store.nextOrdinal + 1,
  })
  return cleaned(palace)
}

/** Ersetzt einen bestehenden Palast — Name, Orte oder beides. */
export async function saveOwnPalace(palace: OwnPalace): Promise<boolean> {
  if (!isOwnPalace(palace)) return false
  const store = await loadStore()
  const at = store.palaces.findIndex((entry) => entry.id === palace.id)
  if (at === -1) return false

  const palaces = [...store.palaces]
  palaces[at] = cleaned(palace)
  await writeStore({ ...store, palaces })
  return true
}

/**
 * Wirft einen Palast weg.
 *
 * Die **Gänge bleiben stehen**. Sie hängen an Kennungen wie `own~7#own3`, und
 * die bleiben gültig — nur steht auf dem Schild nichts mehr. Deshalb legt der
 * Vorrat ohne diesen Palast auch keine neuen Gänge dorthin, und ein fälliger
 * alter wird übergangen statt ohne Schild gefragt.
 */
export async function removeOwnPalace(id: string): Promise<void> {
  const store = await loadStore()
  await writeStore({ ...store, palaces: store.palaces.filter((entry) => entry.id !== id) })
}

async function writeStore(store: OwnPalaceStore): Promise<void> {
  await db.settings.put({ key: KEY, value: { ...store, palaces: store.palaces.map(cleaned) } })

  /*
   * Den alten Schlüssel mitschreiben, solange es den ersten Palast gibt.
   *
   * Das kostet eine Zeile und macht einen Rückschritt auf die vorige Version
   * harmlos: Sie findet ihren Palast, wo sie ihn erwartet. Die Regel lautet
   * „keine riskanten Datenmigrationen" — der billigste Weg, sie einzuhalten,
   * ist, den alten Stand nicht wegzuwerfen.
   */
  const first = store.palaces.find((entry) => entry.id === 'own')
  if (first === undefined) return
  await db.settings.put({
    key: LEGACY_KEY,
    value: {
      name: first.name,
      stations: first.stations.slice(0, 5).map((station) => station.label),
    },
  })
}
