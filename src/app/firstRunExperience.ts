import '../anitew-first-run.css'

type FirstRunCopy = {
  slogan: string
  philosophy: string
  intro: string
  adaptive: string
  different: string
  highlights: readonly { title: string; body: string }[]
  trust: string
  questions: string
  begin: string
  direct: string
  guideLabel: string
  next: string
  done: string
  skip: string
  lessonContinue: string
  tour: readonly { selector: string; title: string; body: string }[]
}

const DE: FirstRunCopy = {
  slogan: 'Hol zurück, was bleiben soll.',
  philosophy: 'Gedächtnis ist Technik, kein Talent.',
  intro:
    'ANITEW ist kein Gehirnspiel. Es trainiert, wie du Namen, Zahlen, Lernstoff und Dinge aus deinem eigenen Leben behältst.',
  adaptive:
    'ANITEW passt das Training an dein tatsächliches Erinnerungsverhalten an – nicht an erfundene Scores.',
  different: 'Warum ANITEW anders ist',
  highlights: [
    {
      title: 'Es lernt dein Erinnerungsmuster.',
      body: 'Wiedersehen werden aus echten Abrufen geplant – danach, was bei dir zurückkommt und was noch Unterstützung braucht.',
    },
    {
      title: 'Es lehrt Techniken.',
      body: 'Gedächtnispalast, Major-System und Verknüpfungen werden erklärt und anschließend angewandt – nicht nur getestet.',
    },
    {
      title: 'Es trainiert dein echtes Leben.',
      body: 'Eigene Fakten, Lernstoff und persönliche Erinnerungen können Teil deiner Memory World und ihres Wiederholungsplans werden.',
    },
    {
      title: 'Es misst getrennt vom Training.',
      body: 'Übung ist Übung. Eine Aussage über Veränderung kommt nur aus einer eigenen Messung – oder gar nicht.',
    },
  ],
  trust: 'LOCAL FIRST · OFFLINE · OHNE PFLICHTKONTO',
  questions:
    'Wenn du „Los geht’s“ wählst, folgen zwei kurze, freiwillige Fragen: was du wirklich behalten willst und wie viel Zeit du normalerweise hast. Damit setzt ANITEW deinen Einstieg. Alles bleibt auf diesem Gerät.',
  begin: 'Los geht’s',
  direct: 'Direkt starten',
  guideLabel: 'ANITEW kennenlernen',
  next: 'Weiter',
  done: 'ANITEW öffnen',
  skip: 'Einführung überspringen',
  lessonContinue: 'Weiter ins Training',
  tour: [
    {
      selector: '.hamburger',
      title: 'Der ANITEW Core',
      body: 'Das ist dein Zugang zum ganzen Gedächtnissystem. Kein Hamburger-Menü: Der Core entfaltet Memory DNA, eigene Inhalte, Coach, Palast, Backup und mehr.',
    },
    {
      selector: '.today',
      title: 'Deine Memory World',
      body: 'Hier wächst, was du wirklich behalten willst. Knoten und Verbindungen stehen für echte gespeicherte Erinnerungen – nie für Dekoration oder erfundene Aktivität.',
    },
    {
      selector: '.memory-pulse',
      title: 'Memory Pulse',
      body: 'Hier meldet sich dein System: was zurückkehrt, was Aufmerksamkeit braucht und was neu entstanden ist. Nur aus deinen tatsächlichen Daten.',
    },
    {
      selector: '.start',
      title: 'Dein Trainingsportal',
      body: '60 Sekunden, 3, 5 oder 15 Minuten: Du gibst die Zeit vor. ANITEW füllt sie mit dem, was nach deinem Verlauf jetzt sinnvoll ist.',
    },
    {
      selector: '.hamburger',
      title: 'Training ist nicht Messung',
      body: 'Memory DNA und Training zeigen deinen Übungsverlauf. Eine echte Messung meldet sich separat, wenn sie dran ist. ANITEW vermischt beides absichtlich nicht.',
    },
  ],
}

