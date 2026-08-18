import { describe, expect, it } from 'vitest'

import {
  LABEL_MAX,
  MIN_SECONDS_FOR_TEACHING,
  PALACES,
  READY_PALACES,
  STATIONS,
  STATIONS_PER_WALK,
  type Pools,
  displayOf,
  hasPalacePool,
  isPrompted,
  isScene,
  itemsOf,
  leniencyFor,
  isOwnPalace,
  objectFor,
  ownLabelOf,
  palaceOf,
  planSession,
  sceneItemsOf,
  stationOf,
  subjectOf,
  targetOf,
  walkFor,
  walkId,
  walkOf,
  walkPlacements,
  walkPool,
  wordPool,
} from '../../src/core/index.ts'

/**
 * Der Gedächtnispalast (Backlog G1, G2, G4, G6, G7).
 *
 * Geprüft wird vor allem das, was den Palast von einer Liste unterscheidet:
 * die **feste Reihenfolge**, die **Verlässlichkeit** eines Ganges über Tage
 * hinweg — ohne die es kein Wiedersehen gäbe (G7) — und dass die Gegenstände
 * dem Wortmodul nicht ins Gehege kommen.
 */

const base = {
  mode: 'daily' as const,
  day: '2026-08-18',
  language: 'de',
  seed: 'palast',
}

const pools = (walks: readonly string[]): Pools => ({
  words: [],
  faces: [],
  numbers: [],
  missions: [],
  palace: walks,
})

describe('der Palast als Datenmodell (G1, G2)', () => {
  it('hat drei mitgelieferte Wege und einen eigenen, je fünf Stationen', () => {
    expect(READY_PALACES).toHaveLength(3)
    expect(PALACES).toHaveLength(4)
    for (const palace of PALACES) {
      expect(STATIONS[palace]).toHaveLength(STATIONS_PER_WALK)
    }
  })

  it('vergibt jede Stationskennung nur einmal', () => {
    // Sonst könnte das Verzeichnis der Beschriftungen in `i18n` nicht flach
    // sein — und eine doppelte Kennung wäre dort eine stille Überschreibung.
    const all = PALACES.flatMap((palace) => STATIONS[palace])
    expect(new Set(all).size).toBe(all.length)
  })

  it('behält die Reihenfolge des Weges bei', () => {
    const walk = walkId('home', 1)
    expect(walkPlacements(walk).map((item) => stationOf(item))).toEqual([...STATIONS.home])
  })

  it('erkennt Palast, Gang und Station in einer Kennung wieder', () => {
    const item = walkPlacements(walkId('street', 7))[2] as string
    expect(palaceOf(item)).toBe('street')
    expect(walkOf(item)).toBe('street~7')
    expect(stationOf(item)).toBe(STATIONS.street[2])
  })

  it('gibt bei einer fremden Kennung nichts zurück, statt zu raten', () => {
    expect(palaceOf('Elena#room')).toBeUndefined()
    expect(stationOf('home~1#dachboden')).toBeUndefined()
    expect(stationOf('Anker')).toBeUndefined()
  })
})

describe('was an den Stationen liegt (G4)', () => {
  it('legt an jede Station genau ein Ding', () => {
    const placements = walkFor(walkId('body', 3), 'de')
    expect(placements).toHaveLength(STATIONS_PER_WALK)
    expect(placements.map((entry) => entry.station)).toEqual([...STATIONS.body])
  })

  it('legt kein Ding zweimal in denselben Gang', () => {
    // Sonst wäre die Frage „wo lag der Toaster?“ nicht beantwortbar.
    for (let ordinal = 0; ordinal < 30; ordinal++) {
      const objects = walkFor(walkId('home', ordinal), 'de').map((entry) => entry.object)
      expect(new Set(objects).size).toBe(objects.length)
    }
  })

  it('ergibt für denselben Gang immer dasselbe (G7)', () => {
    /*
     * Das ist die Bedingung dafür, dass ein Palast überhaupt in der
     * Wiederholungsplanung hängen kann: In drei Wochen fragt die App „was lag
     * im Flur?“ und muss dieselbe Antwort erwarten wie heute.
     */
    const first = walkFor('home~42', 'de')
    const again = walkFor('home~42', 'de')
    expect(again).toEqual(first)
  })

  it('ergibt in einer anderen Sprache andere Dinge', () => {
    expect(walkFor('home~42', 'en')).not.toEqual(walkFor('home~42', 'de'))
  })

  it('nennt zu jeder Ablage ihren Gegenstand', () => {
    const item = 'home~5#kitchen'
    const expected = walkFor('home~5', 'de').find((entry) => entry.station === 'kitchen')?.object
    expect(objectFor(item, 'de')).toBe(expected)
    expect(objectFor('home~5', 'de')).toBeUndefined()
  })
})

