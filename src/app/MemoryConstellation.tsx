import { useMemo } from 'react'

import { memoryClusters, type MemoryGraph, type MemoryNodeType } from '../core/index.ts'

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
  readonly type: MemoryNodeType
  readonly degree: number
  readonly activityAt: number
}

export const MAX_VISIBLE_MEMORY_NODES = 72

/**
 * Wie breit ein Zeichen im Band ungefähr ist, in Zeicheneinheiten.
 *
 * Am Telefon gemessen (02.09.): ein Name aus 14 Zeichen war 114 Pixel breit,
 * das Band 388 Pixel für 100 Einheiten. Macht 2,1 Einheiten je Zeichen. Damit
 * lässt sich vorher ausrechnen, wie lang ein Name werden darf — statt es zu
 * raten und hinterher zu sehen, dass zwei sich überschreiben.
 */
const EINHEITEN_JE_ZEICHEN = 2.1

function kurz(label: string, maxZeichen: number): string {
  return label.length <= maxZeichen ? label : `${label.slice(0, maxZeichen - 1).trimEnd()}…`
}

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

/**
 * Die Zeichenfläche ist ein **Band**, kein Quadrat (Gerätebefund 02.09.).
 *
 * Gemessen wurde: „Ton système de mémoire (mit den Begriffen) ist ziemlich
 * klein, kaum leserlich." Die Ursache war nicht die Schrift, sondern die
 * Geometrie. Die Karte ist 404 × 177 Pixel breit, die Koordinaten waren
 * 100 × 100 — quadratisch. Ein SVG passt seinen Inhalt standardmäßig
 * vollständig ein, hier also auf die **Höhe**: Maßstab 1,765, und 234 der
 * 404 Pixel blieben links und rechts leer. Über die halbe Breite verschenkt,
 * und alles darin auf 1,765 geschrumpft.
 *
 * Trägt die Zeichenfläche dasselbe Seitenverhältnis wie die Karte, entfällt
 * das Einpassen: Der Maßstab steigt auf 3,88, dieselbe Schrift wird von 3,9
 * auf 12,4 Pixel groß, und die Punkte bekommen die ganze Breite. Ohne eine
 * einzige zusätzliche Bewegung — es ist dieselbe Zeichnung, nur nicht mehr
 * in einen Streifen in der Mitte gesperrt.
 */
const BAND_HOEHE = 44

/**
 * Das Band gilt nur für die **schmückende** Konstellation der Startseite.
 *
 * Auf der Gedächtnis-Seite ist jeder Punkt ein Knopf mit einer Trefferfläche
 * von zehn mal zehn Einheiten. Drückt man die Anordnung dort flach, rücken
 * die Punkte senkrecht zusammen und ihre Trefferflächen überlappen — dann
 * fängt der Nachbar die Berührung ab, die einem anderen galt. Ein Test hat
 * genau das gefangen: „Madrid" schluckte den Tipp auf „Gitarre". Am Gerät
 * hieße das, die falsche Erinnerung zu öffnen.
 *
 * Die Fläche dort ist ohnehin nicht 16:7 — das Seitenverhältnis der Karte
 * gilt nur unter `.today`. Beide Formen sind also richtig, jede an ihrem Ort.
 */
function feld(tappable: boolean): { hoehe: number; mitte: number; flach: number } {
  return tappable
    ? { hoehe: 100, mitte: 50, flach: 1 }
    : { hoehe: BAND_HOEHE, mitte: BAND_HOEHE / 2, flach: BAND_HOEHE / 100 }
}

