import { STANDING_ORDER, citationOf, claimsWithStanding } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'

import { Emphasis } from './Emphasis.tsx'

/**
 * Die Wissenschaftsseite (Backlog F6, R-2).
 *
 * Der Aufbau ist die Aussage: erst, worauf die App steht, dann die
 * Einschränkung, dann das, was sie **nicht** behauptet — und ganz unten das,
 * was niemand gemessen hat. Wer nur die stützenden Studien zeigt, betreibt
 * Werbung mit Fußnoten; die beiden letzten Blöcke sind der Grund, warum es
 * diese Seite überhaupt gibt.
 *
 * Kein Text hier wird gerechnet oder ausgewählt: Welche Aussage welchen Stand
 * hat, entscheidet `core/science.ts` und prüft ein Test. Diese Datei
 * **zeigt** nur — und ist damit auch die Stelle, die auffällt, wenn dort eine
 * Aussage dazukommt, für die noch kein Text existiert (Übersetzungsfehler
 * statt leerer Absatz).
 */
export function SciencePanelImpl({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.science

  return (
    <div className="science">
      <p className="hint">{t.note}</p>

      {STANDING_ORDER.map((standing) => {
        const claims = claimsWithStanding(standing)
        if (claims.length === 0) return null
        return (
          <section key={standing} className={`standing standing-${standing}`}>
            <h2>{t.standings[standing]}</h2>
            <p className="hint">{t.standingNotes[standing]}</p>

            {claims.map((claim) => (
              <article key={claim.id} className="claim">
                <h3>{t.claims[claim.id].title}</h3>
                <p>
                  <Emphasis text={t.claims[claim.id].body} />
                </p>

                <p className="rests">
                  {claim.restsOn.length > 0
                    ? `${t.restsOn} ${claim.restsOn.join(' · ')}`
                    : t.nothingRests}
                </p>

                {claim.sources.length > 0 && (
                  <details className="details">
                    <summary>{t.sources}</summary>
                    <ul className="citations">
                      {claim.sources.map((source) => (
                        <li key={citationOf(source)}>{citationOf(source)}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </article>
            ))}
          </section>
        )
      })}
    </div>
  )
}
