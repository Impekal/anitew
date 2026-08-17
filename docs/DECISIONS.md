# Entscheidungen — ANITEW

Format: Nummer, Datum, Entscheidung, Begründung. Neueste unten. Eine
Entscheidung wird nie überschrieben, sondern nur durch eine neue ersetzt, die
sie ausdrücklich ablöst.

Wo eine Entscheidung mit „*Vorschlag angenommen*“ endet, hat der Auftraggeber
die Frage an die Umsetzung zurückgegeben. Dann steht hier auch, **was der
Vorschlag kostet und was er ausschließt** — damit später nachvollziehbar ist,
worauf sich das Ja bezogen hat.

---

## D-001 · 2026-08-17 · Der Name ist ANITEW

Aus den Kandidaten (ANITEW, MEMORA, MNEMO, RECALL, MEMORY QUEST) fällt die Wahl
auf **ANITEW**.

Das ist die schwierigere und die bessere Wahl. MEMORA, MNEMO und RECALL sagen
sofort, worum es geht — und genau deshalb sind sie im App Store hundertfach
belegt und markenrechtlich eng. ANITEW sagt zunächst nichts, ist dafür aber
frei, eindeutig auffindbar und gehört uns allein. Der Untertitel trägt die
Bedeutung:

> **ANITEW** — *Train your memory. Measure your progress. Remember more.*

Offen bleibt die Markenrecherche (Backlog R3), bevor Icon und Store-Eintrag
entstehen. Das ist keine Rechtsberatung, sondern eine Prüfung, die vor Geld­
ausgaben stattfinden sollte.

## D-002 · 2026-08-17 · Kostenlos, mit Spende. Pro bleibt möglich, aber gebunden

Die App ist kostenlos. Wer will, kann spenden. Ein späteres Pro-Angebot wird
nicht ausgeschlossen — aber ab heute an eine Regel gebunden:

**Alles, was misst, trainiert und erinnert, bleibt dauerhaft kostenlos.**
Ein Pro-Angebot darf nur Bequemlichkeit hinzufügen (etwa automatischer
Cloud-Abgleich, unbegrenzte KI-Aufbereitung eigener Inhalte, Themes), niemals
Trainingsleistung zurückhalten.

Der Grund ist nicht Großzügigkeit, sondern Glaubwürdigkeit: Eine App, deren
Kernversprechen „wir messen ehrlich, ob du besser wirst“ lautet, verliert genau
dieses Versprechen in dem Moment, in dem die Messung hinter einer Bezahlschranke
steht. Und der Weg zurück ist teuer — Funktionen später kostenpflichtig zu
machen, die Nutzer kostenlos kannten, kostet mehr Vertrauen, als es einbringt.

Praktische Folge, die niemand gern hört: Spenden sind im Web unproblematisch
(externer Link auf Ko-fi, PayPal, GitHub Sponsors). In den Stores ist das
strenger geregelt, und die Regeln unterscheiden sich zwischen Google und Apple.
Das wird geprüft, wenn wir dort ankommen (Backlog K9, Q4) — nicht vorher, denn
Phase 1 ist reines Web.

## D-003 · 2026-08-17 · Der Stack

**React 18 + TypeScript (strict) + Vite 6 + vite-plugin-pwa + Dexie/IndexedDB.**
Kein Router, keine State-Bibliothek, bis eine gebraucht wird. *Vorschlag
angenommen.*

Im Klartext: das gleiche Werkzeug, auf dem RReader schon läuft. Alles davon ist
kostenlos, permissiv lizenziert, auf jedem Telefon lauffähig und in diesem
Projekt erprobt. Es entstehen keine laufenden Kosten und keine Abhängigkeit von
einem Anbieter — am Ende steht ein Ordner statischer Dateien, den jeder Hoster
ausliefern kann.

Was das ausschließt: kein React Native, kein Flutter, keine zwei getrennten
Codebasen für iOS und Android. Genau das ist beabsichtigt (siehe D-010).

## D-004 · 2026-08-17 · Der Wiederholungsalgorithmus ist FSRS

**FSRS** (Free Spaced Repetition Scheduler) mit mitgelieferten Standard­
parametern; die persönliche Anpassung der Parameter geschieht später **auf dem
Gerät** aus der eigenen Lernhistorie. *Vorschlag angenommen.*

