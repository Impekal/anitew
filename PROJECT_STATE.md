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

## 2026-08-17 · M2 — die App vergisst nicht mehr, was du vergessen hast

Bis hierher war ANITEW eine Übung: Wörter einprägen, abrufen, fertig. Ab jetzt
ist es ein Training. **Was du heute lernst, kommt an seinem Tag von selbst
zurück** — und „sein Tag“ ist für jedes Wort ein anderer.

**FSRS, und zwar das echte.** `ts-fsrs` (MIT, keine eigenen Abhängigkeiten,
von Open Spaced Repetition). Die Lizenz wurde **vor** dem Einbau geprüft, wie
D-004 es verlangt, und steht in `THIRD_PARTY_LICENSES.md`. Der naheliegende
Weg wäre gewesen, die Formeln selbst nachzubauen — dabei hätte ich die
Gewichte aus dem Gedächtnis geschrieben und das Ergebnis trotzdem „FSRS“
genannt. Das wäre eine Behauptung gewesen, keine Umsetzung.

Vier Anpassungen, jede begründet in `core/scheduler/memory.ts`:

- **Keine Zufallsstreuung.** FSRS kann Intervalle leicht verwürfeln; das
  braucht Zufall und bräche A11. Gegen Stapelbildung hilft stattdessen die
  Obergrenze in `due.ts`.
- **Keine Schritte innerhalb eines Tages.** ANITEW ist eine App für einmal
  täglich; ein Intervall von zehn Minuten hätte hier keinen Ort.
- **Tage statt Zeitstempel**, intern auf 12 Uhr UTC abgebildet. Von der
  Tagesmitte aus sind es zu beiden Rändern zwölf Stunden Luft — keine
  Zeitumstellung und keine Rundung kann ein Intervall um einen Tag verschieben.
- **Zwei Noten statt vier.** Freier Abruf kennt „erinnert“ und „nicht
  erinnert“. Nach dem Gefühl zu fragen und das als Messung zu verbuchen wäre
  bequem und nach R-1 falsch.

**Der Berg, an dem andere Apps scheitern.** Wer zwei Wochen nicht öffnet,
bekommt bei Karteikarten-Apps 800 fällige Karten und kommt nicht wieder.
`dueLimitFor` deckelt auf das, was in die gewählte Zeit passt, höchstens zwölf,
am längsten Überfälliges zuerst. Der Preis ist ehrlich benannt: Der Rückstand
wird über mehrere Tage abgebaut statt an einem. Das ist langsamer — und der
einzige Weg, der überhaupt zu einem zweiten Tag führt.

**Zwei Zahlen, nicht eine.** Das Wiedersehen zählt getrennt vom heute
Gelernten. Sie zu verrechnen wäre bequem und falsch: Etwas nach drei Tagen zu
erinnern ist eine andere Leistung, als es zwei Minuten nach dem Einprägen
abzurufen. Dieselbe Trennung wie zwischen Trainingsscore und Benchmark.

**Zwei Fehler, beide von Tests gefunden:**

1. **Ein fälliges Wort konnte am selben Tag als „neu“ eingeprägt werden.** Der
   Planer zog aus dem vollen Vorrat, ohne die Wiederholungswörter
   herauszunehmen. „Anker“ wäre dann zwei Minuten vor der Abfrage gezeigt
   worden — der Abruf hätte nicht die Erinnerung von vorgestern gemessen,
   sondern die von eben. Genau der Fehler, vor dem C5 und C6 warnen, und ein
   Test hat ihn im ersten Lauf gefunden.

2. **Der E2E-Test wollte die Auswahl des Schedulers erraten.** Er tippte zwei
   der gelernten Wörter ein und erwartete zwei Treffer — und bekam null, weil
   die Auswahl gedeckelt und alphabetisch geordnet ist und diese beiden nicht
   dabei waren. Kein Fehler der App, sondern eine falsche Annahme im Test. Er
   tippt jetzt alles ein und prüft, dass alles Fällige als richtig zählt.

**Und eine Eigenheit der Bibliothek, nachgemessen statt geraten:** `ts-fsrs`
überschreitet die eingestellte Höchstdauer am Anschlag um genau einen Tag
(3651 statt 3650). Belanglos bei zehn Jahren Abstand, aber es steht jetzt im
Code und im Test, damit niemand die Grenze für exakt hält.

**Bewusst nicht gebaut: das Gedächtnisprofil (E1–E7).** Es gehört zu M2 und
fehlt. Der Grund: Ein Profil über acht Bereiche braucht acht Bereiche. Mit
einem einzigen Modul wäre die „Memory DNA“ ein einzelner Balken, der so tut,
als wüsste er etwas über Zahlen, Gesichter und Räume — also genau die Attrappe,
die R-1 verbietet. Es kommt, wenn die Module aus D9–D13 da sind.

**Geprüft:** 95 Kern-Tests (darunter der Simulator aus C9 über 120 und 400
Tage) und 28 E2E-Läufe. Der wichtigste davon datiert die Datenbank vor, statt
drei Tage zu warten: Er prüft die ganze Kette — Termin lesen, auswählen, in
den Plan legen, abfragen, zurückschreiben.

## 2026-08-17 · Im Hellen leuchtete nichts

Rückmeldung vom Telefon mit einem Bild: heller Modus, kein Schein zu sehen.
Nachgestellt und bestätigt — mein eigenes Testbild sah genauso aus. Der Fehler
lag nicht an den Werten, sondern an einer falschen Annahme.

