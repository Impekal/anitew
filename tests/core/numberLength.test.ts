import { describe, expect, it } from 'vitest'

import {
  MAX_DIGITS,
  MIN_DIGITS,
  displayNumber,
  numberPool,
  splitNumberEntries,
} from '../../src/core/content/numbers.ts'
import { numberLengthFor } from '../../src/core/session/difficulty.ts'
import { SECONDS_MAX, secondsPerItemFor } from '../../src/core/session/planBase.ts'
import { TRAINING_MODULES, itemsOf, planSession } from '../../src/core/session/plan.ts'
import type { ModuleId } from '../../src/core/session/plan.ts'

/** Alle Module leer — nur die Zahlen sollen gezogen werden. */
const LEER = Object.fromEntries(
  TRAINING_MODULES.map((id) => [id, [] as readonly string[]]),
) as unknown as Record<ModuleId, readonly string[]>

/**
 * Die Zahllänge wächst mit dem Lernstand (Nutzerbefund 04.09.).
 *
 * Wörtlich: „Ich lerne (erstmal nur) t und d für 1 und … soll gleich mehrere
 * 6-stellige Ziffern anmerken können. Wie soll das gehen, wenn ich noch nicht
 * viele Wörter im Katalog für 1 habe?"
 *
 * **Gemessen vor dem Eingriff:** Eine Fünf-Minuten-Einheit brachte 24 Zahlen,
 * sieben davon sechsstellig — bei nur gelehrter 1 genau so viele wie bei
 * allen zehn Ziffern. Die Länge kannte den Lernstand nicht.
 */

const ALLE_ZEHN = [1, 2, 3, 4, 5, 9, 7, 8, 0, 6]

describe('die Decke für neue Zahlen', () => {
  it('wächst stufenweise mit dem Lernstand', () => {
    const decke = (taught: readonly number[]) => numberLengthFor({ taught, recent: [] })
    expect(decke([])).toBe(3)
    expect(decke([1])).toBe(3)
    expect(decke([1, 2])).toBe(4)
    expect(decke([1, 2, 3, 4])).toBe(4)
    expect(decke([1, 2, 3, 4, 5])).toBe(5)
    expect(decke([1, 2, 3, 4, 5, 9, 7])).toBe(5)
    expect(decke([1, 2, 3, 4, 5, 9, 7, 8])).toBe(6)
    expect(decke(ALLE_ZEHN)).toBe(6)
  })

  it('lässt sich von derselben Ziffer nicht zweimal überzeugen', () => {
    // Ein doppelter Eintrag im Lernstand ist keine zweite gelernte Ziffer.
    expect(numberLengthFor({ taught: [1, 1, 1, 1, 1], recent: [] })).toBe(3)
  })

  it('gibt der eigenen Quote ein Stück Spielraum — nach oben wie nach unten', () => {
    /*
     * Die Decke ist eine Hilfe, kein Urteil (R-1). Wer die dreistelligen
     * sicher behält, ist nicht dadurch überfordert, dass er erst eine Ziffer
     * gelernt hat — und wer bei allen zehn ständig verliert, übt das
     * Verlieren.
     */
    const sicher = Array.from({ length: 20 }, () => true)
    const wackelig = Array.from({ length: 20 }, (_, index) => index % 3 === 0)
    expect(numberLengthFor({ taught: [1], recent: sicher })).toBe(4)
    expect(numberLengthFor({ taught: ALLE_ZEHN, recent: wackelig })).toBe(5)
  })

  it('bleibt zwischen Boden und Decke, was immer man ihr gibt', () => {
    const sicher = Array.from({ length: 20 }, () => true)
    expect(numberLengthFor({ taught: ALLE_ZEHN, recent: sicher })).toBe(MAX_DIGITS)
    const daneben = Array.from({ length: 20 }, () => false)
    expect(numberLengthFor({ taught: [], recent: daneben })).toBe(MIN_DIGITS)
  })
})