Worum es geht: Irgendetwas muss entscheiden, wann du eine Sache wieder gefragt
wirst. Die einfache Antwort wäre eine feste Leiter — 1 Tag, 3 Tage, 7 Tage, für
alle gleich. Das ist die alte Methode (SM-2, das Anki der 2000er) und sie ist
grob: Sie behandelt eine Telefonnummer wie einen Gesichtsnamen und dich wie
jeden anderen.

FSRS führt stattdessen für **jede einzelne Information** zwei Werte mit — wie
fest sie sitzt und wie schwer sie dir fällt — und sagt daraus voraus, wann du
sie wahrscheinlich vergisst. Das ist genau der Satz aus dem Produktgespräch:
*„Diese Information vergisst DU wahrscheinlich in ungefähr 5 Tagen.“* Ohne
diesen Algorithmus wäre der Punkt nicht umsetzbar.

**Kosten: keine.** FSRS ist quelloffen und permissiv lizenziert, läuft
vollständig auf dem Gerät, braucht keinen Server und keinen Dienst. Die genaue
Lizenz der verwendeten Umsetzung wird vor dem Einbau geprüft und in
`THIRD_PARTY_LICENSES.md` eingetragen (Backlog R1).

## D-005 · 2026-08-17 · Bildmaterial erzeugen wir selbst — im Code, nicht als Sammlung

Kein Foto-Archiv, keine eingekaufte Bibliothek, keine fremden Gesichter.
Stattdessen drei Quellen, in dieser Reihenfolge:

1. **Gesichter: ein parametrischer SVG-Generator im Code.** Kopfform, Augen,
   Nase, Mund, Haar, Bart, Brille, Hautton — aus einer Zahl (dem Seed) entsteht
   ein Gesicht. Aus einem Seed folgt immer dasselbe Gesicht, aus verschiedenen
   Seeds Millionen verschiedene. Größe im Bundle: einige Kilobyte Code statt
   Hunderte Megabyte Bilder.
2. **Objekte und Orte: ein CC0-Icon-Satz**, geprüft und dokumentiert, ergänzt um
   eigene Formen.
3. **Missionsszenen (später):** einmalig per KI erzeugte Illustrationen, als
   feste Dateien im Repo — nur dort, wo eine gezeichnete Szene wirklich mehr
   trägt als eine beschriebene.

Der Auftraggeber hat gesagt: „lizenzfrei, am besten du generierst sie“. Die
naheliegende Lesart wäre gewesen, ein paar tausend Bilder per KI zu erzeugen und
ins Repo zu legen. Der Generator ist besser, und zwar aus vier Gründen: er ist
unendlich statt endlich (bei einer festen Sammlung sind nach zwei Wochen alle
Gesichter bekannt, und die App misst dann Wiedererkennen statt Gedächtnis), er
ist winzig, er funktioniert offline, und er umgeht das gesamte Rechtefeld —
Fotos echter Menschen werfen neben dem Urheberrecht auch Persönlichkeitsrechte
auf, und die verschwinden nicht dadurch, dass ein Bild „lizenzfrei“ heißt.

**Was wir dafür in Kauf nehmen, ehrlich benannt:** Gezeichnete Gesichter sind
leichter zu unterscheiden als echte. Namen-Gesichter-Training mit Zeichnungen
ist also etwas einfacher als das echte Leben. Das ist eine Aussage über die
Übung, und nach Regel R-1 darf sie nicht als Aussage über den Alltag verkauft
werden. Fotorealistische Porträts als optionaler Nachladeinhalt bleiben eine
Möglichkeit für später (Backlog D16).

**Nachtrag 2026-08-17, beim Bau des Moduls.** Zwei Dinge, die sich erst am
gezeichneten Ergebnis entschieden haben:

*Der Bart richtet sich nach dem Namen.* Der Generator würfelte ihn blind, und
rund jedes vierte Gesicht bekam einen — auch Margarethe und Jolanda. Das liest
sich nicht als Vielfalt, sondern als Fehler, und wer einen Fehler sieht,
schaut auf den Fehler statt auf das Gesicht, das er sich merken soll. Die
Namenslisten sind deshalb zweigeteilt. Das ist **keine Aussage darüber, wie
Menschen aussehen** — es gibt bärtige Frauen. Es ist eine Aussage über eine
Zeichnung aus fünf Strichen: Die kann Zwischentöne nicht transportieren, also
zeichnet sie das Naheliegende und behauptet nicht mehr, als sie zeigen kann.
Kahlköpfigkeit bleibt für alle möglich; sie fällt nicht als Fehler auf.

