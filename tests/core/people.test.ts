import { describe, expect, it } from 'vitest'

import {
  AFRICAN_ORIGINS,
  PEOPLE,
  PERSON_FIELDS,
  PERSON_ORIGINS,
  hasPeoplePool,
  peoplePool,
  personAnswer,
  personFieldWord,
  personOriginWord,
} from '../../src/core/content/people.ts'
import { OWN_SEPARATOR, factAnswer, factPrompt } from '../../src/core/content/own.ts'
import { personYearOf } from '../../src/core/content/peopleCard.ts'
import {
  displayOf,
  entersReview,
  isPrompted,
  leniencyFor,
  planSession,
  subjectOf,
  targetOf,
} from '../../src/core/index.ts'
import type { Language } from '../../src/core/language.ts'

/**
 * Bekannte Persönlichkeiten als Fakten (Nutzerwunsch 02.09.).
 *
 * Diese Datei bewacht vor allem eines: dass das Modul nichts Falsches
 * einübt. Eine Gedächtnis-App, die einem ein falsches Jahr beibringt, ist
 * schlimmer als eine ohne dieses Modul — wer es einmal gelernt hat, trägt es
 * jahrelang mit sich.
 *
 * Was Tests dabei leisten können und was nicht: Ob Lionel Messi 1987 geboren
 * ist, kann kein Test wissen. **Die Liste liest ein Mensch gegen** (USER
 * ACTION). Prüfbar ist alles darum herum — dass keine Angabe fehlt, keine
 * doppelt ist, keine Übersetzung ausfällt und kein Alter statt eines
 * Jahrgangs in die Daten rutscht.
 */

const SPRACHEN: readonly Language[] = ['de', 'en', 'fr', 'es', 'it', 'pt']

describe('die Persönlichkeiten selbst', () => {
  it('nennen ein Geburtsjahr, nie ein Alter', () => {
    /*
     * Der Fehler, aus dem das Modul entstanden ist: Im Wunsch des Nutzers
     * stand „Mark Zuckerberg, 40ans". Das war schon beim Aufschreiben
     * veraltet. Ein Alter ist eine kleine Zahl und verfällt jährlich; ein
     * Jahrgang ist vierstellig und verfällt nie. Diese Prüfung ist die
     * Grenze zwischen beidem.
     */
    for (const person of PEOPLE) {
      expect(person.born, `${person.name}: kein vierstelliges Jahr`).toBeGreaterThan(1400)
      expect(person.born, `${person.name}: Jahr liegt in der Zukunft`).toBeLessThan(2015)
    }
  })

  it('stehen jeder nur einmal da', () => {
    const namen = PEOPLE.map((person) => person.name)
    expect(new Set(namen).size, 'ein Name kommt doppelt vor').toBe(namen.length)
  })

  it('führen nur Fächer und Herkünfte, die es auch gibt', () => {
    for (const person of PEOPLE) {
      expect(PERSON_FIELDS, `${person.name}: unbekanntes Fach`).toContain(person.field)
      expect(PERSON_ORIGINS, `${person.name}: unbekannte Herkunft`).toContain(person.origin)
    }
  })

  it('bleiben gemischt — nicht ein Fach, nicht ein Jahrzehnt', () => {
    /*
     * Wer nur Fußballer lernte, lernte am Ende die Position in der Liste
     * statt der Person. Die Zahlen sind bewusst niedrig gesetzt: Sie sollen
     * eine einseitige Liste abfangen, nicht eine Quote vorschreiben.
     */
    const faecher = new Set(PEOPLE.map((person) => person.field))
    expect(faecher.size, 'zu wenige verschiedene Fächer').toBeGreaterThanOrEqual(8)
    const jahrhunderte = new Set(PEOPLE.map((person) => Math.floor(person.born / 100)))
    expect(jahrhunderte.size, 'alle aus derselben Zeit').toBeGreaterThanOrEqual(3)
    const herkuenfte = new Set(PEOPLE.map((person) => person.origin))
    expect(herkuenfte.size, 'zu wenige verschiedene Herkünfte').toBeGreaterThanOrEqual(10)
  })

  it('reichen für mehr als ein paar Tage', () => {
    expect(PEOPLE.length).toBeGreaterThanOrEqual(24)
  })

  it('zeigen nicht nur Europa und Nordamerika', () => {
    /*
     * Vorgabe des Nutzers vom 02.09.: „In der Liste von Prominenten müssen
     * auch viele Afrikaner und schwarze Menschen sein: beides insgesamt
     * mindestens 50%."
     *
     * Geprüft wird hier die Hälfte, die sich prüfen lässt: der Anteil der
     * Menschen aus Afrika. Er steht in `origin` und ist eine Tatsache.
     *
     * Die andere Hälfte — schwarze Menschen außerhalb Afrikas — wird
     * **absichtlich nicht** geprüft. Dafür müsste in den Daten stehen, wen
     * die App für schwarz hält; das wäre eine Behauptung über reale Personen,
     * die für die Aufgabe (Name, Jahr, Fach, Herkunft) niemand braucht. Sie
     * ist erfüllt, aber sie wird von Menschen nachgehalten, nicht von diesem
     * Test.
     *
     * Ein Drittel als Schwelle, obwohl die Liste darüber liegt: Der Wächter
     * soll ein Abrutschen fangen, nicht eine Quote festschreiben.
     */
    const ausAfrika = PEOPLE.filter((person) => AFRICAN_ORIGINS.includes(person.origin))
    expect(
      ausAfrika.length / PEOPLE.length,
      `nur ${ausAfrika.length} von ${PEOPLE.length} aus Afrika`,
    ).toBeGreaterThanOrEqual(1 / 3)
    // Und nicht alle aus einem Land: Afrika ist keine Gegend.
    expect(new Set(ausAfrika.map((person) => person.origin)).size).toBeGreaterThanOrEqual(8)
  })
})

