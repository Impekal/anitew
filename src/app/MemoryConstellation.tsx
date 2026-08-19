import { useMemo } from 'react'

import type { MemoryGraph } from '../core/index.ts'

/**
 * Die Memory-Constellation (D-036) — echte Daten, kein Dekor.
 *
 * Jeder Punkt ist eine Erinnerung des Menschen, jede Linie eine bestätigte
 * Verbindung. Die Anordnung ist **deterministisch** aus der Reihenfolge
 * des Merkens gerechnet (goldener Winkel um die Mitte): Dieselben
 * Erinnerungen stehen morgen am selben Ort — eine Konstellation, die bei
 * jedem Öffnen anders stünde, wäre keine.
 *
 * Die Stärke einer Erinnerung ist ihre Helligkeit — Übungsstand, keine
 * Gedächtnisaussage (R-1). Namen stehen an den Ankern (Knoten mit
 * ausgehenden Verbindungen); alles andere bleibt Punkt, sonst wird der
 * Himmel eine Tabelle.
 */

const GOLDEN_ANGLE = 137.50776405003785

interface Placed {
  readonly id: string
  readonly label: string
  readonly x: number
  readonly y: number
  readonly strength: number
  readonly anchor: boolean
}

function layout(graph: MemoryGraph): Placed[] {
  const anchors = new Set(graph.edges.map((edge) => edge.from))
  const ordered = [...graph.nodes].sort((a, b) => a.createdAt - b.createdAt)
  return ordered.map((node, index) => {
    const angle = ((index * GOLDEN_ANGLE) % 360) * (Math.PI / 180)
    // Wurzel-Spirale: gleichmäßige Dichte, die Mitte gehört den Ältesten.
    const radius = 8 + 38 * Math.sqrt((index + 0.4) / Math.max(1, ordered.length))
    return {
      id: node.id,
      label: node.label,
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
      strength: node.strength,
      anchor: anchors.has(node.id),
    }
  })
}

export function MemoryConstellation({ graph }: { graph: MemoryGraph }) {
  const placed = useMemo(() => layout(graph), [graph])
  const byId = useMemo(() => new Map(placed.map((node) => [node.id, node])), [placed])

  if (placed.length === 0) return null

  return (
    <div className="constellation" aria-hidden="true">
      <svg viewBox="0 0 100 100" role="presentation">
        {graph.edges.map((edge, index) => {
          const from = byId.get(edge.from)
          const to = byId.get(edge.to)
          if (from === undefined || to === undefined) return null
          return (
            <line
              key={edge.id}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className="constellation-edge"
              style={{ animationDelay: `${(index * 240) % 1800}ms` }}
            />
          )
        })}
        {placed.map((node, index) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.anchor ? 2.1 : 1.3}
              className={
                node.anchor ? 'constellation-node constellation-node-anchor' : 'constellation-node'
              }
              style={{
                animationDelay: `${(index * 130) % 1600}ms`,
                opacity: 0.45 + node.strength * 0.55,
              }}
            />
            {node.anchor && (
              <text x={node.x} y={node.y - 3.4} className="constellation-label" textAnchor="middle">
                {node.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}
