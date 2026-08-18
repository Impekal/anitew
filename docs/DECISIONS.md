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

## D-014 · 2026-08-17 · Eine Mission ist eine Szene, und der Anker ist die Person

Memory Missions (Backlog H) sind das erste Modul, das die anderen **verbindet**:
Person, Zimmernummer, Gegenstand, Uhrzeit, Ort — Gesicht, Zahl und Wort in
einer Aufgabe. Trainiert wird dabei etwas anderes als in den Einzelmodulen,
und das ist der ganze Punkt: nicht die Stücke, sondern die **Bindung**
zwischen ihnen. Im Alltag merkt sich niemand „314“; man merkt sich, dass
*Elena* in Zimmer 314 wohnt und um 18:40 abreist.

**Die Szene steht auf einmal da.** Nicht Stück für Stück wie die Wörter —
nacheinander gezeigt wären es vier Gegenstände, und die Bindung käme in der
Übung gar nicht vor. Deshalb bekommt eine Mission auch mehr Betrachtungszeit
je Stück als ein Wort.

**Die Person ist der Anker, und aus ihr entsteht die ganze Szene.** So wie aus
dem Namen das Gesicht entsteht (D-005). Der Grund zeigt sich erst beim
Wiedersehen: Nach drei Tagen fragt die App eine einzelne Tatsache ab, und
„Welche Zimmernummer?“ wäre dann keine beantwortbare Frage — es gab inzwischen
zwanzig Zimmernummern. Mit Anker heißt sie „Elena — welches Zimmer?“, und das
ist genau die Frage, die das Leben stellt.

**Die Vorlage ist fest, die Füllung nicht** (H4). „The Hotel“ aus H2 ist ein
Gerüst mit Lücken, keine feste Szene: Eine feste wäre nach dem zweiten Mal
auswendig gelernt, und die App misst dann Wiedererkennen statt Gedächtnis —
derselbe Grund wie beim Gesichtsgenerator und beim Zahlenvorrat.

**Gefragt wird nach dem Wert, verbucht wird die Kennung.** Überall sonst ist
beides dasselbe: Beim Wort „Anker“ ist „Anker“ die Frage, die Antwort und der
Eintrag in der Datenbank. Bei einer Mission ist das eine „314“ und das andere
`Elena#room`. Der Wiederholungstermin hängt an der Kennung — sonst wären zwei
Szenen mit demselben Zimmer eine einzige Information.

**Die Strenge hängt an der einzelnen Tatsache**, nicht am Modul. Innerhalb
*einer* Abfrage stehen eine Zimmernummer, eine Uhrzeit, ein Gegenstand und ein
Name nebeneinander: 314 und 341 sind nicht dasselbe Zimmer, „roter Kofer“ ist
ein Tippfehler. Das ist D-012 eine Ebene tiefer — und der Grund, warum die
Strenge dort nicht als globaler Schalter gebaut wurde.

## D-015 · 2026-08-17 · Keine dunklen Muster — und was das konkret heißt

K7 stand bisher nur im Backlog. Mit der Serie (K2) wird die Regel zum ersten
Mal scharf, denn die Serie ist die Stelle, an der Gedächtnis-Apps üblicherweise
anfangen zu drücken. Deshalb steht sie jetzt hier, mit Namen:

**Kein Angstdruck.** Kein Countdown, der abläuft. Keine Meldung, die sagt, was
gleich verloren geht. Kein rotes Ausrufezeichen auf einer Zahl. Die Serie sagt,
was war — sie fordert nichts.

**Keine künstliche Verknappung.** Schutztage sind nicht kaufbar und nicht durch
Werbung zu verdienen (D-008). Das Muster „erst Angst erzeugen, dann gegen
Aufmerksamkeit oder Geld lindern“ ist hier ausgeschlossen, nicht nur
unerwünscht.

