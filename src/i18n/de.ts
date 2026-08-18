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
    tagline: 'Gedächtnis ist Technik, kein Talent.',
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
    /*
      L7: Worin trainiert wird, ist nicht dasselbe wie worin die App spricht.

      Der Hinweis darunter ist der wichtige Teil: Ein Wechsel **verliert
      nichts**. „Anker“ und „anchor“ sind zwei Gedächtnisinhalte, und jeder
      behält seine eigenen Termine.
    */
    training: 'Trainingssprache',
    /*
      Der Satz stand hier zuerst anders: „Du kannst die App auf Deutsch
      bedienen und auf Englisch trainieren.“ Grammatisch hängt „die App“ auch
      am zweiten Verb — da stand also wörtlich **„die App trainieren“**, und
      genau so hat es jemand gelesen und gefragt, ob er die App anlernen muss.

      Er hat recht gehabt. In einer App, deren ganzer Punkt ist, dass nichts
      behauptet wird, was nicht stimmt, ist ein Satz, der sich falsch lesen
      lässt, ein Fehler — auch wenn er sich richtig lesen lässt.
    */
    trainingNote: 'Bedienung auf Deutsch, geübt wird mit englischen Wörtern — Gedächtnis und Sprache in einem. Ein Wechsel verliert nichts: „Anker“ und „anchor“ sind zwei Gedächtnisinhalte, jeder mit eigenen Terminen.',
    trainingOnly: 'Zur Auswahl steht, wofür es eigene Wörter, Namen und Szenen gibt. Eine Sprache anzubieten und dann englische Wörter zu zeigen wäre keine Trainingssprache.',
  },
  /*
    Jeden Tag ein anderer Satz — Abwechslung ist die zweite Quelle von
    Vergnügen (D-011/G-7).

    Die erste Fassung war Wellness: „Fünf Minuten gehören dir“, „Nimm dir den
    Moment“, „Schön, dass du da bist“. Freundlich und vollkommen austauschbar
    — dieselben Sätze stünden in jeder Meditations-App. Der Auftraggeber hat
    sie zu Recht abgelehnt.

    Was hier steht, sagt stattdessen **was die App tut und warum sie wirkt**:
    Abrufen statt Ansehen (C5), Technik statt Talent (D5), Wiederholung mit
    Abstand (D-004). Kurz, mit Kante, und jeder Satz für sich verständlich.

    Nach wie vor gilt R-1: kein Lob, keine Behauptung über den Nutzer und
    keine Zahl, die nicht gemessen ist. „Du wirst besser“ steht hier nicht —
    das sagt später der Benchmark oder niemand.
  */
  greetings: [
    'Merken ist eine Technik. Du lernst sie hier.',
    'Abrufen ist das Training. Nicht das Ansehen.',
    'Was du herausholst, bleibt.',
    'Namen vergisst man nicht. Man prägt sie nie ein.',
    'Aus Ziffern werden Bilder. Bilder bleiben.',
    'Kein Gehirnjogging. Training.',
    'Vergessen ist kein Defekt. Es ist planbar.',
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
      palace: 'Geh den Weg ab. Leg jedes Ding an seinen Platz — groß, im Weg, unübersehbar.',
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
  benchmark: {
    /*
      Die schwierigste Stelle im ganzen Projekt (D-006): Woher kommt die Zahl,
      wenn eine App sagt „Memory Strength +18 %“?

      Jeder Satz hier ist darauf geprüft, dass er nichts behauptet, was nicht
      gemessen wurde (R-1, F4). „Dein Gedächtnis ist besser geworden“ steht
      nirgends — die App sagt, was sie gezählt hat, und der Nutzer zieht den
      Schluss.
    */
    heading: 'Messung',
    // Der Aufruf auf dem Startbildschirm. Sachlich, kein Ausrufezeichen.
    invite: 'Zeit für eine Messung',
    inviteNote: 'Drei Minuten. Zwanzig Wörter, die im Training nie vorkommen — deshalb misst sie dein Gedächtnis und nicht deine Übung.',
    start: 'Messung beginnen',
    encodeHint: 'Zwanzig Wörter. Sieh sie an.',
    recallNow: 'Was ist geblieben?',
    recallAfter: 'Und jetzt, nach der Pause: was ist geblieben?',
    recallNextDay: 'Von gestern: was ist geblieben?',
    // Die Wartezeit ist Teil der Messung und keine Unterbrechung.
    waitingTitle: 'Die Messung läuft weiter',
    waitingSoon: 'In zwanzig Minuten fragt sie noch einmal. Bis dahin: alles wie sonst.',
    waitingTomorrow: 'Morgen fragt sie ein letztes Mal.',
    ready: 'Die Messung wartet auf dich',
    continue: 'Weiter',
    // G-5: kein Vorwurf. Es ist nur vorbei.
    missedTitle: 'Das Zeitfenster ist vorbei',
    missedNote: 'Eine Messung nach drei Stunden ist keine Messung nach zwanzig Minuten. Diese hier zählt deshalb nicht mit — die nächste beginnt von vorn.',
    discard: 'Verstanden',
    // Der Ausgang. Er muss da sein — eine Messung, aus der man nicht
    // herauskommt, wäre genau das Muster, das D-015 ausschließt.
    abort: 'Messung abbrechen',
    abortedTitle: 'Abgebrochen',
    abortedNote: 'Diese Messung zählt nicht mit. Die nächste nimmt andere Wörter — die hier hast du gesehen.',
    abortedAgain: 'Gemessen wurde noch nichts. Du kannst sofort neu anfangen.',
    // Der ehrlichste Satz an dieser Stelle: Er erklärt eine Einschränkung mit
    // dem Grund, aus dem es sie gibt, statt sie als Regel hinzustellen (R-1).
    abortedLater: 'Der erste Abruf steht schon in der Zeile. Die nächste Messung ist deshalb erst in vierzehn Tagen dran: Wer eine begonnene Messung wiederholen kann, bis das Gefühl dabei stimmt, misst nicht mehr sein Gedächtnis.',
    // Die Ergebnisanzeige.
    resultTitle: 'Gemessen',
    ofItems: 'von 20',
    phaseImmediate: 'sofort',
    phaseAfter: 'nach 20 Minuten',
    phaseNextDay: 'am Folgetag',
    calibrating: 'Eichung',
    calibratingNote: 'Auch eine Messung wird durch Gewöhnung an ihren Ablauf ein wenig besser. Die ersten beiden zählen deshalb als Eichung — eine Veränderung steht hier erst ab der dritten.',
    changeUp: 'Prozentpunkte mehr behalten als bei der Eichung',
    changeDown: 'Prozentpunkte weniger behalten als bei der Eichung',
    range: 'Spanne',
    // Der wichtigste Satz der ganzen App.
    tooClose: 'Kein Unterschied, der sich vom Zufall trennen lässt. Zwanzig Wörter sind eine kleine Stichprobe: Zwei Wörter mehr oder weniger sind schon zehn Prozentpunkte.',
    explain: 'Was hier gemessen wurde',
    explainNote: 'Zwanzig Wörter, die es sonst nirgends in der App gibt und die nie in den Wiederholungsplan wandern. Gezählt wird, wie viele davon am Folgetag noch da sind — verglichen mit dir selbst bei der Eichung, nie mit anderen. Was hier steht, ist gezählt. Über dein Gedächtnis im Alltag sagt es nichts, solange es niemand dort gemessen hat.',
    series: 'Die Reihe',
    cycles: 'Ab der {n}. Messung wiederholen sich die Wörter. Ein Wort, das man vor Monaten einmal drei Minuten lang gesehen hat, verfälscht wenig — aber es verfälscht.',
  },
  science: {
    /*
      Die Seite, die in dieser Branche fehlt (F6).

      Zwei Dinge macht sie zugleich: Sie erklärt, warum ANITEW so gebaut ist,
      wie es gebaut ist — und sie nennt die Stelle, an der das Wissen aufhört.
      Der zweite Teil ist der wichtigere. Wer nur die stützenden Studien
      zitiert, betreibt Werbung mit Fußnoten.

      Der Stand einer Aussage steht nicht hier, sondern in `core/science.ts`:
      Eine Übersetzung darf einen Satz umformulieren, aber aus „nicht belegt“
      nicht „umstritten“ machen.
    */
    heading: 'Was belegt ist',
    note: 'ANITEW steht auf ein paar Befunden, die seit Jahrzehnten halten — und lässt weg, was nur gut klingt. Beides steht hier, mit Quellen.',
    standings: {
      established: 'Gut belegt',
      narrow: 'Belegt, aber nur dafür',
      unsupported: 'Nicht belegt',
      unmeasured: 'Nicht gemessen',
    },
    standingNotes: {
      established: 'Vielfach wiederholt, in unabhängigen Arbeiten. Darauf ist die App gebaut.',
      narrow: 'Der Effekt ist da — er gilt aber für das, was geübt wurde, und nicht darüber hinaus.',
      unsupported: 'Wird von Gedächtnis-Apps regelmäßig behauptet und hält der Prüfung nicht stand. ANITEW behauptet es deshalb nicht.',
      unmeasured: 'Niemand hat es gemessen. Auch wir nicht.',
    },
    claims: {
      spacing: {
        title: 'Verteiltes Üben schlägt Blockübung',
        body: 'Derselbe Aufwand, über Tage verteilt, bringt deutlich mehr als am Stück. Deshalb plant ANITEW Wiederholungen, statt dich lange üben zu lassen.',
      },
      retrieval: {
        title: 'Abrufen lernt, Ansehen nicht',
        body: 'Etwas aus dem Kopf zu holen ist der Lernvorgang selbst — Wiederlesen fühlt sich besser an und bringt weniger. Deshalb fragt die App ab, statt vorzuzeigen.',
      },
      forgetting: {
        title: 'Vergessen verläuft vorhersagbar',
        body: 'Die Kurve ist alt und wurde 2015 sauber wiederholt. Vergessen ist kein Defekt, sondern der Grund, warum ein Termin überhaupt planbar ist.',
      },
      mnemonics: {
        title: 'Merktechniken heben die Leistung — in der geübten Aufgabe',
        body: 'Sechs Wochen Loci-Training verändern messbar, wie viele Wörter einer Liste jemand behält. Was daraus für Namen, Termine oder deinen Alltag folgt, ist damit **nicht** gezeigt. ANITEW bringt dir die Technik bei und behauptet über den Rest nichts.',
      },
      brainTraining: {
        title: 'Gehirnjogging macht nicht allgemein klüger',
        body: 'Große Untersuchungen finden dasselbe: Man wird besser in den Übungen und sonst nirgends. Ein Arbeitsgedächtnistraining hebt weder Intelligenz noch Alltagsleistung. ANITEW verspricht es deshalb nicht — und der Werbespruch heißt genau darum „Technik, kein Talent“.',
      },
      everyday: {
        title: 'Ob ANITEW deinem Alltag hilft',
        body: 'Dazu gibt es keine Studie, weil es diese App noch keine gibt. Was wir messen können, misst die Messung: wie viele von zwanzig Wörtern am Folgetag noch da sind. Alles darüber hinaus wäre geraten — und geraten wird hier nicht.',
      },
    },
    sources: 'Quellen',
    restsOn: 'Daran hängt in der App:',
    nothingRests: 'Darauf ist in der App nichts gebaut.',
  },
  palace: {
    /*
      Der Gedächtnispalast (G).

      Die Texte müssen hier mehr leisten als sonst: Bei den anderen Modulen
      versteht man in zwei Sekunden, was zu tun ist. Hier steht ein Weg mit
      fünf Orten da, und ohne die Technik dahinter ist das eine Liste mit
      Extraschritten. Deshalb die Lektion — und deshalb sind die Sätze
      Anweisungen und keine Beschreibungen.
    */
    heading: 'Der Gedächtnispalast',
    lessonIntro: 'Orte kannst du auswendig, ohne sie je geübt zu haben. Deine Wohnung, den Weg vor die Tür, den eigenen Körper. Genau daran hängen wir jetzt Dinge auf.',
    lessonSteps: [
      'Geh einen Weg ab, den du kennst — immer denselben, immer in derselben Richtung.',
      'An jeder Station liegt ein Ding. Sieh es dort liegen: zu groß, im Weg, absurd.',
      'Später gehst du den Weg noch einmal. Die Dinge liegen da, wo du sie hingelegt hast.',
    ],
    lessonBuild: 'Das Bild musst du bauen, nicht lesen. Ein Toaster im Flur ist nichts — ein Toaster, der im Flur den Weg versperrt und qualmt, bleibt.',
    lessonReady: 'Los geht’s.',
    walkLead: 'Dein Weg:',
    ask: 'Was lag hier?',
    placeholder: 'Gegenstand',
    names: {
      home: 'Deine Wohnung',
      street: 'Vor der Tür',
      body: 'Dein Körper',
    },
    stations: {
      door: 'Wohnungstür',
      hall: 'Flur',
      kitchen: 'Küche',
      sofa: 'Sofa',
      bed: 'Bett',
      gate: 'Gartentor',
      mailbox: 'Briefkasten',
      bench: 'Bank',
      crossing: 'Kreuzung',
      kiosk: 'Kiosk',
      head: 'Kopf',
      shoulder: 'Schulter',
      hand: 'Hand',
      knee: 'Knie',
      foot: 'Fuß',
    },
    // G3 ist da: Der Satz sagt jetzt, wo es weitergeht, statt eine Lücke
    // einzuräumen.
    ownNote: 'Drei fertige Wege raten, wie deine Wohnung aussieht. Einen eigenen legst du unten an — der trägt deutlich besser.',
    ownIntro: 'Fünf Orte auf einem Weg, den du blind gehen kannst. Immer dieselbe Richtung. Die Arbeit liegt nicht im Tippen, sondern im Überlegen.',
    ownName: 'Wie heißt der Weg?',
    ownNamePlaceholder: 'Meine Wohnung',
    ownStation: 'Station',
    ownStationPlaceholder: 'Ort',
    ownSave: 'Weg merken',
    ownDiscard: 'Weg verwerfen',
    ownSaved: 'Gemerkt. Er kommt ab jetzt im Training vor.',
    ownRule: 'Fünf Orte, alle verschieden, keiner leer — und ein Name für den Weg.',
  },
  returns: {
    /*
      Das Maß, das an die Stelle von XP tritt (K1, D-019).

      Der zweite Satz ist der wichtigste der ganzen Zeile: **„Gezählt, nicht
      vergeben.“** Er sagt in drei Wörtern, was diese App von jeder anderen
      unterscheidet, die eine große Zahl auf den Startbildschirm stellt.
    */
    one: 'Wiedersehen',
    many: 'Wiedersehen',
    note: 'So oft ist eine Information nach Tagen zurückgekommen. Gezählt, nicht vergeben.',
    tracked: 'in Pflege',
    // Der ehrlichste Rekord der App: Er lässt sich an keinem Nachmittag holen.
    longest: 'Am häufigsten zurückgeholt',
    times: 'mal',
  },
  profile: {
    /*
      Das Gedächtnisprofil (E · D-021).

      Die gefährlichste Anzeige der ganzen App: Sie sieht aus wie ein Befund
      über einen Menschen. Jeder Satz hier ist daraufhin geprüft, dass er
      sagt, **was gezählt wurde** — und dass „nicht gemessen“ nirgends wie
      „schlecht“ aussieht.
    */
    heading: 'Dein Profil',
    note: 'Gezählt wird nur das Wiedersehen: wie oft eine Information nach Tagen zurückkam und noch da war. Wie gut du am Lerntag selbst abschneidest, steht hier absichtlich nicht — das ist Übung, nicht Gedächtnis.',
    names: {
      words: 'Wörter',
      faces: 'Namen & Gesichter',
      numbers: 'Zahlen',
      spatial: 'Räumlich',
      binding: 'Zusammenhänge',
      visual: 'Visuell',
      attention: 'Aufmerksamkeit',
      working: 'Arbeitsgedächtnis',
      longTerm: 'Langfristiger Abruf',
    },
    of: 'von',
    kept: 'behalten',
    range: 'Spanne',
    // E7: Der Unterschied zwischen „zu wenig“ und „schlecht“ ist die ganze Regel.
    tooFew: 'Noch zu wenige Gelegenheiten für eine Aussage.',
    chancesSoFar: 'bisher',
    of15: 'von 15',
    notMeasured: 'Misst diese App nicht.',
    elsewhere: 'Das misst die Messung, nicht das Training.',
    weakest: 'Am wenigsten bleibt hier hängen:',
    /*
      E6: Die App erklärt ihre Entscheidung in einem Satz.

      Zwei Sätze, und der zweite ist der wichtigere: Er sagt, **woran** es
      hängt — und dass es sich ändert. Ein Schwerpunkt, der wie ein Urteil
      über einen Menschen klingt, wäre genau die Diagnose, die D-021
      ausschließt.
    */
    focus: 'Heute mit Schwerpunkt:',
    focusWhy: 'Von dem, was zurückkam, ist dort am wenigsten geblieben. Ändert sich, sobald sich die Zahlen ändern.',
    // E6/R-1: Wenn nur der Wunsch spricht, steht da der Wunsch — nicht eine
    // Messung, die es nie gab.
    focusWhyGoal: 'Weil du dir das vorgenommen hast. Sobald deine eigenen Zahlen etwas sagen, zählen die.',
    modules: {
      words: 'Wörter',
      faces: 'Gesichter',
      numbers: 'Zahlen',
      missions: 'Missionen',
      palace: 'Palast',
    },
    noWeakest: 'Kein Unterschied zwischen den Achsen, der sich vom Zufall trennen lässt.',
    empty: 'Noch nichts zu zeigen. Das Profil entsteht aus dem Training — nicht aus einem Test am Anfang.',
  },
  reminder: {
    /*
      Erinnerungen (B8 · D-022).

      Der heikelste Text der App nach der Messung: Hier wird etwas
      **zugesagt**, und das Web kann diese Zusage nicht halten. Also sagt sie
      genau das — vor der Einstellung und nicht als Fußnote danach. Eine App,
      die eine Erinnerung ankündigt und keine schickt, hat schlimmer gelogen,
      als wenn sie gar keine angeboten hätte (R-2).
    */
    heading: 'Erinnerung',
    note: 'Ohne Konto, ohne Server. Was hier eingestellt wird, bleibt auf dem Gerät.',
    // Die drei Fähigkeitsstufen, im Klartext.
    whileOpen: 'Auf diesem Gerät kann ANITEW nur erinnern, **solange es offen ist** — auch im Hintergrund, aber nicht nach dem Schließen. Eine feste Uhrzeit am nächsten Tag lässt sich im Browser nicht zusagen. Die Uhrzeit wird trotzdem gemerkt: Sie gilt, sobald ANITEW als App aus dem Store läuft.',
    scheduled: 'Erinnerungen kommen an, auch wenn ANITEW geschlossen ist.',
    none: 'Erinnerungen sind auf diesem Gerät nicht möglich.',
    denied: 'Benachrichtigungen sind für ANITEW abgelehnt. Das lässt sich nur in den Einstellungen des Browsers ändern — von hier aus geht es nicht.',
    ask: 'Benachrichtigungen erlauben',
    time: 'Uhrzeit',
    save: 'Erinnerung merken',
    off: 'Keine Erinnerung',
    saved: 'Gemerkt.',
    cleared: 'Aus.',
    // Der Text der Erinnerung selbst. Keine Drohung, keine Serie, kein
    // Ausrufezeichen (D-015): nur, dass jetzt die Zeit wäre.
    dailyTitle: 'ANITEW',
    dailyBody: 'Jetzt wären die fünf Minuten.',
    benchmarkTitle: 'Die Messung wartet',
    benchmarkBody: 'Zwanzig Minuten sind um. Was ist geblieben?',
  },
  privacy: {
    /*
      Datenschutz in der App (R4).

      Die lange Fassung steht in `docs/PRIVACY.md` und im Store-Eintrag; hier
      steht, was jemand wirklich wissen will, in fünf Zeilen. Der letzte
      Punkt ist der unbequeme — und er gehört genau deshalb dazu.
    */
    heading: 'Datenschutz',
    lead: 'ANITEW hat keinen Server.',
    points: [
      'Kein Konto, keine Anmeldung, keine Werbung, keine Tracker.',
      'Alles, was beim Training entsteht, bleibt auf diesem Gerät.',
      'Die Sicherung ist eine Datei, die du speicherst — wir laden sie nirgends hoch.',
      'Erinnerungen entstehen auf dem Gerät. Es gibt keinen Push-Dienst.',
      'Löschen heißt: Browserspeicher leeren oder die App entfernen. Danach ist es weg — auch für uns, denn wir hatten es nie.',
    ],
    honest: 'Was trotzdem passiert: Damit die App überhaupt auf dein Gerät kommt, wird sie einmal geladen. Der Anbieter, der sie ausliefert, sieht dabei das, was jeder Webserver sieht. Danach läuft ANITEW ohne Netz.',
  },
  install: {
    /*
      Der Hinweis auf iOS (Q5).

      **Keine Werbung für eine Installation, sondern eine Auskunft über eine
      Gefahr.** Safari räumt den Speicher einer Webseite auf, die sieben Tage
      lang nicht benutzt wurde — für eine App aus Terminen über Wochen ist
      das der Totalverlust. Vom Startbildschirm aus gilt das nicht.

      Deshalb steht der Grund vor der Anleitung. Ein „Installiere die App!“
      ohne Grund wäre die Aufforderung, die D-015 ausschließt.
    */
    heading: 'Auf den Startbildschirm',
    why: 'Im Browser räumt iOS den Speicher einer Seite auf, die sieben Tage lang nicht benutzt wurde — mit ihm deine Trainingsgeschichte. Vom Startbildschirm aus passiert das nicht.',
    steps: [
      'Unten in der Leiste auf das Teilen-Zeichen tippen.',
      '„Zum Home-Bildschirm“ wählen.',
      'ANITEW von dort starten.',
    ],
    // Der zweite Weg, und er gilt immer: Die Datei gehört dir.
    orBackup: 'Wer das nicht will, sollte regelmäßig eine Sicherung speichern. Die Datei liegt dann bei dir und überlebt jedes Aufräumen.',
  },
  storage: {
    /*
      Die ehrliche Zeile für den privaten Modus (P7).

      Ruhig, kein Ausrufezeichen, keine rote Warnung — aber deutlich, denn
      hier geht es um genau den stillen Verlust, gegen den die Sicherung
      gebaut ist (N2). Und mit einem Ausweg, nicht nur einer Diagnose.
    */
    note: 'Dieses Gerät speichert gerade nichts — vermutlich ein privates Fenster. Training läuft, aber beim Schließen ist alles weg. Für dauerhaften Fortschritt ein normales Fenster benutzen.',
  },
  achievements: {
    /*
      Erreichtes (K3 · D-019). Benannte Tatsachen, keine Ränge. Jede Zeile
      sagt, was war — im Ton wie die Serie: ohne Lob, ohne Zahl, die nicht
      gezählt ist. Was noch nicht ist, steht gar nicht da.
    */
    heading: 'Erreicht',
    facts: {
      firstReturn: 'Zum ersten Mal etwas nach Tagen zurückgeholt.',
      week: 'Eine Woche am Stück trainiert.',
      fortnight: 'Zwei Wochen am Stück trainiert.',
      hundredReturns: 'Hundert Mal etwas zurückgeholt.',
      heldOften: 'Dieselbe Sache fünfmal über die Zeit gehalten.',
      calibrated: 'Die Eichung der Messung abgeschlossen.',
      majorLearned: 'Alle zehn Ziffern des Major-Systems gelernt.',
      ownPalace: 'Einen eigenen Gedächtnispalast angelegt.',
    },
  },
  streak: {
    /*
      Die Serie sagt, was war — mehr nicht (K7). Keine Drohung, kein
      Countdown, keine Aufforderung. Wer heute nicht kann, soll die App
      schließen können, ohne ein schlechtes Gewissen mitzunehmen.
    */
    days: 'Tage in Folge',
    day: 'Tag in Folge',
    shields: 'Schutztage',
    shield: 'Schutztag',
    today: 'heute erledigt',
    best: 'Bestmarke',
    // Genau an dem Tag, an dem es zählt — und ohne Ausrufezeichen.
    held: 'Gestern war nichts. Ein Schutztag hat die Serie gehalten.',
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
    // B7: Weitermachen ist ein Angebot, kein Auftrag — ruhig, neben „Zurück“.
    again: 'Noch eine Runde',
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
    usage: 'Auf diesem Gerät belegt: etwa',
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
    wipe: 'Alles löschen',
    wipeNote: 'Löscht die ganze Trainingsgeschichte auf diesem Gerät — unwiderruflich. Vorher sichern, wenn du sie behalten willst.',
    wipeConfirm: 'Wirklich alles löschen? Das lässt sich nicht rückgängig machen.',
    wipeCancel: 'Abbrechen',
    wipeDone: 'Gelöscht. Wie am ersten Tag.',
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
  onboarding: {
    /*
      Das Ankommen (Onboarding).

      Fünf Fragen, alle freiwillig — und jede Antwort tut genau das, was ihr
      Begleitsatz sagt, nicht mehr. Kein Satz hier verspricht etwas über das
      Gedächtnis (R-1/R-2): Ein Ziel wird ein Vorschlag, ein Zeitbudget eine
      Voreinstellung, die Tageszeit ein Erinnerungs-Angebot, das Altersband
      gar nichts. Der Text sagt das offen, damit niemand mehr vermutet.
    */
    welcomeTitle: 'Schön, dass du da bist.',
    welcomeNote: 'Ein paar kurze Fragen, damit sich die App nach dir richtet. Alles ist freiwillig — was du nicht sagen willst, überspringst du.',
    begin: 'Los geht’s',
    skipAll: 'Ohne Fragen anfangen',
    skip: 'Überspringen',
    next: 'Weiter',
    nameQuestion: 'Wie dürfen wir dich nennen?',
    namePlaceholder: 'Dein Rufname',
    nameNote: 'Bleibt auf diesem Gerät, wie alles hier.',
    goalQuestion: 'Was willst du dir besser merken?',
    goals: {
      names: 'Namen & Gesichter',
      numbers: 'Zahlen & PINs',
      everyday: 'Alltag — Einkäufe, Termine, Wege',
      learning: 'Lernstoff & Vokabeln',
      fit: 'Einfach in Übung bleiben',
    },
    goalNote: 'Dein Ziel wird ein Schwerpunkt-Vorschlag. Sobald deine eigenen Zahlen etwas sagen, zählen die.',
    timeQuestion: 'Wie viel Zeit hast du an einem normalen Tag?',
    timeNote: 'Nur die Voreinstellung. Vor jeder Einheit wählst du neu.',
    dayQuestion: 'Wann passt Üben am besten in deinen Tag?',
    dayParts: {
      morning: 'Morgens',
      midday: 'Mittags',
      evening: 'Abends',
    },
    dayNote: 'Daraus wird nur ein Vorschlag für die Erinnerung — eingeschaltet wird sie erst, wenn du es tust.',
    ageQuestion: 'Wie alt bist du ungefähr?',
    ageBands: {
      under16: 'Unter 16',
      upTo29: '16 bis 29',
      upTo49: '30 bis 49',
      from50: '50 oder älter',
    },
    ageNote: 'Nur Kontext. Die Übungen bleiben für alle gleich — angepasst wird nach deinen Ergebnissen, nicht nach deinem Alter.',
    editHeading: 'Über dich',
    editNote: 'Deine Antworten vom Anfang. Ändern oder leeren — beides jederzeit.',
    hello: 'Hallo',
    unanswered: 'Nicht beantwortet',
  },
} as const
