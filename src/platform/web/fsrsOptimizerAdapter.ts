import {
  fsrsBindingInputsOf,
  type OptimizerItemHistory,
  type SchedulerOptimizerPort,
} from '../../core/index.ts'

/** Minimal surface used from the public-beta FSRS WASI binding. */
export interface FsrsOptimizerBinding<Review = unknown, Item = unknown> {
  readonly FSRSBindingReview: new (rating: 1 | 3, deltaDays: number) => Review
  readonly FSRSBindingItem: new (reviews: Review[]) => Item
  computeParameters(
    items: Item[],
    options: {
      readonly enableShortTerm: false
      readonly numRelearningSteps: 0
    },
  ): Promise<unknown> | unknown
}

/**
 * Adapts the official FSRS binding to ANITEW's runtime-independent optimizer
 * port without letting the browser runtime reinterpret measured history.
 *
 * Short-term learning and relearning steps stay disabled because ANITEW's
 * scheduler intentionally has no within-day reviews. Only the weight vector
 * returned by the binding is allowed to cross back into core, where it is
 * validated before persistence or scheduling.
 */
export function createFsrsBindingOptimizer<Review, Item>(
  binding: FsrsOptimizerBinding<Review, Item>,
): SchedulerOptimizerPort {
  return {
    async optimize(histories: readonly OptimizerItemHistory[]): Promise<unknown> {
      const items = fsrsBindingInputsOf(histories).map((input) => {
        const reviews = input.reviews.map(
          ([rating, deltaDays]) => new binding.FSRSBindingReview(rating, deltaDays),
        )
        return new binding.FSRSBindingItem(reviews)
      })

      return binding.computeParameters(items, {
        enableShortTerm: false,
        numRelearningSteps: 0,
      })
    },
  }
}
