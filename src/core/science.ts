/**
 * Was belegt ist, was nur eng belegt ist, und was niemand gemessen hat
 * (Backlog F6).
 *
 * Diese Datei ist die Gegenprobe zur Messung (F1–F5). Dort sagt ANITEW, was
 * es **an dir** gezählt hat; hier sagt es, worauf sein Aufbau überhaupt
 * beruht — und an welcher Stelle das Wissen aufhört.
 *
 * ── Warum das im Kern steht und nicht im Text ─────────────────────────────
 *
 * Die Sätze für den Bildschirm stehen in `i18n`, wie überall. Was **nicht**
 * übersetzbar ist, steht hier: die Belege selbst und der Stand, den eine
 * Aussage hat. Eine Übersetzung darf einen Satz umformulieren; sie darf aus
 * „nicht belegt“ nicht „umstritten“ machen. Der Stand ist deshalb Struktur,
 * kein Text.
 *
 * ── Die Regel, die diese Liste erzwingt ───────────────────────────────────
 *
 * Zwei Bedingungen prüft `tests/core/science.test.ts` mechanisch:
 *
 * 1. Eine Aussage mit Stand `established`, `narrow` oder `unsupported` muss
 *    mindestens eine Quelle nennen. Eine Behauptung über die Studienlage ohne
 *    Studie ist genau das, was diese Seite anprangert.
 * 2. **Auf `unsupported` und `unmeasured` darf nichts gebaut sein.** `restsOn`
 *    muss dort leer sein. Damit ist die Regel nicht länger ein Vorsatz: Wer
 *    hier eine Funktion einträgt, die auf einer unbelegten Annahme steht,
 *    bekommt einen roten Test.
 *
 * ── Warum keine DOI dabeisteht ────────────────────────────────────────────
 *
 * Weil ich sie aus dem Kopf schreiben müsste. Eine um eine Ziffer falsche DOI
 * ist ein toter Link — in einer App, deren ganzer Punkt Genauigkeit ist,
 * wäre das die peinlichste Stelle überhaupt. Autor, Jahr, Titel und Journal
 * reichen, um eine Arbeit zu finden; sie sind das, was sich prüfen lässt,
 * ohne es zu erfinden (R-1).
 */

/**
 * Wie gut eine Aussage steht.
 *
 * Vier Stufen, weil drei zu grob wären: Der Unterschied zwischen „belegt“ und
 * „belegt, aber nur für genau das Geübte“ ist der wunde Punkt des ganzen
 * Genres (F4). Merktechniken *wirken* — sie wirken nur nicht auf alles.
 */
export const EVIDENCE_STANDINGS = ['established', 'narrow', 'unsupported', 'unmeasured'] as const
export type EvidenceStanding = (typeof EVIDENCE_STANDINGS)[number]

/** Eine Arbeit, auf die sich eine Aussage stützt. */
export interface Source {
  authors: string
  year: number
  title: string
  /** Journal oder Buch, mit Band und Seiten, soweit vorhanden. */
  where: string
}

export const SCIENCE_CLAIMS = [
  'spacing',
  'retrieval',
  'forgetting',
  'mnemonics',
  'brainTraining',
  'rewards',
  'everyday',
] as const
export type ScienceClaimId = (typeof SCIENCE_CLAIMS)[number]

export interface ScienceClaim {
  id: ScienceClaimId
  standing: EvidenceStanding
  sources: readonly Source[]
  /**
   * Welche Teile von ANITEW auf dieser Aussage stehen, als Backlog-Kennungen.
   *
   * Leer bei allem, was nicht belegt ist — siehe Regel 2 oben.
   */
  restsOn: readonly string[]
}

