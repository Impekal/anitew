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

## 2026-08-17 · D-011 — die Oberfläche bekommt eine Aufgabe

Drei Vorgaben kamen nacheinander herein, und die dritte stand scheinbar gegen
die erste: *schön, angenehm, auf Seele wirkend* — dann *auch unterhaltsam* —
dann *futuristisch, vielleicht neuronal*.

Alle drei liegen jetzt als **D-011** mit acht Regeln (G-1…G-8) im
Entscheidungsprotokoll, weil es sonst Geschmacksfragen geblieben wären, über
die man in drei Monaten wieder streitet. Zwei der Regeln waren echte
Konfliktlösungen und nicht bloß Beschreibung:

**„Unterhaltsam“ gegen „Ruhe statt Reiz“** (G-7). Auflösung: Vergnügen kommt
nicht aus Reiz, sondern aus Inhalt mit Einfall (Missionen, Palast — das ist
M4), aus Abwechslung, aus Spielgefühl im Kleinen, und am Ende aus dem eigenen
Fortschritt. Ehrlich festgehalten: In M1 lassen sich nur die mittleren beiden
einlösen. Eine Oberfläche, die schon jetzt so tut, als wäre sie ein Spiel, wäre
eine Attrappe.

**„Futuristisch“ gegen „warm, nicht kalt“** (G-8). Der naheliegende Weg wäre
Cyberpunk gewesen — Neon, Raster, Blauschwarz — und hätte alles zerstört, was
vorher aufgebaut war. Die Auflösung ist eine Arbeitsteilung: **Warm ist der
Inhalt, kühl ist die Technik.** Serife für alles, was der Mensch beiträgt;
Schreibmaschinenschrift für alles, was die App misst; Bernstein für den
Menschen, kühles Grün für das Netz. „Neuronal“ wird dabei wörtlich genommen und
nicht als Dekor — Knoten und Verbindungen sind bereits die Form dieser App
(Wiederholungskurve, Punktekette, später der Palast als Graph), sie werden nur
sichtbar gemacht.

**Was gebaut wurde:** warme Palette in beiden Modi, Serife und Mono statt einer
Einheitsschrift, ein 3-Sekunden-Ankommen mit atmendem Kreis statt eines
Countdowns, das Wort beim Einprägen allein auf dem Bildschirm, eine Punktekette
mit wanderndem Signal statt „3 / 8“, getippte Wörter, die als Marken landen,
ein Ergebnis, das sich aufblättert, und ein Netz aus 30 Knoten im Hintergrund.

**Weggenommen wurde mehr als hinzugefügt.** Der Systemcheck aus M0 hatte den
Startbildschirm beherrscht — er liegt jetzt zusammengeklappt am Fuß. Über dem
Startknopf stand ein Etikett, das nichts erklärte. Die Modusknöpfe hießen „Ich
habe 15 Minuten“ und brachen auf dem Telefon um; die Frage steht jetzt einmal
darüber, die Knöpfe tragen nur noch die Zeit.

**Ein Fehler, der eine Weile unsichtbar war:** Das Netz stand vollständig im
DOM, mit richtigen Farben und Maßen — und war trotzdem nicht zu sehen. Ursache
war die Malreihenfolge von CSS: Der Hintergrund eines Blockelements wird
*nach* den Ebenen mit negativem z-index gezeichnet. Die Grundfarbe stand auf
`body` und hat alles zugedeckt, auch den Lichtschein, der schon vorher
unsichtbar gewesen war, ohne dass es jemandem aufgefallen wäre. Jetzt steht sie
auf `html`. Notiert, weil das Symptom („Element ist da, Element ist unsichtbar“)
zu einer langen Suche an der falschen Stelle einlädt.

**Der zweite Anlauf war die eigentliche Arbeit.** Die erste Fassung des Netzes
war zu laut: wenige große Dreiecke quer über den Text — eine Grafik statt eines
Hintergrunds. Jetzt kürzere Verbindungen, mehr und kleinere Knoten, geringere
Deckkraft und eine Maske, die die Mitte frei hält. Ein Hintergrund, der mit dem
Inhalt um Aufmerksamkeit streitet, ist ein Fehler, egal wie hübsch er ist.

**Bewusst nicht gebaut:** Haptik. Eine Vibration alle vier Sekunden wäre keine
Wärme, sondern Nerverei (O6 bleibt offen).

## 2026-08-17 · Das Netz, dritter Anlauf

Rückmeldung: zu dünn — und der Einwand, dass es besser sei, das Netz *hinter*
den Inhalt zu stellen, statt es aus der Mitte herauszuschneiden. Beides
zutreffend, und der zweite Punkt zeigte auf einen Fehler, der bis dahin für
Gestaltung gehalten wurde.