const EN: FirstRunCopy = {
  slogan: 'Bring back what should stay.',
  philosophy: 'Memory is a skill, not a gift.',
  intro:
    'ANITEW is not a brain game. It trains how you hold on to names, numbers, study material and things from your own life.',
  adaptive:
    'ANITEW adapts training to your actual remembering behaviour – not to invented scores.',
  different: 'Why ANITEW is different',
  highlights: [
    {
      title: 'It learns your remembering pattern.',
      body: 'Returns are scheduled from real retrieval – from what comes back for you and what still needs support.',
    },
    {
      title: 'It teaches techniques.',
      body: 'Memory palaces, the Major System and linking are explained and then used – not merely tested.',
    },
    {
      title: 'It trains your real life.',
      body: 'Your own facts, study material and personal memories can become part of your Memory World and its review schedule.',
    },
    {
      title: 'It measures separately from training.',
      body: 'Practice is practice. A claim about change comes only from a separate measurement – or not at all.',
    },
  ],
  trust: 'LOCAL FIRST · OFFLINE · NO REQUIRED ACCOUNT',
  questions:
    'Choose “Let’s go” and you will get two short, optional questions: what you genuinely want to remember and how much time you usually have. They set your starting point. Everything stays on this device.',
  begin: 'Let’s go',
  direct: 'Start directly',
  guideLabel: 'Meet ANITEW',
  next: 'Next',
  done: 'Open ANITEW',
  skip: 'Skip introduction',
  lessonContinue: 'Continue to training',
  tour: [
    {
      selector: '.hamburger',
      title: 'The ANITEW Core',
      body: 'Your access to the whole memory system. No hamburger menu: the Core unfolds Memory DNA, your content, Coach, palace, backup and more.',
    },
    {
      selector: '.today',
      title: 'Your Memory World',
      body: 'What you genuinely want to keep grows here. Nodes and links represent real stored memories – never decorative or invented activity.',
    },
    {
      selector: '.memory-pulse',
      title: 'Memory Pulse',
      body: 'Your system speaks here: what returns, what needs attention and what has just appeared. Only from your actual data.',
    },
    {
      selector: '.start',
      title: 'Your training portal',
      body: '60 seconds, 3, 5 or 15 minutes: you set the time. ANITEW fills it with what your history says is useful now.',
    },
    {
      selector: '.hamburger',
      title: 'Training is not measurement',
      body: 'Memory DNA and training show your practice history. A real measurement appears separately when it is due. ANITEW deliberately keeps the two apart.',
    },
  ],
}

const GUIDE_DONE = 'anitew.first-run-guide.v2'
const GUIDE_PENDING = 'anitew.first-run-guide.pending.v2'
let guideOpen = false
let tourIndex = 0
let focusedTarget: Element | undefined

function copy(): FirstRunCopy {
  const lang = document.documentElement.lang.toLowerCase()
  return lang.startsWith('de') ? DE : EN
}

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Die Einführung ist reine Experience. Training und Daten dürfen nie
    // davon abhängen, ob localStorage in diesem Browser verfügbar ist.
  }
}

function node<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag)
  if (className !== undefined) element.className = className
  return element
}

function enhanceWelcome(): void {
  const begin = document.querySelector<HTMLButtonElement>('.onboarding .arrival-begin')
  if (begin === null) return
  const arrival = begin.closest<HTMLElement>('.arrival')
  if (arrival === null || arrival.dataset.firstRunRefined === 'true') return
  arrival.dataset.firstRunRefined = 'true'

  if (read(GUIDE_DONE) !== '1') write(GUIDE_PENDING, '1')

  const t = copy()
  const greeting = document.querySelector<HTMLElement>('.onboarding .brand .greeting')
  if (greeting !== null) greeting.textContent = t.slogan

  const brand = document.querySelector<HTMLElement>('.onboarding .brand')
  if (brand !== null && brand.querySelector('.first-run-philosophy') === null) {
    const philosophy = node('p', 'first-run-philosophy')
    philosophy.textContent = t.philosophy
    brand.append(philosophy)
  }

  const note = arrival.querySelector<HTMLElement>('.arrival-note')
  if (note !== null) note.textContent = t.intro

  const adaptive = node('p', 'first-run-adaptive')
  adaptive.textContent = t.adaptive

  const heading = node('p', 'first-run-different')
  heading.textContent = t.different

  const highlights = node('div', 'first-run-highlights')
  t.highlights.forEach((highlight) => {
    const item = node('article', 'first-run-highlight')
    const dot = node('span', 'first-run-highlight-dot')
    dot.setAttribute('aria-hidden', 'true')
    const title = node('strong')
    title.textContent = highlight.title
    const body = node('p')
    body.textContent = highlight.body
    item.append(dot, title, body)
    highlights.append(item)
  })

  const trust = node('p', 'first-run-trust')
  trust.textContent = t.trust

  const questions = node('p', 'first-run-questions')
  questions.textContent = t.questions

  const actions = arrival.querySelector<HTMLElement>('.arrival-actions')
  if (actions !== null) {
    arrival.insertBefore(adaptive, actions)
    arrival.insertBefore(heading, actions)
    arrival.insertBefore(highlights, actions)
    arrival.insertBefore(trust, actions)
    arrival.insertBefore(questions, actions)
  }

  const beginLabel = begin.querySelector<HTMLElement>('.start-label')
  if (beginLabel !== null) beginLabel.textContent = t.begin

  const direct = actions?.querySelector<HTMLButtonElement>('.quiet:not(.arrival-next)')
  if (direct !== null && direct !== undefined) direct.textContent = t.direct
}

