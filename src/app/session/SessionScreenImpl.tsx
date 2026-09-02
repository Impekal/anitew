import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'

import {
  type BlockPlan,
  displayOf,
  type FactKind,
  factKindOf,
  type GazeObject,
  gazeObjectName,
  gazeObjectOf,
  gazeSceneOf,
  helpsWith,
  isPrompted,
  type Language,
  lettersFor,
  type MajorPart,
  majorParts,
  missionFor,
  missionObjectFor,
  type ModuleId,
  factAnswer,
  factPrompt,
  memorySubjectOf,
  memoryTargetOf,
  isOwnPalaceId,
  ownLabelOf,
  ownPalaceFor,
  type OwnPalace,
  palaceOf,
  personOf,
  type Platform,
  splitEntries,
  splitNumberEntries,
  stationOf,
  subjectOf,
  twinChoices,
  twinShown,
  walkFor,
  walkOf,
} from '../../core/index.ts'
import type { RoundResult, SessionProgress } from '../../data/sessions.ts'
import type { Dictionary } from '../../i18n/index.ts'
import { Face } from '../Face.tsx'
import { GazeScene } from '../GazeScene.tsx'
import { SpatialGrid } from '../SpatialGrid.tsx'
import { useCountUp } from '../useCountUp.ts'

import { useSessionRunner } from './useSessionRunner.ts'

/** So lange dauert das Ankommen, bevor die Uhr läuft (D-011/G-1). */
const SETTLE_MS = 3000

export function SessionScreen(props: {
  platform: Platform
  dictionary: Dictionary
  progress: SessionProgress
  /** Die schon gelehrten Ziffern des Major-Systems (D5). */
  taught: readonly number[]
  /** Der selbst angelegte Palast, wenn es einen gibt (G3). */
  own?: readonly OwnPalace[]
  onLeave: () => void
  onComplete: () => void
  /** „Noch eine Runde“ vom Abschluss aus (B7). */
  onAgain: () => void
}) {
  const [settled, setSettled] = useState(false)

  if (!settled) {
    return (
      <Settle
        dictionary={props.dictionary}
        platform={props.platform}
        onDone={() => setSettled(true)}
      />
    )
  }
  return <RunningSession {...props} />
}

/**
 * Drei Sekunden zwischen Alltag und Training.
 *
 * Kein Countdown — der drängt. Ein Kreis, der atmet. Wer ihn antippt,
 * überspringt ihn: Ruhe darf niemandem aufgezwungen werden.
 *
 * Die Uhr der Einheit läuft erst danach. Das Zeitbudget bleibt Trainingszeit
 * und wird nicht heimlich mit Ankommen gefüllt (B2).
 */
function Settle({
  dictionary,
  platform,
  onDone,
}: {
  dictionary: Dictionary
  platform: Platform
  onDone: () => void
}) {
  useEffect(() => {
    const timer = setTimeout(onDone, SETTLE_MS)
    return () => clearTimeout(timer)
  }, [onDone])

  /*
   * Die Melodie des Ankommens (Geraetewunsch 31.08.). Sie steht genau hier
   * und nirgends sonst: Der Startknopf hat die Tonausgabe schon
   * freigeschaltet (iOS verlangt eine Geste), und diese drei Sekunden sind
   * die einzige Stelle der App, an der Zeit fuer eine Melodie ist.
   *
   * Wer das Ankommen antippt und ueberspringt, hoert sie nicht zu Ende — das
   * ist richtig so: Sie begleitet das Ankommen, sie haelt es nicht auf.
   */
  useEffect(() => {
    platform.sound.play('arrival')
    return () => platform.sound.stopAmbient()
  }, [platform])

  return (
    <main className="app session">
      <button type="button" className="settle" onClick={onDone}>
        <span className="settle-breath" aria-hidden="true" />
        <p className="settle-word">{dictionary.session.settle}</p>
        <p className="hint">{dictionary.session.settleHint}</p>
      </button>
    </main>
  )
}

