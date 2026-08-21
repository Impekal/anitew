/**
 * D12 — räumliches Gedächtnis als dünne Erweiterung des stabilen Sessionplaners.
 *
 * Der bestehende Planer bleibt unverändert als `planBase.ts`. Dieser Adapter
 * erweitert ausschließlich seine Modulsprache um `spatial`, erzeugt dessen
 * sprachfreien deterministischen Vorrat aus dem Session-Seed und gibt dem
 * Abruf eine exakt prüfbare Zielzelle. Reihenfolge, Zeitbudget, Reviews und
 * alle übrigen Module bleiben beim bewährten Basisplan.
 */

import { spatialCellOf, spatialPool } from '../content/spatial.ts'
import * as base from './planBase.ts'
import type { Leniency } from './grading.ts'

export * from './planBase.ts'

export const TRAINING_MODULES = [...base.TRAINING_MODULES, 'spatial'] as const
export type ModuleId = base.ModuleId | 'spatial'

export interface BlockPlan extends Omit<base.BlockPlan, 'moduleId'> {
  moduleId: ModuleId
}

export interface SessionPlan extends Omit<base.SessionPlan, 'focus' | 'blocks'> {
  focus?: ModuleId
  blocks: readonly BlockPlan[]
}

/**
 * Alle bisherigen Vorräte bleiben Pflicht. Spatial ist die einzige Ausnahme:
 * Der Vorrat ist sprachfrei und vollständig aus dem Session-Seed ableitbar,
 * deshalb darf ein Aufrufer ihn zum Testen überschreiben, muss ihn aber nicht
 * parallel zur deterministischen Wahrheit speichern.
 */
export type Pools = Readonly<base.Pools & { spatial?: readonly string[] }>

export interface PlanInput
  extends Omit<base.PlanInput, 'pools' | 'due' | 'difficulty' | 'focus' | 'modules'> {
  pools: Pools
  due?: Partial<Record<ModuleId, readonly string[]>>
  difficulty?: Partial<Record<ModuleId, -1 | 0 | 1>>
  focus?: ModuleId
  modules?: readonly ModuleId[]
}

export function isPrompted(moduleId: ModuleId): boolean {
  return moduleId === 'spatial' || base.isPrompted(moduleId as base.ModuleId)
}

export function entersReview(moduleId: ModuleId): boolean {
  return base.entersReview(moduleId as base.ModuleId)
}

export function asksOnSight(moduleId: ModuleId): boolean {
  return moduleId !== 'spatial' && base.asksOnSight(moduleId as base.ModuleId)
}

export function isCognitivelyHeavy(moduleId: ModuleId): boolean {
  return moduleId !== 'spatial' && base.isCognitivelyHeavy(moduleId as base.ModuleId)
}

export function isScene(moduleId: ModuleId): boolean {
  return moduleId !== 'spatial' && base.isScene(moduleId as base.ModuleId)
}

export function sceneItemsOf(moduleId: ModuleId, anchor: string): readonly string[] {
  return base.sceneItemsOf(moduleId as base.ModuleId, anchor)
}

export function secondsPerItemFor(moduleId: ModuleId): number {
  return moduleId === 'spatial' ? base.SECONDS_PER_ITEM : base.secondsPerItemFor(moduleId as base.ModuleId)
}

export function subjectOf(moduleId: ModuleId, item: string): string {
  return base.subjectOf(moduleId as base.ModuleId, item)
}

export function targetOf(moduleId: ModuleId, item: string, language: string): string {
  if (moduleId === 'spatial') return spatialCellOf(item) ?? item
  return base.targetOf(moduleId as base.ModuleId, item, language)
}

export function displayOf(moduleId: ModuleId, item: string, language: string): string {
  return base.displayOf(moduleId as base.ModuleId, item, language)
}

export function leniencyFor(moduleId: ModuleId, item?: string): Leniency {
  return moduleId === 'spatial' ? 'exact' : base.leniencyFor(moduleId as base.ModuleId, item)
}

export function learnableModules(
  totalSeconds: number,
  modules: readonly ModuleId[] = TRAINING_MODULES,
): readonly ModuleId[] {
  return base.learnableModules(totalSeconds, modules as readonly base.ModuleId[]) as readonly ModuleId[]
}

/**
 * Der Basisplan kann unbekannte Modulkennungen bereits generisch planen:
 * Spatial ist keine Szene, fragt nicht auf Sicht und nutzt dieselbe
 * Einprägen/Abrufen-Struktur wie Wörter. Wir geben ihm deshalb den echten
 * Spatial-Vorrat und lassen ihn Zeitbudget, Rotation und fällige Reviews wie
 * immer bauen. Nur die Typgrenze sitzt hier, an genau einer Stelle.
 */
export function planSession(input: PlanInput): SessionPlan {
  const pools = {
    ...input.pools,
    spatial: input.pools.spatial ?? spatialPool(input.seed, 40),
  }
  const plan = base.planSession({
    ...input,
    pools,
    modules: input.modules ?? TRAINING_MODULES,
  } as unknown as base.PlanInput)
  return plan as unknown as SessionPlan
}

export function itemsOf(plan: SessionPlan, moduleId?: ModuleId): string[] {
  return base.itemsOf(
    plan as unknown as base.SessionPlan,
    moduleId as base.ModuleId | undefined,
  )
}

export function reviewItemsOf(plan: SessionPlan, moduleId?: ModuleId): string[] {
  return base.reviewItemsOf(
    plan as unknown as base.SessionPlan,
    moduleId as base.ModuleId | undefined,
  )
}

export function modulesOf(plan: SessionPlan): ModuleId[] {
  return base.modulesOf(plan as unknown as base.SessionPlan) as ModuleId[]
}
