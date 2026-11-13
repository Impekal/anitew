/**
 * Die Texte der beiden First-Run-Schichten (firstRunExperience und
 * experienceRefinement) — eine Quelle für beide, in allen übersetzten
 * Oberflächensprachen.
 *
 * Vorher hielt jede Schicht eigene DE/EN-Blöcke mit binärem
 * `startsWith('de') ? DE : EN`. Gemessen am 30.08. (fr-FR, Erstbesuch):
 * `lang="fr"`, FR-Pille aktiv, React-Teile französisch — aber alles von den
 * Schichten Eingebaute englisch. Genau die Halbübersetzung, die F-1/F-2
 * beim React-Teil beseitigt hatten, nur eine Schicht tiefer.
 *
 * Dieses Modul wird ausschließlich von den beiden verzögerten Schichten
 * importiert und landet deshalb in einem verzögerten Chunk — das
 * Kaltstart-Budget (P4) bleibt unberührt. Muttersprachler-Review wie bei
 * den Wörterbüchern offen (TRANSLATION_WORKFLOW §4, „Review-Stand“).
 */

export type CapabilityKind = 'adaptive' | 'technique' | 'world' | 'measure' | 'coach' | 'privacy'
export type ThemeChoice = 'system' | 'light' | 'dark'

export interface CapabilityCopy {
  kind: CapabilityKind
  title: string
  body: string
  badge: string
}

export interface RefinementCopy {
  close: string
  welcomeTitle: string
  philosophy: string
  intro: string
  adaptive: string
  different: string
  capabilities: readonly CapabilityCopy[]
  trust: string
  questions: string
  driveKicker: string
  driveCardTitle: string
  driveCardBody: string
  driveConnect: string
  drivePreparing: string
  driveConnecting: string
  driveConnected: string
  driveUnavailable: string
  driveDenied: string
  scroll: string
  appearance: string
  themes: Record<ThemeChoice, string>
  connectedAccount: string
  guideContext: readonly string[]
}