describe('der Zahlenvorrat', () => {
  it('hält die Decke ein und streut darunter weiter', () => {
    const kurz = numberPool('probe', 60, 4).map((zahl) => zahl.length)
    expect(Math.max(...kurz)).toBe(4)
    expect(new Set(kurz)).toEqual(new Set([3, 4]))
  })

  it('bleibt ohne Angabe genau der alte Vorrat', () => {
    /*
     * Die wichtigste Zusage dieses Eingriffs: Wer nichts übergibt, bekommt
     * Ziffer für Ziffer denselben Vorrat wie vorher. Sonst würfelte eine
     * Verbesserung der Didaktik allen Bestandsnutzern ihre Zahlen neu aus.
     */
    expect(numberPool('probe', 60)).toEqual(numberPool('probe', 60, MAX_DIGITS))
  })

  it('liefert auch bei der engsten Decke einen vollen Vorrat', () => {
    // Dreistellig gibt es rund 900 Folgen; 60 daraus zu ziehen darf nicht an
    // der Abbruchschranke der Schleife scheitern.
    expect(numberPool('probe', 60, 3)).toHaveLength(60)
  })
})

describe('eine Einheit nach der ersten Lektion', () => {
  const plane = (taught: readonly number[]) => {
    const seed = '2026-09-04:daily:1'
    return itemsOf(
      planSession({
        mode: 'daily',
        day: '2026-09-04',
        language: 'de',
        seed,
        pools: {
          words: [],
          faces: [],
          numbers: numberPool(seed, 60, numberLengthFor({ taught, recent: [] })),
          missions: [],
          palace: [],
          reverse: [],
          twins: [],
          gaze: [],
          facts: [],
          memory: [],
          people: [],
          math: [],
        },
        due: {},
        taught,
        palaceTaught: true,
        storyTaught: true,
        linkTaught: true,
        majorMethodTaught: true,
        focus: 'numbers',
        modules: ['numbers'],
      } as never),
    ).filter((eintrag) => /^\d+$/u.test(eintrag))
  }

  it('verlangt mit einer gelernten Ziffer keine sechsstellige Zahl', () => {
    /*
     * Der Befund als Prüfung. Nicht „höchstens ein paar" — keine einzige:
     * Das Major-System fasst zwei Ziffern zu einem Wort, und mit einer
     * gelernten Ziffer ist ein zufälliges Paar in einem von hundert Fällen
     * brauchbar. Eine sechsstellige Zahl in vier Sekunden wäre dann kein
     * Anwenden der Technik, sondern Auswendiglernen ohne Werkzeug.
     */
    const zahlen = plane([1])
    expect(zahlen.length).toBeGreaterThan(0)
    const laengen = zahlen.map((zahl) => zahl.length)
    expect(Math.max(...laengen), `längste Zahl: ${Math.max(...laengen)} Ziffern`).toBe(3)
  })

  it('gibt sie wieder her, sobald das System steht', () => {
    // Die Gegenrichtung, damit die Decke nicht heimlich zur Fessel wird.
    const laengen = plane(ALLE_ZEHN).map((zahl) => zahl.length)
    expect(Math.max(...laengen)).toBe(6)
    expect(laengen.filter((laenge) => laenge === 6).length).toBeGreaterThan(0)
  })
})

/**
 * Stufe zwei: über sechs hinaus (Nutzerwunsch 04.09.).
 *
 * Wörtlich: „Das kann ruhig bis zu dreißig, 60 Zeichen gehen je nachdem. Aber
 * das muss halt stufenweise sein und wenn ich weiterkomme, darf das mehr."
 *
 * **Gemessen vor dem Eingriff:** Mit allen zehn gelehrten Ziffern und zwanzig
 * richtigen Antworten in Folge stand die Decke bei **sechs** — und blieb
 * dort, für immer. Die Leiter, die der frühere Eingriff gebaut hat, hörte
 * genau da auf, wo die Technik anfängt, sich zu lohnen.
 *
 * Der Motor oberhalb ist nicht die Trefferquote, sondern der **Beleg**: die
 * längste Folge, die dieser Mensch je richtig hatte. Eine Quote sagt nur, wie
 * es bei der zuletzt gestellten Länge lief; wer bei drei Ziffern glänzt, hat
 * damit nichts über dreißig gesagt.
 */