**Auf Papier kann man nicht mit Licht leuchten.** Der Hintergrund ist schon
fast weiß; ein heller Schein daneben verschwindet darin. Im ersten Anlauf hatte
der helle Modus dieselbe Art Schein wie der dunkle, nur abgeschwächt und mit
kräftiger negativer Streuung — das Ergebnis war exakt nichts.

Ein Leuchten auf hellem Grund ist ein **warmer, satter Schein, der dunkler ist
als das Papier**: physikalisch ein farbiger Schatten, im Auge ein Glühen. Also
kräftige Farbe, echte Deckkraft, kaum negative Streuung, leicht nach unten
versetzt. Im Dunkeln bleibt es umgekehrt ein Bloom nach allen Seiten.

Die Lehre, die über diesen Fall hinausgeht: **Zwei Farbschemata sind nicht ein
Entwurf mit zwei Helligkeiten.** Manches muss man umkehren, nicht dimmen.

Nebenbei abgesichert: Vor jeder `color-mix`-Zeile steht jetzt ein einfacher
rgba-Wert. Kennt ein Browser `color-mix` nicht, wäre sonst die ganze
Eigenschaft ungültig und der Schein ersatzlos weg — mit dem Vorrat bekommt er
wenigstens etwas.

## 2026-08-17 · „Hat sich nicht geändert“ — der Zwischenspeicher war schuld

Nach der Korrektur des hellen Scheins kam vom Telefon: unverändert. Der
Deploy war nachweislich fertig (17:51 UTC, Screenshot 17:56 UTC), die neue
Datei lag also draußen. Der Fehler saß eine Ebene tiefer.

**Eine installierte Web-App braucht zwei Neuladungen, wenn man nichts tut.**
Der Service Worker holt die neue Fassung im Hintergrund und übernimmt auch —
aber die bereits offene Seite behält die Dateien, die sie beim Öffnen bekommen
hat. Erst die *zweite* Neuladung zeigt die Änderung. Von außen sieht das aus,
als wäre die Änderung nicht angekommen, und man sucht den Fehler in der
Änderung statt im Zwischenspeicher.

`platform/web/updates.ts` behebt das dauerhaft: Beim Start und bei jeder
Rückkehr aus dem Hintergrund wird nach einer neuen Fassung gefragt, und sobald
der neue Service Worker übernimmt, lädt die Seite **einmal** neu. Die
Bedingung `hadController` verhindert die Schleife — beim allerersten Besuch
ist die Übernahme keine Aktualisierung, sondern die Erstinstallation.

Das ist der wertvollere Teil dieser Runde: Ohne ihn wäre jede künftige
Änderung auf dem Telefon wieder „ist nicht angekommen“, und jedes Mal hätte
man erst den Zwischenspeicher ausschließen müssen.

Nebenbei: Der Schein im Hellen war auch bei richtiger Machart noch
grenzwertig und steht jetzt auf 55 % statt 40 %.

**Und ein Werkzeug, das es schon gab und das hier gefehlt hätte:** Die Karte
„Fundament“ am Fuß zeigt unter *Fassung* den Commit, der gerade läuft. Damit
lässt sich in fünf Sekunden entscheiden, ob eine Änderung angekommen ist oder
ob der Zwischenspeicher noch die alte hält — genau die Frage, die diese Runde
gekostet hat.

## 2026-08-17 · Warum installierte Apps nie aktuell wurden

Rückmeldung, und sie benennt das Problem schärfer als meine erste Diagnose:
*„Updates werden im installierten PWA nicht übernommen, man muss immer wieder
deinstallieren und neu installieren.“*

Das ist kein Zufall und kein iOS-Fehler, sondern die Folge davon, wie eine
installierte App lebt: Sie wird **geweckt, nicht neu geladen**. Wer sie aus dem
App-Umschalter zurückholt, löst keinen Seitenaufruf aus — und ohne Seitenaufruf
fragt sie nie, ob es etwas Neues gibt. Sie kann Wochen so laufen. Der einzige
Ausweg, der von außen bleibt, ist Deinstallieren und Neuinstallieren.

Deshalb ist die Nachfrage **beim Sichtbarwerden** der eigentlich wichtige
Auslöser in `updates.ts`, nicht die beim Start. Ohne sie wäre die Änderung von
vorhin nur eine halbe gewesen: Sie hätte den Browser-Tab geheilt und die
installierte App genauso stehen lassen wie zuvor.

**Und eine Ergänzung, die dabei aufgefallen ist:** Automatisch neu laden darf
die App nicht *mitten in einer Einheit*. Die Einheit überlebt das zwar (B5),
aber der Bildschirm spränge beim Einprägen eines Wortes weg und stünde danach
mit „Fortsetzen“ da — der denkbar schlechteste Moment (G-1). Der Neustart
wartet jetzt, bis die Einheit vorbei ist. Erkannt wird sie an demselben
Merkmal, mit dem sie schon das Netz im Hintergrund zurückdrängt: kein zweiter
Zustand, der aus dem Tritt geraten könnte.

Der Schein im Hellen steht nach einer weiteren Rückmeldung jetzt auf 78 %
(statt 40 % im ersten und 55 % im zweiten Anlauf), ohne negative Streuung.
Dass es drei Runden gebraucht hat, liegt an einer Eigenheit, die man kennen
sollte: **Ein Schein auf hellem Grund sieht auf dem Entwicklungsmonitor immer
kräftiger aus als auf einem Telefon im Tageslicht.** Im Zweifel zu kräftig
einstellen und vom Gerät aus zurücknehmen — nicht umgekehrt.

