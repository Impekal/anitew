import '../anitew-memory-edit.css'

import { Suspense, lazy, useCallback, useEffect, useState } from 'react'

import {
  type MemoryGraph,
  type DayKey,
  type Platform,
  createMemoryGraph,
  graphConnectionCount,
  latestNodes,
  memoryClusters,
  memoryForgettingForecasts,
  memoryReviewDays,
  nodesByStrength,
  selectDue,
} from '../core/index.ts'
import { loadDue } from '../data/items.ts'
import { loadMemoryGraph, saveMemoryGraph, MEMORY_VISITED_KEY } from '../data/memoryStore.ts'
import {
  type MemoryRelation,
  disconnectMemoryNodes,
  editMemoryEdge,
  memoryNodeId,
  removeMemoryNode,
  renameMemoryNode,
  setMemoryDetail,
} from '../core/index.ts'
import { editCopyFor } from '../i18n/editCopy.ts'
import { memoryCountCopyFor, memoryForecastCopyFor, type Dictionary } from '../i18n/index.ts'

import { MemoryConstellation } from './MemoryConstellation.tsx'
import { scheduleDriveSync } from './driveSync.ts'
import { memoryDeadlineCopyForCurrentUi } from './memoryDeadline.ts'

/*
 * „Etwas merken“ ist ein tiefer Arbeitsweg innerhalb von „Mein Gedächtnis“.
 * Er braucht Architekt, Coach/BYOK und die Deadline-Eingabe, aber nichts davon
 * gehört in den Kaltstart der App. Deshalb erst laden, wenn die Memory-Seite
 * tatsächlich geöffnet wurde. Das hält P4 ehrlich statt das Budget anzuheben.
 */
