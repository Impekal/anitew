# PROJECT STATE — ANITEW

Das laufende Gedächtnis dieses Projekts. Jede Session hängt unten an, was sie
getan hat, warum sie es so getan hat, und was sie dabei falsch angefangen hat.
Die Irrwege bleiben stehen — sie sind der Teil, der beim nächsten Mal Zeit
spart.

Neuestes am Ende. Wer einsteigt, liest von hinten.

Verwandte Dateien: [`docs/BACKLOG.md`](docs/BACKLOG.md) (was zu tun ist),
[`docs/DECISIONS.md`](docs/DECISIONS.md) (was entschieden ist und warum).

---

## 2026-08-17 · Die Aufgabenliste

Ausgangspunkt war ein Produktgespräch (Chat-Protokoll `Anitew.docx`): eine
Gedächtnis-App, die mit 5 Minuten am Tag auskommt, wirklich wirkt und dabei
nicht das übliche Brain-Training-Versprechen wiederholt.

Daraus wurde `docs/BACKLOG.md`: 19 Abschnitte von Fundament bis Store-Weg,
Meilensteine M0–M7, und neun Fragen, die nur der Auftraggeber beantworten kann.

Drei Regeln stehen über der Liste, weil sie im Gespräch die eigentliche Aussage
waren und alles andere von ihnen abhängt:

- **R-1** Keine erfundenen Zahlen. Trainingsscore und gemessene
  Gedächtnisleistung sind zwei Dinge und werden nie vermischt.
- **R-2** Kein Versprechen ohne Messung.
- **R-3** Nicht browser-only. Local-first, modular.

## 2026-08-17 · Die neun Fragen sind beantwortet

Alle Antworten stehen mit Begründung in `docs/DECISIONS.md` als D-001 bis
D-010. Kurz: **ANITEW** heißt es; kostenlos mit Spende; React/TS/Vite/Dexie;
**FSRS** als Wiederholungsalgorithmus; Gesichter erzeugt ein Generator statt
einer Bildersammlung; der Benchmark ist ausformuliert; Deutsch ist die
Quellsprache, der erste Start folgt der Systemsprache; die Streak hält ab 60
Sekunden; abgeglichen wird in die Cloud des Nutzers, nicht in unsere.

Vier der neun Antworten lauteten sinngemäß „verstehe ich nicht, nimm deinen
Vorschlag“. Deshalb steht in `DECISIONS.md` bei diesen Punkten zusätzlich, was
der Vorschlag kostet und was er ausschließt — damit später nachvollziehbar
bleibt, worauf sich das Ja bezogen hat.

Eine Antwort wurde bewusst weiter ausgelegt als wörtlich: Auf „lizenzfrei, am
besten du generierst sie“ wäre die naheliegende Umsetzung ein paar tausend
KI-Bilder im Repo gewesen. Es wurde stattdessen ein Generator im Code (D-005) —
eine feste Sammlung ist nach zwei Wochen durchgesehen, und dann misst die App
Wiedererkennen statt Gedächtnis. Das ist im Kern derselbe Fehler, vor dem R-1
schützen soll, nur eine Ebene tiefer.

## 2026-08-17 · M0 — das Fundament steht

Gebaut: Vite 6 + React 18 + TypeScript strict, PWA (Manifest, Service Worker,
offline lauffähig), Dexie-Schema in Version 1 mit festgeschriebener
Migrationsregel, Plattform-Adapter, i18n mit Deutsch und Englisch, CI, ein
vorläufiges Zeichen, Cloudflare-Konfiguration.

**Was hier mehr ist als Gerüst — vier Dinge, die absichtlich so und nicht
anders sind:**

*Der Kern wird zweimal übersetzt.* `tsconfig.core.json` baut `src/core/` ohne
die DOM-Bibliothek und mit leerem `types`. Wer dort `window` oder `document`
anfasst, bekommt einen Übersetzungsfehler — in der Entwicklung und in der CI.
Das ist D-010 als Mechanik statt als guter Vorsatz. Gegengeprüft: ein
absichtlicher Verstoß wurde eingebaut, die Prüfung schlug fehl, der Verstoß
wurde entfernt. Eine Sperre, die man nicht auslösen gesehen hat, ist keine.