## 2026-08-17 · Die Pille leuchtet, und der zweite Auslöser fürs Update

Zwei Nachträge vom Gerät.

**Der aktive Minutenknopf war zu schwach.** Der Grund ist ein anderer als beim
großen Knopf, und er ist lehrreich: Ein **blasser Körper trägt keinen
kräftigen Hof**. Solange die Pille fast so hell war wie das Papier, sah der
Schein aus wie ein Fleck *neben* ihr statt wie Licht *von* ihr — egal wie stark
man ihn stellte. Erst mehr Farbe im Körper (26 % Akzent statt der blassen
Voreinstellung) macht den Hof glaubhaft.

Und die kleinen Pillen haben jetzt einen eigenen Wert: Der weite Schein des
Startknopfs legt sich um eine Pille als Fleck; enger und dichter trifft
dieselbe Wirkung bei einem Viertel der Fläche.

**Zweiter Auslöser für die Update-Prüfung: `pageshow`.** `visibilitychange`
deckt den Normalfall ab, aber iOS kann eine Seite aus seinem eigenen
Zwischenspeicher wiederherstellen, ohne dass sie je als unsichtbar galt — dann
schweigt der erste Auslöser. Zweimal zu prüfen kostet nichts: `update()` fragt
nur nach und lädt nur, wenn wirklich etwas Neues da ist.

Damit ist die Frage vom Auftraggeber vollständig beantwortet — App schließen
und wieder öffnen prüft jetzt auf Updates und führt sie aus, ohne
Deinstallieren.

## 2026-08-17 · Die Testsuite hat sich selbst im Weg gestanden

Beim Push der Pillen-Änderung war ein E2E-Test rot — und ich habe trotzdem
gepusht, weil in meiner Befehlskette `| tail -3` den Rückgabewert von
Playwright verschluckt hat. Das ist ein Fehler in meinem Vorgehen, nicht im
Projekt, und er gehört genauso hierher wie die Fehler im Code.

Der Test selbst war nicht das Problem, aber auch kein Flackern. **Mehrere Tests
warten auf echte Sekunden:** einer sitzt eine volle 60-Sekunden-Einheit ab, um
nachzumessen, dass das Zeitbudget stimmt (B2); die beiden Wiederholungstests
laufen je zwei Einheiten durch. Liefen zwei davon gleichzeitig, nahmen sie sich
auf dieser kleinen Maschine die Rechenzeit weg, die Zeitgeber in den Seiten
kamen ins Stocken, und ein Block dauerte länger als seine nominellen Sekunden.
Der rote Lauf brauchte 3,1 Minuten statt der üblichen 1,9 — das war die Spur.

Deshalb läuft die Suite jetzt mit **einem** Arbeiter. Das kostet Laufzeit (rund
sechs statt zwei Minuten) und liefert dafür ein Ergebnis, auf das man sich
verlassen kann. Bei einer Suite, die über Veröffentlichungen entscheidet, ist
das der richtige Tausch.

Zwei Lehren:

1. **Wer auf echte Zeit wartet, darf nicht neben jemandem laufen, der dasselbe
   tut.** Das gilt für jeden weiteren Test dieser Art.
2. **`| tail` verschluckt den Rückgabewert.** Beim nächsten Mal `pipefail` oder
   den Befehl ohne Rohr — ein grüner Bericht, der nur so aussieht, ist
   schlimmer als gar keiner.

## 2026-08-17 · M4 beginnt: Namen & Gesichter

Das Modul steht (D9/D14). Der Kern erzeugt aus einem Namen die **Maße** eines
Gesichts, gezeichnet wird eine Ebene höher — der Kern kennt weiterhin kein SVG
und keinen Browser (D-010). Derselbe Name ergibt immer dasselbe Gesicht;
darauf beruht das Wiedersehen nach Tagen, sonst lernte man jedes Mal ein neues
Gesicht zum alten Namen.

Der Abruf ist hier **gestützt**, und das ist keine Bequemlichkeit: „Nenne alle
Gesichter“ ist keine Frage, die sich beantworten lässt. Das Gesicht steht da,
gesucht ist der Name — genau die Aufgabe, die im Alltag vorkommt.

### Ein Werkzeug, das den eigentlichen Fortschritt gebracht hat

Bis hierher habe ich Gesichter geprüft, indem ich die App startete und ein
Bildschirmfoto machte: **ein** Gesicht je Minute. So sah alles annehmbar aus.

`scripts/facesheet.mjs` legt jetzt vierzig nebeneinander, hell und dunkel. Im
ersten Bogen war sofort zu sehen, was einzeln nie auffiel:

- Die halbe Reihe hatte eine **schnurgerade Haarlinie quer übers Gesicht** —
  jedes zweite Gesicht wirkte wie ein Helm. Eine sichtbare Stirn ist eines der
  stärksten Unterscheidungsmerkmale überhaupt; ohne sie sehen sich alle
  ähnlich.
- „Lange Haare“ setzten unterhalb des Scheitels an: oben kahl, links und
  rechts zwei Vorhänge übers Gesicht.
- Der Vollbart war eine **Maske über der halben unteren Gesichtshälfte** —
  die Koteletten begannen über den Augen.
- Bei hohen Köpfen war der Haarknoten oben abgeschnitten und sah aus wie eine
  angeklebte Lasche.
- Die Schultern waren eine angeschnittene Ellipse: Der Kopf stand auf einem
  Teller.

Die Lehre ist allgemein und gilt über Gesichter hinaus: **Was nur einzeln
geprüft wird, wird gar nicht geprüft.** Ein Fehler, der bei einem von sieben
auftritt, ist in einer Stichprobe von einem unsichtbar.

