export type InstallDevice = 'iphone' | 'android' | 'mac' | 'windows'

export interface InstallGateCopy {
  /** Die Sprache dieser Fassung — fürs `<html lang>`, solange das Gate steht. */
  readonly lang: 'de' | 'en'
  readonly kicker: string
  readonly title: string
  readonly time: string
  readonly lead: string
  readonly deviceLabel: string
  readonly devices: Record<InstallDevice, string>
  readonly steps: Record<InstallDevice, readonly string[]>
  readonly startedHeading: string
  readonly stepsHeadingFor: (device: string) => string
  readonly startedNote: string
  readonly install: string
  readonly continueInBrowser: string
  readonly browserNote: string
  readonly legalLabel: string
  readonly imprint: string
  readonly privacy: string
}

const DE: InstallGateCopy = {
  lang: 'de',
  kicker: 'ANITEW · EINMAL EINRICHTEN',
  title: 'ANITEW als App installieren',
  time: 'Meist weniger als eine Minute.',
  lead:
    'ANITEW ist für den App-Modus gebaut: eigener Start vom Home-Bildschirm, zuverlässiger Offline-Zugriff und weniger Browser-Reibung. Auf iPhone und iPad funktionieren geschlossene System-Push-Erinnerungen nur als installierte Web-App.',
  deviceLabel: 'Dein Gerät',
  devices: {
    iphone: 'iPhone / iPad',
    android: 'Android',
    mac: 'Mac',
    windows: 'Windows / anderes Gerät',
  },
  steps: {
    iphone: [
      'Öffne ANITEW in Safari.',
      'Tippe auf „Teilen“ und dann auf „Zum Home-Bildschirm“.',
      'Bestätige mit „Hinzufügen“ und öffne anschließend das neue ANITEW-Symbol.',
    ],
    android: [
      'Öffne das Browsermenü (meist ⋮ oben rechts).',
      'Wähle „App installieren“ oder „Zum Startbildschirm hinzufügen“.',
      'Bestätige und öffne ANITEW anschließend über das neue App-Symbol.',
    ],
    mac: [
      'In Chrome/Edge: nutze das Installationssymbol in der Adressleiste oder „App installieren“.',
      'In Safari: wähle „Ablage“ → „Zum Dock hinzufügen“.',
      'Öffne ANITEW danach über Dock, Programme oder Launchpad.',
    ],
    windows: [
      'Nutze das Installationssymbol in der Adressleiste oder das Browsermenü.',
      'Wähle „ANITEW installieren“ bzw. „App installieren“.',
      'Öffne ANITEW anschließend über das neue App-Symbol.',
    ],
  },
  startedHeading: 'Installation gestartet',
  stepsHeadingFor: (device) => `Installation auf ${device}`,
  startedNote:
    'Öffne ANITEW anschließend über das neue App-Symbol. Dort erscheint diese Installationsseite nicht mehr.',
  install: 'App installieren',
  continueInBrowser: 'Nicht installieren, im Browser fortfahren',
  browserNote:
    'Die Browser-Version wird erst mit dem zweiten Button freigegeben. In einer neuen Browser-Sitzung erinnert ANITEW erneut an die Installation; die installierte App sieht diese Seite nie.',
  legalLabel: 'Rechtliches',
  imprint: 'Impressum',
  privacy: 'Datenschutz',
}

const EN: InstallGateCopy = {
  lang: 'en',
  kicker: 'ANITEW · ONE-TIME SETUP',
  title: 'Install ANITEW as an app',
  time: 'Usually takes less than a minute.',
  lead:
    'ANITEW is built for app mode: its own launch from the Home Screen, reliable offline access and less browser friction. On iPhone and iPad, closed-app system push reminders only work as an installed web app.',
  deviceLabel: 'Your device',
  devices: {
    iphone: 'iPhone / iPad',
    android: 'Android',
    mac: 'Mac',
    windows: 'Windows / other device',
  },
  steps: {
    iphone: [
      'Open ANITEW in Safari.',
      'Tap “Share”, then “Add to Home Screen”.',
      'Confirm with “Add”, then open the new ANITEW icon.',
    ],
    android: [
      'Open the browser menu (usually ⋮ in the top right).',
      'Choose “Install app” or “Add to Home screen”.',
      'Confirm, then open ANITEW from the new app icon.',
    ],
    mac: [
      'In Chrome/Edge: use the install icon in the address bar or “Install app”.',
      'In Safari: choose “File” → “Add to Dock”.',
      'Afterwards open ANITEW from the Dock, Applications or Launchpad.',
    ],
    windows: [
      'Use the install icon in the address bar or the browser menu.',
      'Choose “Install ANITEW” or “Install app”.',
      'Afterwards open ANITEW from the new app icon.',
    ],
  },
  startedHeading: 'Installation started',
  stepsHeadingFor: (device) => `Installing on ${device}`,
  startedNote:
    'Afterwards, open ANITEW from the new app icon. This installation page never appears there.',
  install: 'Install app',
  continueInBrowser: 'Do not install, continue in the browser',
  browserNote:
    'The browser version is unlocked only with the second button. In a new browser session ANITEW will remind you about installing again; the installed app never sees this page.',
  legalLabel: 'Legal',
  imprint: 'Imprint',
  privacy: 'Privacy',
}

/**
 * Das Gate rendert VOR der App und damit vor useLanguage — die Sprachwahl
 * kommt deshalb direkt vom Gerät (dasselbe Muster wie die übrigen
 * Copy-Module, nur mit navigator statt documentElement, weil `<html lang>`
 * hier noch fest auf „de“ steht).
 */
export function installGateCopy(): InstallGateCopy {
  const tags = navigator.languages?.length ? navigator.languages : [navigator.language ?? 'de']
  for (const tag of tags) {
    const base = (tag ?? '').toLowerCase().split('-')[0]
    if (base === 'de') return DE
    if (base === 'en') return EN
  }
  // Noch nicht übersetzte Sprachen fallen wie die App selbst auf Englisch.
  return EN
}
