/**
 * Der Coach mit eigenem Schlüssel (Backlog M · D-031) — der Kürteil.
 *
 * Wer seinen eigenen Anthropic-Schlüssel hinterlegt, kann dem Coach freie
 * Fragen stellen. Der Kern baut dafür nur **Text**: die Anweisung und den
 * Zahlenkontext. Er ruft nichts auf — das Netz ist Plattformsache (D-010),
 * und die Schnittstelle dazu (`CoachPort`) ist bewusst eine einzige Frage.
 *
 * Die Anweisung trägt die Hausregeln in den Ton des Modells: nur die
 * mitgegebenen Zahlen (R-1), kein Druck (K7), keine ausgedachten
 * Gedächtnisfakten, keine vorgefertigten Merkbilder (D-013). Was der Coach
 * nicht weiß, soll er sagen.
 */

import type { DimensionId } from '../profile/dimensions.ts'
import type { ModuleId } from '../session/plan.ts'

/**
 * Was die Plattform können muss, damit der Coach sprechen kann. Eine Frage,
 * eine Antwort — Verlauf, Schlüssel und Transport gehen den Kern nichts an.
 */
export interface CoachPort {
  ask(request: CoachRequest): Promise<string>
}

export interface CoachRequest {
  readonly system: string
  readonly question: string
}

/**
 * Das Modell des Coaches. Eines, nicht wählbar: Eine Modellauswahl im Menü
 * wäre eine Frage an den Menschen, die die App beantworten kann.
 */
export const COACH_MODEL = 'claude-opus-5'

/** Länger als ein Absatz soll keine Coach-Antwort sein. */
export const COACH_MAX_TOKENS = 1024

export interface CoachContext {
  /** Trainingssprache — der Coach antwortet darin. */
  readonly language: string
  /** Serie: aktuelle Tage und beste. */
  readonly streak: { readonly current: number; readonly best: number }
  /** Je Achse: Gelegenheiten und Verlorene — die Zahlen des Profils (E3). */
  readonly counts: Readonly<
    Partial<Record<DimensionId, { readonly chances: number; readonly lost: number }>>
  >
  /** Die Verschiebungen der adaptiven Schwierigkeit (D2). */
  readonly deltas: Readonly<Partial<Record<ModuleId, -1 | 0 | 1>>>
  /** Gelernte Major-Ziffern (0..10) und ob der Palast eingerichtet ist. */
  readonly taughtDigits: number
  readonly hasPalace: boolean
}

/**
 * Die Anweisung. Deutsch, unabhängig von der Trainingssprache — sie ist für
 * das Modell, nicht für den Menschen; die Antwortsprache steht im Kontext.
 */
export function coachSystem(): string {
  return [
    'Du bist der Trainings-Coach von ANITEW, einer Gedächtnistraining-App.',
    'Regeln, ohne Ausnahme:',
    '- Stütze dich nur auf die mitgegebenen Zahlen. Erfinde keine Werte,',
    '  keine Vergleiche mit anderen Menschen, keine Diagnosen.',
    '- Kein Druck, keine Drohkulisse, kein „du musst“. Wer heute nicht',
    '  trainiert, bekommt deswegen keinen schlechteren Ton.',
    '- Kein unbelegtes Lob. „Gut gemacht“ nur, wenn eine Zahl es trägt.',
    '- Gib keine vorgefertigten Merkbilder vor; erkläre Techniken so, dass',
    '  die Person ihr eigenes Bild baut.',
    '- Wenn du etwas nicht aus den Zahlen weißt, sage das.',
    '- Antworte kurz: ein bis zwei Absätze, keine Listen ohne Not.',
    '- Antworte in der Sprache, die im Kontext als Trainingssprache steht.',
  ].join('\n')
}

/**
 * Der Zahlenkontext als schlichter Text vor der Frage. Nur was da ist:
 * Achsen ohne Zahlen tauchen nicht auf (K7 gilt auch gegenüber dem Modell —
 * was fehlt, wird nicht als Null verkleidet).
 */
export function coachQuestion(context: CoachContext, question: string): string {
  const lines: string[] = [
    `Trainingssprache: ${context.language}`,
    `Serie: ${context.streak.current} Tage in Folge, beste ${context.streak.best}`,
  ]

  for (const [dimension, counts] of Object.entries(context.counts)) {
    if (counts === undefined || counts.chances === 0) continue
    lines.push(
      `Achse ${dimension}: ${counts.chances} Gelegenheiten, ${counts.lost} verloren`,
    )
  }

  for (const [moduleId, delta] of Object.entries(context.deltas)) {
    if (delta === undefined || delta === 0) continue
    lines.push(`Modul ${moduleId}: Rundengröße ${delta > 0 ? 'ein Stück größer' : 'ein Stück kleiner'} (adaptiv)`)
  }

  if (context.taughtDigits > 0) lines.push(`Major-System: ${context.taughtDigits} von 10 Ziffern gelernt`)
  if (context.hasPalace) lines.push('Eigener Gedächtnispalast: eingerichtet')

  return `${lines.join('\n')}\n\nFrage: ${question}`
}
