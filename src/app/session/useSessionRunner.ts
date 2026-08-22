import { useCallback, useEffect, useRef, useState } from 'react'

import {
  type BlockPlan,
  displayNumber,
  displayOf,
  entersReview,
  gradeRecall,
  isPrompted,
  leniencyFor,
  type Platform,
  promptedHits,
  promptedSetHits,
  secondsPerItemFor,
  subjectOf,
  type SessionPlan,
  splitEntries,
  splitNumberEntries,
  targetOf,
} from '../../core/index.ts'
import { recordOutcome } from '../../data/items.ts'
import { applyMemoryOutcome } from '../../data/memoryStore.ts'
import { markLinkTaught, markPalaceTaught, markStoryTaught, markTaught } from '../../data/technique.ts'
import {
  type RoundResult,
  type SessionProgress,
  clearProgress,
  completeSession,
  logRecall,
  logShown,
  saveProgress,
} from '../../data/sessions.ts'

export interface RunnerState {
  plan: SessionPlan
  blockIndex: number
  block: BlockPlan | undefined
  /** Verbleibende Sekunden im laufenden Block, aufgerundet. */
  remaining: number
  /** Das Wort, das gerade gezeigt wird — nur beim Einprägen. */
  currentItem: string | undefined
  itemIndex: number
  entries: string
  /** Beim gestützten Abruf: die Antworten in der Reihenfolge der Einträge. */
  answers: string[]
  /** Beim gestützten Abruf: welcher Eintrag gerade gefragt wird. */
  promptIndex: number
  results: RoundResult[]
  /** Kurze reine Experience-Resonanz nach einem echten persönlichen Treffer. */
  landingPulse: boolean
  finished: boolean
}

/**
 * Führt eine Trainingseinheit aus (Backlog B2).
 *
 * Die Zeit kommt aus `clock.elapsed()`, nicht aus `Date.now()`: Die Wanduhr
 * kann während einer Einheit springen — durch die Zeitumstellung, durch einen
 * Abgleich mit dem Netz oder weil jemand die Streak überlisten will. Ein Block,
 * der 60 Sekunden dauern soll, darf davon nichts merken (Backlog P5).
 *
 * Ein Trainingsblock endet, wenn seine Zeit abgelaufen ist — oder früher,
 * wenn der Nutzer fertig ist. **Techniklektionen sind die Ausnahme:** Lesen
 * ist kein Reaktionstest. Sie bleiben stehen, bis der Mensch bewusst weiter
 * tippt; ihre Lesezeit wird damit nicht heimlich vom gewählten Trainingsbudget
 * abgezogen.
 */
