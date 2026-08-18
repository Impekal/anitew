import { useState } from 'react'

import { LABEL_MAX, type OwnPalace, STATIONS_PER_WALK, isOwnPalace } from '../core/index.ts'
import { clearOwnPalace, saveOwnPalace } from '../data/palace.ts'
import type { Dictionary } from '../i18n/index.ts'

/**
 * Der eigene Palast (Backlog G3).
 *
 * Fünf Zeilen und ein Name — mehr ist es nicht, und mehr soll es auch nicht
 * sein. Die Arbeit liegt nicht im Ausfüllen, sondern davor: sich einen Weg zu
 * überlegen, den man wirklich kennt. Deshalb steht der Hinweis darüber und
 * nicht als Fußnote darunter.
 *
 * Warum das überhaupt sein muss: Die drei mitgelieferten Wege raten, wie die
 * Wohnung eines Fremden aussieht. Ein Palast, den jemand selbst kennt, trägt
 * deutlich besser — das ist der Punkt der ganzen Technik, und bis hierher war
 * es eine Krücke.
 */
export function PalacePanel({
  dictionary,
  own,
  onChange,
}: {
  dictionary: Dictionary
  own: OwnPalace | undefined
  onChange: () => void
}) {
  const t = dictionary.palace
  const [name, setName] = useState(own?.name ?? '')
  const [stations, setStations] = useState<string[]>(() =>
    Array.from({ length: STATIONS_PER_WALK }, (_, index) => own?.stations[index] ?? ''),
  )
  const [saved, setSaved] = useState(false)

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
  const [loaded, setLoaded] = useState(own)
  if (own !== loaded) {
    setLoaded(own)
    setName(own?.name ?? '')
    setStations(Array.from({ length: STATIONS_PER_WALK }, (_, index) => own?.stations[index] ?? ''))
  }

  const draft: OwnPalace = { name, stations }
  const valid = isOwnPalace(draft)

  return (
    <div className="own-palace">
      <p className="hint">{t.ownIntro}</p>

      <label className="own-field">
        <span>{t.ownName}</span>
        <input
          type="text"
          value={name}
          maxLength={LABEL_MAX}
          placeholder={t.ownNamePlaceholder}
          onChange={(event) => {
            setName(event.target.value)
            setSaved(false)
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
                setSaved(false)
              }}
            />
          </li>
        ))}
      </ol>

      <div className="note-actions">
        <button
          type="button"
          className="quiet"
          disabled={!valid}
          onClick={() => {
            void saveOwnPalace(draft)
              .then((ok) => setSaved(ok))
              .catch(() => undefined)
              .finally(onChange)
          }}
        >
          {t.ownSave}
        </button>
        {own !== undefined && (
          <button
            type="button"
            className="quiet"
            onClick={() => {
              /*
               * Weggeworfen wird nur das Schild, nicht die Geschichte: Die
               * abgelegten Gegenstände bleiben in der Datenbank stehen, und
               * wer den Palast neu anlegt, hat seine Gänge wieder. Ein
               * Wiederholungstermin ohne Schild wird solange übergangen.
               */
              void clearOwnPalace()
                .catch(() => undefined)
                .finally(onChange)
              // Die Felder gehen mit: Ein verworfener Weg, der noch dasteht,
              // sähe aus, als wäre nichts passiert.
              setName('')
              setStations(Array.from({ length: STATIONS_PER_WALK }, () => ''))
              setSaved(false)
            }}
          >
            {t.ownDiscard}
          </button>
        )}
      </div>

      {/* Die Regel steht erst da, wenn sie gebraucht wird — nicht als
          Bedienungsanleitung über einem leeren Formular (G-2). */}
      {!valid && (name !== '' || stations.some((label) => label !== '')) && (
        <p className="hint">{t.ownRule}</p>
      )}
      {saved && <p className="hint">{t.ownSaved}</p>}
    </div>
  )
}
