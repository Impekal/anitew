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

## 2026-08-17 · Die Serie (K2) — und ein Spruch, der nichts sagte

### Zuerst der Spruch

Der Auftraggeber hat die Begrüßungen abgelehnt, und er hatte recht. „Fünf
Minuten gehören dir“, „Nimm dir den Moment“, „Schön, dass du da bist“ — das
war freundlich und vollkommen austauschbar. **Dieselben Sätze stünden in jeder
Meditations-App.** Sie sagten nichts darüber, was ANITEW ist.

Der Werbespruch heißt jetzt **„Gedächtnis ist Technik, kein Talent.“** Er
trifft den Kern in fünf Wörtern: Merken ist erlernbar, und die App bringt es
bei (D5) — das ist der Unterschied zu jedem Gehirnjogging. Und er lädt ein,
weil er dem Leser etwas zutraut, statt ihn zu beruhigen.

Die täglichen Sätze sagen jetzt ebenfalls etwas: „Abrufen ist das Training.
Nicht das Ansehen“ (C5), „Aus Ziffern werden Bilder“ (D5), „Vergessen ist kein
Defekt. Es ist planbar“ (D-004). Kurz, mit Kante — und weiterhin ohne Lob und
ohne Zahl, die nicht gemessen ist.

### Die Serie

Nach D-008 gebaut: Ein Tag zählt, sobald eine Einheit **zu Ende gelaufen** ist
— die kürzeste dauert 60 Sekunden. Je sieben Trainingstage ein Schutztag,
höchstens zwei auf Vorrat. Ein verpasster Tag verbraucht einen Schutztag,
statt sechzig zu vernichten.

**Gerechnet, nicht fortgeschrieben.** Die Serie ließe sich billiger führen,
indem man beim Abschluss einen Zähler erhöht. Sie wird trotzdem jedes Mal aus
den Trainingstagen neu berechnet, und der Grund ist R-1: Ein Zähler ist eine
Behauptung, die von der Wirklichkeit abweichen kann — nach einem abgestürzten
Schreibvorgang, nach einem eingelesenen Backup vom zweiten Gerät (N2), nach
einer verstellten Uhr. Nebenbei macht genau das sie prüfbar: Der E2E-Test legt
zehn Trainingstage in die Datenbank, statt zehn Tage zu warten.

Ein Detail, das ohne Nachdenken falsch geworden wäre: **Der heutige Tag ist
noch nicht vorbei.** Ohne diese Ausnahme wäre jeder Morgen ein verpasster Tag
— die App verbrauchte beim Öffnen einen Schutztag, bevor der Nutzer überhaupt
die Gelegenheit hatte zu trainieren.

### K7 hat jetzt einen Namen (D-015)

Die Anti-Dark-Pattern-Regel stand bisher nur im Backlog. Mit der Serie wird
sie zum ersten Mal scharf — die Serie ist die Stelle, an der Gedächtnis-Apps
üblicherweise anfangen zu drücken. Was daraus konkret folgt, steht jetzt als
Entscheidung: kein Countdown, keine kaufbaren Schutztage, keine erfundenen
Zahlen, und **keine Aufforderung, wo noch nichts ist** — bei einer Serie von
null steht gar nichts da.

### Eine Fixture, die in der falschen Zeitrechnung lag

Der erste Bildschirmabzug zeigte neun statt zehn Tagen und keine
Schutztag-Meldung. Der Fehler lag nicht in der App: Meine Prüfdaten rechneten
den Tagesschlüssel in UTC, die App rechnet ihn in Ortszeit mit der Grenze um
4 Uhr (D-008). Die gesetzten Tage lagen damit um einen verschoben, und „heute“
fiel in die Zukunft — wo die Serie es zu Recht übergeht (P5).

**Wer Testdaten setzt, muss dieselbe Zeitrechnung benutzen wie die App.** Der
E2E-Test bildet den Tagesschlüssel deshalb genauso, mit der Vier-Uhr-Grenze.

**Stand:** 182 Kerntests, 52 E2E-Läufe, Typecheck für App und Kern grün.

---

## 2026-08-18 · Die Messung (M3) — die Release-Sperre fällt