*Kleidung trägt bewusst keine Information.* Die Schultern sind für alle
gleich und ohne eigene Farbe. Ein farbiges Hemd wäre das bequemste Merkmal von
allen — man würde sich „der in Blau“ merken statt des Gesichts, und die App
misst dann Kleidung. Aus demselben Grund bleibt die Zeichnung insgesamt
schlicht: Zu viele Einzelheiten machen Gesichter **ähnlicher**, nicht
verschiedener, weil am Ende nur „der mit der Brille“ hängen bleibt.

*Geprüft wird im Raster, nicht einzeln.* `scripts/facesheet.mjs` legt vierzig
Gesichter nebeneinander. Einzeln sah jedes annehmbar aus; nebeneinander war
sofort zu sehen, dass die halbe Reihe dieselbe schnurgerade Haarlinie trug.
Was nur einzeln geprüft wird, wird gar nicht geprüft.

## D-006 · 2026-08-17 · Wie die Fortschrittszahl entsteht

Das ist die Antwort auf die schwierigste Frage im Projekt: **Woher kommt die
Zahl, wenn die App sagt „Memory Strength +18 %“?** *Vorschlag angenommen.*

Das Problem in einem Satz: Wer eine Übung 30 Tage lang macht, wird in dieser
Übung besser. Das beweist noch nicht, dass sein Gedächtnis besser geworden ist —
er kennt vielleicht nur die Übung. Fast das gesamte Genre der Brain-Training-Apps
verwechselt genau diese beiden Dinge, und daraus stammt sein schlechter Ruf.

Deshalb misst ANITEW an zwei getrennten Stellen:

**Der Trainingsscore** entsteht nebenbei in jeder Session. Er zeigt, wie es
heute lief. Er darf schwanken, er darf motivieren, und er heißt nie „Memory
Strength“.

**Der Benchmark** ist ein eigener, kurzer Test — rund drei Minuten, am Tag 0 und
danach alle 14 Tage. Vier Eigenschaften machen ihn belastbar:

- Er benutzt **Quarantäne-Items**: Inhalte, die es sonst nirgends in der App
  gibt und die nie in den Wiederholungsplan wandern. Was im Benchmark gefragt
  wird, hast du nie geübt.
- Er ist **immer gleich aufgebaut** — gleiche Anzahl, gleiche Zeiten, gleiche
  Abstände. Nur der Inhalt ist jedes Mal neu.
- Er misst **über einen Abstand hinweg**: sofort, nach 20 Minuten und am Folgetag.
  Behalten über Zeit ist der Punkt, nicht Auffassung im Moment.
- Er vergleicht dich **mit dir selbst am Tag 0**, nie mit anderen Nutzern.

Und zwei Ehrlichkeiten, die dazugehören:

- Auch ein Benchmark wird durch Gewöhnung an das Format ein wenig besser. Die
  ersten beiden Messungen zählen deshalb als **Eichung**, und die App sagt das,
  statt am Tag 14 eine große Zahl zu feiern.
- Solange die Datenlage dünn ist, steht dort eine **Spanne**, kein exakter Wert.

Die große Prozentzahl auf dem Abschlussbildschirm stammt ausschließlich aus dem
Benchmark. Antippen erklärt in einem Satz, was gemessen wurde. Ohne diesen
Mechanismus gibt es keinen öffentlichen Release (Backlog F, Meilenstein M3).

## D-007 · 2026-08-17 · Sprachen: Quelle Deutsch, Start in der Systemsprache

Alle Texte entstehen auf **Deutsch** und werden von dort übersetzt. Beim ersten
Start übernimmt die App die **Systemsprache des Geräts**, sofern wir sie haben,
sonst Englisch. Die Sprache lässt sich sofort und ohne Suche ändern — sichtbar
auf dem ersten Bildschirm, nicht vergraben in Einstellungen.

