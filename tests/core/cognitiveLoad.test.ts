import { describe, expect, it } from 'vitest'

import { MODES } from '../../src/core/modes.ts'
import {
  isCognitivelyHeavy,
  planSession,
  type ModuleId,
  type Pools,
} from '../../src/core/session/plan.ts'

const words = Array.from({ length: 80 }, (_, index) => `wort-${index}`)
const reverse = Array.from({ length: 40 }, (_, index) => String(1000 + index))
const twins = Array.from({ length: 30 }, (_, index) => `paar${index}a%paar${index}b`)

const pools: Pools = {
  words,
  faces: [],
  numbers: [],
  missions: [],
  palace: [],
  reverse,
  twins,
  gaze: [],
  facts: [],
  memory: [], people: [],
}

function learningRounds(modules: readonly ModuleId[]) {
  const session = planSession({
    mode: 'extended',
    day: '2026-08-20',
    language: 'de',
    seed: 'o7-cognitive-load',
    pools,
    modules,
  })
  const roundModules = session.blocks
    .filter((block) => block.kind === 'recall')
    .map((block) => block.moduleId)
  return { session, roundModules }
}

describe('O7 — kognitive Last zwischen Runden', () => {
  it('klassifiziert nur die bewusst schweren Module', () => {
    expect(isCognitivelyHeavy('palace')).toBe(true)
    expect(isCognitivelyHeavy('reverse')).toBe(true)
    expect(isCognitivelyHeavy('twins')).toBe(true)

    for (const moduleId of ['words', 'faces', 'numbers', 'missions', 'gaze', 'facts', 'memory'] as const) {
      expect(isCognitivelyHeavy(moduleId)).toBe(false)
    }
  })

  it('setzt bei verfügbarem leichten Vorrat keine zwei schweren Runden direkt hintereinander', () => {
    const { roundModules } = learningRounds(['reverse', 'twins', 'words'])

    expect(roundModules.length).toBeGreaterThan(2)
    for (let index = 1; index < roundModules.length; index++) {
      const previous = roundModules[index - 1] as ModuleId
      const current = roundModules[index] as ModuleId
      expect(isCognitivelyHeavy(previous) && isCognitivelyHeavy(current)).toBe(false)
    }
  })

  it('erzwingt keine leichte Runde, wenn keine leichte Alternative existiert', () => {
    const { session, roundModules } = learningRounds(['reverse', 'twins'])

    expect(roundModules.length).toBeGreaterThan(0)
    expect(roundModules.every(isCognitivelyHeavy)).toBe(true)
    expect(session.blocks.reduce((sum, block) => sum + block.seconds, 0)).toBe(MODES.extended.seconds)
  })
})