M3 war nie eine Funktion, sondern eine **Erlaubnis**: Solange die Messung
nicht misst, darf ANITEW keinen einzigen Satz über das Gedächtnis eines
Nutzers sagen. Ab jetzt darf sie es — und zwar genau so weit, wie gezählt
wurde.

### Was gemessen wird

Zwanzig Wörter, fünf Sekunden je Wort, dann Abruf in drei Stufen: sofort, nach
zwanzig Minuten, am Folgetag. Alle vierzehn Tage. Die Wörter kommen aus einem
**Quarantänevorrat** (F2a) von sechzig Stück je Sprache, der sich mit dem
Trainingswortschatz nirgends überschneidet — geprüft, nicht behauptet — und
der keinen Wiederholungstermin erzeugt. Ohne diese Trennung misst ein
Benchmark nur, wie oft man seine eigenen Testwörter schon geübt hat.

Das Fenster für die zweite Stufe ist 15 bis 45 Minuten. Wer es verpasst, liest
keinen Vorwurf, sondern den Grund: Eine Messung nach drei Stunden ist keine
Messung nach zwanzig Minuten, also zählt diese nicht mit.

### Die Stelle, an der die App schweigt

Der wichtigste Teil ist das, was **nicht** dasteht.

Vor der dritten Messung steht keine Veränderung, sondern das Wort *Eichung*
und die Erklärung dazu (F2b): Auch ein Test wird durch Gewöhnung an seinen
Ablauf besser, und die ersten beiden Läufe messen zu einem guten Teil genau
das.

Danach steht eine Zahl nur, wenn sie sich trägt. Aus zwanzig Wörtern ergibt
sich ein binomialer Standardfehler; die Spanne ist das Doppelte davon. Enthält
sie die Null, dann heißt der Satz: **„Kein Unterschied, der sich vom Zufall
trennen lässt. Zwanzig Wörter sind eine kleine Stichprobe: Zwei Wörter mehr
oder weniger sind schon zehn Prozentpunkte.“** Ein Wort mehr als bei der
Eichung ist kein Fortschritt, und die App verkauft es auch nicht als einen.
Genau dieser Fall hat einen eigenen E2E-Test.

Wo eine Zahl steht, steht die Spanne daneben — und aufklappbar, was gezählt
wurde. Der Erklärtext endet mit dem Satz, den das Genre sonst auslässt: „Über
dein Gedächtnis im Alltag sagt es nichts, solange es niemand dort gemessen
hat.“ (F4)

### Zwei Zahlen, die sich nie berühren (F1)

Trainingsscore und Messung liegen in getrennten Tabellen, werden von
getrennten Bausteinen angezeigt und teilen keinen Wert. Die Zusammenfassung
einer Einheit sagt selbst dazu, dass ihr Ergebnis nichts über das Gedächtnis
insgesamt aussagt — das misst die Messung. Eine abgebrochene Messung wird als
abgebrochen markiert und fällt aus der Reihe heraus, statt sie zu verdünnen.

### Ein Format, das seine Nummer behalten durfte

Die Sicherungsdatei (N2) bekam vier neue Felder für die Messung und bleibt bei
`BACKUP_VERSION = 1`. Erlaubt war das, weil sie optional sind und weil es
keine ältere Datei geben *kann*, der sie fehlen: Vor M3 gab es keine Messung,
also auch keine Zeile in dieser Tabelle. Eine Fassungsnummer heraufzusetzen,
ohne dass jemandem etwas fehlt, machte alte Dateien grundlos unlesbar. Beim
Einlesen wird ergänzt statt erfunden — die Anzahl ist die feste Größe der
Messung.

### Der Fehler dieser Runde: ein Name, der zu wenig unterschied

Sechs von sieben neuen E2E-Prüfungen fielen sofort aus, alle an derselben
Zeile: `getByRole('button', { name: 'Beginnen' })`. Die App war in Ordnung.
Playwright vergleicht zugängliche Namen von Haus aus als **Teilzeichenkette
und ohne Rücksicht auf Groß- und Kleinschreibung** — und seit M3 steht auf dem
Startbildschirm auch „Messung beginnen“. Der Selektor fand zwei Knöpfe.