function RunningSession({
  platform,
  dictionary,
  progress,
  taught,
  own,
  onLeave,
  onAgain,
  onComplete,
}: {
  platform: Platform
  dictionary: Dictionary
  progress: SessionProgress
  taught: readonly number[]
  own?: readonly OwnPalace[]
  onLeave: () => void
  onAgain: () => void
  onComplete: () => void
}) {
  const { state, setEntries, submitPrompt, advance, leave } = useSessionRunner(
    platform,
    progress,
    onLeave,
  )
  const t = dictionary.session

  /*
   * Während des Trainings tritt das Netz im Hintergrund fast vollständig
   * zurück (D-011/G-2).
   *
   * Auf dem Startbildschirm darf es da sein — dort ist Platz und es soll
   * wirken. Beim Einprägen steht ein einziges Wort im Mittelpunkt, und ein
   * Gewebe aus fünfzig Knoten dahinter ist dann kein Hintergrund mehr,
   * sondern ein Mitbewerber. Die Aufmerksamkeit verengt sich, also verengt
   * sich auch das Bild.
   *
   * Der Hook steht vor dem vorzeitigen `return` — sonst hinge die Reihenfolge
   * der Hooks davon ab, ob die Einheit schon fertig ist.
   */
  useEffect(() => {
    const root = document.documentElement
    if (state.finished) {
      delete root.dataset.focus
      return
    }
    root.dataset.focus = 'on'
    return () => {
      delete root.dataset.focus
    }
  }, [state.finished])

  /*
   * Der ruhige Klang waehrend der Einheit (Geraetewunsch 31.08.).
   *
   * Er beginnt mit dem ersten Block und endet mit der Einheit — nicht erst
   * beim Verlassen des Bildschirms: Auf der Zusammenfassung ist die Arbeit
   * getan, da soll es still sein. Ob er ueberhaupt klingt, entscheidet der
   * Ton-Port anhand von Hauptschalter und Bereich; hier steht nur, **wann**
   * er dran waere.
   *
   * Die Aufraeumfunktion haelt ihn in jedem Fall an — auch beim Abbrechen
   * mitten in der Einheit oder wenn die Seite wechselt. Ein Klang, der nach
   * dem Training weiterlaeuft, waere genau die Dauerlast, die P9 abgestellt
   * hat.
   */
  useEffect(() => {
    if (state.finished) {
      platform.sound.stopAmbient()
      return
    }
    platform.sound.startAmbient()
    return () => platform.sound.stopAmbient()
  }, [state.finished, platform])

  /*
   * Die Marken zerlegen genau so, wie die Einheit zählt (`useSessionRunner`):
   * Bei Zahlen ist das Leerzeichen Gruppierung — „12 345“ ist eine Zahl, und
   * genau so zeigt die App sie beim Einprägen auch an. Bei Wörtern trennt es.
   */
  const numberRecall = state.block?.moduleId === 'numbers'
  const recallChips = useMemo(
    () => (numberRecall ? splitNumberEntries(state.entries) : splitEntries(state.entries)),
    [numberRecall, state.entries],
  )

  /*
   * Der Zeilenwechsel für den Ziffernblock, der keine Return-Taste hat.
   * Zwei leere Zeilen hintereinander bringen nichts — der Knopf bleibt dann
   * folgenlos und gibt nur den Fokus zurück.
   */
  const recallRef = useRef<HTMLTextAreaElement>(null)
  const addRecallLine = () => {
    const text = state.entries
    if (text.trim() !== '' && !text.endsWith('\n')) setEntries(`${text}\n`)
    recallRef.current?.focus()
  }

  /*
   * Jedes gelandete Wort klingt (D-011/G-9) — kurz, hoch, fast ein Tropfen.
   * Gezählt wird die Zahl der Marken, nicht jeder Tastendruck: Sonst klapperte
   * es beim Tippen wie eine Schreibmaschine.
   */
  const chipCount = recallChips.length
  const chipsRef = useRef(0)
  useEffect(() => {
    if (chipCount > chipsRef.current) platform.sound.play('type', chipCount)
    chipsRef.current = chipCount
  }, [chipCount, platform])

  /*
   * Dieser Hook stand zuerst **unter** dem Return für die Zusammenfassung —
   * und wurde damit nur gerufen, solange die Einheit lief. React zählt Hooks
   * je Durchlauf; sobald die letzte Antwort da war, fehlte einer, die
   * Komponente brach ab und die Zusammenfassung erschien nie. Zehn E2E-Läufe
   * wurden rot, und alle zehn liefen bis zum Ende einer Einheit — die
   * kürzeren nicht. Hooks stehen vor jedem Return, ausnahmslos.
   */
  /*
   * Die Ziffer aus der Lektion **dieser** Einheit zählt sofort mit.
   *
   * Sie steht nach der Lektion in den Einstellungen, aber der Startbildschirm
   * liest sie erst wieder, wenn die Einheit vorbei ist — der Konsonant
   * erschiene also erstmals beim *nächsten* Training. Das ist genau der
   * falsche Moment: Wer eben gelernt hat, dass die Eins ein t ist, soll das
   * an der nächsten Zahl sehen und nicht morgen. Ein E2E-Test hat es
   * gefunden.
   *
   * Abgeleitet aus Plan und Blockzähler statt aus einem zweiten Zustand: Ein
   * vorbeigezogener Lehrblock **ist** die Auskunft, dass seine Ziffer gehalten
   * wurde — und kann mit der Datenbank nicht aus dem Tritt geraten.
   */
  const taughtNow = useMemo(() => {
    const fresh = state.plan.blocks
      .filter((candidate, index) => candidate.kind === 'teach' && index < state.blockIndex)
      .map((candidate) => Number(candidate.items[0]))
      .filter((digit) => Number.isInteger(digit))
    return fresh.length === 0 ? taught : [...taught, ...fresh]
  }, [state.plan, state.blockIndex, taught])

  if (state.finished) {
    return (
      <Summary
        dictionary={dictionary}
        results={state.results}
        language={state.plan.language}
        landing={state.landingPulse}
        onLeave={() => {
          onComplete()
          leave()
        }}
        onAgain={() => {
          onComplete()
          onAgain()
        }}
      />
    )
  }

  const block = state.block
  if (block === undefined) return null

  const rounds = new Set(state.plan.blocks.map((b) => b.round)).size
  const done = 1 - state.remaining / block.seconds
  const phase =
    block.kind === 'teach'
      ? 'focus'
      : block.kind === 'review'
        ? 'return'
        : block.moduleId === 'reverse' || block.moduleId === 'twins'
          ? 'interfere'
          : block.kind === 'encode' && ['memory', 'missions', 'palace'].includes(block.moduleId)
            ? 'connect'
            : block.kind === 'encode'
              ? 'encode'
              : 'retrieve'

  /*
   * Die Konsonantenzeile erscheint erst, wenn sie etwas beiträgt (D5).
   * Solange keine einzige Ziffer gelehrt ist, stünde dort eine Reihe Punkte —
   * das wäre ein Versprechen auf etwas, das noch nicht da ist, und nach G-2
   * schlicht Möbel.
   */
  const parts: readonly MajorPart[] | undefined =
    block.kind === 'encode' &&
    block.moduleId === 'numbers' &&
    state.currentItem !== undefined &&
    helpsWith(state.currentItem, taughtNow)
      ? majorParts(state.currentItem, taughtNow)
      : undefined

  return (
    <main className={`app session${state.landingPulse ? ' session-memory-landing' : ''}`}>
      <header className="session-head">
        <span>
          {t.round} {block.round}/{rounds}
        </span>
        <span className="session-clock">{formatSeconds(state.remaining)}</span>
      </header>
      <div className={`session-phase session-phase-${phase}`} aria-live="polite">
        <span aria-hidden="true" />
        {t.phases[phase]}
      </div>

      <div
        className="session-bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={block.seconds}
        aria-valuenow={block.seconds - state.remaining}
      >
        <span style={{ width: `${Math.min(100, done * 100)}%` }} />
      </div>

      {block.kind === 'teach' && (block.id === 'teach-story' || block.id === 'teach-link') ? (
        <EncodingLessonView
          dictionary={dictionary}
          lesson={block.id === 'teach-story' ? 'story' : 'link'}
          onDone={() => advance()}
        />
      ) : block.kind === 'teach' && block.moduleId === 'palace' ? (
        <PalaceLesson dictionary={dictionary} onDone={() => advance()} />
      ) : block.id === 'teach-major-method' ? (
        <MethodLesson dictionary={dictionary} onDone={() => advance()} />
      ) : block.kind === 'teach' ? (
        <Lesson dictionary={dictionary} digit={Number(block.items[0])} onDone={() => advance()} />
      ) : block.kind === 'encode' && block.moduleId === 'palace' ? (
        /*
          Ein Gang wird **als Ganzes** gezeigt, aus demselben Grund wie eine
          Mission: Geübt wird die Bindung zwischen Ort und Ding, und die gibt
          es nur, wenn die Reihenfolge sichtbar ist. Fünf Karten nacheinander
          wären fünf Gegenstände und kein Weg.
        */
        <Walk
          dictionary={dictionary}
          walk={walkOf(block.items[0] ?? '')}
          language={state.plan.language}
          own={own}
        />
      ) : block.kind === 'encode' && block.moduleId === 'memory' ? (
        /*
          Eine Erinnerung wird **als Ganzes** gezeigt (D-036): der Anker
          und alles, was zu ihm gehört — wie eine Mission, nur dass die
          Szene aus dem Leben des Menschen stammt statt aus einem
          Generator. Nacheinander gezeigt wären es Vokabeln.
        */
        <section className="encode scene memory-encode">
          <p className="hint">{t.encodeHints.memory}</p>
          <p className="memory-anchor">{memorySubjectOf(block.items[0] ?? '')}</p>
          <ul className="memory-scene">
            {block.items.map((item) => (
              <li key={item}>{memoryTargetOf(item)}</li>
            ))}
          </ul>
        </section>
      ) : block.kind === 'encode' && block.moduleId === 'gaze' ? (
        /*
          Ein Bild wird als Ganzes gezeigt (Achse „Visuell“): vier Dinge,
          vier Farben, ein Blick. Keine Wortliste daneben — gemerkt werden
          soll, was man **sieht**, nicht was man liest.
        */
        <section className="encode scene gaze-encode">
          <p className="hint">{t.encodeHints.gaze}</p>
          <GazeScene sceneId={gazeSceneOf(block.items[0] ?? '')} />
        </section>
      ) : block.kind === 'encode' && block.moduleId === 'missions' ? (
        /*
          Eine Mission wird **als Ganzes** gezeigt und nicht Stück für Stück
          (H1). Das ist der Unterschied zu jedem anderen Modul hier: Geübt
          wird nicht, vier Tatsachen zu behalten, sondern dass sie
          zusammengehören. Nacheinander gezeigt wären es vier Gegenstände,
          und die Bindung — worauf es ankommt — käme gar nicht vor.
        */
        <Scene dictionary={dictionary} person={personOf(block.items[0] ?? '')} language={state.plan.language} />
      ) : block.kind === 'encode' && block.moduleId === 'spatial' ? (
        <section className="encode spatial-encode">
          {state.currentItem !== undefined && (
            <SpatialGrid itemId={state.currentItem} mode="encode" label={t.phases.encode} />
          )}
          <div
            className="encode-dots"
            role="img"
            aria-label={`${state.itemIndex + 1} / ${block.items.length}`}
          >
            {block.items.map((item, index) => (
              <span
                key={item}
                className={
                  index === state.itemIndex ? 'dot-now' : index < state.itemIndex ? 'dot-done' : ''
                }
              />
            ))}
          </div>
        </section>
      ) : block.kind === 'encode' ? (
        <section className="encode">
          <p className="hint">
            {t.encodeHints[block.moduleId]}
          </p>
          {/*
            Der Schlüssel wechselt mit dem Wort, damit React das Element neu
            einsetzt und die Bewegung erneut läuft — sonst tauschte nur der
            Text, und das wäre der harte Schnitt aus G-3.
          */}
          {/*
            Beim Gesichtsmodul steht das Bild über dem Namen — und beides
            zusammen ist die Information, die eingeprägt wird. Der Name allein
            wäre ein Wort, das Bild allein nichts.
          */}
          {block.moduleId === 'faces' && state.currentItem !== undefined && (
            <Face key={`face-${state.currentItem}`} name={state.currentItem} />
          )}
          {/*
            Beim Zahlenmodul steht unter jeder Ziffer ihr Konsonant — sobald
            sie gelehrt wurde (D5). Zwei Raster übereinander mit derselben
            Spaltenzahl: Nur so steht der Buchstabe wirklich unter *seiner*
            Ziffer, und genau darum geht es beim Lernen der Zuordnung.

            Die Ziffern bleiben dabei allein in `.encode-word` — die
            Buchstaben stehen daneben und nicht darin, sonst läse jeder, der
            das Element ausliest, „4r7k“ statt „47“.
          */}
          {block.moduleId === 'facts' ? (
            /*
              Ein eigenes Paar (D-032): Die Frage klein darüber, die Antwort
              als das große Wort — eingeprägt wird die Brücke zwischen
              beiden, nicht zwei Zeilen nacheinander.
            */
            <div className="fact-pair" key={block.id + state.itemIndex} aria-live="polite">
              <p className="fact-prompt">{factPrompt(state.currentItem ?? '')}</p>
              <p className="encode-word fact-answer">{factAnswer(state.currentItem ?? '')}</p>
            </div>
          ) : parts !== undefined ? (
            <div className="major" style={{ '--cells': parts.length } as CSSProperties}>
              <p className="encode-word major-row" key={block.id + state.itemIndex} aria-live="polite">
                {parts.map((part, index) => (
                  <span key={index}>{part.digit}</span>
                ))}
              </p>
              <p className="major-row major-letters" aria-hidden="true">
                {parts.map((part, index) => (
                  <span key={index}>{part.letters ?? '·'}</span>
                ))}
              </p>
            </div>
          ) : (
            <p className="encode-word" key={block.id + state.itemIndex} aria-live="polite">
              {/* Zwillinge (D-027): Die Kennung trägt beide Wörter — gezeigt
                  wird nur, was dastand. Der Köder kommt erst bei der Frage. */}
              {block.moduleId === 'twins'
                ? twinShown(state.currentItem ?? '')
                : state.currentItem}
            </p>
          )}
          {parts !== undefined && <p className="hint">{dictionary.technique.hint}</p>}

          <div
            className="encode-dots"
            role="img"
            aria-label={`${state.itemIndex + 1} / ${block.items.length}`}
          >
            {block.items.map((item, index) => (
              <span
                key={item}
                className={
                  index === state.itemIndex ? 'dot-now' : index < state.itemIndex ? 'dot-done' : ''
                }
              />
            ))}
          </div>
        </section>
      ) : block.moduleId === 'spatial' ? (
        <section className="prompted spatial-recall">
          <p className="hint">{block.kind === 'review' ? t.reviewHint : t.recallHint}</p>
          <SpatialGrid
            key={`${block.id}-${state.promptIndex}`}
            itemId={block.items[state.promptIndex] ?? ''}
            mode="recall"
            label={block.kind === 'review' ? t.reviewHint : t.recallHint}
            onChoose={submitPrompt}
          />
          <p className="hint">
            {state.promptIndex + 1} / {block.items.length}
          </p>
        </section>
      ) : isPrompted(block.moduleId) ? (
        <PromptedRecall
          key={`${block.id}-${state.promptIndex}`}
          face={subjectOf(block.moduleId, block.items[state.promptIndex] ?? '')}
          /*
            Beim Palast gibt es kein Gesicht — der Anker ist ein **Ort**. Statt
            eines Porträts steht das Schild der Station da, mit dem Palast
            darüber: „Deine Wohnung · Flur“. Das ist das Abgehen (G6), und es
            ist genau die Frage, die die Technik stellt.
          */
          place={
            block.moduleId === 'palace'
              ? placeOf(block.items[state.promptIndex] ?? '', dictionary, own)
              : undefined
          }
          reveal={
            block.moduleId === 'reverse' ? (block.items[state.promptIndex] ?? '') : undefined
          }
          choices={
            block.moduleId === 'twins'
              ? twinChoices(block.items[state.promptIndex] ?? '')
              : undefined
          }
          /*
            Eigene Paare (D-032): Die Frage des Menschen ist die Frage — sie
            steht groß da, wo sonst das Gesicht stünde.
          */
          question={
            block.moduleId === 'facts'
              ? factPrompt(block.items[state.promptIndex] ?? '')
              : block.moduleId === 'memory'
                ? memorySubjectOf(block.items[state.promptIndex] ?? '')
                : block.moduleId === 'associative'
                  ? displayOf(
                      'associative',
                      block.items[state.promptIndex] ?? '',
                      state.plan.language,
                    )
                  : undefined
          }
          gazeCue={
            block.moduleId === 'gaze'
              ? {
                  sceneId: gazeSceneOf(block.items[state.promptIndex] ?? ''),
                  ask: gazeObjectOf(block.items[state.promptIndex] ?? '') ?? 'umbrella',
                }
              : undefined
          }
          /*
            Bei der Mission steht der Name **unter** dem Gesicht — er ist hier
            nicht die Frage, sondern der Anker: „Elena — welches Zimmer?“
            Beim Gesichtsmodul wäre derselbe Name die Antwort und darf
            deshalb nirgends stehen.
          */
          label={
            block.moduleId === 'missions'
              ? subjectOf(block.moduleId, block.items[state.promptIndex] ?? '')
              : undefined
          }
          position={state.promptIndex + 1}
          total={block.items.length}
          hint={askFor(block, state.promptIndex, dictionary, state.plan.language as Language)}
          placeholder={placeholderFor(block, state.promptIndex, dictionary)}
          numeric={numericFor(block, state.promptIndex)}
          action={t.doneWithBlock}
          onSubmit={submitPrompt}
        />
      ) : (
        <section className="recall">
          {/* Der Wiedersehensblock sieht aus wie der Abruf und ist doch etwas
              anderes: Hier wurde nichts gezeigt. Der Text sagt das, sonst
              sucht man den Einprägeteil, den es nie gab. */}
          <p className="hint">{block.kind === 'review' ? t.reviewHint : t.recallHint}</p>
          <textarea
            ref={recallRef}
            className="recall-input"
            value={state.entries}
            onChange={(event) => setEntries(event.target.value)}
            placeholder={
              block.moduleId === 'numbers' ? t.recallNumbersPlaceholder : t.recallPlaceholder
            }
            /* Auf dem Telefon die Zifferntastatur. Wer eine sechsstellige Zahl
               auf der Buchstabentastatur sucht, verliert Sekunden an etwas,
               das mit Gedächtnis nichts zu tun hat. `numeric` und nicht `tel`:
               `tel` bringt Stern und Raute mit, die hier nichts sollen. */
            inputMode={block.moduleId === 'numbers' ? 'numeric' : 'text'}
            rows={4}
            autoFocus
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label={t.recallHint}
          />
          {/*
            Der Zeilenwechsel, den der Ziffernblock nicht hat (Gerätemeldung
            31.08.: „auf der Tastatur wird keine Möglichkeit gegeben, auf die
            nächste Zeile zu gehen"). `onMouseDown`/`onTouchStart` verhindern
            den Fokuswechsel — sonst schlösse sich am Telefon bei jedem
            Umbruch die Tastatur, und die nächste Zahl kostete zwei
            zusätzliche Tipper.
          */}
          {block.moduleId === 'numbers' ? (
            <button
              type="button"
              className="quiet recall-next"
              onMouseDown={(event) => event.preventDefault()}
              onTouchStart={(event) => event.preventDefault()}
              onClick={addRecallLine}
            >
              {t.recallNextNumber}
            </button>
          ) : undefined}
          {/*
            Das Getippte kommt als Marke zurück — sichtbar, greifbar, ohne
            jede Bewertung. Ein „richtig“ oder „falsch“ an dieser Stelle wäre
            ein Hinweis und würde den freien Abruf zerstören (C5).

            Zerlegt wird **wie gezählt wird**: Bei Zahlen ist das Leerzeichen
            Gruppierung („12 345“ ist eine Zahl, so zeigt die App sie auch an),
            bei Wörtern trennt es. Die Marken lasen früher immer die
            Wort-Regel und widersprachen damit sichtbar der Bewertung.
          */}
          <div className="chips" aria-hidden="true">
            {recallChips.map((entry, index) => (
              <span className="chip" key={`${entry}-${index}`}>
                {entry}
              </span>
            ))}
          </div>
          <button type="button" className="start" onClick={() => advance()}>
            <span className="start-label">{t.doneWithBlock}</span>
          </button>
        </section>
      )}

      <button type="button" className="quiet session-abort" onClick={leave}>
        {t.abort}
      </button>
    </main>
  )
}