Getrennt davon bleibt die **Trainingssprache** (Backlog L7): Die Oberfläche kann
deutsch sein, während heute auf Japanisch trainiert wird.

## D-008 · 2026-08-17 · Streak-Regeln

Es gibt eine Streak, und sie ist absichtlich schwer zu verlieren:

- **Ein Tag zählt ab 60 Sekunden.** Auch der Notfallmodus hält die Streak am
  Leben.
- Daneben, als eigene Zahl: **wie viele davon volle Challenges waren.** Wer
  ernsthaft trainiert, sieht das — aber wer einen schlechten Tag hat, verliert
  nichts.
- **Ein Schutztag pro Woche**, bis zu zwei angespart. Ein verpasster Tag
  vernichtet keine sechzig.
- **Schutztage sind nicht kaufbar und nicht durch Werbung verdienbar.** Das wäre
  genau das Muster, das Regel K7 ausschließt: erst Angst erzeugen, dann gegen
  Aufmerksamkeit oder Geld lindern.

Der Gedanke dahinter: Eine Streak soll das Zurückkommen belohnen, nicht das
Wegbleiben bestrafen. Apps, die eine 200-Tage-Serie an einem Grippetag
vernichten, verlieren den Nutzer nicht an dem Tag, sondern am Tag danach.

## D-009 · 2026-08-17 · Abgleich: lokal — und auf Wunsch in die Cloud des Nutzers

Drei Stufen, in dieser Reihenfolge gebaut:

1. **Ohne Anmeldung (Standard, Phase 1):** Alles bleibt auf dem Gerät. Sicherung
   und Gerätewechsel über eine Exportdatei, die der Nutzer selbst ablegt — auch
   in iCloud Drive oder Google Drive, wenn er möchte. Kostet nichts, braucht
   niemanden.
2. **Mit Anmeldung, Android/Web (Phase 2):** Anmeldung bei **Google**, Abgleich
   in den app-privaten Ordner des eigenen Google Drive. Dieser Ordner ist für
   den Nutzer und für uns gleichermaßen unsichtbar für andere Apps; die Daten
   liegen im Speicherplatz des Nutzers.
3. **Mit Anmeldung, iOS (Phase 3):** **iCloud**, realistisch erst mit der
   nativen iOS-App — CloudKit aus einer reinen Web-App heraus setzt ein
   Apple-Entwicklerkonto und einen App-Container voraus und lohnt vorher nicht.

Entscheidend und ausdrücklich festgehalten: **Die Anmeldung erfolgt beim Nutzer
selbst, nicht bei uns.** ANITEW bekommt kein Benutzerkonto, keine Nutzerdatenbank
und keinen Server. Wir speichern nichts; wir legen die Datei des Nutzers in
seinen eigenen Speicher. Damit bleibt „local-first, kein Konto, kein Tracking“
wahr, obwohl es Abgleich gibt.

Was noch zu klären ist und im Backlog steht: Konfliktauflösung bei zwei Geräten
(N9), Googles Freigabeverfahren für den Drive-Zugriff samt der dafür nötigen
Datenschutzerklärung (N10, kostenlos, aber es dauert).

## D-011 · 2026-08-17 · Die Oberfläche soll wirken, nicht nur funktionieren

Vorgabe des Auftraggebers: schön, sehr angenehm, auf Gefühl und Seele wirkend —
man soll **gern** in der App sein.

Das ist keine Politur am Ende, sondern eine Anforderung an jeden Bildschirm,
und deshalb steht sie hier statt in einer Wunschliste. Damit sie überprüfbar
bleibt und nicht zum Geschmacksurteil wird, gilt sie in sechs Regeln:

**G-1 Ruhe statt Reiz.** Keine Konfetti, keine Münzen, keine springenden
Zahlen, kein Countdown, der drängt. Die Wirkung kommt aus Raum, Rhythmus und
Wärme — nicht aus Aufmerksamkeitsreizen. Das ist zugleich die einzige
Gestaltung, die zu K7 passt: Eine App, die Angst erzeugt und sie dann lindert,
fühlt sich nie gut an, sondern nur dringend.

**G-2 Ein Ding pro Bildschirm.** Wer sich acht Wörter merken soll, sieht ein
Wort — nicht ein Wort, einen Zähler, einen Balken, eine Uhr und einen Hinweis.
Alles, was nicht gerade gebraucht wird, verschwindet. Der schnellste Weg zu
einer angenehmen Oberfläche ist Weglassen.

