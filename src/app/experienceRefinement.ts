import '../anitew-experience-refinement.css'

import { createWebPlatform } from '../platform/web/index.ts'
import {
  SYNC_ACCOUNT_NAME_SETTING,
  SYNC_ACCOUNT_SETTING,
  SYNC_AT_SETTING,
  SYNC_ON_SETTING,
  connectDriveSync,
  resolveClientId,
} from './driveSync.ts'
import { prepareDriveAuth } from './driveAuthBridge.ts'
import {
  type CapabilityCopy,
  type CapabilityKind,
  type RefinementCopy,
  type ThemeChoice,
  refinementCopyFor,
} from './firstRunLayerCopy.ts'

const platform = createWebPlatform()
const THEME_KEY = 'anitew.theme.v1'
const lifecycle = new AbortController()

function copy(): RefinementCopy {
  // Alle übersetzten Sprachen aus einer Quelle (firstRunLayerCopy) — das
  // binäre de/en hinterließ bei fr/es/it/pt englische Einbauten unter
  // richtig markierter Sprache (gemessen 30.08., fr-FR-Erstbesuch).
  return refinementCopyFor(document.documentElement.lang)
}

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
): HTMLElementTagNameMap[K] {
  const value = document.createElement(tag)
  if (className !== undefined) value.className = className
  return value
}

function oauthDetail(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null || !('detail' in error)) return undefined
  const detail = (error as { detail?: unknown }).detail
  return typeof detail === 'string' && detail !== '' ? detail : undefined
}

function icon(kind: CapabilityKind): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('aria-hidden', 'true')
  svg.classList.add('first-run-highlight-icon')
  const paths: Record<CapabilityKind, string> = {
    adaptive: '<path d="M4 16.5 8.2 12l3 2.8L20 6.5"/><circle cx="4" cy="16.5" r="1.4"/><circle cx="8.2" cy="12" r="1.4"/><circle cx="11.2" cy="14.8" r="1.4"/><circle cx="20" cy="6.5" r="1.4"/>',
    technique: '<path d="M5 19V9l7-4 7 4v10M8.5 19v-5h7v5M4 19h16"/>',
    world: '<circle cx="6" cy="12" r="2"/><circle cx="13" cy="6" r="2"/><circle cx="18" cy="15" r="2"/><path d="m7.6 10.8 3.8-3.4m2.7.3 2.8 5.5M8 12.5l8 2"/>',
    measure: '<path d="M5 18a8 8 0 1 1 14 0M12 18l4-7"/><circle cx="12" cy="18" r="1.4"/>',
    coach: '<path d="M5 6.5h14v9H9l-4 3v-12Z"/><path d="M9 10h6M9 13h4"/>',
    privacy: '<path d="M12 3.5 19 6v5.2c0 4.5-2.8 7.7-7 9.3-4.2-1.6-7-4.8-7-9.3V6l7-2.5Z"/><path d="m9 12 2 2 4-4"/>',
  }
  svg.innerHTML = paths[kind]
  return svg
}

function appendHighlight(container: HTMLElement, itemCopy: CapabilityCopy): void {
  const item = element('article', 'first-run-highlight')
  item.dataset.capability = itemCopy.kind
  const visual = element('span', 'first-run-highlight-visual')
  visual.append(icon(itemCopy.kind))
  const title = element('strong')
  title.textContent = itemCopy.title
  const body = element('p')
  body.textContent = itemCopy.body
  const badge = element('span', 'first-run-highlight-badge')
  badge.textContent = itemCopy.badge
  item.append(visual, title, body, badge)
  container.append(item)
}

