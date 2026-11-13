import { describe, expect, it } from 'vitest'

import { helpCopyFor, type HelpCopy } from '../../src/i18n/helpCopy.ts'

/**
 * Hilfe und Fragen & Antworten in sechs Sprachen (Nutzerwunsch 04.09.).
 *
 * Der wiederkehrende Befund vom Gerät war nie ein Tippfehler, sondern eine
 * Lücke: eine Seite, die auf Französisch geöffnet wird und deutsch antwortet.
 * Genau davor stehen diese Prüfungen — sie messen die Vollständigkeit, nicht
 * die Qualität der Sätze. Ob ein Satz gut übersetzt ist, kann kein Test sagen;
 * dass er überhaupt da und nicht der deutsche ist, schon.
 */

const SPRACHEN = ['de', 'en', 'fr', 'es', 'it', 'pt'] as const

/** Jeder Text der Datei, flach — damit keiner ungeprüft durchrutscht. */
function alleTexte(copy: HelpCopy): string[] {
  return [
    copy.helpHeading,
    copy.helpIntro,
    copy.faqHeading,
    copy.faqIntro,
    copy.evidenceNote,
    ...copy.sections.flatMap((s) => [s.title, ...s.items.flatMap((i) => [i.title, i.body])]),
    ...copy.groups.flatMap((g) => [g.title, ...g.entries.flatMap((e) => [e.q, e.a])]),
  ]
}

describe('die Texte für Hilfe und Fragen', () => {
  it('haben in jeder Sprache denselben Aufbau wie das deutsche Original', () => {
    const de = helpCopyFor('de')
    const form = (copy: HelpCopy) => ({
      abschnitte: copy.sections.map((s) => s.items.length),
      gruppen: copy.groups.map((g) => g.entries.length),
    })
    for (const sprache of SPRACHEN) {
      expect(form(helpCopyFor(sprache)), `${sprache} hat einen anderen Aufbau`).toEqual(form(de))
    }
  })

  it('lassen keinen Satz leer', () => {
    for (const sprache of SPRACHEN) {
      for (const text of alleTexte(helpCopyFor(sprache))) {
        expect(text.trim(), `leerer Text in ${sprache}`).not.toBe('')
      }
    }
  })

  it('sind wirklich übersetzt und nicht abgeschrieben', () => {
    /*
     * Der eigentliche Wächter gegen den Befund vom Gerät. Verglichen wird
     * nicht die Überschrift — „Ajuda" steht auf Portugiesisch wie auf
     * Spanisch fast gleich —, sondern ein langer Satz aus der Mitte: Zwei
     * echte Übersetzungen desselben Absatzes sind nie Zeichen für Zeichen
     * gleich.
     */
    const proben = SPRACHEN.map((sprache) => ({
      sprache,
      satz: helpCopyFor(sprache).sections[0]!.items[0]!.body,
    }))
    for (const a of proben) {
      for (const b of proben) {
        if (a.sprache === b.sprache) continue
        expect(a.satz, `${a.sprache} und ${b.sprache} tragen denselben Satz`).not.toBe(b.satz)
      }
    }
  })

  it('nennt in jeder Sprache, aus welcher Sprache der Name kommt', () => {
    /*
     * Die eine Tatsache in der Namensantwort, die keine Übersetzung verlieren
     * darf: dass „anitew" ein Wort im Twi ist. Alles andere an dem Absatz ist
     * Formulierung — das hier ist die Auskunft.
     *
     * Ohne Rücksicht auf die Schreibung, und das ist keine Lockerung: Das
     * Französische schreibt Sprachnamen klein („en twi"). Die erste Fassung
     * dieser Prüfung war deshalb rot — an einer falschen Annahme über die
     * Rechtschreibung, nicht an einer fehlenden Auskunft.
     */
    for (const sprache of SPRACHEN) {
      const namensfrage = helpCopyFor(sprache).groups[0]!.entries[0]!
      expect(namensfrage.a, `${sprache} verschweigt die Herkunft des Wortes`).toMatch(/twi/iu)
      expect(namensfrage.q, `${sprache} fragt nicht nach dem Namen`).toMatch(/ANITEW/u)
    }
  })

  it('fällt bei einer unbekannten Sprache auf Englisch zurück, nicht ins Leere', () => {
    expect(helpCopyFor('xx').helpHeading).toBe(helpCopyFor('en').helpHeading)
  })
})