**Keine erfundenen Zahlen.** Das ist Regel R-1, und in der Gamification wird
sie am ehesten verletzt: XP, Level, Prozentbalken, „Gedächtnisstärke 78“. Was
angezeigt wird, muss gezählt sein. Die Serie ist deshalb aus den
Trainingstagen **gerechnet** und kein fortgeschriebener Zähler — ein Zähler
ist eine Behauptung, die von der Wirklichkeit abweichen kann.

**Keine Aufforderung, wo noch nichts ist.** Bei einer Serie von null steht gar
nichts da. „Starte deine Serie!“ wäre ein leeres Feld, das nach Verpflichtung
aussieht, bevor überhaupt etwas passiert ist.

**Belohnt wird das Zurückkommen, nicht das Durchhalten.** Wer einen Tag
verpasst, verliert nichts. Wer eine Woche verpasst, findet eine App vor, die
nicht schimpft (G-5) — sondern eine Serie, die von vorn anfängt, und einen
Wiederholungsplan, der weiß, was fällig ist.

Was daraus **nicht** folgt: dass es keine Freude geben darf. Töne, Leuchten,
wechselnde Sätze, ein Ergebnis, das man gern ansieht — all das bleibt (G-7,
G-9). Der Unterschied ist einfach: Freude entsteht aus der Sache, Druck aus
ihrer Abwesenheit.

---

## D-016 · 2026-08-18 · Auf Unbelegtem wird nichts gebaut — und ein Test hält daran fest

**Entscheidung:** Jede Aussage, auf der ANITEW aufbaut, steht mit ihrem Stand
und ihren Quellen in `src/core/science.ts`. Aussagen mit dem Stand
`unsupported` oder `unmeasured` haben ein leeres `restsOn` — auf ihnen darf
keine Funktion der App stehen. Ein Test prüft das.

**Warum das eine Entscheidung ist und keine Selbstverständlichkeit:** Weil der
Verstoß nie als Verstoß daherkommt. Niemand schreibt „diese Funktion beruht
auf einer widerlegten Annahme“. Er schreibt einen Fortschrittsbalken namens
„Gedächtnisstärke“, und drei Monate später weiß niemand mehr, woher die Zahl
kam. Die Bindung `restsOn` ist genau dagegen gerichtet: Sie zwingt beim
Einbauen zu der Frage, worauf das hier eigentlich steht — und macht die
Antwort nachlesbar.

Vier Stufen statt zwei, weil der interessante Fall in der Mitte liegt:

- **`established`** — vielfach unabhängig wiederholt. Darauf ist gebaut.
- **`narrow`** — der Effekt ist da, gilt aber nur für das Geübte. Merktechniken
  gehören hierher: Sechs Wochen Loci-Training verändern messbar, wie viele
  Wörter einer Liste jemand behält — über Namen, Termine und Alltag sagt das
  nichts. ANITEW bringt die Technik bei und behauptet den Rest nicht.
- **`unsupported`** — wird behauptet und hält nicht. Gehirnjogging macht nicht
  allgemein klüger.
- **`unmeasured`** — hat niemand gemessen, wir eingeschlossen. Genau eine
  Aussage steht hier: ob ANITEW im Alltag hilft.

Für `unmeasured` gilt die **umgekehrte** Regel: Dort darf *keine* Quelle
stehen. Eine fremde Studie unter die Aussage zu legen wäre der eleganteste Weg,
R-2 zu brechen — der Satz bliebe wörtlich richtig und läse sich trotzdem wie
ein Beleg. Auch das prüft der Test.

**Keine DOI.** Eine um eine Ziffer falsche DOI ist ein toter Link, und zwar
ausgerechnet auf der Seite, die von Genauigkeit lebt. Autor, Jahr, Titel und
Journal reichen zum Auffinden und lassen sich prüfen, ohne dass irgendwer eine
Ziffernfolge aus dem Gedächtnis rekonstruiert (R-1 gilt auch für uns).

