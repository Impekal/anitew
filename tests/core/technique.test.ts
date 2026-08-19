import { describe, expect, it } from 'vitest'

import {
  MAJOR_PAIRS,
  TEACH_ORDER,
  helpsWith,
  lettersFor,
  majorParts,
  nextToTeach,
  taughtProgress,
} from '../../src/core/technique/major.ts'
import { walkPool } from '../../src/core/content/palace.ts'
import { MODES } from '../../src/core/modes.ts'
import {
  MIN_SECONDS_FOR_TEACHING,
  TEACH_SECONDS,
  planSession,
  type Pools,
} from '../../src/core/session/plan.ts'

describe('das Major-System (D5)', () => {
  it('gibt jeder Ziffer genau einen Eintrag', () => {
    expect(MAJOR_PAIRS).toHaveLength(10)
    expect(MAJOR_PAIRS.map((pair) => pair.digit)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    for (const pair of MAJOR_PAIRS) expect(pair.letters.length).toBeGreaterThan(0)
  })

  it('lehrt alle zehn Ziffern, jede genau einmal', () => {
    // Sonst bekäme jemand nach acht Lektionen keine mehr und wüsste nicht,
    // warum die Hälfte der Ziffern stumm bleibt.
    expect([...TEACH_ORDER].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('beginnt bei den sichtbaren Brücken', () => {
    // 1, 2, 3 hängen an der Zahl der Abstriche. Wer mit der 0 oder der 6
    // anfängt, hält die Technik für willkürlich und hört auf.
    expect(TEACH_ORDER.slice(0, 3)).toEqual([1, 2, 3])
    expect(TEACH_ORDER.slice(-2)).toEqual([0, 6])
  })

  it('nennt die nächste Ziffer und hört auf, wenn alle sitzen', () => {
    expect(nextToTeach([])).toBe(1)
    expect(nextToTeach([1, 2])).toBe(3)
    expect(nextToTeach(TEACH_ORDER)).toBeUndefined()
  })

  it('lässt sich von fremden Einträgen nicht durcheinanderbringen', () => {
    // Die Liste kommt aus den Einstellungen, und die können aus einer
    // Sicherung stammen — eine Sicherung kann alles enthalten.
    expect(nextToTeach([42, -1])).toBe(1)
    expect(taughtProgress([42, 1]).known).toBe(1)
    expect(taughtProgress(TEACH_ORDER)).toEqual({ known: 10, total: 10 })
  })

  it('schreibt nur unter die Ziffern, die schon gelehrt sind', () => {
    /*
     * Alle zehn auf einmal hinzuschreiben wäre der bequemere Weg und der
     * schlechtere: Wer eine Tabelle vorgesetzt bekommt, die er nicht kann,
     * liest sie ab, statt sie zu lernen — und übt dann Ablesen.
     */
    const parts = majorParts('4719', [1, 4])
    expect(parts.map((part) => part.digit)).toEqual(['4', '7', '1', '9'])
    expect(parts.map((part) => part.letters)).toEqual([
      lettersFor(4),
      undefined,
      lettersFor(1),
      undefined,
    ])
  })

  it('sagt, ob die Technik zu dieser Zahl schon etwas beiträgt', () => {
    // Solange nichts gelehrt ist, stünde unter der Zahl eine Reihe Punkte —
    // ein Versprechen auf etwas, das noch nicht da ist.
    expect(helpsWith('4719', [])).toBe(false)
    expect(helpsWith('4719', [2, 3])).toBe(false)
    expect(helpsWith('4719', [7])).toBe(true)
  })
})

describe('die Lektion im Plan (D5)', () => {
  // Vorrat für die längste Einheit: Acht Runden zu je acht Stücken. Zu klein
  // gewählt bricht der Planer ab, und der Test misst dann den Vorrat statt
  // die Lektion.
  const many = (prefix: string) => Array.from({ length: 80 }, (_, index) => `${prefix}${index}`)
  const pools: Pools = {
  words: many('w'),
  faces: many('f'),
  numbers: many('9'),
  missions: many('p'),
  palace: walkPool('t', 12),
  reverse: ['48293', '17546', '90287', '35761', '82154', '46029'],
  twins: ['Kirche%Kirsche', 'Mantel%Mangel', 'Fliege%Fliese', 'Karte%Kante', 'Bogen%Boden', 'Wolke%Wolle'],
  gaze: ['bild~1', 'bild~2', 'bild~3', 'bild~4', 'bild~5', 'bild~6'], facts: [], memory: [],
}
  const base = { day: '2026-08-17', language: 'de', seed: 'lektion', pools }
  const teachBlock = (plan: ReturnType<typeof planSession>) =>
    plan.blocks.find((block) => block.kind === 'teach')

  it('lehrt im Notfallmodus nicht', () => {
    /*
     * Sechzig Sekunden sind für den Fall gedacht, dass jemand zwischen Tür
     * und Angel übt. Vierzehn davon für eine Lektion wäre ein Viertel der
     * Einheit — wer es eilig hat, will trainieren und nicht unterrichtet
     * werden.
     */
    const plan = planSession({ ...base, mode: 'emergency', taught: [], modules: ['numbers'] })
    expect(teachBlock(plan)).toBeUndefined()
  })

  it('lehrt, sobald genug Zeit da ist', () => {
    const plan = planSession({ ...base, mode: 'daily', taught: [], modules: ['numbers'] })
    const block = teachBlock(plan)
    expect(block?.seconds).toBe(TEACH_SECONDS)
    expect(block?.items).toEqual(['1'])
    // Vorn, vor der ersten Runde: Eine Technik, die man nach der Übung
    // erklärt bekommt, hat man bei der Übung nicht gehabt.
    expect(plan.blocks[0]?.kind).toBe('teach')
  })

  it('hört auf zu lehren, wenn alles sitzt', () => {
    const plan = planSession({ ...base, mode: 'daily', taught: TEACH_ORDER, modules: ['numbers'] })
    expect(teachBlock(plan)).toBeUndefined()
  })

  it('lehrt nicht ohne Anlass', () => {
    /*
     * Das Major-System zu erklären und dann keine einzige Zahl zu zeigen wäre
     * Unterricht ohne Gegenstand. Kommt das Zahlenmodul heute nicht vor,
     * kommt auch die Lektion nicht.
     */
    const plan = planSession({ ...base, mode: 'daily', taught: [], modules: ['words'] })
    expect(teachBlock(plan)).toBeUndefined()
  })

  it('lehrt nicht, wenn niemand nach dem Stand gefragt hat', () => {
    // Ohne `taught` weiß der Planer nichts über den Fortschritt. Dann bei der
    // Eins anzufangen hieße, jemandem die erste Lektion ein zweites Mal zu
    // halten.
    const plan = planSession({ ...base, mode: 'daily', modules: ['numbers'] })
    expect(teachBlock(plan)).toBeUndefined()
  })

  it('nimmt die Zeit aus dem Budget und nicht dazu', () => {
    /*
     * Die Zusage aus B2 gilt auch für die Lektion: Fünf Minuten sind fünf
     * Minuten. Unterricht, der die Einheit verlängert, wäre ein gebrochenes
     * Versprechen — und zwar eines, das man erst nach vierzehn Sekunden
     * bemerkt.
     */
    for (const mode of ['short', 'daily', 'extended'] as const) {
      const plan = planSession({ ...base, mode, taught: [], modules: ['numbers'] })
      const sum = plan.blocks.reduce((total, block) => total + block.seconds, 0)
      expect(sum, mode).toBe(plan.totalSeconds)
      expect(plan.totalSeconds).toBeGreaterThanOrEqual(MIN_SECONDS_FOR_TEACHING)
    }
  })

  it('lässt die Zahlen direkt auf die Lektion folgen', () => {
    /*
     * Der erste Anlauf hat die Reihenfolge dem Zufall überlassen. Auf dem
     * Bildschirm sah man sofort, warum das falsch ist: erst das Major-System
     * erklärt, dann drei Runden Wörter — benutzen durfte man die frische
     * Technik in Runde drei. Was man nach dem Lernen nicht sofort anwendet,
     * ist am nächsten Tag wieder weg.
     */
    const plan = planSession({ ...base, mode: 'daily', taught: [], modules: ['words', 'faces', 'numbers'] })
    expect(plan.blocks[0]?.kind).toBe('teach')
    expect(plan.blocks[1]?.kind).toBe('encode')
    expect(plan.blocks[1]?.moduleId).toBe('numbers')
  })

  it('würfelt die Mischung auch dann, wenn der Wurf verworfen wird', () => {
    /*
     * Ohne Lektion entscheidet der Zufall über das Startmodul — mit Lektion
     * nicht. Der Wurf fällt trotzdem, sonst hinge die ganze folgende Mischung
     * daran, ob heute unterrichtet wird, und dieselbe Einheit sähe je nach
     * Lernstand anders aus. Geprüft an den Wörtern der Wortrunde: Sie müssen
     * dieselben sein.
     */
    const modules = ['words', 'faces', 'numbers'] as const
    const withLesson = planSession({ ...base, mode: 'daily', taught: [], modules })
    const without = planSession({ ...base, mode: 'daily', taught: TEACH_ORDER, modules })
    const wordsOf = (plan: ReturnType<typeof planSession>) =>
      plan.blocks.filter((b) => b.kind === 'encode' && b.moduleId === 'words').flatMap((b) => b.items)
    expect(wordsOf(withLesson)).toEqual(wordsOf(without))
  })

  it('zählt die Lektion zur ersten Runde und nicht als eigene', () => {
    // Sonst zählte der Kopf des Bildschirms sie mit und zeigte „Runde 0“.
    const plan = planSession({ ...base, mode: 'daily', taught: [], modules: ['numbers'] })
    expect(teachBlock(plan)?.round).toBe(1)
  })
})

describe('Geschichte und Verknüpfung im Bauplan (D5 · D-013)', () => {
  const many = (prefix: string) => Array.from({ length: 80 }, (_, index) => `${prefix}${index}`)
  const encPools: Pools = {
    words: many('w'),
    faces: many('f'),
    numbers: many('9'),
    missions: many('p'),
    palace: walkPool('e', 12),
    reverse: ['48293', '17546', '90287'],
    twins: ['Kirche%Kirsche', 'Mantel%Mangel', 'Fliege%Fliese', 'Karte%Kante'],
    gaze: ['bild~1', 'bild~2', 'bild~3'], facts: [], memory: [],
  }
  const encBase = {
    day: '2026-08-19',
    language: 'de',
    seed: 'enc',
    pools: encPools,
    taught: [] as number[],
    palaceTaught: true,
  }

  const teachOf = (plan: ReturnType<typeof planSession>) =>
    plan.blocks.find((block) => block.kind === 'teach')

  it('lehrt die Geschichte vor der ersten Major-Ziffer', () => {
    const plan = planSession({ ...encBase, mode: 'daily', storyTaught: false, linkTaught: false })
    const teach = teachOf(plan)
    expect(teach?.id).toBe('teach-story')
    // Und die erste Runde gehört dem Anwendungsmodul (D5).
    const firstEncode = plan.blocks.find((block) => block.kind === 'encode')
    expect(firstEncode?.moduleId).toBe('words')
  })

  it('lehrt danach die Verknüpfung — vor dem Gesicht', () => {
    const plan = planSession({ ...encBase, mode: 'daily', storyTaught: true, linkTaught: false })
    expect(teachOf(plan)?.id).toBe('teach-link')
    expect(plan.blocks.find((block) => block.kind === 'encode')?.moduleId).toBe('faces')
  })

  it('lässt dem Palast den Vortritt — ohne Erklärung ist ein Gang unverständlich', () => {
    const plan = planSession({
      ...encBase,
      mode: 'daily',
      palaceTaught: false,
      storyTaught: false,
      linkTaught: false,
    })
    expect(teachOf(plan)?.id).toBe('teach-palace')
  })

  it('gibt nach beiden die Bühne an die Major-Ziffern zurück', () => {
    const plan = planSession({ ...encBase, mode: 'daily', storyTaught: true, linkTaught: true })
    expect(teachOf(plan)?.id).toBe('teach-major')
  })

  it('lehrt im Notfallmodus nicht — wie jede Lektion', () => {
    const plan = planSession({ ...encBase, mode: 'emergency', storyTaught: false, linkTaught: false })
    expect(teachOf(plan)).toBeUndefined()
  })

  it('lehrt ohne Angabe nicht — dieselbe Vorsicht wie beim Palast', () => {
    const plan = planSession({ ...encBase, mode: 'daily', taught: undefined })
    expect(teachOf(plan)).toBeUndefined()
  })

  it('hält das Budget exakt, Lektion einbegriffen', () => {
    const plan = planSession({ ...encBase, mode: 'daily', storyTaught: false, linkTaught: false })
    const total = plan.blocks.reduce((sum, block) => sum + block.seconds, 0)
    expect(total).toBe(MODES.daily.seconds)
  })
})

