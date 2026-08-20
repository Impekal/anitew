import type { DimensionCounts } from '../profile/profile.ts'
import { type DimensionId, isImmediate, moduleForDimension } from '../profile/dimensions.ts'
import type { ModuleId } from '../session/plan.ts'

export type MissionReason = 'due' | 'personal' | 'undertrained' | 'interference' | 'balanced'

export interface DailyMissionDecision {
  readonly focus?: ModuleId
  readonly reason: MissionReason
  readonly modules: readonly ModuleId[]
}

const CORE_MODULES: readonly ModuleId[] = ['memory', 'facts', 'faces', 'numbers', 'words', 'missions', 'twins', 'reverse', 'palace', 'gaze']

/** Mischt reale Signale; Termine selbst bleiben vollständig bei FSRS. */
export function composeDailyMission(input: {
  seconds: number
  dueByModule: Partial<Record<ModuleId, number>>
  personalScenes: number
  untrainedPersonalItems: number
  dimensions: Partial<Record<DimensionId, DimensionCounts>>
  interferenceErrors: number
}): DailyMissionDecision {
  const dueFocus = [...CORE_MODULES]
    .filter((moduleId) => (input.dueByModule[moduleId] ?? 0) > 0)
    .sort(
      (a, b) =>
        (input.dueByModule[b] ?? 0) - (input.dueByModule[a] ?? 0) || a.localeCompare(b),
    )[0]
  let focus: ModuleId | undefined
  let reason: MissionReason = 'balanced'
  if (dueFocus !== undefined) {
    focus = dueFocus
    reason = 'due'
  } else if (input.personalScenes > 0 && input.untrainedPersonalItems > 0) {
    focus = 'memory'
    reason = 'personal'
  } else if (input.interferenceErrors >= 3 && input.seconds >= 180) {
    focus = 'twins'
    reason = 'interference'
  } else {
    const undertrainedRanked = (Object.entries(input.dimensions) as [DimensionId, DimensionCounts][])
      .filter(([id, counts]) =>
        counts.chances > 0 && !isImmediate(id) && moduleForDimension(id) !== undefined,
      )
      .sort((a, b) => a[1].chances - b[1].chances || a[0].localeCompare(b[0]))
    const undertrained =
      undertrainedRanked.length >= 2 &&
      undertrainedRanked[0]![1].chances < undertrainedRanked[1]![1].chances
        ? undertrainedRanked[0]
        : undefined
    focus = undertrained === undefined ? undefined : moduleForDimension(undertrained[0])
    if (focus !== undefined) reason = 'undertrained'
  }
  const preferred = focus === undefined ? CORE_MODULES : [focus, ...CORE_MODULES.filter((id) => id !== focus)]
  return { ...(focus === undefined ? {} : { focus }), reason, modules: preferred }
}
