import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import './learn.css'

import {
  type LearnCard,
  type LearnState,
  type LearnTopic,
  type ModuleId,
  TEACH_ORDER,
  learnCards,
  learnProgress,
  lettersFor,
} from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'
import { learnCopyFor } from '../i18n/learnCopy.ts'
import { lessonCopyFor } from '../i18n/lessonCopy.ts'
import {
  clearAllLessons,
  clearLesson,
  loadLinkTaught,
  loadMajorMethodTaught,
  loadPalaceTaught,
  loadStoryTaught,
  loadTaught,
  markLinkTaught,
  markMajorMethodTaught,
  markPalaceTaught,
  markStoryTaught,
  markTaught,
} from '../data/technique.ts'

/**
 * Der Lernbereich (Nutzerwunsch 03.09.).
 *
 * Wörtlich: „Wo man dann in Ruhe alle Methoden lernen kann und üben kann …
 * man kann jederzeit lernen, weiterlernen, neu anfangen."
 *
 * ── Was dieser Bildschirm ist ─────────────────────────────────────────────
 *
 * Eine Tür zu Unterricht, den es längst gibt. Die vier Lektionen wurden
 * bisher **in** einer Einheit gehalten, einmal, wenn der Planer fand, dass es
 * passt. Wer sie damals überflogen hat — zwischen Tür und Angel, im Bus —,
 * kam nie wieder an sie heran. Genau das ist hier behoben.
 *
 * **Ohne Uhr.** Der Rest der App misst; hier wird gelesen. Es gibt keinen
 * Zeitbalken, keinen Fortschrittsdruck und keine Runde, die weiterläuft.
 *
 * **Die Texte stehen nicht hier.** Sie kommen aus `lessonCopy` und dem
 * Wörterbuch beim Palast — dieselben Sätze, die auch in der Einheit stehen.
 * Sie hier ein zweites Mal zu führen hieße, zwei Wahrheiten über denselben
 * Unterricht zu haben, und eine davon würde irgendwann veralten.
 */

interface Props {
  dictionary: Dictionary
  language: string
  /** Startet eine Einheit mit dieser Methode als Schwerpunkt. */
  onPractise: (module: ModuleId) => void
}

/** Der Lernstand, wie ihn das Gerät kennt — einmal geladen, danach gepflegt. */
async function ladeStand(): Promise<LearnState> {
  const [storyTaught, linkTaught, palaceTaught, majorMethodTaught, majorDigits] = await Promise.all([
    loadStoryTaught(),
    loadLinkTaught(),
    loadPalaceTaught(),
    loadMajorMethodTaught(),
    loadTaught(),
  ])
  return { storyTaught, linkTaught, palaceTaught, majorMethodTaught, majorDigits }
}

