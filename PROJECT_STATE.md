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
