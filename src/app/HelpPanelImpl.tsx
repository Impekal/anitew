import { useState } from 'react'

import { helpCopyFor } from '../i18n/helpCopy.ts'
import './help.css'

/**
 * Hilfe und Fragen & Antworten (Nutzerwunsch 04.09.).
 *
 * Eine Komponente für beide Seiten, weil sie sich eine Textdatei und ein
 * Stylesheet teilen und sich nur in der Form unterscheiden: Die Hilfe ist zum
 * Lesen von oben nach unten, die Fragen sind zum Nachschlagen. Zwei
 * Komponenten mit demselben Inhalt wären der sichere Weg, dass eine davon
 * veraltet.
 *
 * **Warum die Antworten zugeklappt sind und die Hilfe nicht.** Bei den Fragen
 * ist die Frage selbst der Wegweiser — vierzehn Antworten am Stück sind eine
 * Wand. Die Hilfe dagegen liest man der Reihe nach; dort wäre jedes Aufklappen
 * ein Handgriff zwischen dem Menschen und der Auskunft.
 */
export function HelpPanelImpl({ language, view }: { language: string; view: 'help' | 'faq' }) {
  const texte = helpCopyFor(language)

  if (view === 'help') {
    return (
      <div className="help">
        <p className="help-intro">{texte.helpIntro}</p>
        {texte.sections.map((abschnitt) => (
          <section className="help-section" key={abschnitt.title}>
            <h2 className="help-section-title">{abschnitt.title}</h2>
            {abschnitt.items.map((punkt) => (
              <div className="help-item" key={punkt.title}>
                <h3 className="help-item-title">{punkt.title}</h3>
                <p className="help-item-body">{punkt.body}</p>
              </div>
            ))}
          </section>
        ))}
        <p className="hint help-evidence">{texte.evidenceNote}</p>
      </div>
    )
  }

  return (
    <div className="help">
      <p className="help-intro">{texte.faqIntro}</p>
      {texte.groups.map((gruppe) => (
        <section className="help-section" key={gruppe.title}>
          <h2 className="help-section-title">{gruppe.title}</h2>
          {gruppe.entries.map((eintrag) => (
            <FaqItem key={eintrag.q} question={eintrag.q} answer={eintrag.a} />
          ))}
        </section>
      ))}
      <p className="hint help-evidence">{texte.evidenceNote}</p>
    </div>
  )
}

/*
 * Ein eigenes Auf und Zu statt `<details>`: Der eingebaute Pfeil sieht auf
 * jedem System anders aus, und `<summary>` lässt sich nicht überall gleich
 * gestalten. Der Knopf trägt `aria-expanded`, damit eine Vorlesehilfe den
 * Zustand ansagen kann — sonst wäre das Aufklappen für sie unsichtbar.
 */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [offen, setOffen] = useState(false)
  return (
    <div className={offen ? 'faq-item faq-open' : 'faq-item'}>
      <button
        type="button"
        className="faq-question"
        aria-expanded={offen}
        onClick={() => setOffen((vorher) => !vorher)}
      >
        <span className="faq-mark" aria-hidden="true">
          {offen ? '−' : '+'}
        </span>
        <span>{question}</span>
      </button>
      {offen && <p className="faq-answer">{answer}</p>}
    </div>
  )
}