export const SCIENCE: readonly ScienceClaim[] = [
  {
    id: 'spacing',
    standing: 'established',
    restsOn: ['C1', 'C2', 'C3', 'D-004'],
    sources: [
      {
        authors: 'Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T. & Rohrer, D.',
        year: 2006,
        title: 'Distributed practice in verbal recall tasks: A review and quantitative synthesis',
        where: 'Psychological Bulletin, 132(3), 354–380',
      },
    ],
  },
  {
    id: 'retrieval',
    standing: 'established',
    restsOn: ['C5', 'B2'],
    sources: [
      {
        authors: 'Roediger, H. L. & Karpicke, J. D.',
        year: 2006,
        title: 'Test-enhanced learning: Taking memory tests improves long-term retention',
        where: 'Psychological Science, 17(3), 249–255',
      },
      {
        authors: 'Karpicke, J. D. & Roediger, H. L.',
        year: 2008,
        title: 'The critical importance of retrieval for learning',
        where: 'Science, 319(5865), 966–968',
      },
    ],
  },
  {
    id: 'forgetting',
    standing: 'established',
    restsOn: ['C1', 'D-004'],
    sources: [
      {
        authors: 'Ebbinghaus, H.',
        year: 1885,
        title: 'Über das Gedächtnis. Untersuchungen zur experimentellen Psychologie',
        where: 'Duncker & Humblot, Leipzig',
      },
      {
        authors: 'Murre, J. M. J. & Dros, J.',
        year: 2015,
        title: "Replication and analysis of Ebbinghaus' forgetting curve",
        where: 'PLoS ONE, 10(7), e0120644',
      },
    ],
  },
  {
    id: 'mnemonics',
    standing: 'narrow',
    restsOn: ['D5', 'G'],
    sources: [
      {
        authors: 'Dresler, M., Shirer, W. R., Konrad, B. N. et al.',
        year: 2017,
        title: 'Mnemonic training reshapes brain networks to support superior memory',
        where: 'Neuron, 93(5), 1227–1235',
      },
    ],
  },
  {
    id: 'brainTraining',
    standing: 'unsupported',
    restsOn: [],
    sources: [
      {
        authors: 'Owen, A. M., Hampshire, A., Grahn, J. A. et al.',
        year: 2010,
        title: 'Putting brain training to the test',
        where: 'Nature, 465(7299), 775–778',
      },
      {
        authors: 'Melby-Lervåg, M. & Hulme, C.',
        year: 2013,
        title: 'Is working memory training effective? A meta-analytic review',
        where: 'Developmental Psychology, 49(2), 270–291',
      },
      {
        authors: 'Simons, D. J., Boot, W. R., Charness, N. et al.',
        year: 2016,
        title: 'Do "brain-training" programs work?',
        where: 'Psychological Science in the Public Interest, 17(3), 103–186',
      },
    ],
  },
  {
    /*
     * Warum ANITEW keine Punkte, Level und Freischaltungen hat.
     *
     * Der Befund ist echt und alt: Erwartete äußere Belohnungen können die
     * eigene Motivation für eine Tätigkeit verdrängen, die jemand ohnehin
     * gern tut. Gemessen ist er an Aufgaben im Labor, nicht an App-Serien —
     * deshalb `narrow` und kein Wort weiter. Dass eine App **ohne** Punkte
     * besser wirkt, ist nirgends gezeigt; wer das behauptete, machte genau
     * den Fehler, den diese Seite anprangert.
     */
    id: 'rewards',
    standing: 'narrow',
    restsOn: ['K7', 'D-019'],
    sources: [
      {
        authors: 'Deci, E. L., Koestner, R. & Ryan, R. M.',
        year: 1999,
        title:
          'A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation',
        where: 'Psychological Bulletin, 125(6), 627–668',
      },
    ],
  },
  {
    /*
     * Die einzige Aussage ohne Quelle — und die ehrlichste auf der Seite.
     *
     * Ob jemand nach acht Wochen ANITEW im Alltag mehr Namen behält, hat
     * niemand gemessen: wir nicht, und für diese App auch sonst niemand. Das
     * ist keine Lücke in der Literatur, die man mit einer fremden Studie
     * stopfen dürfte — es ist eine Aussage über **dieses Programm**. Deshalb
     * steht hier nichts als das Eingeständnis (R-2).
     */
    id: 'everyday',
    standing: 'unmeasured',
    restsOn: [],
    sources: [],
  },
]

export function claimsWithStanding(standing: EvidenceStanding): readonly ScienceClaim[] {
  return SCIENCE.filter((claim) => claim.standing === standing)
}

/**
 * Die Reihenfolge auf dem Bildschirm.
 *
 * Erst, was trägt, dann die Einschränkung, dann das, was nicht belegt ist.
 * Andersherum läse sich die Seite wie eine Entschuldigung — und die Belege
 * sind ja der Grund, warum die App so gebaut ist, wie sie gebaut ist.
 */
export const STANDING_ORDER: readonly EvidenceStanding[] = [
  'established',
  'narrow',
  'unsupported',
  'unmeasured',
]

/** Wie eine Quelle in einer Zeile steht. */
export function citationOf(source: Source): string {
  return `${source.authors} (${source.year}). ${source.title}. ${source.where}.`
}