export function useSessionRunner(
  platform: Platform,
  initial: SessionProgress,
  onLeave: () => void,
) {
  const [blockIndex, setBlockIndex] = useState(initial.blockIndex)
  const [results, setResults] = useState<RoundResult[]>(initial.results)
  const [entries, setEntries] = useState('')
  const [answers, setAnswers] = useState<string[]>([])
  const [promptIndex, setPromptIndex] = useState(0)
  const [itemIndex, setItemIndex] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [landingPulse, setLandingPulse] = useState(false)

  const blockStartedRef = useRef(platform.clock.elapsed())
  const sessionRef = useRef(initial)
  const advancingRef = useRef(false)

  const plan = initial.plan
  const block = plan.blocks[blockIndex]
  const finished = blockIndex >= plan.blocks.length

  // Jeder Blockwechsel setzt die Uhr neu.
  useEffect(() => {
    blockStartedRef.current = platform.clock.elapsed()
    setItemIndex(0)
    setEntries('')
    setAnswers([])
    setPromptIndex(0)
    advancingRef.current = false
    setRemaining(block?.seconds ?? 0)
  }, [blockIndex, block?.seconds, platform])

  const persist = useCallback(
    (nextIndex: number, nextResults: RoundResult[]) => {
      const progress: SessionProgress = {
        ...sessionRef.current,
        blockIndex: nextIndex,
        results: nextResults,
      }
      sessionRef.current = progress
      void saveProgress(progress).catch(() => {
        // Kein Speicher heißt: Die Einheit läuft weiter, überlebt aber keinen
        // Absturz. Ein Dialog mitten im Training wäre der schlechtere Tausch.
      })
    },
    [],
  )

  /** Block beenden — durch Zeitablauf oder weil der Nutzer fertig ist. */
  const advance = useCallback(
    (finalAnswers?: readonly string[]) => {
    if (advancingRef.current || block === undefined) return
    advancingRef.current = true

    const nextResults = [...results]

    /*
     * Eine Lektion gilt erst als gehalten, wenn der Mensch bewusst weitergeht.
     * Techniklektionen laufen nicht mehr von selbst ab: Wer hier landet, hat
     * den expliziten Weiter-Knopf benutzt. Das Merken passiert weiterhin im
     * Runner und nicht im Bildschirm, damit es nur eine Wahrheit gibt.
     */
    if (block.kind === 'teach') {
      /*
       * Vier Techniken, vier Merker: die Ziffer beim Major-System, je ein
       * schlichtes Ja bei Palast, Geschichte und Verknüpfung — die drei
       * werden nur einmal erklärt (G, D5). Geschichte/Verknüpfung erkennt
       * man an der Block-Kennung, nicht am Modul: Ihr Modul ist das
       * Anwendungsmodul (words/faces), und das lehrt auch Ziffern nie.
       */
      if (block.id === 'teach-story') void markStoryTaught().catch(() => undefined)
      else if (block.id === 'teach-link') void markLinkTaught().catch(() => undefined)
      else if (block.moduleId === 'palace') void markPalaceTaught().catch(() => undefined)
      else void markTaught(Number(block.items[0])).catch(() => undefined)
    }

    if (block.kind === 'recall' || block.kind === 'review') {
      // Frei getippt oder Eintrag für Eintrag gefragt — die Bewertung
      // unterscheidet sich, das Ergebnis hat dieselbe Form.
      /*
       * Die Strenge kommt vom Modul, nicht von hier — und innerhalb einer
       * Mission sogar von der einzelnen Tatsache: Zimmernummer und Uhrzeit
       * sind Zahlen, der Gegenstand ist ein Wort (D-012).
       *
       * Und noch etwas trennt sich hier, was überall sonst dasselbe ist:
       * **Gefragt wird nach dem Wert, verbucht wird die Kennung.** Bei einem
       * Wort ist beides „Anker“; bei einer Mission ist das eine „314“ und das
       * andere `Elena#room`. Der Wiederholungstermin hängt an der Kennung —
       * sonst wären zwei Szenen mit demselben Zimmer eine.
       */
      const graded = isPrompted(block.moduleId)
        ? (() => {
            const targets = block.items.map((item) => targetOf(block.moduleId, item, plan.language))
            /*
             * Memory (D-036): Am selben Anker stellen alle Fragen dieselbe
             * Frage — gewertet wird deshalb als Menge je Anker, nicht
             * Position für Position: Die Reihenfolge, in der jemandem
             * Madrid und Museum einfallen, ist keine Gedächtnisleistung.
             */
            const hits =
              block.moduleId === 'memory'
                ? promptedSetHits(
                    finalAnswers ?? answers,
                    targets,
                    block.items.map((item) => leniencyFor(block.moduleId, item)),
                    (index) => subjectOf(block.moduleId, block.items[index] ?? ''),
                  )
                : promptedHits(
                    finalAnswers ?? answers,
                    targets,
                    block.items.map((item) => leniencyFor(block.moduleId, item)),
                  )
            return {
              correct: block.items.filter((_, index) => hits[index] === true),
              missed: block.items.filter((_, index) => hits[index] !== true),
              extra: [] as string[],
            }
          })()
        : gradeRecall(
            block.moduleId === 'numbers' ? splitNumberEntries(entries) : splitEntries(entries),
            block.items,
            leniencyFor(block.moduleId),
          )
      nextResults.push({ round: block.round, kind: block.kind, moduleId: block.moduleId, ...graded })
      const duration = platform.clock.elapsed() - blockStartedRef.current
      const at = platform.clock.now()

      void logRecall(
        sessionRef.current.sessionId,
        at,
        graded,
        duration,
        block.kind,
        // Das echte Modul, nicht die Blockart — daraus zählen die
        // Sofort-Achsen des Profils (D-026).
        block.moduleId,
        // C10: Nur Module, die wirklich einen FSRS-Termin fortschreiben,
        // tragen vollständige Scheduler-ID + Trainingstag ins Rohprotokoll.
        entersReview(block.moduleId) ? { language: plan.language, day: plan.day } : undefined,
      ).catch(() => undefined)

      /*
       * Hier wird aus einer Antwort ein Termin (D-004).
       *
       * Beide Blockarten schreiben denselben Weg: Ein heute gelerntes Wort
       * bekommt seinen ersten Termin, ein wiedergesehenes seinen nächsten.
       * Für den Scheduler ist das derselbe Vorgang — nur der Vorzustand
       * unterscheidet sich, und den kennt er selbst.
       *
       * **Außer beim Arbeitsgedächtnis** (D7 · D-026): Umbauen im Moment ist
       * kein Behalten — eine Rückwärts-Folge bekommt keinen Termin, sonst
       * fragte das Wiedersehen nach Tagen etwas, das nie zum Merken gedacht
       * war.
       */
      if (entersReview(block.moduleId)) {
        void recordOutcome(block.moduleId, plan.language, plan.day, at, {
          recalled: graded.correct,
          missed: graded.missed,
        }).catch(() => undefined)
      }

      /*
       * Der Memory-Graph (D-036) bekommt dasselbe Ergebnis als **Auswahl**-
       * Signal: richtig hebt die Stärke, falsch senkt sie — die nächste
       * Einheit nimmt die schwächsten zuerst. Der Termin läuft weiter
       * ausschließlich über `recordOutcome` (FSRS bleibt die Wahrheit).
       */
      if (block.moduleId === 'memory') {
        // Ein aufgelöster Abruf klingt neutral. Nur wenn tatsächlich mindestens
        // eine persönliche Erinnerung wiedergekommen ist, folgt ANITEWs
        // Signature-Landing. Kein Treffer = kein Erfolgsfeedback.
        platform.sound.play('recall')
        if (graded.correct.length > 0) {
          platform.sound.play('landing')
          setLandingPulse(true)
          window.setTimeout(() => setLandingPulse(false), 900)
        }
        void applyMemoryOutcome({ correct: graded.correct, missed: graded.missed }, at).catch(
          () => undefined,
        )
      }

      setResults(nextResults)
    }

    const nextIndex = blockIndex + 1
    persist(nextIndex, nextResults)
    setBlockIndex(nextIndex)

    // Ein Block endet hörbar (D-011/G-9): zwei Töne abwärts, wenn es
    // weitergeht — der ganze kleine Akkord, wenn es geschafft ist.
    platform.sound.play(nextIndex >= plan.blocks.length ? 'done' : 'block')

    if (nextIndex >= plan.blocks.length) {
      void completeSession(sessionRef.current.sessionId, platform.clock.now()).catch(
        () => undefined,
      )
    }
    },
    [answers, block, blockIndex, entries, persist, plan, platform, results],
  )

  // Der Herzschlag. Techniklektionen hängen bewusst **nicht** daran: Sie
  // bleiben so lange stehen, wie Lesen eben dauert. Erst nach dem bewussten
  // Weiter beginnt der nächste zeitbegrenzte Trainingsblock mit eigener Uhr.
  useEffect(() => {
    if (finished || block === undefined) return
    if (block.kind === 'teach') {
      setRemaining(block.seconds)
      return
    }

    const timer = setInterval(() => {
      const elapsed = (platform.clock.elapsed() - blockStartedRef.current) / 1000
      const left = Math.max(0, block.seconds - elapsed)
      setRemaining(Math.ceil(left))

      if (block.kind === 'encode') {
        // Der Takt des Moduls, nicht die Wort-Konstante: Eine Szene gibt
        // ihren Stücken mehr Sekunden, und die Anzeige soll dem Plan folgen.
        const index = Math.min(
          block.items.length - 1,
          Math.floor(elapsed / secondsPerItemFor(block.moduleId)),
        )
        setItemIndex(index)
      }
      if (left <= 0) advance()
    }, 200)
    return () => clearInterval(timer)
  }, [advance, block, finished, platform])

  // Jedes gezeigte Wort landet im Protokoll — und der Fortschritt wird
  // mitgeschrieben, damit ein Anruf höchstens ein Wort kostet (B5).
  const loggedRef = useRef<string>('')
  useEffect(() => {
    if (block === undefined || block.kind !== 'encode') return
    const item = block.items[itemIndex]
    if (item === undefined) return
    const marker = `${block.id}:${itemIndex}`
    if (loggedRef.current === marker) return
    loggedRef.current = marker
    // Die Tonhöhe steigt mit jedem Wort: Man hört, wie weit die Runde ist,
    // ohne auf die Punkte zu sehen.
    platform.sound.play('word', itemIndex)
    void logShown(sessionRef.current.sessionId, platform.clock.now(), item).catch(() => undefined)
    persist(blockIndex, results)
  }, [block, blockIndex, itemIndex, persist, platform, results])

  /**
   * Eine Antwort im gestützten Abruf abgeben.
   *
   * Kein eigener Zeitgeber je Eintrag: Der Block hat sein Budget, und wer
   * schnell ist, kommt weiter. Läuft die Zeit ab, gilt der Rest als nicht
   * erinnert — das ist ehrlicher, als jedem Gesicht dieselben Sekunden zu
   * geben und den Nutzer warten zu lassen, wenn er den Namen sofort weiß.
   */
  const submitPrompt = useCallback(
    (answer: string) => {
      if (block === undefined) return
      const next = [...answers]
      next[promptIndex] = answer
      setAnswers(next)
      platform.sound.play('type', promptIndex)

      if (promptIndex + 1 >= block.items.length) {
        /*
         * Der letzte Eintrag beendet den Block sofort.
         *
         * Die Antworten werden `advance()` **direkt übergeben** und nicht aus
         * dem Zustand gelesen: `setAnswers` wirkt erst beim nächsten
         * Durchlauf, und der kommt hier zu spät. Über den Zustand zu gehen
         * hieße, die letzte Antwort zu verlieren — bei fünf Gesichtern also
         * jedes fünfte Ergebnis.
         */
        advance(next)
        return
      }
      setPromptIndex(promptIndex + 1)
    },
    [advance, answers, block, platform, promptIndex],
  )

  const leave = useCallback(() => {
    // Aus demselben Grund wie beim Verwerfen im Startbildschirm: erst löschen,
    // dann zurück. Sonst kann ein Neustart die abgebrochene Einheit
    // wiederauferstehen lassen.
    void clearProgress()
      .catch(() => undefined)
      .finally(onLeave)
  }, [onLeave])

  const item = block?.kind === 'encode' ? block.items[itemIndex] : undefined
  const currentItem =
    item !== undefined && block?.moduleId === 'associative'
      ? `${displayOf('associative', item, plan.language)} · ${targetOf('associative', item, plan.language)}`
      : item !== undefined && block?.moduleId === 'numbers'
        ? displayNumber(item)
        : item

  const state: RunnerState = {
    plan,
    blockIndex,
    block,
    remaining,
    currentItem,
    itemIndex,
    entries,
    answers,
    promptIndex,
    results,
    landingPulse,
    finished,
  }

  return { state, setEntries, submitPrompt, advance, leave }
}