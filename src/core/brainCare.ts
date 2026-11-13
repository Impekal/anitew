import { seedFrom } from './rng.ts'
import type { EvidenceStanding, Source } from './science.ts'
import type { DayKey } from './time.ts'

/**
 * Geistig aktiv bleiben (Gerätewunsch 31.08.).
 *
 * Gewünscht war ein Bereich mit praktischen Tipps fürs Gehirn — Ernährung,
 * Schlaf, das Gehirn beanspruchen statt alles der KI zu überlassen —, dazu
 * die Frage: „explizit gegen Demenz oder zum Vorbeugen?"
 *
 * ── Warum der Bereich nicht „Demenzvorsorge" heißt ────────────────────────
 *
 * Weil dieselbe App auf ihrer Wissenschaftsseite stehen hat, dass
 * Gehirnjogging nicht allgemein klüger macht (`science.ts`, `brainTraining`).
 * Ein Bereich, der zwei Bildschirme weiter Vorsorge verspricht, würde diese
 * Seite zur Fassade machen. Was sich sagen lässt, ist schwächer und
 * trotzdem nützlich: **Ein paar Gewohnheiten hängen mit kognitiver
 * Gesundheit zusammen — auf Bevölkerungsebene, mit unterschiedlich gutem
 * Beleg, und keine davon ist ein Schutzschild für einen einzelnen Menschen.**
 * Genau so steht es hier, und ein Test hält es fest: Wer je „schützt vor
 * Demenz" schreibt, bekommt Rot (`tests/core/brainCare.test.ts`).
 *
 * ── Warum dieselbe Skala wie die Wissenschaftsseite ───────────────────────
 *
 * Ein Tipp ohne Belegstand wäre ein Ratschlag wie jeder andere im Internet.
 * Mit Stand ist er eine Auskunft: „gut belegt" trägt anders als „belegt,
 * aber nur dafür" — und „nicht gemessen" ist eine ehrliche Antwort, keine
 * Lücke. Die Quellen tragen Autor, Jahr, Titel und Ort, keine DOI: Eine um
 * eine Ziffer falsche DOI wäre ein toter Link (dieselbe Begründung wie in
 * `science.ts`).
 */

export const BRAIN_TIP_IDS = ['sleep', 'move', 'risk', 'food', 'think', 'social'] as const
export type BrainTipId = (typeof BRAIN_TIP_IDS)[number]

export interface BrainTip {
  id: BrainTipId
  standing: EvidenceStanding
  sources: readonly Source[]
}

export const BRAIN_TIPS: readonly BrainTip[] = [
  {
    id: 'sleep',
    standing: 'established',
    sources: [
      {
        authors: 'Rasch, B. & Born, J.',
        year: 2013,
        title: "About sleep's role in memory",
        where: 'Physiological Reviews, 93(2), 681–766',
      },
      {
        authors: 'Diekelmann, S. & Born, J.',
        year: 2010,
        title: 'The memory function of sleep',
        where: 'Nature Reviews Neuroscience, 11(2), 114–126',
      },
    ],
  },
  {
    id: 'move',
    standing: 'narrow',
    sources: [
      {
        authors: 'Northey, J. M., Cherbuin, N., Pumpa, K. L., Smee, D. J. & Rattray, B.',
        year: 2018,
        title:
          'Exercise interventions for cognitive function in adults older than 50: a systematic review with meta-analysis',
        where: 'British Journal of Sports Medicine, 52(3), 154–160',
      },
    ],
  },
  {
    id: 'risk',
    standing: 'established',
    sources: [
      {
        authors: 'Livingston, G. et al.',
        year: 2020,
        title: 'Dementia prevention, intervention, and care: 2020 report of the Lancet Commission',
        where: 'The Lancet, 396(10248), 413–446',
      },
    ],
  },
  {
    id: 'food',
    standing: 'unsupported',
    sources: [
      {
        authors: 'Barnes, L. L. et al.',
        year: 2023,
        title: 'Trial of the MIND diet for prevention of cognitive decline in older persons',
        where: 'New England Journal of Medicine, 389(7), 602–611',
      },
    ],
  },
  {
    id: 'think',
    standing: 'narrow',
    sources: [
      {
        authors: 'Sparrow, B., Liu, J. & Wegner, D. M.',
        year: 2011,
        title:
          'Google effects on memory: Cognitive consequences of having information at our fingertips',
        where: 'Science, 333(6043), 776–778',
      },
    ],
  },
  {
    id: 'social',
    standing: 'narrow',
    sources: [
      {
        authors: 'Kuiper, J. S. et al.',
        year: 2015,
        title:
          'Social relationships and risk of dementia: A systematic review and meta-analysis of longitudinal cohort studies',
        where: 'Ageing Research Reviews, 22, 39–57',
      },
    ],
  },
]

/**
 * Der Tipp des Tages — an einem Tag immer derselbe.
 *
 * Aus dem Datum abgeleitet und nicht gewürfelt: Wer die App dreimal am Tag
 * öffnet, soll nicht dreimal etwas anderes lesen; „einmal am Tag" wäre sonst
 * eine Lüge. Über die Woche wechselt er, weil der Tagesschlüssel wechselt.
 * Dieselbe deterministische Quelle wie überall sonst (A11).
 */
export function tipOfDay(day: DayKey | string): BrainTipId {
  const index = seedFrom(`brain-tip:${day}`) % BRAIN_TIP_IDS.length
  return BRAIN_TIP_IDS[index] as BrainTipId
}