const RememberThisPanel = lazy(() =>
  import('./RememberThisPanel.tsx').then((module) => ({ default: module.RememberThisPanel })),
)

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
  const forecastTexts = memoryForecastCopyFor(language)
  const countTexts = memoryCountCopyFor(language)
  const deadlineTexts = memoryDeadlineCopyForCurrentUi()

  const [graph, setGraph] = useState<MemoryGraph>(createMemoryGraph())
  const [selectedId, setSelectedId] = useState<string | undefined>()
  const [newNodeIds, setNewNodeIds] = useState<ReadonlySet<string>>(new Set())
  const [newEdgeIds, setNewEdgeIds] = useState<ReadonlySet<string>>(new Set())
  const [clusterId, setClusterId] = useState<string | undefined>()
  const [dueNodeIds, setDueNodeIds] = useState<ReadonlySet<string>>(new Set())
  const [reviewDayByNode, setReviewDayByNode] = useState<ReadonlyMap<string, DayKey>>(new Map())
  const [forecastByNode, setForecastByNode] = useState<
    ReadonlyMap<string, { days: number; reviews: number }>
  >(new Map())
  const reload = useCallback(() => {
    void loadMemoryGraph()
      .then(setGraph)
      .catch(() => undefined)
  }, [])
  useEffect(() => reload(), [reload])
  useEffect(() => {
    void loadDue(training)
      .then((items) => {
        const reviewDays = memoryReviewDays(items)
        setReviewDayByNode(reviewDays)
        setForecastByNode(memoryForgettingForecasts(items))
        setDueNodeIds(
          new Set(memoryReviewDays(selectDue(items, today, Number.MAX_SAFE_INTEGER)).keys()),
        )
      })
      .catch(() => undefined)
  }, [training, today])
  // Wer hier war, braucht die Entdeckungszeile auf dem Startbildschirm nicht mehr.
  useEffect(() => {
    void platform.settings.write(MEMORY_VISITED_KEY, true).catch(() => undefined)
  }, [platform])

  const e = editCopyFor(document.documentElement.lang)
  const [editing, setEditing] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [draftDetail, setDraftDetail] = useState('')
  const [editFailed, setEditFailed] = useState<string | undefined>(undefined)

  /*
   * Jede Änderung geht denselben Weg: frisch laden, ändern, speichern,
   * anzeigen, abgleichen. Frisch laden, weil zwischen zwei Fingertipps ein
   * stiller Abgleich gelaufen sein kann — der Zustand im Bildschirm wäre dann
   * älter als die Platte, und die Änderung schriebe ihn zurück.
   */
  const schreibe = useCallback(
    (aendern: (graph: MemoryGraph, now: number) => MemoryGraph) =>
      void (async () => {
        const now = platform.clock.now()
        const next = aendern(await loadMemoryGraph(), now)
        await saveMemoryGraph(next)
        setGraph(next)
        scheduleDriveSync(platform)
      })().catch(() => undefined),
    [platform],
  )

  const remove = (nodeId: string) => {
    schreibe((graph, now) => removeMemoryNode(graph, nodeId, now))
  }

  const byNeed = nodesByStrength(graph)
  const clusters = memoryClusters(graph)
  const activeCluster = clusters.find((cluster) => cluster.id === clusterId)
  const worldGraph =
    activeCluster === undefined
      ? graph
      : {
          ...graph,
          nodes: activeCluster.nodes,
          edges: graph.edges.filter(
            (edge) =>
              activeCluster.nodes.some((node) => node.id === edge.from) &&
              activeCluster.nodes.some((node) => node.id === edge.to),
          ),
        }
  const weakest = byNeed.slice(0, 3)
  const strongest = [...byNeed].reverse().slice(0, 3)
  const latest = latestNodes(graph, 3)
  const selected = graph.nodes.find((node) => node.id === selectedId)
  const selectedForecast = selected === undefined ? undefined : forecastByNode.get(selected.id)
  /*
   * Jede Verbindung einzeln, mit ihrer Art — nicht mehr nur die Namen der
   * Gegenüber in einer Zeile.
   *
   * Vorher stand hier „Schlüssel · Tür · Auto". Die **Art** der Verbindung
   * (Verknüpfung, Reihenfolge, Zusammenhang, Gegensatz, eigene) wurde gar
   * nicht angezeigt — man konnte sie also nicht einmal sehen, geschweige denn
   * berichtigen. Gemeldet am 02.09.: „Gilt auch für connections."
   */
  const links =
    selected === undefined
      ? []
      : graph.edges
          .filter((edge) => edge.from === selected.id || edge.to === selected.id)
          .map((edge) => ({
            edge,
            other: graph.nodes.find(
              (node) => node.id === (edge.from === selected.id ? edge.to : edge.from),
            ),
          }))
          .filter(
            (link): link is { edge: (typeof graph.edges)[number]; other: NonNullable<typeof link.other> } =>
              link.other !== undefined,
          )
  const dueSoon = selected !== undefined && dueNodeIds.has(selected.id)
  const reviewDay = selected === undefined ? undefined : reviewDayByNode.get(selected.id)
  const recalledNodeIds = new Set(
    graph.nodes
      .filter(
        (node) =>
          node.lastRecalledAt !== undefined && platform.clock.now() - node.lastRecalledAt < 600_000,
      )
      .map((node) => node.id),
  )
  const connectionCount = graphConnectionCount(graph)
  const graphCountText = `${graph.nodes.length} ${
    graph.nodes.length === 1 ? countTexts.memoryOne : countTexts.memoryMany
  } · ${connectionCount} ${
    connectionCount === 1 ? countTexts.connectionOne : countTexts.connectionMany
  }`

  const nextReviewText = (() => {
    if (selected === undefined) return texts.fsrsScheduled
    if (dueSoon) return texts.dueSoon
    if (
      selected.neededByDay !== undefined &&
      (reviewDay === undefined || reviewDay >= selected.neededByDay)
    ) {
      return deadlineTexts.planBefore
    }
    if (reviewDay === undefined) return texts.fsrsScheduled
    return new Date(`${reviewDay}T12:00:00Z`).toLocaleDateString(language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  })()

  return (
    <div className="memoryzone">
      <p className="hint">{texts.intro}</p>

      {graph.nodes.length === 0 ? (
        <p className="memory-empty">{texts.empty}</p>
      ) : (
        <>
          {clusters.length > 1 && (
            <nav className="memory-clusters" aria-label={texts.clusters}>
              <button type="button" className={clusterId === undefined ? 'memory-cluster-active' : ''} onClick={() => setClusterId(undefined)}>{texts.allClusters}</button>
              {clusters.slice(0, 8).map((cluster) => (
                <button key={cluster.id} type="button" className={clusterId === cluster.id ? 'memory-cluster-active' : ''} onClick={() => setClusterId(cluster.id)}>
                  <span>{cluster.anchor.label}</span><small>{cluster.nodes.length}</small>
                </button>
              ))}
              {clusters.length > 8 && (
                <select
                  className="memory-cluster-select"
                  aria-label={texts.chooseCluster}
                  value={clusterId ?? ''}
                  onChange={(event) => setClusterId(event.target.value || undefined)}
                >
                  <option value="">{texts.chooseCluster}</option>
                  {clusters.map((cluster) => (
                    <option value={cluster.id} key={cluster.id}>
                      {cluster.anchor.label} · {cluster.nodes.length}
                    </option>
                  ))}
                </select>
              )}
            </nav>
          )}
          <MemoryConstellation
            graph={worldGraph}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id)
              if (dueNodeIds.has(id)) platform.sound.play('return')
            }}
            selectLabel={(label) => texts.select.replace('{label}', label)}
            newNodeIds={newNodeIds}
            newEdgeIds={newEdgeIds}
            ariaLabel={texts.constellationLabel}
            recalledNodeIds={recalledNodeIds}
            dueNodeIds={dueNodeIds}
          />
          {selected !== undefined && (
            <section className="memory-detail" aria-live="polite">
              <p className="memory-detail-kicker">{texts.types[selected.type]}</p>
              {editing ? (
                /*
                  Berichtigen statt wegwerfen (Nutzerwunsch 02.09.).

                  Der Name eines Begriffs bildet seine Kennung, und an der
                  hängt der Wiederholungsverlauf. Wer sich vertippt hatte,
                  musste bisher wegwerfen und neu anlegen — und verlor die
                  Wochen dahinter. Ändert sich nur die Schreibweise, bleibt
                  die Kennung ohnehin gleich; sonst zieht alles mit um.
                */
                <form
                  className="memory-edit"
                  onSubmit={(event) => {
                    event.preventDefault()
                    const name = draftName.trim()
                    if (name === '') return
                    const kollision =
                      memoryNodeId(selected.type, name) !== selected.id &&
                      graph.nodes.some((node) => node.id === memoryNodeId(selected.type, name))
                    if (kollision) {
                      setEditFailed(e.taken)
                      return
                    }
                    setEditFailed(undefined)
                    setSelectedId(memoryNodeId(selected.type, name))
                    schreibe((current, now) =>
                      setMemoryDetail(
                        renameMemoryNode(current, selected.id, name, now),
                        memoryNodeId(selected.type, name),
                        draftDetail,
                        now,
                      ),
                    )
                    setEditing(false)
                  }}
                >
                  <label className="own-field">
                    <span>{e.name}</span>
                    <input value={draftName} onChange={(event) => setDraftName(event.target.value)} />
                  </label>
                  <label className="own-field">
                    <span>{e.detail}</span>
                    <input
                      value={draftDetail}
                      onChange={(event) => setDraftDetail(event.target.value)}
                    />
                  </label>
                  {editFailed !== undefined && <p className="hint">{editFailed}</p>}
                  <div className="note-actions">
                    <button type="submit" className="quiet">
                      {e.save}
                    </button>
                    <button
                      type="button"
                      className="quiet"
                      onClick={() => {
                        setEditing(false)
                        setEditFailed(undefined)
                      }}
                    >
                      {e.cancel}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3>{selected.label}</h3>
                  {selected.detail !== undefined && <p>{selected.detail}</p>}
                  <button
                    type="button"
                    className="quiet memory-edit-open"
                    onClick={() => {
                      setDraftName(selected.label)
                      setDraftDetail(selected.detail ?? '')
                      setEditFailed(undefined)
                      setEditing(true)
                    }}
                  >
                    {e.edit}
                  </button>
                </>
              )}
              <dl>
                <div>
                  <dt>{texts.connected}</dt>
                  <dd>
                    {links.length === 0 ? (
                      texts.none
                    ) : (
                      <ul className="memory-links">
                        {links.map(({ edge, other }) => (
                          <li key={edge.id}>
                            <span className="memory-link-name">{other.label}</span>
                            <label className="memory-link-kind">
                              <span className="visually-hidden">{e.relation}</span>
                              <select
                                value={edge.relation}
                                onChange={(event) =>
                                  schreibe((current, now) =>
                                    editMemoryEdge(
                                      current,
                                      edge.id,
                                      event.target.value as MemoryRelation,
                                      now,
                                    ),
                                  )
                                }
                              >
                                {(
                                  ['association', 'sequence', 'context', 'contrast', 'custom'] as const
                                ).map((art) => (
                                  <option key={art} value={art}>
                                    {e.relations[art]}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <button
                              type="button"
                              className="quiet"
                              aria-label={`${e.disconnect}: ${other.label}`}
                              onClick={() =>
                                schreibe((current, now) =>
                                  disconnectMemoryNodes(current, edge.id, now),
                                )
                              }
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
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
                {selected.neededByAt !== undefined && (
                  <div className="memory-deadline-detail">
                    <dt>{deadlineTexts.detailLabel}</dt>
                    <dd>
                      {new Date(selected.neededByAt).toLocaleString(language, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </dd>
                  </div>
                )}
                <div>
                  <dt>{texts.nextReview}</dt>
                  <dd>{nextReviewText}</dd>
                </div>
                {selectedForecast !== undefined && (
                  <div>
                    <dt>{forecastTexts.label}</dt>
                    <dd>
                      {forecastTexts.value.replace('{days}', String(selectedForecast.days))}
                    </dd>
                  </div>
                )}
              </dl>
              <button type="button" className="quiet" onClick={() => setSelectedId(undefined)}>
                {texts.close}
              </button>
            </section>
          )}
          <p className="memory-counts">{graphCountText}</p>

          <div className="memory-lists">
            <section aria-label={texts.weakest}>
              <h2 className="coach-source">{texts.weakest}</h2>
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
              <h2 className="coach-source">{texts.strongest}</h2>
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
              <h2 className="coach-source">{texts.latest}</h2>
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

      <Suspense fallback={null}>
        <RememberThisPanel
          platform={platform}
          dictionary={dictionary}
          onSaved={({ nodeIds, edgeIds }) => {
            setNewNodeIds(new Set(nodeIds))
            setNewEdgeIds(new Set(edgeIds))
            setSelectedId(nodeIds[0])
            reload()
          }}
        />
      </Suspense>
    </div>
  )
}
