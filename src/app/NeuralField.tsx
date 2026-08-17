import { useMemo } from 'react'

import { createRng } from '../core/index.ts'

/**
 * Das Netz im Hintergrund (D-011/G-8).
 *
 * Knoten und Verbindungen, sehr leise. Es soll eher zu spüren als zu sehen
 * sein — ein Hintergrund, der blinkt, ist ein Hintergrund, der stört (G-1).
 *
 * Drei Dinge, die es billig halten:
 *
 * - **Es wird einmal gerechnet.** Die Anordnung kommt aus einem Seed und
 *   ändert sich nie neu (A11: kein `Math.random()`). Kein Neuzeichnen, kein
 *   Rechnen pro Bild.
 * - **Es bewegt sich in CSS**, nicht in JavaScript. Der Browser macht das auf
 *   der Grafikkarte; der Hauptthread bleibt frei für die Uhr der Einheit.
 * - **Es ist klein.** 50 Knoten. Ein dichteres Netz sähe nach
 *   Bildschirmschoner aus, ein weiteres nach Sternbild.
 *
 * Das Feld ist **hochkant** (100 × 210), nicht quadratisch. Das war der Fehler
 * im ersten Anlauf: Ein quadratisches Feld wird von `slice` auf einem
 * Telefonbildschirm seitlich beschnitten — sichtbar blieb ein Streifen von
 * knapp der halben Breite, und das Netz wirkte deshalb dünn und löchrig,
 * obwohl es das gar nicht war.
 *
 * Bei „weniger Bewegung“ steht es still — dafür sorgt die Regel am Ende von
 * styles.css, ohne dass hier etwas abgefragt werden muss.
 */

/** Das Koordinatenfeld — hochkant, damit auf dem Telefon nichts wegfällt. */
export const FIELD_WIDTH = 100
export const FIELD_HEIGHT = 210

const NODE_COUNT = 50
const COLUMNS = 5

/**
 * Nur nahe Knoten werden verbunden. Zu weit ergibt wenige große Dreiecke quer
 * über den Text — eine Grafik statt eines Hintergrunds. Zu kurz ergibt lose
 * Paare statt eines Gewebes. Bei einem mittleren Abstand von rund 20 Einheiten
 * treffen 30 den Punkt, an dem jeder Knoten drei bis vier Nachbarn hat.
 */
const LINK_DISTANCE = 30

interface Node {
  x: number
  y: number
  r: number
  delay: number
}

export function NeuralField() {
  const { nodes, links } = useMemo(buildField, [])

  return (
    <svg
      className="neural"
      viewBox={`0 0 ${FIELD_WIDTH} ${FIELD_HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g className="neural-links">
        {links.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={nodes[a]!.x}
            y1={nodes[a]!.y}
            x2={nodes[b]!.x}
            y2={nodes[b]!.y}
          />
        ))}
      </g>
      <g className="neural-nodes">
        {nodes.map((node, index) => (
          <circle
            key={index}
            cx={node.x}
            cy={node.y}
            r={node.r}
            style={{ animationDelay: `${node.delay}s` }}
          />
        ))}
      </g>
    </svg>
  )
}

function buildField(): { nodes: Node[]; links: [number, number][] } {
  const rng = createRng('anitew-neural-field')
  const nodes: Node[] = []

  // Gestreut, aber nicht gehäuft: ein grobes Raster mit Zufall darin. Reiner
  // Zufall legt drei Knoten übereinander und lässt daneben ein Loch.
  const rows = Math.ceil(NODE_COUNT / COLUMNS)
  const cellWidth = FIELD_WIDTH / COLUMNS
  const cellHeight = FIELD_HEIGHT / rows
  for (let index = 0; index < NODE_COUNT; index++) {
    const column = index % COLUMNS
    const row = Math.floor(index / COLUMNS)
    nodes.push({
      x: (column + 0.5) * cellWidth + (rng.next() - 0.5) * cellWidth * 0.9,
      y: (row + 0.5) * cellHeight + (rng.next() - 0.5) * cellHeight * 0.8,
      r: 0.85 + rng.next() * 0.7,
      delay: rng.next() * 6,
    })
  }

  const links: [number, number][] = []
  for (let a = 0; a < nodes.length; a++) {
    for (let b = a + 1; b < nodes.length; b++) {
      const dx = nodes[a]!.x - nodes[b]!.x
      const dy = nodes[a]!.y - nodes[b]!.y
      if (Math.hypot(dx, dy) <= LINK_DISTANCE) links.push([a, b])
    }
  }

  return { nodes, links }
}
