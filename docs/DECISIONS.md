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

## D-010 · 2026-08-17 · Der Kern kennt keinen Browser

Bekräftigt aus dem Produktgespräch, weil es die teuerste Regel ist, wenn man sie
zu spät befolgt: `src/core/` — Engine, Wiederholungsplanung, Bewertung,
Profil, Sessionaufbau — ist reines TypeScript ohne Zugriff auf DOM, React oder
Browser-Schnittstellen. Alles Plattformabhängige (Speicher, Uhr,
Benachrichtigungen, Ton, Dateien, Cloud) liegt hinter einer Adapterschicht.

Zwei Dinge folgen daraus, und beide sind der eigentliche Zweck: Der Kern lässt
sich ohne Browser testen, und die App lässt sich später als Android-TWA und als
native iOS-App verpacken, ohne noch einmal geschrieben zu werden.