**Folge für die Texte (F7):** Die Store-Texte in `docs/STORE.md` führen jede
Aussage auf ihre Deckung zurück — Backlog-Kennung oder Eintrag aus
`science.ts`. Was sich nicht zurückführen lässt, steht nicht drin. Die
Untergrenze davon ist wieder ein Test: Heilversprechen, „wissenschaftlich
bewiesen“ und Verdopplungsversprechen dürfen auf keiner Marketingfläche
auftauchen, in keiner Sprache.

Dabei ist eine Feinheit aufgefallen, die fast einen falschen Test ergeben
hätte: „klüger“ und „smarter“ **stehen** in der App — in dem Satz, dass
Gehirnjogging genau das nicht bewirkt. Eine Sperrliste, die den Widerspruch
nicht vom Versprechen unterscheidet, verbietet ausgerechnet die ehrlichste
Stelle. Gesperrt ist deshalb nur, was sich gar nicht ehrlich verwenden lässt.
Und `docs/STORE.md` darf seine eigene Sperrliste nennen — eine Regel, die sich
nicht aussprechen darf, ist keine Regel, sondern eine Falle.

---

## D-017 · 2026-08-18 · Der Palast stellt die Orte, das Bild stellt der Nutzer

**Entscheidung:** ANITEW liefert die **Stationen** eines Gedächtnispalastes und
legt an jede genau einen Gegenstand (G1, G2, G4). Was es ausdrücklich **nicht**
liefert, ist das Merkbild — die Geschichte, die den Toaster im Flur
unvergesslich macht. G5 im Backlog liest sich anders („bizarre visuelle
Geschichten erzeugen“), und diese Entscheidung schreibt ihn um.

**Warum:** Es ist derselbe Grund wie bei D-013 und beim Major-System. Ein
selbst gebautes Bild sitzt besser als ein vorgesetztes; eine App, die
„stell dir einen qualmenden Toaster vor“ mitliefert, nimmt genau den Schritt
ab, der wirkt. Der Nutzer hat dann einen Satz gelesen, wo er ein Bild hätte
bauen sollen — und beim Abruf fehlt ihm das, was er nie hergestellt hat.

Was die App stattdessen tut: Sie **verlangt** das Bild und sagt, wie eins
aussieht, das trägt. „Ein Toaster im Flur ist nichts — ein Toaster, der im
Flur den Weg versperrt und qualmt, bleibt.“ Das ist eine Anleitung und kein
Ersatz. Und sie gibt dem Palast als einzigem Modul sechs Sekunden je Station
(gegen vier beim Wort), weil das Bauen Zeit braucht.

**Was daraus für die Zuordnung folgt — und was nicht.** Welcher Gegenstand an
welche Station kommt, entscheidet die App (G4). Das ist kein Widerspruch: „Such
dir selbst aus, was wohin gehört“ wäre eine Aufgabe **vor** der Aufgabe, und
sie hat mit Gedächtnis nichts zu tun. Die Zuordnung ist Verwaltung, das Bild
ist die Technik.

**Ein Gang ist eine Szene.** Der Aufbau ist derselbe wie bei den Memory
Missions (D-014), und das ist kein Zufall: Beides sind **Bindungen**. Dort
hängen vier Tatsachen an einer Person, hier hängt je ein Gegenstand an je einem
Ort. Also dieselbe Bauform — Anker `wohnung~3`, Stück `wohnung~3#kueche` —, und
damit fällt G7 fast von selbst ab: Ein Gang hängt in der Wiederholungsplanung
wie jeder andere Gegenstand, weil er dieselbe Form hat. Ohne das wäre aus der
stärksten Technik der App ein hübscher Nebenschauplatz geworden.

Die Verlässlichkeit dafür kommt aus der Rechnung statt aus dem Speicher:
Derselbe Gang ergibt immer dieselben Gegenstände. In drei Wochen fragt die App
„was lag im Flur?“ und erwartet dieselbe Antwort wie heute.

