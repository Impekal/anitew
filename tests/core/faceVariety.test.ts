import { describe, expect, it } from 'vitest'

import { faceFor, faceDistance } from '../../src/core/content/faces.ts'
import { namePool } from '../../src/core/content/names.ts'
import { wordPool } from '../../src/core/content/words.ts'
import { planSession, type Pools } from '../../src/core/session/plan.ts'

/**
 * Menschen einer Runde müssen auseinanderzuhalten sein (Gerätemeldung 01.09.:
 * „die Menschen sehen sich zu ähnlich aus. Im echten Leben ist es nicht so").
 *
 * Der Vorrat war nie das Problem — über alle 48 Namen sind die Gesichter
 * vielfältig, und das prüft `faces.test.ts` seit jeher. Nur sieht ein Mensch
 * nie den Vorrat, sondern die **fünf bis acht Gesichter seiner Runde**, und
 * die wurden unabhängig voneinander gezogen. Gemessen vor der Behebung
 * (300 Einheiten, 900 Runden, Modus „daily"):
 *
 * | kleinste Paardistanz in der Runde | Anteil |
 * |---|---|
 * | 1 von 7 Merkmalen  | 9,7 %  |
 * | 2 von 7            | 48,6 % |
 * | 3 von 7            | 41,4 % |
 * | 4 von 7            | 0,3 %  |
 *
 * In **58 % aller Runden** standen also zwei Personen nebeneinander, die sich
 * in höchstens zwei auffälligen Merkmalen unterschieden; in jeder zehnten
 * Runde in genau einem (etwa Greta und Zora). Das ist keine Ähnlichkeit „wie
 * im Alltag" — das sind Zwillinge.
 */

const STRONG_FEATURES = 7
/** Ab hier sind zwei Gesichter im Alltag sicher zu trennen. */
const MIN_DISTANCE = 3

/*
 * Einmal gebaut, nicht je Einheit: `planSession` mischt sich seine eigenen
 * Kopien, der Vorrat selbst bleibt unberuehrt. Vorher baute dieser Test die
 * Woerter- und Namenslisten dreihundertmal neu — das war die ganze Laufzeit
 * und hat ihn auf dem CI-Rechner in Vitests Fuenf-Sekunden-Grenze getrieben.
 */
const POOLS: Pools = (() => {
  return {
    words: [...wordPool('de')],
    faces: [...namePool('de')],
    numbers: [],
    missions: [],
    palace: [],
    reverse: [],
    twins: [],
    gaze: [],
    facts: [],
    memory: [],
  }
})()

describe('Gesichter einer Runde (Gerätemeldung 01.09.)', () => {
  it('misst Ähnlichkeit an den Merkmalen, die man aus zwei Metern sieht', () => {
    // Sieben kategorische Merkmale; die feinen Maße (Kopfbreite, Augenabstand)
    // zählen bewusst nicht mit — sie taugen nicht zum Auseinanderhalten.
    expect(faceDistance('Elena', 'Elena')).toBe(0)
    expect(faceDistance('Elena', 'Zora')).toBeGreaterThanOrEqual(0)
    expect(faceDistance('Elena', 'Zora')).toBeLessThanOrEqual(STRONG_FEATURES)
  })

  it('stellt in keiner Runde zwei fast gleiche Gesichter nebeneinander', () => {
    let rounds = 0
    const tooClose: string[] = []

    for (let index = 0; index < 300; index++) {
      const plan = planSession({
        mode: 'daily',
        day: '2026-09-01',
        language: 'de',
        seed: `variety-${index}`,
        pools: POOLS,
        modules: ['faces'],
      })

      for (const block of plan.blocks) {
        if (block.moduleId !== 'faces' || block.kind !== 'encode') continue
        rounds++
        for (let a = 0; a < block.items.length; a++) {
          for (let b = a + 1; b < block.items.length; b++) {
            const one = block.items[a] as string
            const other = block.items[b] as string
            if (faceDistance(one, other) < MIN_DISTANCE) tooClose.push(`${one}/${other}`)
          }
        }
      }
    }

    expect(rounds).toBeGreaterThan(500)
    expect(tooClose.slice(0, 8).join(', ')).toBe('')
  })

  it('lässt jedes einzelne Gesicht unangetastet (D8)', () => {
    /*
     * Die Behebung sortiert nur die Reihenfolge des Vorrats — sie ändert
     * kein Gesicht. Müsste sie es, zerbräche das Wiedersehen: „Elena" sähe
     * nach dem Update anders aus als beim Einprägen vor drei Wochen.
     *
     * Die Werte hier stammen aus dem Stand **vor** der Behebung.
     */
    expect(faceFor('Elena')).toEqual({
      width: 1.0893014238588512,
      height: 1.0673768486175685,
      jaw: 0.2053186318371445,
      skin: '#5b3620',
      hair: '#2b2118',
      hairStyle: 'bun',
      beard: 0,
      brow: 0.8498956562019884,
      eyes: '#5a4632',
      eyeSpacing: 1.0654724825453012,
      eyeSize: 0.9533623359980993,
      nose: 'line',
      mouth: 'straight',
      glasses: false,
      ears: 1.0446224661311134,
    })

    /*
     * Und das Paar, an dem der Befund am deutlichsten hing: Greta und Zora
     * teilen Frisur, Haarfarbe, Nase, Mund, Bartlosigkeit und Brillenlosigkeit
     * — sie unterscheiden sich in genau **einem** Merkmal (Hautton). Solche
     * Paare gibt es weiterhin im Vorrat; sie dürfen nur nicht mehr in
     * derselben Runde nebeneinanderstehen.
     */
    expect(faceDistance('Greta', 'Zora')).toBe(1)
  })
})
