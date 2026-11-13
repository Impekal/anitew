import { describe, expect, it } from 'vitest'

import {
  LEARN_TOPICS,
  type LearnState,
  learnCards,
  learnModuleOf,
  learnProgress,
} from '../../src/core/technique/learn.ts'
import { TEACH_ORDER } from '../../src/core/technique/major.ts'

/**
 * Der Lernbereich (Nutzerwunsch 03.09.).
 *
 * Bewacht wird hier das Modell, nicht der Bildschirm: was es zu lernen gibt,
 * wo man steht, und ob „weiterlernen" und „neu anfangen" das Richtige
 * bedeuten.
 */

const NICHTS: LearnState = {
  storyTaught: false,
  linkTaught: false,
  palaceTaught: false,
  majorMethodTaught: false,
  majorDigits: [],
}

describe('was es zu lernen gibt', () => {
  it('führt jede Methode genau einmal und schickt sie in ihr eigenes Modul', () => {
    const karten = learnCards(NICHTS)
    expect(karten.map((karte) => karte.topic)).toEqual([...LEARN_TOPICS])
    const module = karten.map((karte) => karte.module)
    expect(new Set(module).size, 'zwei Methoden üben dasselbe Modul').toBe(module.length)
    expect(learnModuleOf('story')).toBe('words')
    expect(learnModuleOf('link')).toBe('faces')
    expect(learnModuleOf('major')).toBe('numbers')
    expect(learnModuleOf('palace')).toBe('palace')
  })

  it('nennt am Anfang alles unberührt — der Knopf heißt dann „Lernen"', () => {
    for (const karte of learnCards(NICHTS)) {
      expect(karte.untouched, `${karte.topic}`).toBe(true)
      expect(karte.done, `${karte.topic}`).toBe(false)
    }
    expect(learnProgress(NICHTS)).toEqual({ known: 0, total: 4 })
  })
})

describe('das Major-System', () => {
  it('zählt das Verfahren als eigenen Schritt', () => {
    /*
     * Gemeldet am 01.09.: Wer die Zuordnungen lernt, ohne den Gedanken
     * dahinter gehört zu haben, hält sie für eine Marotte. Das Verfahren ist
     * deshalb ein Schritt und keine Fußnote — elf statt zehn.
     */
    const nurZiffern = { ...NICHTS, majorDigits: [...TEACH_ORDER] }
    const karte = learnCards(nurZiffern).find((eintrag) => eintrag.topic === 'major')
    expect(karte?.progress).toEqual({ known: 10, total: 11 })
    expect(karte?.done, 'alle Ziffern ohne das Verfahren gilt als fertig').toBe(false)

    const alles = { ...nurZiffern, majorMethodTaught: true }
    expect(learnCards(alles).find((eintrag) => eintrag.topic === 'major')?.done).toBe(true)
  })

  it('nennt die nächste Ziffer in der Lehrreihenfolge, nicht die nächstgrößere', () => {
    /*
     * Die Reihenfolge ist didaktisch gewählt (TEACH_ORDER), nicht 0…9. Wer
     * hier einfach hochzählte, würde mit einer Ziffer weitermachen, die noch
     * niemand vorbereitet hat.
     */
    const zwei = { ...NICHTS, majorDigits: [TEACH_ORDER[0] as number, TEACH_ORDER[1] as number] }
    const karte = learnCards(zwei).find((eintrag) => eintrag.topic === 'major')
    expect(karte?.nextDigit).toBe(TEACH_ORDER[2])
    expect(karte?.untouched).toBe(false)
  })

  it('hat keine nächste Ziffer mehr, wenn alle erklärt sind', () => {
    const alle = { ...NICHTS, majorDigits: [...TEACH_ORDER] }
    expect(learnCards(alle).find((eintrag) => eintrag.topic === 'major')?.nextDigit).toBeUndefined()
  })
})

describe('der Gesamtstand', () => {
  it('zählt Lektionen, nicht Ziffern', () => {
    /*
     * Sonst wögen die zehn Major-Ziffern zehnmal so schwer wie der
     * Gedächtnispalast, und der Balken sagte mehr über die Zählweise als
     * über den Menschen.
     */
    const zweiVonVier: LearnState = {
      ...NICHTS,
      storyTaught: true,
      palaceTaught: true,
    }
    expect(learnProgress(zweiVonVier)).toEqual({ known: 2, total: 4 })

    // Neun von zehn Ziffern sind trotzdem keine fertige Lektion.
    const fastMajor: LearnState = {
      ...zweiVonVier,
      majorMethodTaught: true,
      majorDigits: TEACH_ORDER.slice(0, 9),
    }
    expect(learnProgress(fastMajor)).toEqual({ known: 2, total: 4 })
  })

  it('ist voll, wenn wirklich alles erklärt ist', () => {
    const alles: LearnState = {
      storyTaught: true,
      linkTaught: true,
      palaceTaught: true,
      majorMethodTaught: true,
      majorDigits: [...TEACH_ORDER],
    }
    expect(learnProgress(alles)).toEqual({ known: 4, total: 4 })
    expect(learnCards(alles).every((karte) => karte.done)).toBe(true)
  })
})
