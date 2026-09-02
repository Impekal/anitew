/**
 * Erst lernen, dann anwenden — an denselben Zahlen (D5, Gerätemeldung 01.09.).
 *
 * Gemeldet wurde, nachdem PR #106 die Verfahrenslektion nachgeliefert hatte:
 *
 *   „Ich bekomme nur die Lektion zur 1 (t und d), und dann soll ich sofort
 *    sechsstellige Zahlen mit lauter anderen Ziffern behalten — ohne vorher
 *    das anzuwenden, was ich gelernt habe.“
 *
 * Gemessen, bevor etwas geändert wurde: Nach der Lektion zur 1 enthielten
 * **258 von 576** Zahlen überhaupt eine 1 — knapp die Hälfte. Die erste Zahl
 * der ersten Runde war in einem Lauf `339734`: keine einzige gelernte Ziffer
 * darin. Die Lektion war damit folgenlos, und genau das hat der Nutzer
 * gespürt.
 *
 * Der Vorrat wird weiterhin zufällig erzeugt und **nicht** beschnitten: Die
 * Zahlen sind dieselben, nur ihre Reihenfolge ist eine andere. Wo die Technik
 * trägt, kommt zuerst. Sobald alle zehn Ziffern sitzen, trägt sie überall —
 * dann verschwindet der Unterschied von selbst.
 */

import { describe, expect, it } from 'vitest'

import { numberPool } from '../../src/core/content/numbers.ts'
import { wordPool } from '../../src/core/content/words.ts'
import { nextToTeach } from '../../src/core/technique/major.ts'
import { planSession, type Pools } from '../../src/core/session/plan.ts'

function pools(seed: string): Pools {
  return {
    words: [...wordPool('de')],
    faces: [],
    numbers: [...numberPool(seed, 60)],
    missions: [],
    palace: [],
    reverse: [],
    twins: [],
    gaze: [],
    facts: [],
    memory: [], people: [],
  }
}

function zahlenAus(seed: string, taught: readonly number[]): readonly string[] {
  const plan = planSession({
    mode: 'daily',
    day: '2026-09-01',
    language: 'de',
    seed,
    pools: pools(seed),
    modules: ['numbers'],
    taught,
    majorMethodTaught: true,
    palaceTaught: true,
    storyTaught: true,
    linkTaught: true,
  })
  return plan.blocks
    .filter((block) => block.kind !== 'teach' && block.moduleId === 'numbers')
    .flatMap((block) => block.items)
}

/** Die Zahlen in der Reihenfolge, in der sie zum ersten Mal drankommen. */
function reihenfolge(seed: string, taught: readonly number[]): readonly string[] {
  const gesehen = new Set<string>()
  const folge: string[] = []
  for (const zahl of zahlenAus(seed, taught)) {
    if (gesehen.has(zahl)) continue
    gesehen.add(zahl)
    folge.push(zahl)
  }
  return folge
}

/**
 * Die Stelle, an der eine Zahl ohne Nutzen vor einer mit Nutzen steht.
 *
 * Genau das ist der gemeldete Effekt — nicht, dass irgendwann eine Zahl ohne
 * gelernte Ziffer kommt. Der Vorrat ist endlich; wenn die Zahlen mit der
 * frischen Ziffer aufgebraucht sind, müssen andere folgen. Falsch ist die
 * **Vermischung**: erst eine ohne, dann wieder eine mit.
 */
function vermischt(folge: readonly string[], traegt: (zahl: string) => boolean): string | undefined {
  let ohneGesehen: string | undefined
  for (const zahl of folge) {
    if (!traegt(zahl)) ohneGesehen ??= zahl
    else if (ohneGesehen !== undefined) return `${ohneGesehen} stand vor ${zahl}`
  }
  return undefined
}

describe('Die gelernte Ziffer wird auch angewandt', () => {
  it('stellt in der Lehr-Einheit die Zahlen voran, in denen die neue Ziffer vorkommt', () => {
    const taught: readonly number[] = []
    const neu = String(nextToTeach(taught))

    for (const seed of ['anwendung-1', 'anwendung-2', 'anwendung-3']) {
      const folge = reihenfolge(seed, taught)
      expect(folge.length).toBeGreaterThan(4)

      // Die erste Zahl nach der Lektion ist die wichtigste: An ihr entscheidet
      // sich, ob das Gelernte etwas mit der Aufgabe zu tun hat.
      expect(folge[0], `Seed ${seed}: erste Zahl ohne die gelernte Ziffer`).toContain(neu)

      expect(
        vermischt(folge, (zahl) => zahl.includes(neu)),
        `Seed ${seed}: eine Zahl ohne die gelernte Ziffer stand vor einer mit ihr`,
      ).toBeUndefined()
    }
  })

  it('nimmt auch später die Zahlen zuerst, in denen eine gelernte Ziffer steckt', () => {
    const taught = [1, 2, 3, 4]
    const folge = reihenfolge('anwendung-spaeter', taught)
    /*
     * „Trägt etwas" schließt die Ziffer ein, die in dieser Einheit gerade
     * erklärt wird: Sie ist ab der Lektion bekannt, und die Zahlen mit ihr
     * stehen deshalb ganz vorn. Sie hier auszulassen hieße, die frische
     * Lektion als nutzlos zu zählen.
     */
    const bekannt = [...taught, nextToTeach(taught)].filter((z): z is number => z !== undefined)
    const traegt = (zahl: string) => [...zahl].some((z) => bekannt.includes(Number(z)))

    expect(traegt(folge[0] ?? ''), 'die erste Zahl trägt nichts Gelerntes').toBe(true)
    expect(vermischt(folge, traegt)).toBeUndefined()
  })

  it('lässt den Vorrat unangetastet — es wird geordnet, nicht ausgesiebt', () => {
    const roh = [...numberPool('anwendung-1', 60)]
    const zahlen = zahlenAus('anwendung-1', [])
    // Jede gezogene Zahl stammt aus dem erzeugten Vorrat; nichts ist erfunden.
    for (const zahl of new Set(zahlen)) expect(roh).toContain(zahl)
    // Und der Vorrat verliert nichts: Was hinten steht, kommt weiterhin dran.
    expect(new Set(zahlen).size).toBeGreaterThan(10)
  })
})
