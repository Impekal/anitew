import { describe, expect, it } from 'vitest'

import { ARITHMETIC_STAGES, arithmeticPool, arithmeticSize } from '../../src/core/content/arithmetic.ts'
import { OWN_SEPARATOR } from '../../src/core/content/own.ts'
import type { ModuleId } from '../../src/core/index.ts'
import {
  TRAINING_MODULES,
  displayOf,
  entersReview,
  isPrompted,
  leniencyFor,
  planSession,
  secondsPerItemFor,
  targetOf,
} from '../../src/core/index.ts'

/**
 * Kopfrechnen (Nutzerwunsch 05.09.).
 *
 * Die wichtigste Prüfung hier ist die zweite: **Der Test rechnet selbst
 * nach.** Eine Gedächtnis-App, die 7 × 8 = 54 einübt, richtet mehr Schaden an
 * als eine, die das Modul gar nicht hat — und ein Tippfehler in einer Tabelle
 * fällt niemandem auf, der die Tabelle gerade erst lernt.
 */

const frage = (item: string) => item.split(OWN_SEPARATOR)[0] as string
const antwort = (item: string) => item.split(OWN_SEPARATOR)[1] as string

/** Rechnet die Frage aus — unabhängig von der Datei, die sie erzeugt hat. */
function rechne(text: string): number | undefined {
  const mal = /^(\d+) × (\d+)$/u.exec(text)
  if (mal) return Number(mal[1]) * Number(mal[2])
  const potenz = /^2\^(\d+)$/u.exec(text)
  if (potenz) return 2 ** Number(potenz[1])
  const prozent = /^(\d+) % von (\d+)$/u.exec(text)
  if (prozent) return (Number(prozent[1]) * Number(prozent[2])) / 100
  return undefined
}

/** Der ganze Vorrat, alle Stufen — beide Blöcke prüfen daran. */
const alle = arithmeticPool('probe', ARITHMETIC_STAGES)

describe('der Rechenvorrat', () => {
  it('trägt jede Aufgabe als Frage-Antwort-Paar', () => {
    for (const item of alle) {
      expect(item.split(OWN_SEPARATOR), item).toHaveLength(2)
      expect(frage(item).length, item).toBeGreaterThan(0)
      expect(antwort(item), item).toMatch(/^\d+$/u)
    }
  })

  it('rechnet richtig — nachgerechnet, nicht geglaubt', () => {
    for (const item of alle) {
      const soll = rechne(frage(item))
      expect(soll, `unbekannte Aufgabenform: ${frage(item)}`).toBeDefined()
      expect(Number(antwort(item)), `${frage(item)} = ${antwort(item)}`).toBe(soll)
    }
  })

  it('stellt keine Aufgabe zweimal', () => {
    /*
     * 7 × 8 und 8 × 7 sind dieselbe Tatsache. Stünden beide im Vorrat, misse
     * der zweite Abruf das Wiedersehen von vor zwei Minuten statt das
     * Gedächtnis — derselbe Fehler, den der Planer beim Aussortieren der
     * fälligen Einträge vermeidet.
     */
    expect(new Set(alle).size).toBe(alle.length)
    const normalisiert = alle.map((item) => {
      const m = /^(\d+) × (\d+)$/u.exec(frage(item))
      return m ? [Number(m[1]), Number(m[2])].sort((a, b) => a - b).join('×') : frage(item)
    })
    expect(new Set(normalisiert).size, 'gespiegelte Aufgabe im Vorrat').toBe(alle.length)
  })

  it('lässt die geschenkten Reihen weg', () => {
    // „7 × 1" und „7 × 10" prüfen kein Gedächtnis, sondern eine Regel.
    for (const item of arithmeticPool('probe', ['times'])) {
      const m = /^(\d+) × (\d+)$/u.exec(frage(item))
      expect(m, item).not.toBeNull()
      for (const teil of [Number(m![1]), Number(m![2])]) {
        expect(teil, item).toBeGreaterThan(1)
        expect(teil, item).toBeLessThan(10)
      }
    }
  })

  it('gibt bei gleichem Seed denselben Vorrat — und mischt ihn wirklich', () => {
    expect(arithmeticPool('a', ['times'])).toEqual(arithmeticPool('a', ['times']))
    expect(arithmeticPool('a', ['times'])).not.toEqual(arithmeticPool('b', ['times']))
  })

  it('wächst mit den freigeschalteten Stufen', () => {
    const nurEinmaleins = arithmeticPool('probe', ['times']).length
    expect(nurEinmaleins).toBe(arithmeticSize('times'))
    expect(alle.length).toBeGreaterThan(nurEinmaleins)
    // Das kleine Einmaleins ohne Spiegelungen und ohne die Reihen 1 und 10:
    // die Dreiecksmatrix von 2×2 bis 9×9.
    expect(nurEinmaleins).toBe(36)
  })
})

