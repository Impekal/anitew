import type { Streak } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'

/**
 * Die Serie, in einer Zeile (Backlog K2, K5).
 *
 * Sie **sagt, was war — mehr nicht** (K7). Kein Countdown, keine Drohung,
 * keine Aufforderung, keine künstliche Verknappung. Wer heute nicht kann,
 * soll die App schließen können, ohne ein schlechtes Gewissen mitzunehmen;
 * Apps, die an dieser Stelle Druck machen, verlieren den Nutzer nicht am
 * verpassten Tag, sondern am Tag danach (D-008).
 *
 * Bei einer Serie von null steht hier **gar nichts**. Ein „Starte deine
 * Serie!“ wäre die Aufforderung, die K7 ausschließt — und ein leeres Feld,
 * das nach Verpflichtung aussieht, bevor überhaupt etwas passiert ist.
 */
export function StreakLine({ streak, dictionary }: { streak: Streak; dictionary: Dictionary }) {
  const t = dictionary.streak
  if (streak.length === 0) return null

  return (
    <div className="streak">
      <p className="streak-line">
        <strong>{streak.length}</strong> {streak.length === 1 ? t.day : t.days}
        {streak.trainedToday && <span className="streak-today"> · {t.today}</span>}
      </p>

      {streak.shields > 0 && (
        /*
          Die Schutztage als Punkte und als Text daneben: Punkte allein wären
          ein Rätsel, Text allein wäre eine Zeile mehr. Sie sind nicht
          kaufbar und nicht durch Werbung zu verdienen (D-008) — sie stehen
          hier, damit man weiß, dass ein verpasster Tag nichts kostet.
        */
        <p className="streak-shields">
          {Array.from({ length: streak.shields }, (_, index) => (
            <span key={index} className="shield" aria-hidden="true" />
          ))}
          {streak.shields} {streak.shields === 1 ? t.shield : t.shields}
        </p>
      )}

      {/* Nur an dem Tag, an dem es zählt. */}
      {streak.heldYesterday && <p className="hint streak-held">{t.held}</p>}

      {/* Die Bestmarke erst, wenn sie etwas anderes sagt als die laufende
          Serie — sonst stünde zweimal dieselbe Zahl da (G-2). */}
      {streak.best > streak.length && (
        <p className="hint">
          {t.best}: {streak.best}
        </p>
      )}
    </div>
  )
}
