import { describe, expect, it } from 'vitest'

import {
  MAX_INTERVAL_DAYS,
  TARGET_RETENTION,
  forgetsInDays,
  isDue,
  newMemory,
  overdueBy,
  review,
} from '../../src/core/scheduler/memory.ts'
import { dueLimitFor, selectDue } from '../../src/core/scheduler/due.ts'
import { addDays, daysBetween } from '../../src/core/time.ts'

const DAY0 = '2026-08-17'

describe('der erste Kontakt', () => {
  it('setzt einen Termin in der Zukunft, wenn es saß', () => {
    const memory = newMemory(DAY0, true)
    expect(daysBetween(DAY0, memory.dueDay)).toBeGreaterThan(0)
    expect(memory.reviews).toBe(1)
    expect(memory.lapses).toBe(0)
  })

  it('fragt früher nach, wenn es nicht saß', () => {
    const kept = newMemory(DAY0, true)
    const lost = newMemory(DAY0, false)
    expect(daysBetween(DAY0, lost.dueDay)).toBeLessThan(daysBetween(DAY0, kept.dueDay))
  })

  it('rät keine Anfangsstabilität, sondern lässt sie aus der Antwort folgen', () => {
    expect(newMemory(DAY0, true).stability).toBeGreaterThan(newMemory(DAY0, false).stability)
  })
})

describe('die Vergessenskurve', () => {
  it('wird mit jedem Erfolg länger', () => {
    // Das Versprechen aus D-004: Wer etwas zehnmal mühelos erinnert, wird
    // seltener gefragt — nicht alle 24 Stunden wie bei einer festen Leiter.
    let memory = newMemory(DAY0, true)
    let day = memory.dueDay
    const intervals: number[] = [forgetsInDays(memory)]

    for (let round = 0; round < 6; round++) {
      memory = review(memory, day, true)
      intervals.push(forgetsInDays(memory))
      day = memory.dueDay
    }

    for (let i = 1; i < intervals.length; i++) {
      expect(intervals[i]!).toBeGreaterThanOrEqual(intervals[i - 1]!)
    }
    // Nach sechs Erfolgen muss deutlich mehr als eine Woche herauskommen,
    // sonst ist der ganze Aufwand gegenüber einer festen Leiter sinnlos.
    expect(intervals[intervals.length - 1]!).toBeGreaterThan(7)
  })

  it('bricht ein, wenn etwas vergessen wurde', () => {
    let memory = newMemory(DAY0, true)
    for (let round = 0; round < 4; round++) memory = review(memory, memory.dueDay, true)
    const before = forgetsInDays(memory)

    const forgotten = review(memory, memory.dueDay, false)
    expect(forgetsInDays(forgotten)).toBeLessThan(before)
    expect(forgotten.lapses).toBe(1)
  })

  it('führt Schwierigkeit je Information getrennt', () => {
    // Zwei Wörter, gleiche Startbedingung, unterschiedlicher Verlauf: Danach
    // dürfen sie nicht denselben Termin haben. Genau das kann eine feste
    // Leiter nicht.
    let leicht = newMemory(DAY0, true)
    let schwer = newMemory(DAY0, true)
    for (let round = 0; round < 3; round++) {
      leicht = review(leicht, leicht.dueDay, true)
      schwer = review(schwer, schwer.dueDay, round % 2 === 0 ? false : true)
    }
    expect(forgetsInDays(leicht)).toBeGreaterThan(forgetsInDays(schwer))
    expect(schwer.difficulty).toBeGreaterThan(leicht.difficulty)
  })

  it('läuft nicht ins Unendliche', () => {
    let memory = newMemory(DAY0, true)
    for (let round = 0; round < 40; round++) memory = review(memory, memory.dueDay, true)
    // +1, weil ts-fsrs die Obergrenze am Anschlag um genau einen Tag
    // überschreitet (nachgemessen, siehe MAX_INTERVAL_DAYS). Die Toleranz ist
    // hier benannt und nicht großzügig geraten — bei zwei Tagen Abweichung
    // soll dieser Test rot werden.
    expect(forgetsInDays(memory)).toBeLessThanOrEqual(MAX_INTERVAL_DAYS + 1)
  })
})