**Was noch fehlt, und es wird gesagt:** Eigene Räume (G3). Ein Palast, den
jemand selbst anlegt, trägt deutlich besser als ein fremder — die drei
mitgelieferten Wege sind eine Krücke, und der Text in der App nennt sie auch so.

---

## D-018 · 2026-08-18 · Eine Messung darf man abbrechen — und was das kostet, hängt daran, ob schon gemessen wurde

**Entscheidung:** Die Messung lässt sich jederzeit mit einem Tippen verlassen,
auf jedem ihrer Bildschirme, ohne Rückfrage. Der abgebrochene Lauf zählt nie
mit (F1). **Wann die nächste fällig ist**, hängt davon ab, ob schon eine Zahl
entstanden ist:

- **Noch keine** — abgebrochen im Einprägen oder vor dem ersten Abschicken:
  Die nächste ist sofort wieder fällig. Jemanden vierzehn Tage warten zu
  lassen, weil das Telefon geklingelt hat, wäre eine Strafe für nichts.
- **Schon eine** — der erste Abruf steht in der Zeile: Es gilt der übliche
  Abstand von vierzehn Tagen.

**Warum die zweite Hälfte:** Ohne sie wird der Abbruch zum Einfallstor. **Wer
eine begonnene Messung wiederholen kann, bis das Gefühl dabei stimmt, misst
nicht mehr sein Gedächtnis, sondern seine beste Tagesform.** Die Zahl selbst
bekommt er dabei nie zu sehen — aber schon die Möglichkeit, es „nochmal
richtig“ zu versuchen, macht aus einer Messung eine Bestleistung. Und damit
wäre die eine Zahl, für die es M3 überhaupt gab, still verdorben.

**Warum ohne Rückfrage.** „Bist du sicher? Du verlierst deinen Fortschritt!“
wäre genau das Muster, gegen das D-015 geschrieben ist: erst Angst, dann
Erleichterung gegen Weitermachen. Was der Abbruch bedeutet, steht **danach**
auf dem Startbildschirm, wo es sich lesen lässt, statt im Weg zu stehen.

**Die Wörter sind verbraucht.** In beiden Fällen: Sie wurden gesehen. Die
nächste Messung nimmt die nächsten zwanzig und rückt damit näher an die
Stelle, an der sich der Quarantänevorrat wiederholt — was die App an dieser
Stelle ohnehin sagt (`poolCycles`). Wer oft abbricht, kommt schneller dorthin;
das ist der ehrliche Preis und keine Strafe.

---

## D-019 · 2026-08-18 · Kein XP, keine Level — das Wiedersehen

**Entscheidung:** ANITEW hat keine Erfahrungspunkte, keine Level und keine
Tagesaufträge. Was auf dem Startbildschirm steht, ist eine gezählte Größe:

> **Ein Wiedersehen = eine Information, die nach ihrem ersten Tag noch einmal
> abgefragt wurde.**

**Warum kein neuer Name für XP.** Die Frage kam als Namensfrage — ob „XP“
nicht besser etwas heißen sollte, das zur App passt. Die Antwort ist, dass ein
neuer Name nichts geheilt hätte: **XP ist von Bauart eine erfundene Währung.**
Ihre Zahl ist beliebig, ihre Skala auch, und genau deshalb lässt sich mit ihr
jedes Gefühl herstellen, das man herstellen will. Sie umzubenennen hätte die
Verletzung von R-1 nur schöner beschriftet.

Also nicht umbenannt, sondern **ersetzt**: durch ein Ereignis, das wirklich
stattgefunden hat.

**Warum ausgerechnet das Wiedersehen:**