export interface FirstRunCopy {
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

const REFINEMENT_DE: RefinementCopy = {
  close: 'Menü schließen',
  welcomeTitle: 'Willkommen in deinem Gedächtnissystem.',
  philosophy: 'Erinnern. Verknüpfen. Behalten.',
  intro: 'ANITEW trainiert Namen, Zahlen, Lernstoff und Erinnerungen aus deinem echten Leben.',
  adaptive: 'Es lernt aus echten Abrufen, lehrt Techniken und passt sich deinem Verlauf an.',
  different: 'Das macht ANITEW',
  capabilities: [
    {
      kind: 'adaptive',
      title: 'Adaptives Training',
      body: 'Wiederholen, wenn dein Verlauf es braucht.',
      badge: 'Echte Abrufe',
    },
    {
      kind: 'technique',
      title: 'Gedächtnistechniken',
      body: 'Palast, Major-System, Geschichten, Verknüpfungen.',
      badge: 'Lernen + anwenden',
    },
    {
      kind: 'world',
      title: 'Memory World',
      body: 'Namen, Lernstoff und persönliche Erinnerungen werden trainierbar.',
      badge: 'Dein Inhalt',
    },
    {
      kind: 'measure',
      title: 'Ehrliche Messung',
      body: 'Training und Messung bleiben bewusst getrennt.',
      badge: 'Keine Fantasie-Scores',
    },
    {
      kind: 'coach',
      title: 'Coach',
      body: 'Liest deinen Verlauf und macht daraus konkrete Hinweise.',
      badge: 'Optional mit KI',
    },
    {
      kind: 'privacy',
      title: 'Deine Daten. Deine Kontrolle.',
      body: 'Lokal auf deinem Gerät — oder in deinem eigenen Google Drive.',
      badge: 'Private by design',
    },
  ],
  trust: 'PRIVAT · LOKAL ZUERST · DEINE DATEN, DEINE KONTROLLE',
  questions: 'Zwei kurze, freiwillige Fragen richten ANITEW auf das aus, was du behalten willst und wie viel Zeit du hast.',
  driveKicker: 'OPTIONAL · EMPFOHLEN FÜR MEHRERE GERÄTE',
  driveCardTitle: 'Deine Daten. Deine Kontrolle.',
  driveCardBody:
    'Standardmäßig bleibt alles auf diesem Gerät. Für mehrere Geräte kannst du dich mit Google anmelden und deine ANITEW-Daten in deinem eigenen Google Drive speichern. ANITEW synchronisiert dann über deinen sichtbaren Ordner „Anitew“ — ohne zusätzliche ANITEW-Cloudkopie.',
  driveConnect: 'Anmelden / Daten im Google Drive speichern',
  drivePreparing: 'Google-Anmeldung wird vorbereitet …',
  driveConnecting: 'Google-Anmeldung wird geöffnet …',
  driveConnected: 'Angemeldet. Automatischer Abgleich ist aktiv',
  driveUnavailable: 'Google-Anmeldung konnte nicht vorbereitet werden.',
  driveDenied: 'Anmeldung nicht abgeschlossen. Lokal funktioniert ANITEW vollständig weiter.',
  scroll: 'Mehr entdecken',
  appearance: 'Darstellung',
  themes: { system: 'System', light: 'Hell', dark: 'Dunkel' },
  connectedAccount: 'Angemeldetes Google-Konto',
  guideContext: [
    'Im Core liegen Coach, Memory DNA, eigene Inhalte, Gedächtnispalast, Google Drive, Backup und Einstellungen.',
    'Eigene Fakten, Lernstoff und persönliche Erinnerungen bekommen echte Verbindungen und Wiederholungen.',
    'Der Coach liest dieselben realen Signale und macht daraus konkrete Hinweise.',
    'Gedächtnispalast, Major-System, Geschichten und Verknüpfungen werden erklärt und angewandt.',
    'Mehrere Geräte: mit Google anmelden und im eigenen Google Drive speichern. Ohne Anmeldung bleibt ANITEW vollständig lokal.',
  ],
}

const REFINEMENT_EN: RefinementCopy = {
  close: 'Close menu',
  welcomeTitle: 'Welcome to your memory system.',
  philosophy: 'Remember. Connect. Retain.',
  intro: 'ANITEW trains names, numbers, study material and memories from your real life.',
  adaptive: 'It learns from real retrieval, teaches techniques and adapts to your history.',
  different: 'What ANITEW does',
  capabilities: [
    {
      kind: 'adaptive',
      title: 'Adaptive training',
      body: 'Review when your history says it matters.',
      badge: 'Real retrieval',
    },
    {
      kind: 'technique',
      title: 'Memory techniques',
      body: 'Palaces, Major System, stories and linking.',
      badge: 'Learn + apply',
    },
    {
      kind: 'world',
      title: 'Memory World',
      body: 'Names, study material and personal memories become trainable.',
      badge: 'Your content',
    },
    {
      kind: 'measure',
      title: 'Honest measurement',
      body: 'Training and measurement stay deliberately separate.',
      badge: 'No fantasy scores',
    },
    {
      kind: 'coach',
      title: 'Coach',
      body: 'Reads your history and turns it into concrete guidance.',
      badge: 'Optional AI',
    },
    {
      kind: 'privacy',
      title: 'Your data. Your control.',
      body: 'Local on your device — or in your own Google Drive.',
      badge: 'Private by design',
    },
  ],
  trust: 'PRIVATE · LOCAL FIRST · YOUR DATA, YOUR CONTROL',
  questions: 'Two short optional questions tune ANITEW to what you want to retain and how much time you have.',
  driveKicker: 'OPTIONAL · RECOMMENDED FOR MULTIPLE DEVICES',
  driveCardTitle: 'Your data. Your control.',
  driveCardBody:
    'Everything stays on this device by default. For multiple devices, sign in with Google and save your ANITEW data in your own Google Drive. ANITEW then syncs through your visible “Anitew” folder — without an additional ANITEW cloud copy.',
  driveConnect: 'Sign in / save data in Google Drive',
  drivePreparing: 'Preparing Google sign-in …',
  driveConnecting: 'Opening Google sign-in …',
  driveConnected: 'Signed in. Automatic sync is active',
  driveUnavailable: 'Google sign-in could not be prepared.',
  driveDenied: 'Sign-in was not completed. ANITEW continues to work fully locally.',
  scroll: 'Explore more',
  appearance: 'Appearance',
  themes: { system: 'System', light: 'Light', dark: 'Dark' },
  connectedAccount: 'Signed-in Google account',
  guideContext: [
    'The Core contains Coach, Memory DNA, your content, memory palace, Google Drive, backup and settings.',
    'Your facts, study material and personal memories receive real links and review schedules.',
    'The Coach reads those same real signals and turns them into concrete guidance.',
    'Memory palace, Major System, stories and linking are taught and applied.',
    'Multiple devices: sign in with Google and save to your own Google Drive. Without sign-in ANITEW remains fully local.',
  ],
}

const REFINEMENT_FR: RefinementCopy = {
  close: 'Fermer le menu',
  welcomeTitle: 'Bienvenue dans ton système de mémoire.',
  philosophy: 'Retenir. Relier. Garder.',
  intro: 'ANITEW entraîne noms, nombres, matière et souvenirs de ta vraie vie.',
  adaptive: 'Il apprend de vrais rappels, enseigne des techniques et s’adapte à ton parcours.',
  different: 'Ce que fait ANITEW',
  capabilities: [
    {
      kind: 'adaptive',
      title: 'Entraînement adaptatif',
      body: 'Réviser quand ton parcours le demande.',
      badge: 'Vrais rappels',
    },
    {
      kind: 'technique',
      title: 'Techniques de mémoire',
      body: 'Palais, système Major, histoires, liens.',
      badge: 'Apprendre + appliquer',
    },
    {
      kind: 'world',
      title: 'Memory World',
      body: 'Noms, matière et souvenirs personnels deviennent entraînables.',
      badge: 'Ton contenu',
    },
    {
      kind: 'measure',
      title: 'Mesure honnête',
      body: 'Entraînement et mesure restent volontairement séparés.',
      badge: 'Pas de scores fantaisistes',
    },
    {
      kind: 'coach',
      title: 'Coach',
      body: 'Lit ton parcours et en tire des indications concrètes.',
      badge: 'IA en option',
    },
    {
      kind: 'privacy',
      title: 'Tes données. Ton contrôle.',
      body: 'En local sur ton appareil — ou dans ton propre Google Drive.',
      badge: 'Private by design',
    },
  ],
  trust: 'PRIVÉ · LOCAL D’ABORD · TES DONNÉES, TON CONTRÔLE',
  questions: 'Deux courtes questions facultatives règlent ANITEW sur ce que tu veux retenir et le temps que tu as.',
  driveKicker: 'OPTIONNEL · RECOMMANDÉ POUR PLUSIEURS APPAREILS',
  driveCardTitle: 'Tes données. Ton contrôle.',
  driveCardBody:
    'Par défaut, tout reste sur cet appareil. Pour plusieurs appareils, connecte-toi avec Google et enregistre tes données ANITEW dans ton propre Google Drive. ANITEW synchronise alors via ton dossier visible « Anitew » — sans copie cloud ANITEW supplémentaire.',
  driveConnect: 'Se connecter / enregistrer dans Google Drive',
  drivePreparing: 'Préparation de la connexion Google …',
  driveConnecting: 'Ouverture de la connexion Google …',
  driveConnected: 'Connecté. La synchronisation automatique est active',
  driveUnavailable: 'La connexion Google n’a pas pu être préparée.',
  driveDenied: 'Connexion non terminée. En local, ANITEW continue de fonctionner entièrement.',
  scroll: 'En découvrir plus',
  appearance: 'Apparence',
  themes: { system: 'Système', light: 'Clair', dark: 'Sombre' },
  connectedAccount: 'Compte Google connecté',
  guideContext: [
    'Le Core contient Coach, Memory DNA, tes contenus, palais de mémoire, Google Drive, sauvegarde et réglages.',
    'Tes faits, ta matière et tes souvenirs personnels reçoivent de vrais liens et des révisions planifiées.',
    'Le Coach lit ces mêmes signaux réels et en tire des indications concrètes.',
    'Palais de mémoire, système Major, histoires et liens sont enseignés et appliqués.',
    'Plusieurs appareils : se connecter avec Google et enregistrer dans son propre Google Drive. Sans connexion, ANITEW reste entièrement local.',
  ],
}

const REFINEMENT_ES: RefinementCopy = {
  close: 'Cerrar menú',
  welcomeTitle: 'Bienvenido a tu sistema de memoria.',
  philosophy: 'Recordar. Conectar. Conservar.',
  intro: 'ANITEW entrena nombres, números, materia y recuerdos de tu vida real.',
  adaptive: 'Aprende de recuperaciones reales, enseña técnicas y se adapta a tu recorrido.',
  different: 'Esto hace ANITEW',
  capabilities: [
    {
      kind: 'adaptive',
      title: 'Entrenamiento adaptativo',
      body: 'Repasar cuando tu recorrido lo pide.',
      badge: 'Recuperaciones reales',
    },
    {
      kind: 'technique',
      title: 'Técnicas de memoria',
      body: 'Palacio, sistema Major, historias, vínculos.',
      badge: 'Aprender + aplicar',
    },
    {
      kind: 'world',
      title: 'Memory World',
      body: 'Nombres, materia y recuerdos personales se vuelven entrenables.',
      badge: 'Tu contenido',
    },
    {
      kind: 'measure',
      title: 'Medición honesta',
      body: 'Entrenamiento y medición se mantienen separados a propósito.',
      badge: 'Sin puntuaciones de fantasía',
    },
    {
      kind: 'coach',
      title: 'Coach',
      body: 'Lee tu recorrido y lo convierte en indicaciones concretas.',
      badge: 'IA opcional',
    },
    {
      kind: 'privacy',
      title: 'Tus datos. Tu control.',
      body: 'Local en tu dispositivo — o en tu propio Google Drive.',
      badge: 'Private by design',
    },
  ],
  trust: 'PRIVADO · LOCAL PRIMERO · TUS DATOS, TU CONTROL',
  questions: 'Dos preguntas cortas y voluntarias orientan ANITEW a lo que quieres conservar y al tiempo que tienes.',
  driveKicker: 'OPCIONAL · RECOMENDADO PARA VARIOS DISPOSITIVOS',
  driveCardTitle: 'Tus datos. Tu control.',
  driveCardBody:
    'Por defecto todo se queda en este dispositivo. Para varios dispositivos, inicia sesión con Google y guarda tus datos de ANITEW en tu propio Google Drive. ANITEW sincroniza entonces por tu carpeta visible «Anitew» — sin copia adicional en la nube de ANITEW.',
  driveConnect: 'Iniciar sesión / guardar en Google Drive',
  drivePreparing: 'Preparando el inicio de sesión de Google …',
  driveConnecting: 'Abriendo el inicio de sesión de Google …',
  driveConnected: 'Sesión iniciada. La sincronización automática está activa',
  driveUnavailable: 'No se pudo preparar el inicio de sesión de Google.',
  driveDenied: 'Inicio de sesión sin completar. En local, ANITEW sigue funcionando por completo.',
  scroll: 'Descubrir más',
  appearance: 'Apariencia',
  themes: { system: 'Sistema', light: 'Claro', dark: 'Oscuro' },
  connectedAccount: 'Cuenta de Google conectada',
  guideContext: [
    'En el Core están Coach, Memory DNA, tu contenido, palacio de la memoria, Google Drive, copia y ajustes.',
    'Tus hechos, materia y recuerdos personales reciben conexiones reales y repasos planificados.',
    'El Coach lee esas mismas señales reales y las convierte en indicaciones concretas.',
    'Palacio de la memoria, sistema Major, historias y vínculos se enseñan y se aplican.',
    'Varios dispositivos: inicia sesión con Google y guarda en tu propio Google Drive. Sin sesión, ANITEW sigue siendo del todo local.',
  ],
}

const REFINEMENT_IT: RefinementCopy = {
  close: 'Chiudere il menu',
  welcomeTitle: 'Benvenuto nel tuo sistema di memoria.',
  philosophy: 'Ricordare. Collegare. Conservare.',
  intro: 'ANITEW allena nomi, numeri, materia e ricordi della tua vita vera.',
  adaptive: 'Impara da richiami veri, insegna tecniche e si adatta al tuo percorso.',
  different: 'Questo fa ANITEW',
  capabilities: [
    {
      kind: 'adaptive',
      title: 'Allenamento adattivo',
      body: 'Ripassare quando il tuo percorso lo chiede.',
      badge: 'Richiami veri',
    },
    {
      kind: 'technique',
      title: 'Tecniche di memoria',
      body: 'Palazzo, sistema Major, storie, collegamenti.',
      badge: 'Imparare + applicare',
    },
    {
      kind: 'world',
      title: 'Memory World',
      body: 'Nomi, materia e ricordi personali diventano allenabili.',
      badge: 'Il tuo contenuto',
    },
    {
      kind: 'measure',
      title: 'Misurazione onesta',
      body: 'Allenamento e misurazione restano separati di proposito.',
      badge: 'Niente punteggi di fantasia',
    },
    {
      kind: 'coach',
      title: 'Coach',
      body: 'Legge il tuo percorso e ne trae indicazioni concrete.',
      badge: 'IA opzionale',
    },
    {
      kind: 'privacy',
      title: 'I tuoi dati. Il tuo controllo.',
      body: 'In locale sul tuo dispositivo — o nel tuo Google Drive.',
      badge: 'Private by design',
    },
  ],
  trust: 'PRIVATO · PRIMA IN LOCALE · I TUOI DATI, IL TUO CONTROLLO',
  questions: 'Due domande brevi e facoltative orientano ANITEW su ciò che vuoi conservare e sul tempo che hai.',
  driveKicker: 'OPZIONALE · CONSIGLIATO PER PIÙ DISPOSITIVI',
  driveCardTitle: 'I tuoi dati. Il tuo controllo.',
  driveCardBody:
    'Di default tutto resta su questo dispositivo. Per più dispositivi, accedi con Google e salva i tuoi dati ANITEW nel tuo Google Drive. ANITEW sincronizza poi tramite la tua cartella visibile «Anitew» — senza copia cloud ANITEW aggiuntiva.',
  driveConnect: 'Accedere / salvare in Google Drive',
  drivePreparing: 'Preparazione dell’accesso Google …',
  driveConnecting: 'Apertura dell’accesso Google …',
  driveConnected: 'Accesso eseguito. La sincronizzazione automatica è attiva',
  driveUnavailable: 'L’accesso Google non si è potuto preparare.',
  driveDenied: 'Accesso non completato. In locale ANITEW continua a funzionare per intero.',
  scroll: 'Scoprire di più',
  appearance: 'Aspetto',
  themes: { system: 'Sistema', light: 'Chiaro', dark: 'Scuro' },
  connectedAccount: 'Account Google connesso',
  guideContext: [
    'Nel Core stanno Coach, Memory DNA, i tuoi contenuti, palazzo della memoria, Google Drive, backup e impostazioni.',
    'I tuoi fatti, la materia e i ricordi personali ricevono collegamenti veri e ripassi pianificati.',
    'Il Coach legge quegli stessi segnali reali e ne trae indicazioni concrete.',
    'Palazzo della memoria, sistema Major, storie e collegamenti vengono insegnati e applicati.',
    'Più dispositivi: accedi con Google e salva nel tuo Google Drive. Senza accesso ANITEW resta del tutto locale.',
  ],
}

const REFINEMENT_PT: RefinementCopy = {
  close: 'Fechar o menu',
  welcomeTitle: 'Bem-vindo ao teu sistema de memória.',
  philosophy: 'Lembrar. Ligar. Guardar.',
  intro: 'A ANITEW treina nomes, números, matéria e memórias da tua vida real.',
  adaptive: 'Aprende com recuperações reais, ensina técnicas e adapta-se ao teu percurso.',
  different: 'Isto faz a ANITEW',
  capabilities: [
    {
      kind: 'adaptive',
      title: 'Treino adaptativo',
      body: 'Rever quando o teu percurso o pede.',
      badge: 'Recuperações reais',
    },
    {
      kind: 'technique',
      title: 'Técnicas de memória',
      body: 'Palácio, sistema Major, histórias, ligações.',
      badge: 'Aprender + aplicar',
    },
    {
      kind: 'world',
      title: 'Memory World',
      body: 'Nomes, matéria e memórias pessoais tornam-se treináveis.',
      badge: 'O teu conteúdo',
    },
    {
      kind: 'measure',
      title: 'Medição honesta',
      body: 'Treino e medição ficam separados de propósito.',
      badge: 'Sem pontuações de fantasia',
    },
    {
      kind: 'coach',
      title: 'Coach',
      body: 'Lê o teu percurso e transforma-o em indicações concretas.',
      badge: 'IA opcional',
    },
    {
      kind: 'privacy',
      title: 'Os teus dados. O teu controlo.',
      body: 'Local no teu aparelho — ou no teu próprio Google Drive.',
      badge: 'Private by design',
    },
  ],
  trust: 'PRIVADO · PRIMEIRO LOCAL · OS TEUS DADOS, O TEU CONTROLO',
  questions: 'Duas perguntas curtas e voluntárias orientam a ANITEW para o que queres guardar e o tempo que tens.',
  driveKicker: 'OPCIONAL · RECOMENDADO PARA VÁRIOS APARELHOS',
  driveCardTitle: 'Os teus dados. O teu controlo.',
  driveCardBody:
    'Por defeito tudo fica neste aparelho. Para vários aparelhos, inicia sessão com a Google e guarda os teus dados ANITEW no teu próprio Google Drive. A ANITEW sincroniza então pela tua pasta visível «Anitew» — sem cópia adicional na nuvem da ANITEW.',
  driveConnect: 'Iniciar sessão / guardar no Google Drive',
  drivePreparing: 'A preparar o início de sessão Google …',
  driveConnecting: 'A abrir o início de sessão Google …',
  driveConnected: 'Sessão iniciada. A sincronização automática está ativa',
  driveUnavailable: 'Não foi possível preparar o início de sessão Google.',
  driveDenied: 'Início de sessão não concluído. Em local, a ANITEW continua a funcionar por completo.',
  scroll: 'Descobrir mais',
  appearance: 'Aspeto',
  themes: { system: 'Sistema', light: 'Claro', dark: 'Escuro' },
  connectedAccount: 'Conta Google ligada',
  guideContext: [
    'No Core estão Coach, Memory DNA, os teus conteúdos, palácio da memória, Google Drive, cópia e definições.',
    'Os teus factos, matéria e memórias pessoais recebem ligações reais e revisões planeadas.',
    'O Coach lê esses mesmos sinais reais e transforma-os em indicações concretas.',
    'Palácio da memória, sistema Major, histórias e ligações são ensinados e aplicados.',
    'Vários aparelhos: inicia sessão com a Google e guarda no teu próprio Google Drive. Sem sessão, a ANITEW continua totalmente local.',
  ],
}

const FIRSTRUN_DE: FirstRunCopy = {
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

const FIRSTRUN_EN: FirstRunCopy = {
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

const FIRSTRUN_FR: FirstRunCopy = {
  slogan: 'Ramène ce qui doit rester.',
  philosophy: 'La mémoire est une technique, pas un don.',
  intro:
    'ANITEW n’est pas un jeu pour le cerveau. Il entraîne ta façon de garder noms, nombres, matière et choses de ta propre vie.',
  adaptive:
    'ANITEW adapte l’entraînement à ton comportement de mémoire réel – pas à des scores inventés.',
  different: 'Pourquoi ANITEW est différent',
  highlights: [
    {
      title: 'Il apprend ton schéma de mémoire.',
      body: 'Les retours sont planifiés à partir de vrais rappels – selon ce qui te revient et ce qui a encore besoin d’appui.',
    },
    {
      title: 'Il enseigne des techniques.',
      body: 'Palais de mémoire, système Major et liens sont expliqués puis appliqués – pas seulement testés.',
    },
    {
      title: 'Il entraîne ta vraie vie.',
      body: 'Tes faits, ta matière et tes souvenirs personnels peuvent rejoindre ta Memory World et son plan de révision.',
    },
    {
      title: 'Il mesure séparément de l’entraînement.',
      body: 'La pratique est la pratique. Une affirmation sur un changement ne vient que d’une mesure à part – ou pas du tout.',
    },
  ],
  trust: 'LOCAL FIRST · HORS LIGNE · SANS COMPTE OBLIGATOIRE',
  questions:
    'Choisis « C’est parti » et suivront deux courtes questions facultatives : ce que tu veux vraiment retenir et le temps que tu as d’habitude. Elles règlent ton point de départ. Tout reste sur cet appareil.',
  begin: 'C’est parti',
  direct: 'Commencer directement',
  guideLabel: 'Découvrir ANITEW',
  next: 'Suivant',
  done: 'Ouvrir ANITEW',
  skip: 'Passer l’introduction',
  lessonContinue: 'Continuer vers l’entraînement',
  tour: [
    {
      selector: '.hamburger',
      title: 'Le Core ANITEW',
      body: 'Ton accès à tout le système de mémoire. Pas un menu hamburger : le Core déploie Memory DNA, tes contenus, Coach, palais, sauvegarde et plus.',
    },
    {
      selector: '.today',
      title: 'Ta Memory World',
      body: 'Ici grandit ce que tu veux vraiment garder. Les nœuds et les liens sont de vrais souvenirs enregistrés – jamais de la décoration ni de l’activité inventée.',
    },
    {
      selector: '.memory-pulse',
      title: 'Memory Pulse',
      body: 'Ton système parle ici : ce qui revient, ce qui demande de l’attention et ce qui vient de naître. Uniquement à partir de tes vraies données.',
    },
    {
      selector: '.start',
      title: 'Ton portail d’entraînement',
      body: '60 secondes, 3, 5 ou 15 minutes : tu fixes le temps. ANITEW le remplit avec ce qui est utile maintenant selon ton parcours.',
    },
    {
      selector: '.hamburger',
      title: 'S’entraîner n’est pas mesurer',
      body: 'Memory DNA et l’entraînement montrent ta pratique. Une vraie mesure se présente à part, quand c’est son moment. ANITEW ne mélange pas les deux, exprès.',
    },
  ],
}

const FIRSTRUN_ES: FirstRunCopy = {
  slogan: 'Recupera lo que debe quedarse.',
  philosophy: 'La memoria es una técnica, no un talento.',
  intro:
    'ANITEW no es un juego mental. Entrena cómo conservas nombres, números, materia y cosas de tu propia vida.',
  adaptive:
    'ANITEW adapta el entrenamiento a tu comportamiento real de memoria – no a puntuaciones inventadas.',
  different: 'Por qué ANITEW es distinto',
  highlights: [
    {
      title: 'Aprende tu patrón de memoria.',
      body: 'Los reencuentros se planifican a partir de recuperaciones reales – según lo que te vuelve y lo que aún necesita apoyo.',
    },
    {
      title: 'Enseña técnicas.',
      body: 'Palacio de la memoria, sistema Major y vínculos se explican y luego se aplican – no solo se examinan.',
    },
    {
      title: 'Entrena tu vida real.',
      body: 'Tus hechos, materia y recuerdos personales pueden entrar en tu Memory World y su plan de repaso.',
    },
    {
      title: 'Mide separado del entrenamiento.',
      body: 'La práctica es práctica. Una afirmación sobre un cambio sale solo de una medición aparte – o de ninguna parte.',
    },
  ],
  trust: 'LOCAL FIRST · SIN CONEXIÓN · SIN CUENTA OBLIGATORIA',
  questions:
    'Si eliges «Vamos», siguen dos preguntas cortas y voluntarias: qué quieres conservar de verdad y cuánto tiempo sueles tener. Con eso ANITEW fija tu punto de partida. Todo se queda en este dispositivo.',
  begin: 'Vamos',
  direct: 'Empezar directamente',
  guideLabel: 'Conocer ANITEW',
  next: 'Siguiente',
  done: 'Abrir ANITEW',
  skip: 'Saltar la introducción',
  lessonContinue: 'Seguir al entrenamiento',
  tour: [
    {
      selector: '.hamburger',
      title: 'El Core de ANITEW',
      body: 'Tu acceso a todo el sistema de memoria. No es un menú hamburguesa: el Core despliega Memory DNA, tu contenido, Coach, palacio, copia y más.',
    },
    {
      selector: '.today',
      title: 'Tu Memory World',
      body: 'Aquí crece lo que de verdad quieres conservar. Nodos y conexiones son recuerdos reales guardados – nunca decoración ni actividad inventada.',
    },
    {
      selector: '.memory-pulse',
      title: 'Memory Pulse',
      body: 'Aquí habla tu sistema: qué vuelve, qué pide atención y qué acaba de nacer. Solo de tus datos reales.',
    },
    {
      selector: '.start',
      title: 'Tu portal de entrenamiento',
      body: '60 segundos, 3, 5 o 15 minutos: tú pones el tiempo. ANITEW lo llena con lo que tu recorrido dice que ahora es útil.',
    },
    {
      selector: '.hamburger',
      title: 'Entrenar no es medir',
      body: 'Memory DNA y el entrenamiento muestran tu práctica. Una medición real se presenta aparte, cuando toca. ANITEW no mezcla las dos cosas, a propósito.',
    },
  ],
}

const FIRSTRUN_IT: FirstRunCopy = {
  slogan: 'Riporta ciò che deve restare.',
  philosophy: 'La memoria è una tecnica, non un talento.',
  intro:
    'ANITEW non è un gioco per il cervello. Allena il modo in cui tieni nomi, numeri, materia e cose della tua vita.',
  adaptive:
    'ANITEW adatta l’allenamento al tuo comportamento reale di memoria – non a punteggi inventati.',
  different: 'Perché ANITEW è diverso',
  highlights: [
    {
      title: 'Impara il tuo schema di memoria.',
      body: 'I ritorni si pianificano da richiami veri – da ciò che ti torna e da ciò che ha ancora bisogno di appoggio.',
    },
    {
      title: 'Insegna tecniche.',
      body: 'Palazzo della memoria, sistema Major e collegamenti vengono spiegati e poi applicati – non solo testati.',
    },
    {
      title: 'Allena la tua vita vera.',
      body: 'I tuoi fatti, la materia e i ricordi personali possono entrare nella tua Memory World e nel suo piano di ripasso.',
    },
    {
      title: 'Misura separato dall’allenamento.',
      body: 'La pratica è pratica. Un’affermazione su un cambiamento viene solo da una misurazione a parte – o da nessuna parte.',
    },
  ],
  trust: 'LOCAL FIRST · OFFLINE · SENZA ACCOUNT OBBLIGATORIO',
  questions:
    'Se scegli «Si parte», seguono due domande brevi e facoltative: cosa vuoi conservare davvero e quanto tempo hai di solito. Con quelle ANITEW fissa il tuo punto di partenza. Tutto resta su questo dispositivo.',
  begin: 'Si parte',
  direct: 'Iniziare direttamente',
  guideLabel: 'Conoscere ANITEW',
  next: 'Avanti',
  done: 'Aprire ANITEW',
  skip: 'Saltare l’introduzione',
  lessonContinue: 'Continuare nell’allenamento',
  tour: [
    {
      selector: '.hamburger',
      title: 'Il Core di ANITEW',
      body: 'Il tuo accesso a tutto il sistema di memoria. Niente menu hamburger: il Core dispiega Memory DNA, i tuoi contenuti, Coach, palazzo, backup e altro.',
    },
    {
      selector: '.today',
      title: 'La tua Memory World',
      body: 'Qui cresce ciò che vuoi conservare davvero. Nodi e collegamenti sono ricordi veri salvati – mai decorazione o attività inventata.',
    },
    {
      selector: '.memory-pulse',
      title: 'Memory Pulse',
      body: 'Qui parla il tuo sistema: cosa torna, cosa chiede attenzione e cosa è appena nato. Solo dai tuoi dati veri.',
    },
    {
      selector: '.start',
      title: 'Il tuo portale di allenamento',
      body: '60 secondi, 3, 5 o 15 minuti: il tempo lo dai tu. ANITEW lo riempie con ciò che il tuo percorso dice utile adesso.',
    },
    {
      selector: '.hamburger',
      title: 'Allenare non è misurare',
      body: 'Memory DNA e allenamento mostrano la tua pratica. Una misurazione vera si presenta a parte, quando è il momento. ANITEW non mescola le due cose, di proposito.',
    },
  ],
}

const FIRSTRUN_PT: FirstRunCopy = {
  slogan: 'Traz de volta o que deve ficar.',
  philosophy: 'A memória é uma técnica, não um talento.',
  intro:
    'A ANITEW não é um jogo para o cérebro. Treina a forma como guardas nomes, números, matéria e coisas da tua própria vida.',
  adaptive:
    'A ANITEW adapta o treino ao teu comportamento real de memória – não a pontuações inventadas.',
  different: 'Porque é que a ANITEW é diferente',
  highlights: [
    {
      title: 'Aprende o teu padrão de memória.',
      body: 'Os reencontros planeiam-se a partir de recuperações reais – do que te volta e do que ainda precisa de apoio.',
    },
    {
      title: 'Ensina técnicas.',
      body: 'Palácio da memória, sistema Major e ligações são explicados e depois aplicados – não apenas testados.',
    },
    {
      title: 'Treina a tua vida real.',
      body: 'Os teus factos, matéria e memórias pessoais podem entrar na tua Memory World e no seu plano de revisão.',
    },
    {
      title: 'Mede separado do treino.',
      body: 'Prática é prática. Uma afirmação sobre mudança só sai de uma medição à parte – ou de lado nenhum.',
    },
  ],
  trust: 'LOCAL FIRST · OFFLINE · SEM CONTA OBRIGATÓRIA',
  questions:
    'Se escolheres «Vamos lá», seguem-se duas perguntas curtas e voluntárias: o que queres guardar de verdade e quanto tempo costumas ter. Com isso a ANITEW define o teu ponto de partida. Tudo fica neste aparelho.',
  begin: 'Vamos lá',
  direct: 'Começar diretamente',
  guideLabel: 'Conhecer a ANITEW',
  next: 'Seguinte',
  done: 'Abrir a ANITEW',
  skip: 'Saltar a introdução',
  lessonContinue: 'Continuar para o treino',
  tour: [
    {
      selector: '.hamburger',
      title: 'O Core da ANITEW',
      body: 'O teu acesso a todo o sistema de memória. Não é um menu hambúrguer: o Core desdobra Memory DNA, os teus conteúdos, Coach, palácio, cópia e mais.',
    },
    {
      selector: '.today',
      title: 'A tua Memory World',
      body: 'Aqui cresce o que queres mesmo guardar. Nós e ligações são memórias reais guardadas – nunca decoração nem atividade inventada.',
    },
    {
      selector: '.memory-pulse',
      title: 'Memory Pulse',
      body: 'Aqui fala o teu sistema: o que volta, o que pede atenção e o que acabou de nascer. Só dos teus dados reais.',
    },
    {
      selector: '.start',
      title: 'O teu portal de treino',
      body: '60 segundos, 3, 5 ou 15 minutos: o tempo é teu. A ANITEW enche-o com o que o teu percurso diz que agora é útil.',
    },
    {
      selector: '.hamburger',
      title: 'Treinar não é medir',
      body: 'Memory DNA e treino mostram a tua prática. Uma medição real apresenta-se à parte, quando é a sua vez. A ANITEW não mistura as duas coisas, de propósito.',
    },
  ],
}

const REFINEMENT: Readonly<Record<string, RefinementCopy>> = {
  de: REFINEMENT_DE,
  en: REFINEMENT_EN,
  fr: REFINEMENT_FR,
  es: REFINEMENT_ES,
  it: REFINEMENT_IT,
  pt: REFINEMENT_PT,
}

const FIRSTRUN: Readonly<Record<string, FirstRunCopy>> = {
  de: FIRSTRUN_DE,
  en: FIRSTRUN_EN,
  fr: FIRSTRUN_FR,
  es: FIRSTRUN_ES,
  it: FIRSTRUN_IT,
  pt: FIRSTRUN_PT,
}

function baseLanguage(tag: string): string {
  return tag.trim().toLowerCase().split('-')[0] ?? ''
}

/**
 * Auflösung über `<html lang>`, wie bisher in den Schichten — nur nicht mehr
 * binär. Unübersetzte Sprachen fallen wie die App selbst auf Englisch.
 */
export function refinementCopyFor(lang: string): RefinementCopy {
  return REFINEMENT[baseLanguage(lang)] ?? REFINEMENT_EN
}

export function firstRunCopyFor(lang: string): FirstRunCopy {
  return FIRSTRUN[baseLanguage(lang)] ?? FIRSTRUN_EN
}
