/**
 * Der Fähigkeitsbaum (Backlog K3-Ausbau · D-019).
 *
 * Kein Baum mit gesperrten Ästen und keiner mit Punkten: Er **gruppiert
 * belegte Tatsachen nach Fähigkeit** — Dranbleiben, Abruf, Arbeitsgedächtnis,
 * Unterscheiden, Bilder, Räume, Menschen, Gemessenes. Was zutrifft,
 * steht unter seiner Fähigkeit; was nicht zutrifft, existiert nicht (K7).
 * Die „Zahl“ einer Fähigkeit ist ihre Zeilenanzahl — nichts wird gewogen,
 * nichts erfunden (R-1).
 */

import type { AchievementId } from './achievements.ts'

export const SKILL_DOMAINS = [
  'practice',
  'recall',
  'working',
  'distinguish',
  'visual',
  'spatial',
  'people',
  'measured',
] as const

export type SkillDomain = (typeof SKILL_DOMAINS)[number]

/**
 * Jede Tatsache gehört zu genau einer Fähigkeit. `practice` sammelt, was
 * übers Wiederkommen selbst spricht (Serie, Tage) — das ist eine eigene
 * Fähigkeit, und die ehrlichste von allen.
 */
export const DOMAIN_OF: Readonly<Record<AchievementId, SkillDomain>> = {
  firstReturn: 'recall',
  week: 'practice',
  fortnight: 'practice',
  hundredReturns: 'recall',
  heldOften: 'recall',
  calibrated: 'measured',
  majorLearned: 'recall',
  ownPalace: 'spatial',
  heldBackwards: 'working',
  toldApart: 'distinguish',
  sawDetails: 'visual',
  namesHeld: 'people',
}

/** Die Tatsachen einer Fähigkeit, in der festen Reihenfolge des Erreichten. */
export function domainFacts(
  domain: SkillDomain,
  reached: readonly AchievementId[],
): readonly AchievementId[] {
  return reached.filter((id) => DOMAIN_OF[id] === domain)
}