function enhanceLesson(): void {
  const lesson = document.querySelector<HTMLElement>('.session .lesson')
  if (lesson === null || lesson.dataset.readingControl === 'true') return
  const card = lesson.querySelector<HTMLButtonElement>('.lesson-card')
  if (card === null) return

  lesson.dataset.readingControl = 'true'
  card.tabIndex = -1
  card.setAttribute('aria-disabled', 'true')

  const button = node('button', 'lesson-continue')
  button.type = 'button'
  button.textContent = copy().lessonContinue
  button.addEventListener('click', () => card.click(), { once: true })
  lesson.append(button)
}

function clearFocus(): void {
  focusedTarget?.classList.remove('first-run-focus')
  focusedTarget = undefined
}

function closeGuide(markDone: boolean): void {
  clearFocus()
  document.querySelector('.first-run-guide')?.remove()
  guideOpen = false
  if (markDone) {
    write(GUIDE_DONE, '1')
    write(GUIDE_PENDING, '0')
  }
}

function showTourStep(guide: HTMLElement): void {
  clearFocus()
  const t = copy()
  const step = t.tour[tourIndex]
  if (step === undefined) {
    closeGuide(true)
    return
  }

  const target = document.querySelector(step.selector)
  if (target instanceof HTMLElement) {
    focusedTarget = target
    target.classList.add('first-run-focus')
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'center',
      inline: 'center',
    })
  }

  const title = guide.querySelector<HTMLElement>('.first-run-guide-title')
  const body = guide.querySelector<HTMLElement>('.first-run-guide-body')
  const counter = guide.querySelector<HTMLElement>('.first-run-guide-counter')
  const next = guide.querySelector<HTMLButtonElement>('.first-run-guide-next')
  if (title !== null) title.textContent = step.title
  if (body !== null) body.textContent = step.body
  if (counter !== null) counter.textContent = `${tourIndex + 1} / ${t.tour.length}`
  if (next !== null) next.textContent = tourIndex + 1 === t.tour.length ? t.done : t.next
}

function startGuide(): void {
  if (guideOpen || read(GUIDE_DONE) === '1' || read(GUIDE_PENDING) !== '1') return
  if (document.querySelector('.onboarding, .session, .page') !== null) return
  if (document.querySelector('.hamburger') === null || document.querySelector('.start') === null) return

  guideOpen = true
  tourIndex = 0
  const t = copy()
  const guide = node('section', 'first-run-guide')
  guide.setAttribute('role', 'dialog')
  guide.setAttribute('aria-modal', 'true')
  guide.setAttribute('aria-label', t.guideLabel)

  const veil = node('div', 'first-run-guide-veil')
  veil.setAttribute('aria-hidden', 'true')
  const card = node('div', 'first-run-guide-card')
  const counter = node('p', 'first-run-guide-counter')
  const title = node('h2', 'first-run-guide-title')
  const body = node('p', 'first-run-guide-body')
  const actions = node('div', 'first-run-guide-actions')
  const skip = node('button', 'first-run-guide-skip')
  skip.type = 'button'
  skip.textContent = t.skip
  skip.addEventListener('click', () => closeGuide(true))
  const next = node('button', 'first-run-guide-next')
  next.type = 'button'
  next.addEventListener('click', () => {
    if (tourIndex + 1 >= t.tour.length) {
      closeGuide(true)
      return
    }
    tourIndex += 1
    showTourStep(guide)
  })

  actions.append(skip, next)
  card.append(counter, title, body, actions)
  guide.append(veil, card)
  document.body.append(guide)
  showTourStep(guide)
  next.focus({ preventScroll: true })
}

function refresh(): void {
  enhanceWelcome()
  enhanceLesson()
  startGuide()
}

refresh()
const root = document.getElementById('root') ?? document.body
const observer = new MutationObserver(refresh)
observer.observe(root, { childList: true, subtree: true })

window.addEventListener(
  'pagehide',
  () => {
    observer.disconnect()
    closeGuide(false)
  },
  { once: true },
)
