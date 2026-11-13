import { describe, expect, it } from 'vitest'

import {
  addMemoryNode,
  createMemoryGraph,
  memoryNodeId,
  mergeMemoryGraph,
  readMemoryGraph,
  setMemoryDeadline,
} from '../../src/core/memory/memoryGraph.ts'
import { newMemory } from '../../src/core/scheduler/memory.ts'
import { selectDue } from '../../src/core/scheduler/due.ts'

function scheduled(itemId: string, lastDay: string, dueDay: string, neededByDay?: string) {
  return {
    itemId,
    memory: { ...newMemory(lastDay, true), lastDay, dueDay },
    ...(neededByDay === undefined ? {} : { neededByDay }),
  }
}

describe('I5 · termingebundene Wiederholungen', () => {
  it('zieht eine noch nicht fällige persönliche Erinnerung am Vortag vor', () => {
    const item = scheduled('memory:de:vortrag', '2026-08-28', '2026-09-20', '2026-08-30')
    expect(selectDue([item], '2026-08-29', 5).map((entry) => entry.itemId)).toEqual([
      'memory:de:vortrag',
    ])
  })

  it('fragt termingebundenes Material am Zieltag und danach nicht mehr ab', () => {
    const item = scheduled('memory:de:vortrag', '2026-08-27', '2026-08-28', '2026-08-30')
    expect(selectDue([item], '2026-08-30', 5)).toEqual([])
    expect(selectDue([item], '2026-08-31', 5)).toEqual([])
  })

  it('lässt eine ferne Deadline den normalen FSRS-Termin unangetastet', () => {
    const item = scheduled('memory:de:prüfung', '2026-08-24', '2026-09-02', '2026-09-20')
    expect(selectDue([item], '2026-08-29', 5)).toEqual([])
  })

  it('macht in der 7-Tage-Zone höchstens jeden zweiten Kalendertag Druck', () => {
    const yesterday = scheduled('memory:de:a', '2026-08-28', '2026-09-20', '2026-09-04')
    const twoDaysAgo = scheduled('memory:de:b', '2026-08-27', '2026-09-20', '2026-09-04')
    expect(selectDue([yesterday, twoDaysAgo], '2026-08-29', 5).map((entry) => entry.itemId)).toEqual([
      'memory:de:b',
    ])
  })

  it('ändert die historische Auswahl ohne Deadline nicht', () => {
    const a = scheduled('a', '2026-08-10', '2026-08-12')
    const b = scheduled('b', '2026-08-10', '2026-08-15')
    expect(selectDue([b, a], '2026-08-17', 2).map((entry) => entry.itemId)).toEqual(['a', 'b'])
  })
})

describe('I5 · Deadline im Memory Graph', () => {
  const nodeId = memoryNodeId('fact', 'Vortragsthese')
  const base = addMemoryNode(
    createMemoryGraph(),
    { id: nodeId, type: 'fact', label: 'Vortragsthese' },
    10,
  )

  it('nimmt beim Geräteabgleich die jüngste bewusste Terminänderung', () => {
    const mine = setMemoryDeadline(
      base,
      [nodeId],
      { at: 1_800_000_000_000, day: '2027-01-15' },
      100,
    )
    const theirs = setMemoryDeadline(
      base,
      [nodeId],
      { at: 1_800_086_400_000, day: '2027-01-16' },
      200,
    )
    const merged = mergeMemoryGraph(mine, theirs)
    expect(merged.nodes[0]?.neededByDay).toBe('2027-01-16')
    expect(merged.nodes[0]?.neededByUpdatedAt).toBe(200)
  })

  it('synchronisiert auch das bewusste Entfernen einer Deadline', () => {
    const withDeadline = setMemoryDeadline(
      base,
      [nodeId],
      { at: 1_800_000_000_000, day: '2027-01-15' },
      100,
    )
    const cleared = setMemoryDeadline(withDeadline, [nodeId], undefined, 300)
    const merged = mergeMemoryGraph(withDeadline, cleared)
    expect(merged.nodes[0]?.neededByAt).toBeUndefined()
    expect(merged.nodes[0]?.neededByDay).toBeUndefined()
    expect(merged.nodes[0]?.neededByUpdatedAt).toBe(300)
  })

  it('liest neue Felder tolerant aus Sicherungen und lässt alte Graphen unverändert lesbar', () => {
    const withDeadline = setMemoryDeadline(
      base,
      [nodeId],
      { at: 1_800_000_000_000, day: '2027-01-15' },
      100,
    )
    expect(readMemoryGraph(withDeadline).nodes[0]?.neededByDay).toBe('2027-01-15')
    expect(readMemoryGraph(base).nodes[0]?.neededByDay).toBeUndefined()
  })
})