Ein zweites Mal half derselbe Bogen, gefiltert: Von vier bärtigen Gesichtern
waren zwei **nicht als bärtig zu erkennen** — dunkles Haar auf dunkler Haut
ist eine Fläche in einer Fläche. Seitdem hat der Bart eine dunkle Oberkante.
Ohne `--nur=bart` hätte ich drei Bärte gesehen und den Rest für Zufall
gehalten.

### Jolanda hatte einen Bart

Der Generator würfelte den Bart aus dem Namen, ohne den Namen anzusehen. Rund
jedes vierte Gesicht bekam einen — auch Margarethe und Jolanda. Das liest sich
nicht als Vielfalt, sondern als Fehler, und wer einen Fehler sieht, schaut auf
den Fehler statt auf das Gesicht, das er sich merken soll.

Die Namenslisten sind deshalb jetzt zweigeteilt. Die Trennung ist ausdrücklich
**keine Aussage darüber, wie Menschen aussehen** — es gibt bärtige Frauen. Sie
ist eine Aussage über eine Zeichnung aus fünf Strichen: Die kann Zwischentöne
nicht transportieren. Kahlköpfigkeit bleibt bewusst für alle möglich; die
fällt nicht als Fehler auf, der Vollbart schon.

Nebenbei kam heraus, dass die Abwechslung vorher gar keine Eigenschaft war,
sondern nur die Reihenfolge, in der ich die Namen aufgeschrieben hatte — im
englischen Pool stimmte sie ab „Ximena“ nicht mehr. **Was eine Eigenschaft
sein soll, gehört in die Struktur und nicht in die Sortierung.**

### Der Bart hing an der Kette des Zufalls

`beard` verbrauchte zwei Würfe, den zweiten nur, wenn der erste durchkam.
Damit hingen Brauen, Augen, Nase und Mund daran, **ob** das Gesicht einen Bart
hat. Je Name blieb das gleich, es ist also nie aufgefallen — aber wer die
Bartschwelle ändert, hätte damit alle Gesichter geändert. Jetzt ein Wurf, eine
Entscheidung.

Ein Test dazu ist wieder herausgeflogen, und das gehört zum Bericht: Ich
wollte die Eigenschaft über die Streuung der übrigen Merkmale messen, und der
Versuch scheiterte an sich selbst — bei sieben bärtigen Namen und 48 möglichen
Kombinationen fallen zwei zusammen, wie es die Wahrscheinlichkeit vorsieht.
Der Test war falsch, nicht der Code. **Ein Test, der nur so lange grün ist,
wie der Zufall mitspielt, ist schlimmer als keiner.** Die Begründung steht
jetzt als Kommentar an der Stelle, wo sie gebraucht wird.

### Vier E2E-Tests waren rot, und sie hatten recht

Seit es zwei Module gibt, **wechselt die Einheit von Mal zu Mal die Sorte**:
Der Plan zieht das Modul aus dem Seed, und der Seed enthält die Startzeit. Die
Tests hatten das fest angenommen und suchten immer das Textfeld des freien
Abrufs.

Die Reparatur ist eine Regel, keine Anpassung: **Der Test liest ab, was die
App zeigt, statt vorherzusagen, was sie zeigen wird** (`tests/e2e/helpers.ts`).

An einer Stelle geht das bewusst nicht bis zum Ende. Beim Wiedersehen mit
Gesichtern gehört zu jeder Stelle ein bestimmtes Gesicht, und welches, ist dem
Test nicht zu entnehmen — der Name steht ja gerade nicht auf dem Bildschirm,
das ist die Aufgabe. Um richtig zu antworten, müsste er die Reihenfolge des
Schedulers nachbauen. Genau davor warnt eine frühere Lehre in derselben Datei,
und eine zweite Kopie derselben Logik wäre keine Prüfung, sondern eine
Verdopplung. Der Test prüft dort, dass das Wiedersehen stattfindet und die
Zahlen zusammenpassen; dass die Zuordnung Stelle für Stelle stimmt, prüft
`gradePrompted` im Kern — ohne Browser und ohne Raten.

Beide Zweige des neuen Sessiontests habe ich je dreimal laufen sehen, bevor
etwas gepusht wurde. Ein Zweig, der zufällig nie drankam, wäre ungeprüfter
Code mit grünem Haken.

**Stand:** 108 Kerntests, 28 E2E-Läufe, Typecheck für App und Kern grün.

## 2026-08-17 · Die Sicherung (N2) — vorgezogen, weil der Anlass echt war

Beim Löschen der Browserdaten ist eine Trainingshistorie verschwunden. Das ist
der Grund, warum diese Aufgabe vor den restlichen Modulen drankam: Was hier
hängt, ist nicht wiederherstellbar. Ein verlorenes Dokument kann man neu laden,
eine verlorene Vergessenskurve (D-004) nicht — sie ist das Ergebnis von Wochen.

Zwei Knöpfe im Fußbereich, aufgeklappt unter „Sicherung“, und ein Hinweis
**über** den Knöpfen statt als Kleingedrucktes darunter: Wer nicht weiß, dass
alles nur auf diesem Gerät liegt, kommt gar nicht auf die Idee zu sichern.

### Das Dateiformat ist nicht das Datenbankschema

