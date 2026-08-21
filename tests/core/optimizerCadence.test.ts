import { describe, expect, it } from 'vitest'

import {
  MIN_OPTIMIZER_RETURNS,
  optimizerThresholdAtOrBelow,
  shouldOptimizeParameters,
} from '../../src/core/index.ts'

describe('C10 — lokale Re-Optimierungs-Kadenz', () => {
  it('optimiert nie vor dem bestehenden Evidenz-Gate', () => {
    expect(optimizerThresholdAtOrBelow(MIN_OPTIMIZER_RETURNS - 1)).toBeUndefined()
    expect(shouldOptimizeParameters(MIN_OPTIMIZER_RETURNS - 1)).toBe(false)
  })

  it('startet bei 100 belegbaren Wiedersehen', () => {
    expect(optimizerThresholdAtOrBelow(MIN_OPTIMIZER_RETURNS)).toBe(MIN_OPTIMIZER_RETURNS)
    expect(shouldOptimizeParameters(MIN_OPTIMIZER_RETURNS)).toBe(true)
  })

  it('verdoppelt die Schwelle deterministisch', () => {
    expect(optimizerThresholdAtOrBelow(199)).toBe(100)
    expect(optimizerThresholdAtOrBelow(200)).toBe(200)
    expect(optimizerThresholdAtOrBelow(399)).toBe(200)
    expect(optimizerThresholdAtOrBelow(400)).toBe(400)
  })

  it('trainiert innerhalb derselben Schwelle nicht erneut', () => {
    expect(shouldOptimizeParameters(150, 100)).toBe(false)
    expect(shouldOptimizeParameters(199, 150)).toBe(false)
  })

  it('trainiert erneut, sobald die nächste Schwelle überschritten wurde', () => {
    expect(shouldOptimizeParameters(200, 100)).toBe(true)
    expect(shouldOptimizeParameters(450, 200)).toBe(true)
    expect(shouldOptimizeParameters(799, 400)).toBe(false)
    expect(shouldOptimizeParameters(800, 400)).toBe(true)
  })

  it('weist ungültige Zähler konservativ ab', () => {
    expect(optimizerThresholdAtOrBelow(Number.NaN)).toBeUndefined()
    expect(optimizerThresholdAtOrBelow(Number.POSITIVE_INFINITY)).toBeUndefined()
    expect(shouldOptimizeParameters(Number.NaN)).toBe(false)
  })
})
