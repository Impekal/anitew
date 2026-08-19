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
export * from './content/faces.ts'
export * from './content/names.ts'
export * from './content/missions.ts'
export * from './content/numbers.ts'
export * from './content/palace.ts'
export * from './content/gaze.ts'
export * from './content/spans.ts'
export * from './content/twins.ts'
export * from './content/words.ts'
export * from './install.ts'
export * from './language.ts'
export * from './modes.ts'
export * from './ports.ts'
export * from './benchmark/plan.ts'
export * from './benchmark/pool.ts'
export * from './benchmark/progress.ts'
export * from './profile/dimensions.ts'
export * from './profile/onboarding.ts'
export * from './profile/profile.ts'
export * from './progress/achievements.ts'
export * from './progress/returns.ts'
export * from './progress/streak.ts'
export * from './reminders.ts'
export * from './rng.ts'
export * from './science.ts'
export * from './scheduler/due.ts'
export * from './scheduler/memory.ts'
export * from './session/grading.ts'
export * from './session/plan.ts'
export * from './technique/encodings.ts'
export * from './technique/major.ts'
export * from './time.ts'
export * from './training.ts'
