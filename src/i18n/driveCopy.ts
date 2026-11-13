/**
 * Die Texte des Drive-Bildschirms in allen sechs App-Sprachen
 * (Gerätebild 01.09.).
 *
 * Auf dem Bild steht die App auf Französisch und dieser Bildschirm auf
 * Englisch — zwei Sprachen übereinander. Die Ursache stand in
 * `SyncPanelImpl.tsx`: `startsWith('de') ? DRIVE_DE : DRIVE_EN`. Ein Muster
 * aus der Zeit, als die App zwei Sprachen sprach. Seit sie sechs spricht, ist
 * jede solche Verzweigung eine Insel.
 *
 * Warum die Texte hier stehen und nicht im Wörterbuch: `de` und `en` liegen
 * im Kaltstart-Bündel (P4). Vierzehn Sätze mal zwei Sprachen wären dort
 * unnötiges Gewicht — gebraucht werden sie nur, wenn jemand den
 * Drive-Bildschirm öffnet, und der lädt ohnehin verzögert. Dasselbe Muster
 * wie `brainCareCopy.ts` und `firstRunLayerCopy.ts`.
 *
 * R-3 gilt in jeder Sprache: wessen Konto, wessen Ordner, wer nichts sieht.
 * Und der Satz über die fremde Datei sagt überall ausdrücklich, dass sie
 * **nicht** angerührt wurde.
 */

export interface DriveCopy {
  intro: string
  how: string
  start: string
  again: string
  autoNote: string
  localNote: string
  stop: string
  firstTime: string
  remoteInvalid: string
  storage: string
  identity: string
  connected: string
  /** Nach der Rückkehr von Google, im Erstlauf-Blatt. */
  redirectConnected: string
  redirectFailed: string
  /**
   * Die Anmeldung gelang, das Drive-Kästchen blieb leer (Gerätebild 02.09.).
   *
   * Der Satz muss dreierlei leisten: die Anmeldung **nicht** beschuldigen —
   * sie hat funktioniert; sagen, was fehlt; und sagen, wie man es nachholt.
   * Googles eigene Beschriftung wird bewusst nicht zitiert: Sie ändert sich,
   * und ein falsch zitiertes Kästchen sucht man vergebens.
   */
  boxMissing: string
}

