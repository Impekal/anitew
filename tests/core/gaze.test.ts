import { describe, expect, it } from 'vitest'

import { benchmarkPool } from '../../src/core/benchmark/pool.ts'
import {
  GAZE_SCENE_SIZE,
  gazeAnswer,
  gazeObjectName,
  gazeObjectOf,
  gazePlacements,
  gazePool,
  gazeSceneOf,
  gazeSpec,
  gazeVocabulary,
  hasGazePool,
  isGazeId,
} from '../../src/core/content/gaze.ts'
import { MODES } from '../../src/core/modes.ts'
import { normalizeWord } from '../../src/core/session/grading.ts'
import {
  type Pools,
  displayOf,
  planSession,
  subjectOf,
  targetOf,
} from '../../src/core/session/plan.ts'
import { trainingLanguages } from '../../src/core/training.ts'

/**
 * Die Bilder mit Einzelheiten (Achse „Visuell“).
 *
 * Die tragende Regel: **Die Kennung erzeugt die Szene.** `bild~7` muss
 * heute, morgen und beim Wiedersehen in zwei Wochen dieselben vier Dinge in
 * denselben Farben ergeben — sonst fragte die App nach einem Bild, das es
 * nie gab.
 */

const LANGUAGES = trainingLanguages()

describe('die Bilder', () => {
  it('erzeugt aus derselben Kennung immer dieselbe Szene', () => {
    expect(gazeSpec('bild~7')).toEqual(gazeSpec('bild~7'))
    expect(gazeSpec('bild~7')).not.toEqual(gazeSpec('bild~8'))
  })

  it('trägt vier verschiedene Dinge in vier verschiedenen Farben', () => {
    for (const sceneId of gazePool('probe', 40)) {
      const spec = gazeSpec(sceneId)
      expect(spec).toHaveLength(GAZE_SCENE_SIZE)
      expect(new Set(spec.map((detail) => detail.object)).size).toBe(GAZE_SCENE_SIZE)
      expect(new Set(spec.map((detail) => detail.color)).size).toBe(GAZE_SCENE_SIZE)
    }
  })

  it('zerlegt die Kennungen sauber — hin und zurück', () => {
    for (const sceneId of gazePool('probe', 10)) {
      expect(isGazeId(sceneId)).toBe(true)
      const placements = gazePlacements(sceneId)
      expect(placements).toHaveLength(GAZE_SCENE_SIZE)
      for (const item of placements) {
        expect(gazeSceneOf(item)).toBe(sceneId)
        expect(gazeObjectOf(item)).toBeDefined()
      }
    }
  })

  it('wiederholt im Vorrat keine Szene', () => {
    const pool = gazePool('probe', 60)
    expect(new Set(pool).size).toBe(pool.length)
  })

  it('nennt in jeder Trainingssprache Ding und Farbe', () => {
    for (const language of LANGUAGES) {
      expect(hasGazePool(language), language).toBe(true)
      for (const item of gazePlacements('bild~3')) {
        expect(gazeObjectName(item, language), `${language}: ${item}`).toBeTruthy()
        expect(gazeAnswer(item, language), `${language}: ${item}`).toBeTruthy()
      }
    }
  })

  it('hält seine Wörter aus dem Quarantänevorrat der Messung heraus (F2a)', () => {
    /*
     * Nur die Messung ist hier hart: Ein Ding- oder Farbname, der zugleich
     * Quarantänewort wäre, machte aus der Messung Training. Überschneidungen
     * mit dem Wortmodul sind dagegen erlaubt — dort ist das Wort die
     * Antwort, hier ist es die Frage; zwei verschiedene Aufgaben (wie
     * „Elena“ bei Gesicht und Mission, H1).
     */
    for (const language of LANGUAGES) {
      const quarantine = new Set(benchmarkPool(language).map((word) => normalizeWord(word)))
      for (const word of gazeVocabulary(language)) {
        expect(quarantine.has(normalizeWord(word)), `${language}: ${word}`).toBe(false)
      }
    }
  })
})

describe('die Bilder im Bauplan', () => {
  const pools: Pools = {
    words: [],
    faces: [],
    numbers: [],
    missions: [],
    palace: [],
    reverse: [],
    twins: [],
    gaze: gazePool('plan', 30),
    facts: [], memory: [],
  }
  const base = { day: '2026-08-19', language: 'de', seed: 'plan', pools } as const

  it('plant eine Runde als ein Bild — vier Fragen, Budget exakt', () => {
    for (const mode of ['emergency', 'short', 'daily'] as const) {
      const plan = planSession({ ...base, mode, modules: ['gaze'] })
      for (const block of plan.blocks.filter((entry) => entry.kind === 'encode')) {
        // Vier Einzelheiten, alle aus **einer** Szene.
        expect(block.items).toHaveLength(GAZE_SCENE_SIZE)
        expect(new Set(block.items.map((item) => gazeSceneOf(item))).size).toBe(1)
      }
      const total = plan.blocks.reduce((sum, block) => sum + block.seconds, 0)
      expect(total).toBe(MODES[mode].seconds)
    }
  })

  it('sucht die Farbe und zeigt Ding und Farbe lesbar', () => {
    const item = gazePlacements('bild~7')[0] as string
    const answer = gazeAnswer(item, 'de')
    expect(targetOf('gaze', item, 'de')).toBe(answer)
    expect(displayOf('gaze', item, 'de')).toContain(answer as string)
    expect(subjectOf('gaze', item)).toBe('bild~7')
  })

  it('zieht ein Bild, dessen Einzelheit fällig ist, nicht noch einmal als neu', () => {
    const sceneId = gazePool('plan', 1)[0] as string
    const dueItem = gazePlacements(sceneId)[0] as string
    const plan = planSession({
      ...base,
      mode: 'daily',
      due: { gaze: [dueItem], facts: [], memory: [] },
      modules: ['gaze'],
    })
    for (const block of plan.blocks.filter((entry) => entry.kind !== 'review')) {
      for (const item of block.items) {
        expect(gazeSceneOf(item)).not.toBe(sceneId)
      }
    }
  })
})