**Der eigentliche Grund für „zu dünn“ war ein Zuschnittfehler, keine
Linienstärke.** Das Feld war 100 × 100, wurde aber mit `slice` auf einen
Bildschirm von 390 × 844 gelegt. Die Skalierung richtet sich dabei nach der
größeren Seite — sichtbar blieben also nur rund 46 der 100 Einheiten in der
Breite, gut zwei von fünf Knotenspalten. Das Netz war nie dünn; es war
beschnitten. Jetzt ist das Feld hochkant (100 × 210) mit 50 Knoten, und Linien
wie Knoten sind auf den neuen Maßstab umgerechnet.

**Dämpfen statt schneiden.** Die Maske nahm die Mitte vorher vollständig heraus
(Alpha 0). Das beruhigte den Text und riss ein Loch in ein Netz, dessen ganzer
Sinn Zusammenhang ist. Jetzt läuft es durchgehend über den Bildschirm und
tritt in der Mitte nur zurück (Alpha 0,3).

**Und die Präsenz hängt jetzt vom Bildschirm ab.** In voller Dichte war das
Netz auf dem Startbildschirm richtig und beim Einprägen falsch: Dort steht ein
einziges Wort im Mittelpunkt, und fünfzig Knoten dahinter sind kein
Hintergrund mehr, sondern ein Mitbewerber (G-2). Während einer laufenden
Einheit blendet es deshalb auf ein Achtel herunter und danach wieder auf. Das
ist der beste Teil des ganzen Umbaus, und er ist erst durch den Einwand
entstanden: Die Aufmerksamkeit verengt sich, also verengt sich das Bild mit.

## 2026-08-17 · Das Netz, vierter Anlauf — und der Fehler dazwischen

Rückmeldung: deutlich dünner, kaum sichtbar.

Der Weg dahin ging einmal zu weit in die andere Richtung, und das gehört
festgehalten, weil der Denkfehler naheliegt: Nachdem der Zuschnitt behoben war
(Feld hochkant statt quadratisch), reichte das Netz plötzlich über den ganzen
Bildschirm statt über einen Streifen. Die Verstärkung von Linien und Knoten aus
dem Anlauf davor war eine Reaktion auf den Zuschnittfehler gewesen — mit dem
behobenen Zuschnitt war sie nicht mehr nötig, sondern zu viel. Zwei
Korrekturen für dasselbe Symptom, und die zweite hob die erste auf.

Jetzt: Linienstärke 0,16 statt 0,38, Knoten 0,4–0,7 statt 0,85–1,55, Deckkraft
0,32 im Dunkeln und 0,2 im Hellen. Während einer Einheit 0,07. Das Netz ist
Textur, nicht Zeichnung.

Die Faustregel steht jetzt in D-011/G-8, damit die nächste Änderung nicht
wieder zwischen den Extremen pendelt: **Wer das Netz auf dem Startbildschirm
bemerkt, bevor er den Knopf sieht, hat es zu stark eingestellt.**

## 2026-08-17 · Die App ist live

https://anitew.impekaltech.workers.dev — Cloudflare Workers, statische Dateien,
kein Backend. Jeder Push auf den Arbeitszweig veröffentlicht.

Zwei Dinge, die dabei Zeit gekostet haben und beim nächsten Projekt nicht
wieder kosten müssen:

**Die Account ID musste niemand suchen.** Sie stand längst im Klartext in
RReaders `deploy.yml` — dieselbe Kennung, dasselbe Konto. Sie ist kein
Geheimnis (ohne Token nutzlos), also steht sie jetzt auch bei ANITEW fest in
der Workflow-Datei statt als Secret. Für die Einrichtung bleibt damit genau ein
Handgriff übrig: das API-Token.

**Der Knopf „Run workflow“ fehlt.** GitHub zeigt die manuelle Auslösung nur an,
wenn die Workflow-Datei auf dem Standard-Branch liegt. `deploy.yml` liegt aber
bisher nur auf dem Arbeitszweig. Ausgelöst wird deshalb über einen Push — beim
ersten Mal über einen leeren Commit.

**Und eine Falle beim Prüfen:** Von dieser Entwicklungsumgebung aus ist
`*.workers.dev` nicht erreichbar (der Proxy antwortet mit 403 auf den
CONNECT-Tunnel). Das sieht nach einem fehlgeschlagenen Deploy aus, ist aber
keiner — gegengeprüft mit dem nachweislich laufenden RReader, das denselben
Fehler liefert. Verlässlich ist allein das Protokoll des Workflows:
`Deployed anitew triggers` plus die URL.

## 2026-08-17 · Leuchten und Töne (D-011/G-9)