**G-3 Nichts springt.** Jeder Wechsel hat einen Übergang: Wörter kommen und
gehen weich, Bildschirme blenden. Ein harter Schnitt fühlt sich nach Maschine
an, ein Übergang nach Atem. Wer „weniger Bewegung“ eingestellt hat, bekommt
alles sofort und nichts davon — die Ruhe darf nie zulasten derer gehen, denen
Bewegung schadet.

**G-4 Warm, nicht kalt.** Gedecktes Papier im Hellen, warmes Dunkel im
Dunklen. Für die Inhalte eine **Serifenschrift** — ein Wort, das man sich
merken soll, soll aussehen wie etwas zum Lesen und nicht wie ein Messwert.
Ausschließlich Systemschriften: nichts nachladen, offline vollständig, keine
Lizenz, kein fremder Server (D-009/A10).

**G-5 Die App schimpft nicht.** Was nicht erinnert wurde, ist kein Versagen,
sondern der Ausgangspunkt. Der Ton bleibt freundlich und nüchtern — auch
freundlich heißt nicht, jedem Ergebnis Lob hinterherzuwerfen.

**G-6 Schönheit erkauft sich nie mit einer falschen Zahl.** R-1 steht über
allem. Ein Ergebnisbildschirm darf warm sein, aber er darf nicht schmeicheln:
keine aufgehübschte Prozentzahl, kein Fortschritt, der keiner ist. Eine App,
die sich gut anfühlt, weil sie lügt, fühlt sich nur so lange gut an, bis es
auffällt — und danach nie wieder.

**G-7 Unterhaltsam — aber die Unterhaltung kommt aus dem Spiel, nicht aus dem
Lärm.** Nachgereichte Vorgabe des Auftraggebers, und sie steht scheinbar gegen
G-1. Sie tut es nicht, wenn man auseinanderhält, woher Vergnügen kommt:

*Nicht* aus Reiz — Fanfaren, Konfetti, Münzregen. Das ist die billige Variante,
sie nutzt sich in zwei Wochen ab, und danach bleibt eine App, die schreit.

*Sondern* aus vier Quellen, in dieser Reihenfolge ihrer Kraft:

1. **Inhalt mit Einfall** — die Missionen (Backlog H), der Gedächtnispalast
   (G), die Quests (K4). „Zimmer 314, roter Koffer, Elena, Abfahrt 18:40“ ist
   unterhaltsam, weil es eine kleine Geschichte ist. Hier liegt der Hauptteil,
   und er kommt mit **M4**.
2. **Abwechslung** — nie zweimal derselbe Tag. Andere Wörter, andere Aufgaben,
   andere Begrüßung.
3. **Spielgefühl im Kleinen** — jede Berührung antwortet. Ein getipptes Wort
   landet sichtbar, ein Ergebnis blättert sich auf, statt einfach dazustehen.
   Das ist der Teil, der **sofort** geht und die Oberfläche lebendig macht.
4. **Der eigene Fortschritt** — die stärkste Belohnung überhaupt (K8), sobald
   die Messung steht (M3).

Ehrlich dazu: In M1 lässt sich nur Nummer 2 und 3 einlösen. Was ANITEW
wirklich unterhaltsam macht, ist Inhalt, und Inhalt ist Arbeit. Eine
Oberfläche, die schon jetzt so tut, als wäre sie ein Spiel, wäre eine Attrappe
— und Attrappen sind genau das, was die App laut R-1 nicht macht.

**G-8 Futuristisch und neuronal — als Präzision, nicht als Neon.** Dritte
Vorgabe des Auftraggebers, und die schwierigste, weil sie gegen G-4 zu stehen
scheint: warm und seelenvoll auf der einen Seite, futuristisch auf der anderen.

Der naheliegende Weg wäre der falsche. „Futuristisch“ heißt in den meisten Apps
Cyberpunk: tiefblaues Schwarz, Neongrün, Raster, Glitch, harte Kanten. Das ist
kalt, es ist laut, es ist seit zehn Jahren dasselbe Bild — und es würde alles
zerstören, was G-1 und G-4 aufgebaut haben.