*Der Tag beginnt um 4 Uhr, nicht um Mitternacht* (`src/core/time.ts`). Wer um
0:30 trainiert, meint den Tag davor. Mitternacht als Grenze würde ihm die
Streak zerreißen und ihn zwingen, binnen 23,5 Stunden zweimal zu trainieren.

*Kein `Math.random()`.* Aller Zufall kommt aus `createRng(seed)`. Ohne das ist
ein Fehlerbericht wertlos und der Simulator aus C9 kann nichts beweisen.

*Version 1 des Datenbankschemas wird nie mehr angefasst.* Steht als Regel oben
in `src/data/db.ts`. Trainingshistorie ist nicht wiederherstellbar: Ein
verlorenes Dokument importiert man neu, eine verlorene Vergessenskurve nicht.
Aus demselben Grund liegen Benchmark-Läufe in einer eigenen Tabelle und nicht
als Sonderfall in `sessions` — R-1 bis ins Schema gezogen, damit eine spätere
Auswertung die beiden Zahlen nicht aus Versehen vermischt.

**Anzeige statt Attrappe.** M0 hat kein Training, also gibt es nichts zu
zeigen. Statt einer Mockup-Oberfläche mit Beispielwerten schreibt die App bei
jedem Start in die Datenbank und liest zurück, was dort steht. Wenn „bisher
4-mal geöffnet, zum ersten Mal am …“ nach einem Neustart noch stimmt, sind
Datenbank, Zeitrechnung und Adapter bewiesen in Ordnung. Die Anzeige
verschwindet mit M1 und enthält ausdrücklich keine erfundene Zahl.

**Geprüft:** 43 Kern-Tests in Node (ohne Browser, was zugleich D-010 belegt) und
6 E2E-Tests gegen den gebauten Stand, in Chromium und im Telefonprofil. Der
E2E-Lauf prüft unter anderem, dass die App die Gerätesprache übernimmt, dass
Schwedisch auf Englisch fällt statt ins Leere, dass die Sprachwahl einen
Neustart überlebt und dass das Manifest ein maskable Icon hat — ohne das
schneidet Android das Zeichen in einen Kreis und trifft daneben.

**Zwei Stolpersteine, die Zeit gekostet haben** (damit sie es nicht wieder tun):

1. `MODES[id]` liefert für `id = 'toString'` brav eine Funktion vom Prototyp
   statt `undefined`. Da Modi aus der Datenbank kommen, ist das ein echter
   Weg hinein — jetzt `Object.hasOwn`. Der Test dafür stand vor dem Fund.
2. Der erste E2E-Lauf schlug fehl, weil Playwright die Umgebung auf `en-US`
   stellt, die Erwartungstexte aber deutsch waren. Genau das Verhalten, das
   D-007 vorschreibt — die App hatte recht, der Test hatte unrecht. In
   `playwright.config.ts` steht jetzt `locale: 'de-DE'`.

**Noch offen aus M0:** Das Zeichen ist vorläufig (fünf Punkte mit wachsenden
Abständen — die Wiederholungskurve aus D-004), bis die Markenrecherche R3
durch ist. Für die Veröffentlichung bei Cloudflare fehlen `CLOUDFLARE_API_TOKEN`
und `CLOUDFLARE_ACCOUNT_ID` in den Repo-Einstellungen; solange sie fehlen,
baut die CI und überspringt das Veröffentlichen still.

**Als Nächstes: M1** — die erste echte 5-Minuten-Session, unterbrechungsfest,
mit Encode und Recall, jeder Antwort im Ereignisprotokoll.

## 2026-08-17 · M1 — eine Einheit läuft durch

Einprägen und freier Abruf, in Runden, mit hartem Zeitbudget. Der Knopf auf dem
Startbildschirm führt jetzt in ein echtes Training statt in einen Hinweis.

