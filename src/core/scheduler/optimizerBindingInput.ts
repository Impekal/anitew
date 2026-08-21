import { type OptimizerItemHistory } from './optimizerHistory.ts'

/**
 * Stable, runtime-neutral representation of the constructor arguments expected
 * by the official FSRS browser binding: FSRSBindingReview(rating, deltaDays).
 *
 * Keeping this conversion in core prevents the public-beta WASI adapter from
 * inventing ratings or reinterpreting ANITEW's verified review history.
 */
export type FsrsBindingReviewInput = readonly [rating: 1 | 3, deltaDays: number]

export interface FsrsBindingItemInput {
  readonly itemId: string
  readonly reviews: readonly FsrsBindingReviewInput[]
}

export function fsrsBindingInputsOf(
  histories: readonly OptimizerItemHistory[],
): readonly FsrsBindingItemInput[] {
  return histories.map((history) => ({
    itemId: history.itemId,
    reviews: history.reviews.map(
      (review) => [review.rating, review.deltaDays] as const,
    ),
  }))
}
