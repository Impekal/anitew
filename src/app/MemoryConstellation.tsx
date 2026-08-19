import { useMemo } from 'react'

export type MemoryConstellationProps = {
  connections?: number
  strength?: number
  active?: boolean
}

const NODES = [
  [50, 18],
  [23, 35],
  [77, 35],
  [15, 67],
  [50, 56],
  [85, 67],
  [32, 86],
  [68, 86],
] as const

const EDGES = [
  [0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5],
  [3, 6], [4, 6], [4, 7], [5, 7], [6, 7],
] as const

export function MemoryConstellation({
  connections = 0,
  strength = 0.55,
  active = true,
}: MemoryConstellationProps) {
  const intensity = Math.max(0.25, Math.min(1, strength))
  const seed = useMemo(() => Math.max(0, connections), [connections])

  return (
    <div className={`constellation ${active ? 'constellation-active' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 100 100" role="presentation">
        <defs>
          <radialGradient id="anitew-core-glow">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".9" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        {EDGES.map(([a, b], index) => (
          <line
            key={`${a}-${b}`}
            x1={NODES[a][0]}
            y1={NODES[a][1]}
            x2={NODES[b][0]}
            y2={NODES[b][1]}
            pathLength="1"
            className="constellation-edge"
            style={{ animationDelay: `${(index * 180) % 1400}ms`, opacity: 0.18 + intensity * 0.42 }}
          />
        ))}
        <circle cx="50" cy="56" r="18" className="constellation-glow" />
        {NODES.map(([x, y], index) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r={index === 4 ? 2.5 : 1.45}
            className={index === 4 ? 'constellation-node constellation-node-core' : 'constellation-node'}
            style={{ animationDelay: `${(index * 110 + seed * 7) % 1200}ms` }}
          />
        ))}
      </svg>
    </div>
  )
}
