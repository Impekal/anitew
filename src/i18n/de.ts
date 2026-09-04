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

      Die zweite Fassung behauptete dann eine feste Kombination („Bedienung
      auf Deutsch, geübt mit englischen Wörtern“) — und stand so auch da,
      wenn jemand längst auf Deutsch trainierte. Auf einem Bildschirmabzug
      gesehen. Der Satz beschreibt jetzt die Regel statt eines Beispiels,
      das meistens falsch ist.
    */
    trainingNote: 'Worin du trainierst, ist unabhängig davon, worin die App spricht. Ein Wechsel verliert nichts: „Anker“ und „anchor“ sind zwei Gedächtnisinhalte, jeder mit eigenen Terminen.',
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
    /*
     * Die Bereiche einzeln (Geraetewunsch 31.08.). `honest` ist die Zeile, die
     * verhindert, dass aus einem angenehmen Klang ein Wirkungsversprechen wird
     * (R-1): Die App misst keinen Konzentrationseffekt und behauptet keinen.
     */
    heading: 'Was klingt',
    feedback: 'Rückmeldung',
    feedbackNote: 'Die kurzen Töne beim Bedienen.',
    arrival: 'Ankommen',
    arrivalNote: 'Die Melodie der drei Sekunden vor der Einheit.',
    focus: 'Klang während der Einheit',
    focusNote: 'Ein sehr leiser Dauerklang beim Üben.',
    honest: 'Ob ein Dauerklang beim Merken hilft, ist von Mensch zu Mensch verschieden — manche brauchen Stille. Gemessen haben wir das nicht, deshalb behaupten wir es auch nicht.',
  },
  session: {
    settle: 'Ankommen',
    settleHint: 'Antippen, wenn du bereit bist',
    round: 'Runde',
    phases: {
      focus: 'FOCUS',
      encode: 'ENCODE',
      connect: 'CONNECT',
      retrieve: 'RETRIEVE',
      interfere: 'INTERFERE',
      return: 'RETURN',
    },
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
      // Wird nie gezeigt — Rückwärts fragt ohne Einprägephase (D7). Der
      // Schlüssel existiert, weil das Wörterbuch je Modul vollständig ist.
      reverse: 'Gleich rückwärts gefragt.',
      twins: 'Sieh genau hin — gleich steht ein Zwilling daneben.',
      gaze: 'Sieh das Bild an. Jedes Ding hat seine Farbe — merk dir beides zusammen.',
      facts: 'Deine Karte: Frage und Antwort. Bau eine Brücke — ein Bild, in dem beide vorkommen.',
      memory: 'Deine Erinnerung. Sieh alles zusammen — ein Bild, in dem alles am Anker hängt.',
      people: 'Ein Mensch, den viele kennen. Jahr, Fach, Herkunft — häng die drei an den Namen.',
    },
    recallHint: 'Was ist geblieben? Reihenfolge egal.',
    reviewHint: 'Und jetzt von früher: Woran erinnerst du dich noch?',
    promptHint: 'Wer ist das?',
    reviewPromptHint: 'Und von früher: Wer ist das?',
    promptPlaceholder: 'Name',
    /*
      Rückwärts (D7): Die Folge steht kurz da und verschwindet — die Frage
      muss deshalb VOR dem Verschwinden verstanden sein: kurz, imperativ,
      keine Nebensätze.
    */
    reverseAsk: 'Merk dir die Ziffern — gib sie rückwärts ein.',
    reversePlaceholder: 'Rückwärts',
    // Zwillinge (D-027): Die Frage steht über zwei Knöpfen — kurz, weil die
    // beiden Wörter selbst die ganze Frage sind.
    twinAsk: 'Welches stand da?',
    /*
      Bild (Achse „Visuell“): Die Frage nennt das Ding, das Bild in Tinte
      zeigt, WELCHES Bild gemeint ist — zwei gelernte Bilder können dasselbe
      Ding tragen, und ohne den Anker fragte die App ins Leere.
    */
    gazeAsk: '{object} — welche Farbe?',
    gazePlaceholder: 'Farbe',
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
    // Memory (D-036): Die Frage nennt den Anker — ohne ihn wäre „was
    // gehört dazu?“ nach Tagen keine beantwortbare Frage.
    memoryAsk: '{subject} — was gehört dazu?',
    memoryPlaceholder: 'Was dazugehört',
    peopleAsk: 'Welcher Jahrgang?',
    peoplePlaceholder: 'Geburtsjahr',
    recallPlaceholder: 'Ein Wort pro Zeile',
    recallNumbersPlaceholder: 'Eine Zahl pro Zeile',
    /*
     * Der Ziffernblock des Telefons hat keine Return-Taste (Gerätemeldung
     * 31.08.). „Eine Zahl pro Zeile“ verlangte damit etwas, das das Gerät
     * nicht hergibt — also gibt die App den Zeilenwechsel selbst.
     */
    recallNextNumber: 'Nächste Zahl',
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
    inviteNote: 'Drei Minuten. Zwanzig Wörter, die im Training nie vorkommen — gemessen wird, wie viele du davon behältst: getrennt von deiner Übung, ohne Behauptung über deinen Alltag.',
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
    calibrating: 'Eichung',
    calibratingNote: 'Auch eine Messung wird durch Gewöhnung an ihren Ablauf ein wenig besser. Die ersten beiden zählen deshalb als Eichung — eine Veränderung steht hier erst ab der dritten.',
    changeUp: 'Prozentpunkte mehr behalten als bei der Eichung',
    changeDown: 'Prozentpunkte weniger behalten als bei der Eichung',
    range: 'Spanne',
    // Der wichtigste Satz der ganzen App.
    tooClose: 'Der Unterschied liegt innerhalb der groben Zählunsicherheit dieser kleinen Stichprobe. Zwanzig Wörter: Zwei mehr oder weniger sind schon zehn Prozentpunkte — mehr sagt die Spanne nicht.',
    explain: 'Was hier gemessen wurde',
    explainNote: 'Zwanzig Wörter, die es sonst nirgends in der App gibt und die nie in den Wiederholungsplan wandern. Gezählt wird, wie viele davon am Folgetag noch da sind — verglichen mit dir selbst bei der Eichung, nie mit anderen. Was hier steht, ist gezählt. Über dein Gedächtnis im Alltag sagt es nichts, solange es niemand dort gemessen hat.',
    series: 'Die Reihe',
    cycles: 'Ab der {n}. Messung wiederholen sich die Wörter. Ein Wort, das man bei einer früheren Messung einmal drei Minuten lang gesehen hat, verfälscht wenig — aber es verfälscht.',
    /*
      Die Core-Seite „Messung“ (Runde 2, Nutzerwunsch): Ergebnisse und
      nächster Termin sind jetzt auffindbar, ohne dass die Messung selbst
      jederzeit startbar würde — der feste Abstand bleibt die Methode.
    */
    nextDueLine: 'Die nächste Messung ist ab dem {day} fällig. Früher geht absichtlich nicht — der feste Abstand gehört zur Methode.',
    runningNote: 'Eine Messung läuft gerade — der Startbildschirm führt dich weiter.',
    noneYet: 'Noch keine abgeschlossene Messung.',
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
      rewards: {
        title: 'Belohnungen können die eigene Motivation verdrängen',
        body: 'Deshalb gibt es hier keine Punkte, keine Level und nichts Freizuschalten. Der Befund ist gut untersucht — allerdings an Aufgaben im Labor, nicht an Apps: Dass eine App **ohne** Punkte besser wirkt, ist nirgends gezeigt, und ANITEW behauptet es nicht. Die Entscheidung ist eine Haltung, keine Ableitung: Wiederkommen soll sich lohnen, weil etwas bleibt — nicht, weil eine Zahl sonst kaputtgeht. Was stattdessen da ist, kommt aus deinen echten Zahlen: die Serie mit Schutztagen, die wachsende Memory World und die Messung.',
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
    footprintHeading: 'Trainierte Tage',
    footprintNote: 'Je Balken sieben Tage, ganz rechts die laufenden — zusammen {days} Trainingstage in acht Wochen. Das ist Übungsstand, keine Gedächtnismessung.',
    /*
      Das Gedächtnisprofil (E · D-021).

      Die gefährlichste Anzeige der ganzen App: Sie sieht aus wie ein Befund
      über einen Menschen. Jeder Satz hier ist daraufhin geprüft, dass er
      sagt, **was gezählt wurde** — und dass „nicht gemessen“ nirgends wie
      „schlecht“ aussieht.
    */
    heading: 'Memory DNA',
    sourceTraining: 'Quelle: Training · Wiedersehen',
    sourceImmediate: 'Quelle: Training · sofort',
    sourceBenchmark: 'Quelle: wissenschaftliche Messung',
    sourceNone: 'Quelle: noch keine Messung vorhanden',
    benchmarkChange: 'Veränderung über die Zählunsicherheit hinaus: Spanne {low} bis {high} Prozentpunkte.',
    benchmarkNoChange: 'Veränderung innerhalb der Zählunsicherheit (Spanne {low} bis {high}).',
    note: 'Gezählt wird nur das Wiedersehen: wie oft eine Information nach Tagen zurückkam und noch da war. Wie gut du am Lerntag selbst abschneidest, steht hier absichtlich nicht — das ist Übung, nicht Gedächtnis.',
    names: {
      words: 'Wörter',
      faces: 'Namen & Gesichter',
      numbers: 'Zahlen',
      spatial: 'Räumlich',
      binding: 'Zusammenhänge',
      visual: 'Visuell',
      /*
        Seit den Zwillingen (D-027) sagt der Name, was gezählt wird: nicht
        „Aufmerksamkeit“ im Lehrbuchsinn, sondern die Alltagsfähigkeit, zwei
        ähnliche Einträge nicht ineinanderlaufen zu lassen.
      */
      attention: 'Ähnliches auseinanderhalten',
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
    immediate: 'sofort, nicht nach Tagen',
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
    focusWhyDue: 'FSRS hat diese Inhalte für heute terminiert. Der Composer mischt sie in die verfügbare Zeit.',
    focusWhyPersonal: 'Eigene Inhalte ohne erstes Training bekommen heute zuerst eine abrufbare Verbindung.',
    focusWhyInterference: 'In den letzten Antworten lief Ähnliches mehrfach ineinander. Heute wird genau das getrennt.',
    focusWhyUndertrained: 'Diese Trainingsdimension hatte bisher die wenigsten echten Gelegenheiten.',
    modules: {
      words: 'Wörter',
      faces: 'Gesichter',
      numbers: 'Zahlen',
      missions: 'Missionen',
      palace: 'Palast',
      reverse: 'Rückwärts',
      twins: 'Unterscheiden',
      gaze: 'Bilder',
      facts: 'Eigenes',
      memory: 'Erinnerungen',
      people: 'Persönlichkeiten',
    },
    noWeakest: 'Kein Unterschied zwischen den Achsen, der über die Zählunsicherheit hinausgeht.',
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
    note: 'Kein Konto. Push speichert Geräteadresse, Zeit, Zeitzone und den generischen Text — keine Trainingsdaten.',
    // Die drei Fähigkeitsstufen, im Klartext.
    whileOpen: 'Auf diesem Gerät kann ANITEW nur erinnern, **solange es offen ist** — auch im Hintergrund, aber nicht nach dem Schließen. Eine feste Uhrzeit am nächsten Tag lässt sich im Browser nicht zusagen. Die Uhrzeit wird trotzdem gemerkt: Sie gilt, sobald ANITEW als App aus dem Store läuft.',
    scheduled: 'Erinnerungen kommen an, auch wenn ANITEW geschlossen ist.',
    none: 'Erinnerungen sind auf diesem Gerät nicht möglich.',
    denied: 'Benachrichtigungen sind für ANITEW abgelehnt. Das lässt sich nur in den Einstellungen des Browsers ändern — von hier aus geht es nicht.',
    ask: 'Benachrichtigungen erlauben',
    time: 'Uhrzeit',
    /*
      Wie die Uhrzeit einzugeben ist (Gerätemeldung 01.09.).

      Gemeldet wurde: „on peut pas mettre ‚:‘ pour separer l'heure, seuls les
      chiffres … et aucune indice“. Dass ein `input type="time"` nur Ziffern
      annimmt und den Doppelpunkt selbst setzt, ist richtig — nur stand es
      nirgends. Wer auf den Doppelpunkt wartet, bleibt bei einer halben
      Eingabe stehen, und der Merken-Knopf ist dann stumm abgeschaltet.
    */
    timeHint: 'Nur Ziffern: erst die Stunde, dann die Minuten. Den Doppelpunkt setzt das Feld selbst — 07:15 tippst du als 0715.',
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
    lead: 'ANITEW bleibt local-first.',
    points: [
      'Kein Konto bei uns, keine Werbung, keine Tracker.',
      'Alles, was beim Training entsteht, bleibt auf diesem Gerät — bis du selbst etwas anderes wählst: den Abgleich mit deinem eigenen Google Drive oder eine Coach-Frage mit eigenem Schlüssel. Beides ist aus, bis du es anfasst.',
      'Die Sicherung ist eine Datei, die du speicherst; der Abgleich legt dieselbe Datei in deinen eigenen Drive-App-Ordner. Zu uns fließt in beiden Fällen nichts.',
      'Für Push speichert ANITEW nur die technische Push-Adresse dieses Geräts, Fälligkeit, Zeitzone und den generischen Benachrichtigungstext. Keine Trainings- oder Gedächtnisinhalte.',
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
    /*
      Die Fähigkeiten des Baums (D-030): nur Überschriften über belegten
      Tatsachen, keine Äste zum Freischalten. Eine Fähigkeit ohne Tatsache
      taucht nicht auf.
    */
    domains: {
      practice: 'Dranbleiben',
      recall: 'Abruf',
      working: 'Arbeitsgedächtnis',
      distinguish: 'Unterscheiden',
      visual: 'Bilder',
      spatial: 'Räume',
      people: 'Menschen',
      measured: 'Gemessen',
    },
    facts: {
      firstReturn: 'Zum ersten Mal etwas nach Tagen zurückgeholt.',
      week: 'Eine Woche am Stück trainiert.',
      fortnight: 'Zwei Wochen am Stück trainiert.',
      hundredReturns: 'Hundert Mal etwas zurückgeholt.',
      heldOften: 'Dieselbe Sache fünfmal über die Zeit gehalten.',
      calibrated: 'Die Eichung der Messung abgeschlossen.',
      majorLearned: 'Alle zehn Ziffern des Major-Systems gelernt.',
      ownPalace: 'Einen eigenen Gedächtnispalast angelegt.',
      heldBackwards: 'Fünfzig Ziffernfolgen rückwärts wiedergegeben.',
      toldApart: 'Fünfundzwanzigmal Ähnliches nach Tagen auseinandergehalten.',
      sawDetails: 'Fünfundzwanzig Einzelheiten aus Bildern nach Tagen zurückgeholt.',
      namesHeld: 'Fünfundzwanzig Namen nach Tagen noch gewusst.',
    },
  },
  today: {
    /*
      Der Blick auf heute (V2): zwei Zeilen, beide aus echten Zahlen —
      die Wiedersehen zählt derselbe Wiederholungsplan, der sie auch
      holt, und der Satz zur schwächsten Erinnerung beschreibt den
      Mechanismus, keine Vorhersage (R-1).
    */
    heading: 'Heute',
    systemHeading: 'DEIN GEDÄCHTNISSYSTEM',
    numberRecord: 'Längste korrekt erinnerte Zahl: {digits} Ziffern.',
    missionHeading: 'Deine Mission heute',
    duration: '{duration} · angepasst an das, was jetzt ansteht',
    quietMission: 'Heute wartet noch nichts Altes — die Mission legt neue Spuren an.',
    dueMany: '{n} Wiedersehen sind heute fällig — die Einheit nimmt sich die dringendsten.',
    dueOne: 'Ein Wiedersehen ist heute fällig — die Einheit nimmt es mit.',
    dueNone: 'Kein Wiedersehen fällig — heute wächst Neues.',
    weakest: '„{label}“ steht am schwächsten — Missionen üben Schwaches zuerst.',
    invite: 'Neu: ANITEW kann sich echte Dinge aus deinem Leben merken — und sie mit dir trainieren.',
    inviteOpen: '„Mein Gedächtnis“ ansehen',
  },
  pulse: {
    heading: 'MEMORY PULSE',
    attention: '{count} eigene Erinnerungen brauchen heute Aufmerksamkeit.',
    practiced: '{count} Erinnerungen wurden in den letzten 24 Stunden trainiert.',
    newNodes: '{count} neue Erinnerungen sind heute in deinem System entstanden.',
    stale: '„{label}“ ist lange nicht aufgetaucht.',
    quiet: 'Dein System ist ruhig. Die nächste Mission legt neue Spuren an.',
  },
  memory: {
    /*
      Der Memory-Bereich (D-036). Der wichtigste Satz ist der über die
      Stärke: Sie ist ein **Übungsstand**, keine Gedächtnismessung — die
      Messung bleibt die einzige Quelle für Aussagen über das Gedächtnis
      (R-1). Und nichts wird gespeichert, was nicht bestätigt wurde.
    */
    heading: 'Mein Gedächtnis',
    intro: 'Was du behalten willst, wird hier ein Netz: Menschen, Orte, Fakten aus deinem Leben — verbunden, trainierbar, mit Wiedersehen nach Tagen.',
    counts: '{nodes} Erinnerungen · {edges} Verbindungen',
    empty: 'Noch ist hier nichts. Der erste Satz unten wird deine erste Erinnerung.',
    strongest: 'Am festesten',
    weakest: 'Braucht Zuwendung',
    latest: 'Zuletzt gemerkt',
    strengthNote: 'Die Stärke ist dein Übungsstand mit dieser Erinnerung — keine Messung deines Gedächtnisses. Die macht weiterhin nur die Messung.',
    trainNote: 'Trainiert wird im normalen Training: Die Runde zeigt den Anker mit allem, was dazugehört, fragt dann am Anker — und das Wiedersehen kommt nach Tagen über den Wiederholungsplan.',
    rememberHeading: 'Etwas merken',
    /*
     * Der zweite Satz des Marken-Slogans. Auf dem Splash stand er neben
     * „Train the memory you actually use." und versprach dort ein Ergebnis,
     * für das es keine Studie gibt. Hier ist er kein Versprechen mehr,
     * sondern eine Aufforderung an genau der Stelle, an der man sie befolgen
     * kann: über dem Feld, in das man schreibt, was einem wichtig ist.
     */
    rememberTagline: 'Behalte, was zählt.',
    rememberIntro: 'Schreib, was du behalten willst — ein Satz genügt. ANITEW schlägt vor, was daraus wird; gespeichert wird erst, was du bestätigst.',
    rememberPlaceholder: 'Daniel arbeitet im Museum, kommt aus Madrid und spielt Gitarre.',
    // Ein Platzhalter ist keine Beschriftung: Er verschwindet beim Tippen und
    // wird von Screenreadern nicht zuverlässig als Name des Feldes gelesen.
    rememberInputLabel: 'Was du behalten willst',
    suggest: 'Vorschläge ansehen',
    /*
      Der KI-Weg (D-037): ein Angebot neben dem eingebauten, kein
      Pflichtpfad. Der Hinweis sagt vor dem Fingertipp, wohin der Text
      geht (R-3) — und die Quelle der Vorschläge wird beim Prüfen genannt.
    */
    aiSuggest: 'Mit KI vorschlagen',
    aiNote: 'Dafür geht dein Text mit deinem Schlüssel direkt an {provider} — sonst nirgendwohin.',
    aiBusy: 'Die KI liest …',
    aiSource: 'Diese Vorschläge kommen von der KI. Prüfe sie — gespeichert wird nur, was du bestätigst.',
    suggestionsNodes: 'Das würden Erinnerungen — abwählen, was nicht stimmt:',
    suggestionsEdges: 'Und das ihre Verbindungen:',
    nothingFound: 'Daraus ließ sich nichts machen — ein anderer Satz?',
    confirm: 'Bestätigen und merken',
    cancel: 'Verwerfen',
    saved: 'Gemerkt. Die nächste Einheit nimmt die schwächsten zuerst.',
    // F-10 (Runde 2): Ein fehlgeschlagener Speichervorgang wird gesagt, die
    // Eingabe bleibt stehen — kein stilles Nichts nach „Bestätigen“.
    saveFailed: 'Konnte auf diesem Gerät nicht speichern — nichts wurde übernommen. Deine Eingabe steht noch da: versuch es gleich noch einmal.',
    types: {
      person: 'Person',
      place: 'Ort',
      fact: 'Fakt',
      number: 'Zahl',
      date: 'Datum',
      concept: 'Begriff',
      custom: 'Eigenes',
    },
    remove: 'Entfernen',
    exclude: '{label} nicht übernehmen',
    include: '{label} wieder übernehmen',
    editLabel: 'Beschriftung {label} bearbeiten',
    removeConnection: 'Verbindung entfernen',
    select: 'Erinnerung {label} öffnen',
    constellationLabel: 'Deine Erinnerungen und ihre Verbindungen',
    connected: 'Verbunden mit',
    lastRecalled: 'Zuletzt abgerufen',
    nextReview: 'Wiedersehen',
    none: 'Noch keine Verbindung',
    notYet: 'Noch nicht abgerufen',
    dueSoon: 'Jetzt im FSRS-Wiederholungsplan fällig',
    fsrsScheduled: 'FSRS plant den nächsten passenden Zeitpunkt',
    close: 'Detail schließen',
    clusters: 'Erinnerungswelten',
    allClusters: 'Gesamte Welt',
    chooseCluster: 'Weitere Erinnerungswelt wählen',
  },
  own: {
    /*
      Eigene Inhalte (I · D-032). Die Erklärung sagt die Form („eine Zeile,
      ein Paar“), die Vorschau zeigt, was daraus würde — übernommen wird
      erst auf Fingertipp (I4: halbautomatisch, der Mensch bestätigt).
      Nicht Erkanntes steht sichtbar da, statt zu verschwinden.
    */
    heading: 'Eigene Inhalte',
    intro: 'Eigener Stoff wird zu Karten: eine Zeile, ein Paar aus Frage und Antwort — getrennt durch „–“, Doppelpunkt oder Tabulator. Die Karten gehen denselben Weg wie alles hier: einprägen, abrufen, Wiedersehen nach Tagen. Alles bleibt auf diesem Gerät.',
    placeholder: 'Hauptstadt von Portugal – Lissabon\nfr: die Ampel – le feu\nNotrufnummer: 112',
    inputLabel: 'Dein Stoff, Zeile für Zeile',
    preview: 'Das würden Karten:',
    rejected: 'Keine Karte (keine Trennung erkannt):',
    save: 'Karten übernehmen',
    listHeading: 'Deine Karten',
    remove: 'Entfernen',
    empty: 'Noch keine Karten. Was du oben einfügst, landet hier — und von hier im Training.',
    scheduled: 'im Wiederholungsplan',
    fresh: 'kommt in die nächste Einheit',
  },
  sync: {
    /*
      Der Drive-Abgleich (N7/N8/N10 · D-033). Jeder Satz hier trägt R-3:
      wessen Konto, wessen Ordner, wer nichts sieht. Und der Fehlerfall
      „fremde Datei“ sagt ausdrücklich, dass nichts angerührt wurde —
      ein Abgleich, der bei Zweifel löscht, wäre keiner.
    */
    heading: 'Synchronisieren / Abmelden',
    intro: 'Deine Daten wandern in einen App-Ordner in deinem eigenen Google Drive — dieselbe Datei wie die Sicherung. Kein Konto bei uns, keine ANITEW-Datenbank dazwischen: Die Inhalte laufen direkt zwischen diesem Gerät und Google; nur die Google-Anmeldung geht über ANITEWs kleinen Anmelde-Endpunkt, der nichts davon speichert. Im Drive sieht die App nur ihren eigenen Ordner.',
    how: 'Abgleichen heißt: Erst wird geholt, was dort liegt, und nach den Regeln der Sicherung eingemischt — nichts wird gelöscht. Dann wird der vereinigte Stand hochgelegt. Zwei Geräte, die getrennt liefen, haben danach beide alles.',
    start: 'Mit Google anmelden und abgleichen',
    again: 'Jetzt abgleichen',
    autoNote: 'Nach dem ersten Abgleich versucht die App ihn beim Öffnen still zu wiederholen. Verlangt Google eine neue Anmeldung, wartet der Abgleich einfach auf den nächsten Fingertipp hier.',
    stop: 'Nicht mehr automatisch abgleichen',
    running: 'Gleicht ab …',
    pulledSome: '{n} Datensätze kamen neu auf dieses Gerät. Der vereinigte Stand liegt jetzt in deinem Drive.',
    pulledNone: 'Von dort kam nichts Neues. Der aktuelle Stand liegt jetzt in deinem Drive.',
    firstTime: 'Im Drive lag noch nichts — deine Sicherung liegt jetzt dort.',
    lastAt: 'Zuletzt abgeglichen:',
    account: 'Verbunden als {account}.',
    errors: {
      denied: 'Die Anmeldung kam nicht zustande. Beim nächsten Versuch fragt Google erneut.',
      /*
        Der Fall vom Geraetebild 01.09.: Anmeldung erfolgreich, Drive lehnt ab.
        Frueher stand hier `denied` — „die Anmeldung kam nicht zustande, beim
        naechsten Versuch fragt Google erneut“. Das schickte im Kreis.
      */
      blocked: 'Google Drive hat diese Anfrage abgelehnt. Die Anmeldung selbst hat geklappt — noch einmal anmelden hilft hier nicht. Was Google als Grund nennt, steht dahinter.',
      offline: 'Keine Verbindung zu Google. Später noch einmal — trainieren geht ohne.',
      drive: 'Google Drive hat nicht geantwortet, wie es sollte. Später noch einmal.',
      'remote-invalid': 'Im App-Ordner liegt eine Datei, die keine ANITEW-Sicherung ist. Sie wurde nicht angerührt. Bitte sieh sie dir an, bevor wieder abgeglichen wird.',
    },
    notConfigured: 'Der Abgleich ist in dieser Installation noch nicht eingerichtet — es fehlt ihre Google-Kennung. Sicherung und Training sind davon unberührt.',
  },
  /*
    Nur die Überschrift steht hier — die Sätze des Lernbereichs liegen in
    `learnCopy.ts` und werden erst geladen, wenn jemand ihn öffnet. Diese
    eine Zeile braucht die Schublade, und die gehört zum Kaltstart.
  */
  learn: { heading: 'Lernen' },

  coach: {
    /*
      Der Coach (M · D-031). Zwei Hälften, eine Haltung: Der obere Teil
      sagt nur, was die eigenen Zahlen hergeben (R-1), der untere braucht
      den eigenen Schlüssel — und jeder Satz dazu sagt ehrlich, wohin der
      Schlüssel geht und wohin nicht (R-3).
    */
    heading: 'Coach',
    adviceHeading: 'Aus deinen Zahlen',
    advice: {
      focusWeakest: 'Von dem, was zurückkam, blieb bei „{axis}“ am wenigsten. Wenn du magst, gib diesem Bereich in nächster Zeit den Vortritt — der Schwerpunkt schlägt ihn ohnehin vor.',
      smallerRounds: 'Bei „{module}“ sind die Runden gerade ein Stück kleiner eingestellt. Das ist keine Note: Kleinere Runden halten die Quote im Korridor, in dem Behalten am besten wächst.',
      largerRounds: 'Bei „{module}“ trägst du gerade mehr je Runde — deine letzten Antworten geben das her.',
      benchmarkDue: 'Die nächste Messung ist fällig. Sie ist die einzige Quelle für den langfristigen Abruf — aus dem Training allein lässt er sich nicht ablesen.',
      firstSteps: 'Noch geben deine Zahlen keinen Rat her. Ein paar Einheiten, und hier steht, was sich daraus ablesen lässt — nicht mehr und nicht weniger.',
    },
    askHeading: 'Freie Fragen',
    /*
      R-3 in einem Absatz: wo der Schlüssel liegt, wohin er geht, was es
      kostet. Vor der Eingabe, nicht als Fußnote danach (D-015). Seit
      D-034 stehen fünf Anbieter zur Wahl — je mit dem Direktlink zur
      Schlüssel-Seite und dem ehrlichen Satz zu Kosten oder Grenzen.
    */
    keyNote: 'Mit einem eigenen Schlüssel eines KI-Anbieters kannst du dem Coach freie Fragen stellen. Der Schlüssel bleibt auf diesem Gerät und geht mit jeder Frage nur an den gewählten Anbieter — einen Server dazwischen gibt es nicht. Kosten oder Grenzen regelt dein Konto dort.',
    providerLabel: 'Anbieter',
    providers: {
      gemini: 'Google Gemini — empfohlen',
      anthropic: 'Anthropic (Claude)',
      groq: 'Groq',
      openrouter: 'OpenRouter',
      mistral: 'Mistral',
    },
    keySteps: {
      gemini: 'Mit deinem Google-Konto bei Google AI Studio anmelden, dort „Create API key“ tippen, den Schlüssel kopieren und unten einfügen. Kostenlos mit großzügigen Tagesgrenzen — darum die Empfehlung.',
      anthropic: 'In der Anthropic-Konsole anmelden und unter „API keys“ einen Schlüssel anlegen, kopieren, unten einfügen. Braucht hinterlegtes Guthaben; jede Frage kostet wenige Cent.',
      groq: 'Bei Groq anmelden, unter „API Keys“ einen Schlüssel anlegen, kopieren, unten einfügen. Kostenlos mit Tagesgrenzen.',
      openrouter: 'Bei OpenRouter anmelden, unter „Keys“ einen Schlüssel anlegen, kopieren, unten einfügen. Ein Schlüssel für viele Modelle; kleines Guthaben nötig.',
      mistral: 'In der Mistral-Konsole anmelden und unter „API keys“ einen Schlüssel anlegen, kopieren, unten einfügen. Braucht ein Konto auf „La Plateforme“ (eine kostenlose Stufe gibt es).',
    },
    keyLink: 'Schlüssel-Seite öffnen',
    keyPlaceholder: 'Schlüssel hier einfügen',
    keyFieldLabel: 'Dein Schlüssel',
    keySave: 'Schlüssel speichern',
    keyRemove: 'Schlüssel entfernen',
    keyPresent: 'Ein Schlüssel ist hinterlegt.',
    askPlaceholder: 'Deine Frage an den Coach …',
    askButton: 'Fragen',
    thinking: 'Der Coach überlegt …',
    /*
      Jeder Fehlerfall sagt, was der Mensch tun kann — und dass die
      Hinweise oben ohne Netz und Schlüssel weiterlaufen.
    */
    errors: {
      'no-key': 'Ohne Schlüssel keine freien Fragen. Die Hinweise oben kommen ohne aus.',
      'bad-key': 'Der Schlüssel wurde nicht angenommen. Prüfe ihn beim Anbieter — oder entferne ihn hier.',
      // 403 ist kein Schlüsselproblem: Der Schlüssel gilt, darf das aber nicht.
      forbidden: 'Der Anbieter lehnt die Anfrage trotz gültigem Schlüssel ab — meist fehlt dem Konto dort eine Berechtigung für das Modell. Das regelst du beim Anbieter, nicht hier.',
      limited: 'Der Anbieter bremst gerade (Rate- oder Kontingentgrenze). Kurz warten und noch einmal — der Schlüssel ist in Ordnung.',
      offline: 'Keine Verbindung zum Anbieter. Später noch einmal — die Hinweise oben funktionieren ohne Netz.',
      refused: 'Auf diese Frage antwortet das Modell nicht. Anders gestellt klappt es oft.',
      failed: 'Die Antwort kam nicht an. Später noch einmal.',
    },
    // F-02 (Runde 2): Ein fehlgeschlagener Einstellungs-Schreibvorgang wird
    // gesagt — die Anzeige bleibt bei dem, was wirklich gespeichert ist.
    saveFailed: 'Konnte auf diesem Gerät nicht speichern. Es gilt weiterhin die vorherige Einstellung.',
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

      Drei kurze Schritte im Hauptpfad: Versprechen, erste echte Erinnerung,
      Zeitbudget. Alles freiwillig; keine Aussage über IQ oder allgemeine
      Gehirnleistung (R-1/R-2).
    */
    welcomeTitle: 'Dein Gedächtnis, trainiert.',
    welcomeNote: 'ANITEW trainiert Abruf statt IQ. Fünf Minuten reichen. Es lernt aus echten Antworten, nimmt auf Wunsch eigene Informationen auf und trennt Übung immer von ehrlicher Messung.',
    promise: 'ERINNERN · NICHT IQ · LOCAL FIRST',
    memoryQuestion: 'Was möchtest du wirklich behalten?',
    memoryPlaceholder: 'Daniel arbeitet im Museum, kommt aus Madrid und spielt Gitarre.',
    memoryNote: 'Daraus entstehen auf diesem Gerät deine ersten Erinnerungen und Verbindungen. Erst dein Tipp auf „Behalten“ speichert sie.',
    keepMemory: 'Als erste Erinnerung behalten',
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
  menu: {
    /*
      Das Menü (D-011 im Rückblick): Die Fächer lagen als blasse Zeilen am
      Fuß — ruhig, aber so unauffällig, dass niemand sie fand. Jetzt ein
      Menüknopf oben und **eine Seite je Punkt**: Das ist dieselbe Regel wie
      im Training — ein Ding pro Bildschirm —, nur auf die Auskünfte
      angewandt. Zwei benannte Gruppen, damit die Liste eine Ordnung hat.
    */
    heading: 'Menü',
    close: 'Menü schließen',
    yours: 'Dein Stand',
    device: 'App & Gerät',
  },
  settings: {
    /*
      Die Einstellungsseite im Core (Runde 2, Nutzerwunsch): dieselben
      Regler wie am Fuß des Startbildschirms — Sprache und Ton —, nur dort,
      wo App-Gewohnheit sie sucht. Kein zweiter Zustand: Es sind wörtlich
      dieselben Bedienelemente mit denselben Handgriffen.
    */
    heading: 'Einstellungen',
    note: 'Dieselben Regler stehen auch unten auf dem Startbildschirm.',
    // R3-06: Was sich nicht speichern ließ, wird gesagt statt angezeigt.
    saveFailed: 'Diese Einstellung ließ sich auf dem Gerät nicht speichern. Es gilt weiterhin die vorherige.',
    resetNote: 'Wenn du ganz von vorn anfangen willst: Der Weg dorthin steht unten. Vorher lohnt sich eine Sicherung unter „Sicherung“ — danach ist nichts mehr da.',
  },
} as const
