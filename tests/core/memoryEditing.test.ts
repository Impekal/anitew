/**
 * Eigenes ändern, ohne es wegzuwerfen (Nutzerwunsch 02.09.).
 *
 * Wörtlich:
 *
 *   „Man kann den Begriff löschen — aber vielleicht hat man ihn auch nur
 *    falsch geschrieben und möchte das korrigieren. Gilt auch für
 *    connections."
 *
 * Gemessen, bevor etwas geändert wurde: Es gab **keine** Bearbeitung. Weder
 * für einen Knoten noch für eine Verbindung — und eine einzelne Verbindung
 * ließ sich nicht einmal entfernen. Wer sich vertippt hatte, musste den
 * Knoten wegwerfen und neu anlegen; die Kennung eines Knotens kommt aus
 * seinem Namen (`memoryNodeId`), und an ihr hängt der Wiederholungsverlauf.
 * Ein Tippfehler kostete also die Wochen dahinter.
 *
 * ── Der geschenkte Fall ───────────────────────────────────────────────────
 *
 * `memoryNodeId` schreibt klein und ersetzt Leerzeichen. „daniel" → „Daniel"
 * ergibt dieselbe Kennung: Da ändert sich nur die Anzeige, und **nichts**
 * muss umziehen. Nur wenn sich wirklich Buchstaben ändern, wird es ein Umzug.
 */

import { describe, expect, it } from 'vitest'

import { editOwnFactList } from '../../src/core/content/own.ts'
import {
  addMemoryNode,
  connectMemoryNodes,
  createMemoryGraph,
  disconnectMemoryNodes,
  editMemoryEdge,
  memoryNodeId,
  mergeMemoryGraph,
  renameMemoryNode,
  setMemoryDetail,
} from '../../src/core/memory/memoryGraph.ts'

const T0 = 1_700_000_000_000
const TAG = 86_400_000

function graphMitZwei() {
  let graph = createMemoryGraph()
  graph = addMemoryNode(
    graph,
    { id: memoryNodeId('person', 'Danile'), type: 'person', label: 'Danile' },
    T0,
  )
  graph = addMemoryNode(
    graph,
    { id: memoryNodeId('place', 'Madrid'), type: 'place', label: 'Madrid' },
    T0,
  )
  return connectMemoryNodes(
    graph,
    { from: memoryNodeId('person', 'Danile'), to: memoryNodeId('place', 'Madrid'), relation: 'association' },
    T0,
  )
}

describe('Einen Begriff berichtigen', () => {
  it('ändert nur die Anzeige, wenn die Kennung dieselbe bleibt', () => {
    let graph = createMemoryGraph()
    graph = addMemoryNode(graph, { id: memoryNodeId('person', 'daniel'), type: 'person', label: 'daniel' }, T0)
    const vorher = graph.nodes[0]

    const nachher = renameMemoryNode(graph, vorher!.id, 'Daniel', T0 + TAG)

    expect(nachher.nodes[0]?.label).toBe('Daniel')
    expect(nachher.nodes[0]?.id, 'die Kennung darf sich nicht ändern').toBe(vorher!.id)
    expect(nachher.removed, 'ein reiner Schreibfehler braucht keinen Grabstein').toEqual({})
  })

  it('nimmt Verlauf und Verbindungen mit, wenn sich die Kennung ändert', () => {
    const graph = graphMitZwei()
    const alt = memoryNodeId('person', 'Danile')

    const nachher = renameMemoryNode(graph, alt, 'Daniel', T0 + TAG)
    const neu = memoryNodeId('person', 'Daniel')

    expect(nachher.nodes.map((node) => node.id).sort()).toEqual(
      [neu, memoryNodeId('place', 'Madrid')].sort(),
    )
    // Der Verlauf zieht mit um — das ist der ganze Punkt.
    expect(nachher.nodes.find((node) => node.id === neu)?.createdAt).toBe(T0)
    // Und die Verbindung zeigt auf die neue Kennung, nicht ins Leere.
    expect(nachher.edges).toHaveLength(1)
    expect(nachher.edges[0]?.from).toBe(neu)
    expect(nachher.edges[0]?.createdAt, 'die Verbindung ist nicht neu').toBe(T0)
    // Damit die Änderung auch auf dem zweiten Gerät ankommt.
    expect(nachher.removed[alt]).toBe(T0 + TAG)
  })

  it('lässt zwei Begriffe nicht stillschweigend zu einem werden', () => {
    let graph = graphMitZwei()
    graph = addMemoryNode(
      graph,
      { id: memoryNodeId('person', 'Daniel'), type: 'person', label: 'Daniel' },
      T0,
    )

    const nachher = renameMemoryNode(graph, memoryNodeId('person', 'Danile'), 'Daniel', T0 + TAG)

    expect(nachher, 'zusammenlegen ist etwas anderes als berichtigen').toBe(graph)
  })
})

