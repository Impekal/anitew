import { useMemo } from 'react'

import { bandLabel, createRng, memoryClusters, type MemoryGraph, type MemoryNodeType } from '../core/index.ts'

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

/**
 * Das neuronale Netz im Hintergrund (Nutzerwunsch 02.09.).
 *
 * Wörtlich: „Mit Verbindungslinien meinte ich vor allem Design (wie die
 * neuronalen im Hintergrund), abgesehen von den tatsächlichen Verbindungen
 * zwischen den Begriffen."
 *
 * Das ist die Unterscheidung, auf die es hier ankommt — und sie ist im Bild
 * angelegt, nicht nur im Kommentar:
 *
 * - Diese Linien **berühren keinen einzigen Erinnerungspunkt.** Sie liegen
 *   auf einem eigenen Raster, das nur von der Größe der Fläche abhängt und
 *   von keiner Erinnerung. Sie können deshalb gar nicht als Verbindung
 *   zwischen zwei Begriffen missverstanden werden.
 * - Sie sind ein Vielfaches blasser als eine echte Verbindung und liegen
 *   hinter allem, in derselben Gruppe wie die beiden Ringe.
 * - Sie **bewegen sich nicht.** Das Bewegungsbudget der Startseite bleibt bei
 *   22, davon 0 zeichnend. Ein Hintergrund, der blinkt, ist ein Hintergrund,
 *   der stört — und auf einem Telefon ist er Wärme.
 *
 * Die Anordnung kommt aus einem festen Seed (A11, kein `Math.random()`):
 * dasselbe Netz heute wie morgen.
 */
function Netz({ hoehe }: { hoehe: number }) {
  const punkte = useMemo(() => {
    const rng = createRng(`constellation-web:${hoehe}`)
    return Array.from({ length: 16 }, () => ({
      x: 3 + rng.next() * 94,
      y: hoehe * (0.08 + rng.next() * 0.84),
    }))
  }, [hoehe])

  const linien = useMemo(() => {
    const wege: { x1: number; y1: number; x2: number; y2: number }[] = []
    punkte.forEach((eins, i) => {
      // Je Punkt die zwei nächsten Nachbarn — mehr wird ein Gitter, weniger
      // eine Perlenkette.
      const nachbarn = punkte
        .map((zwei, j) => ({ zwei, j, weit: Math.hypot(eins.x - zwei.x, (eins.y - zwei.y) * 2) }))
        .filter((eintrag) => eintrag.j !== i)
        .sort((a, b) => a.weit - b.weit)
        .slice(0, 2)
      for (const { zwei, j } of nachbarn) {
        if (j < i) continue
        wege.push({ x1: eins.x, y1: eins.y, x2: zwei.x, y2: zwei.y })
      }
    })
    return wege
  }, [punkte])

  return (
    /*
      Farbe und Strichstärke stehen an der Gruppe, nicht an jeder Linie: In
      SVG erben Kinder diese Angaben, das sind einmal rund vierzig Zeichen
      statt sechzehnmal. Und sie stehen hier statt im Stylesheet, weil das
      CSS-Budget am 02.09. bei genau 12,0 von 12 KB stand — zwei neue Regeln
      haben es gerissen.

      Die Werte sind bewusst schwächer als eine echte Verbindung
      (`.constellation-edge`) und schwächer als ein Erinnerungspunkt: Das Netz
      soll zu spüren sein, nicht zu lesen.
    */
    <g
      className="constellation-web"
      stroke="rgba(140, 207, 192, .26)"
      strokeWidth="0.22"
      fill="rgba(216, 168, 90, .22)"
    >
      {linien.map((weg) => (
        <line
          key={`${weg.x1},${weg.y1},${weg.x2},${weg.y2}`}
          x1={weg.x1}
          y1={weg.y1}
          x2={weg.x2}
          y2={weg.y2}
        />
      ))}
      {punkte.map((punkt) => (
        <circle
          key={`${punkt.x},${punkt.y}`}
          cx={punkt.x}
          cy={punkt.y}
          r="0.55"
        />
      ))}
    </g>
  )
}

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

