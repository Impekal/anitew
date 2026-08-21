import { describe, expect, it } from 'vitest'

import {
  isSpatialId,
  SPATIAL_CELLS,
  spatialCellOf,
  spatialCoordinatesOf,
  spatialPool,
} from '../../src/core/index.ts'

describe('D12 spatial memory content', () => {
  it('builds the same unique pool from the same seed', () => {
    const first = spatialPool('2026-08-21:daily', 40)
    const second = spatialPool('2026-08-21:daily', 40)

    expect(second).toEqual(first)
    expect(new Set(first).size).toBe(40)
    expect(first.every(isSpatialId)).toBe(true)
  })

  it('changes the pool when the session seed changes', () => {
    expect(spatialPool('day-a', 12)).not.toEqual(spatialPool('day-b', 12))
  })

  it('derives one stable 3x3 target cell from the item id', () => {
    for (const item of spatialPool('targets', 60)) {
      const first = spatialCellOf(item)
      const second = spatialCellOf(item)
      expect(second).toBe(first)
      expect(SPATIAL_CELLS).toContain(first)

      const coordinates = spatialCoordinatesOf(item)
      expect(coordinates?.row).toBeGreaterThanOrEqual(0)
      expect(coordinates?.row).toBeLessThanOrEqual(2)
      expect(coordinates?.column).toBeGreaterThanOrEqual(0)
      expect(coordinates?.column).toBeLessThanOrEqual(2)
    }
  })

  it('does not invent a target for malformed ids', () => {
    expect(spatialCellOf('space~')).toBeUndefined()
    expect(spatialCellOf('space~abc')).toBeUndefined()
    expect(spatialCellOf('words:de:Anker')).toBeUndefined()
    expect(spatialCoordinatesOf('not-spatial')).toBeUndefined()
  })

  it('rejects nonsensical pool sizes instead of silently rounding them', () => {
    expect(() => spatialPool('x', -1)).toThrow(RangeError)
    expect(() => spatialPool('x', 1.5)).toThrow(RangeError)
  })
})
