/**
 * H6 — adaptive Missionsschwierigkeit als dünner Adapter um den stabilen
 * Sessionplaner.
 *
 * Der Basisplan bleibt die einzige Quelle für Reihenfolge, Vorräte, Reviews
 * und Zeitbudgets. H6 verschiebt innerhalb einer Missionsrunde nur Sekunden
 * vom Abruf zum Einprägen oder zurück. Dadurch bleiben alle fünf Fakten,
 * IDs, Seeds und Wiederholungen exakt dieselben.
 */

import { missionSecondsPerFact } from './difficulty.ts'
import {
  planSession as basePlanSession,
  type BlockPlan,
  type PlanInput,
  type SessionPlan,
} from './plan.ts'

export function planSession(input: PlanInput): SessionPlan {
  const plan = basePlanSession(input)
  const delta = input.difficulty?.missions ?? 0
  if (delta === 0) return plan

  const shifts = new Map<number, number>()
  for (const block of plan.blocks) {
    if (block.moduleId !== 'missions' || block.kind !== 'encode') continue
    const desired = block.items.length * missionSecondsPerFact(delta)
    shifts.set(block.round, desired - block.seconds)
  }
  if (shifts.size === 0) return plan

  const blocks: BlockPlan[] = plan.blocks.map((block) => {
    const shift = shifts.get(block.round)
    if (shift === undefined || block.moduleId !== 'missions') return block

    if (block.kind === 'encode') {
      return { ...block, seconds: block.seconds + shift }
    }
    if (block.kind === 'recall') {
      const seconds = block.seconds - shift
      if (seconds <= 0) {
        throw new RangeError('Adaptive Missionszeit lässt keinen Abruf mehr zu')
      }
      return { ...block, seconds }
    }
    return block
  })

  return { ...plan, blocks }
}
