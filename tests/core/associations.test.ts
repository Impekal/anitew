import { describe, expect, it } from 'vitest'

import {
  associationCueFor,
  associationId,
  associationItems,
  baseMissionItem,
  isAssociationId,
  missionFor,
} from '../../src/core/index.ts'

describe('D13 associative reverse recall', () => {
  it('creates a separate stable reverse item for every mission fact', () => {
    const items = associationItems('Elena')
    expect(items).toEqual([
      'Elena#room~person',
      'Elena#object~person',
      'Elena#location~person',
      'Elena#time~person',
      'Elena#place~person',
    ])
    expect(new Set(items).size).toBe(items.length)
    expect(items.every(isAssociationId)).toBe(true)
  })

  it('derives cue and person only from the deterministic learned scene', () => {
    const mission = missionFor('Elena', 'de')
    for (const fact of mission.facts) {
      const base = `Elena#${fact.kind}`
      const reverse = associationId(base)
      expect(reverse).toBeDefined()
      expect(baseMissionItem(reverse ?? '')).toBe(base)
      const cue = associationCueFor(reverse ?? '', 'de')
      expect(cue?.kind).toBe(fact.kind)
      expect(cue?.target).toBe('Elena')
      // Beim Gegenstand wird die separat trainierte Lage bewusst nicht Teil
      // der Objektantwort; dieselbe Regel gilt schon im Missionsabruf.
      if (fact.kind !== 'object') expect(cue?.cue).toBe(fact.value)
    }
  })

  it('is deterministic across repeated reconstruction', () => {
    const item = associationId('Samira#place') ?? ''
    expect(associationCueFor(item, 'de')).toEqual(associationCueFor(item, 'de'))
    expect(associationCueFor(item, 'en')).toEqual(associationCueFor(item, 'en'))
  })

  it('refuses malformed or non-mission ids instead of guessing', () => {
    expect(associationId('Elena')).toBeUndefined()
    expect(isAssociationId('Elena#unknown~person')).toBe(false)
    expect(associationCueFor('Elena#unknown~person', 'de')).toBeUndefined()
    expect(associationCueFor('Elena#room', 'de')).toBeUndefined()
  })
})
