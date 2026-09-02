/**
 * Eigene Inhalte müssen über Geräte hinweg ankommen (G3 · I · N9 · D-033).
 *
 * Nutzerfrage vom 01.09.: „Bin ich bei jeder Anmeldung — neues Gerät,
 * Webseite, gleiches Gerät — exakt im gleichen Stand, und sind meine
 * eigenen Daten zur Erinnerung auch da?“
 *
 * Trainingsgeschichte, Termine, Benchmarks und der Memory-Graph wandern
 * längst mit. Zwei Dinge nicht: die selbst angelegten **Paläste** und die
 * selbst eingegebenen **Frage-Antwort-Paare**. Beide liegen als Einstellung
 * in der Datenbank, und für Einstellungen gilt beim stillen Drive-Abgleich
 * „lokal gewinnt“ — richtig für eine Vorliebe, falsch für Inhalt.
 *
 * `data/palace.ts` sagt im eigenen Kopfkommentar, warum das wiegt: „Wer sich
 * Orte seiner eigenen Wohnung überlegt und sie bei einem Gerätewechsel
 * verliert, legt sie kein zweites Mal an.“
 *
 * ── Was hier bewusst NICHT verlangt wird ──────────────────────────────────
 *
 * Dass ein fremder Palast einen gleichnamigen lokalen ersetzt. Zwei Geräte
 * vergeben ihre Kennungen unabhängig (`nextOrdinal` je Gerät), zwei Paläste
 * können also beide `own2` heißen und trotzdem verschiedene sein. In dem Fall
 * bleibt der lokale stehen — kein Gerät verliert etwas, und beide Geräte
 * kommen ohne Absprache zum selben Ergebnis.
 */

import { describe, expect, it } from 'vitest'

import { OWN_MAX_PALACES, activeOwnFacts, activeOwnPalaces } from '../../src/core/index.ts'
import { mergeDriveSettingValue } from '../../src/core/sync/settings.ts'

const palast = (id: string, name: string) => ({
  id,
  name,
  stations: [
    { id: 1, label: `${name} eins` },
    { id: 2, label: `${name} zwei` },
    { id: 3, label: `${name} drei` },
    { id: 4, label: `${name} vier` },
    { id: 5, label: `${name} fünf` },
  ],
  nextStation: 6,
})

const speicher = (palaces: readonly ReturnType<typeof palast>[], nextOrdinal: number) => ({
  palaces,
  nextOrdinal,
})

describe('Eigene Paläste über zwei Geräte', () => {
  it('bringt den Palast des anderen Geräts mit, statt ihn zu unterschlagen', () => {
    const lokal = speicher([palast('own', 'Wohnung')], 2)
    const drive = speicher([palast('own2', 'Büro')], 3)

    const merged = mergeDriveSettingValue('palace.own.v2', lokal, drive) as typeof lokal

    expect(merged.palaces.map((entry) => entry.id)).toEqual(['own', 'own2'])
    expect(merged.palaces.map((entry) => entry.name)).toEqual(['Wohnung', 'Büro'])
  })

  it('lässt bei gleicher Kennung den lokalen Palast stehen — niemand verliert etwas', () => {
    const lokal = speicher([palast('own2', 'Büro')], 3)
    const drive = speicher([palast('own2', 'Werkstatt')], 3)

    const merged = mergeDriveSettingValue('palace.own.v2', lokal, drive) as typeof lokal

    expect(merged.palaces).toHaveLength(1)
    expect(merged.palaces[0]?.name).toBe('Büro')
  })

  it('schiebt die nächste Kennung hinter alles, was schon vergeben ist', () => {
    const lokal = speicher([palast('own', 'Wohnung')], 2)
    const drive = speicher([palast('own', 'Wohnung'), palast('own5', 'Bahnhof')], 6)

    const merged = mergeDriveSettingValue('palace.own.v2', lokal, drive) as typeof lokal

    // Sonst hieße der nächste eigene Palast wieder `own5` — und erbte dessen Termine.
    expect(merged.nextOrdinal).toBe(6)
  })

  it('hält die Obergrenze ein, statt sie über den Abgleich zu umgehen', () => {
    const viele = Array.from({ length: OWN_MAX_PALACES }, (_, index) =>
      palast(index === 0 ? 'own' : `own${index + 1}`, `Ort ${index + 1}`),
    )
    const drive = speicher([palast('own99', 'Zuviel')], 100)

    const merged = mergeDriveSettingValue(
      'palace.own.v2',
      speicher(viele, OWN_MAX_PALACES + 1),
      drive,
    ) as ReturnType<typeof speicher>

    expect(merged.palaces).toHaveLength(OWN_MAX_PALACES)
  })

  it('gibt bei unlesbarem Drive-Wert den lokalen Stand zurück, statt ihn zu leeren', () => {
    const lokal = speicher([palast('own', 'Wohnung')], 2)
    expect(mergeDriveSettingValue('palace.own.v2', lokal, 'kaputt')).toBe(lokal)
    expect(mergeDriveSettingValue('palace.own.v2', lokal, undefined)).toBe(lokal)
  })
})