Ein `exact: true` hätte es nicht behoben, weil der Startknopf die Dauer im
Namen trägt („5:00 Beginnen“). Der Griff steht jetzt einmal in
`tests/e2e/helpers.ts` als `startButton()` und sucht über die Klasse. Damit
ist auch der eigentliche Schaden repariert: Der Selektor lag **zweiundzwanzig
Mal** in sechs Dateien, und jede spätere Beschriftung, die zufällig
„beginnen“ enthält, hätte sie alle wieder umgeworfen.

Die Lehre ist dieselbe wie in M4, nur an anderer Stelle: **Ein Griff, der in
sechs Dateien kopiert liegt, ist sechs Fehler, die noch nicht passiert sind.**

**Stand:** 203 Kerntests, 66 E2E-Läufe, Typecheck für App und Kern grün.
Offen in M3: die Wissenschaftsseite (F6) und die Store-Texte (F7), die daran
hängen.

---

## 2026-08-18 · Was belegt ist (F6, F7) — M3 ist fertig

Die Messung sagt, was an *dir* gezählt wurde. Jetzt gibt es die Gegenprobe:
worauf der Aufbau der App überhaupt beruht — und wo das Wissen aufhört.

### Vier Stufen statt zwei

Der interessante Fall liegt in der Mitte, und genau den lassen Gedächtnis-Apps
üblicherweise weg:

- **Gut belegt** — verteiltes Üben, Abrufen statt Ansehen, die
  Vergessenskurve. Darauf ist die App gebaut.
- **Belegt, aber nur dafür** — Merktechniken. Sechs Wochen Loci-Training
  verändern messbar, wie viele Wörter einer Liste jemand behält. Über Namen,
  Termine und Alltag sagt das nichts. ANITEW bringt die Technik bei und
  behauptet den Rest nicht.
- **Nicht belegt** — Gehirnjogging macht nicht allgemein klüger.
- **Nicht gemessen** — ob ANITEW im Alltag hilft. Von niemandem, uns
  eingeschlossen.

Jede Aussage nennt, **was in der App auf ihr steht**. Bei den beiden unteren
steht dort: nichts. Das ist der eigentliche Inhalt der Seite.

### Aus einem Vorsatz wird ein Test (D-016)

„Wir bauen nichts auf Unbelegtem“ ist als Satz wertlos, weil der Verstoß nie
als Verstoß daherkommt. Niemand schreibt „diese Funktion beruht auf einer
widerlegten Annahme“ — er schreibt einen Balken namens „Gedächtnisstärke“, und
drei Monate später weiß keiner mehr, woher die Zahl kam.

Deshalb ist die Bindung Struktur: `restsOn` muss bei `unsupported` und
`unmeasured` leer sein, und ein Test macht daraus einen roten Balken statt
einer Diskussion. Umgekehrt gilt für `unmeasured` das Gegenteil: Dort darf
**keine** Quelle stehen. Eine fremde Studie unter „hilft es im Alltag?“ zu
legen wäre der eleganteste Weg, R-2 zu brechen — der Satz bliebe wörtlich
richtig und läse sich trotzdem wie ein Beleg.

**Keine DOI.** Ich hätte sie aus dem Kopf schreiben müssen. Eine um eine Ziffer
falsche DOI ist ein toter Link, ausgerechnet auf der Seite, die von
Genauigkeit lebt. R-1 gilt auch für uns: Autor, Jahr, Titel, Journal — das
lässt sich finden, ohne es zu erfinden.

### F7: die Texte, und zwei Funde beim Aufräumen

`docs/STORE.md` hält jetzt alles, was ANITEW über sich selbst sagt, wo der
Nutzer die App noch nicht offen hat — in beiden Sprachen, mit einer Tabelle,
die jede Aussage auf ihre Deckung zurückführt (Backlog-Kennung oder Eintrag
aus `science.ts`). Was sich nicht zurückführen lässt, steht nicht drin.

Der Test über die Marketingflächen hat sofort zwei Dinge gefunden:

**`index.html` und das Manifest trugen noch den alten Spruch.** „Trainiere dein
Gedächtnis. Miss deinen Fortschritt. Behalte mehr.“ — die App sagte innen
längst etwas anderes. Zwei Selbstbeschreibungen sind der Anfang davon, dass
eine davon nicht mehr stimmt; die Manifest-Zeile wandert obendrein beim
Verpacken direkt in den Store-Eintrag.

