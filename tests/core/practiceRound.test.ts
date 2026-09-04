import { describe, expect, it } from 'vitest'

import { namePool } from '../../src/core/content/names.ts'
import { numberPool } from '../../src/core/content/numbers.ts'
import { READY_PALACES, walkPool } from '../../src/core/content/palace.ts'
import { wordPool } from '../../src/core/content/words.ts'
import { itemsOf, modulesOf, planSession, reviewItemsOf } from '../../src/core/session/plan.ts'
import { LEARN_TOPICS, learnModuleOf } from '../../src/core/technique/learn.ts'

/**
 * Die Übungsrunde aus dem Lernbereich (Nutzerbefund 04.09.).
 *
 * Zugesagt war wörtlich: „die Übungseite öffnen (wo nur Dinge zur
 * ausgewählten Methode angeboten werden)." Das ist eine Zusage über den
 * **Inhalt** der Runde. Der E2E-Test prüft sie am Bildschirm — aber nur für
 * eine der vier Methoden und nur ohne offene Termine.
 *
 * Hier steht der Rest: alle vier Methoden, alle drei Längen, und dazu der
 * Fall, der die Zusage am ehesten still bräche — es sind Wörter, Gesichter
 * und Zahlen fällig, während jemand eine einzelne Methode üben will.
 *
 * Diese Datei war beim Schreiben grün. Sie beweist keine Behebung, sie hält
 * eine Zusage fest. Damit sie nicht eines Tages leer prüft und trotzdem grün
 * bleibt, steht die Gegenprobe im Test selbst: Ohne die Einschränkung müssen
 * die fremden Fälligkeiten wirklich auftauchen.
 */

const seed = '2026-09-04:short:1'

const pools = {
  words: wordPool('de'),
  faces: namePool('de'),
  numbers: numberPool(seed, 60),
  missions: namePool('de'),
  palace: walkPool(
    seed,
    30,
    READY_PALACES.map((id) => ({ id, stationIds: [] })),
  ),
  reverse: [],
  twins: [],
  gaze: [],
  facts: [],
  memory: [],
  people: [],
}

// Fällig ist etwas aus drei anderen Modulen — genau das, was sich in eine
// Übungsrunde hineinschmuggeln könnte.
const due = {
  words: ['words~Anker', 'words~Bogen'],
  faces: ['faces~Elena'],
  numbers: ['numbers~4711'],
}

const plane = (extra: Record<string, unknown>) =>
  planSession({
    mode: 'short',
    day: '2026-09-04',
    language: 'de',
    seed,
    pools,
    due,
    taught: [],
    palaceTaught: false,
    storyTaught: false,
    linkTaught: false,
    majorMethodTaught: false,
    ...extra,
  } as never)

describe('die Übungsrunde einer einzelnen Methode', () => {
  it('mischt ohne Einschränkung sehr wohl — sonst prüfte das Folgende nichts', () => {
    const frei = plane({})
    expect(modulesOf(frei).length).toBeGreaterThan(1)
    expect(reviewItemsOf(frei).filter((item) => !item.startsWith('numbers~')).length)
      .toBeGreaterThan(0)
  })

  for (const topic of LEARN_TOPICS) {
    const modul = learnModuleOf(topic)
    for (const mode of ['emergency', 'short', 'daily'] as const) {
      it(`hält bei „${topic}" (${mode}) genau diese Methode — und ist nicht leer`, () => {
        const plan = plane({ mode, focus: modul, modules: [modul] })
        /*
         * Zwei Dinge zugleich: Auf einem frischen Gerät darf die Runde nicht
         * am leeren Vorrat scheitern (der Planer wirft bei einem erzwungenen
         * Einzelmodul bewusst, statt still zu ersetzen) — und sie darf nichts
         * Fremdes enthalten, auch keine fremde Wiederholung.
         */
        expect(itemsOf(plan).length, 'die Runde ist leer').toBeGreaterThan(0)
        expect(modulesOf(plan)).toEqual([modul])
        expect(reviewItemsOf(plan).filter((item) => !item.startsWith(`${modul}~`)))
          .toEqual([])
      })
    }
  }
})
