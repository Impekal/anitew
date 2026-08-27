import { useState } from 'react'

import {
  LABEL_MAX,
  OWN_MAX_PALACES,
  OWN_MAX_STATIONS,
  OWN_MIN_STATIONS,
  type OwnPalace,
  isOwnPalace,
} from '../core/index.ts'
import { createOwnPalace, removeOwnPalace, saveOwnPalace } from '../data/palace.ts'
import type { Dictionary } from '../i18n/index.ts'

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
  dictionary,
  own,
  onChange,
}: {
  dictionary: Dictionary
  own: readonly OwnPalace[]
  onChange: () => void
}) {
  const t = dictionary.palace
  const [adding, setAdding] = useState(false)
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
      <p className="hint">{t.ownIntro}</p>

      {own.map((palace) => (
        <PalaceEditor
          key={palace.id}
          dictionary={dictionary}
          palace={palace}
          onChange={onChange}
          onSaved={() => setSaved(true)}
          onDirty={() => setSaved(false)}
        />
      ))}

      {showNew && (
        <PalaceEditor
          dictionary={dictionary}
          palace={undefined}
          onChange={() => {
            setAdding(false)
            onChange()
          }}
          onSaved={() => setSaved(true)}
          onDirty={() => setSaved(false)}
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
              {t.ownAdd}
            </button>
          </div>
        ) : (
          <p className="hint">{t.ownFull}</p>
        ))}

      {saved && <p className="hint">{t.ownSaved}</p>}
    </div>
  )
}

/**
 * Ein Weg im Formular — bestehend oder neu.
 *
 * Bestehende und neue Wege sehen absichtlich gleich aus. Ein „Anlegen"-Dialog
 * neben einer „Bearbeiten"-Ansicht wären zwei Oberflächen für dieselbe Sache,
 * und der Unterschied interessiert nur die Datenbank.
 */
function PalaceEditor({
  dictionary,
  palace,
  onChange,
  onSaved,
  onDirty,
  onCancel,
}: {
  dictionary: Dictionary
  palace: OwnPalace | undefined
  onChange: () => void
  onSaved: () => void
  onDirty: () => void
  onCancel?: () => void
}) {
  const t = dictionary.palace
  const [name, setName] = useState(palace?.name ?? '')
  const [stations, setStations] = useState<string[]>(() =>
    palace === undefined
      ? Array.from({ length: OWN_MIN_STATIONS }, () => '')
      : [...palace.stations],
  )
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
    setStations(palace === undefined ? Array.from({ length: OWN_MIN_STATIONS }, () => '') : [...palace.stations])
  }

  /*
   * Für die Prüfung braucht der Entwurf eine Kennung. Ein neuer Weg hat noch
   * keine — `own` steht hier stellvertretend, damit dieselbe Prüfung wie beim
   * Speichern greift. Die echte Kennung vergibt `createOwnPalace`, und zwar
   * aus einem Zähler, der nur nach vorn geht.
   */
  const draft: OwnPalace = { id: palace?.id ?? 'own', name, stations }
  const valid = isOwnPalace(draft)
  const touched = name !== '' || stations.some((label) => label !== '')

  const save = () => {
    setFailed(false)
    const done = (ok: boolean) => {
      setFailed(!ok)
      if (ok) onSaved()
    }
    if (palace === undefined) {
      void createOwnPalace(name, stations)
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
        <span>{t.ownName}</span>
        <input
          type="text"
          value={name}
          maxLength={LABEL_MAX}
          placeholder={t.ownNamePlaceholder}
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
        {stations.map((label, index) => (
          <li key={index}>
            <span className="walk-step" aria-hidden="true">
              {index + 1}
            </span>
            <input
              type="text"
              value={label}
              maxLength={LABEL_MAX}
              placeholder={t.ownStationPlaceholder}
              aria-label={`${t.ownStation} ${index + 1}`}
              onChange={(event) => {
                const next = [...stations]
                next[index] = event.target.value
                setStations(next)
                touch()
              }}
            />
          </li>
        ))}
      </ol>

      <div className="note-actions own-station-actions">
        {stations.length < OWN_MAX_STATIONS && (
          <button
            type="button"
            className="quiet"
            onClick={() => {
              setStations([...stations, ''])
              touch()
            }}
          >
            {t.ownAddStation}
          </button>
        )}
        {/*
          Entfernt wird nur von hinten, und nur, was über dem Mindestmaß liegt.
          Der Grund steht in der Datenschicht: Die Nummer einer Station steht
          in der Item-Kennung (`own~7#own3`), an der der Wiederholungsverlauf
          hängt. Von hinten kürzen lässt die vorderen Nummern unberührt; einen
          Ort aus der Mitte zu streichen würde alle dahinter verschieben — und
          damit die Termine an die falschen Orte hängen.
        */}
        {stations.length > OWN_MIN_STATIONS && (
          <button
            type="button"
            className="quiet"
            onClick={() => {
              setStations(stations.slice(0, -1))
              touch()
            }}
          >
            {t.ownRemoveStation}
          </button>
        )}
      </div>

      <div className="note-actions">
        <button type="button" className="quiet" disabled={!valid} onClick={save}>
          {palace === undefined ? t.ownCreate : t.ownSave}
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
              void removeOwnPalace(palace.id)
                .catch(() => undefined)
                .finally(onChange)
            }}
          >
            {t.ownDiscard}
          </button>
        )}
        {palace === undefined && onCancel !== undefined && (
          <button type="button" className="quiet" onClick={onCancel}>
            {t.ownCancel}
          </button>
        )}
      </div>

      {/* Die Regel steht erst da, wenn sie gebraucht wird — nicht als
          Bedienungsanleitung über einem leeren Formular (G-2). */}
      {!valid && touched && <p className="hint">{t.ownRule}</p>}
      {failed && (
        <p className="hint" role="alert">
          {t.ownFailed}
        </p>
      )}
    </section>
  )
}