/**
 * Gestützter Abruf: ein Gesicht, ein Feld, ein Name (Backlog D9).
 *
 * Der Schlüssel am Aufrufort wechselt mit dem Eintrag — dadurch setzt React
 * das Feld neu ein, es ist leer, und die Bewegung läuft erneut. Ohne das
 * stünde die vorige Antwort noch da, und der Nutzer müsste sie löschen, bevor
 * er die nächste tippen kann.
 */
/**
 * Wie lange die Rückwärts-Folge zu sehen ist (D7): lang genug zum Lesen,
 * zu kurz zum Aufschreiben. Je Ziffer bemessen, mit Untergrenze — fünf
 * Ziffern stehen drei Sekunden.
 */
const REVEAL_MS_PER_DIGIT = 600
const REVEAL_MS_MIN = 2000

function PromptedRecall({
  face,
  place,
  reveal,
  gazeCue,
  choices,
  question,
  label,
  position,
  total,
  hint,
  placeholder,
  numeric,
  action,
  onSubmit,
}: {
  face: string
  /** Ein Ort statt eines Gesichts — beim Palast (G6). */
  place?: { palace: string; station: string }
  /**
   * Eine Ziffernfolge, die kurz gezeigt und dann verdeckt wird (D7).
   * Solange sie steht, ist das Feld gesperrt — sonst ließe sie sich einfach
   * von rechts nach links abtippen, und geübt wäre nichts.
   */
  reveal?: string
  /**
   * Das Bild als Anker beim Abruf (Achse „Visuell“): in Tinte, das
   * gefragte Ding hervorgehoben. Zwei gelernte Bilder können dasselbe Ding
   * tragen — ohne das Bild fragte die App ins Leere.
   */
  gazeCue?: { sceneId: string; ask: GazeObject }
  /**
   * Zwei Wörter zur Wahl (Zwillinge, D-027): Die Knöpfe sind die Antwort —
   * kein Feld, kein Tippen. Getippt läge der Köder eine Tippfehler-Nachsicht
   * entfernt; gewählt ist die Aufgabe genau die Unterscheidung.
   */
  choices?: readonly [string, string]
  /** Die eigene Frage statt eines Gesichts (D-032). */
  question?: string
  /** Der Anker unter dem Gesicht — nur, wo der Name nicht die Antwort ist. */
  label?: string
  position: number
  total: number
  hint: string
  placeholder: string
  /** Zifferntastatur auf dem Telefon, wo eine Zahl gesucht ist. */
  numeric?: boolean
  action: string
  onSubmit: (answer: string) => void
}) {
  const [answer, setAnswer] = useState('')
  const [showing, setShowing] = useState(reveal !== undefined)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (reveal === undefined) return
    const ms = Math.max(REVEAL_MS_MIN, reveal.length * REVEAL_MS_PER_DIGIT)
    const timer = setTimeout(() => setShowing(false), ms)
    return () => clearTimeout(timer)
  }, [reveal])

  // Erst wenn die Folge verdeckt ist, bekommt das Feld den Fokus — vorher
  // ist es gesperrt, und ein gesperrtes Feld kann keinen tragen.
  useEffect(() => {
    if (reveal !== undefined && !showing) inputRef.current?.focus()
  }, [reveal, showing])

  return (
    <section className="prompted">
      <p className="hint">{hint}</p>
      {reveal !== undefined ? (
        /*
          Verdeckt heißt unsichtbar, nicht entfernt: `visibility` lässt die
          Zeile stehen, damit nichts springt — und die Prüfungen können
          ablesen, was gefragt war, statt es zu raten.
        */
        <p className={showing ? 'reveal-digits' : 'reveal-digits reveal-hidden'}>{reveal}</p>
      ) : place !== undefined ? (
        <div className="placemark">
          <span className="placemark-palace">{place.palace}</span>
          <span className="placemark-station">{place.station}</span>
        </div>
      ) : gazeCue !== undefined ? (
        <GazeScene sceneId={gazeCue.sceneId} ask={gazeCue.ask} />
      ) : question !== undefined ? (
        <p className="prompted-question">{question}</p>
      ) : choices !== undefined ? null : (
        <Face name={face} size={168} />
      )}
      {label !== undefined && <p className="prompted-anchor">{label}</p>}
      {choices !== undefined && (
        <div className="twin-choices">
          {choices.map((word) => (
            <button key={word} type="button" className="twin-choice" onClick={() => onSubmit(word)}>
              {word}
            </button>
          ))}
        </div>
      )}
      {choices === undefined && (
        <form
        className="prompted-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit(answer)
        }}
      >
        <input
          ref={inputRef}
          className="recall-input prompted-input"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder={placeholder}
          inputMode={numeric === true ? 'numeric' : 'text'}
          disabled={reveal !== undefined && showing}
          autoFocus={reveal === undefined}
          autoCapitalize="words"
          autoCorrect="off"
          spellCheck={false}
          aria-label={hint}
        />
          <button type="submit" className="start">
            <span className="start-label">{action}</span>
          </button>
        </form>
      )}
      <p className="hint">
        {position} / {total}
      </p>
    </section>
  )
}