describe('die Übersetzung', () => {
  it('lässt in keiner der sechs Sprachen ein Wort aus', () => {
    /*
     * Nachgeschlagen wird in den Tabellen, nicht im fertigen Satz.
     *
     * Der erste Anlauf suchte im Satz nach der Kennung — und fiel sofort auf
     * die Nase: Auf Englisch **ist** `painting` das richtige Wort.
     * „1452 · painting · Italy" ist einmal richtig und einmal ein stiller
     * Ausfall, und von außen sehen beide gleich aus. Eine Lücke bleibt nur
     * dort eine Lücke, wo nachgeschlagen wird.
     */
    for (const sprache of SPRACHEN) {
      expect(hasPeoplePool(sprache), `${sprache} fehlt ganz`).toBe(true)
      for (const fach of PERSON_FIELDS) {
        expect(personFieldWord(fach, sprache), `${sprache}: Fach ${fach} fehlt`).toBeDefined()
      }
      for (const herkunft of PERSON_ORIGINS) {
        expect(
          personOriginWord(herkunft, sprache),
          `${sprache}: Herkunft ${herkunft} fehlt`,
        ).toBeDefined()
      }
      for (const person of PEOPLE) {
        expect(personAnswer(person, sprache), `${sprache}/${person.name}: Jahr fehlt`).toContain(
          String(person.born),
        )
      }
    }
  })

  it('schweigt in einer Sprache, die sie nicht kann, statt englisch dazwischenzureden', () => {
    // Türkisch ist als App-Sprache vorgesehen, aber hier nicht übersetzt.
    expect(hasPeoplePool('tr')).toBe(false)
    expect(peoplePool('tr', 'egal')).toHaveLength(0)
  })
})

describe('der Vorrat', () => {
  it('gibt Karten in der Form, die das Modul liest', () => {
    const karten = peoplePool('de', 'seed-1')
    expect(karten).toHaveLength(PEOPLE.length)
    const namen = karten.map(factPrompt)
    expect(new Set(namen).size).toBe(PEOPLE.length)
    for (const karte of karten) {
      expect(factAnswer(karte), 'die Antwortseite fehlt').not.toBe(karte)
      expect(factAnswer(karte)).toMatch(/^\d{4} · .+ · .+$/u)
    }
  })

  it('mischt aus dem Seed — gleicher Seed, gleiche Reihenfolge', () => {
    /*
     * Ohne Mischen käme die Liste immer gleich, und nach zwei Wochen lernte
     * man die Reihenfolge mit statt der Personen. Mit `Math.random()` wäre
     * die Einheit nicht wiederholbar (A11).
     */
    expect(peoplePool('de', 'seed-1')).toEqual(peoplePool('de', 'seed-1'))
    expect(peoplePool('de', 'seed-1')).not.toEqual(peoplePool('de', 'seed-2'))
  })

  it('spricht die Trainingssprache, nicht die des Autors', () => {
    const de = peoplePool('de', 'gleich')
    const fr = peoplePool('fr', 'gleich')
    expect(de.map(factPrompt), 'Namen werden nicht übersetzt').toEqual(fr.map(factPrompt))
    expect(de.map(factAnswer)).not.toEqual(fr.map(factAnswer))
  })
})

