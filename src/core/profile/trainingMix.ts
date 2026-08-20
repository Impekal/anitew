/**
 * Phase 6.1 — persönlicher Trainingsmix.
 *
 * Das Profil darf den Plan erst verändern, wenn es wirklich etwas trägt.
 * `weakest()` verlangt deshalb bereits zwei nicht überlappende Spannen und
 * schließt Sofort-Achsen aus. Diese Datei macht aus genau dieser einen
 * belastbaren Aussage einen Modulschwerpunkt — nicht aus Rohquoten, nicht aus
 * einem Score und nicht aus einer Blackbox.
 *
 * Der eigentliche Sessionplaner kennt den Schwerpunkt schon (E5): Er gibt ihm
 * höchstens jede zweite Lernrunde und lässt fällige Wiederholungen, Lektionen,
 * Vorräte und das harte Zeitbudget unangetastet. Phase 6.1 verbindet diese
 * vorhandenen Wahrheiten zu einer einzigen, erklärbaren Entscheidung.
 */

import type { ModuleId } from '../session/plan.ts'
import { learnableModules } from '../session/plan.ts'
import { moduleForDimension } from './dimensions.ts'
import { profileOf, weakest, type DimensionCounts } from './profile.ts'
import type { DimensionId } from './dimensions.ts'

export type AdaptiveMixDecision =
  | { kind: 'balanced' }
  | { kind: 'focus'; moduleId: ModuleId; dimensionId: DimensionId }

/**
 * Entscheidet ausschließlich aus belastbarer verzögerter Gedächtnisleistung.
 *
 * - zu wenig/uneindeutige Daten -> balanced
 * - Sofort-Achsen -> werden schon von `weakest` ausgeschlossen
 * - Benchmark-Achse -> hat kein Trainingsmodul und kann daher kein Fokus sein
 * - Modul passt nicht in die gewählte Zeit -> balanced
 */
export function adaptiveTrainingMix(
  counts: Partial<Record<DimensionId, DimensionCounts>>,
  sessionSeconds: number,
): AdaptiveMixDecision {
  const dimensionId = weakest(profileOf(counts))
  if (dimensionId === undefined) return { kind: 'balanced' }

  const moduleId = moduleForDimension(dimensionId)
  if (moduleId === undefined) return { kind: 'balanced' }
  if (!learnableModules(sessionSeconds).includes(moduleId)) return { kind: 'balanced' }

  return { kind: 'focus', moduleId, dimensionId }
}