Die Zeilenformen in `core/backup.ts` sehen denen in `data/db.ts` heute zum
Verwechseln ähnlich und stehen trotzdem doppelt da. Die Datei hat eine eigene
Fassungsnummer, die Datenbank hat ihre, und sie dürfen sich unabhängig bewegen.
Würde das Format die Tabellen einfach spiegeln, **änderte eine Schemamigration
stillschweigend das Dateiformat** — eine Sicherung von gestern wäre morgen
unlesbar, ohne dass jemand eine Entscheidung getroffen hätte. Der Preis ist
eine Abbildung, die heute eins zu eins ist. Der Gegenwert ist, dass jede
Änderung am Format bewusst passieren muss.

Eine Datei aus einer **neueren** Fassung wird abgelehnt statt halb gelesen.
Halb gelesen wäre der schlimmste Ausgang: eine Sicherung, aus der
stillschweigend die Hälfte fehlt.

### Zusammenführen, nicht ersetzen

Einlesen löscht nie. Zwei Geräte, die eine Woche getrennt liefen, haben beide
recht (N9). Zwei Regeln, beide im Kern und ohne Browser geprüft:

- **Es gewinnt die längere Geschichte, nicht der jüngere Termin.** Die Zahl der
  Abfragen wächst nur, wenn wirklich geübt wurde. Nach dem Termin zu
  entscheiden wäre falsch herum: Ein Gerät, das lange nicht lief, hat lauter
  überfällige Termine — die sähen „dringender“ aus und würden die frischere
  Historie verdrängen.
- **Ereignisse erkennt man am Fingerabdruck, nicht an der Nummer.** Die
  laufende Nummer ist auf jedem Gerät eine andere. Was ein Ereignis eindeutig
  macht, ist, wann in welcher Einheit an welchem Gegenstand was passiert ist.

### Zwei Funde, die ohne Prüfung durchgegangen wären

**Der Typprüfer hat eine echte Naht gefunden.** Das Dateiformat nahm für die
Art eines Ereignisses jede Zeichenkette an, die Datenbank kennt vier Werte. Der
Übersetzer hat sich geweigert — zu Recht: Ein unbekannter Wert stünde für immer
in der Ereignistabelle, und die ist die Rohdatenbasis für alles, was ANITEW
später über jemanden behauptet. Solche Zeilen bleiben jetzt draußen, **und die
Zahl steht im Bericht**. Stilles Wegwerfen ist genau das, wogegen diese ganze
Funktion gebaut ist.

**Der Bericht hat gelogen.** Dieselbe Datei zweimal einzulesen meldete „2 neu
dazu“, obwohl sich nichts geändert hatte: Einstellungen wurden ohnehin
geschrieben und deshalb ohne Prüfung als neu gezählt. Bei einer Sicherung ist
das besonders schlecht — der Bericht ist das Einzige, woran man erkennt, ob
etwas angekommen ist. Ein E2E-Lauf, der die Datei absichtlich zweimal einliest,
hat es gefunden.

### Eine Falle, die eine Stunde gekostet hat

`setInputFiles` läuft bei einem Pfad mit **Umlauten** anstandslos durch und legt
die Datei trotzdem nicht in die Seite. Kein Fehler, keine Ausnahme — die
Meldung bleibt einfach aus. Und `testInfo.outputPath()` baut den Ordnernamen
aus dem Titel des Tests, die hier deutsch sind („trägt die Trainingshistorie
…“). Ich habe den Fehler zuerst in der App gesucht; erst ein Direktversuch
außerhalb von Playwright zeigte, dass die App richtig arbeitet.

Die Lehre: **Wenn die App im Direktversuch tut, was sie soll, liegt es am
Test** — und der nächste Schritt ist, den Unterschied zwischen beiden Aufbauten
zu suchen, nicht weiter im Code zu lesen.

**Stand:** 122 Kerntests, 32 E2E-Läufe, Typecheck für App und Kern grün.

## 2026-08-17 · Zahlen (D10) — und eine Regel, die vorher fehlte

Das dritte Modul. Zahlen kommen **nicht aus einer Liste**, sondern werden aus
dem Seed erzeugt: Achtzig feste Zahlen wären nach zwei Wochen durchgesehen,
und die App misst dann Wiedererkennen statt Gedächtnis — derselbe Grund wie
beim Gesichtsgenerator. Drei bis sechs Ziffern, Länge gestreut, weil fünf
gleich lange Folgen den Abruf leichter machen, als er sein sollte: Wer weiß,
dass alles vierstellig ist, muss die Länge nicht mehr behalten.

Geschenkte Folgen fallen raus. „1111“ merkt sich als ein Zeichen, „3456“ als
eine Regel — beide sagen nichts über das Gedächtnis für Ziffernfolgen aus, und
ihr Treffer ginge doch in dieselbe Zahl ein wie die verdienten (R-1).

### Die Milde war global, und das war falsch

Die Bewertung verzeiht ab fünf Zeichen einen Tippfehler. Bei „Blmue“ statt
„Blume“ ist das richtig. Bei einer Zahl **nicht**: 4719 und 4791 sind nicht
dieselbe PIN, und sie auseinanderzuhalten ist die Übung. Hätte ich das Modul
ohne diese Änderung gebaut, hätte die App für eine vertauschte Ziffer einen
Punkt vergeben — genau die erfundene Zahl, gegen die R-1 steht.

Die Strenge liegt jetzt beim **Modul** und nicht in der Bewertungsfunktion
(`leniencyFor` in `plan.ts`, neben `isPrompted`): Sie ist eine Aussage über den
Gegenstand, nicht über das Verfahren. Daraus ist D-012 geworden, und die
allgemeine Form davon trägt weiter als dieser eine Fall — **ein Modul bringt
seine Regeln mit**: frei oder gestützt abgefragt, streng oder nachsichtig
verglichen, Zifferntastatur oder Buchstaben.

