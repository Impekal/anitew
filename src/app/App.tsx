import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  MODES,
  SUPPORTED_LANGUAGES,
  type Language,
  type TrainingMode,
  createRng,
  dayKeyOf,
  dueLimitFor,
  type ModuleId,
  type DailyMissionDecision,
  namePool,
  READY_PALACES,
  type OwnPalace,
  DAILY_REMINDER_ID,
  type DimensionCounts,
  type DimensionId,
  type TimeOfDay,
  needsDailyReminder,
  nextDailyAt,
  reminderDay,
  learnableModules,
  moduleForDimension,
  installAdvice,
  isComplete,
  focusForGoal,
  reminderTimeFor,
  suggestedMode,
  numberPool,
  trainingLanguages,
  profileOf,
  weakest,
  returnsOf,
  ownPalaceGone,
  walkPool,
  type BenchmarkRun,
  nextRunDue,
  nextStep,
  planSession,
  selectDue,
  streakOf,
  achievementsOf,
  composeMemoryPool,
  composeDailyMission,
  suggestMemories,
  applyRememberedSuggestions,
  createMemoryGraph,
  adviceOf,
  type CoachContext,
  spanPool,
  DIFFICULTY_WINDOW,
  itemsDeltaFor,
  spanLengthFor,
  TRAINING_MODULES,
  gazePool,
  twinChoices,
  twinPairs,
  twinPool,
  wordPool,
} from '../core/index.ts'
import { createWebPlatform } from '../platform/web/index.ts'
import {
  loadDimensionCounts,
  loadRecentOutcomes,
  loadDue,
  loadReviewed,
  loadTrackedWords,
  moduleOf,
  wordOf,
} from '../data/items.ts'
import { loadMemoryGraph, saveMemoryGraph } from '../data/memoryStore.ts'
import { loadOwnPool } from '../data/own.ts'
import {
  type SessionProgress,
  beginSession,
  clearProgress,
  loadProgress,
  loadTrainingDays,
} from '../data/sessions.ts'
import { abandonRun, beginRun, loadOpenRun, loadRuns } from '../data/benchmark.ts'
import { loadOwnPalaces } from '../data/palace.ts'
import { loadDailyTime } from '../data/reminders.ts'
import {
  loadLinkTaught,
  loadMajorMethodTaught,
  loadPalaceTaught,
  loadStoryTaught,
  loadTaught,
} from '../data/technique.ts'

import { type Dictionary, isTranslated } from '../i18n/index.ts'
import { AboutPanel } from './AboutPanel.tsx'
import { BackupPanel } from './BackupPanel.tsx'
import { MenuIcon, type MenuIconKind } from './MenuIcon.tsx'
import { OnboardingScreen } from './onboarding/OnboardingScreen.tsx'
import { PalacePanel } from './PalacePanel.tsx'
import { ProfilePanel } from './ProfilePanel.tsx'
import { ReminderPanel } from './ReminderPanel.tsx'
import { ResetPanel } from './ResetPanel.tsx'
import { BrainCarePanel } from './BrainCarePanel.tsx'
/*
 * Nur die Ueberschrift, nicht die Tipps: Sie steht im Menue und im Seitenkopf,
 * also im Kaltstart. Die Texte selbst liegen im verzoegerten Chunk (P4).
 */
import { brainCareHeading } from './brainCareHeading.ts'
import { DailyTipMount } from './DailyTipMount.tsx'
import { SciencePanel } from './SciencePanel.tsx'
import { FoundationPanel } from './FoundationPanel.tsx'
import { AchievementsLine } from './AchievementsLine.tsx'
import { CoachPanel } from './CoachPanel.tsx'
import { MemoryPanel } from './MemoryPanel.tsx'
import { MemoryPulse } from './MemoryPulse.tsx'
import { OwnPanel } from './OwnPanel.tsx'
import { SyncPanel } from './SyncPanel.tsx'
import { SYNC_AT_SETTING, SYNC_ON_SETTING, resolveClientId, runDriveSync, scheduleDriveSync } from './driveSync.ts'
import { ReturnsLine } from './ReturnsLine.tsx'
import { TodayLine } from './TodayLine.tsx'
import { StreakLine } from './StreakLine.tsx'
import { BenchmarkPanel } from './benchmark/BenchmarkPanel.tsx'
import { BenchmarkScreen } from './benchmark/BenchmarkScreen.tsx'
import { SessionScreen } from './session/SessionScreen.tsx'
import { useLanguage } from './useLanguage.ts'
import { useProfile } from './useProfile.ts'
import { useStoragePersists } from './useStoragePersists.ts'
import { useTrainingLanguage } from './useTrainingLanguage.ts'
import { SoundAreas } from './SoundAreas.tsx'
import { useSoundSetting } from './useSoundSetting.ts'

const MODE_ORDER: readonly TrainingMode[] = ['emergency', 'short', 'daily', 'extended']

