import type { SchedulerOptimizerPort } from '../../core/index.ts'
import {
  createFsrsBindingOptimizer,
  type FsrsOptimizerBinding,
} from './fsrsOptimizerAdapter.ts'

export interface FsrsDynamicWasiModule {
  initOptimizer(options: {
    readonly wasm: string
    readonly worker: () => Worker
  }): Promise<FsrsOptimizerBinding>
}

export interface BrowserFsrsRuntimeOptions {
  readonly wasmUrl: string
  readonly createWorker: () => Worker
  readonly loadDynamicWasi: () => Promise<FsrsDynamicWasiModule>
  readonly crossOriginIsolated?: boolean
}

export type BrowserFsrsRuntimeResult =
  | { readonly status: 'unavailable'; readonly reason: 'cross-origin-isolation' }
  | { readonly status: 'ready'; readonly optimizer: SchedulerOptimizerPort }

/**
 * Lazy browser-runtime gate for the public-beta FSRS WASI optimizer.
 *
 * Runtime loading is deliberately deferred until optimization is actually due.
 * If the page is not cross-origin isolated, ANITEW leaves scheduling untouched
 * instead of attempting a worker/WASM launch that cannot be relied on.
 */
export async function createBrowserFsrsOptimizerRuntime(
  options: BrowserFsrsRuntimeOptions,
): Promise<BrowserFsrsRuntimeResult> {
  const isolated = options.crossOriginIsolated ?? globalThis.crossOriginIsolated === true
  if (!isolated) {
    return { status: 'unavailable', reason: 'cross-origin-isolation' }
  }

  const module = await options.loadDynamicWasi()
  const binding = await module.initOptimizer({
    wasm: options.wasmUrl,
    worker: options.createWorker,
  })

  return {
    status: 'ready',
    optimizer: createFsrsBindingOptimizer(binding),
  }
}
