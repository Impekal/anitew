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

export const MAX_VISIBLE_MEMORY_NODES = 72

function visibleNodeIds(graph: MemoryGraph, selectedId?: string): Set<string> {
  if (graph.nodes.length <= MAX_VISIBLE_MEMORY_NODES) return new Set(graph.nodes.map((node) => node.id))

  const neighborhood = new Set<string>(selectedId === undefined ? [] : [selectedId])
  if (selectedId !== undefined) {
    for (const edge of graph.edges) {
      if (edge.from === selectedId) neighborhood.add(edge.to)
      if (edge.to === selectedId) neighborhood.add(edge.from)
    }
  }
  const degree = new Map<string, number>()
  for (const edge of graph.edges) {
    degree.set(edge.from, (degree.get(edge.from) ?? 0) + 1)
    degree.set(edge.to, (degree.get(edge.to) ?? 0) + 1)
  }
  const ranked = [...graph.nodes].sort(
    (a, b) =>
      Number(neighborhood.has(b.id)) - Number(neighborhood.has(a.id)) ||
      (degree.get(b.id) ?? 0) - (degree.get(a.id) ?? 0) ||
      b.createdAt - a.createdAt,
  )
  return new Set(ranked.slice(0, MAX_VISIBLE_MEMORY_NODES).map((node) => node.id))
}

function layout(graph: MemoryGraph, selectedId?: string): Placed[] {
  const anchors = new Set(graph.edges.map((edge) => edge.from))
  const visible = visibleNodeIds(graph, selectedId)
  const ordered = graph.nodes.filter((node) => visible.has(node.id)).sort((a, b) => a.createdAt - b.createdAt)
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

export function MemoryConstellation({
  graph,
  selectedId,
  onSelect,
  selectLabel,
  newNodeIds = new Set(),
  ariaLabel,
  recalledNodeIds = new Set(),
}: {
  graph: MemoryGraph
  selectedId?: string
  onSelect?: (id: string) => void
  selectLabel?: (label: string) => string
  newNodeIds?: ReadonlySet<string>
  ariaLabel?: string
  recalledNodeIds?: ReadonlySet<string>
}) {
  const placed = useMemo(() => layout(graph, selectedId), [graph, selectedId])
  const byId = useMemo(() => new Map(placed.map((node) => [node.id, node])), [placed])

  if (placed.length === 0) return null

  return (
    <div className="constellation">
      <svg
        viewBox="0 0 100 100"
        aria-hidden={onSelect === undefined ? true : undefined}
        aria-label={onSelect === undefined ? undefined : ariaLabel}
      >
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
              className={newNodeIds.has(edge.from) || newNodeIds.has(edge.to) ? 'constellation-edge constellation-edge-new' : 'constellation-edge'}
              style={{ animationDelay: `${(index * 240) % 1800}ms` }}
            />
          )
        })}
        {placed.map((node, index) => (
          <g
            key={node.id}
            className={`${node.id === selectedId ? 'constellation-memory constellation-memory-selected' : 'constellation-memory'}${newNodeIds.has(node.id) ? ' constellation-memory-new' : ''}${recalledNodeIds.has(node.id) ? ' constellation-memory-recalled' : ''}`}
            role={onSelect === undefined ? undefined : 'button'}
            tabIndex={onSelect === undefined ? undefined : 0}
            aria-label={selectLabel?.(node.label) ?? node.label}
            onClick={() => onSelect?.(node.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onSelect?.(node.id)
              }
            }}
          >
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
      {graph.nodes.length > placed.length && (
        <span className="constellation-window" aria-live="polite">
          {placed.length} / {graph.nodes.length}
        </span>
      )}
    </div>
  )
}
