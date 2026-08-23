/**
 * Persoenlicher Zahlenrekord (Backlog K5).
 *
 * Der Rekord ist keine vergebene Punktzahl und keine abgeleitete
 * Schwierigkeit. Er ist nur das Maximum der Ziffernlaengen aus tatsaechlich
 * protokollierten, richtigen Antworten im Zahlenmodul. Falsche Antworten,
 * andere Module und ungueltige IDs tragen nichts bei.
 */
export interface NumberRecallFact {
  readonly module: string
  readonly itemId: string
  readonly correct: boolean
}

/**
 * Laengste korrekt erinnerte Ziffernfolge. `undefined` bedeutet: Es gibt noch
 * keinen belegten Zahlenabruf, also darf ANITEW auch keinen Rekord anzeigen.
 */
export function longestRecalledNumber(
  facts: readonly NumberRecallFact[],
): { readonly digits: number; readonly itemId: string } | undefined {
  let longest: { digits: number; itemId: string } | undefined

  for (const fact of facts) {
    if (fact.module !== 'numbers' || fact.correct !== true || !/^\d+$/.test(fact.itemId)) continue
    if (longest === undefined || fact.itemId.length > longest.digits) {
      longest = { digits: fact.itemId.length, itemId: fact.itemId }
    }
  }

  return longest
}
