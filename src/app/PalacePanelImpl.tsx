import { useCallback, useState } from 'react'

import {
  LABEL_MAX,
  OWN_MAX_PALACES,
  OWN_MAX_STATIONS,
  OWN_MIN_STATIONS,
  type OwnPalace,
  type OwnStation,
  type Platform,
  isOwnPalace,
} from '../core/index.ts'
import { createOwnPalace, removeOwnPalace, saveOwnPalace } from '../data/palace.ts'
import { scheduleDriveSync } from './driveSync.ts'
import { ownPalaceCopyFor } from '../i18n/ownPalaceCopy.ts'

/**
 * Die eigenen Paläste (Backlog G3).
 *
 * Die Arbeit liegt nicht im Ausfüllen, sondern davor: sich einen Weg zu
 * überlegen, den man wirklich kennt. Deshalb steht der Hinweis darüber und
 * nicht als Fußnote darunter.
 *
 * Warum das überhaupt sein muss: Die drei mitgelieferten Wege raten, wie die
 * Wohnung eines Fremden aussieht. Ein Palast, den jemand selbst kennt, trägt
 * deutlich besser — das ist der Punkt der ganzen Technik.
 *
 * **Mehrere Wege, und Wege dürfen wachsen.** Wer die Technik wirklich
 * benutzt, hat nicht einen Weg mit fünf Orten, sondern mehrere und längere.
 * Ein Gang bleibt trotzdem bei fünf Stationen — ein längerer Palast liefert
 * stattdessen mehr verschiedene Gänge (siehe `core/content/palace.ts`).
 */
export function PalacePanel({
  own,
  onChange,
  platform,
}: {
  own: readonly OwnPalace[]
  onChange: () => void
  platform: Platform
}) {
  /*
   * Die Palast-Texte kommen aus dem verzögerten Modul, nicht aus dem
   * Wörterbuch: Sie werden nur hier gebraucht, und `de`/`en` liegen sonst im
   * Kaltstart-Bündel (P4). Die Oberflächensprache steht am Dokument — dieselbe
   * Quelle, die `brainCareCopyFor` und `localPhotoCopyForCurrentUi` benutzen.
   */
  const o = ownPalaceCopyFor(document.documentElement.lang)
  const [adding, setAdding] = useState(false)
  /*
   * Anlegen, Umbenennen, Wegwerfen — alle drei gehen durch `onChange`, und
   * alle drei sind Inhalt: selbst überlegte Orte der eigenen Wohnung. Sie
   * sollen das zweite Gerät erreichen, ohne auf den nächsten App-Start zu
   * warten (D-038), so wie es „Das merke ich mir“ und „Mein Gedächtnis“
   * längst tun. Ein Anstoß an einer Stelle statt drei an dreien.
   */
  const changed = useCallback(() => {
    onChange()
    scheduleDriveSync(platform)
  }, [onChange, platform])
  /*
   * Die Bestätigung gehört dem Bildschirm, nicht dem Formular.
   *
   * Sie stand vorher im Formular — und verschwand beim **Anlegen** genau in
   * dem Moment, in dem sie erscheinen sollte: Sobald der neue Weg in der
   * Liste ankommt, wird das leere Formular nicht mehr gebraucht und
   * abgeräumt, und seine Zustände gehen mit. Dieselbe Falle, vor der der
   * Kommentar weiter unten seit dem ersten Anlauf warnt, nur eine Ebene höher.
   */
  const [saved, setSaved] = useState(false)
  /*
   * Wer noch keinen Weg hat, bekommt das Formular sofort — nicht erst einen
   * Knopf, der eines verspricht. Ein leerer Bildschirm mit einer Schaltfläche
   * ist eine Frage; das Formular ist die Antwort darauf, und die kann man
   * gleich zeigen.
   */
  const showNew = adding || own.length === 0

  return (
    <div className="own-palace">
      <p className="hint">{o.ownIntro}</p>

      {own.map((palace) => (
        <PalaceEditor
          key={palace.id}
          palace={palace}
          onChange={changed}
          onSaved={() => setSaved(true)}
          onDirty={() => setSaved(false)}
          now={() => platform.clock.now()}
        />
      ))}

      {showNew && (
        <PalaceEditor
          palace={undefined}
          onChange={() => {
            setAdding(false)
            changed()
          }}
          onSaved={() => setSaved(true)}
          onDirty={() => setSaved(false)}
          now={() => platform.clock.now()}
          // Abbrechen gibt es nur, wenn es etwas gibt, wozu man zurückkehrt.
          onCancel={own.length === 0 ? undefined : () => setAdding(false)}
        />
      )}

      {!showNew &&
        (own.length < OWN_MAX_PALACES ? (
          <div className="note-actions">
            <button
              type="button"
              className="quiet"
              onClick={() => {
                setSaved(false)
                setAdding(true)
              }}
            >
              {o.ownAdd}
            </button>
          </div>
        ) : (
          <p className="hint">{o.ownFull}</p>
        ))}

      {saved && <p className="hint">{o.ownSaved}</p>}
    </div>
  )
}

