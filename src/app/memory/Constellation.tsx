import { useMemo } from 'react'
import type { MemoryNode } from '../../core/memory/MemoryTypes.ts'
import { buildMemoryGraph } from '../../core/memory/MemoryGraphBuilder.ts'

type Props = { nodes: MemoryNode[] }

export function Constellation({ nodes }: Props) {
  const graph = useMemo(() => buildMemoryGraph(nodes), [nodes])
  if (!nodes.length) return <div className="constellation-empty">Your constellation appears as you build memories.</div>

  return <div className="memory-constellation" aria-label={`${nodes.length} memories and ${graph.connections.length} connections`}>
    <div className="constellation-links" aria-hidden="true">{graph.connections.map((connection) => <i key={connection.id} />)}</div>
    {nodes.slice(0, 24).map((node, index) => <div key={node.id} className={`memory-star memory-star-${index % 8}`} title={node.title}><span>{node.title.slice(0, 1).toUpperCase()}</span><small>{node.kind}</small></div>)}
  </div>
}
