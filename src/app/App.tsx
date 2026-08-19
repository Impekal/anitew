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
  palaceOf,
  walkPool,
  type BenchmarkRun,
  nextRunDue,
  nextStep,
  planSession,
  selectDue,
  streakOf,
  achievementsOf,
  composeMemoryPool,
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
import { loadMemoryGraph } from '../data/memoryStore.ts'
import { loadOwnPool } from '../data/own.ts'
import {
  type SessionProgress,
  beginSession,
  clearProgress,
  loadProgress,
  loadTrainingDays,
} from '../data/sessions.ts'
import { abandonRun, beginRun, loadOpenRun, loadRuns } from '../data/benchmark.ts'
import { loadOwnPalace } from '../data/palace.ts'
import { loadDailyTime } from '../data/reminders.ts'
import {
  loadLinkTaught,
  loadPalaceTaught,
  loadStoryTaught,
  loadTaught,
} from '../data/technique.ts'

import { AboutPanel } from './AboutPanel.tsx'
import { BackupPanel } from './BackupPanel.tsx'
import { MenuIcon, type MenuIconKind } from './MenuIcon.tsx'
import { OnboardingScreen } from './onboarding/OnboardingScreen.tsx'
import { PalacePanel } from './PalacePanel.tsx'
import { ProfilePanel } from './ProfilePanel.tsx'
import { ReminderPanel } from './ReminderPanel.tsx'
import { SciencePanel } from './SciencePanel.tsx'
import { FoundationPanel } from './FoundationPanel.tsx'
import { AchievementsLine } from './AchievementsLine.tsx'
import { CoachPanel } from './CoachPanel.tsx'
import { MemoryPanel } from './MemoryPanel.tsx'
import { OwnPanel } from './OwnPanel.tsx'
import { SyncPanel } from './SyncPanel.tsx'
import { SYNC_AT_SETTING, SYNC_ON_SETTING, resolveClientId, runDriveSync, scheduleDriveSync } from './driveSync.ts'
import { ReturnsLine } from './ReturnsLine.tsx'
import { StreakLine } from './StreakLine.tsx'
import { BenchmarkPanel } from './benchmark/BenchmarkPanel.tsx'
import { BenchmarkScreen } from './benchmark/BenchmarkScreen.tsx'
import { SessionScreen } from './session/SessionScreen.tsx'
import { useLanguage } from './useLanguage.ts'
import { useProfile } from './useProfile.ts'
import { useStoragePersists } from './useStoragePersists.ts'
import { useTrainingLanguage } from './useTrainingLanguage.ts'
import { useSoundSetting } from './useSoundSetting.ts'

const MODE_ORDER: readonly TrainingMode[] = ['emergency', 'short', 'daily', 'extended']