function addScrollCue(arrival: HTMLElement, t: RefinementCopy): void {
  if (arrival.querySelector('.first-run-scroll-cue') !== null) return
  const target = arrival.querySelector<HTMLElement>('.first-run-different')
  if (target === null) return
  const cue = element('button', 'first-run-scroll-cue')
  cue.type = 'button'
  cue.setAttribute('aria-label', t.scroll)
  const label = element('span', 'first-run-scroll-label')
  label.textContent = t.scroll
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  arrow.setAttribute('viewBox', '0 0 24 24')
  arrow.setAttribute('aria-hidden', 'true')
  arrow.innerHTML = '<path d="m6 9 6 6 6-6"/>'
  cue.append(label, arrow)
  cue.addEventListener('click', () => target.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  const update = () => {
    cue.dataset.hidden = window.scrollY > 96 ? 'true' : 'false'
  }
  window.addEventListener('scroll', update, { passive: true, signal: lifecycle.signal })
  update()
  arrival.append(cue)
}

function enhanceWelcome(): void {
  const arrival = document.querySelector<HTMLElement>('.onboarding .arrival')
  if (arrival === null || arrival.dataset.experienceRefinement === 'v4') return
  const highlights = arrival.querySelector<HTMLElement>('.first-run-highlights')
  const actions = arrival.querySelector<HTMLElement>('.arrival-actions')
  if (highlights === null || actions === null) return

  arrival.dataset.experienceRefinement = 'v4'
  const t = copy()

  const greeting = document.querySelector<HTMLElement>('.onboarding .brand .greeting')
  if (greeting !== null) greeting.textContent = t.welcomeTitle
  const philosophy = document.querySelector<HTMLElement>('.onboarding .first-run-philosophy')
  if (philosophy !== null) philosophy.textContent = t.philosophy
  const note = arrival.querySelector<HTMLElement>('.arrival-note')
  if (note !== null) note.textContent = t.intro
  const adaptive = arrival.querySelector<HTMLElement>('.first-run-adaptive')
  if (adaptive !== null) adaptive.textContent = t.adaptive
  const different = arrival.querySelector<HTMLElement>('.first-run-different')
  if (different !== null) different.textContent = t.different

  // Sechs klare Fähigkeiten statt sechs Textblöcke aus verschiedenen Phasen.
  highlights.replaceChildren()
  t.capabilities.forEach((capability) => appendHighlight(highlights, capability))

  const trust = arrival.querySelector<HTMLElement>('.first-run-trust')
  if (trust !== null) trust.textContent = t.trust
  const questions = arrival.querySelector<HTMLElement>('.first-run-questions')
  if (questions !== null) questions.textContent = t.questions

  const card = element('section', 'first-run-drive-card')
  card.setAttribute('aria-label', t.driveCardTitle)
  const visual = element('span', 'first-run-drive-visual')
  visual.append(icon('privacy'))
  const kicker = element('p', 'first-run-drive-kicker')
  kicker.textContent = t.driveKicker
  const title = element('h3', 'first-run-drive-title')
  title.textContent = t.driveCardTitle
  const body = element('p', 'first-run-drive-body')
  body.textContent = t.driveCardBody
  const driveActions = element('div', 'first-run-drive-actions')
  const button = element('button', 'first-run-drive-connect')
  button.type = 'button'
  button.disabled = true
  button.textContent = t.drivePreparing
  const status = element('p', 'first-run-drive-status')
  status.setAttribute('aria-live', 'polite')

  let preparedClientId: string | undefined
  void Promise.all([resolveClientId(platform.settings), prepareDriveAuth()])
    .then(([clientId]) => {
      preparedClientId = clientId
      button.disabled = false
      button.textContent = t.driveConnect
    })
    .catch((error: unknown) => {
      status.dataset.error = 'true'
      const detail = oauthDetail(error)
      status.textContent = `${t.driveUnavailable}${detail === undefined ? '' : ` · ${detail}`}`
      button.textContent = t.driveConnect
    })

  button.addEventListener('click', () => {
    if (button.disabled || preparedClientId === undefined) return

    button.disabled = true
    button.textContent = t.driveConnecting
    status.textContent = ''
    delete status.dataset.error

    const now = platform.clock.now()
    // Keine asynchrone Grenze vor diesem Aufruf: connectDriveSync stößt den
    // vorbereiteten Google-Token-Client sofort im echten Tap-Stack an.
    const connection = connectDriveSync(preparedClientId, now)

    void connection
      .then(async (result) => {
        await platform.settings.write(SYNC_ON_SETTING, true)
        await platform.settings.write(SYNC_AT_SETTING, now)
        if (result.account !== undefined) {
          await platform.settings.write(SYNC_ACCOUNT_SETTING, result.account)
        }
        if (result.accountName !== undefined) {
          await platform.settings.write(SYNC_ACCOUNT_NAME_SETTING, result.accountName)
        }
        button.setAttribute('aria-label', button.textContent ?? t.driveKicker)
    button.textContent = '✓'
        const identity = result.accountName ?? result.account
        status.textContent = `${t.driveConnected}${identity === undefined ? '' : ` · ${identity}`}`
      })
      .catch((error: unknown) => {
        status.dataset.error = 'true'
        const detail = oauthDetail(error)
        status.textContent = `${t.driveDenied}${detail === undefined ? '' : ` · ${detail}`}`
        button.disabled = false
        button.textContent = t.driveConnect
      })
      .finally(() => {
        if (status.dataset.error !== 'true') button.disabled = true
      })
  })

  driveActions.append(button, status)
  card.append(visual, kicker, title, body, driveActions)
  if (questions !== null) arrival.insertBefore(card, questions)
  else arrival.insertBefore(card, actions)

  addScrollCue(arrival, t)
}

function enhanceMenuClose(): void {
  const close = document.querySelector<HTMLButtonElement>('.drawer-close')
  if (close === null || close.querySelector('.drawer-close-label') !== null) return
  const label = element('span', 'drawer-close-label')
  label.textContent = copy().close
  close.append(label)
}

function readTheme(): ThemeChoice {
  try {
    const value = window.localStorage.getItem(THEME_KEY)
    return value === 'light' || value === 'dark' ? value : 'system'
  } catch {
    return 'system'
  }
}

function applyTheme(theme: ThemeChoice): void {
  document.documentElement.dataset.anitewTheme = theme
  try {
    if (theme === 'system') window.localStorage.removeItem(THEME_KEY)
    else window.localStorage.setItem(THEME_KEY, theme)
  } catch {
    // Darstellung ist Komfort; sie darf die App nie blockieren.
  }
  document.querySelectorAll<HTMLButtonElement>('.theme-choice').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.themeValue === theme))
  })
}

