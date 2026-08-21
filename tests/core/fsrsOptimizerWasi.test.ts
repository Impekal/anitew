import { generatorParameters } from 'ts-fsrs'
import { describe, expect, it, vi } from 'vitest'

import type { OptimizerItemHistory, SchedulerOptimizerPort } from '../../src/core/index.ts'
import { optimizeBrowserFsrsWeightsIfDue } from '../../src/platform/web/fsrsOptimizerWasi.ts'

function historyWithReturns(count: number): readonly OptimizerItemHistory[] {
  return [{
    itemId: 'words:de:test',
    reviews: [
      { rating: 3, deltaDays: 0 },
      ...Array.from({ length: count }, () => ({ rating: 3 as const, deltaDays: 1 })),
    ],
  }]
}

describe('C10 official browser WASI orchestration', () => {
  it('does not initialize WASI before the existing cadence says optimization is due', async () => {
    const runtimeFactory = vi.fn()

    await expect(
      optimizeBrowserFsrsWeightsIfDue(historyWithReturns(99), undefined, runtimeFactory),
    ).resolves.toEqual({ status: 'not-due', returnCount: 99 })

    expect(runtimeFactory).not.toHaveBeenCalled()
  })

  it('returns no weights when the browser runtime is unavailable', async () => {
    const runtimeFactory = vi.fn(async () => ({
      status: 'unavailable' as const,
      reason: 'cross-origin-isolation' as const,
    }))

    const result = await optimizeBrowserFsrsWeightsIfDue(
      historyWithReturns(100),
      undefined,
      runtimeFactory,
    )

    expect(runtimeFactory).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({ returnCount: 100 })
    expect(result.status === 'runtime-unavailable' || result.status === 'optimizer-failed').toBe(true)
    expect('weights' in result).toBe(false)
  })

  it('returns no weights when the WASI optimizer throws', async () => {
    const optimizer: SchedulerOptimizerPort = {
      optimize: vi.fn(async () => {
        throw new Error('WASM failed')
      }),
    }
    const runtimeFactory = vi.fn(async () => ({ status: 'ready' as const, optimizer }))

    const result = await optimizeBrowserFsrsWeightsIfDue(
      historyWithReturns(100),
      undefined,
      runtimeFactory,
    )

    expect(result).toMatchObject({ returnCount: 100 })
    expect(result.status === 'runtime-unavailable' || result.status === 'optimizer-failed').toBe(true)
    expect('weights' in result).toBe(false)
  })

  it('lets only validated optimizer weights cross back into core', async () => {
    const weights = generatorParameters().w
    const optimizer: SchedulerOptimizerPort = {
      optimize: vi.fn(async () => [...weights]),
    }
    const runtimeFactory = vi.fn(async () => ({ status: 'ready' as const, optimizer }))

    const result = await optimizeBrowserFsrsWeightsIfDue(
      historyWithReturns(100),
      undefined,
      runtimeFactory,
    )

    expect(result.status).toBe('optimized')
    if (result.status === 'optimized') {
      expect(result.weights).toEqual(weights)
      expect(Object.isFrozen(result.weights)).toBe(true)
    }
  })
})