export function App() {
  const platform = useMemo(() => createWebPlatform(), [])
  const { language, dictionary, translated, ready, choose } = useLanguage(platform)
  /*
   * Worin trainiert wird, ist nicht dasselbe wie worin die App spricht (L7).
   * Ab hier heißt `language` die Oberfläche und `training` der Inhalt — jede
   * Stelle, die Wörter, Namen, Termine oder Messungen anfasst, nimmt
   * `training`.
   */
  const { training, chooseTraining } = useTrainingLanguage(platform, language)
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
  const openPage = useCallback((id: MenuIconKind) => {
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
  const [own, setOwn] = useState<OwnPalace | undefined>(undefined)
  const reloadOwn = useCallback(() => {
    void loadOwnPalace()
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
  useEffect(() => {
    void loadStoryTaught()
      .then(setStoryTaught)
      .catch(() => undefined)
    void loadLinkTaught()
      .then(setLinkTaught)
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
          if (moduleId === 'palace' && own === undefined && palaceOf(word) === 'own') continue
          ;(due[moduleId] ??= []).push(word)
        }
      } catch {
        // Ohne Datenbank gibt es eben kein Wiedersehen. Die Einheit läuft
        // trotzdem — ein Training, das an einem Lesefehler scheitert, wäre
        // der schlechtere Tausch.
      }

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
          palace: walkPool(seed, 30, own === undefined ? undefined : [...READY_PALACES, 'own']),
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
          facts: await loadOwnPool(training).catch(() => []),
          /*
           * Der Memory-Graph (D-036): Der Missions-Komponist wählt die
           * schwächsten Anker mit ihren Dingen — FSRS bleibt die Wahrheit
           * über das Wann; hier steht nur das Was. Leer bei den meisten:
           * Der Vorratsfilter nimmt das Modul dann still heraus.
           */
          memory: composeMemoryPool(await loadMemoryGraph().catch(() => createMemoryGraph())),
        },
        due,
        taught,
        palaceTaught,
        storyTaught,
        linkTaught,
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
        focus: focus?.moduleId,
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
  }, [training, mode, platform, taught, palaceTaught, storyTaught, linkTaught, own, focus, recentByModule])

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
      hasOwnPalace: own !== undefined,
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

  const startBenchmark = useCallback(() => {
    setAborted(undefined)
    void (async () => {
      const now = platform.clock.now()
      const day = dayKeyOf(now, { offsetMinutes: platform.clock.offsetMinutes(now) })
      const started = await beginRun(day, now, training)
      setOpen({
        id: started.id,
        items: started.items,
        run: { ordinal: started.ordinal, day, total: started.items.length },
      })
      setMeasuring(true)
    })()
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
        onDone={(answers) => {
          saveProfile(answers)
          // Die Zeit-Antwort wird sofort zur Voreinstellung — nicht erst
          // beim nächsten Öffnen. `modeSeeded` ist damit erledigt.
          modeSeeded.current = true
          setMode(suggestedMode(answers))
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
      hasPalace: own !== undefined,
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
        body: <ProfilePanel counts={dimensionCounts} dictionary={dictionary} />,
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
        body: <OwnPanel language={training} dictionary={dictionary} />,
      },
      memories: {
        title: dictionary.memory.heading,
        body: <MemoryPanel platform={platform} dictionary={dictionary} />,
      },
      about: {
        title: dictionary.onboarding.editHeading,
        body: <AboutPanel dictionary={dictionary} profile={profile} onSave={saveProfile} />,
      },
      palace: {
        title: dictionary.palace.heading,
        body: <PalacePanel dictionary={dictionary} own={own} onChange={reloadOwn} />,
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

      <StreakLine streak={streak} dictionary={dictionary} />
      <ReturnsLine returns={returns} dictionary={dictionary} />

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
          <h3>{dictionary.benchmark.abortedTitle}</h3>
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
              <button type="button" className="quiet" onClick={startBenchmark}>
                {dictionary.benchmark.start}
              </button>
            </div>
          )}
        </section>
      )}

      {step.kind === 'invite' && aborted === undefined && (
        <section className="note" role="status">
          <h3>{dictionary.benchmark.invite}</h3>
          <p>{dictionary.benchmark.inviteNote}</p>
          <div className="note-actions">
            <button type="button" className="quiet" onClick={startBenchmark}>
              {dictionary.benchmark.start}
            </button>
          </div>
        </section>
      )}

      {step.kind === 'recall' && (
        <section className="note" role="status">
          <h3>{dictionary.benchmark.ready}</h3>
          <div className="note-actions">
            <button type="button" className="quiet" onClick={() => setMeasuring(true)}>
              {dictionary.benchmark.continue}
            </button>
          </div>
        </section>
      )}

      {step.kind === 'waiting' && (
        <section className="note" role="status">
          <h3>{dictionary.benchmark.waitingTitle}</h3>
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
          <h3>{dictionary.benchmark.missedTitle}</h3>
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
          <h3>{dictionary.resume.heading}</h3>
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
        {focus !== undefined && (
          <>
            <p className="focus">
              {dictionary.profile.focus}{' '}
              <strong>
                {(dictionary.profile.modules as Record<string, string>)[focus.moduleId]}
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
              {focus.source === 'measured'
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

      <footer className="footer">
        <label className="language">
          <span>{dictionary.language.label}</span>
          <select value={language} onChange={(event) => choose(event.target.value as Language)}>
            {SUPPORTED_LANGUAGES.map((tag) => (
              <option key={tag} value={tag}>
                {dictionary.language.names[tag]}
              </option>
            ))}
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
            </section>
          </nav>
        </div>
      )}
    </main>
  )
}