export function LearnPanelImpl({ dictionary, language, onPractise }: Props) {
  const texte = useMemo(() => learnCopyFor(language), [language])
  const lektionen = useMemo(() => lessonCopyFor(language), [language])
  const [stand, setStand] = useState<LearnState | undefined>(undefined)
  const [offen, setOffen] = useState<LearnTopic | undefined>(undefined)
  /** Welche Rückfrage gerade offen ist — je Lektion oder für alles. */
  const [fragt, setFragt] = useState<LearnTopic | 'alle' | undefined>(undefined)
  const lebt = useRef(true)

  useEffect(() => {
    lebt.current = true
    void ladeStand()
      .then((geladen) => {
        if (lebt.current) setStand(geladen)
      })
      .catch(() => undefined)
    return () => {
      lebt.current = false
    }
  }, [])

  const neuLaden = useCallback(async () => {
    const geladen = await ladeStand().catch(() => undefined)
    if (geladen !== undefined && lebt.current) setStand(geladen)
  }, [])

  if (stand === undefined) return null

  const karten = learnCards(stand)
  const gesamt = learnProgress(stand)

  /*
   * Weiterlernen heißt bei drei der vier Methoden: die Lektion aufschlagen
   * und sie als gelesen merken. Beim Major-System ist es ein Schritt mehr —
   * erst das Verfahren, dann Ziffer für Ziffer. Das ist die Reihenfolge aus
   * D5, und sie steht hier so, wie sie auch in der Einheit gilt.
   */
  const weiter = async (karte: LearnCard) => {
    setOffen(karte.topic)
    if (karte.topic === 'story') await markStoryTaught()
    else if (karte.topic === 'link') await markLinkTaught()
    else if (karte.topic === 'palace') await markPalaceTaught()
    else if (!stand.majorMethodTaught) await markMajorMethodTaught()
    else if (karte.nextDigit !== undefined) await markTaught(karte.nextDigit)
    await neuLaden()
  }

  const zuruecksetzen = async (was: LearnTopic | 'alle') => {
    if (was === 'alle') await clearAllLessons()
    else await clearLesson(was)
    setFragt(undefined)
    setOffen(undefined)
    await neuLaden()
  }

  return (
    <div className="learn">
      <p className="learn-intro">{texte.intro}</p>
      <p className="learn-progress" role="status">
        {texte.progress
          .replace('{known}', String(gesamt.known))
          .replace('{total}', String(gesamt.total))}
      </p>

      <ul className="learn-list">
        {karten.map((karte) => {
          const istOffen = offen === karte.topic
          return (
            <li key={karte.topic} className={`learn-card${karte.done ? ' learn-card-done' : ''}`}>
              <h3 className="learn-title">{texte.titles[karte.topic]}</h3>
              <p className="learn-purpose">{texte.purposes[karte.topic]}</p>

              {/*
                Ein Fortschritt steht nur dort, wo es wirklich einen gibt.
                „1 von 1" bei den anderen dreien wäre eine Zahl, die so tut,
                als wäre sie eine Messung.
              */}
              {karte.progress !== undefined && (
                <p className="learn-steps">
                  {texte.steps
                    .replace('{known}', String(karte.progress.known))
                    .replace('{total}', String(karte.progress.total))}
                  {karte.nextDigit !== undefined && (
                    <span className="learn-next">
                      {' · '}
                      {texte.nextDigit.replace('{digit}', String(karte.nextDigit))}
                    </span>
                  )}
                </p>
              )}
              {karte.done && <p className="learn-done">{texte.done}</p>}

              {istOffen && <Lektion topic={karte.topic} lektionen={lektionen} dictionary={dictionary} stand={stand} texte={texte} />}

              <div className="learn-actions">
                <button
                  type="button"
                  className={`learn-go${karte.done ? ' quiet' : ''}`}
                  onClick={() => {
                    if (istOffen && karte.done) {
                      setOffen(undefined)
                      return
                    }
                    void weiter(karte)
                  }}
                >
                  {istOffen && karte.done
                    ? texte.close
                    : karte.done
                      ? texte.again
                      : karte.untouched
                        ? texte.begin
                        : texte.resume}
                </button>
                <button type="button" className="quiet learn-practise" onClick={() => onPractise(karte.module)}>
                  {texte.practise}
                </button>
              </div>

              {fragt === karte.topic ? (
                <div className="learn-ask" role="alert">
                  <p>{texte.restartAsk}</p>
                  <p className="hint">{texte.restartNote}</p>
                  <div className="learn-actions">
                    <button type="button" className="quiet" onClick={() => void zuruecksetzen(karte.topic)}>
                      {texte.restart}
                    </button>
                    <button type="button" className="quiet" onClick={() => setFragt(undefined)}>
                      {texte.cancel}
                    </button>
                  </div>
                </div>
              ) : (
                !karte.untouched && (
                  <button type="button" className="quiet learn-restart" onClick={() => setFragt(karte.topic)}>
                    {texte.restart}
                  </button>
                )
              )}
            </li>
          )
        })}
      </ul>

      <p className="hint learn-practise-note">{texte.practiseNote}</p>

      {/*
        „Alles neu anfangen" steht am Ende und nicht oben: Wer die Seite
        öffnet, will lernen — nicht als Erstes einen Knopf sehen, der alles
        wegnimmt.
      */}
      {fragt === 'alle' ? (
        <div className="learn-ask" role="alert">
          <p>{texte.restartAllAsk}</p>
          <p className="hint">{texte.restartNote}</p>
          <div className="learn-actions">
            <button type="button" className="quiet" onClick={() => void zuruecksetzen('alle')}>
              {texte.restartAll}
            </button>
            <button type="button" className="quiet" onClick={() => setFragt(undefined)}>
              {texte.cancel}
            </button>
          </div>
        </div>
      ) : (
        gesamt.known > 0 && (
          <button type="button" className="quiet learn-restart-all" onClick={() => setFragt('alle')}>
            {texte.restartAll}
          </button>
        )
      )}
    </div>
  )
}

/**
 * Die Lektion selbst — dieselben Sätze wie in der Einheit.
 *
 * Beim Major-System steht zusätzlich die Tabelle der Ziffern und Laute, und
 * zwar **nur die gelernten**: Alle zehn auf einmal hinzustellen wäre genau
 * der Fehler, der am 01.09. gemeldet wurde — erst eine Ziffer lehren und
 * dann sechsstellige Zahlen verlangen, oder eben alles auf einmal.
 */
function Lektion({
  topic,
  lektionen,
  dictionary,
  stand,
  texte,
}: {
  topic: LearnTopic
  lektionen: ReturnType<typeof lessonCopyFor>
  dictionary: Dictionary
  stand: LearnState
  texte: ReturnType<typeof learnCopyFor>
}) {
  if (topic === 'palace') {
    const palast = dictionary.palace
    return (
      <div className="learn-lesson">
        <p>{palast.lessonIntro}</p>
        <ol className="learn-lesson-steps">
          {palast.lessonSteps.map((schritt) => (
            <li key={schritt}>{schritt}</li>
          ))}
        </ol>
        <p className="learn-lesson-build">{palast.lessonBuild}</p>
      </div>
    )
  }

  if (topic !== 'major') {
    const lektion = topic === 'story' ? lektionen.story : lektionen.link
    return (
      <div className="learn-lesson">
        <p className="learn-lesson-lead">{lektion.intro}</p>
        <ol className="learn-lesson-steps">
          {lektion.steps.map((schritt) => (
            <li key={schritt}>{schritt}</li>
          ))}
        </ol>
        <p className="learn-lesson-build">{lektion.build}</p>
      </div>
    )
  }

  const gelernt = TEACH_ORDER.filter((digit) => stand.majorDigits.includes(digit))
  return (
    <div className="learn-lesson">
      <p className="learn-lesson-lead">{lektionen.method.what}</p>
      <p>{lektionen.method.helps}</p>
      <ol className="learn-lesson-steps">
        {lektionen.method.steps.map((schritt) => (
          <li key={schritt}>{schritt}</li>
        ))}
      </ol>
      <p className="learn-lesson-build">{lektionen.method.build}</p>
      {gelernt.length > 0 && (
        <>
          <h4 className="learn-hooks-heading">{texte.hooksHeading}</h4>
          <ul className="learn-hooks">
            {gelernt.map((digit) => (
              <li key={digit}>
                <b>{digit}</b> <span className="learn-hook-letters">{lettersFor(digit)}</span>
                <span className="learn-hook-why">{lektionen.hooks[digit as keyof typeof lektionen.hooks]}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