**Die Sperrliste zensierte sich selbst.** `docs/STORE.md` *muss* die verbotenen
Ausdrücke nennen, sonst weiß beim Texten niemand, welche gemeint sind — der
Test las sie und wurde rot. Geprüft wird jetzt alles vor der Liste. Eine
Regel, die sich nicht aussprechen darf, ist keine Regel, sondern eine Falle.

Und eine Feinheit, die fast einen falschen Test ergeben hätte: **„klüger“ und
„smarter“ stehen in der App** — in dem Satz, dass Gehirnjogging genau das nicht
bewirkt. Eine Sperrliste, die den Widerspruch nicht vom Versprechen
unterscheidet, verbietet ausgerechnet die ehrlichste Stelle. Gesperrt ist
deshalb nur, was sich gar nicht ehrlich verwenden lässt: Heilversprechen,
„wissenschaftlich bewiesen“, Verdopplungsversprechen.

### Damit ist M3 durch

Zwei getrennte Zahlen, und die große ist gemessen (F1–F5). Eine Seite, die
sagt, was belegt ist und was nicht (F6). Texte, die nichts behaupten, was
nicht gedeckt ist (F7, R5). **Die Release-Sperre ist gefallen** — ANITEW darf
jetzt öffentlich sagen, was es kann, weil es an jeder Stelle auch sagt, was es
nicht kann.

**Stand:** 219 Kerntests, 76 E2E-Läufe, Typecheck für App und Kern grün.

---

## 2026-08-18 · Der Gedächtnispalast (G)

Die älteste Merktechnik, die es gibt — und die einzige, für die auf unserer
eigenen Wissenschaftsseite eine Studie steht (`science.mnemonics`). Man legt,
was man behalten will, an Orte, die man ohnehin auswendig kennt, und geht sie
später ab.

Drei Wege zu je fünf Stationen: die Wohnung, der Weg vor die Tür, der eigene
Körper. Absichtlich die banalsten Orte der Welt — **ein Palast wirkt, weil man
ihn kennt, nicht weil er schön ist.**

### Der Bauplan war schon da

Der Palast hat kaum neue Mechanik gebraucht, und das ist die interessante
Beobachtung dieser Runde: Ein Gang hat **dieselbe Form wie eine Mission**
(D-014). Dort hängen vier Tatsachen an einer Person, hier hängt je ein
Gegenstand an je einem Ort. Beides sind Bindungen, keine Einzelstücke.

    Anker  home~3         — ein Gang durch einen Palast
    Stück  home~3#hall    — was im Flur lag

Weil die Form dieselbe ist, fiel G7 fast von selbst ab: Ein Gang hängt im
Wiederholungsplan wie jedes andere Item, ohne dass die Engine etwas davon
wissen muss. Genau davor warnt der Backlog — „sonst wird der Palast ein
hübscher Nebenschauplatz“. Der Preis dafür ist eine Bedingung: Ein Gang wird
**gerechnet, nicht gespeichert.** In drei Wochen fragt die App „was lag im
Flur?“ und erwartet dieselbe Antwort wie heute.

Aus der Modulschnittstelle wurde dabei zum ersten Mal ein echtes Muster:
`isScene`, `sceneItemsOf`, `subjectOf`, `targetOf`, `displayOf`,
`leniencyFor`, `secondsPerItemFor`. Der Planer weiß von Palästen nichts — er
fragt das Modul.

### G5 wird umgeschrieben (D-017)

Im Backlog steht bei G5 „bizarre visuelle Geschichten erzeugen“. **Das macht
die App nicht.** Ein selbst gebautes Bild sitzt besser als ein vorgesetztes;
wer „stell dir einen qualmenden Toaster vor“ geliefert bekommt, hat einen Satz
gelesen, wo er ein Bild hätte bauen sollen — und beim Abruf fehlt ihm genau
das, was er nie hergestellt hat. Derselbe Grund wie bei D-013 und beim
Major-System.

Was die App stattdessen tut: Sie **verlangt** das Bild und sagt, wie eins
aussieht, das trägt — „Ein Toaster im Flur ist nichts; ein Toaster, der im Flur
den Weg versperrt und qualmt, bleibt.“ Und sie gibt dem Palast als einzigem
Modul sechs Sekunden je Station statt vier, weil Bauen länger dauert als
Ansehen.