**Das Zeitbudget ist eine Zusage.** Die Summe aller Blöcke ist auf die Sekunde
die Länge des Modus — geprüft für alle vier Modi im Kern-Test und einmal in
echter Zeit im Browser (der E2E-Test wartet 60 Sekunden ab und misst nach). Der
Rest einer Division wandert nach vorn: lieber die erste Runde eine Sekunde
länger als am Ende eine Einheit, die 4:59 dauert. Umgekehrt ist das Budget eine
*Obergrenze* — wer früher fertig ist, ist früher fertig. Zeit zurückzuhalten,
damit die Zahl stimmt, wäre Beschäftigung statt Training.

**B3 wurde nicht behauptet, sondern zugeschnitten.** Die Blockstruktur aus dem
Produktgespräch nennt fünf Blöcke; Module gibt es für zwei. Statt Focus,
Working Memory und Spaced Recall als leere Hüllen zu bauen, plant der Planer
Runden aus Einprägen und Abrufen — und wächst, sobald die Module da sind. Im
Backlog steht B3 deshalb auf 🟨 und nicht auf ✅.

**Die Bewertung ist absichtlich großzügig.** Umlaute und Akzente werden
gefaltet („Bäcker“ = „Baecker“ = „backer“), ab fünf Zeichen ist ein Tippfehler
erlaubt, auch die Vertauschung zweier Nachbarn. Unter fünf Zeichen gilt die
Toleranz nicht — dort ist ein Buchstabe Unterschied oft ein anderes Wort
(„Igel“/„Egel“). Der Grund ist nicht Nachsicht, sondern Messgenauigkeit:
Gemessen werden soll das Gedächtnis, nicht die Rechtschreibung und nicht die
Tastatur. Eine strengere Zahl wäre kleiner, aber nicht richtiger — und nach
R-1 ist eine falsche Zahl schlimmer als eine milde. Ein Test hält die andere
Richtung fest: Wer sechsmal Unsinn eintippt, bekommt null Treffer. Eine
Bewertung, die bei genug Rateversuchen irgendwann trifft, wäre genau die
erfundene Zahl, die R-1 verbietet.

**Unterbrechungsfest heißt: nach jedem Wort.** Der Fortschritt wird alle vier
Sekunden geschrieben, nicht am Blockende — bei einer Fünf-Minuten-Einheit wäre
ein verlorener Block ein Drittel. Der E2E-Test prüft den harten Fall: Die Seite
wird mitten im Einprägen neu geladen, nicht sauber verlassen. Danach steht
„Fortsetzen“ da.

**Das Ereignisprotokoll führt je Wort Buch**, nicht „6 von 8“. Ohne diese
Auflösung gäbe es später keine Vergessenskurve pro Information — und die ist
der Kern von D-004.

**Bewusst nicht gebaut: die Streak.** Sie wäre billig gewesen und hätte die App
sofort motivierender gemacht. Aber D-008 verspricht Schutztage, und eine Streak
ohne sie bricht hart — genau das, wovor die Entscheidung schützen soll. Lieber
zwei Wochen ohne Streak als eine, die das Versprechen bricht. Kommt vollständig
mit M4.

**Geprüft:** 73 Kern-Tests, 10 E2E-Tests (Chromium und Telefonprofil).

**Ein Stolperstein:** Der Test, der das Zeitbudget nachmisst, lief in Playwrights
30-Sekunden-Grenze — nicht in einen Fehler der App. Eine 60-Sekunden-Einheit
braucht mehr als 30 Sekunden Testzeit. Er hat jetzt seine eigene Grenze und
misst gleich mit, dass die Einheit weder zu kurz noch zu lang war.

**Als Nächstes: M2** — die Engine, die entscheidet, was heute drankommt:
Wiederholungsplan nach FSRS, Gedächtnisprofil, Spaced Recall aus den Tagen
davor. Erst dort wird aus einer Übung ein Training.