describe('Eine Verbindung berichtigen', () => {
  it('ändert ihre Art und behält, seit wann es sie gibt', () => {
    const graph = graphMitZwei()
    const alt = graph.edges[0]!.id

    const nachher = editMemoryEdge(graph, alt, 'sequence', T0 + TAG)

    expect(nachher.edges).toHaveLength(1)
    expect(nachher.edges[0]?.relation).toBe('sequence')
    expect(nachher.edges[0]?.createdAt).toBe(T0)
    expect(nachher.removed[alt], 'sonst kommt die alte Art vom anderen Gerät zurück').toBe(T0 + TAG)
  })

  it('lässt eine einzelne Verbindung entfernen, ohne den Knoten wegzuwerfen', () => {
    const graph = graphMitZwei()
    const alt = graph.edges[0]!.id

    const nachher = disconnectMemoryNodes(graph, alt, T0 + TAG)

    expect(nachher.edges).toHaveLength(0)
    expect(nachher.nodes, 'die Begriffe bleiben stehen').toHaveLength(2)
    expect(nachher.removed[alt]).toBe(T0 + TAG)
  })
})

describe('Der Grabstein wirkt auch beim Abgleich', () => {
  it('bringt eine entfernte Verbindung nicht vom anderen Gerät zurück', () => {
    const anderes = graphMitZwei()
    const hier = disconnectMemoryNodes(anderes, anderes.edges[0]!.id, T0 + TAG)

    const vereinigt = mergeMemoryGraph(hier, anderes)

    expect(vereinigt.edges, 'weggeworfen ist weggeworfen').toHaveLength(0)
  })

  it('lässt eine bewusst neu gezogene Verbindung wieder gelten', () => {
    const anderes = graphMitZwei()
    const hier = disconnectMemoryNodes(anderes, anderes.edges[0]!.id, T0 + TAG)
    // Auf dem anderen Gerät wurde sie danach erneut gezogen.
    const spaeter = connectMemoryNodes(
      { ...anderes, edges: [] },
      {
        from: memoryNodeId('person', 'Danile'),
        to: memoryNodeId('place', 'Madrid'),
        relation: 'association',
      },
      T0 + 2 * TAG,
    )

    const vereinigt = mergeMemoryGraph(hier, spaeter)

    expect(vereinigt.edges, 'ein jüngeres Lebenszeichen schlägt den Grabstein').toHaveLength(1)
  })
})

/**
 * Ein eigenes Paar berichtigen.
 *
 * Die Kennung eines Paares ist `frage ⟂ antwort` (`encodeFact`) — jede
 * Änderung ergibt also eine andere Kennung, und an der alten hängt der
 * Wiederholungsverlauf. Deshalb ist „ändern" hier nicht „löschen und neu",
 * sondern ein Umzug: Die Liste bekommt den neuen Text, und der Termin zieht
 * mit (das erledigt `data/own.ts`, weil dort die Datenbank steht).
 *
 * Hier steht die Regel darüber, was überhaupt eine gültige Änderung ist.
 */