Rückmeldung nach dem ersten Tag auf dem echten Telefon: „könnte schöner sein
trotz angenehm — spielerischer, unterhaltsamer, Leuchtungen, Töne“. Angenehm
allein ist eben noch nicht schön; die Oberfläche war stumm und matt.

**Ton wird erzeugt, nicht mitgeliefert.** Kein Audiofile im Repo — alles
entsteht zur Laufzeit aus Sinusschwingungen (`platform/web/sound.ts`).
Derselbe Gedanke wie bei den Gesichtern (D-005): kein Gewicht, keine Lizenz,
offline vollständig, unendlich variierbar. Alle Töne kommen aus einer
pentatonischen Tonleiter, die keine Halbtonschritte kennt — dadurch kann keine
Reihenfolge falsch klingen, egal wie die Ereignisse fallen. Beim Einprägen
steigt die Tonhöhe mit jedem Wort: Man hört, wie weit die Runde ist, ohne
hinzusehen.

Zwei Browser-Eigenheiten sind darin gelöst: iOS gibt keinen Ton ohne
Berührung, deshalb entsteht der AudioContext erst beim ersten `play()` — und
das erste `play()` ist der Startknopf. Und der Kontext wird angehalten, wenn
die App in den Hintergrund geht, sonst klingt es aus der Tasche.

**Licht ist Material, kein Feuerwerk.** Der Startknopf atmet in einem Schein,
jedes Wort leuchtet beim Erscheinen auf und beruhigt sich, gelandete Marken
glimmen kurz nach, sieben der fünfzig Netzknoten glühen in der Akzentfarbe.
Nur sieben, weil `drop-shadow` je Element gerechnet wird — fünfzig würden auf
einem älteren Telefon die Uhr der Einheit ins Stocken bringen.

**Eine Grenze, die dabei gehalten wurde:** Kein Ton bewertet. Keine Fanfare
für eine richtige Antwort, kein Trauerakkord für eine falsche. Das wäre die
billige Variante aus G-7 und zugleich ein Urteil, das der App nach G-5 nicht
zusteht.

**Zwei Fehler auf dem Weg, beide lehrreich:**

1. Beim Einführen der neuen Leucht-Variablen wurde `--glow` entfernt — das
   aber an drei Stellen noch benutzt wurde. Ein Verweis auf eine nicht
   definierte CSS-Variable macht die ganze Eigenschaft ungültig, still und
   ohne Fehlermeldung. Aufgefallen ist es nur, weil ein Textabgleich im
   Änderungsskript nicht passte. `--glow` ist jetzt wieder da.

2. **Eine echte Wettlaufsituation, gefunden vom E2E-Test.** „Verwerfen und neu
   beginnen“ blendete die Einheit sofort aus und löschte sie *nebenher* aus
   der Datenbank. Wer unmittelbar danach die App neu lud, bekam die verworfene
   Einheit zurück — das Neuladen überholte den Schreibvorgang. Der Test schlug
   nur im vollen Lauf fehl und einzeln nie, also genau das Muster, das man
   gern als Flackern abtut. Jetzt wird erst gelöscht und dann ausgeblendet;
   dasselbe gilt beim Abbrechen einer laufenden Einheit.

**Und eine Layout-Korrektur:** Der Ergebnisbildschirm hatte den Zurück-Knopf
per `margin-top: auto` am unteren Rand und dazwischen ein Loch von einer
halben Bildschirmhöhe. Bei einem kurzen Ergebnis — dem Normalfall — sah das
aus, als fehlte etwas. Jetzt steht alles als ein Block in der Mitte.

**Und derselbe Fehler noch einmal, an zweiter Stelle.** Kaum war die
Wettlaufsituation beim Verwerfen behoben, fiel der neue Tonschalter-Test auf
dieselbe Weise um: Die Wahl wurde nebenher geschrieben, die Anzeige wechselte
sofort — wer unmittelbar neu lud, bekam den alten Zustand zurück. Beide Male
war das Muster identisch (nur im vollen Lauf rot, einzeln nie), und beide Male
war es kein Flackern.

Daraus eine Regel für alles Weitere: **Was gespeichert werden muss, wird erst
angezeigt, wenn es gespeichert ist.** Sofortige Rückmeldung darf davon
abweichen, wo sie nichts behauptet — der Ton schaltet weiterhin ohne Verzögerung
um, weil er nur ein Geräusch ist. Ein *Schalter* dagegen behauptet einen
Zustand, und ein Schalter, der etwas anderes zeigt als das Gespeicherte, ist
ein kaputter Schalter.

**Geprüft:** 73 Kern-Tests, 24 E2E-Läufe.
