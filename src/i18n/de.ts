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
      missions: 'Eine Szene. Was gehört zu wem?',
    },
    recallHint: 'Was ist geblieben? Reihenfolge egal.',
    reviewHint: 'Und jetzt von früher: Woran erinnerst du dich noch?',
    promptHint: 'Wer ist das?',
    reviewPromptHint: 'Und von früher: Wer ist das?',
    promptPlaceholder: 'Name',
    /*
      Die Fragen einer Mission (H1).

      Jede nennt den Anker — „Elena“ steht mit im Bild —, denn ohne ihn ist
      „Welches Zimmer?“ nach drei Tagen keine beantwortbare Frage: Es gab
      inzwischen zwanzig Zimmer. Mit Anker ist es genau die Frage, die das
      Leben stellt.
    */
    // Vorspann für den Wiedersehensblock — dieselbe Anrede wie bei den
    // anderen Modulen.
    reviewLead: 'Und von früher:',
    missionAsk: {
      room: 'Welche Zimmernummer?',
      object: 'Was hatte sie oder er dabei?',
      time: 'Wann ging es los?',
      place: 'Wie hieß das Restaurant?',
    },
    missionPlaceholders: {
      room: 'Zimmer',
      object: 'Gegenstand',
      time: 'z. B. 18:40',
      place: 'Name',
    },
    recallPlaceholder: 'Ein Wort pro Zeile',
    recallNumbersPlaceholder: 'Eine Zahl pro Zeile',
    doneWithBlock: 'Fertig',
    abort: 'Abbrechen',
  },
  mission: {
    // Die Szene selbst. Kurze Zeilen, eine Tatsache je Zeile — eine Mission
    // ist kein Fließtext, den man liest, sondern ein Bild, das man ansieht.
    room: 'Zimmer',
    departure: 'Abfahrt',
    carrying: 'Dabei',
    restaurant: 'Restaurant',
  },
  technique: {
    /*
      D5 — die Technik wird beigebracht, nicht nur abgefragt. Das ist der
      Unterschied zu jeder Brain-Game-App, und deshalb steht hier Prosa und
      kein Etikett.
    */
    heading: 'Merktechnik',
    majorName: 'Das Major-System',
    // Nur beim allerersten Mal. Danach wäre es das Möbel aus G-2.
    intro: 'Ziffern sind schwer zu behalten, Bilder nicht. Jede Ziffer bekommt einen Laut — daraus wird ein Wort, und ein Wort merkt man sich.',
    // Der Satz nach der Lektion. Kein Lob (G-5), nur der nächste Schritt.
    ready: 'Ab jetzt steht sie unter den Zahlen.',
    // Die Brücke je Ziffer. Sie ist der eigentliche Inhalt der Lektion:
    // Ohne Bild ist die Zuordnung Willkür, und Willkür merkt sich niemand.
    hooks: {
      0: 'Die Null ist rund wie ein zischendes S — und „Zero“ beginnt mit Z.',
      1: 'Das kleine t hat einen Abstrich, genau wie die Eins.',
      2: 'Das kleine n hat zwei Abstriche.',
      3: 'Das kleine m hat drei Abstriche.',
      4: '„vieR“ endet auf r. Das ist die ganze Brücke.',
      5: 'Die römische Fünfzig ist ein L — und die offene Hand mit fünf Fingern bildet eines.',
      6: 'Ein gespiegeltes j ist eine Sechs. Dazu der weiche Zischlaut: sch, ch, j.',
      7: 'Zwei Siebenen aneinandergelegt ergeben ein K.',
      8: 'Das geschriebene f hat zwei Schlaufen — wie die Acht.',
      9: 'Die Neun gespiegelt ist ein p, gedreht ein b.',
    },
    // Steht unter der Zahl beim Einprägen, sobald die erste Ziffer sitzt.
    hint: 'Mach ein Wort daraus. Vokale sind frei.',
    progress: 'Ziffern gelernt',
    // Im Fußbereich nachzulesen — wer die Technik vertiefen will, soll nicht
    // auf die nächste Lektion warten müssen.
    note: 'Die Vokale zählen nicht mit, nur die Konsonanten. Aus 4–7 wird r–k, daraus „Rakete“ oder „Rock“ — welches Bild du nimmst, ist deine Sache. Selbst gebaute Bilder sitzen besser als vorgesetzte, deshalb liefert ANITEW keins.',
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
