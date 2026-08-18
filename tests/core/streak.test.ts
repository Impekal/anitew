import { describe, expect, it } from 'vitest'

import { DAYS_PER_SHIELD, MAX_SHIELDS, streakOf } from '../../src/core/progress/streak.ts'
import { addDays } from '../../src/core/time.ts'

/** Eine Reihe aufeinanderfolgender Tage, endend am angegebenen Tag. */
const runUntil = (last: string, count: number) =>
  Array.from({ length: count }, (_, index) => addDays(last, index - count + 1))

describe('die Serie (K2, D-008)', () => {
  const today = '2026-08-17'

  it('ist leer, solange nichts trainiert wurde', () => {
    expect(streakOf([], today)).toEqual({
      length: 0,
      trainedToday: false,
      shields: 0,
      shieldsUsed: 0,
      best: 0,
      heldYesterday: false,
    })
  })

  it('zählt aufeinanderfolgende Tage', () => {
    const streak = streakOf(runUntil(today, 3), today)
    expect(streak.length).toBe(3)
    expect(streak.trainedToday).toBe(true)
  })

  it('macht aus zwei Einheiten an einem Tag keinen zweiten Tag', () => {
    expect(streakOf([today, today, today], today).length).toBe(1)
  })

  it('lässt den heutigen Tag offen, statt ihn als verpasst zu werten', () => {
    /*
     * Ohne diese Ausnahme wäre jeder Morgen ein verpasster Tag: Die App würde
     * beim Öffnen einen Schutztag verbrauchen, bevor der Nutzer überhaupt die
     * Gelegenheit hatte zu trainieren.
     */
    const streak = streakOf(runUntil(addDays(today, -1), 5), today)
    expect(streak.length).toBe(5)
    expect(streak.trainedToday).toBe(false)
    expect(streak.shieldsUsed).toBe(0)
  })

  it('verdient je sieben Trainingstage einen Schutztag', () => {
    expect(streakOf(runUntil(today, DAYS_PER_SHIELD - 1), today).shields).toBe(0)
    expect(streakOf(runUntil(today, DAYS_PER_SHIELD), today).shields).toBe(1)
    expect(streakOf(runUntil(today, DAYS_PER_SHIELD * 2), today).shields).toBe(2)
  })

  it('spart höchstens zwei an', () => {
    // Nicht kaufbar, nicht durch Werbung verdienbar — und auch nicht endlos
    // ansparbar, sonst wäre die Serie irgendwann nicht mehr zu verlieren und
    // sagte gar nichts mehr.
    expect(streakOf(runUntil(today, DAYS_PER_SHIELD * 9), today).shields).toBe(MAX_SHIELDS)
  })

  it('überbrückt einen verpassten Tag mit einem Schutztag', () => {
    /*
     * Der Kern von D-008: Ein verpasster Tag vernichtet keine sechzig. Die
     * Serie wächst an dem Tag nicht — trainiert wurde ja nicht —, aber sie
     * reißt auch nicht.
     */
    const days = [...runUntil(addDays(today, -2), 7), today]
    const streak = streakOf(days, today)
    expect(streak.length).toBe(8)
    expect(streak.shieldsUsed).toBe(1)
    expect(streak.shields).toBe(0)
  })

  it('reißt, wenn kein Schutztag da ist', () => {
    // Drei Tage, dann eine Lücke, dann heute: Für einen Schutztag hätte es
    // sieben Tage gebraucht.
    const days = [...runUntil(addDays(today, -2), 3), today]
    const streak = streakOf(days, today)
    expect(streak.length).toBe(1)
    expect(streak.best).toBe(3)
  })

  it('nimmt der neuen Serie den alten Vorrat', () => {
    /*
     * Was angespart war, gehörte zu einer Serie, die es nicht mehr gibt. Den
     * Vorrat mitzunehmen hieße, eine Serie zu belohnen, die gerissen ist.
     */
    const days = [...runUntil(addDays(today, -10), 14), today]
    const streak = streakOf(days, today)
    expect(streak.length).toBe(1)
    expect(streak.shields).toBe(0)
  })

  it('merkt sich den persönlichen Rekord über den Bruch hinweg (K5)', () => {
    const days = [...runUntil(addDays(today, -20), 12), today]
    expect(streakOf(days, today).best).toBe(12)
    expect(streakOf(days, today).length).toBe(1)
  })

  it('lässt sich von einer verstellten Uhr nicht anlügen', () => {
    // Tage aus der Zukunft werden übergangen (P5): Eine Serie, die es nicht
    // gibt, darf nicht dadurch entstehen, dass jemand die Uhr vorstellt.
    const days = [...runUntil(today, 3), addDays(today, 5), addDays(today, 6)]
    expect(streakOf(days, today).length).toBe(3)
  })

  it('kommt mit unsortierten Tagen zurecht', () => {
    const days = runUntil(today, 5)
    const shuffled = [days[3], days[0], days[4], days[1], days[2]] as string[]
    expect(streakOf(shuffled, today)).toEqual(streakOf(days, today))
  })

  it('rechnet auch über einen Monatswechsel richtig', () => {
    // Der Tagesschlüssel ist Text; ohne echte Datumsrechnung endete die Serie
    // am Monatsersten.
    const streak = streakOf(runUntil('2026-09-02', 4), '2026-09-02')
    expect(streak.length).toBe(4)
  })
})

describe('die Nachricht nach einem verpassten Tag (D-008)', () => {
  const today = '2026-08-17'

  it('sagt es, wenn gestern ein Schutztag eingesprungen ist', () => {
    // Genau an dem Tag, an dem es zählt. Drei Wochen später wäre derselbe
    // Satz nur noch Möbel.
    const days = [...runUntil(addDays(today, -2), 7), today]
    expect(streakOf(days, today).heldYesterday).toBe(true)
  })

  it('schweigt, wenn die Lücke länger her ist', () => {
    // Sieben Tage bis vorgestern-minus-drei, eine Lücke, dann vier Tage bis
    // heute: Der Schutztag wurde gebraucht, aber nicht gestern.
    const days = [...runUntil(addDays(today, -5), 7), ...runUntil(today, 4)]
    const streak = streakOf(days, today)
    expect(streak.shieldsUsed).toBe(1)
    expect(streak.heldYesterday).toBe(false)
  })

  it('schweigt, wenn die Serie gerissen ist', () => {
    const days = [...runUntil(addDays(today, -2), 3), today]
    expect(streakOf(days, today).heldYesterday).toBe(false)
  })
})