describe('Ein eigenes Paar berichtigen', () => {
  const JETZT = 1_700_000_000_000
  const paare = [
    { prompt: 'Hauptstadt von Peru', answer: 'Lima' },
    { prompt: 'PIN Fahrrad', answer: '4711' },
  ]

  it('ändert Frage und Antwort und lässt die Reihenfolge stehen', () => {
    const nachher = editOwnFactList(
      paare,
      'PIN Fahrrad',
      { prompt: 'PIN Fahrradschloss', answer: '4712' },
      JETZT,
    )

    expect(nachher).toEqual([
      { prompt: 'Hauptstadt von Peru', answer: 'Lima' },
      { prompt: 'PIN Fahrradschloss', answer: '4712', editedAt: JETZT },
    ])
  })

  it('lässt nur die Antwort ändern — die Frage bleibt der Schlüssel', () => {
    const nachher = editOwnFactList(
      paare,
      'PIN Fahrrad',
      { prompt: 'PIN Fahrrad', answer: '0815' },
      JETZT,
    )
    expect(nachher?.[1]).toEqual({ prompt: 'PIN Fahrrad', answer: '0815', editedAt: JETZT })
  })

  it('weist Leeres ab, statt eine unbrauchbare Karte zu hinterlassen', () => {
    expect(
      editOwnFactList(paare, 'PIN Fahrrad', { prompt: '', answer: '4711' }, JETZT),
    ).toBeUndefined()
    expect(
      editOwnFactList(paare, 'PIN Fahrrad', { prompt: 'PIN Fahrrad', answer: '  ' }, JETZT),
    ).toBeUndefined()
  })

  it('legt zwei Karten nicht stillschweigend zu einer zusammen', () => {
    expect(
      editOwnFactList(paare, 'PIN Fahrrad', { prompt: 'Hauptstadt von Peru', answer: 'Lima' }, JETZT),
      'sonst verschwände eine Karte samt ihrem Verlauf',
    ).toBeUndefined()
  })

  it('sagt nichts zu tun, wenn es die Frage nicht gibt', () => {
    expect(
      editOwnFactList(paare, 'gibt es nicht', { prompt: 'a', answer: 'b' }, JETZT),
    ).toBeUndefined()
  })
})

/**
 * Eine Berichtigung muss beim zweiten Gerät ankommen (Nutzerwunsch 01.09.:
 * „exakt im gleichen Stand“).
 *
 * Ändert eine Berichtigung die Kennung, trägt sie sich von selbst weiter:
 * neuer Knoten, Grabstein auf dem alten. Zwei Fälle tun das **nicht** —
 * Groß-/Kleinschreibung und Beschreibung lassen die Kennung stehen. Dort
 * traf beim Abgleich der lokale Knoten auf den fremden, und der lokale
 * gewann stur. Die Berichtigung wäre auf dem einen Gerät geblieben und der
 * Tippfehler auf dem anderen für immer geblieben.
 *
 * Deshalb trägt eine Berichtigung seit dem 02.09. eine Marke (`editedAt`) —
 * dieselbe Auflösung, die der Graph für die Deadline längst benutzt.
 */
