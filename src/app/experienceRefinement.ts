import '../anitew-experience-refinement.css'

import { createWebPlatform } from '../platform/web/index.ts'
import {
  SYNC_ACCOUNT_SETTING,
  SYNC_AT_SETTING,
  SYNC_ON_SETTING,
  connectDriveSync,
  resolveClientId,
} from './driveSync.ts'

interface RefinementCopy {
  close: string
  coachTitle: string
  coachBody: string
  coachBadge: string
  driveTitle: string
  driveBody: string
  driveBadge: string
  trust: string
  driveKicker: string
  driveCardTitle: string
  driveCardBody: string
  driveConnect: string
  driveConnecting: string
  driveConnected: string
  driveUnavailable: string
  driveDenied: string
  guideContext: readonly string[]
}

const DE: RefinementCopy = {
  close: 'Menü schließen',
  coachTitle: 'Der Coach übersetzt deinen Verlauf.',
  coachBody:
    'Er gibt Hinweise aus deinen echten Trainingsdaten. Freie KI-Fragen sind optional und laufen nur mit deinem eigenen Schlüssel beim gewählten Anbieter.',
  coachBadge: 'Coach · optional mit KI',
  driveTitle: 'Deine Daten können dir folgen.',
  driveBody:
    'Empfohlen: Mit Google Drive verbinden. ANITEW legt dort den Ordner „Anitew“ an und gleicht deinen Stand automatisch zwischen deinen Geräten ab.',
  driveBadge: 'Google Drive · empfohlen',
  trust: 'LOCAL FIRST · OFFLINE · GOOGLE DRIVE OPTIONAL',
  driveKicker: 'EMPFOHLEN · OPTIONAL',
  driveCardTitle: 'Google Drive verbinden',
  driveCardBody:
    'ANITEW legt in deinem Drive einen sichtbaren Ordner „Anitew“ an. Darin liegt dein synchronisierter ANITEW-Stand. Ohne Verbindung bleibt alles ausschließlich lokal auf diesem Gerät; ANITEW hat keinen eigenen Datenserver.',
  driveConnect: 'Mit Google Drive verbinden',
  driveConnecting: 'Google Drive wird verbunden …',
  driveConnected: 'Verbunden. Automatischer Abgleich ist aktiv',
  driveUnavailable: 'Google Drive ist für diesen Build noch nicht eingerichtet.',
  driveDenied: 'Nicht verbunden. Lokal funktioniert ANITEW vollständig weiter.',
  guideContext: [
    'Im Core findest du außerdem Coach, Memory DNA, eigene Inhalte, Gedächtnispalast, Google Drive, Backup und Einstellungen.',
    'Eigene Fakten, Lernstoff und persönliche Erinnerungen werden nicht zu Dekoration: Sie bekommen echte Verbindungen und Wiederholungen.',
    'Der Coach liest dieselben realen Signale und macht daraus konkrete Hinweise. Für freie KI-Fragen entscheidest du selbst, ob du einen eigenen API-Schlüssel hinterlegst.',
    'ANITEW bringt Techniken ins Training: Gedächtnispalast, Major-System, Geschichten und Verknüpfungen werden erklärt und danach angewandt.',
    'Empfohlen ist Google Drive für mehrere Geräte. Ohne Verbindung bleibt alles lokal; Übung und ehrliche Messung bleiben trotzdem vollständig nutzbar.',
  ],
}

const EN: RefinementCopy = {
  close: 'Close menu',
  coachTitle: 'The Coach translates your history.',
  coachBody:
    'It gives guidance from your real training data. Free-form AI questions are optional and use only your own key with the provider you choose.',
  coachBadge: 'Coach · optional AI',
  driveTitle: 'Your data can follow you.',
  driveBody:
    'Recommended: connect Google Drive. ANITEW creates an “Anitew” folder there and automatically keeps your state in sync across your devices.',
  driveBadge: 'Google Drive · recommended',
  trust: 'LOCAL FIRST · OFFLINE · GOOGLE DRIVE OPTIONAL',
  driveKicker: 'RECOMMENDED · OPTIONAL',
  driveCardTitle: 'Connect Google Drive',
  driveCardBody:
    'ANITEW creates a visible “Anitew” folder in your Drive and stores the synchronized ANITEW state there. Without a connection everything stays local on this device; ANITEW has no data server of its own.',
  driveConnect: 'Connect Google Drive',
  driveConnecting: 'Connecting Google Drive …',
  driveConnected: 'Connected. Automatic sync is active',
  driveUnavailable: 'Google Drive is not configured for this build yet.',
  driveDenied: 'Not connected. ANITEW continues to work fully locally.',
  guideContext: [
    'The Core also contains Coach, Memory DNA, your own content, memory palace, Google Drive, backup and settings.',
    'Your own facts, study material and personal memories are not decoration: they receive real links and review schedules.',
    'The Coach reads those same real signals and turns them into concrete guidance. For free-form AI questions, you decide whether to add your own API key.',
    'ANITEW brings techniques into training: memory palace, Major System, stories and linking are taught and then applied.',
    'Google Drive is recommended across devices. Without it everything stays local; training and honest measurement remain fully available.',
  ],
}

