export type InstallDevice = 'iphone' | 'android' | 'mac' | 'windows'

export interface InstallGateCopy {
  /** Die Sprache dieser Fassung — fürs `<html lang>`, solange das Gate steht. */
  readonly lang: 'de' | 'en' | 'fr' | 'es' | 'it' | 'pt'
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


const FR: InstallGateCopy = {
  lang: 'fr',
  kicker: 'ANITEW · À CONFIGURER UNE FOIS',
  title: 'Installer ANITEW comme app',
  time: 'En général moins d’une minute.',
  lead:
    'ANITEW est fait pour le mode app : son propre lancement depuis l’écran d’accueil, un accès hors ligne fiable et moins de frictions de navigateur. Sur iPhone et iPad, les rappels push système app fermée ne fonctionnent que comme web-app installée.',
  deviceLabel: 'Ton appareil',
  devices: {
    iphone: 'iPhone / iPad',
    android: 'Android',
    mac: 'Mac',
    windows: 'Windows / autre appareil',
  },
  steps: {
    iphone: [
      'Ouvre ANITEW dans Safari.',
      'Touche « Partager », puis « Sur l’écran d’accueil ».',
      'Confirme avec « Ajouter », puis ouvre la nouvelle icône ANITEW.',
    ],
    android: [
      'Ouvre le menu du navigateur (souvent ⋮ en haut à droite).',
      'Choisis « Installer l’application » ou « Ajouter à l’écran d’accueil ».',
      'Confirme, puis ouvre ANITEW depuis la nouvelle icône.',
    ],
    mac: [
      'Dans Chrome/Edge : utilise l’icône d’installation dans la barre d’adresse ou « Installer l’app ».',
      'Dans Safari : choisis « Fichier » → « Ajouter au Dock ».',
      'Ouvre ensuite ANITEW depuis le Dock, Applications ou le Launchpad.',
    ],
    windows: [
      'Utilise l’icône d’installation dans la barre d’adresse ou le menu du navigateur.',
      'Choisis « Installer ANITEW » ou « Installer l’application ».',
      'Ouvre ensuite ANITEW depuis la nouvelle icône.',
    ],
  },
  startedHeading: 'Installation lancée',
  stepsHeadingFor: (device) => `Installation sur ${device}`,
  startedNote:
    'Ouvre ensuite ANITEW depuis la nouvelle icône. Cette page d’installation n’y apparaît plus.',
  install: 'Installer l’app',
  continueInBrowser: 'Ne pas installer, continuer dans le navigateur',
  browserNote:
    'La version navigateur ne se débloque qu’avec le second bouton. Dans une nouvelle session de navigateur, ANITEW rappellera l’installation ; l’app installée ne voit jamais cette page.',
  legalLabel: 'Mentions légales',
  imprint: 'Mentions légales',
  privacy: 'Confidentialité',
}

const ES: InstallGateCopy = {
  lang: 'es',
  kicker: 'ANITEW · CONFIGURAR UNA VEZ',
  title: 'Instalar ANITEW como app',
  time: 'Normalmente menos de un minuto.',
  lead:
    'ANITEW está hecho para el modo app: arranque propio desde la pantalla de inicio, acceso sin conexión fiable y menos fricción de navegador. En iPhone y iPad, los recordatorios push del sistema con la app cerrada solo funcionan como web-app instalada.',
  deviceLabel: 'Tu dispositivo',
  devices: {
    iphone: 'iPhone / iPad',
    android: 'Android',
    mac: 'Mac',
    windows: 'Windows / otro dispositivo',
  },
  steps: {
    iphone: [
      'Abre ANITEW en Safari.',
      'Toca «Compartir» y luego «Añadir a pantalla de inicio».',
      'Confirma con «Añadir» y abre después el nuevo icono de ANITEW.',
    ],
    android: [
      'Abre el menú del navegador (normalmente ⋮ arriba a la derecha).',
      'Elige «Instalar aplicación» o «Añadir a pantalla de inicio».',
      'Confirma y abre ANITEW después desde el nuevo icono.',
    ],
    mac: [
      'En Chrome/Edge: usa el icono de instalación en la barra de direcciones o «Instalar app».',
      'En Safari: elige «Archivo» → «Añadir al Dock».',
      'Abre ANITEW después desde el Dock, Aplicaciones o el Launchpad.',
    ],
    windows: [
      'Usa el icono de instalación en la barra de direcciones o el menú del navegador.',
      'Elige «Instalar ANITEW» o «Instalar aplicación».',
      'Abre ANITEW después desde el nuevo icono.',
    ],
  },
  startedHeading: 'Instalación iniciada',
  stepsHeadingFor: (device) => `Instalación en ${device}`,
  startedNote:
    'Abre ANITEW después desde el nuevo icono. Ahí esta página de instalación ya no aparece.',
  install: 'Instalar app',
  continueInBrowser: 'No instalar, seguir en el navegador',
  browserNote:
    'La versión de navegador se desbloquea solo con el segundo botón. En una nueva sesión de navegador, ANITEW recordará de nuevo la instalación; la app instalada nunca ve esta página.',
  legalLabel: 'Legal',
  imprint: 'Aviso legal',
  privacy: 'Privacidad',
}

const IT: InstallGateCopy = {
  lang: 'it',
  kicker: 'ANITEW · DA CONFIGURARE UNA VOLTA',
  title: 'Installare ANITEW come app',
  time: 'Di solito meno di un minuto.',
  lead:
    'ANITEW è fatta per la modalità app: avvio proprio dalla schermata iniziale, accesso offline affidabile e meno attriti del browser. Su iPhone e iPad i promemoria push di sistema ad app chiusa funzionano solo come web-app installata.',
  deviceLabel: 'Il tuo dispositivo',
  devices: {
    iphone: 'iPhone / iPad',
    android: 'Android',
    mac: 'Mac',
    windows: 'Windows / altro dispositivo',
  },
  steps: {
    iphone: [
      'Apri ANITEW in Safari.',
      'Tocca «Condividi», poi «Aggiungi a schermata Home».',
      'Conferma con «Aggiungi», poi apri la nuova icona ANITEW.',
    ],
    android: [
      'Apri il menu del browser (di solito ⋮ in alto a destra).',
      'Scegli «Installa app» oppure «Aggiungi a schermata Home».',
      'Conferma, poi apri ANITEW dalla nuova icona.',
    ],
    mac: [
      'In Chrome/Edge: usa l’icona di installazione nella barra degli indirizzi o «Installa app».',
      'In Safari: scegli «File» → «Aggiungi al Dock».',
      'Apri poi ANITEW dal Dock, da Applicazioni o dal Launchpad.',
    ],
    windows: [
      'Usa l’icona di installazione nella barra degli indirizzi o il menu del browser.',
      'Scegli «Installa ANITEW» oppure «Installa app».',
      'Apri poi ANITEW dalla nuova icona.',
    ],
  },
  startedHeading: 'Installazione avviata',
  stepsHeadingFor: (device) => `Installazione su ${device}`,
  startedNote:
    'Apri poi ANITEW dalla nuova icona. Lì questa pagina di installazione non compare più.',
  install: 'Installare l’app',
  continueInBrowser: 'Non installare, continuare nel browser',
  browserNote:
    'La versione browser si sblocca solo col secondo pulsante. In una nuova sessione del browser ANITEW ricorderà di nuovo l’installazione; l’app installata non vede mai questa pagina.',
  legalLabel: 'Note legali',
  imprint: 'Note legali',
  privacy: 'Privacy',
}

const PT: InstallGateCopy = {
  lang: 'pt',
  kicker: 'ANITEW · CONFIGURAR UMA VEZ',
  title: 'Instalar a ANITEW como app',
  time: 'Normalmente menos de um minuto.',
  lead:
    'A ANITEW é feita para o modo app: arranque próprio a partir do ecrã inicial, acesso offline fiável e menos atrito de navegador. No iPhone e iPad, os lembretes push do sistema com a app fechada só funcionam como web-app instalada.',
  deviceLabel: 'O teu aparelho',
  devices: {
    iphone: 'iPhone / iPad',
    android: 'Android',
    mac: 'Mac',
    windows: 'Windows / outro aparelho',
  },
  steps: {
    iphone: [
      'Abre a ANITEW no Safari.',
      'Toca em «Partilhar» e depois em «Adicionar ao ecrã principal».',
      'Confirma com «Adicionar» e abre depois o novo ícone da ANITEW.',
    ],
    android: [
      'Abre o menu do navegador (normalmente ⋮ em cima à direita).',
      'Escolhe «Instalar aplicação» ou «Adicionar ao ecrã inicial».',
      'Confirma e abre a ANITEW depois pelo novo ícone.',
    ],
    mac: [
      'No Chrome/Edge: usa o ícone de instalação na barra de endereço ou «Instalar app».',
      'No Safari: escolhe «Ficheiro» → «Adicionar à Dock».',
      'Abre depois a ANITEW pela Dock, Aplicações ou Launchpad.',
    ],
    windows: [
      'Usa o ícone de instalação na barra de endereço ou o menu do navegador.',
      'Escolhe «Instalar ANITEW» ou «Instalar aplicação».',
      'Abre depois a ANITEW pelo novo ícone.',
    ],
  },
  startedHeading: 'Instalação iniciada',
  stepsHeadingFor: (device) => `Instalação em ${device}`,
  startedNote:
    'Abre depois a ANITEW pelo novo ícone. Lá esta página de instalação já não aparece.',
  install: 'Instalar app',
  continueInBrowser: 'Não instalar, continuar no navegador',
  browserNote:
    'A versão de navegador só se desbloqueia com o segundo botão. Numa nova sessão de navegador a ANITEW voltará a lembrar a instalação; a app instalada nunca vê esta página.',
  legalLabel: 'Legal',
  imprint: 'Ficha legal',
  privacy: 'Privacidade',
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
    if (base === 'fr') return FR
    if (base === 'es') return ES
    if (base === 'it') return IT
    if (base === 'pt') return PT
  }
  // Noch nicht übersetzte Sprachen fallen wie die App selbst auf Englisch.
  return EN
}
