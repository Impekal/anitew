import { useCallback, useEffect, useState } from 'react'

import {
  type MemoryGraph,
  type DayKey,
  type Platform,
  createMemoryGraph,
  graphConnectionCount,
  latestNodes,
  memoryNodeIdOfItem,
  nodesByStrength,
  selectDue,
} from '../core/index.ts'
import { loadDue, moduleOf, wordOf } from '../data/items.ts'
import { loadMemoryGraph, saveMemoryGraph, MEMORY_VISITED_KEY } from '../data/memoryStore.ts'
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
  training,
  language,
  today,
}: {
  platform: Platform
  dictionary: Dictionary
  training: string
  language: string
  today: DayKey
}) {
  const texts = dictionary.memory

  const [graph, setGraph] = useState<MemoryGraph>(createMemoryGraph())
  const [selectedId, setSelectedId] = useState<string | undefined>()
  const [newNodeIds, setNewNodeIds] = useState<ReadonlySet<string>>(new Set())
  const [dueNodeIds, setDueNodeIds] = useState<ReadonlySet<string>>(new Set())
  const reload = useCallback(() => {
    void loadMemoryGraph()
      .then(setGraph)
      .catch(() => undefined)
  }, [])
  useEffect(() => reload(), [reload])
  useEffect(() => {
    void loadDue(training)
      .then((items) =>
        setDueNodeIds(
          new Set(
            selectDue(items, today, Number.MAX_SAFE_INTEGER)
              .filter((item) => moduleOf(item.itemId) === 'memory')
              .map((item) => memoryNodeIdOfItem(wordOf(item.itemId)))
              .filter((id): id is string => id !== undefined),
          ),
        ),
      )
      .catch(() => undefined)
  }, [training, today])
  // Wer hier war, braucht die Entdeckungszeile auf dem Startbildschirm nicht mehr.
  useEffect(() => {
    void platform.settings.write(MEMORY_VISITED_KEY, true).catch(() => undefined)
  }, [platform])

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
  const selected = graph.nodes.find((node) => node.id === selectedId)
  const connected =
    selected === undefined
      ? []
      : graph.edges
          .filter((edge) => edge.from === selected.id || edge.to === selected.id)
          .map((edge) =>
            graph.nodes.find((node) =>
              node.id === (edge.from === selected.id ? edge.to : edge.from),
            ),
          )
          .filter((node): node is NonNullable<typeof node> => node !== undefined)
  const dueSoon = selected !== undefined && dueNodeIds.has(selected.id)
  const recalledNodeIds = new Set(
    graph.nodes
      .filter(
        (node) =>
          node.lastRecalledAt !== undefined && platform.clock.now() - node.lastRecalledAt < 600_000,
      )
      .map((node) => node.id),
  )

  return (
    <div className="memoryzone">
      <p className="hint">{texts.intro}</p>

      {graph.nodes.length === 0 ? (
        <p className="memory-empty">{texts.empty}</p>
      ) : (
        <>
          <MemoryConstellation
            graph={graph}
            selectedId={selectedId}
            onSelect={setSelectedId}
            selectLabel={(label) => texts.select.replace('{label}', label)}
            newNodeIds={newNodeIds}
            ariaLabel={texts.constellationLabel}
            recalledNodeIds={recalledNodeIds}
          />
          {selected !== undefined && (
            <section className="memory-detail" aria-live="polite">
              <p className="memory-detail-kicker">{texts.types[selected.type]}</p>
              <h3>{selected.label}</h3>
              {selected.detail !== undefined && <p>{selected.detail}</p>}
              <dl>
                <div>
                  <dt>{texts.connected}</dt>
                  <dd>
                    {connected.length === 0
                      ? texts.none
                      : connected.map((node) => node.label).join(' · ')}
                  </dd>
                </div>
                <div>
                  <dt>{texts.lastRecalled}</dt>
                  <dd>
                    {selected.lastRecalledAt === undefined
                      ? texts.notYet
                      : new Date(selected.lastRecalledAt).toLocaleDateString(language)}
                  </dd>
                </div>
                <div>
                  <dt>{texts.nextReview}</dt>
                  <dd>{dueSoon ? texts.dueSoon : texts.fsrsScheduled}</dd>
                </div>
              </dl>
              <button type="button" className="quiet" onClick={() => setSelectedId(undefined)}>
                {texts.close}
              </button>
            </section>
          )}
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

      <RememberThisPanel
        platform={platform}
        dictionary={dictionary}
        onSaved={(ids) => {
          setNewNodeIds(new Set(ids))
          setSelectedId(ids[0])
          reload()
        }}
      />
    </div>
  )
}
