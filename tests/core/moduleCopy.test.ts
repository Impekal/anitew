import { describe, expect, it } from 'vitest'

import { TRAINING_MODULES } from '../../src/core/index.ts'
import { de } from '../../src/i18n/de.ts'
import { en } from '../../src/i18n/en.ts'
import { fr } from '../../src/i18n/fr.ts'
import { es } from '../../src/i18n/es.ts'
import { it as itDict } from '../../src/i18n/it.ts'
import { pt } from '../../src/i18n/pt.ts'

/**
 * Jedes Modul hat seine Worte — in allen sechs Sprachen (Fund vom 06.09.).
 *
 * Zwei Lücken sind an einem Tag aufgefallen, beide erst am Bildschirm und
 * beide aus demselben Grund: Die Wörterbücher sind je Modul geschrieben, aber
 * nichts hat je nachgezählt, ob die Liste der Module und die Liste ihrer Texte
 * dieselbe Länge haben.
 *
 *   Einprägen:    Der Querabruf zeigte gar keine Ansage. Gemessen, nicht
 *                 vermutet: `HINT: ""` über einem Paar aus zwei Namen.
 *   Schwerpunkt:  Für „Räume“ und den Querabruf gab es keinen Namen. Der
 *                 Startbildschirm hätte einen leeren Schwerpunkt angekündigt.
 *
 * Beides sind Zeilen, die eine Typprüfung nicht sieht: Am Modulrand ist die
 * Nachschlagetabelle bewusst `Record<string, string>`, weil die vier
 * nachgeladenen Sprachen sonst am Kaltstart hingen.
 */

const WOERTERBUECHER = { de, en, fr, es, it: itDict, pt }

/*
 * „Räume“ hat einen eigenen Einprägebildschirm mit einem Raster statt eines
 * Wortes; seine Beschriftung kommt aus `phases.encode`. Ein Satz in
 * `encodeHints` würde dort nie gezeigt — und ein Text, den niemand sieht,
 * wäre genau die tote Zeile, gegen die dieser Test steht.
 */
const OHNE_EINPRAEGETEXT = new Set(['spatial'])

describe('jedes Modul hat seine Worte', () => {
  it('sagt beim Einprägen, was zu tun ist', () => {
    for (const [sprache, woerterbuch] of Object.entries(WOERTERBUECHER)) {
      const hinweise = woerterbuch.session.encodeHints as unknown as Record<string, string>
      for (const moduleId of TRAINING_MODULES) {
        if (OHNE_EINPRAEGETEXT.has(moduleId)) continue
        expect(
          hinweise[moduleId],
          `${sprache}: kein Einprägetext für „${moduleId}“`,
        ).toBeTruthy()
      }
    }
  })

  it('hat einen Namen für jeden möglichen Schwerpunkt', () => {
    /*
     * Der Startbildschirm kündigt den Schwerpunkt der Einheit an, und jedes
     * Modul kann ihn bekommen (siehe `memory/dailyMission.ts`). Ein fehlender
     * Name wäre dort kein Fehler, sondern eine leere Stelle — das Schlimmste,
     * was eine Ansage sein kann.
     */
    for (const [sprache, woerterbuch] of Object.entries(WOERTERBUECHER)) {
      const namen = woerterbuch.profile.modules as unknown as Record<string, string>
      for (const moduleId of TRAINING_MODULES) {
        expect(namen[moduleId], `${sprache}: kein Name für „${moduleId}“`).toBeTruthy()
      }
    }
  })

  it('schreibt nichts auf, was es gar nicht gibt', () => {
    // Die Gegenrichtung: ein Text für ein Modul, das der Planer nicht kennt,
    // wäre ein Rest aus einer Umbenennung — und niemand fände ihn.
    const bekannt = new Set<string>(TRAINING_MODULES)
    for (const [sprache, woerterbuch] of Object.entries(WOERTERBUECHER)) {
      for (const key of Object.keys(woerterbuch.session.encodeHints)) {
        expect(bekannt.has(key), `${sprache}: „${key}“ ist kein Modul`).toBe(true)
      }
      for (const key of Object.keys(woerterbuch.profile.modules)) {
        expect(bekannt.has(key), `${sprache}: „${key}“ ist kein Modul`).toBe(true)
      }
    }
  })
})