### Der Übersetzer hat die Arbeit verteilt

`TRAINING_MODULES` um einen Eintrag zu erweitern hat drei Übersetzungsfehler
ausgelöst — App und zwei Teststellen —, und das ist der Zweck der Übung: Der
Vorrat je Modul ist ein `Record<ModuleId, …>`, ein fehlendes Modul ist deshalb
kein leerer Bildschirm zur Laufzeit, sondern ein roter Übersetzer.

Denselben Griff habe ich für die Texte nachgezogen: Aus `encodeHint` und
`encodeFacesHint` ist ein Verzeichnis `encodeHints` geworden, indiziert mit
`ModuleId`. Wer künftig ein Modul hinzufügt und den Satz vergisst, bekommt
einen Übersetzungsfehler statt eines leeren Hinweises.

Nebenbei: Auf dem Telefon kommt beim Zahlenmodul die Zifferntastatur
(`inputMode="numeric"`). Wer eine sechsstellige Zahl auf der
Buchstabentastatur sucht, verliert Sekunden an etwas, das mit Gedächtnis
nichts zu tun hat.

### Was der E2E-Lauf jetzt prüft

Der Sessiontest liest ab, **was** er vor sich hat, und prüft die passende
Regel: Bei einem Wort zählt der vertauschte Buchstabe, bei einer Zahl die
geänderte Ziffer nicht. Eine Prüfung, zwei Regeln — und die neue Strenge ist
damit bis zur angezeigten Zahl durchgeprüft und nicht nur im Kern.

Alle drei Module habe ich im Lauf gesehen, bevor etwas gepusht wurde: Wörter,
Gesichter und viermal Zahlen (darunter eine dreistellige, wo die Längenregel
allein schon greift — die Stichprobe musste auch den Fall treffen, in dem die
**neue** Regel den Ausschlag gibt).

### Offen und benannt

Gruppierte Nummern („0176 4392 118“) gibt es noch nicht: Der freie Abruf
zerlegt die Eingabe an Leerzeichen, aus einer Nummer würden drei Antworten.
Das braucht erst eine Eingabe, die weiß, dass sie **eine** Antwort erwartet.
Steht als Einschränkung in `numbers.ts` und im Backlog, statt still zu fehlen.

**Stand:** 134 Kerntests, 32 E2E-Läufe, Typecheck für App und Kern grün.

## 2026-08-17 · Die App bringt etwas bei (D5)

Das Major-System ist drin, und damit der Satz, an dem sich ANITEW von jeder
Brain-Game-App unterscheidet: **Merktechniken werden beigebracht, nicht nur
abgefragt.** Eine App, die einen dreimal täglich Ziffern raten lässt, macht
niemanden besser — sie misst nur, wie gut man ohnehin schon ist.

Eine Lektion je Einheit, vierzehn Sekunden, eine Ziffer: die Ziffer, ihr Laut,
und die Brücke dazwischen. „Das kleine n hat zwei Abstriche.“ Ohne diese
Brücke ist die Zuordnung Willkür, und Willkür merkt sich niemand. Danach steht
der Konsonant unter jeder gelehrten Ziffer, und nur unter ihr.

### Drei Entscheidungen gegen den bequemeren Weg (D-013)

**Das Wort zur Zahl liefert die App nicht.** Sie bringt die Zuordnung bei, das
Bild baut der Nutzer. Ein selbst gebildetes Bild sitzt besser als ein
vorgesetztes — eine mitgelieferte Wortliste würde genau den Effekt abschalten,
um dessentwillen die Technik wirkt. Wer „Rakete“ vorgesetzt bekommt, hat ein
Wort gelesen; wer es selbst findet, hat es gebaut.

**Angezeigt wird nur, was schon sitzt.** Die ganze Tabelle unter die Zahl zu
schreiben wäre einfacher und falsch: Wer eine Tabelle vorgesetzt bekommt, die
er nicht kann, liest sie ab statt sie zu lernen — und übt dann Ablesen.

**Unterricht nur in Ruhe und nur mit Anlass.** Nicht im 60-Sekunden-Modus, und
nicht, wenn heute gar keine Zahl vorkommt.

### Was der Bildschirm gezeigt hat, was die Tests nicht sahen

Nach der ersten Lektion kamen drei Runden Wörter, und die frische Technik
durfte man in Runde drei benutzen. Fachlich lief alles richtig, die Tests waren
grün — es war trotzdem falsch: **Was man nach dem Lernen nicht sofort anwendet,
ist am nächsten Tag wieder weg.** Steht heute eine Lektion an, beginnt die
Einheit jetzt mit Zahlen.

Dabei fiel eine Falle auf, die es hier schon einmal gab: Der Wurf, der das
Startmodul zieht, fällt weiterhin — auch wenn er verworfen wird. Sonst hinge
die ganze folgende Mischung daran, ob heute unterrichtet wird, und dieselbe
Einheit sähe je nach Lernstand anders aus. Genau denselben Fehler hatte der
Bartwurf im Gesichtsgenerator.

### Der Fehler, der am meisten wehgetan hätte

Die frisch gelehrte Ziffer wirkte erst in der **nächsten** Einheit: Sie stand
zwar sofort in den Einstellungen, aber der Startbildschirm liest sie erst
wieder, wenn die Einheit vorbei ist. Also: Lektion über die Eins, und die
nächste Zahl zeigt dazu — nichts. Der schlechtestmögliche Zeitpunkt für eine
Verzögerung.

