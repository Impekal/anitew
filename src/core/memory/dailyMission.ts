import type { DimensionCounts } from '../profile/profile.ts'
import { type DimensionId, isImmediate, moduleForDimension } from '../profile/dimensions.ts'
import type { ModuleId } from '../session/plan.ts'

export type MissionReason = 'due' | 'personal' | 'undertrained' | 'interference' | 'balanced'

/**
 * Eine belegbare Ursache dafür, dass ein Modul heute früher in der Rotation
 * auftaucht. Kein Score: `amount` ist immer eine bereits vorhandene Zählung
 * (fällige Items, neue persönliche Items, Interferenzfehler oder echte
 * Trainingsgelegenheiten).
 */
export interface MissionSignal {
  readonly moduleId: ModuleId
  readonly reason: Exclude<MissionReason, 'balanced'>
  readonly amount: number
}

export interface DailyMissionDecision {
  readonly focus?: ModuleId
  readonly reason: MissionReason
  readonly modules: readonly ModuleId[]
  readonly signals: readonly MissionSignal[]
}

const CORE_MODULES: readonly ModuleId[] = ['memory', 'facts', 'faces', 'numbers', 'words', 'missions', 'twins', 'reverse', 'palace', 'gaze']

const REASON_ORDER: Readonly<Record<Exclude<MissionReason, 'balanced'>, number>> = {
  due: 0,
  personal: 1,
  interference: 2,
  undertrained: 3,
}

/** Mischt reale Signale; Termine selbst bleiben vollständig bei FSRS. */
export function composeDailyMission(input: {
  seconds: number
  dueByModule: Partial<Record<ModuleId, number>>
  personalScenes: number
  untrainedPersonalItems: number
  dimensions: Partial<Record<DimensionId, DimensionCounts>>
  interferenceErrors: number
}): DailyMissionDecision {
  const signals: MissionSignal[] = []

  // FSRS-Fälligkeit ist nicht nur ein einzelner Sieger: Wenn heute mehrere
  // Module etwas zurückbringen, stehen sie alle vor rein neuem Stoff. Die
  // Anzahl ist dieselbe echte Fälligkeitszählung, die der Scheduler liefert.
  for (const moduleId of CORE_MODULES) {
    const count = input.dueByModule[moduleId] ?? 0
    if (count > 0) signals.push({ moduleId, reason: 'due', amount: count })
  }

  // Persönlicher Stoff bekommt nur dann Vorrang, wenn es sowohl eine
  // trainierbare Szene als auch bestätigten Stoff ohne Training gibt.
  if (input.personalScenes > 0 && input.untrainedPersonalItems > 0) {
    signals.push({ moduleId: 'memory', reason: 'personal', amount: input.untrainedPersonalItems })
  }

  // Interferenz ist ein beobachtetes Fehlermuster, aber in 60 Sekunden wäre
  // eine zusätzliche Twins-Priorität zu teuer. Dieselbe Zeitgrenze wie Phase 2.
  if (input.interferenceErrors >= 3 && input.seconds >= 180) {
    signals.push({ moduleId: 'twins', reason: 'interference', amount: input.interferenceErrors })
  }

  // „Untertrainiert“ bedeutet weiterhin nur: mindestens zwei vergleichbare
  // verzögerte Achsen haben echte Gelegenheiten, und eine hat strikt weniger.
  // Null ist fehlende Evidenz; Sofort-Achsen sind keine Langzeitlücke.
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
  if (undertrained !== undefined) {
    const moduleId = moduleForDimension(undertrained[0])
    if (moduleId !== undefined) {
      signals.push({ moduleId, reason: 'undertrained', amount: undertrained[1].chances })
    }
  }

  /*
   * Ein Modul kann mehrere Gründe haben (z. B. persönliche Erinnerung UND
   * heute fällig). Für die Reihenfolge zählt sein stärkster Grund nach der
   * expliziten Produktpriorität, nicht die Summe irgendwelcher Gewichte.
   * Innerhalb derselben Ursache entscheidet die vorhandene Zahl, dann stabil
   * die Modulkennung. Damit bleibt die Entscheidung vollständig erklärbar.
   */
  const strongestByModule = new Map<ModuleId, MissionSignal>()
  for (const signal of signals) {
    const existing = strongestByModule.get(signal.moduleId)
    if (
      existing === undefined ||
      REASON_ORDER[signal.reason] < REASON_ORDER[existing.reason] ||
      (REASON_ORDER[signal.reason] === REASON_ORDER[existing.reason] && signal.amount > existing.amount)
    ) {
      strongestByModule.set(signal.moduleId, signal)
    }
  }

  const ranked = [...strongestByModule.values()].sort((a, b) => {
    const priority = REASON_ORDER[a.reason] - REASON_ORDER[b.reason]
    if (priority !== 0) return priority
    // Bei FSRS und beobachteten Fehlern heißt mehr tatsächlich „mehr davon
    // steht an“. Bei untertrainiert bedeutet die kleinere Zahl stärkere Lücke.
    const amount =
      a.reason === 'undertrained'
        ? a.amount - b.amount
        : b.amount - a.amount
    return amount !== 0 ? amount : a.moduleId.localeCompare(b.moduleId)
  })

  const headline = ranked[0]
  const preferred = [
    ...ranked.map((signal) => signal.moduleId),
    ...CORE_MODULES.filter((moduleId) => !strongestByModule.has(moduleId)),
  ]

  return {
    ...(headline === undefined ? {} : { focus: headline.moduleId }),
    reason: headline?.reason ?? 'balanced',
    modules: preferred,
    signals: [...signals].sort((a, b) =>
      REASON_ORDER[a.reason] - REASON_ORDER[b.reason] ||
      a.moduleId.localeCompare(b.moduleId),
    ),
  }
}
