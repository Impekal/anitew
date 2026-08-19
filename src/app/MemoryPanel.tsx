import { useCallback, useEffect, useState } from 'react'

import {
  type MemoryGraph,
  type Platform,
  createMemoryGraph,
  graphConnectionCount,
  latestNodes,
  nodesByStrength,
} from '../core/index.ts'
import { loadMemoryGraph, saveMemoryGraph } from '../data/memoryStore.ts'
import { removeMemoryNode } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'

import { MemoryConstellation } from './MemoryConstellation.tsx'
import { scheduleDriveSync } from './driveSync.ts'
import { RememberThisPanel } from './RememberThisPanel.tsx'

/**
 * Der Memory-Bereich (D-036).
 *
 * Die Constellation ist hier kein Dekor: Sie zeichnet die echten Knoten
 * und Kanten des Menschen. Darunter die Zahlen (Erinnerungen,
 * Verbindungen), die festesten, die zuwendungsbedürftigsten und die
 * jüngsten Erinnerungen — und der Einstieg „Etwas merken“. Die Stärke
 * wird als Übungsstand benannt, nie als Gedächtnisaussage (R-1).
 */
export function MemoryPanel({
  platform,
  dictionary,
}: {
  platform: Platform
  dictionary: Dictionary
}) {
  const texts = dictionary.memory

  const [graph, setGraph] = useState<MemoryGraph>(createMemoryGraph())
  const reload = useCallback(() => {
    void loadMemoryGraph()
      .then(setGraph)
      .catch(() => undefined)
  }, [])
  useEffect(() => reload(), [reload])

  const remove = (nodeId: string) => {
    void (async () => {
      const next = removeMemoryNode(await loadMemoryGraph(), nodeId, platform.clock.now())
      await saveMemoryGraph(next)
      setGraph(next)
      scheduleDriveSync(platform)
    })().catch(() => undefined)
  }

  const byNeed = nodesByStrength(graph)
  const weakest = byNeed.slice(0, 3)
  const strongest = [...byNeed].reverse().slice(0, 3)
  const latest = latestNodes(graph, 3)

  return (
    <div className="memoryzone">
      <p className="hint">{texts.intro}</p>

      {graph.nodes.length === 0 ? (
        <p className="memory-empty">{texts.empty}</p>
      ) : (
        <>
          <MemoryConstellation graph={graph} />
          <p className="memory-counts">
            {texts.counts
              .replace('{nodes}', String(graph.nodes.length))
              .replace('{edges}', String(graphConnectionCount(graph)))}
          </p>

          <div className="memory-lists">
            <section aria-label={texts.weakest}>
              <h3 className="coach-source">{texts.weakest}</h3>
              <ul className="memory-list">
                {weakest.map((node) => (
                  <li key={node.id}>
                    <span className="memory-label">{node.label}</span>
                    <span
                      className="memory-strength"
                      aria-hidden="true"
                      style={{ width: `${Math.round(8 + node.strength * 92)}%` }}
                    />
                    <button
                      type="button"
                      className="quiet memory-remove"
                      onClick={() => remove(node.id)}
                    >
                      {texts.remove}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
            <section aria-label={texts.strongest}>
              <h3 className="coach-source">{texts.strongest}</h3>
              <ul className="memory-list">
                {strongest.map((node) => (
                  <li key={node.id}>
                    <span className="memory-label">{node.label}</span>
                    <span
                      className="memory-strength"
                      aria-hidden="true"
                      style={{ width: `${Math.round(8 + node.strength * 92)}%` }}
                    />
                  </li>
                ))}
              </ul>
            </section>
            <section aria-label={texts.latest}>
              <h3 className="coach-source">{texts.latest}</h3>
              <ul className="memory-list">
                {latest.map((node) => (
                  <li key={node.id}>
                    <span className="memory-label">{node.label}</span>
                    <small className="memory-type">{texts.types[node.type]}</small>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <p className="hint">{texts.strengthNote}</p>
          <p className="hint">{texts.trainNote}</p>
        </>
      )}

      <RememberThisPanel platform={platform} dictionary={dictionary} onSaved={reload} />
    </div>
  )
}
