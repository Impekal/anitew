/**
 * Die Texte der Nebenbildschirme in allen sechs App-Sprachen
 * (Gerätebild 01.09.).
 *
 * Das Bild zeigte den Drive-Bildschirm auf Englisch, während die App auf
 * Französisch stand. Die Suche danach fand nicht eine solche Stelle, sondern
 * sechs — alle nach demselben Muster `startsWith('de') ? DE : EN`, alle aus
 * der Zeit mit zwei Sprachen. Hier liegen drei davon: Neuanfang, Support und
 * die Fehlerzeile der Erinnerung.
 *
 * Warum nicht im Wörterbuch: `de` und `en` liegen im Kaltstart-Bündel (P4).
 * Diese Sätze braucht nur, wer die jeweilige Seite öffnet — und alle drei
 * Seiten laden verzögert. Dasselbe Muster wie `brainCareCopy.ts`.
 */

export interface ResetCopy {
  heading: string
  scope: string
  cloud: string
  cloudNote: string
  keepCloud: string
  type: string
  cloudFailed: string
}

export interface SupportCopy {
  heading: string
  note: string
  build: string
  diagnostics: string
  metrics: string
  clear: string
  saved: string
  cleared: string
}

const RESET: Record<string, ResetCopy> = {
  de: {
    heading: 'Neu anfangen',
    scope:
      'Löscht Training, Erinnerungen, Messungen, Profil und Einstellungen auf diesem Gerät, trennt Google und startet ANITEW danach wie beim ersten Öffnen.',
    cloud: 'Auch die ANITEW-Sicherungsdatei in Google Drive löschen',
    cloudNote:
      'Der Ordner „Anitew“ bleibt bestehen; nur die von ANITEW angelegte Sicherungsdatei wird gelöscht. Andere Dateien in diesem Ordner fasst ANITEW nie an.',
    keepCloud:
      'Ohne diesen Haken bleibt die Drive-Sicherung erhalten und kann bei einer späteren Anmeldung wieder eingelesen werden.',
    type: 'Zur endgültigen Bestätigung ANITEW eingeben.',
    cloudFailed:
      'Die ANITEW-Sicherung in Google Drive konnte nicht gelöscht werden. Lokal wurde deshalb noch nichts gelöscht.',
  },
  en: {
    heading: 'Start over',
    scope:
      'Deletes training, memories, measurements, profile and settings on this device, disconnects Google and then starts ANITEW as on the first open.',
    cloud: 'Also delete the ANITEW backup file in Google Drive',
    cloudNote:
      'The “Anitew” folder stays; only the backup file ANITEW created is deleted. ANITEW never touches other files in that folder.',
    keepCloud:
      'Without this tick the Drive backup stays and can be read back on a later sign-in.',
    type: 'Type ANITEW to confirm permanently.',
    cloudFailed:
      'The ANITEW backup in Google Drive could not be deleted. Nothing was deleted locally.',
  },
  fr: {
    heading: 'Repartir de zéro',
    scope:
      'Supprime l’entraînement, les souvenirs, les mesures, le profil et les réglages sur cet appareil, déconnecte Google, puis relance ANITEW comme à la première ouverture.',
    cloud: 'Supprimer aussi le fichier de sauvegarde ANITEW dans Google Drive',
    cloudNote:
      'Le dossier « Anitew » reste ; seul le fichier de sauvegarde créé par ANITEW est supprimé. ANITEW ne touche jamais aux autres fichiers de ce dossier.',
    keepCloud:
      'Sans cette case, la sauvegarde Drive reste et pourra être relue lors d’une prochaine connexion.',
    type: 'Saisis ANITEW pour confirmer définitivement.',
    cloudFailed:
      'La sauvegarde ANITEW dans Google Drive n’a pas pu être supprimée. Rien n’a donc encore été supprimé en local.',
  },
  es: {
    heading: 'Empezar de cero',
    scope:
      'Borra entrenamiento, recuerdos, mediciones, perfil y ajustes en este dispositivo, desconecta Google y después inicia ANITEW como la primera vez.',
    cloud: 'Borrar también el archivo de copia de seguridad de ANITEW en Google Drive',
    cloudNote:
      'La carpeta «Anitew» se mantiene; solo se borra el archivo de copia que creó ANITEW. ANITEW nunca toca otros archivos de esa carpeta.',
    keepCloud:
      'Sin esta casilla, la copia en Drive se mantiene y podrá leerse de nuevo en un inicio de sesión posterior.',
    type: 'Escribe ANITEW para confirmar de forma definitiva.',
    cloudFailed:
      'No se pudo borrar la copia de ANITEW en Google Drive. Por eso todavía no se ha borrado nada en local.',
  },
  it: {
    heading: 'Ricominciare',
    scope:
      'Cancella allenamento, ricordi, misurazioni, profilo e impostazioni su questo dispositivo, scollega Google e poi avvia ANITEW come alla prima apertura.',
    cloud: 'Cancellare anche il file di backup ANITEW in Google Drive',
    cloudNote:
      'La cartella «Anitew» resta; viene cancellato solo il file di backup creato da ANITEW. ANITEW non tocca mai gli altri file in quella cartella.',
    keepCloud:
      'Senza questa spunta il backup su Drive resta e potrà essere riletto a un accesso successivo.',
    type: 'Scrivi ANITEW per confermare in modo definitivo.',
    cloudFailed:
      'Non è stato possibile cancellare il backup ANITEW in Google Drive. Per questo in locale non è stato ancora cancellato nulla.',
  },
  pt: {
    heading: 'Recomeçar',
    scope:
      'Apaga treino, memórias, medições, perfil e definições neste aparelho, desliga o Google e depois inicia a ANITEW como na primeira abertura.',
    cloud: 'Apagar também o ficheiro de cópia de segurança da ANITEW no Google Drive',
    cloudNote:
      'A pasta «Anitew» mantém-se; só é apagado o ficheiro de cópia criado pela ANITEW. A ANITEW nunca mexe nos outros ficheiros dessa pasta.',
    keepCloud:
      'Sem esta marca, a cópia no Drive mantém-se e pode ser lida de novo num início de sessão posterior.',
    type: 'Escreve ANITEW para confirmar definitivamente.',
    cloudFailed:
      'Não foi possível apagar a cópia da ANITEW no Google Drive. Por isso ainda não foi apagado nada em local.',
  },
}