function Summary({
  dictionary,
  results,
  language,
  landing,
  onLeave,
  onAgain,
}: {
  dictionary: Dictionary
  results: RoundResult[]
  language: string
  landing: boolean
  onLeave: () => void
  onAgain: () => void
}) {
  const t = dictionary.summary
  const learned = results.filter((round) => round.kind === 'recall')
  const revisited = results.filter((round) => round.kind === 'review')

  /*
   * Aus Kennungen werden lesbare Zeilen.
   *
   * `Elena#room` ist der Name in der Datenbank und kein Satz. In der
   * Zusammenfassung soll stehen, woran man sich erinnert hat — „Elena · 314“.
   * Überall außer bei den Missionen ändert das nichts; dort ist die Kennung
   * schon die Sache selbst. Einheiten aus älteren Fassungen haben kein Modul
   * gespeichert; dann bleibt der Gegenstand, wie er ist.
   */
  const readable = (round: RoundResult, items: readonly string[]) =>
    round.moduleId === undefined
      ? [...items]
      : items.map((item) => displayOf(round.moduleId as ModuleId, item, language))

  const correct = learned.flatMap((round) => readable(round, round.correct))
  const missed = learned.flatMap((round) => readable(round, round.missed))
  const total = correct.length + missed.length
  const shown = useCountUp(correct.length)

  const reviewCorrect = revisited.flatMap((round) => round.correct)
  const reviewTotal = reviewCorrect.length + revisited.flatMap((round) => round.missed).length

  return (
    <main className={`app summary-screen${landing ? ' summary-memory-landing' : ''}`}>
      <section className="challenge">
        <h2>{t.heading}</h2>
        {/*
          Eine einzige, echte Zahl. Kein Prozentwert, keine „Memory Strength“ —
          die käme aus dem Benchmark, und den gibt es noch nicht
          (D-006, Regel R-1 und D-011/G-6).
        */}
        <p className="summary-score">
          <strong>{shown}</strong>
          <span> / {total}</span>
        </p>
        <div className="summary-words">
          {correct.map((word, index) => (
            <span className="chip" key={word} style={{ '--i': index } as React.CSSProperties}>
              {word}
            </span>
          ))}
        </div>
      </section>

      {/*
        Das Wiedersehen bekommt eine eigene Zahl (D8).
        Sie mit dem heute Gelernten zu verrechnen wäre bequem und falsch:
        Etwas nach drei Tagen zu erinnern ist eine andere Leistung, als es
        zwei Minuten nach dem Einprägen abzurufen. Zwei Leistungen, zwei
        Zahlen — dieselbe Trennung wie zwischen Trainingsscore und Benchmark.
      */}
      {reviewTotal > 0 && (
        <section className="challenge">
          <h2>{t.fromBefore}</h2>
          <p className="summary-score summary-score-small">
            <strong>{reviewCorrect.length}</strong>
            <span> / {reviewTotal}</span>
          </p>
        </section>
      )}

      {missed.length > 0 && (
        <section className="challenge">
          {/* G-5: Was nicht kam, ist kein Versagen — es steht nur daneben,
              in gedeckter Farbe, ohne Kommentar. */}
          <h2>{t.missed}</h2>
          <div className="summary-words">
            {missed.map((word, index) => (
              <span
                className="chip chip-muted"
                key={word}
                style={{ '--i': index } as React.CSSProperties}
              >
                {word}
              </span>
            ))}
          </div>
        </section>
      )}

      <p className="hint">{t.note}</p>

      {/*
        Weitermachen (B7): ein Angebot, kein Auftrag. Es steht neben „Zurück“,
        nicht darüber, und trägt kein Ausrufezeichen — wer aufhören will, hört
        auf; wer weitermachen will, tippt einmal. Die neue Runde zählt wie
        jede andere für Serie und Wiedersehen, ohne eigenen Druck.
      */}
      <div className="summary-actions">
        <button type="button" className="quiet" onClick={onAgain}>
          {t.again}
        </button>
        <button type="button" className="quiet summary-back" onClick={onLeave}>
          {t.back}
        </button>
      </div>
    </main>
  )
}