Die Auflösung liegt in einer Arbeitsteilung, und sie ist der eigentliche Grund,
warum beides zusammengeht:

**Warm ist der Inhalt. Kühl ist die Technik.**

- **Serifenschrift für alles, was der Mensch beiträgt** — die Wörter, die er
  sich merkt, das, was er abruft, die Anrede. Warm, gedruckt, lesbar.
- **Schreibmaschinenschrift für alles, was die App misst** — Uhr, Zähler,
  Ergebnis. Gleich breite Ziffern, weite Sperrung, nüchtern. Das wirkt wie ein
  Instrument, und es ist zugleich inhaltlich richtig: Eine gemessene Zahl soll
  aussehen wie eine gemessene Zahl (R-1).
- **Bernstein für den Menschen, kühles Grün für das Netz.** Zwei Farbfamilien
  statt einer, klar verteilt.

„Neuronal“ wird wörtlich genommen und nicht als Dekor: **Knoten und
Verbindungen**, Signale, die einen Weg entlanglaufen. Das ist keine Metapher,
die man der App überstülpt — es ist ihre Form. Die Wiederholungskurve ist eine
Kette mit wachsenden Abständen (schon im Zeichen, D-001). Die Punkte beim
Einprägen sind eine Kette, auf der ein Signal wandert. Der Gedächtnispalast
wird ein Graph (Backlog G). Alles davon *ist* bereits ein Netz; es wird nur
sichtbar gemacht.

Die Grenze bleibt G-1: Das Netz im Hintergrund atmet, es blinkt nicht, und bei
„weniger Bewegung“ steht es still.

**Wie präsent es sein darf, hängt vom Bildschirm ab** — nachgeschärft, nachdem
der erste Anlauf zu zaghaft ausfiel und der zweite zu laut:

- Auf dem **Startbildschirm** und im **Ergebnis** ist es deutlich da. Dort ist
  Platz, und dort soll es wirken.
- **Während einer laufenden Einheit** zieht es sich fast vollständig zurück.
  Beim Einprägen steht ein einziges Wort im Mittelpunkt; ein Gewebe aus fünfzig
  Knoten dahinter wäre dann kein Hintergrund mehr, sondern ein Mitbewerber
  (G-2). Die Aufmerksamkeit verengt sich, also verengt sich auch das Bild — und
  es blendet dabei, es springt nicht.

Zwei Dinge, an denen die ersten Versuche gescheitert sind und die deshalb
festgehalten gehören:

*Die Mitte wird gedämpft, nicht ausgeschnitten.* Eine Maske, die das Zentrum
ganz herausnimmt, beruhigt den Text — und reißt ein Loch in ein Netz, dessen
ganzer Sinn Zusammenhang ist. Ein Netz mit Loch sieht kaputt aus, nicht ruhig.

*Das Feld ist hochkant, nicht quadratisch.* Ein quadratisches Feld wird auf
einem Telefonbildschirm seitlich beschnitten; sichtbar blieb knapp die halbe
Breite. Das Netz wirkte dadurch dünn und löchrig, obwohl es das nicht war — der
Fehler lag nicht in der Zeichnung, sondern im Zuschnitt.

*Und es bleibt kaum sichtbar.* Nachdem der Zuschnitt saß, war die naheliegende
Folgerung falsch: Ein Netz, das nun über den ganzen Bildschirm reichte, brauchte
**weniger** Gewicht, nicht mehr. Haarfeine Linien, winzige Knoten, niedrige
Deckkraft — es soll als Textur wirken, die man eher spürt als liest. Die
Faustregel für jede spätere Änderung: Wer das Netz auf dem Startbildschirm
*bemerkt*, bevor er den Knopf sieht, hat es zu stark eingestellt.

Eingestellt ist es damit auf Strichstärke 0,14 und Deckkraft 0,2 im Dunkeln
wie im Hellen; während einer laufenden Einheit 0,07 beziehungsweise 0,05.
Diese Zahlen stehen hier, weil sie sonst nur im Stylesheet stünden und beim
nächsten Umbau als beliebig gälten — sie sind es nicht, sie sind ertastet.

