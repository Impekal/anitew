import { describe, expect, it } from 'vitest'

import { faceFor } from '../../src/core/content/faces.ts'
import { beardFits, namePool } from '../../src/core/content/names.ts'
import { gradePrompted } from '../../src/core/session/grading.ts'

describe('der Gesichtsgenerator (D-005)', () => {
  it('gibt demselben Namen immer dasselbe Gesicht', () => {
    // Darauf beruht das Wiedersehen (D8): „Elena“ sieht in drei Wochen aus
    // wie heute. Ohne diese Verlässlichkeit lernte man jedes Mal ein neues
    // Gesicht zum alten Namen.
    expect(faceFor('Elena')).toEqual(faceFor('Elena'))
  })

  it('gibt verschiedenen Namen verschiedene Gesichter', () => {
    expect(faceFor('Elena')).not.toEqual(faceFor('Elenb'))
  })

  it('erzeugt aus dem Namensvorrat sichtbar verschiedene Gesichter', () => {
    // Der Sinn des Generators ist Unterscheidbarkeit. Gemessen an der Zahl
    // verschiedener Kombinationen aus den auffälligsten Merkmalen.
    const faces = namePool('de').map(faceFor)
    const marks = new Set(
      faces.map((face) => `${face.hairStyle}|${face.skin}|${face.hair}|${face.glasses}|${face.beard}`),
    )
    expect(marks.size).toBeGreaterThan(faces.length * 0.75)
  })

  it('nutzt die ganze Spanne der Hauttöne', () => {
    // Eine Gedächtnis-App, in der alle Gesichter gleich aussehen, übt nicht
    // das, worauf es ankommt: Menschen auseinanderzuhalten.
    const tones = new Set(namePool('de').map((name) => faceFor(name).skin))
    expect(tones.size).toBeGreaterThanOrEqual(6)
  })

  it('bleibt in sinnvollen Maßen', () => {
    for (const name of namePool('de')) {
      const face = faceFor(name)
      expect(face.width).toBeGreaterThan(0.8)
      expect(face.width).toBeLessThan(1.2)
      expect(face.eyeSpacing).toBeGreaterThan(0.8)
      expect(face.eyeSpacing).toBeLessThan(1.2)
      expect([0, 1, 2]).toContain(face.beard)
    }
  })

  it('zeichnet keinen Bart, wo keiner hingehört', () => {
    // Eine Margarethe mit Vollbart liest sich nicht als Vielfalt, sondern als
    // Fehler — und wer einen Fehler sieht, schaut auf den Fehler statt auf
    // das Gesicht, das er sich merken soll. Die Begründung steht in names.ts.
    for (const language of ['de', 'en'] as const) {
      for (const name of namePool(language)) {
        if (!beardFits(name)) expect(faceFor(name).beard).toBe(0)
      }
    }
  })

  it('behält den Bart als Merkmal — er verschwindet nicht insgesamt', () => {
    // Die Gegenprobe zur vorigen Regel: Eine Bedingung, die versehentlich
    // *alle* Bärte abschaltet, würde dort nicht auffallen.
    const bearded = namePool('de').filter((name) => faceFor(name).beard !== 0)
    expect(bearded.length).toBeGreaterThanOrEqual(4)
  })

  /*
   * Hier stand ein Test dazu, dass der Bart genau **einen** Wurf verbraucht
   * (siehe `beardOf` in faces.ts). Er ist wieder heraus, und zwar bewusst:
   *
   * Von außen ist an `faceFor` nicht zu sehen, wie oft der Zufall gefragt
   * wurde — sichtbar sind nur die Merkmale, und die sehen in beiden Fällen
   * zufällig aus. Mein Versuch, es über die Streuung der übrigen Merkmale zu
   * messen, ist prompt an sich selbst gescheitert: Bei sieben bärtigen Namen
   * und 48 möglichen Kombinationen aus Augen, Nase und Mund fallen zwei
   * zusammen, wie es die Wahrscheinlichkeit vorsieht — der Test war falsch,
   * nicht der Code.
   *
   * Ein Test, der nur so lange grün ist, wie der Zufall mitspielt, ist
   * schlimmer als keiner. Die Begründung steht deshalb als Kommentar an der
   * Stelle, wo sie gebraucht wird, und nicht als Scheinprüfung hier.
   */
})

describe('der Namensvorrat (L6)', () => {
  it('mischt beide Sorten, statt sie hintereinander zu legen', () => {
    /*
     * Vorher lagen sie abwechselnd in einer Liste — das sah aus wie Absicht,
     * war aber nur die Reihenfolge beim Aufschreiben, und im englischen Pool
     * stimmte sie ab „Ximena“ schon nicht mehr. Jetzt kommt die Abwechslung
     * aus der Struktur, und dieser Test hält sie fest: In keinem Ausschnitt
     * von vier Namen stehen vier Namen derselben Sorte.
     */
    for (const language of ['de', 'en'] as const) {
      const pool = namePool(language)
      for (let i = 0; i + 4 <= pool.length; i++) {
        const window = pool.slice(i, i + 4).map(beardFits)
        expect(new Set(window).size, `${language} ab ${i}`).toBe(2)
      }
    }
  })

  it('kennt einen unbekannten Namen nicht und lässt ihm den Bart', () => {
    // Die harmlosere Richtung: Ein Bart, der nicht passt, ist ein schiefes
    // Bild; eine Regel, die stillschweigend alle abschaltet, wäre ein
    // verschwundenes Merkmal.
    expect(beardFits('Zzyzx')).toBe(true)
  })
})

describe('der gestützte Abruf (D9)', () => {
  const targets = ['Rosalind', 'Anton', 'Dilara']

  it('ordnet Position für Position zu', () => {
    const result = gradePrompted(['Rosalind', '', 'Dilara'], targets)
    expect(result.correct).toEqual(['Rosalind', 'Dilara'])
    expect(result.missed).toEqual(['Anton'])
  })

  it('verzeiht einen Tippfehler bei langen Namen', () => {
    expect(gradePrompted(['Rosalinde', 'Anton', 'Dilara'], targets).correct).toHaveLength(3)
  })

  it('zählt eine Antwort nicht für die falsche Stelle', () => {
    // Vertauschte Antworten sind zwei Fehler, keine zwei Treffer — beim
    // gestützten Abruf ist die Zuordnung die halbe Aufgabe.
    const result = gradePrompted(['Anton', 'Rosalind', 'Dilara'], targets)
    expect(result.correct).toEqual(['Dilara'])
  })

  it('nimmt zu kurze Antwortlisten hin', () => {
    // Der Normalfall, wenn die Zeit ausläuft.
    expect(gradePrompted(['Rosalind'], targets).missed).toEqual(['Anton', 'Dilara'])
  })
})
