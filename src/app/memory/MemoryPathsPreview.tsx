import { useMemo } from 'react'
import type { MemoryNode } from '../../core/memory/MemoryTypes.ts'
import { buildRetrievalPaths } from '../../core/memory/RetrievalPaths.ts'
import { chooseEncodingStrategy } from '../../core/memory/EncodingEngine.ts'

type Props = { node: MemoryNode; peers?: MemoryNode[] }

export function MemoryPathsPreview({ node, peers = [] }: Props) {
  const paths = useMemo(() => buildRetrievalPaths(node, peers), [node, peers])
  const encoding = useMemo(() => chooseEncodingStrategy(node), [node])
  return <section className="memory-architecture-preview">
    <div className="progress-card"><strong>Encoding: {encoding.strategy}</strong><span>{encoding.instruction}</span></div>
    <div className="retrieval-path-list">{paths.map((path) => <article key={path.id}><small>{path.kind.replaceAll('-', ' ')}</small><strong>{path.question}</strong><span>Difficulty {Math.round(path.difficulty * 100)}%</span></article>)}</div>
  </section>
}