**G-9 Es leuchtet und es klingt — beides warm und beides leise.**
Nachgereichte Vorgabe: „spielerischer, unterhaltsamer, Leuchtungen, Töne“. Das
ist kein Widerruf von G-1, sondern dessen Ausbau in eine Richtung, die vorher
fehlte: Die Oberfläche war angenehm, aber sie war *stumm und matt*. Angenehm
allein ist noch nicht schön.

*Licht* ist Material, nicht Feuerwerk. **Und im Hellen funktioniert es
anders als im Dunkeln** — nicht schwächer, sondern umgekehrt. Auf Papier kann
man nicht mit Licht leuchten: Der Hintergrund ist schon fast weiß, alles
Hellere daneben verschwindet darin. Ein Leuchten auf hellem Grund ist ein
warmer, satter Schein, der *dunkler* ist als das Papier — physikalisch ein
farbiger Schatten, im Auge ein Glühen. Wer im Hellen nur die dunklen Werte
abschwächt, bekommt gar nichts; genau das ist im ersten Anlauf passiert und
auf dem Telefon aufgefallen.

Faustregel aus drei Anläufen: **Ein Schein auf hellem Grund wirkt auf dem
Entwicklungsmonitor immer kräftiger als auf einem Telefon im Tageslicht.** Im
Zweifel zu kräftig einstellen und vom Gerät aus zurücknehmen, nicht umgekehrt. Der Startknopf atmet in einem Schein,
jedes Wort leuchtet beim Erscheinen auf und beruhigt sich, eine gelandete Marke
glimmt kurz nach, die Ergebniszahl trägt einen Hof. Im Dunkeln darf das
deutlich sein; auf hellem Papier ist starkes Licht keine Helligkeit, sondern
Unschärfe, deshalb liegen dort alle Werte niedriger. Nirgends blinkt etwas.

*Ton* wird erzeugt, nicht mitgeliefert — kein einziges Audiofile, alles
entsteht zur Laufzeit aus Sinusschwingungen. Derselbe Gedanke wie bei den
Gesichtern (D-005): kein Gewicht, keine Lizenz, offline vollständig. Alle Töne
stammen aus einer **pentatonischen** Tonleiter, die keine Halbtonschritte hat;
dadurch kann keine Reihenfolge falsch klingen. Beim Einprägen steigt die
Tonhöhe mit jedem Wort — man hört, wie weit die Runde ist, ohne hinzusehen.

Die Grenze, an der beides gemessen wird: **Ein Ton bestätigt, er belohnt
nicht.** Keine Fanfare für eine richtige Antwort, kein Trauerakkord für eine
falsche — das wäre die billige Variante aus G-7 und zugleich ein Urteil, das
der App nach G-5 nicht zusteht. Wer den Ton abschaltet, darf nichts vermissen
außer der Bestätigung. Abschalten geht mit einem Tipp auf dem ersten
Bildschirm, voreingestellt ist **an**: Eine Einstellung, die man erst finden
muss, um überhaupt zu merken, dass es sie gibt, ist keine.

Und weiterhin gilt G-3: Bei „weniger Bewegung“ steht alles still. Der Ton
bleibt davon unberührt — er ist keine Bewegung, sondern hat seinen eigenen
Schalter.

## D-010 · 2026-08-17 · Der Kern kennt keinen Browser

Bekräftigt aus dem Produktgespräch, weil es die teuerste Regel ist, wenn man sie
zu spät befolgt: `src/core/` — Engine, Wiederholungsplanung, Bewertung,
Profil, Sessionaufbau — ist reines TypeScript ohne Zugriff auf DOM, React oder
Browser-Schnittstellen. Alles Plattformabhängige (Speicher, Uhr,
Benachrichtigungen, Ton, Dateien, Cloud) liegt hinter einer Adapterschicht.

Zwei Dinge folgen daraus, und beide sind der eigentliche Zweck: Der Kern lässt
sich ohne Browser testen, und die App lässt sich später als Android-TWA und als
native iOS-App verpacken, ohne noch einmal geschrieben zu werden.

## D-012 · 2026-08-17 · Wie streng verglichen wird, entscheidet das Modul

Die Bewertung verzeiht ab fünf Zeichen einen Tippfehler — eine Einfügung, eine
Auslassung, eine Vertauschung. Das ist bei **Wörtern und Namen** richtig und
steht in `grading.ts` ausführlich begründet: Gemessen werden soll das
Gedächtnis, nicht die Rechtschreibung und nicht die Tastatur. „Blmue“ statt
„Blume“ ist erinnert, nur falsch getippt.

