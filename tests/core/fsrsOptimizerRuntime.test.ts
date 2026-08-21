import { describe, expect, it, vi } from 'vitest'

import { createBrowserFsrsOptimizerRuntime } from '../../src/platform/web/fsrsOptimizerRuntime.ts'

describe('FSRS browser runtime gate', () => {
  it('does not load the WASI runtime without cross-origin isolation', async () => {
    const loadDynamicWasi = vi.fn()

    await expect(
      createBrowserFsrsOptimizerRuntime({
        wasmUrl: '/fsrs-binding.wasm',
        createWorker: () => ({}) as Worker,
        loadDynamicWasi,
        crossOriginIsolated: false,
      }),
    ).resolves.toEqual({
      status: 'unavailable',
      reason: 'cross-origin-isolation',
    })
    expect(loadDynamicWasi).not.toHaveBeenCalled()
  })

  it('initializes the isolated WASI binding lazily and returns the existing adapter', async () => {
    class Review {
      constructor(
        readonly rating: 1 | 3,
        readonly deltaDays: number,
      ) {}
    }
    class Item {
      constructor(readonly reviews: readonly unknown[]) {}
    }

    const worker = {} as Worker
    const computeParameters = vi.fn(() => Array.from({ length: 19 }, (_, index) => index + 1))
    const initOptimizer = vi.fn(async (options: { wasm: string; worker: () => Worker }) => {
      void options
      return {
        FSRSBindingReview: Review,
        FSRSBindingItem: Item,
        computeParameters,
      }
    })
    const loadDynamicWasi = vi.fn(async () => ({ initOptimizer }))

    const result = await createBrowserFsrsOptimizerRuntime({
      wasmUrl: '/assets/fsrs-binding.wasm',
      createWorker: () => worker,
      loadDynamicWasi,
      crossOriginIsolated: true,
    })

    expect(loadDynamicWasi).toHaveBeenCalledTimes(1)
    expect(initOptimizer).toHaveBeenCalledWith({
      wasm: '/assets/fsrs-binding.wasm',
      worker: expect.any(Function),
    })
    const initOptions = initOptimizer.mock.calls[0]?.[0]
    expect(initOptions?.worker()).toBe(worker)
    expect(result.status).toBe('ready')

    if (result.status === 'ready') {
      await result.optimizer.optimize([
        {
          itemId: 'words:de:alpha',
          reviews: [
            { rating: 3, deltaDays: 0 },
            { rating: 1, deltaDays: 7 },
          ],
        },
      ])
    }

    expect(computeParameters).toHaveBeenCalledTimes(1)
  })
})