function layout(graph: MemoryGraph, tappable: boolean, selectedId?: string): Placed[] {
  const { mitte: BAND_MID, flach: FLACH } = feld(tappable)
  const anchors = new Set(graph.edges.map((edge) => edge.from))
  const degree = new Map<string, number>()
  for (const edge of graph.edges) {
    degree.set(edge.from, (degree.get(edge.from) ?? 0) + 1)
    degree.set(edge.to, (degree.get(edge.to) ?? 0) + 1)
  }
  const visible = visibleNodeIds(graph, selectedId)
  const clusters = memoryClusters({
    ...graph,
    nodes: graph.nodes.filter((node) => visible.has(node.id)),
    edges: graph.edges.filter((edge) => visible.has(edge.from) && visible.has(edge.to)),
  })
  /*
   * Wenn **nichts** verbunden ist, ist jede Erinnerung ihr eigener Cluster.
   * Der Kranz aus Clustern drängt sie dann in die Mitte, jede von ihnen ist
   * Anker, jede trägt ihren Namen — und die Namen überschreiben einander
   * (gemeldet 02.09. mit Bild: „Alassane anrufen" lag auf „Daniel Morrat").
   *
   * Für diesen Fall ist die ruhige Welle die ehrlichere Anordnung: gleicher
   * Abstand über die ganze Breite, abwechselnd höher und tiefer. Immer noch
   * deterministisch aus der Reihenfolge des Merkens — dieselben Erinnerungen
   * stehen morgen am selben Ort.
   *
   * Nur für das schmückende Band. Auf der Gedächtnis-Seite ist jeder Punkt
   * ein Knopf mit Trefferfläche; dort bleibt der Kranz.
   */
  const alleEinzeln = !tappable && clusters.length > 2 && clusters.every((c) => c.nodes.length === 1)
  if (alleEinzeln) {
    const einzeln = clusters
      .map((cluster) => cluster.anchor)
      .sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id))
    /*
     * Wie lang darf ein Name sein, damit nichts überschreibt und nichts
     * abgeschnitten wird? Das ist eine Gleichung, keine Schätzung.
     *
     * Bei drei Zeilen stehen zwei Punkte derselben Zeile 3 × Schritt
     * auseinander. Ein Name der Breite w braucht links und rechts vom Rand
     * w/2 Platz, sonst ragt der äußerste aus dem Bild. Also:
     *
     *     Schritt = (100 − w) / (n − 1)     und    3 × Schritt ≥ w
     *     ⟹  300 − 3w ≥ w·(n−1)  ⟹  w ≤ 300 / (n + 2)
     *
     * Beim ersten Versuch stand hier eine geratene Zahl (14 Zeichen), und
     * gemessen überschrieben sich zwei Namen um 13 Pixel.
     */
    const breite = 300 / (einzeln.length + 2)
    const nurJedeZweite = Math.floor(breite / EINHEITEN_JE_ZEICHEN) < 8
    const maxZeichen = Math.min(
      18,
      Math.max(
        6,
        Math.floor(
          (nurJedeZweite ? 300 / (Math.ceil(einzeln.length / 2) + 2) : breite) /
            EINHEITEN_JE_ZEICHEN,
        ),
      ),
    )
    // Derselbe Rand links wie rechts — die halbe Namensbreite.
    const rand = Math.min(24, (maxZeichen * EINHEITEN_JE_ZEICHEN) / 2)
    const schritt = einzeln.length === 1 ? 0 : (100 - 2 * rand) / (einzeln.length - 1)
    /*
     * **Drei** Zeilen, reihum — und daraus folgt alles Weitere.
     *
     * Zwei Zeilen waren zu wenig: Gemessen lagen „Ticket Bayreu…" und
     * „Alassane anru…" mit sechs Pixeln übereinander, und der erste Name ragte
     * 13 Pixel links aus dem Bild. Der Grund ist Arithmetik: Zwei Punkte
     * derselben Zeile stehen 2 × Schritt auseinander, ein gekürzter Name ist
     * aber breiter als das.
     *
     * Drei Zeilen verdreifachen den Abstand innerhalb einer Zeile, ohne dass
     * der Punkt seinen Platz wechselt. Und weil der Abstand jetzt bekannt ist,
     * richtet sich die Namenslänge danach statt nach einer geratenen Zahl:
     * 2,1 Einheiten je Zeichen sind am Telefon gemessen.
     */
    return einzeln.map((node, index) => ({
      id: node.id,
      // Das Band ist `aria-hidden`; der ganze Name steht in „Mein Gedächtnis".
      label: kurz(node.label, maxZeichen),
      x: einzeln.length === 1 ? 50 : rand + index * schritt,
      y: BAND_MID + ((index % 3) - 1) * FLACH * 20,
      strength: node.strength,
      /*
       * Wird es zu eng für jeden Namen, trägt nur jeder zweite Punkt einen —
       * die übrigen bleiben stille Punkte. Ein Himmel mit ein paar benannten
       * Sternen ist eine Konstellation; einer, in dem jeder Punkt beschriftet
       * ist, ist eine Tabelle.
       */
      anchor: !nurJedeZweite || index % 2 === 0,
      type: node.type,
      degree: 0,
      activityAt: node.lastRecalledAt ?? node.createdAt,
    }))
  }

  return clusters.flatMap((cluster, clusterIndex) => {
    const clusterAngle = ((clusterIndex * GOLDEN_ANGLE) % 360) * (Math.PI / 180)
    const clusterRadius = clusters.length === 1 ? 0 : 27 * Math.sqrt((clusterIndex + 1) / clusters.length)
    const centerX = 50 + clusterRadius * Math.cos(clusterAngle)
    const centerY = BAND_MID + FLACH * clusterRadius * Math.sin(clusterAngle)
    const ordered = [...cluster.nodes].sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id))
    return ordered.map((node, index) => {
      const angle = ((index * GOLDEN_ANGLE) % 360) * (Math.PI / 180)
      const radius = index === 0 ? 0 : Math.min(17, 5 + 3.2 * Math.sqrt(index))
      return {
        id: node.id,
        label: node.label,
        x: centerX + radius * Math.cos(angle),
        y: centerY + FLACH * radius * Math.sin(angle),
        strength: node.strength,
        anchor: anchors.has(node.id) || node.id === cluster.anchor.id,
        type: node.type,
        degree: degree.get(node.id) ?? 0,
        activityAt: node.lastRecalledAt ?? node.createdAt,
      }
    })
  })
}

