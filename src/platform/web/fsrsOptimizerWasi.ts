import { initOptimizer } from '@open-spaced-repetition/binding/dynamic-wasi'
import wasmUrl from '@open-spaced-repetition/binding-wasm32-wasi/fsrs-binding.wasm32-wasi.wasm?url'
import WasiWorker from '@open-spaced-repetition/binding-wasm32-wasi/wasi-worker-browser.mjs?worker'

import {
  optimizeSchedulerWeightsIfDue,
  optimizerReturnCount,
  type OptimizerItemHistory,
  type OptimizerRunResult,
  type SchedulerOptimizerPort,
} from '../../core/index.ts'
import { createBrowserFsrsOptimizerRuntime } from './fsrsOptimizerRuntime.ts'

export type BrowserWasiOptimizationResult =
  | OptimizerRunResult
  | { readonly status: 'runtime-unavailable'; readonly returnCount: number }
  | { readonly status: 'optimizer-failed'; readonly returnCount: number }

/**
 * Official browser/WASI optimizer port for Vite.
 *
 * The binding, WASM asset and worker are the upstream dynamic-wasi variant.
 * Runtime construction stays inside optimize(), so the existing core cadence
 * decides first whether expensive local training is due.
 */
export function createOfficialBrowserFsrsOptimizer(): SchedulerOptimizerPort {
  return {
    async optimize(histories: readonly OptimizerItemHistory[]): Promise<unknown> {
      const runtime = await createBrowserFsrsOptimizerRuntime({
        wasmUrl,
        createWorker: () => new WasiWorker(),
        loadDynamicWasi: async () => ({ initOptimizer }),
      })

      if (runtime.status !== 'ready') {
        throw new Error(`FSRS browser runtime unavailable: ${runtime.reason}`)
      }

      return runtime.optimizer.optimize(histories)
    },
  }
}

/**
 * Runs the existing optimizer orchestration without allowing WASI/runtime
 * failures to alter scheduling. Only an `optimized` result contains validated
 * weights eligible for persistence; failures return no weights at all.
 */
export async function optimizeBrowserFsrsWeightsIfDue(
  histories: readonly OptimizerItemHistory[],
  lastOptimizedReturnCount: number | undefined,
): Promise<BrowserWasiOptimizationResult> {
  const returnCount = optimizerReturnCount(histories)

  try {
    return await optimizeSchedulerWeightsIfDue(
      histories,
      lastOptimizedReturnCount,
      createOfficialBrowserFsrsOptimizer(),
    )
  } catch {
    return {
      status: globalThis.crossOriginIsolated === true ? 'optimizer-failed' : 'runtime-unavailable',
      returnCount,
    }
  }
}
