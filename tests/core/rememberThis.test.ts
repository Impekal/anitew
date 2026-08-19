import { describe, expect, it } from 'vitest'

import { sanitizeArchitectSuggestions } from '../../src/core/memory/memoryArchitect.ts'
import { createMemoryGraph, memoryNodeId } from '../../src/core/memory/memoryGraph.ts'
import {
  composeMemoryPool,
  memoryLabelsOf,
  memorySceneItems,
  memorySubjectOf,
} from '../../src/core/memory/missionComposer.ts'
import {
  applyRememberedSuggestions,
  suggestMemories,
} from '../../src/core/memory/rememberThis.ts'
import { promptedSetHits } from '../../src/core/session/grading.ts'
import { MODES } from '../../src/core/modes.ts'
import { type Pools, planSession } from '../../src/core/session/plan.ts'

/**
 * „Das will ich behalten“ (D-036).
 *
 * Der Maßstab ist das Beispiel aus dem Auftrag, wörtlich: Aus „Daniel
 * arbeitet im Museum, kommt aus Madrid und spielt Gitarre.“ müssen
 * Daniel, Museum, Madrid und Gitarre werden — und Daniel→Museum,
 * Daniel→Madrid, Daniel→Gitarre als Beziehungen. Nichts wird gespeichert,
 * bevor es bestätigt ist; abgewählte Enden reißen ihre Kanten still mit.
 */
describe('das Behalten-Wollen', () => {
  const DANIEL = 'Daniel arbeitet im Museum, kommt aus Madrid und spielt Gitarre.'

  it('trägt das Auftragsbeispiel: vier Knoten, drei Beziehungen', () => {
    const { nodes, edges } = suggestMemories({ text: DANIEL })

    expect(nodes.map((node) => node.label)).toEqual(['Daniel', 'Museum', 'Madrid', 'Gitarre'])
    expect(nodes[0]?.type).toBe('person')
    // „im Museum“ und „aus Madrid“ tragen den Ortshinweis.
    expect(nodes[1]?.type).toBe('place')
    expect(nodes[2]?.type).toBe('place')

    const daniel = memoryNodeId('person', 'Daniel')
    expect(edges).toHaveLength(3)
    for (const edge of edges) expect(edge.from).toBe(daniel)
  })

  it('findet Jahre, Zahlen und Zitate — und verschluckt sonst nichts still', () => {
    const { nodes } = suggestMemories({ text: 'Der Kurs "Atlas" beginnt 2027 um 9:30.' })
    const labels = nodes.map((node) => node.label)
    expect(labels).toContain('2027')
    expect(labels).toContain('9:30')
    expect(labels).toContain('Atlas')

    // Nichts erkannt → der ganze Satz wird eine ehrliche Karte.
    const fallback = suggestMemories({ text: 'ohne jedes große wort' })
    expect(fallback.nodes).toHaveLength(1)
    expect(fallback.nodes[0]?.type).toBe('fact')
  })

  it('speichert nur Bestätigtes — abgewählte Enden reißen ihre Kanten mit', () => {
    const suggestions = suggestMemories({ text: DANIEL })
    const confirmed = {
      nodes: suggestions.nodes.filter((node) => node.label !== 'Museum'),
      edges: suggestions.edges,
    }
    const graph = applyRememberedSuggestions(createMemoryGraph(), confirmed, 1_000)
    expect(graph.nodes.map((node) => node.label)).toEqual(['Daniel', 'Madrid', 'Gitarre'])
    expect(graph.edges).toHaveLength(2)
  })

  it('komponiert die Mission aus den schwächsten Ankern — mit ihren Dingen', () => {
    const graph = applyRememberedSuggestions(
      createMemoryGraph(),
      suggestMemories({ text: DANIEL }),
      1_000,
    )
    const pool = composeMemoryPool(graph)
    expect(pool).toHaveLength(1)

    const anchor = pool[0] as string
    expect(memorySubjectOf(anchor)).toBe('Daniel')
    const items = memorySceneItems(anchor)
    expect(items).toHaveLength(3)
    expect(memoryLabelsOf(items[0] as string)).toEqual({ subject: 'Daniel', target: 'Museum' })

    // Ein Anker ohne Verbindungen trägt keine Frage und bleibt draußen.
    const lonely = applyRememberedSuggestions(
      createMemoryGraph(),
      { nodes: [{ id: 'person:solo', type: 'person', label: 'Solo' }], edges: [] },
      1_000,
    )
    expect(composeMemoryPool(lonely)).toHaveLength(0)
  })

  it('wäscht KI-Vorschläge wie Fremdmaterial (D-037)', () => {
    const washed = sanitizeArchitectSuggestions({
      nodes: [
        { type: 'person', label: '  Daniel  ' },
        { type: 'ufo', label: 'Madrid' },
        { label: 42 },
        'quatsch',
      ],
      edges: [
        { from: memoryNodeId('person', 'Daniel'), to: memoryNodeId('custom', 'Madrid') },
        { from: memoryNodeId('person', 'Daniel'), to: 'fehlt' },
      ],
    })
    expect(washed.nodes.map((node) => node.label)).toEqual(['Daniel', 'Madrid'])
    expect(washed.nodes[1]?.type).toBe('custom')
    expect(washed.edges).toHaveLength(1)
  })
})