function formatSeconds(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')}`
}

/**
 * Eine Lektion (Backlog D5).
 *
 * Der Bildschirm, auf dem ANITEW etwas **beibringt** statt abzufragen — und
 * er ist bewusst der ruhigste der ganzen App: eine Ziffer, ihr Laut, ein Satz
 * dazu. Ein Bild pro Bildschirm (G-2), kein Fortschrittsbalken, keine
 * Belohnung, kein „Verstanden?“-Knopf, der eine Prüfung andeutet.
 *
 * Die Brücke ist der eigentliche Inhalt: Ohne sie ist die Zuordnung Willkür,
 * und Willkür merkt sich niemand. „Das kleine n hat zwei Abstriche“ ist der
 * Grund, warum die Zwei hängen bleibt.
 *
 * Antippen geht weiter; wer nichts tut, wird nach vierzehn Sekunden von
 * selbst weitergetragen. Beides gilt als gehalten — die Lektion ist kein
 * Hindernis, das man nehmen muss.
 */
function Lesson({
  dictionary,
  digit,
  onDone,
}: {
  dictionary: Dictionary
  digit: number
  onDone: () => void
}) {
  const t = dictionary.technique
  // Die Schlüssel in `de.ts` sind Zahlen, keine Zeichenketten — ein Blick
  // durch `Record<number, string>` erspart die Wandlung und die Behauptung,
  // der Wert sei sicher da.
  const hooks: Record<number, string> = t.hooks
  const hook = hooks[digit] ?? ''

  return (
    <section className="lesson">
      {/*
        Der Zweck steht über **jeder** Lektion, nicht nur über der ersten.
        Früher stand ab der zweiten Ziffer nur noch der Name der Technik —
        gemeldet wurde genau der Effekt: „Da hat man keine Ahnung, worum es
        geht.“ Ein Name erklärt nichts.
      */}
      <p className="hint">{t.intro}</p>
      <button type="button" className="lesson-card" onClick={onDone}>
        <span className="lesson-digit">{digit}</span>
        <span className="lesson-letters">{lettersFor(digit)}</span>
      </button>
      <p className="lesson-hook">{hook}</p>
      <p className="hint">{t.ready}</p>
    </section>
  )
}

