import { longestRecalledNumber } from '../core/progress/numberRecord.ts'
import { db } from './db.ts'

/**
 * K5: factual personal number record from the append-only answer log.
 *
 * Only answered events that explicitly identify the `numbers` module and
 * carry their original item id are considered. Older rows without the module
 * field or item id remain unknown and are deliberately ignored instead of
 * being reconstructed from other state.
 */
export async function loadLongestRecalledNumber(): Promise<
  { readonly digits: number; readonly itemId: string } | undefined
> {
  const answered = await db.events
    .filter((event) => event.kind === 'answered' && event.module === 'numbers')
    .toArray()

  return longestRecalledNumber(
    answered.flatMap((event) =>
      event.itemId === undefined
        ? []
        : [{ module: event.module ?? '', itemId: event.itemId, correct: event.correct === true }],
    ),
  )
}