Die **Zuordnung** Ding → Station macht dagegen die App (G4), und das ist kein
Widerspruch: „Such dir aus, was wohin gehört“ wäre eine Aufgabe vor der
Aufgabe. Zuordnung ist Verwaltung, das Bild ist die Technik.

### Drei Funde

**Der eigene Gegenstandsvorrat war es wert.** Der Test auf Überschneidung mit
dem Wortvorrat wurde sofort rot: „hedgehog“ und „telescope“ standen in beiden
Listen. Läge dasselbe Wort im Flur **und** im Wortmodul, bekäme der freie
Abruf ein Wort geschenkt, das eigentlich woanders hängt (C6).

**Der Typ hat jede Stelle gefunden, an der ein Vorrat gebaut wird.** Ein Modul
zu `TRAINING_MODULES` hinzuzufügen ergab fünf Übersetzungsfehler — App, drei
Testdateien, ein Bauplan. Keine davon hätte man beim Lesen gefunden, alle
standen nach einer Minute fest.

**Ein Gang ist eine Szene — auch für den Test.** `startMission()` suchte
`.scene` und traf ab jetzt auch Paläste. Das ist kein Testfehler, sondern die
Folge davon, dass die Formen wirklich gleich sind; gesucht ist dort die Szene
**ohne** Weg (`.scene:not(.walk)`). Und die gemeinsamen Handgriffe mussten
wieder an einer Stelle wachsen: `sceneOf` liest beim Gang die Station aus
ihrem eigenen Element, weil vor ihr die Nummer steht, und `answerAt` liest
beim Palast den Ort **vom Schild** statt die Reihenfolge des Weges
vorherzusagen.

Und noch einmal dieselbe Playwright-Falle wie bei „Beginnen“: **„5 Minuten“
steckt in „15 Minuten“.** Zugängliche Namen werden als Teilzeichenkette
verglichen.

### Die Lektion geht vor

Drei Prüfungen im Major-System wurden rot, und die App hatte recht: Seit es
den Palast gibt, kommt auf einer frischen Datenbank **seine** Lektion zuerst.
Ohne sie stehen fünf Orte und fünf Dinge da, und niemand weiß, was er damit
soll — eine ungelehrte Major-Ziffer kostet dagegen nichts, Zahlen lassen sich
auch ohne sie üben, nur mühsamer. Die Tests beginnen jetzt in dem Zustand, in
dem jemand den Palast schon kennt.

**Offen bleibt G3:** eigene Räume. Ein selbst angelegter Palast trägt deutlich
besser als ein fremder — die App sagt das inzwischen selbst und nennt die drei
fertigen Wege eine Krücke.

**Stand:** 244 Kerntests, 80 E2E-Läufe, Typecheck für App und Kern grün.

---

## 2026-08-18 · Der Ausgang aus der Messung (D-018) und der eigene Palast (G3)

### Man muss aus einer Messung herauskommen

Der Auftraggeber hat es angemerkt, und er hatte recht: Wer „Messung beginnen“
antippte, saß fest. Drei Minuten ohne Ausgang sind genau das Muster, gegen das
D-015 geschrieben ist.

Die Frage war nicht **ob**, sondern **was ein Abbruch kostet** — und da gibt
es eine Stelle, an der es gefährlich wird:

> Wer eine begonnene Messung wiederholen kann, bis das Gefühl dabei stimmt,
> misst nicht mehr sein Gedächtnis, sondern seine beste Tagesform.

Deshalb zwei Fälle statt einem:

- **Noch keine Zahl entstanden** (abgebrochen im Einprägen): Die nächste ist
  sofort wieder fällig. Jemanden zwei Wochen warten zu lassen, weil das
  Telefon geklingelt hat, wäre eine Strafe für nichts.
- **Der erste Abruf steht schon in der Zeile**: der übliche Abstand.

Ohne Rückfrage, ohne „bist du sicher?“ — was der Abbruch bedeutet, steht
danach auf dem Startbildschirm, wo man es lesen kann, statt im Weg zu stehen.
Die Wörter sind in beiden Fällen verbraucht: Sie wurden gesehen. Das rückt
näher an die Stelle, an der sich der Quarantänevorrat wiederholt — was die App
ohnehin sagt.

