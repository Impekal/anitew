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
 * - **Es ist klein.** 30 Knoten mit kurzen Verbindungen. Ein dichteres Netz
 *   sähe nach Bildschirmschoner aus, ein weiteres nach Sternbild.
 *
 * Bei „weniger Bewegung“ steht es still — dafür sorgt die Regel am Ende von
 * styles.css, ohne dass hier etwas abgefragt werden muss.
 */

const NODE_COUNT = 30
/**
 * Nur nahe Knoten werden verbunden. Beim ersten Versuch stand hier 27, und
 * das Ergebnis waren wenige große Dreiecke quer über den Text — eine Grafik
 * statt eines Hintergrunds. Kurze Verbindungen ergeben ein Gewebe.
 */
const LINK_DISTANCE = 19

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
      viewBox="0 0 100 100"
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
  const columns = 5
  const rows = Math.ceil(NODE_COUNT / columns)
  for (let index = 0; index < NODE_COUNT; index++) {
    const column = index % columns
    const row = Math.floor(index / columns)
    nodes.push({
      x: (column + 0.5) * (100 / columns) + (rng.next() - 0.5) * 18,
      y: (row + 0.5) * (100 / rows) + (rng.next() - 0.5) * 16,
      r: 0.22 + rng.next() * 0.3,
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
