/**
 * Gesichter müssen sich unterscheiden lassen (Gerätebefund 02.09.).
 *
 * Wörtlich gemeldet:
 *
 *   „Bei Personen ist das echt blöd. Sie sehen sich alle einfach zu ähnlich
 *    aus. Liegt wohl an Zeichentricksding."
 *
 * ── Was zuerst gemessen wurde ─────────────────────────────────────────────
 *
 * Die **Daten** waren nie das Problem: mittlerer Abstand 4,47 von 7
 * auffälligen Merkmalen über 48 Namen. Unsichtbar war er trotzdem, denn von
 * den sieben Kanälen trugen nur vier — Haare, Hautton, Brille, Bart. Die
 * Kopfbreite schwankte um drei Prozent, Augenabstand und -größe um vierzehn;
 * bei 130 Pixeln Kantenlänge sieht das niemand. Jedes Gesicht hatte dieselbe
 * Silhouette, dieselben Augen, und Augen, Nase und Mund saßen bei allen auf
 * exakt derselben Höhe.
 *
 * ── Was dieser Test bewusst NICHT prüft ───────────────────────────────────
 *
 * Ob sie **schön** sind. Das entscheidet ein Mensch, der den Bogen ansieht
 * (`node scripts/facesheet.mjs`), und das steht als USER ACTION im PR.
 * Prüfbar ist, dass die Unterschiede existieren, dass keiner unter das
 * gemessene Mindestmaß fällt — und dass niemand sein gelerntes Gesicht
 * verliert.
 */

import { describe, expect, it } from 'vitest'

import {
  BROW_SHAPES,
  EYE_SHAPES,
  HEAD_SHAPES,
  faceDistance,
  faceFor,
} from '../../src/core/content/faces.ts'
import { namePool } from '../../src/core/content/names.ts'

const NAMEN = namePool('de')

describe('Gesichter lassen sich unterscheiden', () => {
  it('trennt je zwei Gesichter durch mindestens drei auffällige Merkmale', () => {
    let schwaechstes: [string, string, number] = ['', '', 99]
    for (let i = 0; i < NAMEN.length; i += 1) {
      for (let j = i + 1; j < NAMEN.length; j += 1) {
        const d = faceDistance(NAMEN[i]!, NAMEN[j]!)
        if (d < schwaechstes[2]) schwaechstes = [NAMEN[i]!, NAMEN[j]!, d]
      }
    }
    expect(
      schwaechstes[2],
      `${schwaechstes[0]} und ${schwaechstes[1]} trennen nur ${schwaechstes[2]} Merkmale`,
    ).toBeGreaterThanOrEqual(3)
  })

  it('nutzt jede Kopfform, jede Augenform und jeden Brauenschwung', () => {
    const gesichter = NAMEN.map((name) => faceFor(name))
    for (const form of HEAD_SHAPES) {
      expect(gesichter.some((f) => f.headShape === form), `Kopfform ${form} kommt nie vor`).toBe(true)
    }
    for (const form of EYE_SHAPES) {
      expect(gesichter.some((f) => f.eyeShape === form), `Augenform ${form} kommt nie vor`).toBe(true)
    }
    for (const form of BROW_SHAPES) {
      expect(gesichter.some((f) => f.browShape === form), `Braue ${form} kommt nie vor`).toBe(true)
    }
  })

  it('setzt die Züge nicht bei allen auf dieselbe Höhe', () => {
    // Der stillste Grund für den gemeldeten Eindruck: Vorher lagen die Augen
    // bei jedem Gesicht auf derselben Linie. Ein Viertel Spannweite ist das
    // Mindeste, damit man es sieht.
    const hoehen = NAMEN.map((name) => faceFor(name).featureY)
    const spanne = Math.max(...hoehen) - Math.min(...hoehen)
    expect(spanne, 'alle Augen liegen praktisch auf derselben Höhe').toBeGreaterThan(0.75)
  })
})

/**
 * Der Preis, den diese Änderung **nicht** kosten durfte.
 *
 * Wer „Anton" schon gelernt hat, erkennt ihn an Haarfarbe, Frisur, Hautton,
 * Bart und Brille wieder. Zöge man die neuen Merkmale aus demselben
 * Zufallsstrom, verschöbe sich jeder folgende Wurf — und jedes Gesicht der
 * App sähe von einem Tag auf den anderen anders aus. Der Wiederholungsplan
 * behauptete dann Wissen über Paare, die es nicht mehr gibt.
 *
 * Diese Werte sind am 02.09. vor der Änderung gemessen und danach Ziffer für
 * Ziffer wiedergefunden worden. Sie stehen hier, damit ein späterer Eingriff
 * in `buildFace` nicht unbemerkt alle gelernten Gesichter austauscht.
 */
describe('Gelernte Gesichter bleiben, was sie waren', () => {
  it('lässt Haare, Hautton, Bart und Brille unangetastet', () => {
    expect({ ...faceFor('Anton') }).toMatchObject({
      hair: '#c39b62',
      skin: '#5b3620',
      beard: 2,
      glasses: false,
      hairStyle: 'long',
    })
    expect({ ...faceFor('Beata') }).toMatchObject({
      hair: '#8a8a8a',
      skin: '#dfa878',
      beard: 0,
      glasses: false,
      hairStyle: 'short',
    })
    expect({ ...faceFor('Emil') }).toMatchObject({
      hair: '#6b4a2b',
      skin: '#7a4a2a',
      beard: 0,
      glasses: false,
      hairStyle: 'bald',
    })
  })
})
