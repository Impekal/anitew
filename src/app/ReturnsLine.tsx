import type { Returns } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'

/**
 * Die Wiedersehen, in einer Zeile (Backlog K1, K5, K8 · D-019).
 *
 * An dieser Stelle stünde in einer anderen App eine XP-Zahl. Der Unterschied
 * ist nicht der Name, sondern die Herkunft: **Diese Zahl ist gezählt, nicht
 * vergeben** — jedes Wiedersehen ist eine Information, die nach Tagen wirklich
 * wieder abgefragt wurde. Der Satz darunter sagt genau das, weil eine große
 * Zahl ohne Herkunft dasselbe ist wie eine erfundene (R-1).
 *
 * Nichts blinkt, nichts steigt vor den Augen auf, es gibt keinen Balken zum
 * nächsten Rang. Ein Balken bräuchte eine Marke, und jede Marke wäre
 * ausgedacht (D-019).
 *
 * Bei null steht hier gar nichts — dieselbe Regel wie bei der Serie: keine
 * Aufforderung, wo noch nichts ist (D-015).
 */
export function ReturnsLine({
  returns,
  dictionary,
}: {
  returns: Returns
  dictionary: Dictionary
}) {
  const t = dictionary.returns
  if (returns.total === 0) return null

  return (
    <div className="returns">
      <p className="returns-line">
        <strong>{returns.total}</strong> {returns.total === 1 ? t.one : t.many}
        {/* Der Bestand daneben, klein: Er sagt, woraus die Zahl weiter
            wachsen kann, ohne selbst eine Leistung zu behaupten. */}
        <span className="returns-tracked">
          {' '}
          · {returns.tracked} {t.tracked}
        </span>
      </p>
      <p className="hint">{t.note}</p>

      {/* Der Rekord erst, wenn er etwas anderes sagt als „einmal“ (G-2). */}
      {returns.longest > 1 && (
        <p className="hint">
          {t.longest}: {returns.longest} {t.times}
        </p>
      )}
    </div>
  )
}
