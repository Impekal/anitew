import { spatialCellOf, spatialPool } from '../content/spatial.ts'
import * as base from './planBase.ts'
import type { Leniency } from './grading.ts'

export * from './planBase.ts'

export const TRAINING_MODULES = [...base.TRAINING_MODULES, 'spatial', 'associative'] as const
export type ModuleId = base.ModuleId | 'spatial' | 'associative'

export interface BlockPlan extends Omit<base.BlockPlan, 'moduleId'> {
  moduleId: ModuleId
}

export interface SessionPlan extends Omit<base.SessionPlan, 'focus' | 'blocks'> {
  focus?: ModuleId
  blocks: readonly BlockPlan[]
}

export type Pools = Readonly<
  base.Pools & {
    spatial?: readonly string[]
    associative?: readonly string[]
  }
>

export interface PlanInput
  extends Omit<base.PlanInput, 'pools' | 'due' | 'difficulty' | 'focus' | 'modules'> {
  pools: Pools
  due?: Partial<Record<ModuleId, readonly string[]>>
  difficulty?: Partial<Record<ModuleId, -1 | 0 | 1>>
  focus?: ModuleId
  modules?: readonly ModuleId[]
}

function associationBase(item: string, language: string): string {
  const source = item.endsWith('~person') ? item.slice(0, -7) : ''
  return source && base.targetOf('missions', source, language) !== source ? source : ''
}

export function isPrompted(moduleId: ModuleId): boolean {
  return moduleId === 'spatial' || moduleId === 'associative' || base.isPrompted(moduleId as base.ModuleId)
}

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

export function displayOf(moduleId: ModuleId, item: string, language: string): string {
  if (moduleId === 'associative') {
    const source = associationBase(item, language)
    return source ? base.targetOf('missions', source, language) : item
  }
  return base.displayOf(moduleId as base.ModuleId, item, language)
}

export function targetOf(moduleId: ModuleId, item: string, language: string): string {
  if (moduleId === 'spatial') return spatialCellOf(item) ?? item
  if (moduleId === 'associative') {
    const source = associationBase(item, language)
    return source ? base.subjectOf('missions', source) : item
  }
  return base.targetOf(moduleId as base.ModuleId, item, language)
}

export function leniencyFor(moduleId: ModuleId, item?: string): Leniency {
  if (moduleId === 'spatial') return 'exact'
  if (moduleId === 'associative') return 'typos'
  return base.leniencyFor(moduleId as base.ModuleId, item)
}

export function learnableModules(
  totalSeconds: number,
  modules: readonly ModuleId[] = TRAINING_MODULES,
): readonly ModuleId[] {
  return base.learnableModules(totalSeconds, modules as readonly base.ModuleId[]) as readonly ModuleId[]
}

export function planSession(input: PlanInput): SessionPlan {
  const associative =
    input.pools.associative ??
    (input.pools.missions ?? [])
      .flatMap((person) => base.sceneItemsOf('missions', person))
      .map((item) => `${item}~person`)
  const pools = {
    ...input.pools,
    spatial: input.pools.spatial ?? spatialPool(input.seed, 40),
    associative,
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