/**
 * Und hier das, was das Modul zum Modul macht.
 *
 * Der Vorrat oben ist nur eine Liste. Ob daraus eine Übung wird, entscheiden
 * fünf Weichen im Planer — und jede einzelne war schon einmal die, die
 * vergessen wurde. Deshalb steht jede hier mit ihrer Folge dabei, nicht nur
 * mit ihrem Namen.
 */
describe('Kopfrechnen als Modul', () => {
  const pools = Object.fromEntries(
    TRAINING_MODULES.map((moduleId) => [
      moduleId,
      moduleId === 'math' ? arithmeticPool('rechnen', ['times']) : [],
    ]),
  ) as Record<ModuleId, readonly string[]>

  it('plant eine Runde, die wirklich Aufgaben enthält', () => {
    const plan = planSession({
      seed: 'rechnen',
      day: '2026-09-06',
      mode: 'daily',
      language: 'de',
      modules: ['math'],
      pools,
      taught: [],
      palaceTaught: false,
      storyTaught: false,
      linkTaught: false,
      majorMethodTaught: false,
    })
    const stuecke = plan.blocks.flatMap((block) => block.items)
    expect(stuecke.length).toBeGreaterThan(0)
    for (const item of stuecke) expect(rechne(frage(item)), item).toBeDefined()
  })

  it('fragt gestützt — die Aufgabe steht da, gesucht ist das Ergebnis', () => {
    /*
     * Ohne diese Weiche wäre die Frage „schreib auf, was geblieben ist“ —
     * und die Antwort auf „7 × 8“ hinge davon ab, ob man die Aufgabe noch
     * weiß. Beim Kopfrechnen ist die Aufgabe der Anker, nicht das Gesuchte.
     */
    expect(isPrompted('math')).toBe(true)
  })

  it('bewertet exakt — 54 ist nicht 56', () => {
    /*
     * Die Tippfehler-Nachsicht („typos“) ist für Wörter gebaut: „Ankre“
     * statt „Anker“ ist dieselbe Erinnerung. Bei einer Zahl ist eine
     * abweichende Ziffer eine andere Zahl (D-012).
     */
    expect(leniencyFor('math', alle[0] as string)).toBe('exact')
  })

  it('gibt als Ziel immer eine Zahl — darauf beruht die Zifferntastatur', () => {
    /*
     * Die Oberfläche schaltet für dieses Modul ohne weitere Prüfung auf
     * `inputMode="numeric"`. Diese Zeile ist die Begründung dafür: Es gibt
     * im ganzen Vorrat kein Stück, dessen Antwort keine Zahl ist. Käme je
     * eine Stufe mit einer Wortantwort dazu, wird dieser Test rot — und
     * nicht erst der Nutzer am Telefon.
     */
    for (const item of alle) expect(targetOf('math', item, 'de'), item).toMatch(/^\d+$/u)
  })

  it('zeigt in der Zusammenfassung beide Seiten', () => {
    // Sonst stünde am Ende „56“ da, und niemand wüsste, wozu.
    const item = alle[0] as string
    expect(displayOf('math', item, 'de')).toBe(`${frage(item)} · ${antwort(item)}`)
  })

  it('kommt wieder — es ist Stoff mit Termin, das ist der ganze Punkt', () => {
    expect(entersReview('math')).toBe(true)
  })

  it('bekommt die Zeit eines eigenen Paars, nicht die eines Wortes', () => {
    /*
     * Eine Brücke zwischen „7 × 8“ und „56“ zu erfinden ist dieselbe Arbeit
     * wie bei einer eigenen Karte — und mehr als ein Wort anzusehen. Wer
     * stattdessen ausrechnet, braucht die Zeit erst recht.
     */
    expect(secondsPerItemFor('math')).toBe(secondsPerItemFor('facts'))
    expect(secondsPerItemFor('math')).toBeGreaterThan(secondsPerItemFor('words'))
  })
})