/** Die Orte, mit denen das Formular startet — leer bei einem neuen Weg. */
function freshStations(palace: OwnPalace | undefined): OwnStation[] {
  if (palace !== undefined) return palace.stations.map((station) => ({ ...station }))
  return Array.from({ length: OWN_MIN_STATIONS }, (_, index) => ({ id: index + 1, label: '' }))
}

/** Die nächste freie Ortsnummer. */
function nextFor(palace: OwnPalace | undefined): number {
  return palace?.nextStation ?? OWN_MIN_STATIONS + 1
}

/**
 * Ein Weg im Formular — bestehend oder neu.
 *
 * Bestehende und neue Wege sehen absichtlich gleich aus. Ein „Anlegen"-Dialog
 * neben einer „Bearbeiten"-Ansicht wären zwei Oberflächen für dieselbe Sache,
 * und der Unterschied interessiert nur die Datenbank.
 */
function PalaceEditor({
  palace,
  onChange,
  onSaved,
  onDirty,
  onCancel,
  now,
}: {
  palace: OwnPalace | undefined
  onChange: () => void
  onSaved: () => void
  onDirty: () => void
  onCancel?: () => void
  /** Die Uhr des Geräts — für den Merkzettel des Weggeworfenen. */
  now: () => number
}) {
  /*
   * Die Palast-Texte kommen aus dem verzögerten Modul, nicht aus dem
   * Wörterbuch: Sie werden nur hier gebraucht, und `de`/`en` liegen sonst im
   * Kaltstart-Bündel (P4). Die Oberflächensprache steht am Dokument — dieselbe
   * Quelle, die `brainCareCopyFor` und `localPhotoCopyForCurrentUi` benutzen.
   */
  const o = ownPalaceCopyFor(document.documentElement.lang)
  const [name, setName] = useState(palace?.name ?? '')
  const [stations, setStations] = useState<OwnStation[]>(() => freshStations(palace))
  /*
   * Der Zähler für neue Ortsnummern. Er geht nur nach vorn — auch innerhalb
   * eines noch nicht gespeicherten Entwurfs: Wer einen Ort anhängt, wieder
   * entfernt und erneut anhängt, bekommt eine neue Nummer, keine recycelte.
   */
  const [nextStation, setNextStation] = useState(() => nextFor(palace))
  const [failed, setFailed] = useState(false)

  /** Jede Änderung nimmt die Bestätigung wieder weg — sie gilt dem Stand, der steht. */
  const touch = () => {
    setFailed(false)
    onDirty()
  }

  /*
   * Die Felder holen sich nach, was aus der Datenbank kommt.
   *
   * Zwei Anläufe sind hier gescheitert, und beide an derselben Stelle: Der
   * gespeicherte Weg trifft **später** ein als der erste Aufbau des
   * Formulars. Ein `key` am Aufrufort hat das zwar gelöst, aber den Baustein
   * beim Speichern ausgetauscht — und damit verschwand die Bestätigung genau
   * in dem Moment, in dem sie erscheinen sollte.
   *
   * Also der Weg, den React dafür vorsieht: beim Wechsel des Wertes
   * nachziehen, ohne neu zu montieren. `saved` bleibt dabei stehen — nach dem
   * Speichern kommt derselbe Weg zurück, den man gerade abgeschickt hat.
   */
  const [loaded, setLoaded] = useState(palace)
  if (palace !== loaded) {
    setLoaded(palace)
    setName(palace?.name ?? '')
    setStations(freshStations(palace))
    setNextStation(nextFor(palace))
  }

  /*
   * Für die Prüfung braucht der Entwurf eine Kennung. Ein neuer Weg hat noch
   * keine — `own` steht hier stellvertretend, damit dieselbe Prüfung wie beim
   * Speichern greift. Die echte Kennung vergibt `createOwnPalace`, und zwar
   * aus einem Zähler, der nur nach vorn geht.
   */
  const draft: OwnPalace = { id: palace?.id ?? 'own', name, stations, nextStation }
  const valid = isOwnPalace(draft)

  const save = () => {
    setFailed(false)
    const done = (ok: boolean) => {
      setFailed(!ok)
      if (ok) onSaved()
    }
    if (palace === undefined) {
      void createOwnPalace(name, stations.map((station) => station.label))
        .then((created) => done(created !== undefined))
        .catch(() => done(false))
        .finally(onChange)
      return
    }
    void saveOwnPalace({ ...draft, id: palace.id })
      .then(done)
      .catch(() => done(false))
      .finally(onChange)
  }

  return (
    <section className="own-palace-entry">
      <label className="own-field">
        <span>{o.ownName}</span>
        <input
          type="text"
          value={name}
          maxLength={LABEL_MAX}
          placeholder={o.ownNamePlaceholder}
          onChange={(event) => {
            setName(event.target.value)
            touch()
          }}
        />
      </label>

      {/*
        Nummeriert wie beim Gang selbst: Die Reihenfolge ist die halbe
        Technik, und sie wird hier festgelegt. Wer die Felder als Liste ohne
        Nummern sieht, füllt sie als Liste aus.
      */}
      <ol className="own-stations">
        {stations.map((station, index) => (
          <li key={station.id}>
            <span className="walk-step" aria-hidden="true">
              {index + 1}
            </span>
            <input
              type="text"
              value={station.label}
              maxLength={LABEL_MAX}
              placeholder={o.ownStationPlaceholder}
              aria-label={`${o.ownStation} ${index + 1}`}
              onChange={(event) => {
                const next = [...stations]
                next[index] = { ...station, label: event.target.value }
                setStations(next)
                touch()
              }}
            />
            {/*
              Jeder Ort lässt sich entfernen, nicht nur der letzte.
              Möglich ist das, weil die Nummer eines Ortes dauerhaft ist und
              nicht seine Position: Wer den dritten von sechs herausnimmt,
              hinterlässt 1, 2, 4, 5, 6 — und die vier bleibt die vier. Genau
              deshalb rutschen die Termine der übrigen Orte nicht mit.
            */}
            {stations.length > OWN_MIN_STATIONS && (
              <button
                type="button"
                className="own-station-drop"
                aria-label={`${o.ownRemoveStation}: ${station.label.trim() === '' ? index + 1 : station.label}`}
                onClick={() => {
                  setStations(stations.filter((entry) => entry.id !== station.id))
                  touch()
                }}
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ol>

      {stations.length < OWN_MAX_STATIONS && (
        <div className="note-actions own-station-actions">
          <button
            type="button"
            className="quiet"
            onClick={() => {
              setStations([...stations, { id: nextStation, label: '' }])
              setNextStation(nextStation + 1)
              touch()
            }}
          >
            {o.ownAddStation}
          </button>
        </div>
      )}

      <div className="note-actions">
        <button type="button" className="quiet" disabled={!valid} onClick={save}>
          {palace === undefined ? o.ownCreate : o.ownSave}
        </button>
        {palace !== undefined && (
          <button
            type="button"
            className="quiet"
            onClick={() => {
              /*
               * Weggeworfen wird nur das Schild, nicht die Geschichte: Die
               * abgelegten Gegenstände bleiben in der Datenbank stehen. Ein
               * Wiederholungstermin ohne Schild wird solange übergangen.
               *
               * Anders als früher kommt der Weg dadurch **nicht** zurück, wenn
               * man ihn neu anlegt: Der neue bekommt eine neue Kennung, damit
               * er nicht die Termine des alten erbt.
               */
              void removeOwnPalace(palace.id, now())
                .catch(() => undefined)
                .finally(onChange)
            }}
          >
            {o.ownDiscard}
          </button>
        )}
        {palace === undefined && onCancel !== undefined && (
          <button type="button" className="quiet" onClick={onCancel}>
            {o.ownCancel}
          </button>
        )}
      </div>

      {/*
        Die Regel steht da, solange der Weg unvollständig ist — und zwar auch
        über einem leeren Formular.

        Sie erschien früher erst nach der ersten Eingabe. Das war als
        Zurückhaltung gemeint (G-2) und wurde zur Sackgasse: Wer den Bildschirm
        zum ersten Mal sah, fand einen ausgegrauten „Weg anlegen"-Knopf ohne
        ein Wort dazu, warum er nicht geht.
      */}
      {!valid && <p className="hint own-rule">{o.ownRule}</p>}
      {failed && (
        <p className="hint" role="alert">
          {o.ownFailed}
        </p>
      )}
    </section>
  )
}