**Und der Test hat sofort eine Lüge gefunden:** Der Hinweis sagte „Du kannst
sofort neu anfangen“, aber ich hatte die Einladung verdeckt, solange er stand.
Ein Satz ohne Weg. Der Knopf steht jetzt im Hinweis selbst.

### G3: der eigene Palast

Die drei mitgelieferten Wege raten, wie die Wohnung eines Fremden aussieht.
Jetzt kann man fünf eigene Orte eintragen — und das ist der Punkt der ganzen
Technik, nicht ein Zusatz.

**Die eine Entscheidung, die zählt: feste Kennungen, freie Beschriftungen.**
In der Datenbank steht `own~7#own3`, das Schild liegt in den Einstellungen.
Stünde die Beschriftung in der Kennung, wäre jede Umbenennung ein stiller
Datenverlust — ein Gegenstand, den man vor zwei Wochen auf dem Balkon abgelegt
hat, ließe sich nicht mehr erfragen, nur weil daraus „Balkontür“ wurde. So ist
es derselbe Ort, anders geschrieben.

Wer seinen Palast wegwirft, verliert seine Gänge trotzdem nicht: Sie bleiben
stehen, werden aber übergangen statt ohne Schild gefragt. „Was lag hier?“ ohne
das „hier“ ist keine Frage.

### Zwei Fehler in Folge an derselben Stelle

Beide im Formular, beide vom E2E gefunden, und zusammen eine kleine Lehre über
React:

1. Ich hängte einen `key` an den Namen des Palastes, damit sich die Felder
   nach dem Laden füllen. Der Baustein wurde damit **beim Speichern**
   ausgetauscht — und die Bestätigung verschwand genau in dem Moment, in dem
   sie erscheinen sollte.
2. Ohne `key` blieben die Felder nach einem Neuladen leer: Der gespeicherte
   Weg trifft später ein als der erste Aufbau des Formulars.

Beides zusammen geht nur mit dem Weg, den React dafür vorsieht — beim Wechsel
des Wertes nachziehen, ohne neu zu montieren. **Ein `key`, der einen Baustein
neu montiert, verwirft dessen Zustand; wenn dieser Zustand die Antwort auf die
Handlung ist, verwirft man die Antwort.**

Und der erste Anlauf des Tests würfelte, bis der Plan einen eigenen Gang zieht
— bei fünf Modulen und vier Palästen ist das etwa jeder zwanzigste Versuch,
und er lief in die Zeitgrenze. Jetzt wird stattdessen **ein Gang fällig
gemacht**: Ein Wiedersehensblock entsteht für jedes Modul, für das etwas
ansteht. Derselbe Weg wie im echten Betrieb, nur ohne die zwei Wochen.

**Stand:** 252 Kerntests, 88 E2E-Läufe, Typecheck für App und Kern grün.

---

## 2026-08-18 · Kein XP. Das Wiedersehen. (K1, D-019)

Die Frage kam als Namensfrage: ob „XP“ nicht besser etwas heißen sollte, das
zur App passt. Die Antwort darauf ist, dass ein neuer Name nichts geheilt
hätte.

**XP ist von Bauart eine erfundene Währung.** Ihre Zahl ist beliebig, ihre
Skala auch — und genau deshalb lässt sich mit ihr jedes Gefühl herstellen, das
man herstellen will. Sie „Merkkraft“ oder „Synapsen“ zu nennen hätte den
Verstoß gegen R-1 nur schöner beschriftet.

Also nicht umbenannt, sondern ersetzt — durch ein Ereignis, das wirklich
stattgefunden hat:

> **Ein Wiedersehen = eine Information, die nach ihrem ersten Tag noch einmal
> abgefragt wurde.**

### Warum ausgerechnet das

**Es ist der Vorgang, auf dem die App steht.** Etwas nach Tagen wieder aus dem
Kopf zu holen, *ist* das Lernen — nicht die verbrachte Zeit, nicht die Zahl
der geöffneten Einheiten. K1 hatte das schon verlangt: an die Abrufleistung
gekoppelt, nicht an Anwesenheit.

**Es ist das Wort, das die App ohnehin benutzt.** Der Wiederholungsblock heißt
seit M1 „das Wiedersehen“. Ein Maß, das man erklären muss, ist schon deshalb
das falsche.

