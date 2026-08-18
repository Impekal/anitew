import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  MODES,
  SUPPORTED_LANGUAGES,
  type Language,
  type TrainingMode,
  createRng,
  dayKeyOf,
  dueLimitFor,
  hasWordPool,
  type ModuleId,
  namePool,
  READY_PALACES,
  type OwnPalace,
  numberPool,
  returnsOf,
  palaceOf,
  walkPool,
  type BenchmarkRun,
  nextRunDue,
  nextStep,
  planSession,
  selectDue,
  streakOf,
  wordPool,
} from '../core/index.ts'
import { createWebPlatform } from '../platform/web/index.ts'
import { loadDue, loadReviewed, moduleOf, wordOf } from '../data/items.ts'
import {
  type SessionProgress,
  beginSession,
  clearProgress,
  loadProgress,
  loadTrainingDays,
} from '../data/sessions.ts'
import { abandonRun, beginRun, loadOpenRun, loadRuns } from '../data/benchmark.ts'
import { loadOwnPalace } from '../data/palace.ts'
import { loadPalaceTaught, loadTaught } from '../data/technique.ts'

import { BackupPanel } from './BackupPanel.tsx'
import { PalacePanel } from './PalacePanel.tsx'
import { SciencePanel } from './SciencePanel.tsx'
import { FoundationPanel } from './FoundationPanel.tsx'
import { ReturnsLine } from './ReturnsLine.tsx'
import { StreakLine } from './StreakLine.tsx'
import { BenchmarkPanel } from './benchmark/BenchmarkPanel.tsx'
import { BenchmarkScreen } from './benchmark/BenchmarkScreen.tsx'
import { SessionScreen } from './session/SessionScreen.tsx'
import { useLanguage } from './useLanguage.ts'
import { useSoundSetting } from './useSoundSetting.ts'

const MODE_ORDER: readonly TrainingMode[] = ['emergency', 'short', 'daily', 'extended']

export function App() {
  const platform = useMemo(() => createWebPlatform(), [])
  const { language, dictionary, translated, ready, choose } = useLanguage(platform)
  const sound = useSoundSetting(platform)
  const [mode, setMode] = useState<TrainingMode>('daily')
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
        const tracked = await loadDue(language)
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
        language,
        seed,
        /*
         * Zahlen kommen nicht aus einer Liste, sondern werden aus dem Seed
         * erzeugt (D10): Eine feste Liste wäre nach zwei Wochen durchgesehen,
         * und die App misst dann Wiedererkennen statt Gedächtnis. Sechzig
         * reichen weit über die längste Einheit hinaus — der Planer nimmt
         * sich, was er braucht.
         */
        pools: {
          words: wordPool(language),
          faces: namePool(language),
          numbers: numberPool(seed, 60),
          /*
           * Missionen ziehen aus demselben Namensvorrat wie die Gesichter
           * (H1): Aus dem Namen entsteht die ganze Szene, so wie aus ihm das
           * Gesicht entsteht. Dass „Elena“ in beiden Modulen vorkommen kann,
           * ist kein Versehen — es sind zwei verschiedene Aufgaben zu
           * derselben Person, und in der Datenbank auch zwei Einträge.
           */
          missions: namePool(language),
          /*
           * Gänge durch einen Palast (G). Wie die Zahlen aus dem Seed
           * erzeugt: Derselbe Palast, andere Gegenstände — der Vorrat geht
           * nie aus, und niemand läuft zweimal durch dieselbe Wohnung mit
           * denselben Dingen darin.
           */
          palace: walkPool(seed, 30, own === undefined ? undefined : [...READY_PALACES, 'own']),
        },
        due,
        taught,
        palaceTaught,
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
  }, [language, mode, platform, taught, palaceTaught, own])

  const leave = useCallback(() => setRunning(undefined), [])

  const today = useMemo(() => {
    const now = platform.clock.now()
    return dayKeyOf(now, { offsetMinutes: platform.clock.offsetMinutes(now) })
  }, [platform])

  const streak = useMemo(() => streakOf(trainingDays, today), [trainingDays, today])

  /*
   * Die Wiedersehen — gerechnet, nicht fortgeschrieben (D-019). Nach jeder
   * Einheit neu gelesen: Was dort passiert ist, steht in den Terminen.
   */
  const [reviewed, setReviewed] = useState<readonly { reviews: number }[]>([])
  useEffect(() => {
    void loadReviewed(language)
      .then(setReviewed)
      .catch(() => undefined)
  }, [language, running])
  const returns = useMemo(() => returnsOf(reviewed), [reviewed])

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
      const started = await beginRun(day, now, language)
      setOpen({
        id: started.id,
        items: started.items,
        run: { ordinal: started.ordinal, day, total: started.items.length },
      })
      setMeasuring(true)
    })()
  }, [language, platform])

  const greeting = useMemo(() => {
    const lines = dictionary.greetings
    return lines[createRng(today).int(lines.length)] ?? dictionary.app.tagline
  }, [dictionary, today])

  if (!ready) return null

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
        platform={platform}
        dictionary={dictionary}
        progress={running}
        taught={taught}
        own={own}
        onLeave={leave}
      />
    )
  }

  const seconds = MODES[mode].seconds
  const label = `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`

  return (
    <main className="app">
      <header className="brand">
        <h1>{dictionary.app.name}</h1>
        {/*
          Nicht der Werbespruch, sondern ein Satz für heute (D-011/G-7).
          Er wechselt mit dem Tag und ist deshalb aus dem Tagesschlüssel
          gezogen: derselbe Satz den ganzen Tag, morgen ein anderer.
        */}
        <p className="greeting">{greeting}</p>
      </header>

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
        {(!translated || !hasWordPool(language)) && (
          <p className="hint">{dictionary.language.incomplete}</p>
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
        <BenchmarkPanel runs={runs} language={language} dictionary={dictionary} />

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
        <details className="details">
          <summary>{dictionary.palace.heading}</summary>
          {/*
            Kein `key`, der den Baustein neu montiert: Der erste Anlauf hängte
            ihn an den Namen des Palastes, und damit verschwand ausgerechnet
            beim Speichern die Bestätigung — der Baustein wurde in dem Moment
            ausgetauscht, in dem er sie zeigen sollte. Ein E2E-Lauf hat es
            gefunden. Die Felder pflegt er selbst.
          */}
          <PalacePanel dictionary={dictionary} own={own} onChange={reloadOwn} />
        </details>

        <details className="details">
          <summary>{dictionary.science.heading}</summary>
          <SciencePanel dictionary={dictionary} />
        </details>

        <details className="details">
          <summary>{dictionary.backup.heading}</summary>
          <BackupPanel platform={platform} dictionary={dictionary} />
        </details>

        <details className="details">
          <summary>{dictionary.check.heading}</summary>
          <FoundationPanel platform={platform} dictionary={dictionary} />
        </details>
      </footer>
    </main>
  )
}