export function App() {
  const platform = useMemo(() => createWebPlatform(), [])
  const {
    language,
    dictionary,
    translated,
    ready,
    choose,
    saveFailed: languageSaveFailed,
  } = useLanguage(platform)
  /*
   * Worin trainiert wird, ist nicht dasselbe wie worin die App spricht (L7).
   * Ab hier heißt `language` die Oberfläche und `training` der Inhalt — jede
   * Stelle, die Wörter, Namen, Termine oder Messungen anfasst, nimmt
   * `training`.
   */
  const {
    training,
    chooseTraining,
    saveFailed: trainingSaveFailed,
  } = useTrainingLanguage(platform, language)
  // Speichert dieses Gerät überhaupt? Sonst wird es gesagt (P7).
  const storagePersists = useStoragePersists(platform)
  const trainable = trainingLanguages()
  /*
   * Einmal beim Aufbau ermittelt: Weder die Browserkennung noch der
   * Startmodus ändern sich, solange die Seite läuft.
   */
  const [advice] = useState(() =>
    installAdvice(
      navigator.userAgent,
      window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as { standalone?: boolean }).standalone === true,
    ),
  )
  const sound = useSoundSetting(platform)
  /*
   * Das Ankommens-Profil (Onboarding).
   *
   * `undefined` nach dem Laden heißt: noch nie gefragt — dann kommt das
   * Ankommen. Ein gespeichertes leeres Objekt heißt: gefragt und
   * übersprungen — dann kommt es nie wieder (D-015: einmal Nein ist Nein).
   */
  const { profile, ready: profileReady, save: saveProfile } = useProfile(platform)

  /*
   * Der stille Abgleich beim Start (D-033) — nur, wenn er je gewollt wurde
   * (erster Abgleich auf der Abgleich-Seite), und ohne jede Rückfrage:
   * Verlangt Google eine neue Anmeldung, scheitert er leise und wartet auf
   * den nächsten Fingertipp dort. Ein Start, der ein Google-Fenster
   * aufreißt, wäre genau die Überraschung, die D-015 ausschließt.
   */
  useEffect(() => {
    void (async () => {
      const on = await platform.settings.read<boolean>(SYNC_ON_SETTING).catch(() => undefined)
      if (on !== true) return
      const clientId = await resolveClientId(platform.settings)
      if (clientId === undefined) return
      const now = platform.clock.now()
      await runDriveSync(clientId, true, now)
      await platform.settings.write(SYNC_AT_SETTING, now)
    })().catch(() => undefined)
  }, [platform])
  const [mode, setMode] = useState<TrainingMode>('daily')
  /*
   * Der Startmodus aus dem Profil — einmal gesetzt, wenn der Speicher
   * gelesen ist, und nie wieder: Ab dann gehört die Wahl dem Finger auf den
   * Pillen, nicht der Antwort von damals.
   */
  const modeSeeded = useRef(false)
  useEffect(() => {
    if (!profileReady || modeSeeded.current) return
    modeSeeded.current = true
    setMode(suggestedMode(profile))
  }, [profileReady, profile])

  /*
   * Das Menü: ein Knopf oben, eine Seite je Punkt (D-011 auf die Auskünfte
   * angewandt — ein Ding pro Bildschirm). Die Seite ist Zustand, kein
   * Router: Es gibt genau eine Ebene, und die Zurück-Geste des Systems soll
   * sie schließen statt die App zu verlassen — dafür der eine Eintrag in der
   * Browsergeschichte.
   */
  const [pageId, setPageId] = useState<MenuIconKind | undefined>(undefined)
  const [menuOpen, setMenuOpen] = useState(false)
  /*
   * Wo die Startseite stand, als eine Core-Seite geöffnet wurde. Beim
   * Schließen kehrt man dorthin zurück, statt oben zu landen.
   */
  const startseitenScroll = useRef(0)
  const openPage = useCallback((id: MenuIconKind) => {
    startseitenScroll.current = window.scrollY
    setMenuOpen(false)
    setPageId(id)
    window.history.pushState({ page: id }, '')
  }, [])
  const closePage = useCallback(() => {
    setPageId(undefined)
    // Der Eintrag von openPage soll nicht liegen bleiben — sonst führt die
    // nächste Zurück-Geste ins Leere. Ist er schon weg (Systemgeste), ist
    // `back` ein stiller Leerlauf auf dem Ausgangszustand.
    if ((window.history.state as { page?: string } | null)?.page !== undefined) {
      window.history.back()
    }
  }, [])
  /*
   * Eine geöffnete Seite fängt oben an.
   *
   * Die Core-Seiten sind Zustand, kein Router — es gibt also keinen Browser,
   * der beim Wechsel von sich aus nach oben scrollt. Wer die Startseite ein
   * Stück heruntergescrollt hatte und dann eine Seite öffnete, bekam sie mit
   * genau diesem Versatz zu sehen: Der Schließen-Knopf lag dann um die
   * gescrollten Pixel zu hoch — auf einem iPhone im Standalone-Modus unter der
   * Dynamic Island, also außerhalb der Safe Area und nicht mehr sicher
   * antippbar.
   *
   * Das war kein neuer Fehler. Auf f1e9f6a — dem Stand, der bis eben live war
   * — blieb das Dokument in fünf von sechs Messungen um 62 Pixel gescrollt,
   * und der Knopf stand bei 3 statt bei 65 Pixeln. Der Test dazu
   * (`safeArea.spec.ts`) ging nur deshalb meist durch, weil er selbst keinen
   * definierten Ausgangszustand hatte; einmal ist er auf CI darüber gefallen
   * (Lauf 1394), und das war zu Recht.
   *
   * Beim Schließen geht es dorthin zurück, wo man auf der Startseite war —
   * sonst wäre das Beheben des einen Ärgernisses das Einführen eines anderen.
   */
  useEffect(() => {
    if (pageId !== undefined) {
      window.scrollTo(0, 0)
      return
    }
    window.scrollTo(0, startseitenScroll.current)
  }, [pageId])
  useEffect(() => {
    const onPop = () => {
      setPageId(undefined)
      setMenuOpen(false)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])
  const [running, setRunning] = useState<SessionProgress | undefined>()
  const [systemPulse, setSystemPulse] = useState(0)
  const [resumable, setResumable] = useState<SessionProgress | undefined>()
  /*
   * Die Trainingstage für die Serie (K2).
   *
   * Wie der Lernstand nach jeder Einheit neu gelesen — eine gerade beendete
   * Einheit ist ein Tag mehr, und der soll sofort dastehen und nicht erst
   * beim nächsten Öffnen.
   */
  const [trainingDays, setTrainingDays] = useState<readonly string[]>([])
  useEffect(() => {
    void loadTrainingDays()
      .then(setTrainingDays)
      .catch(() => undefined)
  }, [running])

  /*
   * Die schon gelehrten Ziffern des Major-Systems (D5).
   *
   * Ebenfalls nach jeder Einheit neu gelesen — die Lektion darin kann eine
   * dazugelegt haben. Ohne das zeigte die nächste Einheit desselben Besuchs
   * wieder dieselbe Ziffer.
   */
  /*
   * Die Messungen (M3, D-006).
   *
   * `open` ist die Messung, die noch läuft — sie überlebt bewusst das
   * Schließen der App: Zwischen dem Einprägen und dem Abruf am Folgetag
   * liegen Stunden, und genau darin besteht die Messung.
   */
  const [runs, setRuns] = useState<readonly BenchmarkRun[]>([])
  const [open, setOpen] = useState<
    { run: BenchmarkRun; items: readonly string[]; id: string } | undefined
  >()
  const [measuring, setMeasuring] = useState(false)
  const reloadBenchmark = useCallback(() => {
    void loadRuns()
      .then(setRuns)
      .catch(() => undefined)
    void loadOpenRun()
      .then(setOpen)
      .catch(() => undefined)
  }, [])
  useEffect(reloadBenchmark, [reloadBenchmark, running, measuring])

  const [taught, setTaught] = useState<readonly number[]>([])
  useEffect(() => {
    void loadTaught()
      .then(setTaught)
      .catch(() => undefined)
  }, [running])

  /*
   * `undefined` heißt „noch nicht nachgesehen“ und nicht „noch nicht
   * gelehrt“ — sonst bekäme jemand die Palastlektion ein zweites Mal, nur
   * weil die Datenbank beim Start eine Handbreit langsamer war als der
   * Finger. Der Planer lehrt ausdrücklich nur bei `false`.
   */
  const [own, setOwn] = useState<readonly OwnPalace[]>([])
  const reloadOwn = useCallback(() => {
    void loadOwnPalaces()
      .then(setOwn)
      .catch(() => undefined)
  }, [])
  useEffect(reloadOwn, [reloadOwn, running])

  const [palaceTaught, setPalaceTaught] = useState<boolean | undefined>(undefined)
  useEffect(() => {
    void loadPalaceTaught()
      .then(setPalaceTaught)
      .catch(() => undefined)
  }, [running])

  // Geschichte und Verknüpfung (D5): dieselbe Vorsicht wie beim Palast —
  // `undefined` heißt „noch nicht nachgesehen“, und dann lehrt der Planer nicht.
  const [storyTaught, setStoryTaught] = useState<boolean | undefined>(undefined)
  const [linkTaught, setLinkTaught] = useState<boolean | undefined>(undefined)
  // Das Verfahren des Major-Systems (D5): ein Ja/Nein wie die drei anderen.
  const [majorMethodTaught, setMajorMethodTaught] = useState<boolean | undefined>(undefined)
  useEffect(() => {
    void loadStoryTaught()
      .then(setStoryTaught)
      .catch(() => undefined)
    void loadLinkTaught()
      .then(setLinkTaught)
      .catch(() => undefined)
    void loadMajorMethodTaught()
      .then(setMajorMethodTaught)
      .catch(() => undefined)
  }, [running])

  // Eine unterbrochene Einheit steht beim nächsten Start wieder da (B5).
  useEffect(() => {
    void loadProgress()
      .then((progress) => {
        if (progress !== undefined && progress.blockIndex < progress.plan.blocks.length) {
          setResumable(progress)
        }
      })
      .catch(() => undefined)
  }, [])

  /*
   * Die schon terminierten Zwillingspaare (D-027), kanonisch als
   * `A%B`-Menge. Der Vorrat ist endlich: Was einen Termin hat, kommt nie
   * wieder als neu — und sind weniger als drei Paare übrig, fällt das
   * Modul aus der Lernrotation (der Planer prüft dieselbe Regel am Vorrat).
   */
  const [twinsDone, setTwinsDone] = useState<ReadonlySet<string>>(new Set())
  useEffect(() => {
    void loadTrackedWords('twins', training)
      .then((words) => setTwinsDone(new Set(words.map((word) => twinChoices(word).join('%')))))
      .catch(() => undefined)
  }, [training, running])

  /*
   * Die letzten Antworten je Modul — Futter für die adaptive Schwierigkeit
   * (D2): gerechnet, nie fortgeschrieben, nach jeder Einheit neu gelesen.
   */
  const [recentByModule, setRecentByModule] = useState<
    Partial<Record<ModuleId, readonly boolean[]>>
  >({})
  useEffect(() => {
    void (async () => {
      const entries = await Promise.all(
        TRAINING_MODULES.map(
          async (moduleId) =>
            [moduleId, await loadRecentOutcomes(moduleId, DIFFICULTY_WINDOW)] as const,
        ),
      )
      setRecentByModule(Object.fromEntries(entries))
    })().catch(() => undefined)
  }, [running])

  // Das Profil (E). Wie die Serie und die Wiedersehen: aus den Terminen
  // gerechnet, nach jeder Einheit neu gelesen.
  const [dimensionCounts, setDimensionCounts] = useState<
    Partial<Record<DimensionId, DimensionCounts>>
  >({})
  useEffect(() => {
    void loadDimensionCounts(training)
      .then(setDimensionCounts)
      .catch(() => undefined)
  }, [training, running])

  /*
   * Der Schwerpunkt des heutigen Trainings (E5, E6).
   *
   * Er entsteht **nur**, wenn sich zwei Achsen wirklich unterscheiden — das
   * entscheidet `weakest` und nicht diese Datei. Und er wird nur angekündigt,
   * wenn er in der gewählten Zeit überhaupt vorkommen kann: `learnableModules`
   * ist dieselbe Regel, die der Planer benutzt. Zwei Regeln wären zwei
   * Wahrheiten, und die App verspräche einen Schwerpunkt, den der Plan nicht
   * einhält.
   */
  const focus = useMemo(() => {
    /*
     * Zwei Quellen, eine klare Rangfolge (R-1): Erst die Zählung — nur wenn
     * sie **nichts** sagt, darf das selbst genannte Ziel aus dem Ankommen
     * einen Schwerpunkt vorschlagen. Die Quelle wird mitgeführt, weil die
     * Ansage dazu eine andere ist: „dort blieb am wenigsten“ wäre gelogen,
     * wenn in Wahrheit nur der Wunsch spricht.
     */
    const weak = weakest(profileOf(dimensionCounts))
    const measured = weak === undefined ? undefined : moduleForDimension(weak)
    const moduleId = measured ?? focusForGoal(profile?.goal)
    if (moduleId === undefined) return undefined
    if (!learnableModules(MODES[mode].seconds).includes(moduleId)) return undefined
    /*
     * Zwillinge mit erschöpftem Vorrat (D-027): Der Planer ließe den
     * Schwerpunkt still fallen — dann darf er hier auch nicht angekündigt
     * werden. Dieselbe Regel an beiden Orten, sonst zwei Wahrheiten.
     */
    if (moduleId === 'twins' && twinPairs(training).length - twinsDone.size < 3) return undefined
    return { moduleId, source: measured !== undefined ? ('measured' as const) : ('goal' as const) }
  }, [dimensionCounts, mode, profile, training, twinsDone])

  const [missionPreview, setMissionPreview] = useState<DailyMissionDecision | undefined>()
  useEffect(() => {
    void (async () => {
      const now = platform.clock.now()
      const day = dayKeyOf(now, { offsetMinutes: platform.clock.offsetMinutes(now) })
      const seconds = MODES[mode].seconds
      const selected = selectDue(
        await loadDue(training),
        day,
        dueLimitFor(Math.round(seconds * 0.15)),
      )
      const dueByModule: Partial<Record<ModuleId, number>> = {}
      for (const item of selected) {
        const moduleId = moduleOf(item.itemId) as ModuleId
        dueByModule[moduleId] = (dueByModule[moduleId] ?? 0) + 1
      }
      const graph = await loadMemoryGraph()
      const ownPool = await loadOwnPool(training)
      const memoryAnchors = new Set(graph.edges.map((edge) => edge.from))
      setMissionPreview(
        composeDailyMission({
          seconds,
          dueByModule,
          personalScenes: composeMemoryPool(graph).length,
          untrainedPersonalItems:
            graph.nodes.filter(
              (node) => !memoryAnchors.has(node.id) && node.lastRecalledAt === undefined,
            ).length +
            ownPool.length,
          dimensions: dimensionCounts,
          interferenceErrors: (recentByModule['twins'] ?? []).filter((correct) => !correct).length,
        }),
      )
    })().catch(() => setMissionPreview(undefined))
  }, [dimensionCounts, mode, platform, recentByModule, training, systemPulse])

  const start = useCallback(() => {
    // Der erste Ton der Einheit, ausgelöst vom Fingertipp — genau die Geste,
    // die iOS verlangt, bevor eine Seite überhaupt klingen darf.
    platform.sound.play('start')
    const now = platform.clock.now()
    const day = dayKeyOf(now, { offsetMinutes: platform.clock.offsetMinutes(now) })
    // Der Seed macht die Einheit reproduzierbar (A11): Aus Tag, Modus und
    // Startzeit folgen genau diese Wörter in genau dieser Reihenfolge.
    const seed = `${day}:${mode}:${now}`
    const sessionId = `s-${now.toString(36)}-${createRng(seed).int(1_000_000).toString(36)}`
    const seconds = MODES[mode].seconds

    void (async () => {
      /*
       * Vor dem Planen wird gefragt, was heute ansteht (D8).
       *
       * Der Scheduler weiß, welche Wörter fällig sind; `dueLimitFor` sorgt
       * dafür, dass nur so viele zurückkommen, wie in die gewählte Zeit
       * passen. Wer zwei Wochen weg war, bekommt keinen Berg vorgesetzt,
       * sondern holt den Rückstand über mehrere Tage auf (C7).
       */
      const due: Partial<Record<ModuleId, string[]>> = {}
      try {
        const tracked = await loadDue(training)
        const limit = dueLimitFor(Math.round(seconds * 0.15))
        for (const item of selectDue(tracked, day, limit)) {
          const moduleId = moduleOf(item.itemId) as ModuleId
          const word = wordOf(item.itemId)
          /*
           * Ein Gang durch einen eigenen Palast, den es nicht mehr gibt, wird
           * übergangen statt gefragt (G3). Die Kennung `own~7#own3` bleibt
           * gültig — nur steht auf dem Schild nichts mehr, und „Was lag hier?“
           * ohne das „hier“ ist keine Frage. Gelöscht wird deshalb nichts: Wer
           * seinen Palast neu anlegt, hat seine Gänge wieder.
           */
          if (moduleId === 'palace' && ownPalaceGone(word, own)) continue
          ;(due[moduleId] ??= []).push(word)
        }
      } catch {
        // Ohne Datenbank gibt es eben kein Wiedersehen. Die Einheit läuft
        // trotzdem — ein Training, das an einem Lesefehler scheitert, wäre
        // der schlechtere Tausch.
      }

      const memoryGraph = await loadMemoryGraph().catch(() => createMemoryGraph())
      const ownPool = await loadOwnPool(training).catch(() => [])
      const memoryPool = composeMemoryPool(memoryGraph)
      const memoryAnchors = new Set(memoryGraph.edges.map((edge) => edge.from))
      const mission = composeDailyMission({
        seconds,
        dueByModule: Object.fromEntries(
          Object.entries(due).map(([moduleId, items]) => [moduleId, items.length]),
        ),
        personalScenes: memoryPool.length,
        untrainedPersonalItems:
          memoryGraph.nodes.filter(
            (node) => !memoryAnchors.has(node.id) && node.lastRecalledAt === undefined,
          ).length +
          ownPool.length,
        dimensions: dimensionCounts,
        interferenceErrors: (recentByModule['twins'] ?? []).filter((correct) => !correct).length,
      })

      const plan = planSession({
        mode,
        day,
        language: training,
        seed,
        /*
         * Zahlen kommen nicht aus einer Liste, sondern werden aus dem Seed
         * erzeugt (D10): Eine feste Liste wäre nach zwei Wochen durchgesehen,
         * und die App misst dann Wiedererkennen statt Gedächtnis. Sechzig
         * reichen weit über die längste Einheit hinaus — der Planer nimmt
         * sich, was er braucht.
         */
        pools: {
          words: wordPool(training),
          faces: namePool(training),
          numbers: numberPool(seed, 60),
          /*
           * Missionen ziehen aus demselben Namensvorrat wie die Gesichter
           * (H1): Aus dem Namen entsteht die ganze Szene, so wie aus ihm das
           * Gesicht entsteht. Dass „Elena“ in beiden Modulen vorkommen kann,
           * ist kein Versehen — es sind zwei verschiedene Aufgaben zu
           * derselben Person, und in der Datenbank auch zwei Einträge.
           */
          missions: namePool(training),
          /*
           * Gänge durch einen Palast (G). Wie die Zahlen aus dem Seed
           * erzeugt: Derselbe Palast, andere Gegenstände — der Vorrat geht
           * nie aus, und niemand läuft zweimal durch dieselbe Wohnung mit
           * denselben Dingen darin.
           */
          palace: walkPool(seed, 30, [
            ...READY_PALACES.map((id) => ({ id, stationIds: [] })),
            ...own.map((palace) => ({
              id: palace.id,
              stationIds: palace.stations.map((station) => station.id),
            })),
          ]),
          /*
           * Rückwärts-Folgen (D7): wie die Zahlen aus dem Seed erzeugt und
           * sprachfrei. Vierzig, nicht zwanzig — der Schwerpunkt kann dem
           * Modul in der längsten Einheit jede zweite Runde geben (E5), und
           * vier Runden à sechs Fragen sind vierundzwanzig. Der Planer nimmt
           * sich, was er braucht.
           */
          reverse: spanPool(
            seed,
            40,
            // Die Spannenlänge wandert mit der eigenen Quote (D2): vier als
            // Boden, sechs als Decke, fünf der Anfang.
            spanLengthFor({ recent: recentByModule['reverse'] ?? [] }),
          ),
          /*
           * Zwillinge (D-027): endlicher, kuratierter Vorrat — gefiltert um
           * alles, was schon einen Termin hat (in beliebiger Orientierung).
           * Reicht der Rest nicht für eine Runde, nimmt der Planer das
           * Modul selbst aus der Lernrotation.
           */
          twins: twinPool(training, seed).filter(
            (item) => !twinsDone.has(twinChoices(item).join('%')),
          ),
          /*
           * Bilder (Achse „Visuell“): aus dem Seed erzeugt wie Zahlen und
           * Gänge — der Vorrat geht nie aus, und dieselbe Kennung ergibt
           * beim Wiedersehen dasselbe Bild.
           */
          gaze: gazePool(seed, 24),
          /*
           * Eigene Inhalte (I · D-032): Der Vorrat sind die Paare des
           * Menschen ohne Termin. Ist er leer — bei den meisten —, nimmt
           * der Vorratsfilter das Modul still aus der Lernrotation.
           */
          facts: ownPool,
          /*
           * Der Memory-Graph (D-036): Der Missions-Komponist wählt die
           * schwächsten Anker mit ihren Dingen — FSRS bleibt die Wahrheit
           * über das Wann; hier steht nur das Was. Leer bei den meisten:
           * Der Vorratsfilter nimmt das Modul dann still heraus.
           */
          memory: memoryPool,
        },
        due,
        taught,
        palaceTaught,
        storyTaught,
        linkTaught,
        majorMethodTaught,
        /*
         * D2: ein Stück mehr oder weniger je Modul, aus der eigenen
         * Trefferquote gerechnet. Keine Anzeige — Planung, keine Aussage
         * über den Menschen (R-1).
         */
        difficulty: Object.fromEntries(
          TRAINING_MODULES.map((moduleId) => [
            moduleId,
            itemsDeltaFor({ recent: recentByModule[moduleId] ?? [] }),
          ]),
        ),
        focus: mission.focus ?? focus?.moduleId,
        modules: mission.modules,
      })
      const progress: SessionProgress = {
        sessionId,
        plan,
        blockIndex: 0,
        results: [],
        startedAt: now,
      }

      setResumable(undefined)
      setRunning(progress)
      void beginSession(progress, day, now).catch(() => undefined)
    })()
  }, [training, mode, platform, taught, palaceTaught, storyTaught, linkTaught, majorMethodTaught, own, focus, recentByModule, dimensionCounts])

  const leave = useCallback(() => {
    setRunning(undefined)
    // Eine Einheit hat den Stand verändert — der Abgleich folgt still (D-038).
    scheduleDriveSync(platform)
  }, [platform])

  const today = useMemo(() => {
    const now = platform.clock.now()
    return dayKeyOf(now, { offsetMinutes: platform.clock.offsetMinutes(now) })
  }, [platform])

  const streak = useMemo(() => streakOf(trainingDays, today), [trainingDays, today])

  /*
   * Die Tageserinnerung (B8).
   *
   * Sie wird nach **jeder** Einheit neu gesetzt, und sie entfällt für heute,
   * sobald heute trainiert wurde: Eine App, die abends fragt, ob man schon
   * geübt hat, obwohl sie es weiß, ist lästig und wirkt dumm.
   */
  const [daily, setDaily] = useState<TimeOfDay | undefined>(undefined)
  const reloadDaily = useCallback(() => {
    void loadDailyTime()
      .then(setDaily)
      .catch(() => undefined)
  }, [])
  useEffect(reloadDaily, [reloadDaily, running])

  useEffect(() => {
    if (daily === undefined) {
      void platform.reminders.cancel(DAILY_REMINDER_ID).catch(() => undefined)
      return
    }
    const now = platform.clock.now()
    const at = nextDailyAt(daily, now, platform.clock.offsetMinutes(now))
    if (!needsDailyReminder(trainingDays, reminderDay(at, platform.clock.offsetMinutes(at)))) {
      void platform.reminders.cancel(DAILY_REMINDER_ID).catch(() => undefined)
      return
    }
    void platform.reminders
      .schedule({
        id: DAILY_REMINDER_ID,
        at,
        title: dictionary.reminder.dailyTitle,
        body: dictionary.reminder.dailyBody,
      })
      .catch(() => undefined)
  }, [daily, dictionary, platform, trainingDays])

  /*
   * Die Wiedersehen — gerechnet, nicht fortgeschrieben (D-019). Nach jeder
   * Einheit neu gelesen: Was dort passiert ist, steht in den Terminen.
   */
  const [reviewed, setReviewed] = useState<readonly { reviews: number }[]>([])
  useEffect(() => {
    void loadReviewed(training)
      .then(setReviewed)
      .catch(() => undefined)
  }, [training, running])
  const returns = useMemo(() => returnsOf(reviewed), [reviewed])

  // Erreichtes (K3): aus den Zahlen gerechnet, die es ohnehin gibt. Die
  // Modul-Tatsachen (D-030) zählen Gelegenheiten ohne Verlust — dieselben
  // Zahlen, aus denen auch das Profil besteht (E3), nur anders gefragt.
  const achievementInput = useMemo(() => {
    const heldOf = (dimension: DimensionId) => {
      const counts = dimensionCounts[dimension]
      return counts === undefined ? 0 : counts.chances - counts.lost
    }
    return {
      returnsTotal: returns.total,
      returnsLongest: returns.longest,
      streakBest: streak.best,
      taughtCount: taught.length,
      completedBenchmarks: runs.filter(isComplete).length,
      hasOwnPalace: own.length > 0,
      heldBackTotal: heldOf('working'),
      toldApartTotal: heldOf('attention'),
      detailsHeldTotal: heldOf('visual'),
      namesHeldTotal: heldOf('faces'),
    }
  }, [returns, streak.best, taught.length, runs, own, dimensionCounts])


  /*
   * Was die Messung gerade von einem will.
   *
   * Läuft keine, ist die nächste fällig, wenn seit der letzten vierzehn Tage
   * vergangen sind — und die allererste sofort. Läuft eine, entscheidet
   * `nextStep`, ob gerade abgerufen, gewartet oder das Fenster verpasst wird.
   */
  const step = useMemo(() => {
    if (open === undefined) {
      const last = runs[runs.length - 1]
      const due = nextRunDue(last)
      return last === undefined || (due !== undefined && today >= due)
        ? ({ kind: 'invite' } as const)
        : ({ kind: 'none' } as const)
    }
    return nextStep(open.run, platform.clock.now(), today)
  }, [open, platform, runs, today])

  /*
   * Was nach einem Abbruch dasteht.
   *
   * `undefined`, solange keiner passiert ist. Danach die Auskunft, ob sofort
   * wieder gemessen werden kann oder erst in vierzehn Tagen — das ist der
   * einzige Unterschied, den ein Abbruch macht, und er gehört gesagt.
   */
  const [aborted, setAborted] = useState<'again' | 'later' | undefined>(undefined)

  const abortBenchmark = useCallback(() => {
    if (open === undefined) return
    // Ob schon eine Zahl entstanden ist, steht in der Zeile selbst — genau
    // daran hängt auch `nextRunDue`.
    const measured = open.run.immediate !== undefined
    setMeasuring(false)
    setAborted(measured ? 'later' : 'again')
    void abandonRun(open.id)
      .catch(() => undefined)
      .finally(reloadBenchmark)
  }, [open, reloadBenchmark])

  /*
   * R3-04 (Runde 3): Der Startvorgang ist sofort gesperrt — synchron im Ref,
   * damit ein zweiter Tipp gar nicht erst losläuft, und sichtbar über
   * `starting`, damit der Knopf im selben Moment inaktiv wird. Die eigentliche
   * Invariante liegt darunter in `beginRun`: Zwei parallele Starts können dort
   * nicht zwei Messungen anlegen, und vor der Fälligkeit beginnt keine.
   */
  const startingBenchmark = useRef(false)
  const [starting, setStarting] = useState(false)
  const startBenchmark = useCallback(() => {
    if (startingBenchmark.current) return
    startingBenchmark.current = true
    setStarting(true)
    setAborted(undefined)
    void (async () => {
      const now = platform.clock.now()
      const day = dayKeyOf(now, { offsetMinutes: platform.clock.offsetMinutes(now) })
      const started = await beginRun(day, now, training)
      if (!started.ok) {
        /*
         * Abgelehnt heißt: Es läuft bereits eine Messung, oder sie ist noch
         * nicht fällig. Beides ist kein Fehler — der Stand wird neu gelesen,
         * damit die Oberfläche zeigt, was wirklich gilt.
         */
        const open = await loadOpenRun()
        if (open !== undefined) {
          setOpen(open)
          setMeasuring(true)
        }
        return
      }
      setOpen({
        id: started.id,
        items: started.items,
        run: { ordinal: started.ordinal, day, total: started.items.length },
      })
      setMeasuring(true)
    })()
      .catch(() => undefined)
      .finally(() => {
        startingBenchmark.current = false
        setStarting(false)
      })
  }, [training, platform])


  const greeting = useMemo(() => {
    const lines = dictionary.greetings
    const line = lines[createRng(today).int(lines.length)] ?? dictionary.app.tagline
    // Der Rufname aus dem Ankommen macht aus dem Tagessatz eine Anrede.
    // Mehr Personalisierung gibt es nicht — der Satz bleibt derselbe für alle.
    const name = profile?.name
    return name === undefined ? line : `${dictionary.onboarding.hello} ${name}. ${line}`
  }, [dictionary, today, profile])

  if (!ready || !profileReady) return null

  /*
   * Das Ankommen — nur beim allerersten Öffnen (dann ist im Speicher noch
   * gar kein Profil, auch kein leeres). Es steht vor allen anderen
   * Bildschirmen: Wer es je beantwortet oder übersprungen hat, sieht es nie
   * wieder.
   */
  if (profile === undefined) {
    return (
      <OnboardingScreen
        dictionary={dictionary}
        language={language}
        training={training}
        chooseTraining={chooseTraining}
        trainable={trainable}
        trainingSaveFailed={trainingSaveFailed}
        onDone={(answers, firstMemory) => {
          void (async () => {
            if (firstMemory !== undefined) {
              const graph = await loadMemoryGraph()
              const suggestions = suggestMemories({ text: firstMemory })
              await saveMemoryGraph(
                applyRememberedSuggestions(graph, suggestions, platform.clock.now()),
              )
              platform.sound.play('remember')
            }
            saveProfile(answers)
            // Die Zeit-Antwort wird sofort zur Voreinstellung — nicht erst
            // beim nächsten Öffnen. `modeSeeded` ist damit erledigt.
            modeSeeded.current = true
            setMode(suggestedMode(answers))
          })().catch(() => saveProfile(answers))
        }}
      />
    )
  }

  if (measuring && open !== undefined) {
    return (
      <BenchmarkScreen
        platform={platform}
        dictionary={dictionary}
        run={open.run}
        runId={open.id}
        items={open.items}
        onDone={() => setMeasuring(false)}
        onAbort={abortBenchmark}
      />
    )
  }

  if (running !== undefined) {
    return (
      <SessionScreen
        /*
          Der Schlüssel ist die sessionId: „Noch eine Runde“ (B7) setzt eine
          neue Einheit, und der Runner baut seinen Zustand nur beim Einhängen
          auf. Ohne den Schlüssel liefe die alte Einheit weiter.
        */
        key={running.sessionId}
        platform={platform}
        dictionary={dictionary}
        progress={running}
        taught={taught}
        own={own}
        onLeave={leave}
        onComplete={() => setSystemPulse((value) => value + 1)}
        onAgain={start}
      />
    )
  }

  /*
   * Eine Menüseite: Titel, Zurück, ein Inhalt — sonst nichts. `undefined`
   * bei einem gesperrten Eintrag (Erreichtes ohne Erreichtes, Installation
   * außerhalb von iOS) fällt still auf den Startbildschirm zurück.
   */
  if (pageId !== undefined) {
    const reached = achievementsOf(achievementInput)
    /*
     * Der Coach (M · D-031): keine eigene Rechnung, sondern dieselben
     * Befunde, die die App ohnehin hat — Schwerpunkt, D2-Verschiebungen,
     * fällige Messung — als Sätze mit Quelle. Erst hier gerechnet, weil
     * nur die geöffnete Seite sie braucht.
     */
    const coachDeltas = Object.fromEntries(
      TRAINING_MODULES.map((moduleId) => [
        moduleId,
        itemsDeltaFor({ recent: recentByModule[moduleId] ?? [] }),
      ]),
    )
    const coachAdvice = adviceOf({
      weakest: weakest(profileOf(dimensionCounts)),
      deltas: coachDeltas,
      benchmarkDue: step.kind === 'invite',
    })
    const coachContext: CoachContext = {
      language: training,
      streak: { current: streak.length, best: streak.best },
      counts: dimensionCounts,
      deltas: coachDeltas,
      taughtDigits: taught.length,
      hasPalace: own.length > 0,
    }
    const pages: Partial<Record<MenuIconKind, { title: string; body: ReactNode }>> = {
      ...(reached.length > 0
        ? {
            reached: {
              title: dictionary.achievements.heading,
              body: <AchievementsLine input={achievementInput} dictionary={dictionary} />,
            },
          }
        : {}),
      profile: {
        title: dictionary.profile.heading,
        body: (
          <ProfilePanel
            counts={dimensionCounts}
            trained={trainingDays}
            today={today}
            dictionary={dictionary}
            runs={runs}
          />
        ),
      },
      /*
        Die Messung bekommt eine Tür im Core (Runde 2, Nutzerwunsch): Reihe,
        Eichung und der nächste Termin sind auffindbar — gestartet wird aber
        weiterhin nur, wenn sie fällig ist. Ein jederzeitiger Startknopf wäre
        genau das Dauermessen, das die Methode ausschließt (F2b, R-1).
      */
      benchmark: {
        title: dictionary.benchmark.heading,
        body: (() => {
          const nextDue = nextRunDue(runs[runs.length - 1])
          const dueLine =
            nextDue === undefined
              ? undefined
              : dictionary.benchmark.nextDueLine.replace(
                  '{day}',
                  new Date(`${nextDue}T00:00:00`).toLocaleDateString(language, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }),
                )
          return (
            <div className="benchmark-page">
              {step.kind === 'invite' ? (
                <section className="note" role="status">
                  <h2>{dictionary.benchmark.invite}</h2>
                  <p>{dictionary.benchmark.inviteNote}</p>
                  <div className="note-actions">
                    <button type="button" className="quiet" onClick={startBenchmark} disabled={starting}>
                      {dictionary.benchmark.start}
                    </button>
                  </div>
                </section>
              ) : step.kind === 'none' ? (
                dueLine !== undefined && <p className="hint">{dueLine}</p>
              ) : (
                <p className="hint">{dictionary.benchmark.runningNote}</p>
              )}
              <BenchmarkPanel runs={runs} language={training} dictionary={dictionary} />
              {!runs.some(isComplete) && (
                <p className="hint">{dictionary.benchmark.noneYet}</p>
              )}
            </div>
          )
        })(),
      },
      coach: {
        title: dictionary.coach.heading,
        body: (
          <CoachPanel
            advice={coachAdvice}
            context={coachContext}
            platform={platform}
            dictionary={dictionary}
          />
        ),
      },
      contents: {
        title: dictionary.own.heading,
        body: <OwnPanel language={training} dictionary={dictionary} platform={platform} />,
      },
      memories: {
        title: dictionary.memory.heading,
        body: (
          <MemoryPanel
            platform={platform}
            dictionary={dictionary}
            training={training}
            language={language}
            today={today}
          />
        ),
      },
      about: {
        title: dictionary.onboarding.editHeading,
        body: <AboutPanel dictionary={dictionary} profile={profile} onSave={saveProfile} />,
      },
      palace: {
        title: dictionary.palace.heading,
        body: (
          <PalacePanel
            own={own}
            onChange={reloadOwn}
            platform={platform}
          />
        ),
      },
      reminder: {
        title: dictionary.reminder.heading,
        body: (
          <ReminderPanel
            platform={platform}
            dictionary={dictionary}
            daily={daily}
            suggested={
              profile?.dayPart === undefined ? undefined : reminderTimeFor(profile.dayPart)
            }
            onChange={reloadDaily}
          />
        ),
      },
      science: {
        title: dictionary.science.heading,
        body: <SciencePanel dictionary={dictionary} />,
      },
      /*
        „Geistig aktiv bleiben" steht direkt neben „Was belegt ist" — die
        beiden gehoeren zusammen: Hier stehen Gewohnheiten mit ihrem
        Belegstand, dort die Grundlagen der App mit ihrem. Wer den einen Ton
        kennt, erkennt den anderen wieder (Geraetewunsch 31.08.).
      */
      brainCare: {
        title: brainCareHeading(language),
        body: (
          <BrainCarePanel
            dictionary={dictionary}
            onDemanding={() => {
              setMode('extended')
              closePage()
              /*
               * Den Blick mitnehmen (Gerätemeldung 01.09.).
               *
               * Gemeldet wurde: „‚lancer une séance exigeante‘ ramène au
               * Core. Ça devrait plutôt conduire directement à l'écran où se
               * trouvent les 15 Minutes afin qu'on clique sur commencer.“
               *
               * Der Knopf stellte die lange Einheit korrekt ein und schloss
               * die Seite — nur landete man auf der Startseite, ohne dass
               * etwas den Zusammenhang zeigte. In den Profilen, die hier
               * fahrbar sind, stand der Startknopf im Bild; auf einem
               * kleineren Fenster oder weiter unten gescrollt steht er es
               * nicht. Statt zu raten, welches Gerät es war: Der Startknopf
               * kommt jetzt immer ins Bild und bekommt den Fokus — dann sagt
               * auch eine Vorlesehilfe, wo man gelandet ist.
               *
               * Nach dem Bild, nicht sofort: `closePage` räumt die Seite erst
               * im nächsten Anstrich ab, vorher gibt es nichts zu scrollen.
               */
              requestAnimationFrame(() => {
                const start = document.querySelector<HTMLButtonElement>('.challenge .start')
                start?.scrollIntoView({ block: 'center', behavior: 'smooth' })
                start?.focus({ preventScroll: true })
              })
            }}
          />
        ),
      },
      ...(advice.kind === 'ios'
        ? {
            install: {
              title: dictionary.install.heading,
              body: (
                <div className="privacy">
                  <p className="privacy-lead">{dictionary.install.why}</p>
                  <ol className="privacy-points">
                    {dictionary.install.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  <p className="hint">{dictionary.install.orBackup}</p>
                </div>
              ),
            },
          }
        : {}),
      privacy: {
        title: dictionary.privacy.heading,
        body: (
          <div className="privacy">
            <p className="privacy-lead">{dictionary.privacy.lead}</p>
            <ul className="privacy-points">
              {dictionary.privacy.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="hint">{dictionary.privacy.honest}</p>
          </div>
        ),
      },
      backup: {
        title: dictionary.backup.heading,
        body: <BackupPanel platform={platform} dictionary={dictionary} />,
      },
      sync: {
        title: dictionary.sync.heading,
        body: <SyncPanel platform={platform} dictionary={dictionary} />,
      },
      check: {
        title: dictionary.check.heading,
        body: <FoundationPanel platform={platform} dictionary={dictionary} />,
      },
      settings: {
        title: dictionary.settings.heading,
        body: (
          <div className="settings-page">
            <LanguageSoundControls
              dictionary={dictionary}
              language={language}
              choose={choose}
              training={training}
              chooseTraining={chooseTraining}
              trainable={trainable}
              translated={translated}
              sound={sound}
              saveFailed={languageSaveFailed || trainingSaveFailed || sound.saveFailed}
            />
            <p className="hint">{dictionary.settings.note}</p>
            {/*
              Der Weg zurück auf null gehört dorthin, wo Menschen ihn suchen
              (Runde 4, Nutzerwunsch) — dieselbe Komponente wie unter
              „Sicherung", damit es nur einen Löschweg gibt. Der Hinweis
              nennt vorher die Sicherung: Wer löscht, soll wissen, dass es
              einen Weg gab, vorher etwas mitzunehmen.
            */}
            <p className="hint">{dictionary.settings.resetNote}</p>
            <ResetPanel platform={platform} dictionary={dictionary} />
          </div>
        ),
      },
    }
    const entry = pages[pageId]
    if (entry !== undefined) {
      return (
        <main className="app page">
          <header className="page-head">
            <button type="button" className="quiet page-back" onClick={closePage}>
              {dictionary.summary.back}
            </button>
          </header>
          <h1 className="page-title">{entry.title}</h1>
          <section className="page-body">{entry.body}</section>
        </main>
      )
    }
    setPageId(undefined)
  }

  const seconds = MODES[mode].seconds
  const label = `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`

  return (
    <main className="app">
      <header className="brand">
        <div className="brand-row">
          <h1>{dictionary.app.name}</h1>
          {/*
            Der Menüknopf ist das einzige Möbel neben dem Namen — oben
            rechts, wo ihn jede App-Gewohnheit vermutet. Er öffnet die Liste
            der Seiten; der Startbildschirm selbst bleibt der eine Knopf.
          */}
          <button
            type="button"
            className="hamburger"
            aria-expanded={menuOpen}
            aria-label={dictionary.menu.heading}
            onClick={() => setMenuOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
        {/*
          Nicht der Werbespruch, sondern ein Satz für heute (D-011/G-7).
          Er wechselt mit dem Tag und ist deshalb aus dem Tagesschlüssel
          gezogen: derselbe Satz den ganzen Tag, morgen ein anderer.
        */}
        <p className="greeting">{greeting}</p>
      </header>

      {/*
        Ganz oben, weil es alles darunter betrifft: Wenn nichts gespeichert
        wird, ist jede Serie und jede Messung darunter vergänglich. Ruhig,
        aber sichtbar — nicht im zugeklappten Fundament-Fach versteckt (P7).
      */}
      {storagePersists === false && (
        <section className="note" role="status">
          <p>{dictionary.storage.note}</p>
        </section>
      )}

      <TodayLine
        platform={platform}
        dictionary={dictionary}
        training={training}
        today={today}
        onOpenMemories={() => openPage('memories')}
        duration={label}
        refreshKey={systemPulse}
      />
      <MemoryPulse
        platform={platform}
        training={training}
        today={today}
        refreshKey={systemPulse}
        dictionary={dictionary}
      />

      {/*
        Die Messung meldet sich nur, wenn sie etwas will (D-011/G-2). Kein
        Dauerbanner, kein Countdown — sie steht da, wenn sie dran ist, und
        sonst gar nicht.
      */}
      {/*
        Nach einem Abbruch: keine Ermahnung, keine Frage, ob man es sich nicht
        doch anders überlegt (G-5, D-015). Nur was passiert ist und wie es
        weitergeht.
      */}
      {aborted !== undefined && (
        <section className="note" role="status">
          <h2>{dictionary.benchmark.abortedTitle}</h2>
          <p>{dictionary.benchmark.abortedNote}</p>
          <p className="hint">
            {aborted === 'again'
              ? dictionary.benchmark.abortedAgain
              : dictionary.benchmark.abortedLater}
          </p>
          {/*
            „Du kannst sofort neu anfangen“ braucht den Knopf dazu.
            Der erste Anlauf verdeckte die Einladung, solange der Hinweis
            stand — der Satz war damit eine Behauptung ohne Weg, und ein
            E2E-Lauf hat genau das getroffen.
          */}
          {aborted === 'again' && step.kind === 'invite' && (
            <div className="note-actions">
              <button type="button" className="quiet" onClick={startBenchmark} disabled={starting}>
                {dictionary.benchmark.start}
              </button>
            </div>
          )}
        </section>
      )}

      {step.kind === 'invite' && aborted === undefined && (
        <section className="note" role="status">
          <h2>{dictionary.benchmark.invite}</h2>
          <p>{dictionary.benchmark.inviteNote}</p>
          <div className="note-actions">
            <button type="button" className="quiet" onClick={startBenchmark} disabled={starting}>
              {dictionary.benchmark.start}
            </button>
          </div>
        </section>
      )}

      {step.kind === 'recall' && (
        <section className="note" role="status">
          <h2>{dictionary.benchmark.ready}</h2>
          <div className="note-actions">
            <button type="button" className="quiet" onClick={() => setMeasuring(true)}>
              {dictionary.benchmark.continue}
            </button>
          </div>
        </section>
      )}

      {step.kind === 'waiting' && (
        <section className="note" role="status">
          <h2>{dictionary.benchmark.waitingTitle}</h2>
          <p>
            {step.phase === 'after20Minutes'
              ? dictionary.benchmark.waitingSoon
              : dictionary.benchmark.waitingTomorrow}
          </p>
        </section>
      )}

      {/*
        Ein verpasstes Fenster wird gesagt und nicht stillschweigend
        weggerechnet: Eine Messung nach drei Stunden ist keine Messung nach
        zwanzig Minuten (F1).
      */}
      {step.kind === 'missed' && open !== undefined && (
        <section className="note" role="status">
          <h2>{dictionary.benchmark.missedTitle}</h2>
          <p>{dictionary.benchmark.missedNote}</p>
          <div className="note-actions">
            <button
              type="button"
              className="quiet"
              onClick={() => {
                void abandonRun(open.id)
                  .catch(() => undefined)
                  .finally(reloadBenchmark)
              }}
            >
              {dictionary.benchmark.discard}
            </button>
          </div>
        </section>
      )}

      {resumable !== undefined && (
        <section className="note" role="status">
          <h2>{dictionary.resume.heading}</h2>
          <p>{dictionary.resume.body}</p>
          <div className="note-actions">
            <button
              type="button"
              className="quiet"
              onClick={() => {
                setRunning(resumable)
                setResumable(undefined)
              }}
            >
              {dictionary.resume.continue}
            </button>
            <button
              type="button"
              className="quiet"
              onClick={() => {
                /*
                 * Erst löschen, dann ausblenden — nicht umgekehrt.
                 *
                 * Vorher lief das Löschen nebenher, und wer unmittelbar danach
                 * die App neu lud, bekam die verworfene Einheit zurück: Das
                 * Neuladen überholte den Schreibvorgang in der Datenbank. Ein
                 * E2E-Test hat genau das getroffen. Die paar Millisekunden
                 * Wartezeit sind der richtige Tausch — „verworfen“ muss
                 * verworfen bleiben, auch wenn das Telefon im nächsten
                 * Augenblick abstürzt.
                 */
                void clearProgress()
                  .catch(() => undefined)
                  .finally(() => setResumable(undefined))
              }}
            >
              {dictionary.resume.discard}
            </button>
          </div>
        </section>
      )}

      <section className="challenge">
        {/* Kein Titel über dem Knopf — „5:00 Beginnen“ erklärt sich, und ein
            Etikett darüber wäre genau das Möbel, das G-2 weglässt. */}
        <button type="button" className="start" onClick={start}>
          <span className="start-time">{label}</span>
          <span className="start-label">{dictionary.start.start}</span>
        </button>

        {/*
          E6: Die Entscheidung wird gesagt, nicht nur getroffen. Eine Zeile,
          keine Meldung — und sie steht nur da, wenn es wirklich einen
          Schwerpunkt gibt (D-011/G-2).
        */}
        {(missionPreview?.focus !== undefined || focus !== undefined) && (
          <>
            <p className="focus">
              {dictionary.profile.focus}{' '}
              <strong>
                {(dictionary.profile.modules as Record<string, string>)[missionPreview?.focus ?? focus?.moduleId ?? '']}
              </strong>
            </p>
            {/*
              Der Grund gehört dazu, sonst ist es eine Behauptung (E6). Und
              zwar der **richtige** Grund: Kommt der Schwerpunkt aus der
              Zählung, steht da die Zählung; kommt er nur aus dem selbst
              genannten Ziel, steht da das Ziel — „dort blieb am wenigsten“
              wäre sonst eine erfundene Messung (R-1).
            */}
            <p className="hint focus-why">
              {missionPreview?.reason === 'due'
                ? dictionary.profile.focusWhyDue
                : missionPreview?.reason === 'personal'
                  ? dictionary.profile.focusWhyPersonal
                  : missionPreview?.reason === 'interference'
                    ? dictionary.profile.focusWhyInterference
                    : missionPreview?.reason === 'undertrained'
                      ? dictionary.profile.focusWhyUndertrained
                      : focus?.source === 'measured'
                        ? dictionary.profile.focusWhy
                        : dictionary.profile.focusWhyGoal}
            </p>
          </>
        )}

        <h2 id="challenge-heading">{dictionary.start.heading}</h2>
        <div className="modes" role="group" aria-labelledby="challenge-heading">
          {MODE_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              className={id === mode ? 'mode mode-active' : 'mode'}
              aria-pressed={id === mode}
              onClick={() => setMode(id)}
            >
              {dictionary.start.modes[id]}
            </button>
          ))}
        </div>
      </section>

      <div className="today-history" aria-label={dictionary.today.heading}>
        <StreakLine streak={streak} dictionary={dictionary} />
        <ReturnsLine returns={returns} dictionary={dictionary} />
      </div>

      {/*
        Der Tipp des Tages (Geraetewunsch 31.08.) — hoechstens einmal taeglich,
        wegtippbar, mit dem Abschalter in sich selbst. Er sitzt bewusst hier
        und nicht ueber dem Start: Er soll begleiten, nicht den Weg
        versperren (D-015).
      */}
      <DailyTipMount platform={platform} today={today} />

      <footer className="footer">
        {/*
          Sprache und Ton stehen doppelt: hier am Fuß **und** als
          Core-Seite „Einstellungen“ (Runde 2, Nutzerwunsch) — dieselbe
          Komponente, kein zweiter Zustand.
        */}
        <LanguageSoundControls
          dictionary={dictionary}
          language={language}
          choose={choose}
          training={training}
          chooseTraining={chooseTraining}
          trainable={trainable}
          translated={translated}
          sound={sound}
          saveFailed={languageSaveFailed || trainingSaveFailed || sound.saveFailed}
        />

        {/*
          Der Systemcheck aus M0 hat seinen Zweck erfüllt und beherrscht den
          ersten Bildschirm nicht mehr (D-011/G-2). Er bleibt erreichbar, weil
          „läuft ohne Netz“ und „Speicher bereit“ auf einem fremden Telefon die
          ersten Fragen sind, wenn etwas klemmt.
        */}
        {/*
          Die Sicherung steht **über** dem Systemcheck und nicht darunter: Sie
          ist das Einzige hier unten, das jemand irgendwann dringend braucht
          (N2). Zugeklappt bleibt sie trotzdem — sie gehört nicht auf den
          ersten Bildschirm (D-011/G-2).
        */}
        <BenchmarkPanel runs={runs} language={training} dictionary={dictionary} />

        {/*
          Die Wissenschaftsseite steht direkt unter der Messung, weil sie
          dieselbe Frage beantwortet — die Messung sagt, was an *dir* gezählt
          wurde, diese Seite sagt, worauf der ganze Aufbau beruht und wo das
          Wissen aufhört (F6). Zugeklappt, wie alles hier unten: Sie ist
          nichts, was jemand täglich braucht, aber sie muss da sein, bevor die
          App irgendwo behauptet, sie sei wissenschaftlich fundiert (R-2).
        */}
        {/*
          Der eigene Palast steht bei den anderen Einstellungen und nicht auf
          dem Startbildschirm: Man legt ihn einmal an. Zugeklappt bleibt er
          trotzdem erreichbar — und der Hinweis in der Lektion sagt, dass es
          ihn gibt.
        */}
        {/*
          Das Profil steht über dem Palast und unter der Messung: Es ist die
          Auskunft über den Nutzer, die aus dem Training kommt — die aus der
          Messung steht darüber und bleibt davon getrennt (F1).
        */}
      </footer>

      {/*
        Die Schublade: dieselben zwei Gruppen wie im Kopf gedacht — Dein
        Stand (was aus dem Training über dich zu sagen ist) und App & Gerät
        (alles Technische). „Erreicht“ steht nur da, wenn es etwas gibt (K7),
        „Auf den Startbildschirm“ nur auf iOS. Bernstein gehört dem Menschen,
        das kühle Grün dem Gerät — dieselbe Teilung wie überall (G-8).
      */}
      {menuOpen && (
        <div className="drawer-veil" onClick={() => setMenuOpen(false)}>
          <nav
            className="drawer"
            aria-label={dictionary.menu.heading}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="drawer-close"
              aria-label={dictionary.menu.close}
              onClick={() => setMenuOpen(false)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            {/*
              Die Einträge scrollen in einem eigenen Kasten, der Schließen-Knopf
              steht darüber.

              Vorher scrollte die ganze Schublade und der Knopf klebte mit
              `position: sticky` oben — und weil sein Grund durchsichtig ist,
              lief jeder Eintrag durch das ✕ hindurch. Gemessen auf einem
              iPhone 14 Pro: bei Scrollstand 80 „Dein Stand", bei 200
              „Memory DNA", bei 300 „Eigene Inhalte".

              Mehr Abstand hätte das nicht gelöst, sondern nur verschoben,
              welcher Eintrag wann darunterläuft. Ein deckender Streifen dahinter
              löste es zwar, veränderte aber das Aussehen des Knopfs. Der Kasten
              hier löst es an der Wurzel: Sein Inhalt wird an seiner Oberkante
              abgeschnitten und betritt die Knopffläche gar nicht erst.
            */}
            <div className="drawer-scroll">
            <section className="menu-group">
              <h2 className="menu-label">{dictionary.menu.yours}</h2>
              {achievementsOf(achievementInput).length > 0 && (
                <button type="button" className="drawer-item" onClick={() => openPage('reached')}>
                  <MenuIcon kind="reached" />
                  <span>{dictionary.achievements.heading}</span>
                </button>
              )}
              <button type="button" className="drawer-item" onClick={() => openPage('profile')}>
                <MenuIcon kind="profile" />
                <span>{dictionary.profile.heading}</span>
              </button>
              <button type="button" className="drawer-item" onClick={() => openPage('benchmark')}>
                <MenuIcon kind="benchmark" />
                <span>{dictionary.benchmark.heading}</span>
              </button>
              <button type="button" className="drawer-item" onClick={() => openPage('coach')}>
                <MenuIcon kind="coach" />
                <span>{dictionary.coach.heading}</span>
              </button>
              <button type="button" className="drawer-item" onClick={() => openPage('memories')}>
                <MenuIcon kind="memories" />
                <span>{dictionary.memory.heading}</span>
              </button>
              <button type="button" className="drawer-item" onClick={() => openPage('contents')}>
                <MenuIcon kind="contents" />
                <span>{dictionary.own.heading}</span>
              </button>
              <button type="button" className="drawer-item" onClick={() => openPage('about')}>
                <MenuIcon kind="about" />
                <span>{dictionary.onboarding.editHeading}</span>
              </button>
              <button type="button" className="drawer-item" onClick={() => openPage('palace')}>
                <MenuIcon kind="palace" />
                <span>{dictionary.palace.heading}</span>
              </button>
            </section>
            <section className="menu-group menu-group-device">
              <h2 className="menu-label">{dictionary.menu.device}</h2>
              <button type="button" className="drawer-item" onClick={() => openPage('reminder')}>
                <MenuIcon kind="reminder" />
                <span>{dictionary.reminder.heading}</span>
              </button>
              <button type="button" className="drawer-item" onClick={() => openPage('science')}>
                <MenuIcon kind="science" />
                <span>{dictionary.science.heading}</span>
              </button>
              <button type="button" className="drawer-item" onClick={() => openPage('brainCare')}>
                <MenuIcon kind="brainCare" />
                <span>{brainCareHeading(language)}</span>
              </button>
              {advice.kind === 'ios' && (
                <button type="button" className="drawer-item" onClick={() => openPage('install')}>
                  <MenuIcon kind="install" />
                  <span>{dictionary.install.heading}</span>
                </button>
              )}
              <button type="button" className="drawer-item" onClick={() => openPage('privacy')}>
                <MenuIcon kind="privacy" />
                <span>{dictionary.privacy.heading}</span>
              </button>
              <button type="button" className="drawer-item" onClick={() => openPage('backup')}>
                <MenuIcon kind="backup" />
                <span>{dictionary.backup.heading}</span>
              </button>
              <button type="button" className="drawer-item" onClick={() => openPage('sync')}>
                <MenuIcon kind="sync" />
                <span>{dictionary.sync.heading}</span>
              </button>
              <button type="button" className="drawer-item" onClick={() => openPage('check')}>
                <MenuIcon kind="check" />
                <span>{dictionary.check.heading}</span>
              </button>
              <button type="button" className="drawer-item" onClick={() => openPage('settings')}>
                <MenuIcon kind="settings" />
                <span>{dictionary.settings.heading}</span>
              </button>
            </section>
            </div>
          </nav>
        </div>
      )}
    </main>
  )
}

/*
 * Sprache und Ton — als eine Komponente, weil sie an zwei Orten stehen:
 * am Fuß des Startbildschirms und auf der Core-Seite „Einstellungen“
 * (Runde 2, Nutzerwunsch). Zwei Abschriften derselben Regler wären der
 * sichere Weg, dass eine davon veraltet.
 */
function LanguageSoundControls({
  dictionary,
  language,
  choose,
  training,
  chooseTraining,
  trainable,
  translated,
  sound,
  saveFailed,
}: {
  dictionary: Dictionary
  language: Language
  choose: (next: Language) => void
  training: Language
  chooseTraining: (next: Language) => void
  trainable: readonly Language[]
  translated: boolean
  sound: ReturnType<typeof useSoundSetting>
  /** R3-06: Eine der drei Einstellungen ließ sich nicht speichern. */
  saveFailed: boolean
}) {
  return (
    <>
      <label className="language">
        <span>{dictionary.language.label}</span>
        <select value={language} onChange={(event) => choose(event.target.value as Language)}>
          {/*
            Nur Sprachen mit echtem Wörterbuch (TRANSLATION_WORKFLOW §6):
            Ein Eintrag, der auf Englisch zurückfällt — bei Arabisch sogar
            als RTL-Dokument mit englischem Text —, verspricht eine
            Übersetzung, die es nicht gibt. Wer die App in einer noch
            nicht übersetzten Systemsprache öffnet, bekommt weiterhin die
            ehrliche Fußnote; angeboten wird sie erst, wenn sie fertig ist.
          */}
          {SUPPORTED_LANGUAGES.filter((tag) => tag === language || isTranslated(tag)).map(
            (tag) => (
              <option key={tag} value={tag}>
                {dictionary.language.names[tag]}
              </option>
            ),
          )}
        </select>
      </label>
      {/*
        Die Trainingssprache steht nur da, wenn es überhaupt eine Wahl gibt
        (L7, G-2). Ein Auswahlfeld mit einem Eintrag wäre Möbel.
      */}
      {trainable.length > 1 && (
        <label className="language language-training">
          <span>{dictionary.language.training}</span>
          <select
            value={training}
            onChange={(event) => chooseTraining(event.target.value as Language)}
          >
            {trainable.map((tag) => (
              <option key={tag} value={tag}>
                {dictionary.language.names[tag]}
              </option>
            ))}
          </select>
        </label>
      )}

      <button
        type="button"
        className="sound-toggle"
        onClick={sound.toggle}
        aria-pressed={sound.enabled}
      >
        <span aria-hidden="true">{sound.enabled ? '♪' : '·'}</span>
        {sound.enabled ? dictionary.sound.on : dictionary.sound.off}
      </button>

      {/*
        Die drei Bereiche einzeln (Geraetewunsch 31.08.: „Toene nach
        individuellen Bereichen aktivierbar oder alle auf einmal").

        Sie stehen nur da, wenn der Hauptschalter an ist: Bei stiller App
        waeren drei Schalter, die nichts bewirken, genau die Art Moebel, die
        G-2 verbietet — und der eine Schalter darueber ist bereits das „alle
        auf einmal". Der Inhalt wird verzoegert geladen (P4).
      */}
      {sound.enabled && <SoundAreas dictionary={dictionary} sound={sound} />}

      {/*
        Fehlen Texte oder die eigene Wortliste (Backlog L6), wird auf der
        Rückfallsprache trainiert. Das ist eine Einschränkung und wird als
        solche gesagt, statt sie zu verstecken.
      */}
      {!translated && <p className="hint">{dictionary.language.incomplete}</p>}

      {/*
        Der Satz zur Trainingssprache steht bei ihr und nicht bei der
        Oberfläche — er erklärt, was ein Wechsel bedeutet, und dass er
        nichts verliert.
      */}
      {trainable.length > 1 && (
        <>
          <p className="hint">{dictionary.language.trainingNote}</p>
          {trainable.length < SUPPORTED_LANGUAGES.length && (
            <p className="hint">{dictionary.language.trainingOnly}</p>
          )}
        </>
      )}

      {/* R3-06: Nicht gespeichert heißt: gesagt, nicht angezeigt. */}
      {saveFailed && (
        <p className="coach-failure" role="alert">
          {dictionary.settings.saveFailed}
        </p>
      )}
    </>
  )
}