export function MemoryConstellation({
  graph,
  selectedId,
  onSelect,
  selectLabel,
  newNodeIds = new Set(),
  newEdgeIds = new Set(),
  ariaLabel,
  recalledNodeIds = new Set(),
  dueNodeIds = new Set(),
}: {
  graph: MemoryGraph
  selectedId?: string
  onSelect?: (id: string) => void
  selectLabel?: (label: string) => string
  newNodeIds?: ReadonlySet<string>
  newEdgeIds?: ReadonlySet<string>
  ariaLabel?: string
  recalledNodeIds?: ReadonlySet<string>
  /** Heute wirklich über FSRS fällige persönliche Knoten — kein zweiter Terminplan. */
  dueNodeIds?: ReadonlySet<string>
}) {
  const tappable = onSelect !== undefined
  const raum = feld(tappable)
  const placed = useMemo(() => layout(graph, tappable, selectedId), [graph, tappable, selectedId])
  const byId = useMemo(() => new Map(placed.map((node) => [node.id, node])), [placed])
  const activity = placed.map((node) => node.activityAt)
  const oldestActivity = Math.min(...activity)
  const newestActivity = Math.max(...activity)
  const hasReturn = placed.some((node) => dueNodeIds.has(node.id))
  const hasRecall = placed.some((node) => recalledNodeIds.has(node.id))

  if (placed.length === 0) return null

  return (
    <div
      className={`constellation${onSelect === undefined ? '' : ' constellation-tappable'}${hasReturn ? ' constellation-has-return' : ''}${hasRecall ? ' constellation-has-recall' : ''}`}
      data-world-state={hasRecall ? 'retrieve' : hasReturn ? 'return' : 'quiet'}
    >
      <svg
        viewBox={`0 0 100 ${raum.hoehe}`}
        aria-hidden={onSelect === undefined ? true : undefined}
        aria-label={onSelect === undefined ? undefined : ariaLabel}
      >
        <g className="constellation-atmosphere" aria-hidden="true">
          <ellipse cx="50" cy={raum.mitte} rx="46" ry={46 * raum.flach} className="constellation-orbit constellation-orbit-outer" />
          <ellipse cx="50" cy={raum.mitte} rx="33" ry={33 * raum.flach} className="constellation-orbit constellation-orbit-inner" />
        </g>
        {graph.edges.map((edge, index) => {
          const from = byId.get(edge.from)
          const to = byId.get(edge.to)
          if (from === undefined || to === undefined) return null
          const selectedPath = selectedId !== undefined && (edge.from === selectedId || edge.to === selectedId)
          const returnPath = dueNodeIds.has(edge.from) || dueNodeIds.has(edge.to)
          const recallPath = recalledNodeIds.has(edge.from) || recalledNodeIds.has(edge.to)
          const fresh = newEdgeIds.has(edge.id) || newNodeIds.has(edge.from) || newNodeIds.has(edge.to)
          return (
            <line
              key={edge.id}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className={`constellation-edge${fresh ? ' constellation-edge-new' : ''}${selectedPath ? ' constellation-edge-selected' : ''}${returnPath ? ' constellation-edge-return' : ''}${recallPath ? ' constellation-edge-recalled' : ''}`}
              style={{ animationDelay: `${(index * 240) % 1800}ms` }}
            />
          )
        })}
        {placed.map((node, index) => {
          const isDue = dueNodeIds.has(node.id)
          const isRecalled = recalledNodeIds.has(node.id)
          return (
            <g
              key={node.id}
              className={`${node.id === selectedId ? 'constellation-memory constellation-memory-selected' : 'constellation-memory'}${newNodeIds.has(node.id) ? ' constellation-memory-new' : ''}${isRecalled ? ' constellation-memory-recalled' : ''}${isDue ? ' constellation-memory-due' : ''}`}
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
              {onSelect !== undefined && (
                <rect
                  x={node.x - 5}
                  y={node.y - 5}
                  width="10"
                  height="10"
                  rx="5"
                  className="constellation-hit"
                  aria-hidden="true"
                />
              )}
              {isDue && (
                <>
                  <circle cx={node.x} cy={node.y} r="4.3" className="constellation-return-ring constellation-return-ring-a" aria-hidden="true" />
                  <circle cx={node.x} cy={node.y} r="6.2" className="constellation-return-ring constellation-return-ring-b" aria-hidden="true" />
                </>
              )}
              {isRecalled && (
                <circle cx={node.x} cy={node.y} r="5.2" className="constellation-recall-wave" aria-hidden="true" />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={(node.anchor ? 2.1 : 1.25) + Math.min(1.2, node.degree * 0.18)}
                className={`${node.anchor ? 'constellation-node constellation-node-anchor' : 'constellation-node'} constellation-node-${node.type}`}
                style={{
                  animationDelay: `${(index * 130) % 1600}ms`,
                  opacity:
                    0.25 +
                    node.strength * 0.5 +
                    (newestActivity === oldestActivity
                      ? 0.25
                      : ((node.activityAt - oldestActivity) / (newestActivity - oldestActivity)) * 0.25),
                }}
              />
              {node.anchor && (
                /*
                 * Im Band wechseln die Namen zeilenweise die Seite und werden
                 * bei Bedarf gekürzt. Beides aus demselben Grund: Ein Name
                 * wie „Fils Le grand Senegal" ist bei dieser Schriftgröße
                 * über ein Drittel der Breite lang — zwei davon nebeneinander
                 * passen nicht, und übereinander gedruckt sind beide
                 * unlesbar. Der ganze Name steht in „Mein Gedächtnis", einen
                 * Fingertipp entfernt.
                 */
                <text
                  x={node.x}
                  y={node.y - 2.4}
                  className="constellation-label"
                  textAnchor="middle"
                >
                  {node.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>
      {graph.nodes.length > placed.length && (
        <span className="constellation-window" aria-live="polite">
          {placed.length} / {graph.nodes.length}
        </span>
      )}
    </div>
  )
}
