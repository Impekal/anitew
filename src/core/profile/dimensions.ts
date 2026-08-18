/**
 * Die Achsen des Gedächtnisprofils (Backlog E2, E3, E7).
 *
 * E1 hieß im Backlog „Erstdiagnose — YOUR MEMORY DNA“: ein kurzer, spielbarer
 * Test am Anfang, aus dem ein Profil fällt. **Das wird hier nicht gebaut**,
 * und der Grund steht direkt daneben in E7: „82 nach drei Aufgaben wäre eine
 * erfundene Zahl.“ Ein Profil aus drei Minuten Erstkontakt ist genau das —
 * und es wäre die eindrucksvollste erfundene Zahl der ganzen App, weil es
 * aussieht wie ein Befund über einen Menschen (D-021).
 *
 * Das Profil wächst stattdessen **aus dem Training selbst**: Jede Achse steht
 * erst da, wenn genug wirklich Gemessenes hinter ihr liegt.
 *
 * ── Was eine Achse misst ──────────────────────────────────────────────────
 *
 * **Nur verzögerten Abruf.** Wie gut jemand am selben Tag abschneidet, ist
 * der Trainingsscore — und den als Gedächtnisleistung auszugeben ist genau
 * die Vermischung, gegen die F1 geschrieben ist. Gezählt wird deshalb, was
 * beim **Wiedersehen** passiert:
 *
 *   Gelegenheiten = wie oft etwas nach seinem ersten Tag zurückkam
 *   Verloren      = wie oft es dabei weg war
 *
 * Beide Zahlen stehen exakt in den Terminen: `reviews - 1` und `lapses`. Ein
 * Fehlschlag am Lerntag zählt bei beiden nicht mit — dort ist die Information
 * noch im Lernen und nicht im Behalten.
 *
 * ── Warum drei Achsen leer bleiben ────────────────────────────────────────
 *
 * E2 nennt acht Dimensionen. Für **Visuell**, **Aufmerksamkeit** und
 * **Arbeitsgedächtnis** gibt es in ANITEW kein Modul, das sie misst — also
 * steht dort nichts. Nicht „noch keine Daten“ mit einem hoffnungsvollen
 * Balken daneben, sondern: **nicht gemessen.** Dieselbe Ehrlichkeit wie auf
 * der Wissenschaftsseite (D-016).
 *
 * **Langfristiger Abruf** ist ein Sonderfall: Er wird gemessen — aber von der
 * Messung (M3) und nicht vom Training. Ihn hier noch einmal aus
 * Trainingsdaten zu schätzen hieße, zwei Zahlen über dasselbe zu haben, und
 * die eine wäre die schlechtere. Die Achse verweist deshalb dorthin (F1).
 */

import type { ModuleId } from '../session/plan.ts'

export const DIMENSIONS = [
  'words',
  'faces',
  'numbers',
  'spatial',
  'binding',
  'visual',
  'attention',
  'working',
  'longTerm',
] as const
export type DimensionId = (typeof DIMENSIONS)[number]

/**
 * Woher eine Achse ihre Zahlen bekommt.
 *
 * - `module` — aus den Terminen dieses Moduls.
 * - `benchmark` — aus der Messung, nicht aus dem Training (F1).
 * - `none` — es gibt nichts, was sie misst.
 */
export type DimensionSource =
  | { kind: 'module'; moduleId: ModuleId }
  | { kind: 'benchmark' }
  | { kind: 'none' }

/**
 * Die Zuordnung.
 *
 * **Zusammenhänge** (`binding`) steht nicht in der Liste aus E2 und ist
 * trotzdem dabei: Eine Mission übt, dass Zimmer, Gegenstand, Uhrzeit und Ort
 * **zu einer Person gehören** (D-014). Das ist eine eigene Fähigkeit und die
 * alltagsnächste von allen — sie unter „Namen & Gesichter“ zu verbuchen wäre
 * bequem und falsch.
 */
export const SOURCES: Readonly<Record<DimensionId, DimensionSource>> = {
  words: { kind: 'module', moduleId: 'words' },
  faces: { kind: 'module', moduleId: 'faces' },
  numbers: { kind: 'module', moduleId: 'numbers' },
  spatial: { kind: 'module', moduleId: 'palace' },
  binding: { kind: 'module', moduleId: 'missions' },
  visual: { kind: 'none' },
  attention: { kind: 'none' },
  working: { kind: 'none' },
  longTerm: { kind: 'benchmark' },
}

/** Die Achse, die zu einem Modul gehört. */
export function dimensionOf(moduleId: ModuleId): DimensionId | undefined {
  return DIMENSIONS.find((id) => {
    const source = SOURCES[id]
    return source.kind === 'module' && source.moduleId === moduleId
  })
}