/**
 * Die Szene einer Mission (Backlog H1, H2).
 *
 * Alles auf einmal, nicht nacheinander: Person, Zimmer, Gegenstand, Abfahrt,
 * Restaurant. Geübt wird nicht, vier Tatsachen zu behalten — geübt wird, dass
 * sie **zusammengehören**. Wer sie einzeln zu sehen bekommt, merkt sich
 * einzelne Dinge und hat beim Abruf nichts, woran sie hängen.
 *
 * Das Gesicht steht oben, weil es der Anker ist: Nach drei Tagen lautet die
 * Frage „Elena — welches Zimmer?“, und dann muss Elena ein Gesicht haben.
 */
function Scene({
  dictionary,
  person,
  language,
}: {
  dictionary: Dictionary
  person: string
  language: string
}) {
  const mission = missionFor(person, language as Language)
  const t = dictionary.mission
  const value = (kind: FactKind) => mission.facts.find((fact) => fact.kind === kind)?.value ?? ''

  return (
    <section className="encode scene">
      <p className="hint">{dictionary.session.encodeHints.missions}</p>
      <Face name={person} size={132} />
      <p className="scene-person">{person}</p>
      <dl className="scene-facts">
        <div>
          <dt>{t.room}</dt>
          <dd>{value('room')}</dd>
        </div>
        <div>
          <dt>{t.departure}</dt>
          <dd>{value('time')}</dd>
        </div>
        {/*
          * Gegenstand und Position stehen getrennt — je eine Zeile mit eigener
          * Beschriftung.
          *
          * Vorher klebten beide unter „Dabei" in einer Zeile aneinander, durch
          * „ · " getrennt. Abgefragt wurden sie trotzdem einzeln: „Was hatte
          * sie oder er dabei?" und „Wo lag der Gegenstand?". Wer die Szene
          * ansah, konnte nicht wissen, dass die zweite Hälfte eine eigene
          * Angabe ist — gemeldet vom Gerät am 01.09. Eine Szene muss zeigen,
          * was sie später abfragt.
          *
          * Die Beschriftung der Position ist derselbe Text wie die
          * Eingabehilfe beim Abruf. Absicht: Was beim Ansehen „Position"
          * heißt, heißt beim Erinnern auch so.
          */}
        <div>
          <dt>{t.carrying}</dt>
          <dd>{missionObjectFor(person, language as Language)}</dd>
        </div>
        <div>
          <dt>{dictionary.session.missionPlaceholders.location}</dt>
          <dd>{value('location')}</dd>
        </div>
        <div>
          <dt>{t.restaurant}</dt>
          <dd>{value('place')}</dd>
        </div>
      </dl>
    </section>
  )
}

