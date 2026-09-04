/**
 * Der Kern von ANITEW.
 *
 * Reines TypeScript, kein DOM, kein React, keine Browser-Schnittstelle
 * (D-010). Er wird von `tsconfig.core.json` ein zweites Mal übersetzt — ohne
 * die DOM-Bibliothek —, damit ein Verstoß als Übersetzungsfehler auffällt und
 * nicht erst Jahre später beim Verpacken für die Stores.
 *
 * Was hierher gehört: Wiederholungsplanung, Bewertung, Sessionaufbau,
 * Gedächtnisprofil, Benchmark, Inhaltsgeneratoren, Zeitrechnung, Zufall.
 * Was nicht: alles, was ein Gerät anfasst — das steht in src/platform/ hinter
 * den Schnittstellen aus `ports.ts`.
 */

export * from './backup.ts'
export * from './backupSettings.ts'
export * from './content/associations.ts'
export * from './content/faces.ts'
/*
  `content/people.ts` steht hier bewusst NICHT: Die Personenliste wird erst
  beim Bau einer Einheit gebraucht und beim ersten Bild nicht. Über diesen
  Sammelexport käme sie in den Kaltstart (gemessen: +2,3 KB). Die Oberfläche
  lädt sie mit `await import(...)`; die Form der Karte steht in
  `content/peopleCard.ts` und darf hier stehen.
*/
export * from './content/peopleCard.ts'
export * from './content/interference.ts'
export * from './content/names.ts'
export * from './content/missions.ts'
export * from './content/numbers.ts'
export * from './content/own.ts'
export * from './content/palace.ts'
export * from './content/ownRemoved.ts'
export * from './content/gaze.ts'
export * from './content/spans.ts'
export * from './content/spatial.ts'
export * from './content/twins.ts'
export * from './content/words.ts'
export * from './install.ts'
export * from './language.ts'
export * from './memory/label.ts'
export * from './memory/memoryGraph.ts'
export * from './memory/memoryArchitect.ts'
export * from './memory/missionComposer.ts'
export * from './memory/rememberThis.ts'
export * from './memory/peopleScenario.ts'
export * from './memory/memoryPulse.ts'
export * from './memory/memoryWorld.ts'
export * from './memory/dailyMission.ts'
export * from './memory/reencounter.ts'
export * from './modes.ts'
export * from './ports.ts'
export * from './benchmark/plan.ts'
export * from './coach/advice.ts'
export * from './coach/prompt.ts'
export * from './benchmark/pool.ts'
export * from './benchmark/progress.ts'
export * from './profile/dimensions.ts'
export * from './profile/history.ts'
export * from './profile/onboarding.ts'
export * from './profile/profile.ts'
export * from './profile/trainingMix.ts'
export * from './progress/achievements.ts'
export * from './progress/footprint.ts'
export * from './progress/returns.ts'
export * from './progress/tree.ts'
export * from './progress/streak.ts'
export * from './reminders.ts'
export * from './rng.ts'
export * from './science.ts'
export * from './scheduler/due.ts'
export * from './scheduler/memory.ts'
export * from './scheduler/optimizerHistory.ts'
export * from './scheduler/optimizerCadence.ts'
export * from './scheduler/optimizedWeights.ts'
export * from './scheduler/optimizerRun.ts'
export * from './scheduler/optimizerBindingInput.ts'
export * from './session/difficulty.ts'
export * from './sync/drive.ts'
export * from './session/grading.ts'
export {
  SECONDS_PER_ITEM,
  MIN_ITEMS_PER_ROUND,
  MAX_ITEMS_PER_ROUND,
  MIN_SECONDS_FOR_TEACHING,
  MIN_SECONDS_FOR_PALACE,
  TRAINING_MODULES,
  isCognitivelyHeavy,
  isPrompted,
  entersReview,
  asksOnSight,
  SECONDS_PER_REVERSE_PROMPT,
  isScene,
  sceneItemsOf,
  secondsPerItemFor,
  subjectOf,
  targetOf,
  displayOf,
  leniencyFor,
  learnableModules,
  itemsOf,
  reviewItemsOf,
  modulesOf,
  type BlockKind,
  type ModuleId,
  type BlockPlan,
  type SessionPlan,
  type PlanInput,
  type Pools,
} from './session/plan.ts'
export { planSession } from './session/adaptivePlan.ts'
export * from './technique/encodings.ts'
export * from './technique/learn.ts'
export * from './technique/major.ts'
export * from './time.ts'
export * from './training.ts'