describe('die Mengen-Wertung am Anker (D-036)', () => {
  it('zählt Antworten in beliebiger Reihenfolge — je Antwort einmal', () => {
    const targets = ['Museum', 'Madrid', 'Gitarre']
    const groups = () => 'Daniel'
    expect(promptedSetHits(['Gitarre', 'Museum', 'Madrid'], targets, 'typos', groups)).toEqual([
      true,
      true,
      true,
    ])
    // Dieselbe Antwort zweimal löst nur ein Ziel ein.
    expect(promptedSetHits(['Madrid', 'Madrid', ''], targets, 'typos', groups)).toEqual([
      false,
      true,
      false,
    ])
  })

  it('verrechnet nichts zwischen Ankern — Anna löst keine Daniel-Frage', () => {
    const targets = ['Madrid', 'Berlin']
    const groupOf = (index: number) => (index === 0 ? 'Daniel' : 'Anna')
    expect(promptedSetHits(['Berlin', 'Madrid'], targets, 'typos', groupOf)).toEqual([false, false])
    expect(promptedSetHits(['Madrid', 'Berlin'], targets, 'typos', groupOf)).toEqual([true, true])
  })
})

describe('die Memory-Szene im Bauplan (D-036)', () => {
  const DANIEL = 'Daniel arbeitet im Museum, kommt aus Madrid und spielt Gitarre.'
  const empty: Pools = {
    words: Array.from({ length: 30 }, (_, index) => `w${index}`),
    faces: [],
    numbers: [],
    missions: [],
    palace: [],
    reverse: [],
    twins: [],
    gaze: [],
    facts: [],
    memory: [],
  }
  const base = { day: '2026-08-19', language: 'de', seed: 'memory', mode: 'daily' } as const

  it('plant die Szene als Runde — und ohne Vorrat gar nicht', () => {
    const without = planSession({ ...base, pools: empty, modules: ['words', 'memory'] })
    expect(without.blocks.some((block) => block.moduleId === 'memory')).toBe(false)

    const graph = applyRememberedSuggestions(
      createMemoryGraph(),
      suggestMemories({ text: DANIEL }),
      1_000,
    )
    const plan = planSession({
      ...base,
      pools: { ...empty, memory: composeMemoryPool(graph) },
      modules: ['words', 'memory'],
    })
    const encode = plan.blocks.find(
      (block) => block.kind === 'encode' && block.moduleId === 'memory',
    )
    expect(encode).toBeDefined()
    // Die Runde trägt die ganze Szene: drei Stücke am Anker Daniel.
    expect(encode?.items).toHaveLength(3)
    expect(encode?.items.every((item) => memorySubjectOf(item) === 'Daniel')).toBe(true)
    const total = plan.blocks.reduce((sum, block) => sum + block.seconds, 0)
    expect(total).toBe(MODES.daily.seconds)
  })
})