describe('Eigene Frage-Antwort-Paare über zwei Geräte', () => {
  it('bringt die Paare des anderen Geräts mit', () => {
    const lokal = [{ prompt: 'Hauptstadt von Peru', answer: 'Lima' }]
    const drive = [{ prompt: 'PIN Fahrrad', answer: '4711' }]

    const merged = mergeDriveSettingValue('own.facts.de', lokal, drive) as typeof lokal

    expect(merged.map((fact) => fact.prompt)).toEqual(['Hauptstadt von Peru', 'PIN Fahrrad'])
  })

  it('legt dieselbe Frage nicht zweimal ab', () => {
    const lokal = [{ prompt: 'Hauptstadt von Peru', answer: 'Lima' }]
    const drive = [{ prompt: 'Hauptstadt von Peru', answer: 'Lima' }]

    const merged = mergeDriveSettingValue('own.facts.de', lokal, drive) as typeof lokal

    expect(merged).toHaveLength(1)
  })

  it('rührt eine andere Trainingssprache nicht an', () => {
    const merged = mergeDriveSettingValue(
      'own.facts.fr',
      [{ prompt: 'Capitale du Pérou', answer: 'Lima' }],
      [{ prompt: 'Code du vélo', answer: '4711' }],
    ) as readonly { prompt: string }[]

    expect(merged).toHaveLength(2)
  })

  it('lässt Unlesbares den lokalen Stand nicht leeren', () => {
    const lokal = [{ prompt: 'Hauptstadt von Peru', answer: 'Lima' }]
    expect(mergeDriveSettingValue('own.facts.de', lokal, { nichts: true })).toBe(lokal)
  })
})

describe('Weggeworfenes bleibt weg', () => {
  it('vereinigt die Merkzettel des Weggeworfenen und behält den jüngeren Zeitpunkt', () => {
    const merged = mergeDriveSettingValue(
      'palace.own.removed',
      { own2: 100, own3: 500 },
      { own2: 300, own4: 700 },
    ) as Record<string, number>

    expect(merged).toEqual({ own2: 300, own3: 500, own4: 700 })
  })

  it('führt auch den Merkzettel gelöschter Paare zusammen', () => {
    const merged = mergeDriveSettingValue(
      'own.facts.removed.de',
      { 'PIN Fahrrad': 100 },
      { 'PIN Tresor': 200 },
    ) as Record<string, number>

    expect(merged).toEqual({ 'PIN Fahrrad': 100, 'PIN Tresor': 200 })
  })
})

/**
 * Der Merkzettel nützt nur, wenn ihn jemand liest. Beide Speicher tun das
 * beim Laden — deshalb steht die Regel hier, browserfrei und prüfbar (D-010).
 */
describe('Der Merkzettel wirkt beim Laden', () => {
  it('lässt einen weggeworfenen Palast nicht wieder auftauchen', () => {
    const store = { palaces: [palast('own', 'Wohnung'), palast('own2', 'Büro')], nextOrdinal: 3 }

    const active = activeOwnPalaces(store, { own2: 500 })

    expect(active.palaces.map((entry) => entry.id)).toEqual(['own'])
    // Die nächste Nummer bleibt, wo sie war: `own2` darf nie neu vergeben werden.
    expect(active.nextOrdinal).toBe(3)
  })

  it('lässt ein weggeworfenes Paar nicht wieder auftauchen', () => {
    const facts = [
      { prompt: 'Hauptstadt von Peru', answer: 'Lima' },
      { prompt: 'PIN Fahrrad', answer: '4711' },
    ]

    expect(activeOwnFacts(facts, { 'PIN Fahrrad': 500 })).toEqual([
      { prompt: 'Hauptstadt von Peru', answer: 'Lima' },
    ])
  })

  it('kommt ohne Merkzettel aus — der Normalfall bleibt unangetastet', () => {
    const facts = [{ prompt: 'Hauptstadt von Peru', answer: 'Lima' }]
    expect(activeOwnFacts(facts, undefined)).toEqual(facts)

    const store = { palaces: [palast('own', 'Wohnung')], nextOrdinal: 2 }
    expect(activeOwnPalaces(store, undefined).palaces).toHaveLength(1)
  })
})

/**
 * Eine berichtigte Antwort muss beim zweiten Gerät ankommen
 * (Nutzerwunsch 02.09., zusammen mit der Frage vom 01.09.).
 *
 * Die Frage ist der Schlüssel eines Paares. Ändert jemand nur die **Antwort**
 * — der gemeldete Fall, ein Tippfehler —, bleibt die Frage stehen, und beim
 * Abgleich trafen zwei Karten mit derselben Frage aufeinander. Bis zum
 * 02.09. gewann stur die lokale: Wer den Tippfehler auf dem Telefon
 * berichtigte, fand ihn am Rechner für immer wieder. Der Kommentar an
 * `mergeOwnFacts` begründete das mit „Es gibt keinen Weg, eine Antwort zu
 * ändern“ — seit dem Berichtigen stimmt dieser Satz nicht mehr.
 */
describe('Eine berichtigte Antwort reist zum zweiten Gerät', () => {
  const frage = 'Hauptstadt von Peru'

  it('setzt die jüngere Berichtigung gegen die alte Antwort durch', () => {
    const hier = [{ prompt: frage, answer: 'Limaa' }]
    const dort = [{ prompt: frage, answer: 'Lima', editedAt: 1_700_000_000_000 }]

    expect(
      mergeDriveSettingValue('own.facts.de', hier, dort),
      'die Berichtigung ist unterwegs verloren gegangen',
    ).toEqual([{ prompt: frage, answer: 'Lima', editedAt: 1_700_000_000_000 }])
  })

  it('lässt die eigene, jüngere Berichtigung stehen', () => {
    const hier = [{ prompt: frage, answer: 'Lima', editedAt: 1_700_000_100_000 }]
    const dort = [{ prompt: frage, answer: 'Limaa', editedAt: 1_700_000_000_000 }]

    expect(mergeDriveSettingValue('own.facts.de', hier, dort)).toEqual(hier)
  })

  it('lässt Karten ohne Marke beim Alten — lokal gewinnt wie bisher', () => {
    const hier = [{ prompt: frage, answer: 'Limaa' }]
    const dort = [{ prompt: frage, answer: 'Lima' }]

    expect(mergeDriveSettingValue('own.facts.de', hier, dort)).toEqual(hier)
  })
})