const platform = createWebPlatform()

function copy(): RefinementCopy {
  return document.documentElement.lang.toLowerCase().startsWith('de') ? DE : EN
}

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
): HTMLElementTagNameMap[K] {
  const value = document.createElement(tag)
  if (className !== undefined) value.className = className
  return value
}

function appendHighlight(
  container: HTMLElement,
  titleText: string,
  bodyText: string,
  badgeText: string,
): void {
  const item = element('article', 'first-run-highlight')
  item.dataset.refinement = 'true'
  const dot = element('span', 'first-run-highlight-dot')
  dot.setAttribute('aria-hidden', 'true')
  const title = element('strong')
  title.textContent = titleText
  const body = element('p')
  body.textContent = bodyText
  const badge = element('span', 'first-run-highlight-badge')
  badge.textContent = badgeText
  item.append(dot, title, body, badge)
  container.append(item)
}

function enhanceWelcome(): void {
  const arrival = document.querySelector<HTMLElement>('.onboarding .arrival')
  if (arrival === null || arrival.dataset.experienceRefinement === 'true') return
  const highlights = arrival.querySelector<HTMLElement>('.first-run-highlights')
  const actions = arrival.querySelector<HTMLElement>('.arrival-actions')
  if (highlights === null || actions === null) return

  arrival.dataset.experienceRefinement = 'true'
  const t = copy()

  appendHighlight(highlights, t.coachTitle, t.coachBody, t.coachBadge)
  appendHighlight(highlights, t.driveTitle, t.driveBody, t.driveBadge)

  const trust = arrival.querySelector<HTMLElement>('.first-run-trust')
  if (trust !== null) trust.textContent = t.trust

  const card = element('section', 'first-run-drive-card')
  card.setAttribute('aria-label', t.driveCardTitle)
  const kicker = element('p', 'first-run-drive-kicker')
  kicker.textContent = t.driveKicker
  const title = element('h3', 'first-run-drive-title')
  title.textContent = t.driveCardTitle
  const body = element('p', 'first-run-drive-body')
  body.textContent = t.driveCardBody
  const driveActions = element('div', 'first-run-drive-actions')
  const button = element('button', 'first-run-drive-connect')
  button.type = 'button'
  button.textContent = t.driveConnect
  const status = element('p', 'first-run-drive-status')
  status.setAttribute('aria-live', 'polite')

  button.addEventListener('click', () => {
    if (button.disabled) return
    button.disabled = true
    button.textContent = t.driveConnecting
    status.textContent = ''
    delete status.dataset.error

    void (async () => {
      const clientId = await resolveClientId(platform.settings)
      if (clientId === undefined) {
        status.dataset.error = 'true'
        status.textContent = t.driveUnavailable
        return
      }
      const now = platform.clock.now()
      const result = await connectDriveSync(clientId, now)
      await platform.settings.write(SYNC_ON_SETTING, true)
      await platform.settings.write(SYNC_AT_SETTING, now)
      if (result.account !== undefined) {
        await platform.settings.write(SYNC_ACCOUNT_SETTING, result.account)
      }
      button.textContent = '✓'
      status.textContent = `${t.driveConnected}${result.account === undefined ? '' : ` · ${result.account}`}`
    })()
      .catch(() => {
        status.dataset.error = 'true'
        status.textContent = t.driveDenied
        button.disabled = false
        button.textContent = t.driveConnect
      })
      .finally(() => {
        if (status.dataset.error !== 'true') button.disabled = true
      })
  })

  driveActions.append(button, status)
  card.append(kicker, title, body, driveActions)

  const questions = arrival.querySelector('.first-run-questions')
  if (questions !== null) arrival.insertBefore(card, questions)
  else arrival.insertBefore(card, actions)
}

function enhanceMenuClose(): void {
  const close = document.querySelector<HTMLButtonElement>('.drawer-close')
  if (close === null || close.querySelector('.drawer-close-label') !== null) return
  const label = element('span', 'drawer-close-label')
  label.textContent = copy().close
  close.append(label)
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
  // Wichtig: Der MutationObserver beobachtet auch diesen Text. Nur schreiben,
  // wenn sich der Inhalt wirklich geändert hat, sonst löst die Verfeinerung
  // ihre eigene Mutation immer wieder aus und blockiert die Oberfläche.
  if (context.textContent !== next) context.textContent = next
  context.hidden = next === ''
}

function refine(): void {
  enhanceWelcome()
  enhanceMenuClose()
  enhanceGuide()
}

refine()
const observer = new MutationObserver(refine)
// Der First-Run-Guide wird absichtlich direkt an <body> gehängt, damit sein
// Overlay nicht vom App-Stacking-Kontext abgeschnitten wird. Deshalb muss die
// Verfeinerung auch dort beobachten; nur #root zu beobachten ließ den
// Zusatztext nach Schritt 1 stehen.
observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true,
})

window.addEventListener(
  'pagehide',
  () => observer.disconnect(),
  { once: true },
)
