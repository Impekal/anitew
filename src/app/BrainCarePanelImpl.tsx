/*
 * Direkt aus den Quelldateien und nicht ueber `core/index.ts`: Der
 * Sammel-Export wird von der ganzen App geladen und zoege Tipps samt
 * Literaturangaben in den Kaltstart (P4). Gebraucht werden sie erst hier.
 */
import { BRAIN_TIPS } from '../core/brainCare.ts'
import { citationOf, STANDING_ORDER } from '../core/science.ts'
import '../anitew-brain-care.css'

import { brainCareCopyFor } from '../i18n/brainCareCopy.ts'
import type { Dictionary } from '../i18n/index.ts'

import { Emphasis } from './Emphasis.tsx'

/**
 * Geistig aktiv bleiben (Gerätewunsch 31.08.).
 *
 * Aufgebaut wie die Wissenschaftsseite und aus demselben Grund: **Der Stand
 * steht vor dem Rat.** Wer zuerst „Schlaf hilft" liest und den Beleg in einer
 * Fußnote findet, liest einen Ratgeber; wer die Überschrift „Gut belegt" über
 * dem Tipp sieht, bekommt eine Auskunft. Deshalb dieselben Gruppen, dieselbe
 * Reihenfolge, dieselben Quellenangaben — und der Tipp, der **nicht** belegt
 * ist, steht mit derselben Selbstverständlichkeit da wie die anderen.
 *
 * Was diese Datei nicht tut: entscheiden. Welcher Tipp welchen Stand hat,
 * steht in `core/brainCare.ts` und wird dort geprüft.
 */
export function BrainCarePanelImpl({
  dictionary,
  onDemanding,
}: {
  dictionary: Dictionary
  /** Startet eine lange Einheit und schliesst die Seite. */
  onDemanding?: () => void
}) {
  const t = brainCareCopyFor(document.documentElement.lang)

  return (
    <div className="science brain-care">
      <p className="hint">{t.note}</p>

      {/*
        Der Weg ins fordernde Training (Geraetewunsch 31.08.: „eventuell auch
        mit schwierigen Aufgaben zu loesen").

        Bewusst ein Knopf und kein eigener Uebungsvorrat: Eine zweite,
        schwerere Aufgabensammlung neben der bestehenden waere ein zweites
        Produkt — und die App hat bereits fordernde Module (Rueckwaerts,
        Zwillinge, Palast) und einen langen Modus. Der Knopf fuehrt dorthin,
        statt daneben etwas Neues zu bauen.
      */}
      {onDemanding !== undefined && (
        <section className="brain-care-demanding">
          <button type="button" className="quiet" onClick={onDemanding}>
            {t.demanding}
          </button>
          <p className="hint">{t.demandingNote}</p>
        </section>
      )}

      {STANDING_ORDER.map((standing) => {
        const tips = BRAIN_TIPS.filter((tip) => tip.standing === standing)
        if (tips.length === 0) return null
        return (
          <section key={standing} className={`standing standing-${standing}`}>
            <h2>{dictionary.science.standings[standing]}</h2>
            <p className="hint">{dictionary.science.standingNotes[standing]}</p>

            {tips.map((tip) => (
              <article key={tip.id} className="claim">
                <h3>{t.tips[tip.id].title}</h3>
                <p>
                  <Emphasis text={t.tips[tip.id].body} />
                </p>

                {tip.sources.length > 0 && (
                  <details className="details">
                    <summary>{dictionary.science.sources}</summary>
                    <ul className="citations">
                      {tip.sources.map((source) => (
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

      {/*
        Die Grenze zum Schluss und nicht als Kleingedrucktes: Das hier sind
        Zusammenhänge aus Bevölkerungsdaten, keine Zusagen — und ANITEW ist
        keine Gesundheitsanwendung (R-1, F7).
      */}
      <p className="hint brain-care-honest">{t.honest}</p>
    </div>
  )
}