1. **Es ist der Vorgang, auf dem die App steht.** Etwas nach Tagen wieder aus
   dem Kopf zu holen, *ist* das Lernen (C5, `science.retrieval`) — nicht die
   verbrachte Zeit, nicht die Zahl der geöffneten Einheiten. K1 verlangte
   genau das: an die Abrufleistung gekoppelt, nicht an Anwesenheit.
2. **Es ist das Wort, das die App ohnehin benutzt.** Der Wiederholungsblock
   heißt seit M1 „das Wiedersehen“. Ein Maß, das man erklären muss, ist schon
   deshalb das falsche.
3. **Es lässt sich nicht farmen.** Der entscheidende Punkt. Niemand bekommt
   mehr Wiedersehen, indem er heute länger übt — sie kommen, wenn der Plan
   sagt, dass etwas fällig ist (C1). Wer heute zehn Einheiten macht,
   verschiebt damit nur Termine in die Zukunft. Die einzige Art, die Zahl zu
   erhöhen, ist: etwas lernen und an späteren Tagen wiederkommen. Das ist
   genau das, was eine Punktewährung nie leisten kann, weil sie fürs Mahlen
   gebaut ist.
4. **Es schrumpft nie.** Eine Zahl, die bei Nichtstun kleiner wird, wäre
   Angstdruck mit anderen Mitteln (D-015). Was gewesen ist, bleibt gewesen.

**Keine Level, kein Balken.** Ein Fortschrittsbalken braucht eine Marke, und
jede Marke wäre ausgedacht — „ab 500 bist du Fortgeschritten“ ist eine
Behauptung über einen Menschen, für die es keine Grundlage gibt. Was es
stattdessen gibt, ist der **längste Fall**: wie oft dieselbe Information schon
zurückkam (K5). Er wächst nur über Wochen, weil die Abstände mit jedem Mal
größer werden — an einem Nachmittag ist er nicht zu holen, und genau darum
taugt er als Rekord.

**K4 wird abgelehnt.** „Daily Missions und Memory Quests“ sind manufacturierte
Verpflichtung: eine Aufgabe, die die App sich ausdenkt, damit man wiederkommt.
Was hier täglich ansteht, entscheidet der Wiederholungsplan — der weiß es
wirklich, und er weiß es aus der Vergessenskurve und nicht aus der
Bindungsabsicht. Ein zweiter, ausgedachter Tagesauftrag daneben würde dem
ersten die Glaubwürdigkeit nehmen.

**Gerechnet, nicht fortgeschrieben.** Wie die Serie: Die Zahl wird jedes Mal
aus den Terminen neu gerechnet. Ausgerechnet die Zahl, unter der „gezählt,
nicht vergeben“ steht, darf kein hochgezählter Zähler sein, der nach einem
Absturz oder einer eingelesenen Sicherung danebenliegt.


---

## D-020 · 2026-08-18 · Ein Gang braucht Zeit — sechzig Sekunden sind keine

**Entscheidung:** Der Gedächtnispalast wird in Einheiten unter drei Minuten
nicht mehr zum Lernen angeboten (`MIN_SECONDS_FOR_PALACE`). Der
**Wiederholungsblock** bleibt davon unberührt.

**Warum:** Rechnen, nicht Geschmack. Ein Gang prägt fünf Stationen à sechs
Sekunden ein (D-017). Im Notfallmodus bleiben nach dem Wiedersehensanteil rund
vierzig Sekunden für die Runde — dreißig gingen ans Einprägen, und für fünf
Fragen blieben zehn. **Zwei Sekunden je Station sind keine Frage, sondern eine
Formalie.**

Anders als beim Wortmodul lässt sich das nicht durch weniger Stücke lösen: Bei
Wörtern rechnet der Planer aus, wie viele in die Zeit passen — ein Gang ist
eine Szene, und ein halber Weg ist kein Weg (D-017). Also gibt es ihn erst,
wo er hinpasst. Sechzig Sekunden sind für den Fall gedacht, dass jemand
zwischen Tür und Angel übt; ein Gedächtnispalast ist das Gegenteil davon.

