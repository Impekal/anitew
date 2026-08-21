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

// Für unbekannte Module verwendet der stabile Basisplaner bereits die
// allgemeinen Defaults. Diese Funktionen brauchen daher nur eine breitere
// Typgrenze und keinen zusätzlichen Runtime-Wrapper.
export const entersReview = base.entersReview as (moduleId: ModuleId) => boolean
export const asksOnSight = base.asksOnSight as (moduleId: ModuleId) => boolean
export const isCognitivelyHeavy = base.isCognitivelyHeavy as (moduleId: ModuleId) => boolean
export const isScene = base.isScene as (moduleId: ModuleId) => boolean
export const sceneItemsOf = base.sceneItemsOf as (
  moduleId: ModuleId,
  anchor: string,
) => readonly string[]
export const secondsPerItemFor = base.secondsPerItemFor as (moduleId: ModuleId) => number
export const subjectOf = base.subjectOf as (moduleId: ModuleId, item: string) => string
export const displayOf = base.displayOf as (
  moduleId: ModuleId,
  item: string,
  language: string,
) => string

export function targetOf(moduleId: ModuleId, item: string, language: string): string {
  if (moduleId === 'spatial') return spatialCellOf(item) ?? item
  return base.targetOf(moduleId as base.ModuleId, item, language)
}

export function leniencyFor(moduleId: ModuleId, item?: string): Leniency {
  return moduleId === 'spatial' ? 'exact' : base.leniencyFor(moduleId as base.ModuleId, item)
}

export const learnableModules = base.learnableModules as (
  totalSeconds: number,
  modules?: readonly ModuleId[],
) => readonly ModuleId[]

export function planSession(input: PlanInput): SessionPlan {
  const pools = {
    ...input.pools,
    spatial: input.pools.spatial ?? spatialPool(input.seed, 40),
  }
  return base.planSession({
    ...input,
    pools,
    modules: input.modules ?? TRAINING_MODULES,
  } as unknown as base.PlanInput) as unknown as SessionPlan
}

export const itemsOf = base.itemsOf as (
  plan: SessionPlan,
  moduleId?: ModuleId,
) => string[]
export const reviewItemsOf = base.reviewItemsOf as (
  plan: SessionPlan,
  moduleId?: ModuleId,
) => string[]
export const modulesOf = base.modulesOf as (plan: SessionPlan) => ModuleId[]