const COPY: Record<string, DriveCopy> = {
  de: {
    intro:
      'Deine Daten bleiben unter deiner Kontrolle. Standardmäßig speichert ANITEW lokal auf diesem Gerät. Für mehrere Geräte kannst du dich mit Google anmelden und deine ANITEW-Daten in deinem eigenen Google Drive speichern; ANITEW legt dort den sichtbaren Ordner „Anitew“ an — ohne zusätzliche ANITEW-Cloudkopie.',
    how: 'Beim Abgleich führt ANITEW deinen lokalen und deinen Drive-Stand sicher zusammen und schreibt das Ergebnis zurück in deinen eigenen Ordner.',
    start: 'Anmelden / Daten im Google Drive speichern',
    again: 'Jetzt mit Google Drive abgleichen',
    autoNote:
      'Automatischer Abgleich ist aktiv. ANITEW synchronisiert beim Öffnen und nach Änderungen still über dein eigenes Google Drive.',
    localNote:
      'Lokaler Modus: Training, Erinnerungen und Verlauf bleiben ausschließlich auf diesem Gerät.',
    stop: 'Google-Konto trennen · lokal weiter',
    firstTime:
      'Dein Ordner „Anitew“ wurde in Google Drive angelegt und der aktuelle Stand dort gespeichert.',
    remoteInvalid:
      'Im Ordner „Anitew“ liegt eine Datei, die keine gültige ANITEW-Sicherung ist. Sie wurde nicht verändert.',
    storage:
      'Der Abgleich selbst war erreichbar, aber ANITEW konnte den Verbindungszustand auf diesem Gerät nicht dauerhaft speichern. Die Anzeige wurde deshalb nicht umgeschaltet. Bitte versuche es noch einmal.',
    identity: 'Angemeldetes Google-Konto',
    connected: 'Google-Anmeldung abgeschlossen. Dein Konto ist jetzt verbunden.',
    redirectConnected: 'Angemeldet. Daten im eigenen Google Drive gespeichert',
    redirectFailed: 'Google-Anmeldung konnte nicht abgeschlossen werden.',
    boxMissing:
      'Die Anmeldung hat geklappt — aber die Freigabe für Google Drive wurde nicht erteilt. Google zeigt sie als eigenes Kästchen, das nicht vorausgewählt ist. Melde dich noch einmal an und setze dort den Haken. Bis dahin bleibt alles auf diesem Gerät; verloren geht nichts.',
  },
  en: {
    intro:
      'Your data stays under your control. ANITEW stores locally on this device by default. For multiple devices, sign in with Google and save your ANITEW data in your own Google Drive; ANITEW creates a visible “Anitew” folder there — without an additional ANITEW cloud copy.',
    how: 'Sync safely merges your local state with your Drive state and writes the result back into your own folder.',
    start: 'Sign in / save data in Google Drive',
    again: 'Sync with Google Drive now',
    autoNote:
      'Automatic sync is active. ANITEW quietly syncs on open and after changes through your own Google Drive.',
    localNote: 'Local mode: training, memories and history stay exclusively on this device.',
    stop: 'Sign out from Google · stay local',
    firstTime:
      'Your “Anitew” folder was created in Google Drive and the current state was stored there.',
    remoteInvalid:
      'The “Anitew” folder contains a file that is not a valid ANITEW backup. It was left untouched.',
    storage:
      'Sync was reachable, but ANITEW could not save the connection state permanently on this device. The display was therefore not switched. Please try again.',
    identity: 'Signed-in Google account',
    connected: 'Google sign-in completed. Your account is now connected.',
    redirectConnected: 'Signed in. Data saved in your own Google Drive',
    redirectFailed: 'Google sign-in could not be completed.',
    boxMissing:
      'Signing in worked — but permission for Google Drive was not granted. Google shows it as a separate box that is not ticked in advance. Sign in again and tick it. Until then everything stays on this device; nothing is lost.',
  },
  fr: {
    intro:
      'Tes données restent sous ton contrôle. Par défaut, ANITEW enregistre en local sur cet appareil. Pour plusieurs appareils, connecte-toi avec Google et enregistre tes données ANITEW dans ton propre Google Drive ; ANITEW y crée un dossier visible « Anitew » — sans copie cloud ANITEW supplémentaire.',
    how: 'La synchronisation réunit sans risque ton état local et ton état Drive, puis réécrit le résultat dans ton propre dossier.',
    start: 'Se connecter / enregistrer dans Google Drive',
    again: 'Synchroniser maintenant avec Google Drive',
    autoNote:
      'La synchronisation automatique est active. ANITEW synchronise discrètement à l’ouverture et après chaque changement, via ton propre Google Drive.',
    localNote:
      'Mode local : entraînement, souvenirs et historique restent exclusivement sur cet appareil.',
    stop: 'Déconnecter le compte Google · rester en local',
    firstTime:
      'Ton dossier « Anitew » a été créé dans Google Drive et l’état actuel y a été enregistré.',
    remoteInvalid:
      'Le dossier « Anitew » contient un fichier qui n’est pas une sauvegarde ANITEW valide. Il n’a pas été modifié.',
    storage:
      'La synchronisation était joignable, mais ANITEW n’a pas pu enregistrer durablement l’état de connexion sur cet appareil. L’affichage n’a donc pas été basculé. Réessaie.',
    identity: 'Compte Google connecté',
    connected: 'Connexion Google terminée. Ton compte est maintenant relié.',
    redirectConnected: 'Connecté. Données enregistrées dans ton propre Google Drive',
    redirectFailed: 'La connexion Google n’a pas pu être terminée.',
    boxMissing:
      'La connexion a réussi — mais l’autorisation pour Google Drive n’a pas été accordée. Google l’affiche dans une case distincte, non cochée par défaut. Reconnecte-toi et coche-la. En attendant, tout reste sur cet appareil ; rien n’est perdu.',
  },
  es: {
    intro:
      'Tus datos siguen bajo tu control. Por defecto, ANITEW guarda en local en este dispositivo. Para varios dispositivos, inicia sesión con Google y guarda tus datos de ANITEW en tu propio Google Drive; ANITEW crea allí una carpeta visible «Anitew» — sin copia adicional en la nube de ANITEW.',
    how: 'La sincronización une con seguridad tu estado local y el de Drive, y escribe el resultado de vuelta en tu propia carpeta.',
    start: 'Iniciar sesión / guardar datos en Google Drive',
    again: 'Sincronizar ahora con Google Drive',
    autoNote:
      'La sincronización automática está activa. ANITEW sincroniza en silencio al abrir y tras los cambios, a través de tu propio Google Drive.',
    localNote:
      'Modo local: entrenamiento, recuerdos e historial se quedan exclusivamente en este dispositivo.',
    stop: 'Desconectar la cuenta de Google · seguir en local',
    firstTime: 'Tu carpeta «Anitew» se creó en Google Drive y el estado actual se guardó allí.',
    remoteInvalid:
      'En la carpeta «Anitew» hay un archivo que no es una copia de seguridad válida de ANITEW. No se ha modificado.',
    storage:
      'La sincronización estaba disponible, pero ANITEW no pudo guardar de forma permanente el estado de conexión en este dispositivo. Por eso no se cambió la vista. Inténtalo otra vez.',
    identity: 'Cuenta de Google conectada',
    connected: 'Inicio de sesión con Google completado. Tu cuenta ya está conectada.',
    redirectConnected: 'Sesión iniciada. Datos guardados en tu propio Google Drive',
    redirectFailed: 'No se pudo completar el inicio de sesión con Google.',
    boxMissing:
      'El inicio de sesión funcionó, pero no se concedió el permiso para Google Drive. Google lo muestra en una casilla aparte que no viene marcada. Inicia sesión de nuevo y márcala. Hasta entonces todo permanece en este dispositivo; no se pierde nada.',
  },
  it: {
    intro:
      'I tuoi dati restano sotto il tuo controllo. Di norma ANITEW salva in locale su questo dispositivo. Per più dispositivi, accedi con Google e salva i tuoi dati ANITEW nel tuo Google Drive; ANITEW vi crea una cartella visibile «Anitew» — senza una copia cloud ANITEW aggiuntiva.',
    how: 'La sincronizzazione unisce in sicurezza il tuo stato locale e quello su Drive, e riscrive il risultato nella tua cartella.',
    start: 'Accedi / salva i dati in Google Drive',
    again: 'Sincronizza ora con Google Drive',
    autoNote:
      'La sincronizzazione automatica è attiva. ANITEW sincronizza in silenzio all’apertura e dopo le modifiche, tramite il tuo Google Drive.',
    localNote:
      'Modalità locale: allenamento, ricordi e cronologia restano solo su questo dispositivo.',
    stop: 'Scollega l’account Google · resta in locale',
    firstTime: 'La cartella «Anitew» è stata creata in Google Drive e lo stato attuale vi è stato salvato.',
    remoteInvalid:
      'Nella cartella «Anitew» c’è un file che non è un backup ANITEW valido. Non è stato modificato.',
    storage:
      'La sincronizzazione era raggiungibile, ma ANITEW non ha potuto salvare in modo duraturo lo stato del collegamento su questo dispositivo. Per questo la vista non è cambiata. Riprova.',
    identity: 'Account Google collegato',
    connected: 'Accesso con Google completato. Il tuo account ora è collegato.',
    redirectConnected: 'Accesso eseguito. Dati salvati nel tuo Google Drive',
    redirectFailed: 'Non è stato possibile completare l’accesso con Google.',
    boxMissing:
      'L’accesso è riuscito, ma l’autorizzazione per Google Drive non è stata concessa. Google la mostra in una casella separata che non è selezionata di default. Accedi di nuovo e selezionala. Fino ad allora tutto resta su questo dispositivo; non si perde nulla.',
  },
  pt: {
    intro:
      'Os teus dados ficam sob o teu controlo. Por norma, a ANITEW guarda localmente neste aparelho. Para vários aparelhos, inicia sessão com o Google e guarda os teus dados ANITEW no teu próprio Google Drive; a ANITEW cria aí uma pasta visível «Anitew» — sem cópia adicional na nuvem da ANITEW.',
    how: 'A sincronização junta com segurança o teu estado local e o do Drive, e escreve o resultado de volta na tua própria pasta.',
    start: 'Iniciar sessão / guardar dados no Google Drive',
    again: 'Sincronizar agora com o Google Drive',
    autoNote:
      'A sincronização automática está ativa. A ANITEW sincroniza em silêncio ao abrir e após alterações, através do teu próprio Google Drive.',
    localNote:
      'Modo local: treino, memórias e histórico ficam exclusivamente neste aparelho.',
    stop: 'Desligar a conta Google · continuar em local',
    firstTime: 'A tua pasta «Anitew» foi criada no Google Drive e o estado atual foi lá guardado.',
    remoteInvalid:
      'Na pasta «Anitew» está um ficheiro que não é uma cópia de segurança ANITEW válida. Não foi alterado.',
    storage:
      'A sincronização estava acessível, mas a ANITEW não conseguiu guardar de forma permanente o estado da ligação neste aparelho. Por isso a vista não mudou. Tenta outra vez.',
    identity: 'Conta Google com sessão iniciada',
    connected: 'Início de sessão com o Google concluído. A tua conta está agora ligada.',
    redirectConnected: 'Sessão iniciada. Dados guardados no teu próprio Google Drive',
    redirectFailed: 'Não foi possível concluir o início de sessão com o Google.',
    boxMissing:
      'O início de sessão funcionou, mas a autorização para o Google Drive não foi concedida. O Google mostra-a numa caixa separada que não vem marcada. Inicia sessão outra vez e marca-a. Até lá tudo fica neste dispositivo; nada se perde.',
  },
}

/** Deutsch ist die Quelle (D-007); alles Unbekannte fällt darauf zurück. */
export function driveCopyFor(language: string): DriveCopy {
  const tag = language.toLowerCase().slice(0, 2)
  return COPY[tag] ?? COPY.de!
}

/** Für die Stellen ohne Zugriff auf das Wörterbuch: die eingestellte Sprache. */
export function driveCopyForCurrentUi(): DriveCopy {
  return driveCopyFor(document.documentElement.lang)
}