describe('Fälligkeit', () => {
  it('ist am Termin und danach fällig, davor nicht', () => {
    const memory = newMemory(DAY0, true)
    expect(isDue(memory, addDays(memory.dueDay, -1))).toBe(false)
    expect(isDue(memory, memory.dueDay)).toBe(true)
    expect(isDue(memory, addDays(memory.dueDay, 5))).toBe(true)
    expect(overdueBy(memory, addDays(memory.dueDay, 5))).toBe(5)
  })
})

describe('die Auswahl für heute', () => {
  const make = (id: string, dueDay: string) => ({
    itemId: id,
    memory: { ...newMemory(DAY0, true), dueDay },
  })

  it('nimmt das am längsten Überfällige zuerst', () => {
    const items = [make('b', '2026-08-15'), make('a', '2026-08-10'), make('c', '2026-08-17')]
    expect(selectDue(items, '2026-08-17', 3).map((item) => item.itemId)).toEqual(['a', 'b', 'c'])
  })

  it('lässt weg, was noch nicht dran ist', () => {
    const items = [make('a', '2026-08-17'), make('b', '2026-08-20')]
    expect(selectDue(items, '2026-08-17', 5).map((item) => item.itemId)).toEqual(['a'])
  })

  it('deckelt die Menge — sonst steht nach zwei Wochen Pause ein Berg da', () => {
    const items = Array.from({ length: 300 }, (_, index) =>
      make(`w${index.toString().padStart(3, '0')}`, '2026-07-01'),
    )
    expect(selectDue(items, '2026-08-17', 8)).toHaveLength(8)
  })

  it('wählt bei gleichem Rückstand reproduzierbar', () => {
    const items = [make('zebra', '2026-08-10'), make('adler', '2026-08-10')]
    const first = selectDue(items, '2026-08-17', 1)
    const second = selectDue([...items].reverse(), '2026-08-17', 1)
    expect(first[0]?.itemId).toBe(second[0]?.itemId)
  })

  it('leitet die Obergrenze aus der Zeit ab', () => {
    expect(dueLimitFor(0)).toBe(0)
    expect(dueLimitFor(20)).toBe(6)
    expect(dueLimitFor(45)).toBe(12)
    expect(dueLimitFor(600)).toBe(12)
  })
})

/**
 * Der Simulator aus Backlog C9.
 *
 * Bevor echte Menschen wochenlang trainieren, läuft der Scheduler gegen
 * erfundene Nutzer mit bekanntem Verhalten. Das ist billiger, als einen
 * Denkfehler an Nutzern zu bemerken — und es prüft Eigenschaften, die man an
 * einer einzelnen Abfrage nicht sehen kann.
 */
describe('Simulator: 120 Tage', () => {
  /** Ein Nutzer, der eine Information mit Wahrscheinlichkeit p erinnert. */
  function simulate(reliability: number, days: number) {
    let memory = newMemory(DAY0, true)
    let day = DAY0
    let asked = 0
    let forgotten = 0
    // Deterministisch statt zufällig (A11): jede n-te Abfrage geht daneben.
    let counter = 0

    for (let step = 0; step < days; step++) {
      day = addDays(day, 1)
      if (!isDue(memory, day)) continue
      asked++
      counter += 1 - reliability
      const recalled = counter < 1
      if (counter >= 1) counter -= 1
      if (!recalled) forgotten++
      memory = review(memory, day, recalled)
    }
    return { asked, forgotten, memory }
  }

  it('fragt einen zuverlässigen Nutzer immer seltener', () => {
    const solid = simulate(1, 120)
    const shaky = simulate(0.5, 120)
    // Wer alles behält, wird über 120 Tage nur eine Handvoll Mal gefragt.
    expect(solid.asked).toBeLessThan(12)
    // Wer die Hälfte vergisst, wird deutlich öfter gefragt — das ist der
    // ganze Sinn der Sache.
    expect(shaky.asked).toBeGreaterThan(solid.asked)
  })

  it('lässt die Stabilität bei durchgehendem Erfolg wachsen', () => {
    expect(simulate(1, 120).memory.stability).toBeGreaterThan(30)
  })

  it('hält die Zielretention plausibel ein', () => {
    // Über viele Abfragen hinweg sollte ein Nutzer, der sich wie das Modell
    // verhält, ungefähr so oft danebenliegen, wie die Zielmarke zulässt.
    // Grobe Schranke: Der Scheduler darf nicht systematisch zu spät fragen.
    const runs = simulate(TARGET_RETENTION, 400)
    expect(runs.forgotten / Math.max(1, runs.asked)).toBeLessThan(0.35)
  })
})
