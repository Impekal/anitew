import { useCallback, useEffect, useRef, useState } from 'react'

import {
  type BlockPlan,
  type Platform,
  SECONDS_PER_ITEM,
  type SessionPlan,
  gradePrompted,
  gradeRecall,
  isPrompted,
  leniencyFor,
  splitEntries,
} from '../../core/index.ts'
import { recordOutcome } from '../../data/items.ts'
import { markTaught } from '../../data/technique.ts'
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
 * Ein Block endet, wenn seine Zeit abgelaufen ist — oder früher, wenn der
 * Nutzer fertig ist. Das Budget ist eine Obergrenze, keine Wartepflicht.
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
     * Eine Lektion gilt als gehalten, sobald sie vorbei ist — ob durch Tippen
     * oder durch Ablauf der Zeit (D5). Das Merken passiert hier und nicht im
     * Bildschirm: Wer die Lektion wegtippt, hat sie ebenso gesehen wie wer
     * sie ausliest, und beide sollen morgen die nächste bekommen.
     */
    if (block.kind === 'teach') {
      void markTaught(Number(block.items[0])).catch(() => undefined)
    }

    if (block.kind === 'recall' || block.kind === 'review') {
      // Frei getippt oder Eintrag für Eintrag gefragt — die Bewertung
      // unterscheidet sich, das Ergebnis hat dieselbe Form.
      /*
       * Die Strenge kommt vom Modul (`leniencyFor`), nicht von hier: Bei einer
       * Zahl sind zwei vertauschte Ziffern eine andere Zahl, bei einem Wort
       * ein Tippfehler.
       */
      const leniency = leniencyFor(block.moduleId)
      const graded = isPrompted(block.moduleId)
        ? gradePrompted(finalAnswers ?? answers, block.items, leniency)
        : gradeRecall(splitEntries(entries), block.items, leniency)
      nextResults.push({ round: block.round, kind: block.kind, ...graded })
      const duration = platform.clock.elapsed() - blockStartedRef.current
      const at = platform.clock.now()

      void logRecall(
        sessionRef.current.sessionId,
        at,
        graded,
        duration,
        block.kind,
      ).catch(() => undefined)

      /*
       * Hier wird aus einer Antwort ein Termin (D-004).
       *
       * Beide Blockarten schreiben denselben Weg: Ein heute gelerntes Wort
       * bekommt seinen ersten Termin, ein wiedergesehenes seinen nächsten.
       * Für den Scheduler ist das derselbe Vorgang — nur der Vorzustand
       * unterscheidet sich, und den kennt er selbst.
       */
      void recordOutcome(block.moduleId, plan.language, plan.day, at, {
        recalled: graded.correct,
        missed: graded.missed,
      }).catch(() => undefined)

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

  // Der Herzschlag. 200 ms ist fein genug für eine Sekundenanzeige und grob
  // genug, dass es den Akku nicht kostet.
  useEffect(() => {
    if (finished || block === undefined) return
    const timer = setInterval(() => {
      const elapsed = (platform.clock.elapsed() - blockStartedRef.current) / 1000
      const left = Math.max(0, block.seconds - elapsed)
      setRemaining(Math.ceil(left))

      if (block.kind === 'encode') {
        const index = Math.min(block.items.length - 1, Math.floor(elapsed / SECONDS_PER_ITEM))
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

  const state: RunnerState = {
    plan,
    blockIndex,
    block,
    remaining,
    currentItem: block?.kind === 'encode' ? block.items[itemIndex] : undefined,
    itemIndex,
    entries,
    answers,
    promptIndex,
    results,
    finished,
  }

  return { state, setEntries, submitPrompt, advance, leave }
}
