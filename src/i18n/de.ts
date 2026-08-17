/**
 * Deutsch — die Quelle.
 *
 * D-007: Alle Texte entstehen hier und werden von hier übersetzt. Diese Datei
 * bestimmt zugleich die Form: `Dictionary` in `index.ts` wird aus ihr
 * abgeleitet, ein fehlender Schlüssel in einer Übersetzung ist deshalb ein
 * Übersetzungsfehler und kein leerer Text zur Laufzeit.
 */
export const de = {
  app: {
    name: 'ANITEW',
    tagline: 'Trainiere dein Gedächtnis. Miss deinen Fortschritt. Behalte mehr.',
  },
  language: {
    label: 'Sprache',
    // Endonyme: jede Sprache in ihrer eigenen Schreibweise. Wer die App auf
    // Türkisch sucht, sucht „Türkçe“ und nicht „Turkish“.
    names: {
      de: 'Deutsch',
      en: 'English',
      fr: 'Français',
      es: 'Español',
      it: 'Italiano',
      pt: 'Português',
      nl: 'Nederlands',
      tr: 'Türkçe',
      ar: 'العربية',
      zh: '中文',
      ja: '日本語',
    },
    incomplete: 'Noch nicht übersetzt — die App zeigt Englisch.',
  },
  start: {
    heading: 'Deine Challenge heute',
    start: 'Beginnen',
    modes: {
      emergency: 'Ich habe 60 Sekunden',
      short: 'Ich habe 3 Minuten',
      daily: 'Ich habe 5 Minuten',
      extended: 'Ich habe 15 Minuten',
    },
  },
  session: {
    round: 'Runde',
    encodeHint: 'Merke dir diese Wörter.',
    recallHint: 'Schreib auf, woran du dich erinnerst. Reihenfolge egal.',
    recallPlaceholder: 'Ein Wort pro Zeile',
    doneWithBlock: 'Fertig',
    abort: 'Abbrechen',
  },
  summary: {
    heading: 'Erinnert',
    // Bewusst keine Prozentzahl und kein „Memory Strength“ — die käme aus dem
    // Benchmark, und den gibt es noch nicht (D-006, Regel R-1).
    note: 'Wörter, die du nach dem Einprägen frei abrufen konntest. Was das über dein Gedächtnis insgesamt sagt, misst später der Benchmark — nicht diese Zahl.',
    perRound: 'Nach Runden',
    missed: 'gefehlt',
    back: 'Zurück',
  },
  resume: {
    heading: 'Eine Einheit läuft noch',
    body: 'Du warst mittendrin. Weitermachen, wo du aufgehört hast?',
    continue: 'Fortsetzen',
    discard: 'Verwerfen und neu beginnen',
  },
  check: {
    heading: 'Fundament',
    // Bewusst keine erfundenen Trainingszahlen (Regel R-1). Was hier steht,
    // ist gemessen — und verschwindet, sobald M1 den Platz braucht.
    note: 'Vorläufige Anzeige, solange noch kein Training läuft. Alle Werte sind gemessen, keiner ist ausgedacht.',
    storage: 'Speicher auf dem Gerät',
    storageOk: 'bereit',
    storageFail: 'nicht verfügbar',
    offline: 'Ohne Netz nutzbar',
    offlineOk: 'bereit',
    offlinePending: 'wird eingerichtet',
    offlineUnavailable: 'nur über HTTPS',
    installed: 'Als App gestartet',
    yes: 'ja',
    no: 'nein (im Browser)',
    today: 'Trainingstag',
    todayHint: 'Ein Tag beginnt um 4 Uhr morgens, nicht um Mitternacht.',
    firstSeen: 'Zum ersten Mal geöffnet',
    openCount: 'Bisher geöffnet',
    times: 'mal',
    version: 'Fassung',
  },
} as const