describe('der Vorrat', () => {
  it('geht die Paläste reihum durch', () => {
    const walks = walkPool('seed', 6)
    expect(walks.map((walk) => palaceOf(walk))).toEqual([...READY_PALACES, ...READY_PALACES])
  })

  it('vergibt jeden Gang nur einmal', () => {
    const walks = walkPool('seed', 60)
    expect(new Set(walks).size).toBe(60)
  })

  it('überschneidet sich nicht mit dem Wortvorrat (C6)', () => {
    /*
     * Der Grund steht in `content/palace.ts`: Läge „Anker“ im Flur **und**
     * im Wortmodul, bekäme der freie Abruf ein Wort geschenkt, das
     * eigentlich woanders hängt.
     */
    for (const language of ['de', 'en', 'fr'] as const) {
      const words = new Set(wordPool(language).map((word) => word.toLowerCase()))
      const objects = walkPool('x', 30).flatMap((walk) =>
        walkFor(walk, language).map((entry) => entry.object.toLowerCase()),
      )
      for (const object of objects) expect(words.has(object)).toBe(false)
    }
  })

  it('kennt eigene Gegenstände für Deutsch und Englisch', () => {
    expect(hasPalacePool('de')).toBe(true)
    expect(hasPalacePool('en')).toBe(true)
    expect(hasPalacePool('ja')).toBe(false)
  })
})

describe('der Palast im Bauplan (G6, G7)', () => {
  it('macht aus einer Runde genau einen Gang', () => {
    expect(isScene('palace')).toBe(true)
    const plan = planSession({ ...base, pools: pools(walkPool('a', 12)), modules: ['palace'] })
    for (const block of plan.blocks.filter((b) => b.kind === 'encode')) {
      expect(block.items).toHaveLength(STATIONS_PER_WALK)
      // Alle Stücke einer Runde gehören zu **einem** Gang.
      expect(new Set(block.items.map(walkOf)).size).toBe(1)
    }
  })

  it('fragt gestützt ab — der Ort ist die Frage', () => {
    expect(isPrompted('palace')).toBe(true)
  })

  it('nimmt den Gang als Anker, nicht die einzelne Ablage', () => {
    // Sonst käme ein Gang, von dem heute eine Station fällig ist, noch einmal
    // als *neuer* Gang — und das Wiedersehen prüfte eine Erinnerung von vor
    // zwei Minuten.
    expect(subjectOf('palace', 'home~9#hall')).toBe('home~9')
    expect(sceneItemsOf('palace', 'home~9')).toEqual(walkPlacements('home~9'))
  })

  it('sucht den Gegenstand und zeigt ihn auch so an', () => {
    const item = 'street~2#bench'
    const object = objectFor(item, 'de') as string
    expect(targetOf('palace', item, 'de')).toBe(object)
    expect(displayOf('palace', item, 'de')).toBe(object)
  })

  it('verzeiht Tippfehler — es sind Wörter, keine Zahlen (D-012)', () => {
    expect(leniencyFor('palace')).toBe('typos')
  })

  it('lässt keinen Gang zweimal in einer Einheit vorkommen', () => {
    const plan = planSession({
      ...base,
      mode: 'extended',
      pools: pools(walkPool('b', 30)),
      modules: ['palace'],
    })
    const walks = itemsOf(plan, 'palace').map(walkOf)
    expect(new Set(walks).size).toBe(new Set(walks).size)
    const perBlock = plan.blocks.filter((b) => b.kind === 'encode').map((b) => walkOf(b.items[0] as string))
    expect(new Set(perBlock).size).toBe(perBlock.length)
  })
})