**Es lässt sich nicht farmen.** Das ist der entscheidende Punkt und der Grund,
warum ich es für besser halte als alles, was mir als Punktezahl eingefallen
wäre: Niemand bekommt mehr Wiedersehen, indem er heute länger übt. Sie kommen,
wenn der Plan sagt, dass etwas fällig ist. Wer heute zehn Einheiten macht,
verschiebt damit nur Termine in die Zukunft. **Die einzige Art, die Zahl zu
erhöhen, ist: etwas lernen und an späteren Tagen wiederkommen.**

**Es schrumpft nie.** Eine Zahl, die bei Nichtstun kleiner wird, wäre
Angstdruck mit anderen Mitteln (D-015).

Darunter steht ein Satz, der die halbe Entscheidung trägt: **„Gezählt, nicht
vergeben.“**

### Was es ausdrücklich nicht gibt

**Keine Level, keinen Balken.** Ein Fortschrittsbalken braucht eine Marke, und
jede Marke wäre ausgedacht — „ab 500 bist du Fortgeschritten“ ist eine
Behauptung über einen Menschen ohne Grundlage. Ein E2E-Test prüft die
Abwesenheit des Balkens; ohne ihn könnte später jemand einen einbauen, ohne
dass es auffällt.

**K4 abgelehnt.** „Daily Missions und Memory Quests“ sind manufacturierte
Verpflichtung. Was hier täglich ansteht, entscheidet der Wiederholungsplan —
der weiß es wirklich, aus der Vergessenskurve und nicht aus der
Bindungsabsicht. Ein zweiter, ausgedachter Tagesauftrag daneben nähme dem
echten die Glaubwürdigkeit.

**Stattdessen ein Rekord, der einer ist (K5):** der längste Fall — wie oft
dieselbe Information schon zurückkam. Er wächst nur über Wochen, weil die
Abstände mit jedem Mal größer werden. An einem Nachmittag ist er nicht zu
holen, und genau darum taugt er.

**Stand:** 260 Kerntests, 98 E2E-Läufe, Typecheck für App und Kern grün.

### Zwei Nachträge aus dem Prüflauf

Der volle Lauf hat zwei Stellen gefunden, beide in Tests und beide dieselbe
Ursache wie schon zweimal: **Ein Gang ist eine Szene.** Die Einheitsprüfung
erwartete im Szenenfall den Missionstext, und die Palastprüfung hielt das
erste Schild für das gesuchte — dabei kann davor noch eine gewöhnliche Runde
durch denselben eigenen Palast stehen. Sie geht jetzt durch, bis der Vorspann
„Und von früher“ dasteht; das ist die einzige Stelle, an der sich ein
Wiedersehen sicher erkennen lässt.

Der zweite Nachtrag ist interessanter, weil er nichts mit den Tests zu tun
hat: **Der Palast prägt dreißig Sekunden lang ein** — fünf Stationen à sechs
Sekunden (D-017). Das sprengte zuerst nur die
Standardgrenze der Prüfung von dreißig Sekunden — bis dahin war das längste
Modul die Mission mit zwanzig.

**Der Bildschirmabzug einer zweiten fehlgeschlagenen Prüfung zeigte dann, dass
es kein Testproblem war.** Im Notfallmodus bleiben nach dem Wiedersehensanteil
rund vierzig Sekunden für die Runde; dreißig davon gingen ans Einprägen, und
für fünf Fragen blieben zehn. **Zwei Sekunden je Station sind keine Frage,
sondern eine Formalie.** Anders als beim Wortmodul lässt sich das nicht durch
weniger Stücke lösen — ein halber Weg ist kein Weg. Also gibt es den Palast
erst ab drei Minuten. Sechzig Sekunden sind für den Fall gedacht, dass jemand
zwischen Tür und Angel übt; ein Gedächtnispalast ist das Gegenteil davon.

Und die erste Fassung dieser Änderung war falsch: Ich hatte die Modulliste
**vor** der Auswahl der fälligen Einträge gekürzt — damit wäre ein fälliger
Gang in einer kurzen Einheit stillschweigend liegengeblieben. Ein Kerntest,
den ich im selben Zug geschrieben hatte, hat es sofort gefunden. **Was fällig
ist, kommt zurück** (D-004), egal wie kurz die Einheit ist; dort wird nichts
eingeprägt, es sind nur die Fragen. Gelernt wird aus der gekürzten Liste,
gefragt aus der vollen.

