import { useEffect, useState } from 'react'

import {
  type DayKey,
  composeMemoryPool,
  memorySubjectOf,
  selectDue,
} from '../core/index.ts'
import { loadDue } from '../data/items.ts'
import { loadMemoryGraph } from '../data/memoryStore.ts'
import type { Dictionary } from '../i18n/index.ts'

/**
 * Der Blick auf heute (V2: Today-Experience) — zwei Zeilen, beide wahr,
 * beide nur da, wenn sie etwas zu sagen haben (D-011/G-2):
 *
 * - Wie viele **Wiedersehen** heute fällig sind, gezählt vom bestehenden
 *   Wiederholungsplan (FSRS) — keine zweite Rechnung, dieselbe Auswahl,
 *   die auch die Einheit trifft.
 * - Welche **Erinnerung** gerade am schwächsten steht. Der Satz dazu
 *   beschreibt den Mechanismus (Missionen üben Schwaches zuerst), nicht
 *   eine Vorhersage über diese eine Einheit — versprochen wird nur, was
 *   die Auswahl wirklich tut.
 *
 * Kein „Memory +18 %“, kein Countdown, kein Druck: Zahlen, die stimmen,
 * und eine Tür ins Training.
 */
export function TodayLine({
  dictionary,
  training,
  today,
}: {
  dictionary: Dictionary
  training: string
  today: DayKey
}) {
  const texts = dictionary.today

  const [tracked, setTracked] = useState(0)
  const [due, setDue] = useState<number | undefined>(undefined)
  const [weakest, setWeakest] = useState<string | undefined>(undefined)

  useEffect(() => {
    void (async () => {
      const items = await loadDue(training)
      setTracked(items.length)
      // Dieselbe Dringlichkeits-Auswahl wie in der Einheit — ungedeckelt
      // gezählt, denn die Zeile sagt, was ansteht, nicht, was hineinpasst.
      setDue(selectDue(items, today, Number.MAX_SAFE_INTEGER).length)
      const pool = composeMemoryPool(await loadMemoryGraph())
      setWeakest(pool.length > 0 ? memorySubjectOf(pool[0] as string) : undefined)
    })().catch(() => undefined)
  }, [training, today])

  const showDue = tracked > 0 && due !== undefined
  if (!showDue && weakest === undefined) return null

  return (
    <section className="today" aria-label={texts.heading}>
      {showDue && (
        <p className="today-line today-due">
          {due === 0
            ? texts.dueNone
            : due === 1
              ? texts.dueOne
              : texts.dueMany.replace('{n}', String(due))}
        </p>
      )}
      {weakest !== undefined && (
        <p className="today-line today-memory">{texts.weakest.replace('{label}', weakest)}</p>
      )}
    </section>
  )
}
