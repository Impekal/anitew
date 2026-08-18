import { describe, expect, it } from 'vitest'

import {
  EVIDENCE_STANDINGS,
  SCIENCE,
  SCIENCE_CLAIMS,
  STANDING_ORDER,
  citationOf,
  claimsWithStanding,
} from '../../src/core/index.ts'
import { de } from '../../src/i18n/de.ts'
import { en } from '../../src/i18n/en.ts'

/**
 * Die Wissenschaftsseite, geprüft wie eine Rechenregel (Backlog F6, R-2).
 *
 * Der Punkt dieser Datei: **Die Ehrlichkeit der Seite darf nicht davon
 * abhängen, dass jemand sie beim Schreiben im Kopf hatte.** Wer eine Aussage
 * hinzufügt, ohne Quelle — oder schlimmer: wer eine Funktion an eine
 * unbelegte Annahme hängt —, bekommt hier einen roten Test und keinen
 * Diskussionsbedarf.
 */

describe('Wissenschaftsseite', () => {
  it('kennt jede Aussage genau einmal', () => {
    expect(SCIENCE.map((claim) => claim.id)).toEqual([...SCIENCE_CLAIMS])
  })

  it('belegt jede Aussage, die etwas über die Studienlage sagt', () => {
    for (const claim of SCIENCE) {
      if (claim.standing === 'unmeasured') continue
      expect(claim.sources.length, `${claim.id} ohne Quelle`).toBeGreaterThan(0)
    }
  })

  it('nennt keine Quelle, wo nichts gemessen wurde', () => {
    /*
     * Andersherum genauso wichtig: „Ob ANITEW deinem Alltag hilft“ mit einer
     * fremden Studie zu unterlegen wäre der eleganteste Weg, R-2 zu brechen —
     * die Aussage bliebe wörtlich richtig und läse sich trotzdem wie ein Beleg.
     */
    for (const claim of claimsWithStanding('unmeasured')) {
      expect(claim.sources, `${claim.id} führt Quellen für Ungemessenes`).toEqual([])
    }
  })

  it('baut nichts auf einer Aussage, die nicht belegt ist', () => {
    for (const claim of SCIENCE) {
      if (claim.standing === 'established' || claim.standing === 'narrow') continue
      expect(claim.restsOn, `${claim.id} trägt eine Funktion, ohne belegt zu sein`).toEqual([])
    }
  })

  it('trägt jede belegte Aussage auch wirklich etwas', () => {
    // Eine Studie, an der nichts hängt, ist Zierde. Die Seite soll erklären,
    // warum die App so gebaut ist — nicht, wie belesen sie ist.
    for (const claim of SCIENCE) {
      if (claim.standing !== 'established' && claim.standing !== 'narrow') continue
      expect(claim.restsOn.length, `${claim.id} hängt an nichts`).toBeGreaterThan(0)
    }
  })

  it('zeigt jeden Stand genau einmal und lässt keinen aus', () => {
    expect([...STANDING_ORDER].sort()).toEqual([...EVIDENCE_STANDINGS].sort())
  })

  it('schreibt eine Quelle vollständig genug zum Nachschlagen', () => {
    for (const claim of SCIENCE) {
      for (const source of claim.sources) {
        const line = citationOf(source)
        expect(line).toContain(String(source.year))
        expect(line).toContain(source.title)
        expect(line).toContain(source.where)
      }
    }
  })

  it('hat für jede Aussage und jeden Stand einen Text in beiden Sprachen', () => {
    /*
     * Der Typ erzwingt das an der Anzeigestelle bereits — dieser Test fängt
     * den Fall, dass ein Schlüssel zwar existiert, aber leer bleibt, weil
     * jemand ihn nur schnell anlegen wollte.
     */
    for (const dictionary of [de, en]) {
      for (const id of SCIENCE_CLAIMS) {
        const text = dictionary.science.claims[id]
        expect(text.title.length, `${id} ohne Überschrift`).toBeGreaterThan(0)
        expect(text.body.length, `${id} ohne Text`).toBeGreaterThan(40)
      }
      for (const standing of EVIDENCE_STANDINGS) {
        expect(dictionary.science.standings[standing].length).toBeGreaterThan(0)
        expect(dictionary.science.standingNotes[standing].length).toBeGreaterThan(0)
      }
    }
  })
})