---

## 2026-08-18 · Das Gedächtnisprofil (E) — und der Test, den es nicht gibt

M2 hatte noch eine offene Flanke: das Memory Profile. Es ist die gefährlichste
Anzeige der ganzen App, weil sie nicht wie eine Punktzahl aussieht, sondern
**wie ein Befund über einen Menschen**.

### E1 wird abgelehnt (D-021)

Im Backlog stand „Erstdiagnose — YOUR MEMORY DNA: kurz, spielbar, nicht wie
ein Test“. Der Grund dagegen stand zwei Zeilen tiefer im selben Backlog, bei
E7: **„82 nach drei Aufgaben wäre eine erfundene Zahl.“**

Ein Profil aus drei Minuten Erstkontakt ist genau das — und es wäre die
eindrucksvollste erfundene Zahl der App. „Dein visuelles Gedächtnis: 41“ liest
sich wie eine Diagnose und ist ein Münzwurf.

Der Preis dafür ist bekannt und wird bezahlt: Der Ersteindruck ist schwächer.
Eine App, die einem am ersten Tag ein buntes Netzdiagramm über die eigene
Person zeigt, fühlt sich persönlicher an als eine, die sagt „dafür weiß ich
noch zu wenig“. **Sie ist es nur nicht.**

### Was gezählt wird

Ausschließlich der **verzögerte Abruf**: wie oft etwas nach seinem ersten Tag
zurückkam, und wie oft es dabei weg war. Wie gut jemand am Lerntag selbst
abschneidet, bleibt draußen — das ist der Trainingsscore, und ihn als
Gedächtnisleistung auszugeben ist genau die Vermischung, gegen die F1
geschrieben ist.

Beide Zahlen stehen exakt in den Terminen (`reviews - 1` und `lapses`), und
sie können sich nicht widersprechen: FSRS führt einen Rückfall erst, wenn eine
Information den Lernzustand verlassen hat. Der Anteil bleibt damit eine echte
Quote und keine gerundete Behauptung.

### Drei Achsen bleiben leer — und das steht dort auch

Für *Visuell*, *Aufmerksamkeit* und *Arbeitsgedächtnis* hat ANITEW kein Modul.
Dort steht „misst diese App nicht“, kein leerer Balken mit Hoffnung daneben.
Dieselbe Regel wie auf der Wissenschaftsseite: **„nicht gemessen“ darf nirgends
wie „schlecht“ aussehen.** Deshalb ist „zu wenige Gelegenheiten“ auch ein
eigener Fall und keine Null — eine Null ließe sich als Ergebnis lesen.

*Langfristiger Abruf* verweist auf die Messung: Ihn hier noch einmal aus
Trainingsdaten zu schätzen hieße, zwei Zahlen über dasselbe zu haben, und die
eine wäre die schlechtere, ohne dass jemand wüsste, welche.

Eine **neunte Achse** kam dazu: *Zusammenhänge*, für die Missionen. Sie üben,
dass Zimmer, Gegenstand, Uhrzeit und Ort zu einer Person gehören — eine eigene
Fähigkeit, und die alltagsnächste von allen. Unter „Namen & Gesichter“ wäre
bequem und falsch.

### Kein Netzdiagramm

Ein Netz aus neun Achsen sähe eindrucksvoll aus und würde genau das
verwischen, worauf es ankommt. Vor allem aber: **Ein Netz braucht für jede
Achse einen Wert — es zwingt zur erfundenen Zahl.** Also eine Liste, in der
jede Zeile ihren eigenen Satz sagen darf.

Und die Schwachstelle (E5) wird nur genannt, wenn sich die Spannen zweier
Achsen **nicht überlappen**. Sonst hieße „Zahlen sind deine Schwachstelle“
nur, dass der Zufall an diesem Tag so lag — und eine App, die daraufhin den
Trainingsplan umbaut, baut ihn auf Rauschen um.

**Stand:** 275 Kerntests, 112 E2E-Läufe, Typecheck für App und Kern grün.
Offen in E: der Verlauf über die Zeit (E4), die adaptive Planung selbst (E5)
und ihr erklärender Satz (E6).