const SUPPORT: Record<string, SupportCopy> = {
  de: {
    heading: 'Support & Beta',
    note:
      'Berichte werden nur auf diesem Gerät erzeugt und als Datei gespeichert. ANITEW sendet sie nicht automatisch. Diagnoseberichte enthalten keine Erinnerungstexte, Antworten, Fotos, API-Schlüssel oder OAuth-Tokens; der Beta-Bericht enthält nur aggregierte Zählwerte.',
    build: 'Installierte Fassung',
    diagnostics: 'Diagnosebericht speichern',
    metrics: 'Beta-Bericht speichern',
    clear: 'Lokales Fehlerprotokoll löschen',
    saved: 'Bericht gespeichert.',
    cleared: 'Lokales Fehlerprotokoll gelöscht.',
  },
  en: {
    heading: 'Support & beta',
    note:
      'Reports are created on this device only and saved as a file. ANITEW does not send them automatically. Diagnostic reports contain no memory texts, answers, photos, API keys or OAuth tokens; the beta report contains aggregated counts only.',
    build: 'Installed build',
    diagnostics: 'Save diagnostic report',
    metrics: 'Save beta report',
    clear: 'Clear local error log',
    saved: 'Report saved.',
    cleared: 'Local error log cleared.',
  },
  fr: {
    heading: 'Support & bêta',
    note:
      'Les rapports sont créés uniquement sur cet appareil et enregistrés comme fichier. ANITEW ne les envoie pas automatiquement. Les rapports de diagnostic ne contiennent ni textes de souvenirs, ni réponses, ni photos, ni clés d’API, ni jetons OAuth ; le rapport bêta ne contient que des décomptes agrégés.',
    build: 'Version installée',
    diagnostics: 'Enregistrer le rapport de diagnostic',
    metrics: 'Enregistrer le rapport bêta',
    clear: 'Effacer le journal d’erreurs local',
    saved: 'Rapport enregistré.',
    cleared: 'Journal d’erreurs local effacé.',
  },
  es: {
    heading: 'Soporte y beta',
    note:
      'Los informes se crean solo en este dispositivo y se guardan como archivo. ANITEW no los envía automáticamente. Los informes de diagnóstico no contienen textos de recuerdos, respuestas, fotos, claves de API ni tokens de OAuth; el informe beta solo contiene recuentos agregados.',
    build: 'Versión instalada',
    diagnostics: 'Guardar informe de diagnóstico',
    metrics: 'Guardar informe beta',
    clear: 'Borrar el registro de errores local',
    saved: 'Informe guardado.',
    cleared: 'Registro de errores local borrado.',
  },
  it: {
    heading: 'Supporto e beta',
    note:
      'I rapporti vengono creati solo su questo dispositivo e salvati come file. ANITEW non li invia automaticamente. I rapporti diagnostici non contengono testi dei ricordi, risposte, foto, chiavi API o token OAuth; il rapporto beta contiene solo conteggi aggregati.',
    build: 'Versione installata',
    diagnostics: 'Salva il rapporto diagnostico',
    metrics: 'Salva il rapporto beta',
    clear: 'Cancella il registro errori locale',
    saved: 'Rapporto salvato.',
    cleared: 'Registro errori locale cancellato.',
  },
  pt: {
    heading: 'Apoio e beta',
    note:
      'Os relatórios são criados apenas neste aparelho e guardados como ficheiro. A ANITEW não os envia automaticamente. Os relatórios de diagnóstico não contêm textos de memórias, respostas, fotos, chaves de API nem tokens OAuth; o relatório beta contém apenas contagens agregadas.',
    build: 'Versão instalada',
    diagnostics: 'Guardar relatório de diagnóstico',
    metrics: 'Guardar relatório beta',
    clear: 'Limpar o registo de erros local',
    saved: 'Relatório guardado.',
    cleared: 'Registo de erros local limpo.',
  },
}

const REMINDER_FAILED: Record<string, string> = {
  de: 'Konnte die Erinnerung nicht vollständig ändern. Bitte noch einmal versuchen.',
  en: 'Could not fully change the reminder. Please try again.',
  fr: 'Impossible de modifier complètement le rappel. Réessaie.',
  es: 'No se pudo cambiar del todo el recordatorio. Inténtalo otra vez.',
  it: 'Non è stato possibile modificare del tutto il promemoria. Riprova.',
  pt: 'Não foi possível alterar totalmente o lembrete. Tenta outra vez.',
}

function tag(language: string): string {
  return language.toLowerCase().slice(0, 2)
}

/** Deutsch ist die Quelle (D-007); alles Unbekannte fällt darauf zurück. */
export function resetCopyFor(language: string): ResetCopy {
  return RESET[tag(language)] ?? RESET.de!
}

export function supportCopyFor(language: string): SupportCopy {
  return SUPPORT[tag(language)] ?? SUPPORT.de!
}

export function reminderFailureFor(language: string): string {
  return REMINDER_FAILED[tag(language)] ?? REMINDER_FAILED.de!
}
