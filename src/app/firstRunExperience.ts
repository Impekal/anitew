import '../anitew-first-run.css'

import { GUIDE_DONE_KEY, GUIDE_PENDING_KEY } from './firstRunGuideState.ts'
import { type FirstRunCopy, firstRunCopyFor } from './firstRunLayerCopy.ts'

// Die Schlüssel liegen in firstRunGuideState.ts — eine Quelle für dieses
// Modul und coreRitual.ts, damit eine Versionierung nicht an einer der
// beiden Stellen vorbeiläuft.
const GUIDE_DONE = GUIDE_DONE_KEY
const GUIDE_PENDING = GUIDE_PENDING_KEY
let guideOpen = false
let tourIndex = 0
let focusedTarget: Element | undefined

function copy(): FirstRunCopy {
  // Alle übersetzten Sprachen aus einer Quelle (firstRunLayerCopy) — das
  // binäre de/en hinterließ bei fr/es/it/pt englische Einbauten unter
  // richtig markierter Sprache (gemessen 30.08., fr-FR-Erstbesuch).
  return firstRunCopyFor(document.documentElement.lang)
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

// Die Führung ist ein Angebot, kein Modus, der die App sperrt. Wer statt
// „Weiter“ direkt einen echten Teil von ANITEW antippt, hat damit ebenfalls
// entschieden, dass er genug gesehen hat. Der Klick selbst läuft danach ganz
// normal weiter; nur die Erklärung räumt ihren Platz.
document.addEventListener(
  'click',
  (event) => {
    if (!guideOpen) return
    const target = event.target
    if (!(target instanceof Element)) return
    if (target.closest('.first-run-guide-card') !== null) return
    closeGuide(true)
  },
  true,
)

window.addEventListener(
  'pagehide',
  () => {
    observer.disconnect()
    closeGuide(false)
  },
  { once: true },
)
