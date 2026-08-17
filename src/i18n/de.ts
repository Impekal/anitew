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
  // Jeden Tag eine andere — Abwechslung ist die zweite Quelle von Vergnügen
  // (D-011/G-7). Kein Lob, keine Behauptung über den Nutzer, nur ein warmer
  // Satz vor dem Anfang.
  greetings: [
    'Fünf Minuten gehören dir.',
    'Schön, dass du da bist.',
    'Ein Wort nach dem anderen.',
    'Nimm dir den Moment.',
    'Heute ist ein guter Tag dafür.',
    'Kein Druck. Nur Übung.',
    'Fang einfach an.',
  ],
  start: {
    // Die Frage steht über den Knöpfen, nicht auf jedem einzelnen: „Ich habe
    // 15 Minuten“ bricht auf einem Telefon um, und vier umbrechende Knöpfe
    // sind vier Unruheherde (D-011/G-2).
    heading: 'Wie viel Zeit hast du?',
    start: 'Beginnen',
    modes: {
      emergency: '60 Sekunden',
      short: '3 Minuten',
      daily: '5 Minuten',
      extended: '15 Minuten',
    },
  },
  sound: {
    on: 'Ton an',
    off: 'Ton aus',
  },
  session: {
    settle: 'Ankommen',
    settleHint: 'Antippen, wenn du bereit bist',
    round: 'Runde',
    encodeHint: 'Sieh hin. Ein Wort nach dem anderen.',
    encodeFacesHint: 'Gesicht und Name gehören zusammen. Merke dir beides.',
    recallHint: 'Was ist geblieben? Reihenfolge egal.',
    reviewHint: 'Und jetzt von früher: Woran erinnerst du dich noch?',
    promptHint: 'Wer ist das?',
    reviewPromptHint: 'Und von früher: Wer ist das?',
    promptPlaceholder: 'Name',
    recallPlaceholder: 'Ein Wort pro Zeile',
    doneWithBlock: 'Fertig',
    abort: 'Abbrechen',
  },
  summary: {
    heading: 'Geblieben',
    // Bewusst keine Prozentzahl und kein „Memory Strength“ — die käme aus dem
    // Benchmark, und den gibt es noch nicht (D-006, Regel R-1, D-011/G-6).
    note: 'Wörter, die du nach dem Einprägen frei abrufen konntest. Was das über dein Gedächtnis insgesamt sagt, misst später der Benchmark — nicht diese Zahl.',
    // G-5: kein „falsch“, kein „verpasst“ — die Wörter waren einfach noch
    // nicht dabei.
    missed: 'Noch nicht dabei',
    fromBefore: 'Von früher',
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
