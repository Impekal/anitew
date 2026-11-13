import { describe, expect, it } from 'vitest'

import { mergeDriveSettingValue } from '../../src/core/sync/settings.ts'

/**
 * „Neu anfangen" muss den Abgleich überleben (Nutzerwunsch 03.09.).
 *
 * Der Wunsch war: „man kann jederzeit lernen, weiterlernen, **neu anfangen**
 * innerhalb jeder Lektion und innerhalb des ganzen."
 *
 * Und genau daran wäre es still gescheitert. Der Lernstand wird beim
 * Drive-Abgleich **vereinigt** — mit gutem Grund: Wer auf dem Telefon die
 * Vier lernt und auf dem Rechner die Sieben, soll beide behalten, und keine
 * ältere Datei darf Gelerntes wieder wegnehmen.
 *
 * Dieselbe Regel macht ein Zurücksetzen unmöglich: Das andere Gerät kennt die
 * Ziffern noch, der nächste Abgleich vereinigt sie zurück, und der Knopf
 * „neu anfangen" hätte nichts getan. Auf einem Gerät sähe es nach Erfolg aus
 * — bis zum nächsten Abgleich.
 *
 * Die Auflösung ist dieselbe wie beim Berichtigen eigener Karten (02.09.):
 * Ein bewusster Eingriff bekommt einen Zeitpunkt, und der jüngere gewinnt.
 * Ohne Zeitpunkt bleibt es bei der Vereinigung — Altbestand verliert nichts.
 */

const ZIFFERN = 'technique.major.taught'
const PALAST = 'technique.palace.taught'

describe('Lernstand vereinigen — wie bisher', () => {
  it('behält, was zwei Geräte unabhängig gelernt haben', () => {
    expect(mergeDriveSettingValue(ZIFFERN, { digits: [1, 4], at: 100 }, { digits: [1, 7], at: 90 }))
      .toEqual({ digits: [1, 4, 7], at: 100 })
  })

  it('versteht den alten Altbestand ohne Zeitpunkt weiterhin', () => {
    // Vor dem 03.09. lag dort eine nackte Liste bzw. ein nacktes `true`.
    expect(mergeDriveSettingValue(ZIFFERN, [1, 4], [7])).toEqual([1, 4, 7])
    expect(mergeDriveSettingValue(PALAST, false, true)).toBe(true)
    expect(mergeDriveSettingValue(PALAST, true, false)).toBe(true)
  })
})

describe('„neu anfangen" gewinnt gegen älteren Lernstand', () => {
  it('nimmt die Ziffern wirklich weg, wenn das Zurücksetzen jünger ist', () => {
    const zurueckgesetzt = { digits: [], at: 500, clearedAt: 500 }
    const anderesGeraet = { digits: [1, 4, 7], at: 300 }
    expect(mergeDriveSettingValue(ZIFFERN, zurueckgesetzt, anderesGeraet)).toEqual(zurueckgesetzt)
    // Und in der anderen Richtung genauso — egal, welches Gerät gerade abgleicht.
    expect(mergeDriveSettingValue(ZIFFERN, anderesGeraet, zurueckgesetzt)).toEqual(zurueckgesetzt)
  })

  it('lässt neu Gelerntes nach dem Zurücksetzen wieder gelten', () => {
    /*
     * Der Fall, der die Regel scharf macht: erst zurückgesetzt, dann auf dem
     * anderen Gerät wieder etwas gelernt. Das Zurücksetzen ist älter als das
     * neue Lernen — also darf es nicht mehr gewinnen, sonst könnte man nach
     * einem Zurücksetzen nie wieder etwas lernen.
     */
    const zurueckgesetzt = { digits: [], at: 300, clearedAt: 300 }
    const spaeterGelernt = { digits: [1], at: 700 }
    expect(mergeDriveSettingValue(ZIFFERN, zurueckgesetzt, spaeterGelernt)).toEqual({
      digits: [1],
      at: 700,
      clearedAt: 300,
    })
  })

  it('gilt genauso für die Ja/Nein-Lektionen', () => {
    const zurueckgesetzt = { taught: false, at: 500, clearedAt: 500 }
    const anderesGeraet = { taught: true, at: 300 }
    expect(mergeDriveSettingValue(PALAST, zurueckgesetzt, anderesGeraet)).toEqual(zurueckgesetzt)
    expect(mergeDriveSettingValue(PALAST, anderesGeraet, zurueckgesetzt)).toEqual(zurueckgesetzt)
  })

  it('schlägt auch ein altes Gerät, das noch die nackte Form schreibt', () => {
    /*
     * Während der Übergangszeit schreibt ein noch nicht aktualisiertes Gerät
     * `true` ohne Zeitpunkt. Ein Zurücksetzen mit Zeitpunkt ist eine bewusste
     * Handlung mit bekanntem Zeitpunkt; ein nacktes `true` ist es nicht.
     * Dieselbe Auflösung wie bei den eigenen Karten: Wer eine Marke hat,
     * gewinnt gegen jemanden, der keine hat.
     */
    const zurueckgesetzt = { taught: false, at: 500, clearedAt: 500 }
    expect(mergeDriveSettingValue(PALAST, zurueckgesetzt, true)).toEqual(zurueckgesetzt)
    expect(mergeDriveSettingValue(PALAST, true, zurueckgesetzt)).toEqual(zurueckgesetzt)
  })
})
