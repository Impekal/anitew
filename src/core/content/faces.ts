/** Locally bundled photographs. The names are fictional training labels.
 * The fixed mapping keeps encode, recall and later reviews consistent.
 * Image sources and rights are recorded in public/portraits/manifest.json.
 * Unknown imported names deliberately receive no unrelated person's photo.
 */
import { PORTRAIT_IDS } from './portraitAssignments.ts'

export interface Face {
  readonly id: string
  readonly src: string
}

export function faceFor(name: string): Face | undefined {
  if (!Object.hasOwn(PORTRAIT_IDS, name)) return undefined
  const id = PORTRAIT_IDS[name] as string
  return { id, src: `/portraits/pexels-${id}.webp` }
}