describe('Eine Berichtigung reist zum zweiten Gerät', () => {
  const DANIEL = memoryNodeId('person', 'daniel')
  const graph = () => {
    const leer = createMemoryGraph()
    return addMemoryNode(leer, { id: DANIEL, type: 'person', label: 'daniel' }, T0)
  }

  it('setzt die berichtigte Schreibweise gegen die alte des anderen Geräts durch', () => {
    const hier = renameMemoryNode(graph(), DANIEL, 'Daniel', T0 + TAG)
    // Das andere Gerät kennt nur die alte Schreibweise — es hat nichts getan.
    const dort = graph()

    const vereint = mergeMemoryGraph(dort, hier)
    expect(vereint.nodes.map((node) => node.label), 'die Berichtigung ist unterwegs verloren gegangen').toEqual([
      'Daniel',
    ])
  })

  it('lässt eine geleerte Beschreibung geleert, statt die alte zurückzuholen', () => {
    const mitText = setMemoryDetail(graph(), DANIEL, 'Nachbar', T0)
    const geleert = setMemoryDetail(mitText, DANIEL, '', T0 + TAG)

    const vereint = mergeMemoryGraph(mitText, geleert)
    expect(vereint.nodes[0]?.detail, 'die weggenommene Beschreibung kam zurück').toBeUndefined()
  })

  it('lässt Knoten ohne Marke unverändert — nichts von früher ändert sein Verhalten', () => {
    // Beide Seiten sind von vor dem Berichtigen: keine Marke, alte Regel.
    const hier = graph()
    const dort = addMemoryNode(createMemoryGraph(), { id: DANIEL, type: 'person', label: 'daniel' }, T0)
    const mitText = setMemoryDetail(dort, DANIEL, 'Nachbar', T0)
    const ohneMarke = {
      ...mitText,
      nodes: mitText.nodes.map(({ editedAt: _weg, ...rest }) => rest),
    }

    const vereint = mergeMemoryGraph(hier, ohneMarke)
    expect(vereint.nodes[0]?.detail, 'eine Beschreibung ging verloren, die niemand entfernt hat').toBe(
      'Nachbar',
    )
  })
})

/**
 * Eine Berichtigung zurücknehmen, ohne das Berichtigte zu verlieren.
 *
 * Beide Umzüge — Name und Art einer Verbindung — hinterlassen auf der alten
 * Kennung einen Grabstein, damit das zweite Gerät sie nicht zurückbringt.
 * Wer es sich anders überlegt, landet damit auf einer Kennung, die inzwischen
 * einen Grabstein trägt. Und weil beim Umzug das Entstehungsdatum erhalten
 * bleibt, ist das Zurückgekehrte **älter** als sein eigener Grabstein: Die
 * Vereinigung räumte es wieder weg — auf dem Bildschirm da, nach dem
 * nächsten Abgleich verschwunden.
 *
 * `addMemoryNode` löst den Grabstein aus genau diesem Grund seit jeher.
 */
describe('Eine Berichtigung zurücknehmen', () => {
  const DANILE = memoryNodeId('person', 'danile')
  const DANIEL = memoryNodeId('person', 'daniel')

  it('holt einen zurückbenannten Begriff nicht in seinen eigenen Grabstein', () => {
    let graph = addMemoryNode(
      createMemoryGraph(),
      { id: DANILE, type: 'person', label: 'Danile' },
      T0,
    )
    graph = renameMemoryNode(graph, DANILE, 'Daniel', T0 + TAG)
    graph = renameMemoryNode(graph, DANIEL, 'Danile', T0 + 2 * TAG)

    // Das zweite Gerät kennt nur den Ausgangsstand.
    const dort = addMemoryNode(
      createMemoryGraph(),
      { id: DANILE, type: 'person', label: 'Danile' },
      T0,
    )
    const vereint = mergeMemoryGraph(graph, dort)
    expect(
      vereint.nodes.map((node) => node.id),
      'der zurückbenannte Begriff ist beim Abgleich verschwunden',
    ).toEqual([DANILE])
  })

  it('holt eine zurückgestellte Verbindungsart nicht in ihren eigenen Grabstein', () => {
    let graph = addMemoryNode(
      createMemoryGraph(),
      { id: DANIEL, type: 'person', label: 'Daniel' },
      T0,
    )
    graph = addMemoryNode(graph, { id: 'place:madrid', type: 'place', label: 'Madrid' }, T0)
    graph = connectMemoryNodes(
      graph,
      { from: DANIEL, to: 'place:madrid', relation: 'association' },
      T0,
    )
    const kennung = `${DANIEL}→place:madrid:association`

    graph = editMemoryEdge(graph, kennung, 'sequence', T0 + TAG)
    graph = editMemoryEdge(graph, `${DANIEL}→place:madrid:sequence`, 'association', T0 + 2 * TAG)

    const vereint = mergeMemoryGraph(graph, graph)
    expect(
      vereint.edges.map((edge) => edge.relation),
      'die zurückgestellte Verbindung ist beim Abgleich verschwunden',
    ).toEqual(['association'])
  })
})