function enhanceThemeControl(): void {
  const group = document.querySelector<HTMLElement>('.menu-group-device')
  if (group === null || group.querySelector('.theme-control') !== null) return
  const t = copy()
  const control = element('section', 'theme-control')
  control.setAttribute('aria-label', t.appearance)
  const label = element('p', 'theme-label')
  label.textContent = t.appearance
  const choices = element('div', 'theme-choices')
  ;(['system', 'light', 'dark'] as const).forEach((theme) => {
    const button = element('button', 'theme-choice')
    button.type = 'button'
    button.dataset.themeValue = theme
    button.textContent = t.themes[theme]
    button.setAttribute('aria-pressed', String(readTheme() === theme))
    button.addEventListener('click', () => applyTheme(theme))
    choices.append(button)
  })
  control.append(label, choices)
  const groupLabel = group.querySelector('.menu-label')
  if (groupLabel?.nextSibling !== null && groupLabel?.nextSibling !== undefined) {
    group.insertBefore(control, groupLabel.nextSibling)
  } else group.append(control)
}

let identityLookupRunning = false
function enhanceDrawerAccount(): void {
  const drawer = document.querySelector<HTMLElement>('.drawer')
  if (drawer === null || drawer.querySelector('.drawer-google-account') !== null) return
  if (drawer.dataset.identityChecked === 'true' || identityLookupRunning) return
  drawer.dataset.identityChecked = 'true'
  identityLookupRunning = true
  void Promise.all([
    platform.settings.read<boolean>(SYNC_ON_SETTING).catch(() => undefined),
    platform.settings.read<string>(SYNC_ACCOUNT_SETTING).catch(() => undefined),
    platform.settings.read<string>(SYNC_ACCOUNT_NAME_SETTING).catch(() => undefined),
  ])
    .then(([on, email, name]) => {
      if (!drawer.isConnected || on !== true || (email === undefined && name === undefined)) return
      const t = copy()
      const card = element('section', 'drawer-google-account')
      const avatar = element('span', 'drawer-google-avatar')
      const source = name?.trim() || email?.trim() || 'G'
      avatar.textContent = source.slice(0, 1).toUpperCase()
      avatar.setAttribute('aria-hidden', 'true')
      const text = element('span', 'drawer-google-copy')
      const kicker = element('small')
      kicker.textContent = t.connectedAccount
      const strong = element('strong')
      strong.textContent = name ?? 'Google Drive'
      text.append(kicker, strong)
      if (email !== undefined) {
        const mail = element('span')
        mail.textContent = email
        text.append(mail)
      }
      card.append(avatar, text)
      /*
       * Vor die erste Gruppe — und zwar in **deren** Elternknoten.
       *
       * `drawer.insertBefore(card, firstGroup)` ging so lange gut, wie
       * `.menu-group` ein direktes Kind der Schublade war. Seit die Einträge in
       * einem eigenen scrollenden Kasten liegen, ist sie ein Enkel, und
       * `insertBefore` wirft — die Kontozeile erschien danach gar nicht mehr.
       * Am Elternknoten der Bezugsstelle festzumachen ist gegen solche
       * Umbauten gleichgültig.
       */
      const firstGroup = drawer.querySelector('.menu-group')
      const host = firstGroup?.parentElement ?? null
      if (firstGroup !== null && host !== null) host.insertBefore(card, firstGroup)
      else (drawer.querySelector('.drawer-scroll') ?? drawer).append(card)
    })
    .finally(() => {
      identityLookupRunning = false
    })
}

function enhanceGuide(): void {
  const guide = document.querySelector<HTMLElement>('.first-run-guide')
  if (guide === null) return
  const card = guide.querySelector<HTMLElement>('.first-run-guide-card')
  const counter = guide.querySelector<HTMLElement>('.first-run-guide-counter')
  const body = guide.querySelector<HTMLElement>('.first-run-guide-body')
  if (card === null || counter === null || body === null) return

  let context = card.querySelector<HTMLElement>('.first-run-guide-context')
  if (context === null) {
    context = element('p', 'first-run-guide-context')
    body.insertAdjacentElement('afterend', context)
  }

  const index = Number(counter.textContent?.split('/')[0]?.trim() ?? '0') - 1
  const next = copy().guideContext[index] ?? ''
  if (context.textContent !== next) context.textContent = next
  context.hidden = next === ''
}

function refine(): void {
  enhanceWelcome()
  enhanceMenuClose()
  enhanceThemeControl()
  enhanceDrawerAccount()
  enhanceGuide()
}

applyTheme(readTheme())
refine()
const observer = new MutationObserver(refine)
observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true,
})

window.addEventListener(
  'pagehide',
  () => {
    lifecycle.abort()
    observer.disconnect()
  },
  { once: true },
)
