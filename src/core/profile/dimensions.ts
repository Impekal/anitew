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
 * ── Jede Achse hat eine Quelle ────────────────────────────────────────────
 *
 * Lange stand hier, warum Achsen leer bleiben. Seit dem Bild-Modul (Achse
 * „Visuell“) hat jede der neun eine echte Quelle — der Fall `none` bleibt
 * im Code, weil die nächste Achse ohne Modul wieder ehrlich „nicht
 * gemessen“ sagen soll statt einen leeren Balken zu zeigen (D-016).
 *
 * **Räumlich** kommt seit D12 aus einer eigenen 3×3-Positionsaufgabe. Der
 * Gedächtnispalast bleibt eine Technik zum Binden von Dingen an Orte; ihn als
 * Messgerät für allgemeines räumliches Erinnern zu verwenden wäre eine
 * bequemere, aber andere Aussage.
 *
 * **Aufmerksamkeit** zählt seit den Zwillingen (C6/D-027) das, was ihr Name
 * in der Anzeige sagt: Ähnliches auseinanderhalten — Wiedersehen nach
 * Tagen, dieselbe Währung wie die anderen Modul-Achsen.
 *
 * **Arbeitsgedächtnis** ist der zweite Sonderfall (D7 · D-026): Es zählt
 * nicht Wiedersehen nach Tagen, sondern **sofortige** Antworten — behalten
 * und gleichzeitig umbauen ist seinem Wesen nach eine Sache des Moments.
 * Ein „Wiedersehen“ gäbe es dort gar nicht (nichts wird eingeplant), und
 * die Achse sagt in der Anzeige dazu, was sie zählt.
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
 * - `module` — aus den Terminen dieses Moduls (Wiedersehen nach Tagen).
 * - `immediate` — aus den sofortigen Antworten dieses Moduls (D-026);
 *   Termine gibt es dort nicht, weil nichts eingeplant wird.
 * - `benchmark` — aus der Messung, nicht aus dem Training (F1).
 * - `none` — es gibt nichts, was sie misst.
 */
export type DimensionSource =
  | { kind: 'module'; moduleId: ModuleId }
  | { kind: 'immediate'; moduleId: ModuleId }
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
  spatial: { kind: 'module', moduleId: 'spatial' },
  binding: { kind: 'module', moduleId: 'missions' },
  visual: { kind: 'module', moduleId: 'gaze' },
  attention: { kind: 'module', moduleId: 'twins' },
  working: { kind: 'immediate', moduleId: 'reverse' },
  longTerm: { kind: 'benchmark' },
}

/** Das Modul, aus dem eine Achse ihre Zahlen zieht. */
export function moduleForDimension(id: DimensionId): ModuleId | undefined {
  const source = SOURCES[id]
  return source.kind === 'module' || source.kind === 'immediate' ? source.moduleId : undefined
}

/** Die Achse, die zu einem Modul gehört. */
export function dimensionOf(moduleId: ModuleId): DimensionId | undefined {
  return DIMENSIONS.find((id) => {
    const source = SOURCES[id]
    return (source.kind === 'module' || source.kind === 'immediate') && source.moduleId === moduleId
  })
}

/** Zählt diese Achse sofortige Antworten statt Wiedersehen? (D-026) */
export function isImmediate(id: DimensionId): boolean {
  return SOURCES[id].kind === 'immediate'
}