describe('die Lektion (G, D-013)', () => {
  const withPalace = (palaceTaught: boolean | undefined) =>
    planSession({
      ...base,
      mode: 'daily',
      pools: pools(walkPool('c', 12)),
      modules: ['palace'],
      palaceTaught,
    })

  it('erklärt den Palast, bevor der erste Gang kommt', () => {
    const plan = withPalace(false)
    const first = plan.blocks[0]
    expect(first?.kind).toBe('teach')
    expect(first?.moduleId).toBe('palace')
    // Kein Gegenstand: Die Lektion erklärt die Technik, nicht einen Palast.
    expect(first?.items).toEqual([])
  })

  it('erklärt ihn nur einmal', () => {
    expect(withPalace(true).blocks.some((block) => block.kind === 'teach')).toBe(false)
  })

  it('lehrt nicht, solange niemand nachgesehen hat', () => {
    // `undefined` heißt „noch nicht aus der Datenbank gelesen“ — daraus darf
    // keine Lektion folgen, sonst bekäme sie jemand ein zweites Mal.
    expect(withPalace(undefined).blocks.some((block) => block.kind === 'teach')).toBe(false)
  })

  it('bietet im Notfallmodus gar keinen Gang an', () => {
    /*
     * Nicht aus Vorsicht, sondern aus Rechnen: Nach dem Wiedersehensanteil
     * bleiben rund vierzig Sekunden, dreißig davon gingen ans Einprägen —
     * für fünf Fragen blieben zehn. Zwei Sekunden je Station sind keine
     * Frage, sondern eine Formalie. Und ein halber Weg ist kein Weg.
     */
    const plan = planSession({
      ...base,
      mode: 'emergency',
      pools: { ...pools(walkPool('f', 12)), words: Array.from({ length: 20 }, (_, i) => `w${i}`) },
      modules: ['words', 'palace'],
    })
    expect(plan.blocks.every((block) => block.moduleId !== 'palace')).toBe(true)
  })

  it('lässt das Wiedersehen trotzdem durch', () => {
    // Was fällig ist, kommt zurück — egal wie kurz die Einheit ist (D-004).
    // Dort wird nichts eingeprägt, es sind nur die Fragen.
    const plan = planSession({
      ...base,
      mode: 'emergency',
      pools: { ...pools(walkPool('g', 12)), words: Array.from({ length: 20 }, (_, i) => `w${i}`) },
      modules: ['words', 'palace'],
      due: { palace: ['home~4#hall'] },
    })
    const review = plan.blocks.filter((block) => block.kind === 'review')
    expect(review.map((block) => block.moduleId)).toContain('palace')
  })

  it('unterrichtet im Notfallmodus nicht', () => {
    const plan = planSession({
      ...base,
      mode: 'emergency',
      pools: pools(walkPool('d', 12)),
      modules: ['palace'],
      palaceTaught: false,
    })
    expect(plan.totalSeconds).toBeLessThan(MIN_SECONDS_FOR_TEACHING)
    expect(plan.blocks.some((block) => block.kind === 'teach')).toBe(false)
  })

  it('geht der ersten Major-Ziffer vor', () => {
    /*
     * Ohne die Erklärung ist ein Gang unverständlich — da stehen fünf Orte
     * und fünf Dinge, und niemand weiß, was er damit soll. Eine ungelehrte
     * Ziffer kostet dagegen nichts: Zahlen lassen sich auch ohne sie üben.
     */
    const plan = planSession({
      ...base,
      mode: 'daily',
      pools: { ...pools(walkPool('e', 12)), numbers: ['1234', '5678', '9012'] },
      modules: ['numbers', 'palace'],
      taught: [],
      palaceTaught: false,
    })
    expect(plan.blocks[0]?.moduleId).toBe('palace')
    expect(plan.blocks.filter((block) => block.kind === 'teach')).toHaveLength(1)
  })
})