/**
 * Luft zwischen dem äußersten Namen und dem Rand des Kastens, in
 * Zeicheneinheiten.
 *
 * Ohne sie lag der erste Name gemessen bei x = 8 Pixeln, während der Kasten
 * bei 12 beginnt — `overflow: hidden` schnitt „Ticket Ba" weg. Eine Rechnung,
 * die auf den Millimeter aufgeht, geht beim ersten breiten Buchstaben nicht
 * mehr auf.
 */
const BAND_LUFT = 2

/*
  Gekürzt wird im Kern (`memory/label.ts`) — hier stand vorher eine eigene,
  ungeputzte Fassung, und die hat am 03.09. auf dem Telefon einen Namen zu
  „.…" zusammenfallen lassen. Der Grund und die Messung stehen dort.
*/

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
   *
   * Mehr als vierundzwanzig Punkte nimmt das Band nicht: Ab da ist der
   * Abstand kleiner als ein Punkt breit ist, und aus der Konstellation wird
   * eine Perlenschnur. Der ganze Bestand steht in „Mein Gedächtnis".
   */
  if (!tappable && clusters.length > 2) {
    /*
     * Die Zeilen gelten für **jedes** Band, nicht nur für den unverbundenen
     * Stand — und das war ein Fund im Bild, kein Vorsatz.
     *
     * Der erste Anlauf griff nur, solange gar nichts verbunden war. Kaum stand
     * **eine** Verbindung, fiel die Anordnung auf den Cluster-Kranz zurück,
     * und mit ihm kamen Überlappung und abgeschnittene Namen sofort wieder.
     * Und Verbindungen entstehen jetzt laufend — das Verbinden von Hand kam
     * im selben Zug dazu. Eine Behebung, die genau so lange hält, bis jemand
     * die neue Funktion benutzt, ist keine.
     *
     * Die Reihenfolge folgt den Clustern: Was zusammengehört, steht
     * nebeneinander, und die echten Verbindungslinien laufen dadurch kurze
     * Wege statt quer über das Band.
     */
    const einzeln = clusters
      .flatMap((cluster) => [...cluster.nodes].sort((a, b) => a.createdAt - b.createdAt))
      .slice(0, 24)
    /*
     * Wie lang darf ein Name sein, damit nichts überschreibt und nichts
     * abgeschnitten wird? Das ist eine Gleichung, keine Schätzung.
     *
     * Bei drei Zeilen stehen zwei Punkte derselben Zeile 3 × Schritt
     * auseinander. Ein Name der Breite w braucht links und rechts vom Rand
     * w/2 Platz, sonst ragt der äußerste aus dem Bild. Also:
     *
     *     Schritt = (100 − w) / (n − 1)     und    3 × Schritt ≥ w
     *     ⟹  300 − 3w ≥ w·(n−1)  ⟹  w ≤ (300 − 6·L) / (n + 2)
     *
     * `L` ist die Luft am Rand. Sie steht hier, weil die erste Fassung ohne
     * sie gemessen abgeschnitten wurde: Der äußerste Name lag bei x = 8
     * Pixeln, der Kasten beginnt bei 12, und `overflow: hidden` nahm den Rest.
     * Die 2,1 Einheiten je Zeichen sind ein Mittelwert — bei breiten
     * Buchstaben reicht er nicht, und dann fehlt ein halbes Wort.
     *
     * Beim ersten Versuch stand hier eine geratene Zahl (14 Zeichen), und
     * gemessen überschrieben sich zwei Namen um 13 Pixel.
     */
    const breite = (300 - 6 * BAND_LUFT) / (einzeln.length + 2)
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
    // Derselbe Rand links wie rechts — die halbe Namensbreite plus Luft.
    const rand = Math.min(26, (maxZeichen * EINHEITEN_JE_ZEICHEN) / 2 + BAND_LUFT)
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
      label: bandLabel(node.label, maxZeichen),
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
          <Netz hoehe={raum.hoehe} />
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
              {/*
                `node.label !== ''` gehört dazu: Bleibt nach dem Putzen nichts
                Lesbares übrig, bekommt der Punkt keinen Namen statt eines
                nackten „…". Ein Rest mit Pünktchen ist keine Auskunft.
              */}
              {node.anchor && node.label !== '' && (
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