**Die Grenze trennt Lernen von Wiedersehen.** Der erste Anlauf kürzte die
Modulliste, bevor die fälligen Einträge ausgewählt wurden — damit wäre ein
fälliger Gang in einer kurzen Einheit stillschweigend liegengeblieben, und
D-004 („was du lernst, kommt zurück“) hätte eine leise Ausnahme bekommen. Ein
Kerntest hat es gefunden. Jetzt gilt: **gelernt wird aus der gekürzten Liste,
gefragt aus der vollen.** Im Wiedersehensblock wird nichts eingeprägt — es
sind nur die Fragen, und die passen in jede Einheit.

**Gefunden wurde das nicht durch Nachdenken, sondern durch einen
Bildschirmabzug.** Eine fehlgeschlagene Prüfung hing im Abruf einer
Palastrunde mit 0:01 auf der Uhr. Der Test war zu langsam — die App war zu
schnell, und zwar für einen Menschen.

---

## D-021 · 2026-08-18 · Kein Erstdiagnose-Test — das Profil wächst aus dem Training

**Entscheidung:** ANITEW hat **keine** Erstdiagnose. E1 im Backlog hieß „YOUR
MEMORY DNA — kurz, spielbar, nicht wie ein Test“: drei Minuten am Anfang, aus
denen ein Profil fällt. Das wird nicht gebaut. Das Profil entsteht
ausschließlich aus dem, was das Training über Wochen tatsächlich hergibt.

**Warum:** Der Grund steht zwei Zeilen weiter im selben Backlog, bei E7: „82
nach drei Aufgaben wäre eine erfundene Zahl.“ Ein Profil aus drei Minuten
Erstkontakt ist genau das — und es wäre die **eindrucksvollste** erfundene
Zahl der ganzen App, weil es nicht wie eine Punktzahl aussieht, sondern wie
ein Befund über einen Menschen. „Dein visuelles Gedächtnis: 41“ liest sich wie
eine Diagnose und ist ein Münzwurf.

Der Preis ist bekannt und wird bezahlt: Der Ersteindruck ist schwächer. Eine
App, die einem am ersten Tag ein buntes Netzdiagramm über die eigene Person
zeigt, fühlt sich persönlicher an als eine, die sagt „dafür weiß ich noch zu
wenig“. Sie ist es nur nicht.

**Was gezählt wird:** ausschließlich der **verzögerte Abruf** —

> Gelegenheiten = wie oft etwas nach seinem ersten Tag zurückkam
> Verloren = wie oft es dabei weg war

Wie gut jemand am Lerntag selbst abschneidet, bleibt draußen. Das ist der
Trainingsscore, und ihn als Gedächtnisleistung auszugeben ist die
Vermischung, gegen die F1 geschrieben ist. Beide Zahlen stehen exakt in den
Terminen (`reviews - 1` und `lapses`); ein Fehlschlag am Lerntag zählt bei
keiner mit, weil FSRS einen Rückfall erst führt, wenn eine Information den
Lernzustand verlassen hat.

**Drei Achsen bleiben leer, und das steht auch so da.** Für *Visuell*,
*Aufmerksamkeit* und *Arbeitsgedächtnis* gibt es kein Modul, das sie misst.
Dort steht „misst diese App nicht“ — kein leerer Balken mit Hoffnung daneben.
Dieselbe Ehrlichkeit wie auf der Wissenschaftsseite (D-016), und derselbe
Grund: **„nicht gemessen“ darf nirgends wie „schlecht“ aussehen.**

**Langfristiger Abruf verweist auf die Messung.** Ihn hier noch einmal aus
Trainingsdaten zu schätzen hieße, zwei Zahlen über dasselbe zu haben — und die
eine wäre die schlechtere, ohne dass jemand wüsste, welche (F1).

