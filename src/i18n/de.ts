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
    /*
      Je Modul ein eigener Satz, als Verzeichnis und nicht als Kette von
      Wenn-dann. Der Grund ist mechanisch: `TRAINING_MODULES` bestimmt die
      Schlüssel, die hier stehen müssen — wer ein Modul hinzufügt und den Satz
      vergisst, bekommt einen Übersetzungsfehler und keinen leeren Hinweis.
    */
    encodeHints: {
      words: 'Sieh hin. Ein Wort nach dem anderen.',
      faces: 'Gesicht und Name gehören zusammen. Merke dir beides.',
      numbers: 'Eine Zahl nach der anderen. Sprich sie innerlich mit.',
    },
    recallHint: 'Was ist geblieben? Reihenfolge egal.',
    reviewHint: 'Und jetzt von früher: Woran erinnerst du dich noch?',
    promptHint: 'Wer ist das?',
    reviewPromptHint: 'Und von früher: Wer ist das?',
    promptPlaceholder: 'Name',
    recallPlaceholder: 'Ein Wort pro Zeile',
    recallNumbersPlaceholder: 'Eine Zahl pro Zeile',
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
  backup: {
    heading: 'Sicherung',
    // Ohne Server ist die Datei der einzige Weg. Das wird gesagt, nicht
    // verschwiegen — und zwar bevor jemand seine Wochen verliert (N2, D-009).
    note: 'Alles liegt auf diesem Gerät und nirgends sonst. Wer den Browserspeicher löscht oder das Gerät wechselt, braucht diese Datei. Leg sie dorthin, wo du sie wiederfindest — in deine Cloud, in deine Mails, egal wohin.',
    save: 'Sicherung speichern',
    load: 'Sicherung einlesen',
    saved: 'Gespeichert:',
    records: 'Datensätze',
    // G-5: Die App schimpft nicht. Auch nicht, wenn die falsche Datei kommt.
    unreadable: 'Diese Datei lässt sich nicht lesen. Vielleicht war es eine andere?',
    foreign: 'Das ist keine ANITEW-Sicherung.',
    newer: 'Diese Sicherung stammt aus einer neueren Fassung von ANITEW. Aktualisiere die App, dann passt sie.',
    imported: 'Eingelesen:',
    added: 'neu dazu',
    kept: 'schon vorhanden',
    replaced: 'ergänzt',
    dropped: 'nicht lesbar',
    // Nichts geht verloren — das ist die Frage, die vor dem Antippen im Kopf
    // steht, also steht die Antwort daneben.
    merges: 'Vorhandenes bleibt. Zusammengeführt wird, nicht ersetzt.',
    failed: 'Das Einlesen ist nicht durchgelaufen. Es wurde nichts verändert.',
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