Bei **Zahlen** ist dieselbe Nachsicht falsch, und zwar nicht ein bisschen,
sondern grundsätzlich: 4719 und 4791 sind nicht dieselbe PIN. Zwei vertauschte
Ziffern sind eine andere Zahl, und sie auseinanderzuhalten **ist** die Übung.
Dort milde zu sein hieße, die Aufgabe abzuschaffen und trotzdem einen Punkt zu
geben — eine geschenkte Zahl, die in dieselbe Anzeige einginge wie die
verdienten. Das ist Regel R-1.

Deshalb ist die Strenge eine Eigenschaft des **Moduls** und kein Schalter in
der Bewertungsfunktion: Sie ist eine Aussage über den Gegenstand, nicht über
das Verfahren. `leniencyFor()` steht in `session/plan.ts` bei `isPrompted()`,
also bei den übrigen Moduleigenschaften. Wer ein Modul hinzufügt, entscheidet
beides an einer Stelle.

Die allgemeine Form davon: **Ein Modul bringt seine Regeln mit.** Frei oder
gestützt abgefragt, streng oder nachsichtig verglichen, Zifferntastatur oder
Buchstaben — das gehört zum Gegenstand und nicht in eine wachsende Kette von
Sonderfällen im Bildschirmcode.

## D-013 · 2026-08-17 · Die Technik wird beigebracht — das Bild liefert die App nicht

D5 ist der Satz, an dem sich ANITEW von jeder Brain-Game-App unterscheidet:
**Merktechniken werden beigebracht, nicht nur abgefragt.** Eine App, die einen
dreimal täglich Ziffern raten lässt, macht niemanden besser — sie misst nur,
wie gut man ohnehin schon ist.

Die erste Technik ist das **Major-System**, und zwar deshalb, weil man sie in
der ersten Sitzung spürt: Jede Ziffer bekommt einen Konsonanten, die Vokale
bleiben frei. Aus vier Ziffern wird ein Wort und aus dem Wort ein Bild.

Drei Entscheidungen dazu, alle drei gegen den bequemeren Weg:

**Die App liefert das Wort zur Zahl nicht.** Sie bringt die Zuordnung bei, eine
Ziffer nach der anderen, mit dem Bild, an dem man sie behält — „das kleine n
hat zwei Abstriche“. Das Wort baut der Nutzer. Ein selbst gebildetes Bild
sitzt besser als ein vorgesetztes; eine mitgelieferte Wortliste würde genau
den Effekt abschalten, um dessentwillen die Technik überhaupt wirkt. Wer
„Rakete“ vorgesetzt bekommt, hat ein Wort gelesen; wer es selbst findet, hat
es gebaut. (Dass die App damit auch keine hundert Wörter je Sprache pflegen
muss, ist der zweite Grund, nicht der erste.)

**Es wird immer nur eine Ziffer gelehrt, und angezeigt wird nur, was schon
sitzt.** Die ganze Tabelle unter die Zahl zu schreiben wäre einfacher und
falsch: Wer eine Tabelle vorgesetzt bekommt, die er nicht kann, liest sie ab
statt sie zu lernen — und übt dann Ablesen. Die Reihenfolge beginnt bei den
sichtbaren Brücken (1, 2, 3) und endet bei den schwächsten (0, 6); wer mit den
schwachen anfängt, hält die Technik für willkürlich und hört auf.

**Gelehrt wird nur mit Anlass und nur in Ruhe.** Kein Unterricht im
60-Sekunden-Modus — wer es eilig hat, will trainieren und nicht unterrichtet
werden. Kein Unterricht ohne Gegenstand: Das Major-System zu erklären und dann
keine einzige Zahl zu zeigen wäre eine Lektion ins Leere. Und wenn eine
Lektion ansteht, kommt das Zahlenmodul **zuerst** — was man nach dem Lernen
nicht sofort anwendet, ist am nächsten Tag wieder weg.

Die Lektion nimmt ihre vierzehn Sekunden aus dem Budget und nicht dazu. Die
Zusage aus B2 gilt auch für den Unterricht: Fünf Minuten sind fünf Minuten.
