import { describe, expect, it } from 'vitest'

import { TRAINING_MODULES, composeDailyMission } from '../../src/core/index.ts'

describe('Phase 3 adaptive daily mission', () => {
  it('ordnet mehrere FSRS-fällige Module vor neuem Stoff statt nur einen Sieger zu merken', () => {
    const decision = composeDailyMission({
      seconds: 300,
      dueByModule: { faces: 2, words: 5 },
      personalScenes: 1,
      untrainedPersonalItems: 4,
      dimensions: {},
      interferenceErrors: 0,
    })

    expect(decision).toMatchObject({ focus: 'words', reason: 'due' })
    expect(decision.modules.slice(0, 3)).toEqual(['words', 'faces', 'memory'])
    expect(decision.signals).toEqual(
      expect.arrayContaining([
        { moduleId: 'words', reason: 'due', amount: 5 },
        { moduleId: 'faces', reason: 'due', amount: 2 },
        { moduleId: 'memory', reason: 'personal', amount: 4 },
      ]),
    )
  })

  it('summiert Gründe nicht zu einem erfundenen Adaptiv-Score', () => {
    const decision = composeDailyMission({
      seconds: 300,
      dueByModule: { memory: 1, faces: 2 },
      personalScenes: 2,
      untrainedPersonalItems: 100,
      dimensions: {},
      interferenceErrors: 0,
    })

    // Hundert neue persönliche Items schlagen zwei echte FSRS-Fälligkeiten
    // nicht durch Addition. Timing bleibt die stärkste vorhandene Wahrheit.
    expect(decision.focus).toBe('faces')
    expect(decision.reason).toBe('due')
    expect(decision.modules.slice(0, 2)).toEqual(['faces', 'memory'])
    /*
     * Dahinter der Rest — jedes Modul genau einmal, keines doppelt, keines
     * verloren. Hier stand bis zum 06.09. zusätzlich `'facts'` an dritter
     * Stelle. Das war keine Aussage dieses Tests, sondern der Anfang der
     * handgepflegten Modulliste; sie festzuschreiben hätte den Fund von
     * heute bewacht statt ihn zu verhindern. Welches Modul hinter den
     * belegten Signalen zuerst drankommt, entscheidet ohnehin ein
     * gewürfelter Versatz im Planer (`moduleForRound`).
     */
    expect(new Set(decision.modules).size).toBe(decision.modules.length)
    expect(decision.modules).toHaveLength(TRAINING_MODULES.length)
  })

  it('kann Interferenz und Trainingslücke gleichzeitig in die Rotation einbauen', () => {
    const decision = composeDailyMission({
      seconds: 300,
      dueByModule: {},
      personalScenes: 0,
      untrainedPersonalItems: 0,
      dimensions: {
        words: { chances: 3, lost: 1 },
        faces: { chances: 12, lost: 2 },
      },
      interferenceErrors: 4,
    })

    expect(decision).toMatchObject({ focus: 'twins', reason: 'interference' })
    expect(decision.modules.slice(0, 2)).toEqual(['twins', 'words'])
    expect(decision.signals).toEqual(
      expect.arrayContaining([
        { moduleId: 'twins', reason: 'interference', amount: 4 },
        { moduleId: 'words', reason: 'undertrained', amount: 3 },
      ]),
    )
  })

  it('bleibt balanced, wenn keine belegbare Asymmetrie existiert', () => {
    const decision = composeDailyMission({
      seconds: 300,
      dueByModule: {},
      personalScenes: 0,
      untrainedPersonalItems: 0,
      dimensions: {
        words: { chances: 7, lost: 2 },
        faces: { chances: 7, lost: 4 },
      },
      interferenceErrors: 2,
    })

    expect(decision.focus).toBeUndefined()
    expect(decision.reason).toBe('balanced')
    expect(decision.signals).toEqual([])
  })
})

/**
 * Die Liste, die die App wirklich fragt (Fund vom 06.09.).
 *
 * `App.tsx` reicht `mission.modules` als `modules` an `planSession` weiter.
 * Damit ist diese Liste **die** Antwort auf „woraus besteht eine Einheit“ —
 * und nicht `TRAINING_MODULES`, wie man beim Lesen des Planers annimmt.
 *
 * Gemessen, bevor etwas geändert wurde: In dreißig Einheiten am Bildschirm
 * kamen acht Module vor. `people`, `associative` und `math` kein einziges
 * Mal. Am Kern lag es nicht — dort zieht derselbe Planer sie in 400
 * Einheiten regelmäßig, wenn man ihm die volle Liste gibt.
 *
 * Zwei Listen für dieselbe Sache, und sie sind zweimal auseinandergelaufen:
 * `associative` kam einen Tag nach der letzten Pflege dieser Liste dazu,
 * `people` zwölf Tage später. Beide Male hat es niemand gemerkt, weil nichts
 * es prüfte — die Module gibt es, sie sind vollständig gebaut, getestet und
 * ausgeliefert, und trotzdem hat sie kein Mensch je gesehen.
 */
describe('welche Module die Einheit überhaupt anbietet', () => {
  const alltag = () =>
    composeDailyMission({
      seconds: 300,
      dueByModule: {},
      personalScenes: 0,
      untrainedPersonalItems: 0,
      dimensions: {},
      interferenceErrors: 0,
    })

  it('bietet jedes Trainingsmodul an — sonst ist es gebaut und unsichtbar', () => {
    const angeboten = new Set(alltag().modules)
    for (const moduleId of TRAINING_MODULES) {
      expect(angeboten.has(moduleId), `${moduleId} kommt in keiner Einheit vor`).toBe(true)
    }
  })

  it('erfindet dabei kein Modul, das der Planer nicht kennt', () => {
    // Die Gegenrichtung: Eine Kennung, die hier steht und dort nicht, wäre
    // eine Runde ohne Vorrat.
    const bekannt = new Set<string>(TRAINING_MODULES)
    for (const moduleId of alltag().modules) {
      expect(bekannt.has(moduleId), `${moduleId} ist kein Trainingsmodul`).toBe(true)
    }
  })

  it('lässt einen fälligen Termin auch aus den späten Modulen vorrücken', () => {
    /*
     * Die Fälligkeitsschleife liest dieselbe Liste. Stünde ein Modul nicht
     * darin, käme sein Termin nie zurück — der Eintrag wäre still verloren,
     * obwohl FSRS ihn führt.
     */
    const entschieden = composeDailyMission({
      seconds: 300,
      dueByModule: { people: 3 },
      personalScenes: 0,
      untrainedPersonalItems: 0,
      dimensions: {},
      interferenceErrors: 0,
    })
    expect(entschieden.focus).toBe('people')
    expect(entschieden.reason).toBe('due')
  })
})
