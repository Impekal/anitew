import { useMemo } from 'react'

import { type GazeColor, type GazeObject, gazeSpec } from '../core/index.ts'

/**
 * Die Zeichnung eines Bildes (Achse „Visuell“).
 *
 * Selbst gezeichnet wie die Gesichter und die Menüzeichen (D-005): eine
 * Strichstärke, keine Fremddateien, nichts nachgeladen. Der Kern liefert
 * die Beschreibung (`gazeSpec`), hier wird sie Fläche — vier Dinge in einem
 * Zwei-mal-zwei-Raster, jedes in seiner Farbe.
 *
 * Die Farben sind kräftiger als die Palette der App — mit Absicht: Sie sind
 * hier **Inhalt**, nicht Gestaltung. Wer sich „der Schirm war rot“ merken
 * soll, braucht ein Rot, das keiner Deutung bedarf; ein gedecktes
 * Terrakotta wäre Stilpflege auf Kosten der Aufgabe.
 */

const COLOR_VALUES: Readonly<Record<GazeColor, string>> = {
  red: '#c0392b',
  blue: '#2563a8',
  green: '#2e7d43',
  yellow: '#d9a514',
  purple: '#7d4fa8',
  orange: '#d9721e',
}

/**
 * Jedes Ding in einem 48×48-Kasten, als ein Pfad. Erkennbarkeit schlägt
 * Schönheit: Ein Kind soll das Ding benennen können, ohne zu raten.
 */
const OBJECT_PATHS: Readonly<Record<GazeObject, string>> = {
  umbrella:
    'M24 6c9 0 16 6 17 14H7C8 12 15 6 24 6zM24 6v-2M24 20v18a4 4 0 0 1-8 0',
  sun: 'M24 16a8 8 0 1 1 0 16 8 8 0 0 1 0-16zM24 4v5M24 39v5M4 24h5M39 24h5M10 10l3.5 3.5M34.5 34.5 38 38M38 10l-3.5 3.5M13.5 34.5 10 38',
  boat: 'M8 30h32l-6 9H14zM24 30V8M24 8l12 16H24M12 26l12-4',
  kite: 'M24 4 38 20 24 34 10 20zM10 20h28M24 4v30M24 34c-2 4-6 5-8 9M16 43c3-1 5 0 6-3',
  fish: 'M6 24c6-8 14-11 22-8 4 2 7 5 8 8-1 3-4 6-8 8-8 3-16 0-22-8zM36 24l8-8v16zM14 21a1.5 1.5 0 1 0 .1 0',
  bird: 'M12 28c0-8 6-13 13-13 3 0 6 1 8 4l8 2-8 4c-1 7-6 11-13 11-3 0-6-1-8-3l6-5h-6zM30 18a1.2 1.2 0 1 0 .1 0M22 36v6M22 42l-4 3M22 42l4 3',
  tree: 'M24 3l9 12h-5l8 11h-6l7 11H11l7-11h-6l8-11h-5zM24 37v7M17 44h14',
  moon: 'M30 6a18 18 0 1 0 8 30A16 16 0 0 1 30 6z',
  key: 'M11 17a7 7 0 1 1 7 14 7 7 0 0 1-7-14zM14.5 22a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0zM24 24h19M43 24v7M36 24v5',
  bell: 'M24 6c7 0 11 5 11 12v8l4 6H9l4-6v-8C13 11 17 6 24 6zM24 6V4M20 36a4 4 0 0 0 8 0',
}

/** Ein einzelnes Ding — auch die Frage benutzt es, dort in Tintenfarbe. */
export function GazeGlyph({
  object,
  color,
  size = 96,
}: {
  object: GazeObject
  /** Ohne Farbe: Tinte. Die Frage darf die Antwort nicht tragen. */
  color?: GazeColor
  size?: number
}) {
  return (
    <svg
      className="gaze-glyph"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke={color === undefined ? 'currentColor' : COLOR_VALUES[color]}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      /*
        Die Schlüssel stehen als Daten am Element — die Prüfungen lesen ab,
        was gezeigt wurde, statt die Zeichnung zu deuten. Beim Abruf (ohne
        Farbe) steht hier auch keine.
      */
      data-object={object}
      {...(color === undefined ? {} : { 'data-color': color })}
    >
      <path d={OBJECT_PATHS[object]} />
    </svg>
  )
}

/**
 * Das ganze Bild: vier Dinge im Raster.
 *
 * Zwei Gesichter: Beim **Einprägen** trägt jedes Ding seine Farbe. Beim
 * **Abruf** steht dasselbe Bild in Tinte da — es ist der Anker, der sagt,
 * *welches* Bild gemeint ist (zwei gelernte Bilder können dasselbe Ding
 * tragen), und das gefragte Ding ist hervorgehoben, ohne seine Farbe zu
 * verraten.
 */
export function GazeScene({
  sceneId,
  ask,
}: {
  sceneId: string
  /** Abruf-Gesicht: alles in Tinte, dieses Ding hervorgehoben. */
  ask?: GazeObject
}) {
  const spec = useMemo(() => gazeSpec(sceneId), [sceneId])
  return (
    <div
      className={ask === undefined ? 'gaze-scene' : 'gaze-scene gaze-neutral'}
      role="img"
      aria-hidden="true"
    >
      {spec.map((detail) => (
        <span
          key={detail.object}
          className={detail.object === ask ? 'gaze-cell gaze-asked' : 'gaze-cell'}
        >
          <GazeGlyph
            object={detail.object}
            {...(ask === undefined ? { color: detail.color } : {})}
            size={ask === undefined ? 96 : 72}
          />
        </span>
      ))}
    </div>
  )
}
