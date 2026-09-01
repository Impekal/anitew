import { describe, expect, it } from 'vitest'

import { numberPool } from '../../src/core/content/numbers.ts'
import { wordPool } from '../../src/core/content/words.ts'
import { nextToTeach } from '../../src/core/technique/major.ts'
import { planSession, type Pools } from '../../src/core/session/plan.ts'

/**
 * Erst das Verfahren erklären, dann es anwenden lassen (Gerätemeldung 01.09.).
 *
 * Gemeldet wurde: „Man sagt plötzlich ‚die kleine 2 hat 2 Striche wie n‘ und
 * dann wird von einem erwartet, dass man 6-stellige Zahlen inklusive 2 behält
 * und man sagt bloß ‚mach einen Satz daraus‘. Da hat man keine Ahnung, worum
 * es geht.“
 *
 * Der Befund ist im Planer prüfbar und keine Geschmacksfrage: Palast,
 * Geschichte und Verknüpfung bekommen je eine **Verfahrenslektion** —
 * Überschrift, drei Schritte, ein Satz zum Anpacken. Das Major-System, die
 * Technik mit den meisten Teilen, bekommt keine: Seine erste Lektion ist
 * bereits die Ziffer 1. Was das Verfahren überhaupt ist (Ziffer → Laut →
 * Wort → Bild, zehn Ziffern nacheinander), steht nirgends als eigener
 * Schritt.
 */

function pools(): Pools {
  return {
    words: [...wordPool('de')],
    faces: [],
    numbers: [...numberPool('major-lehre', 60)],
    missions: [],
    palace: [],
    reverse: [],
    twins: [],
    gaze: [],
    facts: [],
    memory: [],
  }
}

/** Eine Einheit, in der nur noch das Major-System zu lehren ist. */
function planNumbers(options: {
  seed: string
  taught: readonly number[]
  majorMethodTaught: boolean
}) {
  return planSession({
    mode: 'daily',
    day: '2026-09-01',
    language: 'de',
    seed: options.seed,
    pools: pools(),
    modules: ['numbers'],
    taught: options.taught,
    majorMethodTaught: options.majorMethodTaught,
    // Die drei anderen Techniken gelten als erklärt — diese Prüfung handelt
    // vom Major-System, und ihre Lektionen hätten sonst Vorrang.
    palaceTaught: true,
    storyTaught: true,
    linkTaught: true,
  })
}

const lessonIds = (plan: ReturnType<typeof planNumbers>): string[] =>
  plan.blocks.filter((block) => block.kind === 'teach').map((block) => block.id)

describe('Major-System: erst das Verfahren, dann die Ziffern (D5)', () => {
  it('erklärt das Verfahren, bevor die erste Ziffer verlangt wird', () => {
    const plan = planNumbers({ seed: 'verfahren', taught: [], majorMethodTaught: false })

    // Zuerst das Verfahren, in derselben Einheit direkt danach die Ziffer:
    // Eine Erklärung, die einen Tag vor ihrer Anwendung liegt, hat man bei
    // der Anwendung nicht gehabt — derselbe Grund, aus dem die Lektion
    // ohnehin vor der ersten Runde steht.
    expect(lessonIds(plan)).toEqual(['teach-major-method', 'teach-major'])
  })

  it('erklärt das Verfahren genau einmal', () => {
    const plan = planNumbers({ seed: 'verfahren', taught: [1, 2], majorMethodTaught: true })

    expect(lessonIds(plan)).toEqual(['teach-major'])
  })

  it('holt die Erklärung nach, wenn schon Ziffern gelernt sind', () => {
    // Der Fall des Melders: Er steht bei der zweiten Ziffer und hat das
    // Verfahren nie erklärt bekommen — es gab keine Lektion dafür. Fehlt der
    // Wert dagegen ganz (alter Aufrufer, noch keine Antwort aus der
    // Datenbank), bleibt alles beim Alten: Dann wird das Verfahren nicht
    // gelehrt, aber auch keine Ziffernlektion unterschlagen.
    const plan = planNumbers({ seed: 'nachholen', taught: [1], majorMethodTaught: false })

    expect(lessonIds(plan)).toEqual(['teach-major-method', 'teach-major'])
  })

  /**
   * Bestandszusicherung, kein Nachweis einer Behebung.
   *
   * Diese Prüfung war beim Schreiben bereits grün — die Übungszahlen
   * enthielten die frisch gelehrte Ziffer schon. Sie bleibt trotzdem stehen,
   * weil der Umbau oben die Lehrblöcke **umsortiert**, und genau daran hängt,
   * welche Zahlen in Runde 1 landen. Ginge das kaputt, lehrte die App eine
   * Brücke und zeigte sofort eine Zahl, auf die sie nicht passt.
   */
  it('zeigt nach der Lektion eine Zahl, in der die gelehrte Ziffer vorkommt', () => {
    let geprüft = 0
    const ohne: string[] = []

    for (let index = 0; index < 60; index++) {
      const plan = planNumbers({ seed: `lehre-${index}`, taught: [], majorMethodTaught: true })

      const lektion = plan.blocks.find((block) => block.kind === 'teach')
      if (lektion === undefined) continue
      const ziffer = String(nextToTeach([]))
      expect(lektion.items[0]).toBe(ziffer)

      const anwendung = plan.blocks.find(
        (block) => block.kind === 'encode' && block.moduleId === 'numbers',
      )
      if (anwendung === undefined) continue

      geprüft++
      const trifft = anwendung.items.some((item) => item.includes(ziffer))
      if (!trifft) ohne.push(`${ziffer}: ${anwendung.items.join(', ')}`)
    }

    expect(geprüft).toBeGreaterThan(30)
    expect(ohne.slice(0, 5).join(' | ')).toBe('')
  })
})