describe('die Decke über sechs', () => {
  const sicher = Array.from({ length: 20 }, () => true)
  const wackelig = Array.from({ length: 20 }, (_, index) => index % 3 === 0)
  const decke = (longestRecalled: number, recent = sicher) =>
    numberLengthFor({ taught: ALLE_ZEHN, recent, longestRecalled })

  it('hebt nur, was belegt ist — eine gute Quote allein reicht nicht', () => {
    /*
     * Die Kernaussage. Ohne sie hinge die anspruchsvollste Übung der App an
     * einer Quote, die über ganz andere Längen gesammelt wurde: Zwanzig
     * richtige dreistellige Folgen sind kein Grund für eine achtstellige.
     */
    expect(decke(0)).toBe(6)
    expect(decke(3)).toBe(6)
    expect(decke(5)).toBe(6)
  })

  it('geht eine Stufe über das Belegte hinaus — und nicht zwei', () => {
    expect(decke(6)).toBe(8)
    expect(decke(8)).toBe(10)
    expect(decke(10)).toBe(12)
    expect(decke(20)).toBe(24)
  })

  it('bleibt über sechs bei geraden Längen', () => {
    // Zwei Ziffern sind ein Wort. Eine ungerade Länge ließe eine halbe Silbe
    // stehen — und genau das erschwert die Technik, statt sie zu üben.
    let lange = 0
    for (let belegt = 6; belegt <= 30; belegt++) {
      const gewaehlt = decke(belegt)
      if (gewaehlt <= MAX_DIGITS) continue
      lange++
      expect(gewaehlt % 2, `${belegt} → ${gewaehlt}`).toBe(0)
    }
    // Ohne diese Zeile wäre der Test grün, solange die Decke gar nicht über
    // sechs geht — also genau in dem Zustand, gegen den er gebaut ist.
    expect(lange, 'keine einzige Länge über sechs geprüft').toBeGreaterThan(10)
  })

  it('hört bei dreißig auf, auch wenn dreißig belegt sind', () => {
    // Der Wunsch ging bis sechzig; die Uhr lässt es nicht zu (eine Sekunde je
    // Ziffer wäre eine ganze Minute nur zum Einprägen). Steht in `LADDER`.
    expect(decke(30)).toBe(30)
    expect(decke(40)).toBe(30)
  })

  it('fällt eine Stufe zurück, wenn es gerade nicht läuft', () => {
    /*
     * Nach unten darf die Quote sehr wohl — und das ist der Sicherheitsgurt
     * der ganzen Leiter: Wer an zwölf Ziffern scheitert, bekommt wieder zehn,
     * ohne dass irgendwo etwas zurückgesetzt werden müsste.
     */
    expect(decke(10, wackelig)).toBe(10)
    expect(decke(20, wackelig)).toBe(20)
  })
})

describe('der Vorrat über sechs', () => {
  it('stellt genau zwei Längen — die Decke und die Stufe darunter', () => {
    /*
     * Ohne das bekäme jemand mit zwölfstelliger Decke überwiegend drei- bis
     * sechsstellige Folgen und träfe die zwölf fast nie: Der Vorrat streute
     * bisher von drei bis zur Decke. Über sechs ist das keine Streuung mehr,
     * sondern eine Verdünnung.
     */
    for (const decke of [8, 12, 20, 30]) {
      const laengen = new Set(numberPool('probe', 60, decke).map((zahl) => zahl.length))
      expect([...laengen].sort((a, b) => a - b), `Decke ${decke}`).toEqual([decke - 2, decke])
    }
  })

  it('lässt den kurzen Bereich unangetastet', () => {
    // Die Zusage aus dem früheren Eingriff gilt weiter: Bis sechs streut es
    // von drei an, und wer nichts übergibt, bekommt genau den alten Vorrat.
    expect(new Set(numberPool('probe', 60, 6).map((z) => z.length))).toEqual(new Set([3, 4, 5, 6]))
    expect(numberPool('probe', 60)).toEqual(numberPool('probe', 60, MAX_DIGITS))
  })
})

