/**
 * Hilfe und Fragen & Antworten, in sechs Sprachen (Nutzerwunsch 04.09.).
 *
 * Ausgelagert wie `learnCopy` und `driveCopy`: Diese Sätze werden erst
 * gebraucht, wenn jemand einen der beiden Bereiche öffnet, und haben im
 * Kaltstart nichts verloren. Im Wörterbuch stehen nur die zwei
 * Überschriften — die braucht das Menü.
 *
 * **Was hier bewusst nicht steht:** die Belege für die beiden Befunde, auf
 * denen die App ruht. Die stehen mit ihrem Stand in `core/science.ts` und auf
 * der Seite „Was belegt ist". Sie hier ein zweites Mal zu führen hieße, zwei
 * Wahrheiten über dieselbe Sache zu haben — und die zweite veraltet zuerst.
 *
 * **Zur Namensfrage.** Was unter „Was bedeutet ANITEW?" steht, folgt D-001 und
 * `docs/TRADEMARK.md`: Der Name wurde ausdrücklich gewählt, **weil** er nichts
 * bedeutete, und die Vorprüfung fand später, dass er im Twi ein echtes Wort
 * ist. Sein Beleg steht seit dem 04.09. in TRADEMARK.md: Daniel 1,17 in der
 * Akan-Bibel, wo „anitew" neben „nimdeɛ" (Kenntnis) steht — Klugheit,
 * Scharfsinn, Einsicht. Die wörtliche Lesart „das Auge ist offen" ist als
 * Lesart benannt und nicht als Tatsache: In den Bibelstellen, an denen Augen
 * aufgetan werden (1. Mose 3,5 und 3,7), steht nicht „tew", sondern „bue".
 *
 * Zwei Dinge sagt der Text deshalb ausdrücklich: dass der Name **nicht**
 * dafür gewählt wurde, und dass die App nichts davon verspricht. Klugheit
 * verteilt keine Anwendung, und ein Name, der sie nennt, ist kein Beleg,
 * dass sie geliefert wird (R-1).
 */

const FALLBACK = 'en'

/** Ein Punkt innerhalb eines Hilfe-Abschnitts: Überschrift und Text. */
export interface HelpItem {
  readonly title: string
  readonly body: string
}

export interface HelpSection {
  readonly title: string
  readonly items: readonly HelpItem[]
}

export interface FaqEntry {
  readonly q: string
  readonly a: string
}

export interface FaqGroup {
  readonly title: string
  readonly entries: readonly FaqEntry[]
}

export interface HelpCopy {
  readonly helpHeading: string
  readonly helpIntro: string
  readonly sections: readonly HelpSection[]
  readonly faqHeading: string
  readonly faqIntro: string
  readonly groups: readonly FaqGroup[]
  /** Der Verweis am Fuß beider Seiten auf die Seite mit den Belegen. */
  readonly evidenceNote: string
}

