import { type DimensionCounts, type DimensionId, type DimensionResult, hasProfile, isImmediate, profileOf, weakest } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'

/**
 * Das Gedächtnisprofil (Backlog E3, E4, E7 · D-021).
 *
 * Die gefährlichste Anzeige der ganzen App: Sie sieht aus wie ein Befund über
 * einen Menschen. Drei Dinge halten sie ehrlich:
 *
 * 1. **Nur verzögerter Abruf.** Was am Lerntag passiert, ist Übung; es steht
 *    hier nicht (F1).
 * 2. **Eine Spanne, kein Punkt.** Aus zwanzig Gelegenheiten folgt kein exakter
 *    Wert, und die Breite steht daneben statt im Kleingedruckten.
 * 3. **„Nicht gemessen“ sieht nicht aus wie „schlecht“.** Drei der neun Achsen
 *    haben in dieser App keine Quelle — dort steht das, und kein leerer Balken
 *    mit Hoffnung darauf.
 */
export function ProfilePanel({
  counts,
  dictionary,
}: {
  counts: Partial<Record<DimensionId, DimensionCounts>>
  dictionary: Dictionary
}) {
  const t = dictionary.profile
  const results = profileOf(counts)
  const names: Record<string, string> = t.names

  if (!hasProfile(results)) {
    /*
      Vor der ersten Aussage steht ein Satz und keine Liste aus neun leeren
      Zeilen. Neun Achsen ohne Zahl sähen aus wie neun Defizite (G-2, R-1).
    */
    return <p className="hint">{t.empty}</p>
  }

  const weak = weakest(results)

  return (
    <div className="profile">
      <p className="hint">{t.note}</p>

      <ul className="axes">
        {results.map((result) => (
          <li key={result.id} className={`axis axis-${result.kind}`}>
            <span className="axis-name">
              {names[result.id]}
              {/*
                Sofort-Achsen (D-026) sagen dazu, was sie zählen: Antworten
                im Moment, kein Wiedersehen nach Tagen. Ohne den Zusatz läse
                sich die Zeile wie alle anderen — und wäre eine andere Zahl
                im selben Gewand (R-1).
              */}
              {isImmediate(result.id) && <span className="axis-note"> · {t.immediate}</span>}
            </span>
            <span className="axis-value">{valueOf(result, dictionary)}</span>
          </li>
        ))}
      </ul>

      {/*
        Die schwächste Achse wird nur genannt, wenn sich zwei wirklich
        unterscheiden — sonst hieße „Zahlen sind deine Schwachstelle“ nur,
        dass der Zufall an diesem Tag so lag (E5, R-1).
      */}
      <p className="hint">
        {weak === undefined ? t.noWeakest : `${t.weakest} ${names[weak]}`}
      </p>
    </div>
  )
}

function valueOf(result: DimensionResult, dictionary: Dictionary): string {
  const t = dictionary.profile
  switch (result.kind) {
    case 'measured':
      return `${result.held} ${t.of} ${result.chances} ${t.kept} · ${t.range} ${result.low}–${result.high} %`
    case 'tooFew':
      return `${t.tooFew} (${t.chancesSoFar} ${result.chances} ${t.of15})`
    case 'elsewhere':
      return t.elsewhere
    case 'notMeasured':
      return t.notMeasured
  }
}