/**
 * Die Lektion zum Gedächtnispalast (Backlog G, D-013).
 *
 * Sie kommt genau einmal, vor dem ersten Gang. Anders als beim Major-System
 * gibt es hier nichts auswendig zu lernen — die Technik ist in drei Schritten
 * erzählt, alles Weitere ist Übung.
 *
 * Der letzte Satz ist der wichtigste und steht deshalb allein: **Das Bild
 * baut der Nutzer.** Eine App, die „stell dir einen qualmenden Toaster vor“
 * mitliefert, nimmt genau den Schritt ab, der wirkt (D-017).
 */
/**
 * Geschichte und Verknüpfung (D5 · D-013) — dieselbe ruhige Karte wie die
 * Palastlektion: Überschrift, drei Schritte, ein Satz zum Anpacken. Kein
 * Beispiel-Merkbild von uns — selbst gebaute sitzen besser (D-013).
 */
function EncodingLessonView({
  dictionary,
  lesson,
  onDone,
}: {
  dictionary: Dictionary
  lesson: 'story' | 'link'
  onDone: () => void
}) {
  const t = lesson === 'story' ? dictionary.technique.story : dictionary.technique.link

  return (
    <section className="lesson">
      <p className="hint">{t.heading}</p>
      <button type="button" className="lesson-card lesson-wide" onClick={onDone}>
        <span className="lesson-intro">{t.intro}</span>
        <ol className="lesson-steps">
          {t.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </button>
      <p className="lesson-hook">{t.build}</p>
      <p className="hint">{t.ready}</p>
    </section>
  )
}

/**
 * Das Verfahren des Major-Systems (D5, Gerätemeldung 01.09.).
 *
 * Dieselbe ruhige Karte wie bei Palast, Geschichte und Verknüpfung — und aus
 * demselben Grund: Eine Technik, die man anwenden soll, gehört vorher
 * erklärt. Sie kommt einmal, unmittelbar vor der ersten Ziffer, in derselben
 * Einheit.
 */
function MethodLesson({ dictionary, onDone }: { dictionary: Dictionary; onDone: () => void }) {
  const t = dictionary.technique

  return (
    <section className="lesson">
      <p className="hint">{t.heading}</p>
      <button type="button" className="lesson-card lesson-wide" onClick={onDone}>
        <span className="lesson-intro">{t.majorName}</span>
        {/*
          * Was es ist und wozu es hilft — vor den Schritten.
          *
          * Zweite Gerätemeldung vom 01.09.: „C'est quoi le Major Système? Ça
          * consiste à quoi exactement? Ça aide à faire quoi?" Die Lektion
          * sagte bis dahin nur, **wie** es geht. Wer nicht weiß, wofür er
          * etwas lernt, lernt es nicht — und drei Schritte ohne Zweck sind
          * eine Anweisung, keine Erklärung.
          */}
        <span className="lesson-what">{t.method.what}</span>
        <span className="lesson-what">{t.method.helps}</span>
        <ol className="lesson-steps">
          {t.method.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </button>
      <p className="lesson-hook">{t.method.build}</p>
      <p className="hint">{t.method.ready}</p>
    </section>
  )
}

function PalaceLesson({ dictionary, onDone }: { dictionary: Dictionary; onDone: () => void }) {
  const t = dictionary.palace

  return (
    <section className="lesson">
      <p className="hint">{t.heading}</p>
      <button type="button" className="lesson-card lesson-wide" onClick={onDone}>
        <span className="lesson-intro">{t.lessonIntro}</span>
        <ol className="lesson-steps">
          {t.lessonSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </button>
      <p className="lesson-hook">{t.lessonBuild}</p>
      <p className="hint">{t.lessonReady}</p>
    </section>
  )
}

/**
 * Ein Gang durch einen Palast (Backlog G1, G2, G6).
 *
 * Die Stationen stehen in der Reihenfolge des Weges, nummeriert — die
 * Reihenfolge ist nicht Deko, sie ist die halbe Technik. Der Hinweis darüber
 * sagt, was zu tun ist: hinlegen, nicht lesen.
 */
function Walk({
  dictionary,
  walk,
  language,
  own,
}: {
  dictionary: Dictionary
  walk: string
  language: string
  own?: readonly OwnPalace[]
}) {
  const t = dictionary.palace
  const palace = palaceOf(walk)
  const placements = walkFor(walk, language as Language)
  // Der Palast dieses Gangs — bei den eingebauten Wegen bleibt es `undefined`,
  // und die Schilder kommen wie bisher aus `i18n`.
  const ownPalace = own === undefined ? undefined : ownPalaceFor(walk, own)

  return (
    <section className="encode scene walk">
      <p className="hint">{dictionary.session.encodeHints.palace}</p>
      <p className="scene-person">
        {t.walkLead} {palaceName(palace, dictionary, ownPalace)}
      </p>
      <dl className="scene-facts">
        {placements.map((placement, index) => (
          <div key={placement.station}>
            <dt>
              <span className="walk-step" aria-hidden="true">
                {index + 1}
              </span>
              <span className="walk-station">{labelOf(placement.station, dictionary, ownPalace)}</span>
            </dt>
            <dd>{placement.object}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/**
 * Was auf dem Schild einer Station steht.
 *
 * Beim eigenen Palast kommt es aus den Einstellungen und nicht aus `i18n`
 * (G3) — die Beschriftung gehört dem Nutzer, nicht der Übersetzung. Fehlt sie
 * (der Palast wurde weggeworfen), bleibt die nackte Kennung stehen; gefragt
 * wird ein solcher Gang ohnehin nicht mehr, dafür sorgt die Auswahl der
 * fälligen Einträge.
 */
function labelOf(station: string, dictionary: Dictionary, own?: OwnPalace): string {
  if (own !== undefined) {
    const label = ownLabelOf(own, station)
    if (label !== undefined && label !== '') return label
  }
  const stations: Record<string, string> = dictionary.palace.stations
  return stations[station] ?? station
}

function palaceName(palace: string | undefined, dictionary: Dictionary, own?: OwnPalace): string {
  if (palace === undefined) return ''
  if (isOwnPalaceId(palace)) return own?.name ?? ''
  return (dictionary.palace.names as Record<string, string>)[palace] ?? ''
}

/** Palast und Station einer Ablage, beschriftet. */
function placeOf(
  item: string,
  dictionary: Dictionary,
  own?: readonly OwnPalace[],
): { palace: string; station: string } | undefined {
  const palace = palaceOf(item)
  const station = stationOf(item)
  if (palace === undefined || station === undefined) return undefined
  const ownPalace = own === undefined ? undefined : ownPalaceFor(item, own)
  return {
    palace: palaceName(palace, dictionary, ownPalace),
    station: labelOf(station, dictionary, ownPalace),
  }
}

/**
 * Die Frage zur Stelle, an der der Abruf gerade steht.
 *
 * Beim Gesichtsmodul ist es immer dieselbe („Wer ist das?“), bei einer
 * Mission hängt sie an der Tatsache.
 *
 * Der Wiedersehensblock bekommt in **beiden** Fällen seinen Vorspann. Zuerst
 * hatte ich ihn bei der Mission weggelassen — die Person steht ja dabei, die
 * Frage ist klar. Das war falsch, und ein E2E-Lauf hat es aufgedeckt: Ohne
 * Vorspann sieht „Welche Zimmernummer?“ genauso aus wie bei einer Szene, die
 * man gerade eben gesehen hat. Dass hier nach etwas von vor Tagen gefragt
 * wird, ist eine Auskunft, die dem Nutzer zusteht — und nicht bloß eine
 * Höflichkeitsfloskel.
 */
function askFor(
  block: BlockPlan,
  index: number,
  dictionary: Dictionary,
  language: Language,
): string {
  const t = dictionary.session
  // Rückwärts gibt es nur als Sofortfrage — ein Wiedersehen hat das Modul
  // nicht (D-026), also braucht die Frage keinen Vorspann.
  if (block.moduleId === 'reverse') return t.reverseAsk
  if (block.moduleId === 'twins') {
    return block.kind === 'review' ? `${t.reviewLead} ${t.twinAsk}` : t.twinAsk
  }
  if (block.moduleId === 'gaze') {
    const object = gazeObjectName(block.items[index] ?? '', language) ?? ''
    const ask = t.gazeAsk.replace('{object}', object)
    return block.kind === 'review' ? `${t.reviewLead} ${ask}` : ask
  }
  if (block.moduleId === 'palace') {
    const ask = dictionary.palace.ask
    return block.kind === 'review' ? `${t.reviewLead} ${ask}` : ask
  }
  if (block.moduleId === 'memory') {
    // Die Frage nennt den Anker — „Daniel — was gehört dazu?“ (D-036).
    const ask = t.memoryAsk.replace('{subject}', memorySubjectOf(block.items[index] ?? ''))
    return block.kind === 'review' ? `${t.reviewLead} ${ask}` : ask
  }
  if (block.moduleId !== 'missions') {
    return block.kind === 'review' ? t.reviewPromptHint : t.promptHint
  }
  const kind = factKindOf(block.items[index] ?? '')
  const ask = kind === undefined ? t.promptHint : t.missionAsk[kind]
  return block.kind === 'review' ? `${t.reviewLead} ${ask}` : ask
}

function placeholderFor(block: BlockPlan, index: number, dictionary: Dictionary): string {
  const t = dictionary.session
  if (block.moduleId === 'reverse') return t.reversePlaceholder
  if (block.moduleId === 'gaze') return t.gazePlaceholder
  if (block.moduleId === 'palace') return dictionary.palace.placeholder
  if (block.moduleId === 'memory') return t.memoryPlaceholder
  if (block.moduleId !== 'missions') return t.promptPlaceholder
  const kind = factKindOf(block.items[index] ?? '')
  return kind === undefined ? t.promptPlaceholder : t.missionPlaceholders[kind]
}

/** Zimmernummer und Uhrzeit sind Zahlen — dann die Zifferntastatur. */
function numericFor(block: BlockPlan, index: number): boolean {
  if (block.moduleId === 'reverse') return true
  // Memory (D-036): Ist die gesuchte Antwort eine Zahl, kommt die Zifferntastatur.
  if (block.moduleId === 'memory') return /^\d+$/.test(memoryTargetOf(block.items[index] ?? ''))
  if (block.moduleId !== 'missions') return false
  const kind = factKindOf(block.items[index] ?? '')
  return kind === 'room' || kind === 'time'
}
