import { useCallback, useEffect, useRef, useState } from 'react'

import {
  type BlockPlan,
  type Platform,
  SECONDS_PER_ITEM,
  type SessionPlan,
  gradeRecall,
  splitEntries,
} from '../../core/index.ts'
import { WORD_MODULE, recordOutcome } from '../../data/items.ts'
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
  const advance = useCallback(() => {
    if (advancingRef.current || block === undefined) return
    advancingRef.current = true

    const nextResults = [...results]
    if (block.kind === 'recall' || block.kind === 'review') {
      const graded = gradeRecall(splitEntries(entries), block.items)
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
      void recordOutcome(WORD_MODULE, plan.language, plan.day, at, {
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
  }, [block, blockIndex, entries, persist, plan, platform, results])

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
    results,
    finished,
  }

  return { state, setEntries, advance, leave }
}