describe('die Uhr für lange Folgen', () => {
  it('gibt eine Sekunde je Ziffer', () => {
    /*
     * Nicht erfunden, sondern fortgeschrieben: Sechs Sekunden für sechs
     * Ziffern ist der Takt, den dieses Modul seit dem Tempo-Eingriff hat.
     */
    expect(secondsPerItemFor('numbers', { digits: 6 })).toBe(6)
    expect(secondsPerItemFor('numbers', { digits: 12 })).toBe(12)
    expect(secondsPerItemFor('numbers', { digits: 30 })).toBe(30)
  })

  it('lässt die Vierzehn-Sekunden-Decke für lange Folgen fallen', () => {
    // Eine zwanzigstellige Folge in vierzehn Sekunden wäre keine schwere
    // Aufgabe, sondern eine unmögliche — und die misst nichts (R-1).
    expect(secondsPerItemFor('numbers', { digits: 20 })).toBeGreaterThan(SECONDS_MAX)
  })

  it('ändert für kurze Folgen und fremde Module gar nichts', () => {
    expect(secondsPerItemFor('numbers', { digits: 4 })).toBe(secondsPerItemFor('numbers'))
    expect(secondsPerItemFor('words', { digits: 30 })).toBe(secondsPerItemFor('words'))
  })

  it('hört auch dann bei dreißig auf, wenn jemand mehr verlangt', () => {
    expect(secondsPerItemFor('numbers', { digits: 400 })).toBe(30)
  })
})

describe('eine lange Folge ist eine Runde für sich', () => {
  const plane = (numberDigits: number, mode: 'short' | 'daily' | 'extended' = 'daily') =>
    planSession({
      seed: 'lang',
      day: '2026-09-06',
      mode,
      language: 'de',
      modules: ['numbers'],
      pools: { ...LEER, numbers: numberPool('lang', 60, numberDigits) },
      taught: ALLE_ZEHN,
      palaceTaught: true,
      storyTaught: true,
      linkTaught: true,
      majorMethodTaught: true,
      numberDigits,
    })

  it('zählt nicht drei halbe Folgen ab', () => {
    /*
     * Der Boden von drei Stücken je Runde ist für Wörter gebaut. Bei dreißig
     * Sekunden je Folge fräßen drei davon die Runde samt Abruf — und dann
     * stünde die Frage da, während die Zeit schon abgelaufen ist.
     */
    const rund = plane(30).blocks.filter((block) => block.kind === 'encode')
    expect(rund.length).toBeGreaterThan(0)
    for (const block of rund) expect(block.items.length).toBe(1)
  })

  it('behält das Zeitbudget der Einheit auf die Sekunde', () => {
    // Die Zusage aus dem Tempo-Eingriff gilt auch hier: Mehr Zeit je Stück
    // heißt weniger Stücke, nicht eine längere Einheit.
    for (const [mode, sekunden] of [
      ['short', 180],
      ['daily', 300],
      ['extended', 900],
    ] as const) {
      for (const digits of [6, 12, 30]) {
        const plan = plane(digits, mode)
        const summe = plan.blocks.reduce((total, block) => total + block.seconds, 0)
        expect(summe, `${mode} · ${digits} Ziffern`).toBe(sekunden)
      }
    }
  })

  it('lässt dem Abruf in jeder Runde Zeit', () => {
    // Eine Einprägezeit, die den Block frisst, wäre keine Übung.
    for (const digits of [8, 12, 20, 30]) {
      const plan = plane(digits)
      const abruf = plan.blocks.filter((block) => block.kind === 'recall')
      expect(abruf.length, `${digits} Ziffern`).toBeGreaterThan(0)
      for (const block of abruf) expect(block.seconds, `${digits} Ziffern`).toBeGreaterThan(20)
    }
  })

  it('zeigt lange Folgen in Zweiergruppen, kurze weiter in Dreiergruppen', () => {
    /*
     * Das Major-System fasst **zwei** Ziffern zu einem Wort. „123 456" muss
     * man erst wieder zu 12|34|56 umbauen, bevor man die Wörter findet — das
     * ist Arbeit, die nichts mit Gedächtnis zu tun hat. Bis sechs bleibt es
     * bei der Telefonnummern-Schreibweise.
     */
    expect(displayNumber('123456')).toBe('123 456')
    expect(displayNumber('12345678')).toBe('12 34 56 78')
    expect(displayNumber('4711')).toBe('4711')
  })

  it('lässt die Kennung unberührt — die Anzeige ist nur Anzeige', () => {
    // Sonst hinge die FSRS-Geschichte an einer Darstellungsentscheidung.
    const lang = numberPool('lang', 10, 12)[0] as string
    expect(splitNumberEntries(displayNumber(lang))).toEqual([lang])
  })
})