Behoben, ohne einen zweiten Zustand: Ein bereits vorbeigezogener Lehrblock
**ist** die Auskunft, dass seine Ziffer gehalten wurde. Abgeleitet aus Plan und
Blockzähler kann das mit der Datenbank nicht aus dem Tritt geraten.

### Der Test, der zweimal grün war, obwohl der Fehler drin war

Und das ist die eigentliche Lehre dieses Abschnitts. Meine erste Fassung prüfte
die Konsonantenzeile nur, **wenn in der gezogenen Zahl zufällig eine Eins
vorkam**. Sie lief grün. Ich habe die Reparatur zurückgenommen, um zu sehen,
ob der Test sie fängt — er fing sie nicht, zweimal nicht, weil die Gelegenheit
schlicht nicht kam.

Erst die dritte Fassung wartet auf ihre Gelegenheit: neun Ziffern vorab
gesetzt, die zehnte kommt als Lektion, und danach wird der **ganze Block**
beobachtet, bis eine Zahl mit der frisch gelernten Ziffer erscheint. Diese
Fassung wurde rot, sobald ich den Fehler wieder einbaute — und erst da wusste
ich, dass sie etwas prüft.

Zwei Lehren:

1. **Ein Test, der sich seine Gelegenheit vom Zufall geben lässt, ist keiner.**
   Entweder man stellt die Bedingung her oder man wartet auf sie.
2. **Einen Test, der einen Fehler fangen soll, muss man einmal rot gesehen
   haben.** Ich habe das hier zuerst nachlässig gemacht: Beim ersten Versuch
   scheiterte der Build am Typprüfer, die Suite lief gegen den alten Stand und
   meldete grün. Ein Beweis, der aus einem fehlgeschlagenen Build stammt, ist
   keiner.

**Stand:** 150 Kerntests, 40 E2E-Läufe, Typecheck für App und Kern grün.

### Nachtrag: der bedingte Hook

Nach der Reparatur oben waren **zehn** E2E-Läufe rot, und das Muster war der
ganze Hinweis: Rot wurde alles, was eine Einheit **bis zum Ende** durchspielte;
alles Kürzere blieb grün.

Der `useMemo`, der die frisch gelehrte Ziffer mitzählt, stand unter dem
vorzeitigen Return für die Zusammenfassung. React zählt Hooks je Durchlauf —
sobald die letzte Antwort da war, fehlte einer, die Komponente brach ab, und
die Zusammenfassung erschien nie. Ein Anfängerfehler, und er hätte auf dem
Telefon so ausgesehen: Man trainiert fünf Minuten, tippt die letzte Antwort,
und der Bildschirm bleibt leer.

Zwei Dinge, die dabei richtig liefen und die ich mir merken will:

1. **Das Muster war die Diagnose.** „Alles, was bis zum Ende läuft“ ist eine
   viel schärfere Auskunft als „zehn Tests rot“. Erst danach habe ich in den
   Code gesehen.
2. **Ich habe zuerst die Umgebung verdächtigt** — ein 33 Minuten alter
   Preview-Server lief tatsächlich noch, und Playwright hatte ihn
   wiederverwendet. Das aufzuräumen war richtig, hat aber nichts geändert.
   Erst der zweite, saubere Lauf mit demselben Ergebnis hat bewiesen, dass es
   am Code liegt. **Eine Umgebungserklärung gilt erst, wenn der saubere Lauf
   grün ist** — sonst ist sie nur eine bequeme Ausrede.

## 2026-08-17 · Memory Missions (H) — das Modul, das die anderen verbindet

Person, Zimmernummer, Gegenstand, Uhrzeit, Restaurant: Gesicht, Zahl und Wort
in **einer** Aufgabe. Trainiert wird dabei etwas anderes als in den
Einzelmodulen, und das ist der ganze Punkt — nicht die Stücke, sondern die
**Bindung** zwischen ihnen. Im Alltag merkt sich niemand „314“; man merkt
sich, dass Elena in Zimmer 314 wohnt und um 18:40 abreist.

Damit sind H1 (Szenenformat) und der Kern von H2/H4 erledigt: „The Hotel“ ist
kein fester Text, sondern eine **Vorlage mit Lücken**. Eine feste Szene wäre
nach dem zweiten Mal auswendig gelernt — derselbe Grund wie beim
Gesichtsgenerator und beim Zahlenvorrat.

### Die Person ist der Anker, und das ist keine Nebensache

Aus dem Namen entsteht die ganze Szene, so wie aus ihm das Gesicht entsteht.
Warum, sieht man erst beim Wiedersehen: Nach drei Tagen fragt die App eine
**einzelne** Tatsache ab, und „Welche Zimmernummer?“ wäre dann keine
beantwortbare Frage — es gab inzwischen zwanzig Zimmernummern. Mit Anker heißt
sie „Elena — welches Zimmer?“, und das ist genau die Frage, die das Leben
stellt. Das Gesicht steht dabei, der Name darunter; die Person ist hier nicht
die Aufgabe, sondern der Haken, an dem sie hängt.

### Was Kennung und Antwort trennt

Überall bisher war beides dasselbe: Beim Wort „Anker“ ist „Anker“ die Frage,
die Antwort und der Eintrag in der Datenbank. Bei einer Mission ist das eine
„314“ und das andere `Elena#room`. Der Wiederholungstermin hängt an der
Kennung — sonst wären zwei Szenen mit demselben Zimmer eine einzige
Information.