const COPY: Record<string, HelpCopy> = {
  de: {
    helpHeading: 'Hilfe',
    helpIntro:
      'Was hier steht, beschreibt die App, wie sie ist — nicht, wie sie gemeint war. Sieht bei dir etwas anders aus, ist diese Seite veraltet.',
    sections: [
      {
        title: 'Anfangen',
        items: [
          {
            title: 'Es braucht nichts',
            body: 'Kein Konto, keine Anmeldung, keine Einrichtung. Auf dem Startbildschirm steht ein Knopf, dahinter liegt eine fertige Einheit. Den Stoff bringt die App mit.',
          },
          {
            title: 'Du wählst die Zeit, nicht den Stoff',
            body: 'Vier Längen: 1, 3, 5 und 15 Minuten. Fünf sind der Alltag. Die eine Minute ist für Tage, an denen sonst gar nichts ginge — sie hält die Serie wie jede andere. Was drankommt, entscheidet der Plan.',
          },
          {
            title: 'Der erste Tag ist der dünnste',
            body: 'Am Anfang gibt es nichts zu wiederholen, die Einheit besteht also nur aus Neuem. Ab dem zweiten Tag kommt das Wiedersehen dazu, und von da an trägt es sich selbst.',
          },
        ],
      },
      {
        title: 'Eine Einheit von innen',
        items: [
          {
            title: 'Einprägen, dann abrufen',
            body: 'Eine Runde hat zwei Hälften. Erst siehst du den Stoff, dann wirst du danach gefragt — nicht sofort, sondern wenn die Runde durch ist. Diese Lücke ist der Punkt: Etwas aus dem Kopf zu holen prägt es ein, es noch einmal anzusehen kaum.',
          },
          {
            title: 'Das Wiedersehen',
            body: 'Zwischendurch kommt, was von früheren Tagen fällig ist. Die Termine setzt die App aus deinen eigenen Antworten — nicht nach einer festen Liste.',
          },
          {
            title: 'Wie streng verglichen wird',
            body: 'Das hängt vom Modul ab. Bei einer Zahl zählt jede Ziffer. Bei einem Wort kostet ein Tippfehler nichts. Sind mehrere Zahlen gefragt, gehört eine in jede Zeile.',
          },
          {
            title: 'Abbrechen ist erlaubt',
            body: 'Eine unterbrochene Einheit steht beim nächsten Öffnen noch da. Wegwerfen und neu beginnen geht auch.',
          },
        ],
      },
      {
        title: 'Was trainiert wird',
        items: [
          {
            title: 'Aus der App',
            body: 'Wörter, Namen und Gesichter, Zahlen, Szenen mit Personen, Gänge durch einen Gedächtnispalast, Rückwärts-Folgen, Zwillingspaare, Bilder — und bekannte Persönlichkeiten, dort als Fakten ohne Bild.',
          },
          {
            title: 'Von dir',
            body: 'Eigene Frage-Antwort-Paare, eigene Paläste und deine eigenen Erinnerungen. Sie gehen denselben Weg wie alles andere: mit Termin und Wiedersehen.',
          },
          {
            title: 'Nicht alles an einem Tag',
            body: 'Der Plan mischt und lässt aus, was gerade nicht dran ist. Ein Vorrat, der leer ist, fällt still weg, statt eine leere Runde zu erzeugen.',
          },
        ],
      },
      {
        title: 'Lernen und Üben',
        items: [
          {
            title: 'Alle Methoden an einem Ort',
            body: 'Unter „Lernen" liegen die vier Merktechniken: Geschichten-Methode, Verknüpfung, Major-System, Gedächtnispalast. Ohne Uhr, so oft du willst.',
          },
          {
            title: 'Weiterlernen, neu anfangen',
            body: 'Jede Lektion lässt sich fortsetzen und einzeln zurücksetzen; „alles neu anfangen" gibt es auch. Zurückgesetzt wird der Unterricht, nicht dein Gedächtnisstand.',
          },
          {
            title: '„Üben" öffnet eine Runde nur dazu',
            body: 'Der Knopf führt in einen Übungsraum, in dem nur diese Methode drankommt. Länge wählen, starten — der Rest der App bleibt, wo er ist.',
          },
        ],
      },
      {
        title: 'Sichern und zweites Gerät',
        items: [
          {
            title: 'Die Sicherungsdatei',
            body: 'Unter „Sicherung" schreibt die App alles in eine Datei. Sie gehört dir, ein Konto braucht es dafür nicht.',
          },
          {
            title: 'Google Drive, wenn du willst',
            body: 'Freiwillig. Die Datei landet in deinem eigenen Drive, nicht auf einem Server von uns. Es wandert der ganze Stand: Termine, Messungen, Niveau, eigene Inhalte, Lernstand.',
          },
          {
            title: 'Das Kästchen bei der Anmeldung',
            body: 'Google zeigt die Drive-Freigabe als eigenes Kästchen, und es ist nicht vorausgewählt. Bleibt es leer, kann die App nichts speichern — sie sagt dann, welches gefehlt hat.',
          },
        ],
      },
      {
        title: 'Wenn etwas klemmt',
        items: [
          {
            title: 'Die App zeigt einen alten Stand',
            body: 'Nach einer Aktualisierung gibt das Gerät beim ersten Öffnen noch die alte Fassung aus und lädt die neue im Hintergrund. Einmal schließen und wieder öffnen genügt.',
          },
          {
            title: 'Drive meldet „keine Berechtigung"',
            body: 'Fast immer das leere Kästchen von oben. Abmelden, neu anmelden, den Haken setzen.',
          },
          {
            title: 'Kein Netz',
            body: 'Alles außer dem Abgleich funktioniert ohne Verbindung. Die App liegt auf dem Gerät, nicht auf einem Server.',
          },
          {
            title: 'Alles löschen',
            body: 'Unter „Einstellungen". Die App verlangt vorher ein getipptes Wort, damit ein Fehlgriff nichts anrichtet.',
          },
        ],
      },
    ],
    faqHeading: 'Fragen & Antworten',
    faqIntro:
      'Die Fragen, die uns gestellt wurden — mit den Antworten, die wir belegen können, und den Lücken, wo wir es nicht können.',
    groups: [
      {
        title: 'Über ANITEW',
        entries: [
          {
            q: 'Was bedeutet der Name ANITEW?',
            a: 'Gewählt wurde er, weil er nichts bedeutete — anders als MEMORA, MNEMO oder RECALL, die sofort verständlich und deshalb hundertfach belegt sind. Die Bedeutung sollte der Untertitel tragen: „Train your memory. Measure your progress. Remember more." Erst die Namensrecherche brachte heraus, dass „anitew" ein echtes Wort ist: im Twi, der Akan-Sprache Ghanas, In der Akan-Bibel steht es in Daniel 1,17 neben „nimdeɛ" (Kenntnis) — an der Stelle, die englische Übersetzungen mit „knowledge and skill" wiedergeben. Es benennt also Klugheit, Scharfsinn, Einsicht. „ani" heißt Auge, und der Name lässt sich als „das Auge ist offen" lesen; belegen konnten wir diese Lesart nicht. Gewählt haben wir es nicht deswegen, und versprechen tun wir davon nichts: Klugheit verteilt keine App. Dass ein absichtlich leeres Wort ausgerechnet dort gelandet ist, gefällt uns trotzdem.',
          },
          {
            q: 'Worauf steht die App?',
            a: 'Auf zwei Befunden, die seit Jahrzehnten halten. Erstens: Etwas aus dem Kopf zu holen prägt es stärker ein, als es noch einmal anzusehen — deshalb hat jede Runde eine Abruf-Hälfte und keine Lese-Hälfte. Zweitens: Wiederholung wirkt besser verteilt als gebündelt — deshalb setzt die App Termine und arbeitet keine Liste ab. Alles andere ist Handwerk darum herum.',
          },
          {
            q: 'Was unterscheidet ANITEW von anderen Apps dieser Art?',
            a: 'Vier Dinge, und alle vier sind Verzichte. Keine erfundenen Zahlen: keine Punkte, keine Level, keine Gehirnkraft in Prozent. Kein Konto und keine Cloud-Pflicht: Die App liegt auf deinem Gerät und läuft offline. Sie bringt die Technik bei, statt nur abzufragen. Und sie sagt, was sie nicht weiß — statt es wegzulassen.',
          },
          {
            q: 'Macht mich das schlauer?',
            a: 'Nein, jedenfalls nichts, was wir behaupten könnten. Dass man in dem besser wird, was man übt, ist gut belegt. Dass sich das auf Dinge überträgt, die man nicht geübt hat, ist es nicht — und der schlechte Ruf dieses ganzen Genres kommt daher, dass die beiden Sätze verwechselt werden. Wir haben es nicht gemessen und behaupten es deshalb nicht.',
          },
        ],
      },
      {
        title: 'Zahlen und Messung',
        entries: [
          {
            q: 'Warum gibt es keine Punkte und keine Level?',
            a: 'Weil eine erfundene Währung jedes Gefühl herstellen kann, das man herstellen will: Ihre Zahl ist beliebig, ihre Skala auch. Sie umzubenennen hätte nichts geheilt. An ihrer Stelle steht ein Ereignis, das wirklich stattgefunden hat — das Wiedersehen: eine Information, die nach ihrem ersten Tag noch einmal abgefragt wurde. Diese Zahl lässt sich nicht durch längeres Üben erhöhen. Sie kommt, wenn Termine fällig sind.',
          },
          {
            q: 'Was ist der Unterschied zwischen dem Trainingsscore und der Messung?',
            a: 'Der Trainingsscore entsteht nebenbei in jeder Einheit und sagt, wie es heute lief. Die Messung ist ein eigener, kurzer Test alle zwei Wochen, immer gleich aufgebaut — mit Inhalten, die es sonst nirgends in der App gibt und die nie in den Wiederholungsplan wandern. Was dort gefragt wird, hast du nie geübt. Nur deshalb sagt das Ergebnis überhaupt etwas.',
          },
          {
            q: 'Warum sehen die Gesichter gezeichnet aus?',
            a: 'Weil sie im Code entstehen statt aus einer Sammlung zu kommen. Eine feste Bildersammlung ist nach zwei Wochen durchgesehen und misst danach Wiedererkennen statt Gedächtnis. Fotos lebender Personen kommen aus rechtlichen Gründen nicht in Frage — deshalb gibt es bei den bekannten Persönlichkeiten gar kein Bild, sondern nur Name, Jahr, Fach und Herkunft.',
          },
        ],
      },
      {
        title: 'Üben im Alltag',
        entries: [
          {
            q: 'Wie oft, wie lange?',
            a: 'Fünf Minuten am Tag sind der Entwurf — nicht, weil mehr schadete, sondern weil verteiltes Üben besser wirkt als gebündeltes. Eine Minute an einem schlechten Tag ist mehr wert als eine ausgelassene Woche.',
          },
          {
            q: 'Ich habe Tage ausgelassen. Ist alles verloren?',
            a: 'Nein, und du bekommst auch keinen Berg vorgesetzt. Die App nimmt nur so viel Fälliges in eine Einheit, wie in die gewählte Zeit passt; der Rest kommt an den nächsten Tagen. Rückstand holst du über mehrere Tage auf, nicht an einem.',
          },
          {
            q: 'Warum entscheidet die App, was drankommt?',
            a: 'Weil sie es aus deinen Antworten weiß und nicht aus dem Gefühl, worauf man gerade Lust hat. Wer gezielt eine einzelne Methode üben will, findet unter „Lernen" den Übungsraum dafür.',
          },
        ],
      },
      {
        title: 'Daten, Kosten, Geräte',
        entries: [
          {
            q: 'Brauche ich ein Konto?',
            a: 'Nein. Ohne jede Anmeldung funktioniert alles außer dem Abgleich über Google Drive — und der ist freiwillig.',
          },
          {
            q: 'Wo liegen meine Daten?',
            a: 'Auf deinem Gerät. Schaltest du den Abgleich ein, zusätzlich in deinem eigenen Google Drive. Einen Server, auf dem deine Trainingsdaten lägen, gibt es nicht. Was genau wohin geht, steht im Datenschutz-Bereich.',
          },
          {
            q: 'Was kostet die App?',
            a: 'Nichts. Und was misst, trainiert und erinnert, bleibt kostenlos, auch falls es später einmal ein bezahltes Angebot geben sollte. Eine App, deren Versprechen „wir messen ehrlich" lautet, verliert genau dieses Versprechen in dem Moment, in dem die Messung Geld kostet.',
          },
          {
            q: 'Kann ich alles löschen?',
            a: 'Ja, unter „Einstellungen", abgesichert durch ein Wort, das getippt werden muss. Gelöscht wird auf dem Gerät — und, wenn der Abgleich an war, auch die Datei in deinem Drive.',
          },
        ],
      },
    ],
    evidenceNote:
      'Woher wir wissen, was wir hier behaupten — und wo das Wissen aufhört: unter „Was belegt ist".',
  },
  en: {
    helpHeading: 'Help',
    helpIntro:
      'This describes the app as it is, not as it was meant to be. If something looks different on your device, this page is out of date.',
    sections: [
      {
        title: 'Getting started',
        items: [
          {
            title: 'Nothing is required',
            body: 'No account, no sign-in, no setup. There is a button on the home screen and a finished session behind it. The app brings the material.',
          },
          {
            title: 'You choose the time, not the material',
            body: 'Four lengths: 1, 3, 5 and 15 minutes. Five is the everyday one. The single minute is for days when nothing else would happen — it keeps the streak like any other. What comes up is the plan’s decision.',
          },
          {
            title: 'The first day is the thinnest',
            body: 'At the start there is nothing to review, so the session is all new material. From the second day the review joins in, and from then on it carries itself.',
          },
        ],
      },
      {
        title: 'Inside a session',
        items: [
          {
            title: 'Take it in, then recall it',
            body: 'A round has two halves. First you see the material, then you are asked about it — not immediately, but once the round is over. That gap is the point: pulling something out of your head fixes it, looking at it again barely does.',
          },
          {
            title: 'The reunion',
            body: 'In between comes whatever is due from earlier days. The app sets those dates from your own answers, not from a fixed list.',
          },
          {
            title: 'How strictly you are marked',
            body: 'That depends on the module. With a number every digit counts. With a word a typo costs nothing. When several numbers are asked for, each one goes on its own line.',
          },
          {
            title: 'Stopping is allowed',
            body: 'An interrupted session is still there next time you open the app. Discarding it and starting again works too.',
          },
        ],
      },
      {
        title: 'What gets trained',
        items: [
          {
            title: 'From the app',
            body: 'Words, names and faces, numbers, scenes with people, walks through a memory palace, backward sequences, twin pairs, images — and well-known people, there as facts without a picture.',
          },
          {
            title: 'From you',
            body: 'Your own question-and-answer pairs, your own palaces and your own memories. They travel the same road as everything else: with a date and a reunion.',
          },
          {
            title: 'Not everything on one day',
            body: 'The plan mixes and leaves out what is not due. A pool that is empty drops out quietly instead of producing an empty round.',
          },
        ],
      },
      {
        title: 'Learning and practising',
        items: [
          {
            title: 'All four methods in one place',
            body: 'Under “Learn” you will find the four techniques: the story method, linking, the major system, the memory palace. No clock, as often as you like.',
          },
          {
            title: 'Carry on, or start over',
            body: 'Every lesson can be resumed and reset on its own; “start everything over” exists too. What gets reset is the teaching, not your memory.',
          },
          {
            title: '“Practise” opens a round for that method only',
            body: 'The button leads into a practice room where only this method comes up. Pick a length, start — the rest of the app stays where it is.',
          },
        ],
      },
      {
        title: 'Backups and a second device',
        items: [
          {
            title: 'The backup file',
            body: 'Under “Backup” the app writes everything into a file. It is yours, and it needs no account.',
          },
          {
            title: 'Google Drive, if you want it',
            body: 'Optional. The file lands in your own Drive, not on a server of ours. The whole state travels: dates, measurements, level, your own content, what you have learnt.',
          },
          {
            title: 'The tick box during sign-in',
            body: 'Google shows the Drive permission as a separate box, and it is not ticked for you. If it stays empty the app cannot save anything — it will then tell you which one was missing.',
          },
        ],
      },
      {
        title: 'When something is stuck',
        items: [
          {
            title: 'The app shows an old version',
            body: 'After an update the device serves the old version once and fetches the new one in the background. Close it and open it again.',
          },
          {
            title: 'Drive says “no permission”',
            body: 'Almost always the empty tick box above. Sign out, sign in again, tick it.',
          },
          {
            title: 'No connection',
            body: 'Everything except syncing works offline. The app sits on your device, not on a server.',
          },
          {
            title: 'Deleting everything',
            body: 'Under “Settings”. The app asks you to type a word first, so that one wrong tap does nothing.',
          },
        ],
      },
    ],
    faqHeading: 'Questions & answers',
    faqIntro:
      'The questions people have asked — with the answers we can back up, and the gaps where we cannot.',
    groups: [
      {
        title: 'About ANITEW',
        entries: [
          {
            q: 'What does the name ANITEW mean?',
            a: 'It was chosen because it meant nothing — unlike MEMORA, MNEMO or RECALL, which are instantly understood and therefore taken a hundred times over. The meaning was meant to sit in the subtitle: “Train your memory. Measure your progress. Remember more.” Only the name search turned up that “anitew” is a real word: in Twi, the Akan language of Ghana, In the Akan Bible it stands at Daniel 1:17 beside “nimdeɛ” (knowledge), where English versions have “knowledge and skill”. So it names cleverness, acumen, insight. “ani” is the eye, and the name can be read as “the eye is open” — but that reading we could not verify. We did not pick it for that, and we promise none of it: no app hands out cleverness. That a deliberately empty word landed there of all places is something we like all the same.',
          },
          {
            q: 'What does the app rest on?',
            a: 'On two findings that have held for decades. First: pulling something out of your head fixes it more firmly than looking at it again — which is why every round has a recall half and no reading half. Second: repetition works better spread out than bunched up — which is why the app sets dates instead of working through a list. Everything else is craft around those two.',
          },
          {
            q: 'What makes ANITEW different from other apps of this kind?',
            a: 'Four things, and all four are things it does without. No invented numbers: no points, no levels, no brain power in per cent. No account and no obligatory cloud: the app sits on your device and runs offline. It teaches the technique instead of only testing you. And it says what it does not know, instead of leaving that part out.',
          },
          {
            q: 'Will this make me smarter?',
            a: 'No — nothing we could claim, at least. That you get better at what you practise is well established. That it carries over to things you have not practised is not, and the poor reputation of this whole genre comes from those two sentences being mixed up. We have not measured it, so we do not claim it.',
          },
        ],
      },
      {
        title: 'Numbers and measurement',
        entries: [
          {
            q: 'Why are there no points and no levels?',
            a: 'Because an invented currency can produce any feeling you want it to: its number is arbitrary and so is its scale. Renaming it would have healed nothing. In its place stands an event that actually happened — the reunion: a piece of information that was asked for again after its first day. That number cannot be raised by practising longer. It arrives when things fall due.',
          },
          {
            q: 'What is the difference between the training score and the measurement?',
            a: 'The training score comes out of every session as a by-product and says how today went. The measurement is a separate short test every two weeks, always built the same way — using material that exists nowhere else in the app and never enters the review plan. What it asks about, you have never practised. That is the only reason the result says anything.',
          },
          {
            q: 'Why do the faces look drawn?',
            a: 'Because they are generated in code rather than taken from a collection. A fixed set of pictures is exhausted in a fortnight and then measures recognition instead of memory. Photographs of living people are out of the question for legal reasons — which is why the well-known people carry no picture at all, only name, year, field and origin.',
          },
        ],
      },
      {
        title: 'Practising day to day',
        entries: [
          {
            q: 'How often, how long?',
            a: 'Five minutes a day is the design — not because more would hurt, but because spread-out practice works better than bunched-up practice. One minute on a bad day is worth more than a skipped week.',
          },
          {
            q: 'I have missed days. Is it all lost?',
            a: 'No, and you will not be handed a mountain either. The app takes only as much due material into a session as fits the time you chose; the rest comes on the following days. A backlog is worked off over several days, not in one.',
          },
          {
            q: 'Why does the app decide what comes up?',
            a: 'Because it knows from your answers, rather than from how you happen to feel. If you want to practise one particular method, the practice room under “Learn” is there for exactly that.',
          },
        ],
      },
      {
        title: 'Data, cost, devices',
        entries: [
          {
            q: 'Do I need an account?',
            a: 'No. Without signing in at all, everything works except syncing through Google Drive — and that is voluntary.',
          },
          {
            q: 'Where is my data?',
            a: 'On your device. If you switch syncing on, additionally in your own Google Drive. There is no server holding your training data. Exactly what goes where is set out in the privacy section.',
          },
          {
            q: 'What does the app cost?',
            a: 'Nothing. And whatever measures, trains and reminds stays free, even if there is ever a paid offer. An app whose promise is “we measure honestly” loses that promise the moment the measuring costs money.',
          },
          {
            q: 'Can I delete everything?',
            a: 'Yes, under “Settings”, guarded by a word you have to type. It is deleted on the device — and, if syncing was on, the file in your Drive as well.',
          },
        ],
      },
    ],
    evidenceNote:
      'Where what we claim here comes from — and where the knowledge stops: under “What is established”.',
  },
  fr: {
    helpHeading: 'Aide',
    helpIntro:
      'Ce texte décrit l’application telle qu’elle est, non telle qu’elle était prévue. Si quelque chose diffère chez vous, c’est cette page qui a vieilli.',
    sections: [
      {
        title: 'Commencer',
        items: [
          {
            title: 'Il ne faut rien',
            body: 'Pas de compte, pas de connexion, pas de configuration. Il y a un bouton sur l’écran d’accueil et une séance toute prête derrière. La matière, l’application l’apporte.',
          },
          {
            title: 'Vous choisissez la durée, pas la matière',
            body: 'Quatre durées : 1, 3, 5 et 15 minutes. Cinq, c’est le quotidien. La minute unique est pour les jours où rien d’autre ne se ferait — elle tient la série comme les autres. Ce qui vient, c’est le plan qui le décide.',
          },
          {
            title: 'Le premier jour est le plus maigre',
            body: 'Au début il n’y a rien à revoir : la séance n’est faite que de nouveau. Dès le deuxième jour les retrouvailles s’ajoutent, et à partir de là cela se porte tout seul.',
          },
        ],
      },
      {
        title: 'Une séance de l’intérieur',
        items: [
          {
            title: 'Mémoriser, puis rappeler',
            body: 'Un tour a deux moitiés. D’abord vous voyez la matière, ensuite on vous la demande — pas tout de suite, mais une fois le tour fini. Cet écart est l’essentiel : sortir quelque chose de sa tête l’ancre, le relire presque pas.',
          },
          {
            title: 'Les retrouvailles',
            body: 'Entre-temps revient ce qui est dû des jours précédents. Ces échéances, l’application les fixe d’après vos propres réponses, pas d’après une liste figée.',
          },
          {
            title: 'La sévérité de la correction',
            body: 'Elle dépend du module. Pour un nombre, chaque chiffre compte. Pour un mot, une faute de frappe ne coûte rien. Si plusieurs nombres sont demandés, chacun va sur sa propre ligne.',
          },
          {
            title: 'Interrompre est permis',
            body: 'Une séance interrompue est encore là à la prochaine ouverture. La jeter et recommencer est également possible.',
          },
        ],
      },
      {
        title: 'Ce qui est entraîné',
        items: [
          {
            title: 'Depuis l’application',
            body: 'Des mots, des noms et des visages, des nombres, des scènes avec des personnes, des parcours dans un palais de mémoire, des suites à l’envers, des paires jumelles, des images — et des personnalités connues, là sous forme de faits sans image.',
          },
          {
            title: 'De vous',
            body: 'Vos propres paires question-réponse, vos propres palais et vos propres souvenirs. Ils suivent le même chemin que tout le reste : avec une échéance et des retrouvailles.',
          },
          {
            title: 'Pas tout le même jour',
            body: 'Le plan mélange et laisse de côté ce qui n’est pas dû. Une réserve vide disparaît en silence au lieu de produire un tour vide.',
          },
        ],
      },
      {
        title: 'Apprendre et s’exercer',
        items: [
          {
            title: 'Les quatre méthodes au même endroit',
            body: 'Sous « Apprendre » se trouvent les quatre techniques : la méthode des histoires, l’association, le système Major, le palais de mémoire. Sans horloge, aussi souvent que vous voulez.',
          },
          {
            title: 'Continuer, ou tout reprendre',
            body: 'Chaque leçon peut être poursuivie et remise à zéro séparément ; « tout recommencer » existe aussi. Ce qui est remis à zéro, c’est l’enseignement, pas votre mémoire.',
          },
          {
            title: '« S’exercer » ouvre un tour rien que pour cette méthode',
            body: 'Le bouton mène dans une salle d’exercice où seule cette méthode est proposée. Choisir la durée, démarrer — le reste de l’application ne bouge pas.',
          },
        ],
      },
      {
        title: 'Sauvegarde et deuxième appareil',
        items: [
          {
            title: 'Le fichier de sauvegarde',
            body: 'Sous « Sauvegarde », l’application écrit tout dans un fichier. Il vous appartient, et aucun compte n’est nécessaire.',
          },
          {
            title: 'Google Drive, si vous le souhaitez',
            body: 'Facultatif. Le fichier arrive dans votre propre Drive, pas sur un serveur à nous. Tout l’état voyage : échéances, mesures, niveau, contenus personnels, avancement des leçons.',
          },
          {
            title: 'La case à cocher lors de la connexion',
            body: 'Google présente l’autorisation Drive comme une case distincte, et elle n’est pas cochée d’avance. Si elle reste vide, l’application ne peut rien enregistrer — elle vous dira alors laquelle manquait.',
          },
        ],
      },
      {
        title: 'Quand ça coince',
        items: [
          {
            title: 'L’application montre un ancien état',
            body: 'Après une mise à jour, l’appareil sert encore une fois l’ancienne version et charge la nouvelle en arrière-plan. Fermer et rouvrir suffit.',
          },
          {
            title: 'Drive annonce « pas d’autorisation »',
            body: 'Presque toujours la case vide ci-dessus. Se déconnecter, se reconnecter, cocher.',
          },
          {
            title: 'Sans réseau',
            body: 'Tout fonctionne hors ligne, sauf la synchronisation. L’application est sur votre appareil, pas sur un serveur.',
          },
          {
            title: 'Tout supprimer',
            body: 'Sous « Réglages ». L’application demande d’abord de taper un mot, pour qu’une fausse manœuvre ne fasse rien.',
          },
        ],
      },
    ],
    faqHeading: 'Questions & réponses',
    faqIntro:
      'Les questions qu’on nous a posées — avec les réponses que nous pouvons étayer, et les trous là où nous ne le pouvons pas.',
    groups: [
      {
        title: 'À propos d’ANITEW',
        entries: [
          {
            q: 'Que signifie le nom ANITEW ?',
            a: 'Il a été choisi parce qu’il ne signifiait rien — contrairement à MEMORA, MNEMO ou RECALL, immédiatement compréhensibles et donc pris cent fois. Le sens devait être porté par le sous-titre : « Train your memory. Measure your progress. Remember more. » C’est la recherche de nom qui a révélé qu’« anitew » est un vrai mot : en twi, la langue akan du Ghana, Dans la Bible akan, il figure en Daniel 1.17 à côté de « nimdeɛ » (connaissance), là où les versions anglaises portent « knowledge and skill ». Il désigne donc l’intelligence, la perspicacité, le discernement. « ani » veut dire œil, et le nom peut se lire « l’œil est ouvert » ; cette lecture, nous n’avons pas pu l’établir. Nous ne l’avons pas choisi pour cela et nous n’en promettons rien : aucune application ne distribue l’intelligence. Qu’un mot voulu vide soit tombé précisément là nous plaît tout de même.',
          },
          {
            q: 'Sur quoi repose l’application ?',
            a: 'Sur deux constats qui tiennent depuis des décennies. Premièrement : sortir quelque chose de sa tête l’ancre plus fortement que le relire — d’où une moitié rappel dans chaque tour, et pas de moitié lecture. Deuxièmement : la répétition agit mieux étalée que groupée — d’où des échéances plutôt qu’une liste à dérouler. Tout le reste est de l’artisanat autour de ces deux points.',
          },
          {
            q: 'Qu’est-ce qui distingue ANITEW des autres applications du genre ?',
            a: 'Quatre choses, et toutes les quatre sont des renoncements. Aucun chiffre inventé : pas de points, pas de niveaux, pas de puissance cérébrale en pourcentage. Aucun compte et aucun nuage obligatoire : l’application est sur votre appareil et fonctionne hors ligne. Elle enseigne la technique au lieu de seulement interroger. Et elle dit ce qu’elle ne sait pas, au lieu de passer cette partie sous silence.',
          },
          {
            q: 'Est-ce que cela me rendra plus intelligent ?',
            a: 'Non — rien que nous puissions affirmer, en tout cas. Qu’on progresse dans ce qu’on exerce est bien établi. Que cela se transfère à ce qu’on n’a pas exercé ne l’est pas, et la mauvaise réputation de tout ce genre vient de la confusion entre ces deux phrases. Nous ne l’avons pas mesuré, donc nous ne l’affirmons pas.',
          },
        ],
      },
      {
        title: 'Chiffres et mesure',
        entries: [
          {
            q: 'Pourquoi n’y a-t-il ni points ni niveaux ?',
            a: 'Parce qu’une monnaie inventée peut produire n’importe quel sentiment qu’on veut produire : son chiffre est arbitraire, son échelle aussi. La renommer n’aurait rien guéri. À sa place se trouve un événement qui a réellement eu lieu — les retrouvailles : une information redemandée après son premier jour. Ce chiffre ne se gonfle pas en s’exerçant plus longtemps. Il vient quand des échéances tombent.',
          },
          {
            q: 'Quelle différence entre le score d’entraînement et la mesure ?',
            a: 'Le score d’entraînement naît en passant dans chaque séance et dit comment s’est passée la journée. La mesure est un test court et distinct, toutes les deux semaines, toujours construit de la même façon — avec des contenus qui n’existent nulle part ailleurs dans l’application et n’entrent jamais dans le plan de révision. Ce qui y est demandé, vous ne l’avez jamais exercé. C’est la seule raison pour laquelle le résultat dit quelque chose.',
          },
          {
            q: 'Pourquoi les visages ont-ils l’air dessinés ?',
            a: 'Parce qu’ils naissent dans le code au lieu de venir d’une collection. Un jeu d’images figé est épuisé en quinze jours et mesure ensuite la reconnaissance, pas la mémoire. Les photos de personnes vivantes sont exclues pour des raisons juridiques — c’est pourquoi les personnalités connues n’ont aucune image, seulement un nom, une année, un domaine et une origine.',
          },
        ],
      },
      {
        title: 'S’exercer au quotidien',
        entries: [
          {
            q: 'À quelle fréquence, combien de temps ?',
            a: 'Cinq minutes par jour, c’est le projet — non parce que davantage nuirait, mais parce qu’un entraînement étalé agit mieux qu’un entraînement groupé. Une minute un mauvais jour vaut mieux qu’une semaine sautée.',
          },
          {
            q: 'J’ai sauté des jours. Tout est perdu ?',
            a: 'Non, et on ne vous servira pas une montagne non plus. L’application ne prend dans une séance que ce qui tient dans la durée choisie ; le reste vient les jours suivants. Un retard se rattrape sur plusieurs jours, pas en un seul.',
          },
          {
            q: 'Pourquoi est-ce l’application qui décide de ce qui vient ?',
            a: 'Parce qu’elle le sait d’après vos réponses, et non d’après l’envie du moment. Pour travailler une méthode précise, la salle d’exercice sous « Apprendre » est faite exactement pour cela.',
          },
        ],
      },
      {
        title: 'Données, coût, appareils',
        entries: [
          {
            q: 'Ai-je besoin d’un compte ?',
            a: 'Non. Sans aucune connexion, tout fonctionne sauf la synchronisation par Google Drive — et celle-ci est facultative.',
          },
          {
            q: 'Où sont mes données ?',
            a: 'Sur votre appareil. Si vous activez la synchronisation, également dans votre propre Google Drive. Il n’existe aucun serveur contenant vos données d’entraînement. Ce qui va exactement où est expliqué dans la section confidentialité.',
          },
          {
            q: 'Combien coûte l’application ?',
            a: 'Rien. Et tout ce qui mesure, entraîne et rappelle reste gratuit, même s’il devait un jour exister une offre payante. Une application dont la promesse est « nous mesurons honnêtement » perd cette promesse au moment où la mesure coûte de l’argent.',
          },
          {
            q: 'Puis-je tout supprimer ?',
            a: 'Oui, sous « Réglages », protégé par un mot à taper. La suppression a lieu sur l’appareil — et, si la synchronisation était active, sur le fichier dans votre Drive aussi.',
          },
        ],
      },
    ],
    evidenceNote:
      'D’où vient ce que nous affirmons ici — et où le savoir s’arrête : sous « Ce qui est établi ».',
  },
  es: {
    helpHeading: 'Ayuda',
    helpIntro:
      'Esto describe la aplicación tal como es, no como se pensó. Si algo se ve distinto en tu dispositivo, es esta página la que ha envejecido.',
    sections: [
      {
        title: 'Empezar',
        items: [
          {
            title: 'No hace falta nada',
            body: 'Sin cuenta, sin inicio de sesión, sin configuración. Hay un botón en la pantalla de inicio y detrás una sesión lista. El material lo pone la aplicación.',
          },
          {
            title: 'Eliges el tiempo, no el material',
            body: 'Cuatro duraciones: 1, 3, 5 y 15 minutos. Cinco es la del día a día. El minuto único es para los días en que si no, no pasaría nada — mantiene la racha igual que las demás. Lo que toca lo decide el plan.',
          },
          {
            title: 'El primer día es el más flaco',
            body: 'Al principio no hay nada que repasar, así que la sesión es solo material nuevo. Desde el segundo día se suma el reencuentro, y a partir de ahí se sostiene solo.',
          },
        ],
      },
      {
        title: 'Una sesión por dentro',
        items: [
          {
            title: 'Memorizar y luego recordar',
            body: 'Una ronda tiene dos mitades. Primero ves el material, después te preguntan por él — no enseguida, sino cuando la ronda ha terminado. Ese hueco es lo esencial: sacar algo de la cabeza lo fija; volver a mirarlo, apenas.',
          },
          {
            title: 'El reencuentro',
            body: 'Entremedias vuelve lo que vence de días anteriores. Esas fechas las fija la aplicación a partir de tus propias respuestas, no de una lista fija.',
          },
          {
            title: 'Con qué rigor se corrige',
            body: 'Depende del módulo. En un número cuenta cada cifra. En una palabra, una errata no cuesta nada. Si se piden varios números, cada uno va en su propia línea.',
          },
          {
            title: 'Interrumpir está permitido',
            body: 'Una sesión interrumpida sigue ahí la próxima vez que abras. Descartarla y empezar de nuevo también se puede.',
          },
        ],
      },
      {
        title: 'Qué se entrena',
        items: [
          {
            title: 'De la aplicación',
            body: 'Palabras, nombres y caras, números, escenas con personas, recorridos por un palacio de la memoria, secuencias al revés, pares gemelos, imágenes — y personalidades conocidas, ahí como datos sin imagen.',
          },
          {
            title: 'Tuyo',
            body: 'Tus propios pares de pregunta y respuesta, tus propios palacios y tus propios recuerdos. Siguen el mismo camino que todo lo demás: con fecha y con reencuentro.',
          },
          {
            title: 'No todo el mismo día',
            body: 'El plan mezcla y deja fuera lo que no toca. Una reserva vacía desaparece en silencio en lugar de producir una ronda vacía.',
          },
        ],
      },
      {
        title: 'Aprender y practicar',
        items: [
          {
            title: 'Los cuatro métodos en un solo sitio',
            body: 'En «Aprender» están las cuatro técnicas: el método de las historias, la asociación, el sistema Major y el palacio de la memoria. Sin reloj, tantas veces como quieras.',
          },
          {
            title: 'Seguir o volver a empezar',
            body: 'Cada lección se puede continuar y reiniciar por separado; «empezar todo de nuevo» también existe. Lo que se reinicia es la enseñanza, no tu memoria.',
          },
          {
            title: '«Practicar» abre una ronda solo de ese método',
            body: 'El botón lleva a una sala de práctica en la que solo aparece ese método. Elegir duración, empezar — el resto de la aplicación se queda donde está.',
          },
        ],
      },
      {
        title: 'Copia de seguridad y segundo dispositivo',
        items: [
          {
            title: 'El archivo de copia',
            body: 'En «Copia de seguridad» la aplicación lo escribe todo en un archivo. Es tuyo y no hace falta ninguna cuenta.',
          },
          {
            title: 'Google Drive, si quieres',
            body: 'Opcional. El archivo acaba en tu propio Drive, no en un servidor nuestro. Viaja el estado entero: fechas, mediciones, nivel, contenidos propios y lo aprendido.',
          },
          {
            title: 'La casilla al iniciar sesión',
            body: 'Google muestra el permiso de Drive como una casilla aparte, y no viene marcada. Si se queda vacía, la aplicación no puede guardar nada — y entonces te dice cuál faltaba.',
          },
        ],
      },
      {
        title: 'Cuando algo se atasca',
        items: [
          {
            title: 'La aplicación muestra una versión antigua',
            body: 'Tras una actualización, el dispositivo sirve una vez más la versión anterior y carga la nueva en segundo plano. Basta con cerrar y volver a abrir.',
          },
          {
            title: 'Drive dice «sin permiso»',
            body: 'Casi siempre es la casilla vacía de arriba. Cerrar sesión, volver a entrar, marcarla.',
          },
          {
            title: 'Sin conexión',
            body: 'Todo funciona sin conexión salvo la sincronización. La aplicación está en tu dispositivo, no en un servidor.',
          },
          {
            title: 'Borrarlo todo',
            body: 'En «Ajustes». La aplicación pide antes que escribas una palabra, para que un toque equivocado no haga nada.',
          },
        ],
      },
    ],
    faqHeading: 'Preguntas y respuestas',
    faqIntro:
      'Las preguntas que nos han hecho — con las respuestas que podemos respaldar y los huecos donde no podemos.',
    groups: [
      {
        title: 'Sobre ANITEW',
        entries: [
          {
            q: '¿Qué significa el nombre ANITEW?',
            a: 'Se eligió porque no significaba nada — a diferencia de MEMORA, MNEMO o RECALL, que se entienden al instante y por eso están tomados cien veces. El sentido debía llevarlo el subtítulo: «Train your memory. Measure your progress. Remember more.» Fue la búsqueda del nombre la que reveló que «anitew» es una palabra real: en twi, la lengua akan de Ghana, En la Biblia acán aparece en Daniel 1:17 junto a «nimdeɛ» (conocimiento), donde las versiones inglesas dicen «knowledge and skill». Designa, pues, la inteligencia, la agudeza, el discernimiento. «ani» significa ojo, y el nombre puede leerse como «el ojo está abierto»; esa lectura no hemos podido comprobarla. No lo elegimos por eso y no prometemos nada de ello: ninguna aplicación reparte inteligencia. Que una palabra querida vacía fuera a caer justo ahí nos gusta de todos modos.',
          },
          {
            q: '¿Sobre qué se apoya la aplicación?',
            a: 'Sobre dos hallazgos que se sostienen desde hace décadas. Primero: sacar algo de la cabeza lo fija con más fuerza que volver a mirarlo — por eso cada ronda tiene una mitad de recuerdo y ninguna de lectura. Segundo: la repetición funciona mejor repartida que amontonada — por eso la aplicación fija fechas en lugar de recorrer una lista. Todo lo demás es oficio alrededor de esos dos puntos.',
          },
          {
            q: '¿Qué distingue a ANITEW de otras aplicaciones del género?',
            a: 'Cuatro cosas, y las cuatro son renuncias. Ninguna cifra inventada: ni puntos, ni niveles, ni potencia cerebral en porcentaje. Ninguna cuenta y ninguna nube obligatoria: la aplicación está en tu dispositivo y funciona sin conexión. Enseña la técnica en lugar de solo preguntar. Y dice lo que no sabe, en vez de omitir esa parte.',
          },
          {
            q: '¿Me hará más inteligente?',
            a: 'No — nada que pudiéramos afirmar, al menos. Que uno mejora en aquello que practica está bien demostrado. Que eso se traslade a lo que no se ha practicado, no lo está, y la mala fama de todo este género viene de confundir ambas frases. No lo hemos medido, así que no lo afirmamos.',
          },
        ],
      },
      {
        title: 'Cifras y medición',
        entries: [
          {
            q: '¿Por qué no hay puntos ni niveles?',
            a: 'Porque una moneda inventada puede producir cualquier sensación que uno quiera producir: su cifra es arbitraria y su escala también. Cambiarle el nombre no habría curado nada. En su lugar hay un hecho que ocurrió de verdad — el reencuentro: una información que se volvió a preguntar después de su primer día. Esa cifra no sube practicando más rato. Llega cuando algo vence.',
          },
          {
            q: '¿Qué diferencia hay entre la puntuación de entrenamiento y la medición?',
            a: 'La puntuación de entrenamiento sale de paso en cada sesión y dice cómo ha ido el día. La medición es una prueba corta aparte, cada dos semanas, siempre con la misma estructura — con contenidos que no existen en ningún otro sitio de la aplicación y que nunca entran en el plan de repaso. Lo que allí se pregunta no lo has practicado nunca. Solo por eso el resultado dice algo.',
          },
          {
            q: '¿Por qué las caras parecen dibujadas?',
            a: 'Porque nacen en el código en lugar de venir de una colección. Un conjunto fijo de imágenes se agota en dos semanas y a partir de ahí mide reconocimiento, no memoria. Las fotos de personas vivas quedan descartadas por razones legales — por eso las personalidades conocidas no llevan imagen alguna, solo nombre, año, campo y origen.',
          },
        ],
      },
      {
        title: 'Practicar en el día a día',
        entries: [
          {
            q: '¿Con qué frecuencia y cuánto tiempo?',
            a: 'Cinco minutos al día es el diseño — no porque más haga daño, sino porque la práctica repartida funciona mejor que la amontonada. Un minuto en un mal día vale más que una semana saltada.',
          },
          {
            q: 'He saltado días. ¿Está todo perdido?',
            a: 'No, y tampoco te pondrán una montaña delante. La aplicación mete en una sesión solo lo vencido que cabe en el tiempo elegido; el resto llega los días siguientes. El retraso se recupera a lo largo de varios días, no en uno.',
          },
          {
            q: '¿Por qué decide la aplicación lo que toca?',
            a: 'Porque lo sabe por tus respuestas y no por las ganas del momento. Si quieres trabajar un método concreto, la sala de práctica en «Aprender» está justo para eso.',
          },
        ],
      },
      {
        title: 'Datos, coste, dispositivos',
        entries: [
          {
            q: '¿Necesito una cuenta?',
            a: 'No. Sin iniciar sesión funciona todo salvo la sincronización por Google Drive — y esa es voluntaria.',
          },
          {
            q: '¿Dónde están mis datos?',
            a: 'En tu dispositivo. Si activas la sincronización, además en tu propio Google Drive. No existe ningún servidor con tus datos de entrenamiento. Qué va exactamente adónde se explica en la sección de privacidad.',
          },
          {
            q: '¿Cuánto cuesta la aplicación?',
            a: 'Nada. Y lo que mide, entrena y recuerda seguirá siendo gratuito, aunque algún día haya una oferta de pago. Una aplicación cuya promesa es «medimos con honestidad» pierde esa promesa en el momento en que la medición cuesta dinero.',
          },
          {
            q: '¿Puedo borrarlo todo?',
            a: 'Sí, en «Ajustes», protegido por una palabra que hay que escribir. Se borra en el dispositivo — y, si la sincronización estaba activa, también el archivo en tu Drive.',
          },
        ],
      },
    ],
    evidenceNote:
      'De dónde viene lo que aquí afirmamos — y dónde se acaba el saber: en «Lo que está demostrado».',
  },
  it: {
    helpHeading: 'Aiuto',
    helpIntro:
      'Qui è descritta l’app com’è, non come era stata pensata. Se da te qualcosa appare diverso, è questa pagina a essere invecchiata.',
    sections: [
      {
        title: 'Cominciare',
        items: [
          {
            title: 'Non serve nulla',
            body: 'Nessun account, nessun accesso, nessuna configurazione. Sulla schermata iniziale c’è un pulsante e dietro una sessione già pronta. Il materiale lo porta l’app.',
          },
          {
            title: 'Scegli il tempo, non il materiale',
            body: 'Quattro durate: 1, 3, 5 e 15 minuti. Cinque è quella di tutti i giorni. Il minuto singolo è per le giornate in cui altrimenti non accadrebbe nulla — tiene la serie come le altre. Che cosa arriva lo decide il piano.',
          },
          {
            title: 'Il primo giorno è il più magro',
            body: 'All’inizio non c’è nulla da ripassare, quindi la sessione è tutta materiale nuovo. Dal secondo giorno si aggiunge il ritrovarsi, e da lì in poi si regge da sé.',
          },
        ],
      },
      {
        title: 'Una sessione dall’interno',
        items: [
          {
            title: 'Memorizzare, poi richiamare',
            body: 'Un giro ha due metà. Prima vedi il materiale, poi te lo si chiede — non subito, ma quando il giro è finito. Quello scarto è il punto: tirare fuori qualcosa dalla testa lo fissa, riguardarlo quasi no.',
          },
          {
            title: 'Il ritrovarsi',
            body: 'Nel mezzo torna ciò che è in scadenza dai giorni precedenti. Quelle scadenze l’app le fissa dalle tue risposte, non da un elenco fisso.',
          },
          {
            title: 'Quanto è severa la correzione',
            body: 'Dipende dal modulo. In un numero conta ogni cifra. In una parola un refuso non costa nulla. Se si chiedono più numeri, ognuno va sulla propria riga.',
          },
          {
            title: 'Interrompere è permesso',
            body: 'Una sessione interrotta è ancora lì alla prossima apertura. Buttarla e ricominciare è altrettanto possibile.',
          },
        ],
      },
      {
        title: 'Che cosa viene allenato',
        items: [
          {
            title: 'Dall’app',
            body: 'Parole, nomi e volti, numeri, scene con persone, percorsi in un palazzo della memoria, sequenze all’indietro, coppie gemelle, immagini — e personalità note, lì come fatti senza immagine.',
          },
          {
            title: 'Da te',
            body: 'Le tue coppie domanda-risposta, i tuoi palazzi e i tuoi ricordi. Seguono la stessa strada di tutto il resto: con una scadenza e un ritrovarsi.',
          },
          {
            title: 'Non tutto nello stesso giorno',
            body: 'Il piano mescola e lascia fuori ciò che non tocca. Una riserva vuota sparisce in silenzio invece di produrre un giro vuoto.',
          },
        ],
      },
      {
        title: 'Imparare ed esercitarsi',
        items: [
          {
            title: 'I quattro metodi in un solo posto',
            body: 'Sotto «Imparare» ci sono le quattro tecniche: il metodo delle storie, l’associazione, il sistema Major, il palazzo della memoria. Senza orologio, tutte le volte che vuoi.',
          },
          {
            title: 'Proseguire o ricominciare',
            body: 'Ogni lezione si può riprendere e azzerare singolarmente; «ricominciare tutto» esiste anch’esso. Ciò che si azzera è l’insegnamento, non la tua memoria.',
          },
          {
            title: '«Esercitarsi» apre un giro solo su quel metodo',
            body: 'Il pulsante porta in una sala di esercizio in cui compare solo quel metodo. Scegliere la durata, avviare — il resto dell’app resta dov’è.',
          },
        ],
      },
      {
        title: 'Backup e secondo dispositivo',
        items: [
          {
            title: 'Il file di backup',
            body: 'Sotto «Backup» l’app scrive tutto in un file. È tuo e non richiede alcun account.',
          },
          {
            title: 'Google Drive, se vuoi',
            body: 'Facoltativo. Il file finisce nel tuo Drive, non su un nostro server. Viaggia l’intero stato: scadenze, misurazioni, livello, contenuti tuoi, avanzamento delle lezioni.',
          },
          {
            title: 'La casella durante l’accesso',
            body: 'Google mostra l’autorizzazione a Drive come una casella a parte, e non è già spuntata. Se resta vuota l’app non può salvare nulla — e ti dirà quale mancava.',
          },
        ],
      },
      {
        title: 'Quando qualcosa si inceppa',
        items: [
          {
            title: 'L’app mostra una versione vecchia',
            body: 'Dopo un aggiornamento il dispositivo serve ancora una volta la versione precedente e carica la nuova in secondo piano. Basta chiudere e riaprire.',
          },
          {
            title: 'Drive dice «nessuna autorizzazione»',
            body: 'Quasi sempre è la casella vuota di cui sopra. Uscire, rientrare, spuntarla.',
          },
          {
            title: 'Senza rete',
            body: 'Tutto funziona offline tranne la sincronizzazione. L’app sta sul tuo dispositivo, non su un server.',
          },
          {
            title: 'Cancellare tutto',
            body: 'Sotto «Impostazioni». L’app chiede prima di digitare una parola, così che un tocco sbagliato non faccia nulla.',
          },
        ],
      },
    ],
    faqHeading: 'Domande e risposte',
    faqIntro:
      'Le domande che ci sono state poste — con le risposte che possiamo sostenere e i vuoti dove non possiamo.',
    groups: [
      {
        title: 'Su ANITEW',
        entries: [
          {
            q: 'Che cosa significa il nome ANITEW?',
            a: 'È stato scelto perché non significava nulla — a differenza di MEMORA, MNEMO o RECALL, subito comprensibili e perciò già presi cento volte. Il senso doveva portarlo il sottotitolo: «Train your memory. Measure your progress. Remember more.» È stata la ricerca sul nome a rivelare che «anitew» è una parola vera: in twi, la lingua akan del Ghana, Nella Bibbia akan compare in Daniele 1:17 accanto a «nimdeɛ» (conoscenza), dove le versioni inglesi hanno «knowledge and skill». Indica dunque l’intelligenza, l’acume, il discernimento. «ani» significa occhio, e il nome si può leggere come «l’occhio è aperto»; questa lettura non siamo riusciti a documentarla. Non l’abbiamo scelto per questo e non ne promettiamo nulla: nessuna app distribuisce intelligenza. Che una parola voluta vuota sia finita proprio lì ci piace comunque.',
          },
          {
            q: 'Su che cosa si regge l’app?',
            a: 'Su due risultati che tengono da decenni. Primo: tirare qualcosa fuori dalla testa lo fissa più saldamente che riguardarlo — per questo ogni giro ha una metà di richiamo e nessuna metà di lettura. Secondo: la ripetizione funziona meglio distribuita che ammassata — per questo l’app fissa scadenze invece di scorrere un elenco. Tutto il resto è artigianato attorno a questi due punti.',
          },
          {
            q: 'Che cosa distingue ANITEW dalle altre app del genere?',
            a: 'Quattro cose, e tutte e quattro sono rinunce. Nessun numero inventato: niente punti, niente livelli, nessuna potenza cerebrale in percentuale. Nessun account e nessun cloud obbligatorio: l’app sta sul tuo dispositivo e funziona offline. Insegna la tecnica invece di limitarsi a interrogare. E dice quello che non sa, invece di tacerlo.',
          },
          {
            q: 'Mi renderà più intelligente?',
            a: 'No — niente che potremmo affermare, almeno. Che si migliori in ciò che si esercita è ben dimostrato. Che questo si trasferisca a ciò che non si è esercitato non lo è, e la cattiva fama di tutto questo genere nasce dalla confusione tra le due frasi. Non l’abbiamo misurato, quindi non lo affermiamo.',
          },
        ],
      },
      {
        title: 'Numeri e misurazione',
        entries: [
          {
            q: 'Perché non ci sono punti né livelli?',
            a: 'Perché una moneta inventata può produrre qualunque sensazione si voglia produrre: il suo numero è arbitrario e così la sua scala. Rinominarla non avrebbe guarito nulla. Al suo posto c’è un fatto davvero accaduto — il ritrovarsi: un’informazione richiesta di nuovo dopo il suo primo giorno. Quel numero non si alza esercitandosi più a lungo. Arriva quando qualcosa scade.',
          },
          {
            q: 'Che differenza c’è tra il punteggio di allenamento e la misurazione?',
            a: 'Il punteggio di allenamento nasce di passaggio in ogni sessione e dice com’è andata oggi. La misurazione è un test breve e separato, ogni due settimane, sempre costruito allo stesso modo — con contenuti che non esistono da nessun’altra parte nell’app e non entrano mai nel piano di ripasso. Ciò che vi si chiede non l’hai mai esercitato. Solo per questo il risultato dice qualcosa.',
          },
          {
            q: 'Perché i volti sembrano disegnati?',
            a: 'Perché nascono nel codice invece di venire da una raccolta. Un insieme fisso di immagini si esaurisce in due settimane e da lì misura il riconoscimento, non la memoria. Le fotografie di persone viventi sono escluse per motivi giuridici — per questo le personalità note non hanno alcuna immagine, ma solo nome, anno, campo e origine.',
          },
        ],
      },
      {
        title: 'Esercitarsi ogni giorno',
        entries: [
          {
            q: 'Quante volte, per quanto tempo?',
            a: 'Cinque minuti al giorno sono il progetto — non perché di più faccia male, ma perché l’esercizio distribuito funziona meglio di quello ammassato. Un minuto in una giornata storta vale più di una settimana saltata.',
          },
          {
            q: 'Ho saltato dei giorni. È tutto perduto?',
            a: 'No, e non ti verrà messa davanti una montagna. L’app prende in una sessione solo quanto scaduto entra nel tempo scelto; il resto arriva nei giorni successivi. L’arretrato si recupera in più giorni, non in uno.',
          },
          {
            q: 'Perché decide l’app che cosa arriva?',
            a: 'Perché lo sa dalle tue risposte e non dalla voglia del momento. Se vuoi lavorare su un metodo preciso, la sala di esercizio sotto «Imparare» serve esattamente a questo.',
          },
        ],
      },
      {
        title: 'Dati, costi, dispositivi',
        entries: [
          {
            q: 'Serve un account?',
            a: 'No. Senza alcun accesso funziona tutto tranne la sincronizzazione tramite Google Drive — e quella è facoltativa.',
          },
          {
            q: 'Dove sono i miei dati?',
            a: 'Sul tuo dispositivo. Se attivi la sincronizzazione, anche nel tuo Google Drive. Non esiste alcun server con i tuoi dati di allenamento. Che cosa va esattamente dove è spiegato nella sezione privacy.',
          },
          {
            q: 'Quanto costa l’app?',
            a: 'Nulla. E ciò che misura, allena e ricorda resta gratuito, anche se un giorno esistesse un’offerta a pagamento. Un’app la cui promessa è «misuriamo onestamente» perde proprio quella promessa nel momento in cui la misura costa denaro.',
          },
          {
            q: 'Posso cancellare tutto?',
            a: 'Sì, sotto «Impostazioni», protetto da una parola da digitare. Si cancella sul dispositivo — e, se la sincronizzazione era attiva, anche il file nel tuo Drive.',
          },
        ],
      },
    ],
    evidenceNote:
      'Da dove viene ciò che qui affermiamo — e dove il sapere si ferma: sotto «Ciò che è dimostrato».',
  },
  pt: {
    helpHeading: 'Ajuda',
    helpIntro:
      'Aqui está descrita a aplicação tal como é, não como foi pensada. Se algo lhe aparecer diferente, é esta página que envelheceu.',
    sections: [
      {
        title: 'Começar',
        items: [
          {
            title: 'Não é preciso nada',
            body: 'Sem conta, sem início de sessão, sem configuração. No ecrã inicial há um botão e por trás dele uma sessão pronta. O material é a aplicação que o traz.',
          },
          {
            title: 'Escolhe o tempo, não a matéria',
            body: 'Quatro durações: 1, 3, 5 e 15 minutos. Cinco é a do dia a dia. O minuto único é para os dias em que, de outro modo, nada aconteceria — mantém a série como as outras. O que aparece é o plano que decide.',
          },
          {
            title: 'O primeiro dia é o mais magro',
            body: 'No início não há nada para rever, portanto a sessão é só matéria nova. A partir do segundo dia junta-se o reencontro e, daí em diante, sustenta-se sozinho.',
          },
        ],
      },
      {
        title: 'Uma sessão por dentro',
        items: [
          {
            title: 'Memorizar e depois recordar',
            body: 'Uma ronda tem duas metades. Primeiro vê a matéria, depois é interrogado sobre ela — não logo, mas quando a ronda termina. Esse intervalo é o essencial: tirar algo da cabeça fixa-o; voltar a olhar para ele, quase nada.',
          },
          {
            title: 'O reencontro',
            body: 'Pelo meio volta aquilo que está em dívida de dias anteriores. Essas datas a aplicação fixa-as a partir das suas próprias respostas, não de uma lista fixa.',
          },
          {
            title: 'Com que rigor se corrige',
            body: 'Depende do módulo. Num número conta cada algarismo. Numa palavra, uma gralha não custa nada. Se forem pedidos vários números, cada um vai na sua própria linha.',
          },
          {
            title: 'Interromper é permitido',
            body: 'Uma sessão interrompida continua lá da próxima vez que abrir. Deitá-la fora e recomeçar também é possível.',
          },
        ],
      },
      {
        title: 'O que é treinado',
        items: [
          {
            title: 'Da aplicação',
            body: 'Palavras, nomes e rostos, números, cenas com pessoas, percursos por um palácio da memória, sequências ao contrário, pares gémeos, imagens — e personalidades conhecidas, aí como factos sem imagem.',
          },
          {
            title: 'De si',
            body: 'Os seus pares de pergunta e resposta, os seus palácios e as suas memórias. Seguem o mesmo caminho que tudo o resto: com data e com reencontro.',
          },
          {
            title: 'Não tudo no mesmo dia',
            body: 'O plano mistura e deixa de fora o que não está a calhar. Uma reserva vazia desaparece em silêncio em vez de produzir uma ronda vazia.',
          },
        ],
      },
      {
        title: 'Aprender e praticar',
        items: [
          {
            title: 'Os quatro métodos num só lugar',
            body: 'Em «Aprender» estão as quatro técnicas: o método das histórias, a associação, o sistema Major e o palácio da memória. Sem relógio, tantas vezes quantas quiser.',
          },
          {
            title: 'Continuar ou recomeçar',
            body: 'Cada lição pode ser retomada e reposta individualmente; «recomeçar tudo» também existe. O que é reposto é o ensino, não a sua memória.',
          },
          {
            title: '«Praticar» abre uma ronda só desse método',
            body: 'O botão leva a uma sala de prática onde só aparece esse método. Escolher a duração, começar — o resto da aplicação fica onde está.',
          },
        ],
      },
      {
        title: 'Cópia de segurança e segundo aparelho',
        items: [
          {
            title: 'O ficheiro de cópia',
            body: 'Em «Cópia de segurança» a aplicação escreve tudo num ficheiro. É seu e não precisa de conta nenhuma.',
          },
          {
            title: 'Google Drive, se quiser',
            body: 'Facultativo. O ficheiro vai parar ao seu próprio Drive, não a um servidor nosso. Viaja o estado inteiro: datas, medições, nível, conteúdos próprios e o que já aprendeu.',
          },
          {
            title: 'A caixa ao iniciar sessão',
            body: 'A Google mostra a autorização do Drive como uma caixa à parte, e não vem assinalada. Se ficar vazia, a aplicação não consegue guardar nada — e dir-lhe-á qual faltou.',
          },
        ],
      },
      {
        title: 'Quando algo emperra',
        items: [
          {
            title: 'A aplicação mostra uma versão antiga',
            body: 'Depois de uma atualização, o aparelho serve mais uma vez a versão anterior e carrega a nova em segundo plano. Basta fechar e voltar a abrir.',
          },
          {
            title: 'O Drive diz «sem autorização»',
            body: 'Quase sempre é a caixa vazia acima. Terminar sessão, entrar de novo, assinalar.',
          },
          {
            title: 'Sem rede',
            body: 'Tudo funciona sem ligação, exceto a sincronização. A aplicação está no seu aparelho, não num servidor.',
          },
          {
            title: 'Apagar tudo',
            body: 'Em «Definições». A aplicação pede antes que escreva uma palavra, para que um toque errado não faça nada.',
          },
        ],
      },
    ],
    faqHeading: 'Perguntas e respostas',
    faqIntro:
      'As perguntas que nos fizeram — com as respostas que conseguimos sustentar e as lacunas onde não conseguimos.',
    groups: [
      {
        title: 'Sobre a ANITEW',
        entries: [
          {
            q: 'O que significa o nome ANITEW?',
            a: 'Foi escolhido porque não significava nada — ao contrário de MEMORA, MNEMO ou RECALL, que se entendem de imediato e por isso estão tomados cem vezes. O sentido devia ser levado pelo subtítulo: «Train your memory. Measure your progress. Remember more.» Foi a pesquisa do nome que revelou que «anitew» é uma palavra real: em twi, a língua akan do Gana, Na Bíblia acã surge em Daniel 1:17 ao lado de «nimdeɛ» (conhecimento), onde as versões inglesas trazem «knowledge and skill». Designa, portanto, a inteligência, a perspicácia, o discernimento. «ani» quer dizer olho, e o nome pode ler-se como «o olho está aberto»; essa leitura não a conseguimos comprovar. Não o escolhemos por isso e não prometemos nada disso: nenhuma aplicação distribui inteligência. Que uma palavra pensada vazia tenha ido cair justamente aí agrada-nos, ainda assim.',
          },
          {
            q: 'Em que assenta a aplicação?',
            a: 'Em dois resultados que se aguentam há décadas. Primeiro: tirar algo da cabeça fixa-o com mais força do que voltar a olhar para ele — por isso cada ronda tem uma metade de recordação e nenhuma de leitura. Segundo: a repetição funciona melhor distribuída do que amontoada — por isso a aplicação marca datas em vez de percorrer uma lista. Todo o resto é ofício à volta destes dois pontos.',
          },
          {
            q: 'O que distingue a ANITEW de outras aplicações do género?',
            a: 'Quatro coisas, e as quatro são renúncias. Nenhum número inventado: sem pontos, sem níveis, sem potência cerebral em percentagem. Sem conta e sem nuvem obrigatória: a aplicação está no seu aparelho e funciona sem ligação. Ensina a técnica em vez de apenas interrogar. E diz o que não sabe, em vez de calar essa parte.',
          },
          {
            q: 'Isto vai tornar-me mais inteligente?',
            a: 'Não — nada que pudéssemos afirmar, pelo menos. Que se melhora naquilo que se pratica está bem demonstrado. Que isso se transfira para o que não se praticou não está, e a má fama de todo este género vem da confusão entre as duas frases. Não o medimos, portanto não o afirmamos.',
          },
        ],
      },
      {
        title: 'Números e medição',
        entries: [
          {
            q: 'Porque não há pontos nem níveis?',
            a: 'Porque uma moeda inventada pode produzir qualquer sensação que se queira produzir: o seu número é arbitrário e a sua escala também. Mudar-lhe o nome não teria curado nada. No seu lugar está um acontecimento que realmente sucedeu — o reencontro: uma informação que voltou a ser perguntada depois do seu primeiro dia. Esse número não sobe praticando mais tempo. Chega quando algo vence.',
          },
          {
            q: 'Qual é a diferença entre a pontuação de treino e a medição?',
            a: 'A pontuação de treino nasce de passagem em cada sessão e diz como correu hoje. A medição é um teste curto e separado, de duas em duas semanas, sempre com a mesma estrutura — com conteúdos que não existem em mais lado nenhum da aplicação e que nunca entram no plano de revisão. O que aí se pergunta nunca o praticou. Só por isso o resultado diz alguma coisa.',
          },
          {
            q: 'Porque é que os rostos parecem desenhados?',
            a: 'Porque nascem no código em vez de virem de uma coleção. Um conjunto fixo de imagens esgota-se em duas semanas e a partir daí mede o reconhecimento, não a memória. Fotografias de pessoas vivas estão excluídas por razões legais — por isso as personalidades conhecidas não têm imagem nenhuma, apenas nome, ano, área e origem.',
          },
        ],
      },
      {
        title: 'Praticar no dia a dia',
        entries: [
          {
            q: 'Com que frequência e durante quanto tempo?',
            a: 'Cinco minutos por dia é o desenho — não porque mais faça mal, mas porque a prática distribuída funciona melhor do que a amontoada. Um minuto num dia mau vale mais do que uma semana saltada.',
          },
          {
            q: 'Saltei dias. Está tudo perdido?',
            a: 'Não, e também não lhe será posta uma montanha à frente. A aplicação leva para uma sessão apenas o vencido que cabe no tempo escolhido; o resto vem nos dias seguintes. O atraso recupera-se ao longo de vários dias, não num só.',
          },
          {
            q: 'Porque é a aplicação a decidir o que aparece?',
            a: 'Porque o sabe pelas suas respostas e não pela vontade do momento. Se quiser trabalhar um método concreto, a sala de prática em «Aprender» serve exatamente para isso.',
          },
        ],
      },
      {
        title: 'Dados, custo, aparelhos',
        entries: [
          {
            q: 'Preciso de uma conta?',
            a: 'Não. Sem qualquer início de sessão funciona tudo, exceto a sincronização através do Google Drive — e essa é voluntária.',
          },
          {
            q: 'Onde estão os meus dados?',
            a: 'No seu aparelho. Se ligar a sincronização, também no seu próprio Google Drive. Não existe servidor nenhum com os seus dados de treino. O que vai exatamente para onde está explicado na secção de privacidade.',
          },
          {
            q: 'Quanto custa a aplicação?',
            a: 'Nada. E o que mede, treina e lembra continua gratuito, mesmo que um dia venha a existir uma oferta paga. Uma aplicação cuja promessa é «medimos com honestidade» perde essa promessa no momento em que a medição custa dinheiro.',
          },
          {
            q: 'Posso apagar tudo?',
            a: 'Sim, em «Definições», protegido por uma palavra que tem de ser escrita. É apagado no aparelho — e, se a sincronização estava ligada, também o ficheiro no seu Drive.',
          },
        ],
      },
    ],
    evidenceNote:
      'De onde vem o que aqui afirmamos — e onde o saber acaba: em «O que está comprovado».',
  },
}

/**
 * Die Texte für eine Sprache, mit Englisch als Rückfall.
 *
 * Wie überall in diesem Ordner: Eine Sprache ohne eigenen Eintrag bekommt
 * Englisch und keine leere Seite.
 */
export function helpCopyFor(language: string): HelpCopy {
  return COPY[language] ?? COPY[FALLBACK]!
}