**Eine neunte Achse: Zusammenhänge.** E2 nennt acht Dimensionen; die Missionen
passen in keine davon. Sie üben, dass Zimmer, Gegenstand, Uhrzeit und Ort *zu
einer Person gehören* (D-014) — eine eigene Fähigkeit, und die alltagsnächste
von allen. Sie unter „Namen & Gesichter“ zu verbuchen wäre bequem und falsch.

**Kein Netzdiagramm.** Ein Netz aus neun Achsen sähe eindrucksvoll aus und
würde genau das verwischen, worauf es ankommt: dass drei davon nicht gemessen
werden und eine woanders steht. Ein Netz braucht für jede Achse einen Wert —
es *zwingt* zur erfundenen Zahl. Also eine Liste, in der jede Zeile ihren
eigenen Satz sagen darf.

**Und die Schwachstelle wird nur genannt, wenn es eine ist.** „Zahlen sind
deine Schwachstelle“ steht erst da, wenn sich die Spannen zweier Achsen nicht
überlappen. Sonst hieße es nur, dass der Zufall an diesem Tag so lag — und
eine App, die daraufhin den Trainingsplan umbaut (E5), baut ihn auf Rauschen
um.

---

## D-022 · 2026-08-18 · Erinnerungen werden abgefragt, nicht angenommen

**Entscheidung:** Die Fähigkeit, zu erinnern, ist eine **Eigenschaft der
Plattform** und wird als solche abgefragt (`Reminders.ability()`), bevor die
App irgendetwas anbietet. Drei Stufen: `scheduled` (auch bei geschlossener
App), `whileOpen` (nur solange ANITEW läuft), `none`.

**Warum das nötig ist:** Das Web kann eine Benachrichtigung **nicht** für
später einplanen. Der Weg dafür (`TimestampTrigger`) ist über einen Versuch
nie hinausgekommen und in keinem Browser dauerhaft verfügbar; der übliche
Ersatz ist ein Server, der zur richtigen Zeit pusht — den es hier nicht gibt
und nicht geben soll (D-003, R-3). Was bleibt, ist ein Wecker innerhalb der
laufenden Seite: Er hält auch im Hintergrund, aber nicht über das Schließen
hinaus.

Damit steht B8 („Tageserinnerung, feste Uhrzeit wählbar“) im Browser auf
wackligem Grund — und genau das sagt die App, **vor** der Einstellung und
nicht als Fußnote danach. Eine App, die eine Erinnerung ankündigt und keine
schickt, hat schlimmer gelogen, als wenn sie gar keine angeboten hätte (R-2).
Die gewählte Uhrzeit wird trotzdem gemerkt: Sie gilt, sobald ANITEW als App
aus dem Store läuft (Backlog Q) — dann tritt neben `platform/web/` eine zweite
Umsetzung, und der Kern merkt nichts davon (D-010).

**Gefragt wird spät.** Das Recht auf Benachrichtigungen wird erst dort
erbeten, wo jemand eine Erinnerung wirklich will — nicht beim ersten Start.
Wer eine App öffnet und sofort gefragt wird, lehnt ab, und eine Ablehnung
lässt sich von der App aus nie wieder zurücknehmen.

**Der Text ist keine Drohung.** „Jetzt wären die fünf Minuten.“ Kein „deine
Serie läuft ab“, kein Countdown, keine Zahl (D-015). Und es wird gar nicht
erinnert, wenn heute schon trainiert wurde — eine App, die abends fragt, ob
man schon geübt hat, obwohl sie es weiß, ist lästig und wirkt dumm.

**Die eine Stelle, an der es wirklich etwas rettet**, ist die Messung: Nach
dem ersten Abruf läuft ein Fenster von 15 bis 45 Minuten, und wer es verpasst,
hat eine Messung umsonst gemacht (F1). Erinnert wird nach **zwanzig** Minuten
— in der ersten Hälfte des Fensters, damit fünfundzwanzig Minuten Luft
bleiben.