Die Bewertung liefert deshalb jetzt zwei Dinge getrennt: `promptedHits` sagt,
**welche Stelle** stimmt, und der Aufrufer entscheidet, ob er dazu den Wert
oder die Kennung ablegt. Ein Unterschied, der nur an einer Stelle auffällt und
genau deshalb aufgeschrieben gehört.

### D-012 eine Ebene tiefer

Innerhalb *einer* Abfrage stehen eine Zimmernummer, eine Uhrzeit, ein
Gegenstand und ein Name nebeneinander. 314 und 341 sind nicht dasselbe Zimmer;
„roter Kofer“ ist ein Tippfehler. Die Strenge hängt hier also nicht am Modul,
sondern an der einzelnen **Tatsache** — und genau dafür war es richtig, sie
bei den Zahlen nicht als globalen Schalter zu bauen.

### Zwei Testfehler, beide meine

**Der Test hat meine eigene Reihenfolge geraten.** Die Szene zeigt Zimmer ·
Abfahrt · Dabei · Restaurant, gefragt wird in der Reihenfolge der
Tatsachenarten — Zimmer · Dabei · Abfahrt · Restaurant. Ich hatte beides
stillschweigend für dasselbe gehalten und vier Antworten der Position nach
eingetippt; drei landeten an der falschen Stelle.

Dass die beiden Reihenfolgen auseinanderfallen, ist übrigens **gut**: Wer die
Reihenfolge mitlernen kann, lernt die Reihenfolge statt die Szene. Der Test
liest jetzt die Frage und antwortet darauf — so wie ein Mensch es täte.

**Und der Tippfehler fiel über das ß.** Mein Prüf-Tippfehler vertauschte zwei
Nachbarn im ersten Wort und traf „weißer“ → „weßier“. Vor dem Vergleich wird
ß zu ss aufgelöst; aus der Nachbarvertauschung wurden dadurch zwei Fehler an
auseinanderliegenden Stellen, und die Bewertung zählte den Treffer zu Recht
nicht. **Die App hatte recht, der Test hatte unrecht** — beide Male.

Gefunden habe ich es mit einer Sonde, die Szene, Antworten und Ergebnis
ausgibt. Aus „2 von 4 statt 3“ lässt sich nichts schließen; aus „Zimmer 164,
geantwortet 146, weißer Mantel, geantwortet weßier Mantel“ sofort. **Wenn eine
Zahl nicht stimmt, muss man sich die Werte ansehen und nicht die Zahl.**

**Stand:** 166 Kerntests, 42 E2E-Läufe, Typecheck für App und Kern grün.

### Nachtrag: die Helfer kannten die Szene nicht

Der erste vollständige Lauf nach den Missionen blieb hängen, und der Grund war
dieselbe Sorte Annahme wie schon zweimal vorher: `collectItems` suchte
`.encode-word`. Eine Mission hat das nicht — dort steht die ganze Szene auf
einmal. Wo das Modul zufällig gezogen wurde, sammelte der Helfer nichts ein,
und der Test prüfte anschließend eine leere Liste.

Die gemeinsamen Helfer kennen jetzt beide Formen: eine Reihe einzelner Stücke
oder eine Szene mit Etiketten. Und drei kleinere Nachziehungen, die alle
dieselbe Ursache haben:

- Wo Tests auf „das Einprägen hat begonnen“ warteten, warten sie jetzt auf
  `.encode-word` **oder** `.scene`.
- Die Punktreihe unter dem Stück gibt es bei einer Szene nicht — dort wechselt
  nichts, es gäbe nichts zu zählen. Die Prüfung darauf gilt nur für die
  anderen Module.
- „Alles außer der letzten Antwort“ ist jetzt eine Angabe am Aufruf und keine
  gekürzte Antwortliste mehr. Bei einer Mission kommen die Antworten aus der
  Szene und nicht aus der Liste; eine gekürzte Liste blieb dort wirkungslos,
  und der Test erwartete eine fehlende Antwort, die es nie gab.

**Die Lehre ist inzwischen dreimal dieselbe**, und deshalb steht sie hier zum
dritten Mal: Ein neues Modul bringt eine neue *Form* mit, nicht nur neuen
Inhalt. Was die Tests über die Oberfläche annehmen, muss dann mitwachsen — und
zwar an **einer** Stelle, sonst zieht es sich durch alle Dateien.

Zwei weitere Anläufe brauchte es danach, und beide waren lehrreich:

**Die Punktreihe wurde zu spät gezählt.** Beim Umbauen ist die Zählung hinter
das Einsammeln gerutscht — und das kehrt erst zurück, wenn der Abruf beginnt.
Da war die Reihe längst weg, und der Test verglich sechs Stücke mit null
Punkten. Was während eines Blocks gilt, muss während des Blocks gelesen werden.

**Und der Wiedersehensblock einer Mission hatte keinen Vorspann.** Ich hatte
ihn bewusst weggelassen — die Person steht ja dabei, die Frage ist klar. Der
Test fand den Block deshalb nicht, und beim Nachsehen war es kein
Testproblem: Ohne Vorspann sieht „Welche Zimmernummer?“ genauso aus wie bei
einer Szene, die man gerade eben gesehen hat. **Dass hier nach etwas von vor
Tagen gefragt wird, ist eine Auskunft, die dem Nutzer zusteht.** Jetzt steht
dort „Und von früher: Welche Zimmernummer?“ — dieselbe Anrede wie überall
sonst.

Das ist das zweite Mal in diesem Abschnitt, dass ein Test etwas gefunden hat,
das ich für eine Geschmacksfrage gehalten hatte und das keine war.