describe('das Modul in der Einheit', () => {
  it('fragt nach dem Jahr und bewertet es genau', () => {
    /*
     * Die zwei Entscheidungen, die das Modul brauchbar machen — und beide
     * wären still falsch, wenn niemand sie prüft:
     *
     * Gefragt ist **das Jahr**, nicht die ganze Karte. Wer drei Angaben samt
     * Trennpunkten tippen müsste, machte eine Tastaturübung.
     *
     * Bewertet wird **genau**. 1984 und 1948 sind nicht derselbe Jahrgang;
     * mit Tippfehler-Nachsicht bekäme man für den falschen Jahrgang einen
     * Punkt, und das Modul vergäbe Punkte für nichts.
     */
    const karte = peoplePool('de', 'seed-1')[0] as string
    const jahr = personYearOf(karte)
    expect(jahr).toMatch(/^\d{4}$/u)
    expect(targetOf('people', karte, 'de')).toBe(jahr)
    expect(leniencyFor('people', karte)).toBe('exact')
  })

  it('zeigt in der Zusammenfassung die ganze Karte, nicht die Kennung', () => {
    // Die Kennung trägt ein unsichtbares Trennzeichen. Stünde sie in der
    // Zusammenfassung, sähe der Mensch dort zwei zusammengeklebte Wörter.
    const karte = peoplePool('de', 'seed-1')[0] as string
    const zeile = displayOf('people', karte, 'de')
    expect(zeile).not.toContain(OWN_SEPARATOR)
    expect(zeile).toContain(factPrompt(karte))
    expect(zeile).toContain(personYearOf(karte))
  })

  it('geht in das Wiedersehen ein und fragt nach dem Namen', () => {
    /*
     * `entersReview` ist die Zusage, dass Gelerntes nach Tagen zurückkommt —
     * ohne sie wäre das Modul ein Zeitvertreib. `isPrompted` ist die Aussage,
     * dass der Name dasteht: „Nenne alle Persönlichkeiten" wäre keine Frage.
     * `subjectOf` muss die Karte selbst sein, damit dieselbe Person nicht als
     * neu kommt, während sie einen Termin hat.
     */
    const karte = peoplePool('de', 'seed-1')[0] as string
    expect(entersReview('people')).toBe(true)
    expect(isPrompted('people')).toBe(true)
    expect(subjectOf('people', karte)).toBe(karte)
  })

  it('steht im Bauplan, wenn der Vorrat da ist — und fehlt, wenn er leer ist', () => {
    /*
     * Der eigentliche Beweis, dass das Modul angeschlossen ist: Ein Bauplan
     * mit Vorrat trägt es, einer ohne nicht. Ohne diese Prüfung könnte alles
     * andere stimmen und das Modul trotzdem nie in einer Einheit auftauchen.
     */
    /*
     * Wörter liegen in beiden Bauplänen, damit die Einheit überhaupt
     * zustande kommt: Ohne irgendeinen Vorrat wirft der Planer. Geprüft wird
     * der Unterschied, den allein der Personenvorrat macht.
     */
    const grund = {
      // Reichlich Wörter: Acht waren nach zwei Runden aufgebraucht, und der
      // Planer warf — was nichts über die Persönlichkeiten aussagte.
      words: Array.from({ length: 60 }, (_, i) => `Wort${i}`),
      faces: [], numbers: [], missions: [], palace: [],
      reverse: [], twins: [], gaze: [], facts: [], memory: [],
    }
    const mit = planSession({
      mode: 'daily', day: '2026-09-02', language: 'de', seed: 's',
      pools: { ...grund, people: peoplePool('de', 's') },
      due: {}, modules: ['words', 'people'],
    })
    expect(mit.blocks.some((block) => block.moduleId === 'people')).toBe(true)

    const ohne = planSession({
      mode: 'daily', day: '2026-09-02', language: 'de', seed: 's',
      pools: { ...grund, people: [] },
      due: {}, modules: ['words', 'people'],
    })
    expect(ohne.blocks.some((block) => block.moduleId === 'people')).toBe(false)
  })
})