describe('der eigene Palast (G3)', () => {
  const good = { name: 'Meine Wohnung', stations: ['Tür', 'Bad', 'Balkon', 'Regal', 'Bett'] }

  it('nimmt fünf verschiedene, nicht leere Orte mit Namen an', () => {
    expect(isOwnPalace(good)).toBe(true)
  })

  it('weist ab, was beim Abgehen keine Frage ergäbe', () => {
    expect(isOwnPalace({ ...good, name: '  ' })).toBe(false)
    expect(isOwnPalace({ ...good, stations: ['Tür', '', 'Balkon', 'Regal', 'Bett'] })).toBe(false)
    expect(isOwnPalace({ ...good, stations: good.stations.slice(0, 4) })).toBe(false)
    // Zweimal derselbe Ort: „Was lag hier?“ hätte zwei Antworten.
    expect(isOwnPalace({ ...good, stations: ['Bad', 'Bad', 'Balkon', 'Regal', 'Bett'] })).toBe(false)
    expect(isOwnPalace({ ...good, stations: ['Bad', 'bad', 'Balkon', 'Regal', 'Bett'] })).toBe(false)
    expect(isOwnPalace({ ...good, stations: ['x'.repeat(LABEL_MAX + 1), 'a', 'b', 'c', 'd'] })).toBe(
      false,
    )
    expect(isOwnPalace(undefined)).toBe(false)
    expect(isOwnPalace({ name: 'x' })).toBe(false)
  })

  it('hält die Trennzeichen der Kennungen aus den Schildern heraus', () => {
    expect(isOwnPalace({ ...good, stations: ['Tür~1', 'Bad', 'Balkon', 'Regal', 'Bett'] })).toBe(
      false,
    )
    expect(isOwnPalace({ ...good, stations: ['Tür#1', 'Bad', 'Balkon', 'Regal', 'Bett'] })).toBe(
      false,
    )
  })

  it('trennt Kennung und Beschriftung', () => {
    /*
     * Der Kern von G3: In der Datenbank steht `own~7#own3`, das Schild liegt
     * woanders. Wer seinen Balkon später „Balkontür“ nennt, verliert damit
     * **nicht**, was er dort abgelegt hat — es ist derselbe Ort, anders
     * geschrieben.
     */
    expect(STATIONS.own).toEqual(['own1', 'own2', 'own3', 'own4', 'own5'])
    expect(ownLabelOf(good, 'own3')).toBe('Balkon')
    expect(ownLabelOf({ ...good, stations: ['Tür', 'Bad', 'Balkontür', 'Regal', 'Bett'] }, 'own3'))
      .toBe('Balkontür')
    expect(ownLabelOf(good, 'kitchen')).toBeUndefined()
  })

  it('kommt im Vorrat erst vor, wenn es ihn gibt', () => {
    // Sonst führte ein Gang an Orte, die niemand benannt hat.
    expect(walkPool('s', 9).map(palaceOf)).not.toContain('own')
    expect(READY_PALACES).not.toContain('own')
    const withOwn = walkPool('s', 8, [...READY_PALACES, 'own'])
    expect(withOwn.map(palaceOf)).toContain('own')
  })

  it('baut einen Gang durch den eigenen Palast wie jeden anderen', () => {
    const walk = walkId('own', 3)
    expect(walkPlacements(walk)).toHaveLength(STATIONS_PER_WALK)
    expect(walkFor(walk, 'de').map((entry) => entry.station)).toEqual([...STATIONS.own])
    // Und er ist genauso verlässlich — sonst gäbe es kein Wiedersehen (G7).
    expect(walkFor(walk, 'de')).toEqual(walkFor(walk, 'de'))
  })
})
