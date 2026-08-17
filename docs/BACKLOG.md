# BACKLOG — ANITEW (Aufgabenliste)

> Quelle: Produktgespräch vom 2026-08-15/16 (Chat-Protokoll `Anitew.docx`).
> Diese Liste ist die Übersetzung dieses Gesprächs in Arbeit — nichts weiter.
> Wo das Gespräch etwas offen gelassen hat, steht hier ❗ und keine erfundene
> Antwort.
>
> **Status:** ✅ fertig · 🟨 teilweise · ⬜ offen · ❗ Entscheidung nötig
> **Aufwand:** S (< ½ Tag) · M (1–2 Tage) · L (mehrere Tage)
>
> Diese Datei ist Teil des Projektgedächtnisses. Jede Session, die Punkte
> erledigt oder neue findet, aktualisiert sie.
>
> **Stand 2026-08-17:** **M0, M1 und der Kern von M2 stehen.** Die App läuft
> unter https://anitew.impekaltech.workers.dev, eine Einheit läuft durch, und
> **was du lernst, kommt an seinem Tag von selbst zurück** — FSRS rechnet für
> jedes Wort seinen eigenen Termin. Die Oberfläche leuchtet und klingt
> (D-011/G-9). Geprüft mit 95 Kern-Tests und 28 E2E-Läufen.
>
> **Noch offen aus M2: das Gedächtnisprofil (E).** Bewusst — mit einem
> einzigen Modul wäre ein „Profil“ ein einzelner Balken, also eine Attrappe.
> Es braucht erst mehr Module (D9–D13), sonst verstößt es gegen R-1.

---

## Der Kern in einem Satz

> „Was muss diese Person heute 5 Minuten lang tun, damit sie langfristig besser
> darin wird, Informationen zu behalten und abzurufen?“

Alles in dieser Liste dient dieser einen Frage. Was ihr nicht dient, gehört
unter „Nicht-Ziele“.

## Die drei Regeln, die über allem stehen

| Regel | Woher | Konsequenz |
|---|---|---|
| **R-1 Keine erfundenen Zahlen.** Trainingsscore und gemessene Gedächtnisleistung sind zwei verschiedene Dinge und werden nie vermischt | „Diese Prozentzahl darf nicht erfunden sein“ | Abschnitt F ist kein Nice-to-have, sondern Sperre für den Release |
| **R-2 Kein Versprechen ohne Messung.** Nicht „wir verdoppeln dein Gedächtnis“, sondern „train, measure, remember more“ | „wissenschaftlich nicht seriös“ | bindet auch Store-Texte und Marketing (R5) |
| **R-3 Nicht browser-only, local-first, modular.** Der Kern muss ohne Umbau in eine Android-TWA und später in eine iOS-App passen | „Do not create architecture that depends on the browser only“ | Abschnitt A4/A5 vor der ersten Zeile Produktcode |
| **R-4 Die Oberfläche muss wirken.** Schön, angenehm, unterhaltsam, futuristisch-neuronal — warm für den Inhalt, kühl für die Technik | Vorgabe vom 2026-08-17 | **D-011** mit neun Regeln G-1…G-9; Abschnitt O ist damit keine Kür mehr |

---

## A. Fundament & Projektsetup

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| A1 | Stack festlegen und begründen | ✅ 2026-08-17 | React 18 + TS strict + Vite 6 + vite-plugin-pwa + Dexie — **D-003** | S |
| A2 | Repo-Grundgerüst, Ordnerstruktur, tsconfig strict | ✅ 2026-08-17 | | S |
| A3 | PWA-Grundlage: Manifest, Service Worker, Offline-Start, Update-Strategie | ✅ 2026-08-17 | `registerType: autoUpdate`; E2E prüft Manifest inkl. maskable Icon | M |
| A4 | **Architekturregel: `src/core/` ist reines TypeScript** — keine DOM-, React- oder Browser-API-Zugriffe | ✅ 2026-08-17 | `tsconfig.core.json` übersetzt den Kern ein zweites Mal **ohne DOM-Bibliothek** — ein Verstoß ist ein Übersetzungsfehler, kein guter Vorsatz. Gegengeprüft: absichtlicher Verstoß eingebaut, Prüfung schlug fehl, Verstoß entfernt | M |
| A5 | Plattform-Adapter-Schicht: Storage, Uhr/Timer, Benachrichtigungen, Audio, Datei-Export | 🟨 2026-08-17 | `core/ports.ts` + `platform/web/`. Uhr und Einstellungen stehen; Benachrichtigungen, Audio und Dateien kommen, wenn sie gebraucht werden | M |
| A6 | Datenschicht: Dexie-Schema **mit Migrationen ab Version 1** | ✅ 2026-08-17 | Version 1 ist festgeschrieben und wird nie bearbeitet — die Regel steht oben in `src/data/db.ts`. Benchmarks liegen in einer **eigenen** Tabelle, damit eine spätere Auswertung sie nicht mit Trainingsdaten vermischen kann (R-1 bis ins Schema) | M |
| A7 | Deployment: Auto-Build bei Push, statisches Hosting, kein Backend | ✅ 2026-08-17 | **Live: https://anitew.impekaltech.workers.dev** — jeder Push auf den Zweig veröffentlicht. Account ID fest in `deploy.yml`, Token als Repo-Secret | S |
| A8 | Projektgedächtnis: `PROJECT_STATE.md`, `docs/DECISIONS.md`, diese Liste | ✅ 2026-08-17 | | S |
| A9 | App-Identität: Icon, Splash, Theme-Farben, Statusleiste, Name im Manifest | 🟨 2026-08-17 | Zeichen ist **vorläufig** (fünf Punkte mit wachsenden Abständen — die Wiederholungskurve aus D-004), endgültig erst nach R3 | S |
| A10 | Kein Tracking, keine Analytics-Dritte. Nutzungsstatistik nur lokal auf dem Gerät | ✅ 2026-08-17 | keine einzige Abhängigkeit, die nach außen funkt | S |
| A11 | Kein `Math.random()` irgendwo — aller Zufall kommt aus `createRng(seed)` | ✅ 2026-08-17 | ohne Determinismus ist ein Fehlerbericht wertlos und der Simulator (C9) beweist nichts | S |

## B. Die 5-Minuten-Session

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| B1 | Startbildschirm: ein Knopf, sonst nichts | ✅ 2026-08-17 | ein Tap vom Öffnen bis zum laufenden Training | S |
| B2 | Session-Runner: Blockfolge mit hartem Gesamtzeitbudget | ✅ 2026-08-17 | Summe der Blöcke ist auf die Sekunde die Länge des Modus — je Modus im Test geprüft, und im E2E-Test einmal in echter Zeit abgewartet. Zeit läuft über die **monotone** Uhr, nicht über die Wanduhr (P5) | M |
| B3 | Blockstruktur v1: Focus · Encode · Recall · Working Memory · Spaced Recall | 🟨 2026-08-17 | Es laufen **Runden aus Einprägen und Abrufen** — die anderen drei Blöcke haben noch keine Module. Statt sie zu behaupten, plant der Planer nur, was es gibt, und wächst mit M2/M4 | M |
| B4 | Blocklängen adaptiv umverteilbar (Engine entscheidet), Gesamtzeit bleibt fix | 🟨 2026-08-17 | Die Aufteilung steht (Rundenzahl und Wortzahl folgen aus dem Budget); *adaptiv* wird sie erst mit dem Profil (M2) | M |
| B5 | Session ist unterbrechungsfest: App-Wechsel, Anruf, Bildschirm aus, Absturz | ✅ 2026-08-17 | Fortschritt wird nach **jedem Wort** geschrieben, nicht am Blockende. E2E prüft den harten Fall: Seite mitten in der Einheit neu geladen → „Fortsetzen“ | M |
| B6 | Abschlussbildschirm mit ehrlichen Zahlen (siehe F) | ✅ 2026-08-17 | eine einzige echte Zahl (x von y erinnert), kein Prozentwert, keine „Memory Strength“ — die käme aus dem Benchmark (D-006) | S |
| B7 | Weitermachen nach der Tages-Challenge: freies Training, zählt für Fortschritt, aber ohne Druck | ⬜ | „Man kann natürlich mehr wählen“ | S |
| B8 | Tageserinnerung als **lokale** Benachrichtigung, opt-in, feste Uhrzeit wählbar | ⬜ | kein Server-Push, kein Konto | M |
| B9 | Session-Log: jede Antwort mit Item-ID, richtig/falsch, Latenz, Kontext | ✅ 2026-08-17 | ein Ereignis **je Wort**, nicht „6 von 8“ — ohne diese Auflösung gäbe es später keine Vergessenskurve pro Information. Nur anhängen, nie ändern | M |

## C. Memory Engine — Spacing & Retrieval

Das wissenschaftlich belastbare Fundament: verteiltes Wiederholen plus
Abruftraining. Hier entscheidet sich, ob die App wirkt.

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| C1 | Item-Modell definieren: was genau ist ein „Gedächtnis-Item“, wie sieht sein Zustand aus | ✅ 2026-08-17 | `Memory` im Kern, `itemStates` in Schema-Version 2. Die Kennung trägt **Sprache**: „Anker“ und „anchor“ sind zwei Gedächtnisinhalte, nicht zwei Schreibweisen von einem | M |
| C2 | Scheduler mit Zustand pro Item (Stabilität + Schwierigkeit), nicht mit festen Intervallen | ✅ 2026-08-17 | **FSRS** über `ts-fsrs` (MIT, keine Abhängigkeiten, Lizenz vor dem Einbau geprüft). Ohne Zufallsstreuung (sonst bräche A11) und ohne Schritte innerhalb eines Tages | L |
| C3 | Persönliche Vergessenskurve schätzen: „Diese Information vergisst DU wahrscheinlich in ~5 Tagen“ | 🟨 2026-08-17 | `forgetsInDays()` liefert die Vorhersage, Zielretention 90 %. **Noch nicht sichtbar** — angezeigt wird sie erst, wenn genug Historie da ist, um sie nicht zu erfinden | L |
| C4 | Kaltstart: sinnvolle erste Intervalle ohne jede Historie | ✅ 2026-08-17 | kommt von FSRS selbst — aus der ersten Antwort folgt die erste Stabilität. Wir setzen ausdrücklich **nichts** davor: eine geratene Anfangsstabilität wäre die erfundene Zahl aus R-1 | M |
| C5 | **Abruf, nicht Wiedererkennen**: freie Eingabe als Standard, Multiple Choice nur wo unvermeidbar | ✅ 2026-08-17 | Der Abruf ist ein leeres Textfeld. Die Bewertung ist absichtlich großzügig (Umlaute gefaltet, ein Tippfehler ab fünf Zeichen erlaubt): Gemessen wird das Gedächtnis, nicht die Rechtschreibung — eine strengere Zahl wäre kleiner, aber nicht richtiger | M |
| C6 | Ähnliche Items nicht in derselben Session (Interferenz vermeiden) | 🟨 2026-08-17 | Die Wortlisten sind schon danach gebaut (keine Reimpaare, keine Wortfamilien) und innerhalb einer Einheit wiederholt sich kein Wort. Die Prüfung *zur Laufzeit* kommt mit M2 | M |
| C7 | Überfälligkeitsdruck begrenzen: nie ein Berg von 800 fälligen Items nach einer Pause | ✅ 2026-08-17 | Obergrenze aus dem Zeitbudget (`dueLimitFor`), höchstens 12. Am längsten Überfälliges zuerst. Wer zwei Wochen weg war, holt über mehrere Tage auf — langsamer, aber der einzige Weg, der zu einem zweiten Tag führt | M |
| C8 | Engine deterministisch und seed-basiert, damit testbar | 🟨 2026-08-17 | `core/rng.ts` steht und ist geprüft; gilt für die Engine, sobald es eine gibt | S |
| C9 | Simulator: synthetische Nutzer über 90 Tage, bevor echte Nutzer da sind | 🟨 2026-08-17 | läuft als Test über 120 und 400 Tage: Wer alles behält, wird immer seltener gefragt; wer die Hälfte vergisst, öfter. Deterministisch statt zufällig (A11) | M |
| C10 | FSRS-Parameter später **auf dem Gerät** aus der eigenen Historie nachoptimieren | ⬜ | **D-004**, Phase nach M2; bis dahin Standardparameter | L |

## D. Übungsmodule

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| D1 | Einheitliche Modulschnittstelle: Aufgabe rein, Score + Rohdaten raus | ✅ 2026-08-17 | **D-012**. Drei Module, und der Planer mischt sie reihum. Ein Modul bringt seine Regeln mit (`isPrompted`, `leniencyFor`); der Planer kennt nur Kennungen und Zeiten. Er kennt nur Kennungen, Zeiten und die Frage „freier oder gestützter Abruf“ — was ein Modul *zeigt*, weiß er nicht. Ein fehlender Modultext ist seit M4 ein Übersetzungsfehler und kein leerer Hinweis | M |
| D2 | Schwierigkeit adaptiv pro Modul, Zielkorridor um ~80 % Trefferquote | ⬜ | zu leicht = langweilig, zu schwer = Frust; beides bricht die Streak | M |
| D3 | **Focus** — Ablenkungen ignorieren, kurze Aufmerksamkeitsschulung | ⬜ | 0:00–1:00 der Session | M |
| D4 | **Encode** — 8 Bilder / Wörter / Personen / Orte merken | 🟨 2026-08-17 | Wörter und Personen laufen, ein Stück je 4 Sekunden, 3–8 je Runde. Bilder und Orte kommen mit D12/D15 | M |
| D5 | **Merktechniken werden beigebracht**, nicht nur abgefragt: Verknüpfung, Story-Methode, Major-System, Loci | ⬜ | „nicht stumpf auswendig lernen — die App bringt automatisch Merktechniken bei“. Das ist der Unterschied zu jeder Brain-Game-App | L |
| D6 | **Recall** — freier Abruf ohne Hinweise | ✅ 2026-08-17 | leeres Feld, Reihenfolge egal, Bewertung in `core/session/grading.ts` | M |
| D7 | **Working Memory** — behalten und gleichzeitig manipulieren (N-Back-artig) | ⬜ | | M |
| D8 | **Spaced Recall** — etwas von gestern / vor 3 Tagen / letzter Woche | ✅ 2026-08-17 | eigener Block am Ende der Einheit, nur wenn etwas fällig ist. Fällige Wörter werden **aus dem Vorrat für neue genommen** — sonst wäre der Abruf ein Wiedererkennen (ein Test hat genau das gefunden). Eigene Zahl im Ergebnis, nicht mit dem heute Gelernten verrechnet | M |
| D9 | **Namen & Gesichter** | ✅ 2026-08-17 | schwächster Bereich im Beispielprofil, also wichtig. Abruf **gestützt**: Das Gesicht steht da, gesucht ist der Name (`gradePrompted`) — „nenne alle Gesichter“ wäre keine Frage. Die Wiedervorlage über D8 gilt genauso wie für Wörter | M |
| D10 | **Zahlen** — Ziffernfolgen, Jahreszahlen, PINs, Telefonnummern | ✅ 2026-08-17 | **D-012**. 3–6 Ziffern, aus dem Seed erzeugt statt aus einer Liste — eine feste Liste wäre nach zwei Wochen durchgesehen. Geschenkte Folgen („1111“, „3456“) fallen raus. **Streng verglichen:** eine vertauschte Ziffer ist eine andere Zahl. Gruppierte Nummern („0176 4392 118“) fehlen noch — der freie Abruf zerlegt an Leerzeichen | M |
| D11 | **Wörter & Listen** | 🟨 2026-08-17 | Wortvorrat je Sprache in `core/content/words.ts` — konkret und bildhaft, je Sprache eigen statt übersetzt, untereinander verschieden. DE und EN mit je ~80 Wörtern | S |
| D12 | **Räumlich** | ⬜ | | M |
| D13 | **Assoziativ** — „Meet 5 people“: Person + Land + Hobby + Stadt, später quer abgefragt | ⬜ | „Wie hieß die Person aus Indien?“ / „Wer spielte Gitarre?“ — trainiert, was im Alltag wirklich vorkommt | L |
| D14 | **Gesichtsgenerator**: parametrische SVG-Gesichter aus einem Seed (Kopf, Augen, Nase, Mund, Haar, Bart, Brille, Hautton) | ✅ 2026-08-17 | **D-005**. Aus einem Seed immer dasselbe Gesicht, aus vielen Seeds Millionen — Kilobytes statt Megabytes, keine Rechtefragen. Die Maße liegen im Kern (ohne SVG, ohne Browser), gezeichnet wird in `app/Face.tsx`. Geprüft wird mit `scripts/facesheet.mjs`: vierzig Gesichter nebeneinander — einzeln sieht fast jedes annehmbar aus | L |
| D15 | Objekte und Orte: CC0-Icon-Satz auswählen, prüfen, dokumentieren, um eigene Formen ergänzen | ⬜ | **D-005**; Lizenzen nach R2 | M |
| D16 | Fotorealistische Porträts als optionaler Nachladeinhalt | ⬜ | **D-005**, später. Gezeichnete Gesichter sind leichter als echte — der Benchmark (F2) muss das berücksichtigen, und die App darf es nicht als Alltagsleistung ausgeben (R-1) | L |

## E. Memory Profile & Personalisierung

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| E1 | Erstdiagnose („YOUR MEMORY DNA“) — kurz, spielbar, nicht wie ein Test | ⬜ | | L |
| E2 | Acht Dimensionen: Visuell · Namen & Gesichter · Zahlen · Wörter · Räumlich · Aufmerksamkeit · Arbeitsgedächtnis · Langfristiger Abruf | ⬜ | genau die aus dem Gespräch | M |
| E3 | Profilwerte ausschließlich aus gemessenen Daten (R-1) | ⬜ | | M |
| E4 | Profilanzeige plus Verlauf über die Zeit | ⬜ | | M |
| E5 | Adaptive Tagesplanung: Schwächen priorisieren, Stärken erhalten | ⬜ | „Zahlen und Namen sind deine Schwachstellen, deshalb bekommst du morgen …“ | L |
| E6 | Die App erklärt ihre Entscheidung in einem Satz | ⬜ | macht Personalisierung spürbar statt nur behauptet | S |
| E7 | Unsicherheit ehrlich zeigen, solange zu wenig Daten da sind | ⬜ | „82“ nach drei Aufgaben wäre eine erfundene Zahl (R-1) | S |

## F. Messung & Ehrlichkeit  🔴 Release-Sperre

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| F1 | **Trainingsscore und Benchmark strikt trennen** — zwei Datenreihen, zwei Anzeigen, nie vermischt | ⬜ | „Die App muss zwischen Trainingsscore und tatsächlich gemessener Gedächtnisleistung unterscheiden“ | M |
| F2 | Benchmark-Test: ~3 min, Tag 0 und dann alle 14 Tage; gleicher Aufbau, neuer Inhalt; misst sofort / nach 20 min / am Folgetag | ⬜ | **D-006** | L |
| F3 | „Memory Strength +18 %“ nur aus dem Benchmark, mit Antippen → was genau gemessen wurde | ⬜ | Vergleich immer gegen den eigenen Tag 0, nie gegen andere Nutzer | M |
| F2a | **Quarantäne-Itempool**: Benchmark-Inhalte kommen sonst nirgends vor und wandern nie in die Wiederholung | ⬜ | **D-006** — ohne diese Trennung misst der Benchmark nur Übung | M |
| F2b | Erste zwei Messungen als **Eichung** kennzeichnen (Gewöhnung ans Format), Ergebnis als Spanne solange die Datenlage dünn ist | ⬜ | **D-006**; hängt an E7 | M |
| F4 | Kein behaupteter Alltagstransfer, der nicht gemessen wurde | ⬜ | der Unterschied zwischen „besser in dieser Übung“ und „besseres Gedächtnis“ ist der wunde Punkt des ganzen Genres | S |
| F5 | Fortschritt in echten Zahlen: „Day 1: 8/20 · Day 7: 15/20 · Day 30: 18/20 — du erinnerst 10 Dinge mehr als am ersten Tag“ | ⬜ | überzeugender als „+50 Coins“, und es stimmt | M |
| F6 | Wissenschaftsseite in der App: was belegt ist (Spacing, Retrieval Practice), was nicht (allgemeine Intelligenzsteigerung), mit Quellen | ⬜ | | M |
| F7 | Alle Marketing- und Store-Texte an F1–F6 binden | ⬜ | „Train your memory. Measure your progress. Remember more.“ | S |

## G. Memory-Palace-Modus

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| G1 | Palast-Datenmodell: Räume, Stationen, feste Reihenfolge | ⬜ | | M |
| G2 | Vorgefertigte Paläste: Wohnung, Straße, Körper | ⬜ | Eingang · Wohnzimmer · Küche · Schlafzimmer · Bad | M |
| G3 | Eigener Palast: Nutzer legt Räume und Stationen selbst an | ⬜ | eigene Räume wirken deutlich besser als fremde | M |
| G4 | Automatische Zuordnung Item → Station | ⬜ | | M |
| G5 | Merkbilder erzeugen — regelbasiert und offline; mit KI (M) nur besser, nicht nötig | ⬜ | „bizarre visuelle Geschichten“ | L |
| G6 | Begehungsmodus als Abfrage: „Gehe durch dein Wohnzimmer“ → Sofa → 1884 | ⬜ | | M |
| G7 | Palastinhalte hängen in der Spacing-Engine (C) wie jedes andere Item | ⬜ | sonst wird der Palast ein hübscher Nebenschauplatz | S |

## H. Memory Missions

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| H1 | Szenenformat: Szene + Fakten + Fragen als Datenmodell | ⬜ | | M |
| H2 | Referenzmission „The Hotel“ vollständig umgesetzt | ⬜ | Zimmer 314 · roter Koffer · Schlüssel auf Tisch · Elena · 18:40 · Restaurant „Luna“ | M |
| H3 | **Verzögerter Abruf**: 20 Minuten später fragt die App nach | ⬜ | braucht B8 (lokale Benachrichtigung) und einen Weg, wenn die App zu ist | M |
| H4 | Prozedurale Missionsgenerierung aus Bausteinen — offline, ohne KI | ⬜ | sonst ist der Vorrat nach zwei Wochen leer | L |
| H5 | Missionsbibliothek, mehrsprachig und kulturell passend bestückt | ⬜ | hängt an L6 | M |
| H6 | Schwierigkeitsstufen: Faktenzahl, Ablenkung, Betrachtungszeit, Abrufabstand | ⬜ | | M |

## I. Real Life Memory

Der Punkt, der aus einem Spiel einen Gedächtnistrainer macht.

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| I1 | Eigene Inhalte eingeben: Text, Foto, Diktat | ⬜ | | M |
| I2 | „Ich treffe morgen 6 neue Kollegen“ → daraus wird ein Training | ⬜ | | L |
| I3 | MEMORY MODE für eigenes Material: Fakten extrahieren → strukturieren → Merkbilder → Retrieval-Fragen → Wiederholungsplan | ⬜ | die fünf Schritte aus dem Gespräch, in dieser Reihenfolge | L |
| I4 | Funktioniert auch **ohne** KI: halbautomatisch, mit Nutzerbestätigung | ⬜ | KI ist ein Verstärker, keine Voraussetzung (M2) | M |
| I5 | Termingebundene Items: „Das Treffen ist morgen um 9“ → Wiederholungen davor legen, nicht danach | ⬜ | für Prüfungen und Präsentationen das eigentlich Wertvolle | M |
| I6 | Eigene Inhalte bleiben lokal. Versand an eine KI nur nach ausdrücklicher Freigabe pro Vorgang | ⬜ | | S |

## J. Zeitmodi (Emergency Mode)

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| J1 | Vier Modi: ⚡ 60 Sekunden · ⚡ 3 Minuten · 🧠 5 Minuten (Standard) · 🔥 15 Minuten | ⬜ | | M |
| J2 | Jeder Modus ist ein Zeitbudget-Profil derselben Engine, kein eigener Code | 🟨 2026-08-17 | `core/modes.ts` legt die vier Budgets fest; die Engine, die sie füllt, kommt mit M1 | S |
| J3 | Auswahl in einem Tap direkt vom Startbildschirm | ⬜ | | S |
| J4 | 60-Sekunden-Modus hält die Streak am Leben | ⬜ | **D-008** — daneben getrennt gezählt, wie viele Tage volle Challenges waren | S |

## K. Gamification

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| K1 | XP und Level — an **Abrufleistung** gekoppelt, nicht an verbrachte Zeit | ⬜ | sonst belohnt die App Anwesenheit statt Lernen | M |
| K2 | Streak inklusive Schutztag: einer pro Woche, bis zu zwei angespart, **nicht kaufbar und nicht durch Werbung verdienbar** | ⬜ | **D-008**. Sucht ja, Schuldgefühl nein — ein verpasster Tag darf nicht 60 Tage vernichten | M |
| K3 | Achievements | ⬜ | | M |
| K4 | Daily Missions und Memory Quests | ⬜ | | M |
| K5 | Persönliche Rekorde | ⬜ | | S |
| K6 | Unlockable Worlds — rein kosmetisch | ⬜ | | M |
| K7 | **Anti-Dark-Pattern-Regel**: keine künstliche Verknappung, kein Angstdruck, keine erfundenen Zahlen | ⬜ | „nicht mit billigen Belohnungen“. Gehört als Regel in DECISIONS.md, nicht nur hierher | S |
| K8 | Die wichtigste Belohnung ist F5: der Nutzer merkt selbst, dass er besser wird | ⬜ | | — |
| K9 | Spendenweg: externer Link (Ko-fi / PayPal / GitHub Sponsors) im Web; Store-Regeln für Spenden getrennt prüfen, wenn wir dort ankommen | ⬜ | **D-002**. Kern bleibt dauerhaft kostenlos; ein späteres Pro darf nur Bequemlichkeit hinzufügen, nie Trainingsleistung | S |

## L. Mehrsprachigkeit

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| L1 | i18n-Grundgerüst, Sprachwechsel zur Laufzeit, von Anfang an | ✅ 2026-08-17 | die Form der Wörterbücher wird aus der deutschen Quelle abgeleitet — ein vergessener Schlüssel ist ein Übersetzungsfehler, kein leerer Text zur Laufzeit | M |
| L1a | Beim ersten Start die **Systemsprache** übernehmen; Umschalten sichtbar auf dem ersten Bildschirm | ✅ 2026-08-17 | **D-007**. Die Regel liegt in `core/language.ts` und ist ohne Browser prüfbar; E2E prüft sie zusätzlich echt (de-DE, en-GB, sv-SE → Englisch) | S |
| L2 | Elf Sprachen: DE · EN · FR · ES · IT · PT · NL · TR · AR · ZH · JA | 🟨 2026-08-17 | alle elf sind als Sprache bekannt und wählbar; übersetzt sind DE und EN, die übrigen zeigen Englisch **und sagen das auch** | L |
| L3 | RTL für Arabisch — Layout, nicht nur Text | 🟨 2026-08-17 | `dir` wird gesetzt; das Layout ist noch nicht daraufhin geprüft | M |
| L4 | CJK: Schriftschnitte, Zeilenumbruch, Eingabemethoden bei freiem Abruf (C5) | ⬜ | freier Abruf auf Japanisch ist ein eigenes Problem | M |
| L5 | Engine bleibt sprachunabhängig; Sprache ist ein Attribut am Item | ⬜ | Voraussetzung für L7 | M |
| L6 | Inhaltspools je Sprache: Wörter, Namen, Orte — kulturell passend, nicht durchübersetzt | 🟨 2026-08-17 | Wörter **und Namen** für DE und EN stehen (je ~46 Namen, untereinander unähnlich). Für Sprachen ohne eigene Liste gibt es **bewusst keinen** automatischen Ersatz aus einer anderen — die App trainiert dann auf der Rückfallsprache und sagt das | L |
| L7 | Trainingssprache getrennt von Oberflächensprache: „Train your memory in Japanese today“ | ⬜ | Gedächtnis- und Sprachtraining zugleich — ein echtes Alleinstellungsmerkmal | M |
| L8 | Übersetzungsprozess: Quelltexte **auf Deutsch**, von dort übersetzt; Pflege ohne Wildwuchs | ⬜ | **D-007** | S |

## M. KI (BYOK)

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| M1 | Bring-your-own-key: Gemini, Anthropic, OpenAI, Mistral, Groq, OpenRouter | ⬜ | wie in RReader; Text geht vom Gerät direkt zum Anbieter, nie über uns | M |
| M2 | Die App ist ohne KI vollständig benutzbar | ⬜ | harte Regel, sonst kostet jeder Nutzer Geld oder Netz | S |
| M3 | Schlüssel bleiben lokal, standardmäßig nur für die Sitzung | ⬜ | | S |
| M4 | KI-Aufgaben: Merkbilder (G5), Missionen (H4), Extraktion aus eigenem Material (I3), Erklärungen | ⬜ | | M |
| M5 | Offline-Fallback für jede einzelne KI-Funktion | ⬜ | | M |

## N. Daten, Offline, Export

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| N1 | Alles lokal in IndexedDB. **Kein Konto bei uns, kein Server, keine Nutzerdatenbank** — auch nicht, wenn später abgeglichen wird | ✅ 2026-08-17 | **D-009**. Fünf Tabellen in `data/db.ts`, Version 1 wird nie mehr angefasst | S |
| N2 | Export/Backup als Datei, Import auf einem neuen Gerät | ✅ 2026-08-17 | ohne Server ist das der einzige Weg, Fortschritt nicht zu verlieren. Eigene Fassungsnummer, **getrennt** vom Datenbankschema — sonst änderte eine Migration stillschweigend das Dateiformat. Einlesen führt zusammen und löscht nie; dieselbe Datei zweimal ändert nichts | M |
| N3 | Vollständig offline nutzbar, auch beim allerersten Start nach der Installation | ⬜ | | M |
| N4 | Löschen: einzelne Items, eigene Inhalte, alles | ⬜ | | S |
| N5 | Speicherbedarf im Blick behalten (Bilder!) und dem Nutzer zeigen | ⬜ | | S |
| N6 | **Stufe 1 (Phase 1):** ohne Anmeldung, alles lokal; Sicherung und Gerätewechsel über die Exportdatei aus N2 — die der Nutzer selbst in iCloud Drive oder Google Drive legen kann | ✅ 2026-08-17 | **D-009**. Der Gerätewechsel ist als E2E-Lauf geprüft: zwei getrennte Umgebungen, wie zwei Telefone | S |
| N7 | **Stufe 2 (Phase 2):** Anmeldung bei Google, Abgleich in den **app-privaten Ordner des eigenen Google Drive** (OAuth mit PKCE, kein Backend) | ⬜ | **D-009**. Die Daten liegen im Speicher des Nutzers, nicht bei uns | L |
| N8 | **Stufe 3 (Phase 3):** iCloud — realistisch erst mit der nativen iOS-App, weil CloudKit ein Apple-Entwicklerkonto und einen App-Container braucht | ⬜ | **D-009**, hängt an Q6 | L |
| N9 | Konfliktauflösung bei zwei Geräten (gleicher Tag, zwei Sessions) | 🟨 2026-08-17 | Trainingshistorie ist additiv — zusammenführen statt überschreiben. Die Regeln stehen im Kern (`core/backup.ts`): Es gewinnt die **längere Geschichte**, nicht der jüngere Termin; Ereignisse werden am Fingerabdruck erkannt, nicht an der laufenden Nummer. Beim echten Abgleich (N7) kommt der Fall „gleichzeitig geändert“ dazu | M |
| N10 | Googles Freigabeverfahren für den Drive-Zugriff samt Datenschutzerklärung | ⬜ | kostenlos, aber es dauert; früh anstoßen, hängt an R4 | M |

## O. Bedienung & Barrierefreiheit

Seit **D-011** ist dieser Abschnitt kein Nachklapp mehr, sondern eine
Anforderung wie jede andere. Die acht Regeln G-1 bis G-8 stehen in
[`DECISIONS.md`](DECISIONS.md); hier steht, was daraus gebaut ist.

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| O1 | Vom Öffnen zum laufenden Training: ein Tap, unter zwei Sekunden | ✅ 2026-08-17 | | M |
| O2 | Kein Onboarding-Wall, keine Registrierung, kein Einwilligungslabyrinth | ✅ 2026-08-17 | | S |
| O3 | Hell/Dunkel nach Systemeinstellung | ✅ 2026-08-17 | warmes Papier im Hellen, warmes Dunkel im Dunklen — nirgends reines Weiß oder Schwarz (G-4) | S |
| O4 | Barrierefreiheit: Kontrast, große Schrift, Screenreader, Fokusreihenfolge, reduzierte Bewegung | 🟨 2026-08-17 | „weniger Bewegung“ schaltet **alles** ab, auch das atmende Netz; das wechselnde Wort wird für den Screenreader mitgesprochen. Ein vollständiger Durchgang steht aus | M |
| O5 | Einhändig bedienbar, alles Wichtige in der Daumenzone | 🟨 2026-08-17 | Startknopf optisch mittig, „Fertig“ und „Zurück“ am unteren Rand | M |
| O6 | Haptik und Ton dezent und abschaltbar | 🟨 2026-08-17 | **Ton steht** (D-011/G-9): erzeugt statt mitgeliefert, pentatonisch — dadurch kann keine Reihenfolge falsch klingen —, voreingestellt an, Schalter im Fuß, Wahl gespeichert und im E2E geprüft. **Haptik bewusst noch nicht:** eine Vibration alle vier Sekunden wäre keine Wärme, sondern Nerverei | S |
| O7 | Nie zwei harte Blöcke hintereinander — Anstrengung dosieren | ⬜ | „angenehm, nicht anstrengend“ ist eine Anforderung an die Sessionplanung, nicht an die Grafik | M |
| O8 | **Ruhe statt Reiz** (G-1): keine Konfetti, keine Münzen, kein drängender Countdown | ✅ 2026-08-17 | statt Countdown ein 3-Sekunden-Ankommen mit atmendem Kreis, antippbar zum Überspringen; die Uhr der Einheit läuft erst danach | M |
| O9 | **Ein Ding pro Bildschirm** (G-2) | ✅ 2026-08-17 | Beim Einprägen steht das Wort allein; „3 / 8“ wurde durch eine Punktekette ersetzt. Der Systemcheck aus M0 ist in ein aufklappbares Element am Fuß gewandert | M |
| O10 | **Nichts springt** (G-3): jeder Wechsel bekommt einen Übergang | ✅ 2026-08-17 | Wörter, Marken und Ergebnisse blenden auf; bei reduzierter Bewegung nichts davon | M |
| O11 | **Warm für den Inhalt, kühl für die Technik** (G-4, G-8) | ✅ 2026-08-17 | Serife für alles vom Menschen, Schreibmaschinenschrift für alles Gemessene, Bernstein gegen kühles Grün. Nur Systemschriften — nichts nachgeladen | M |
| O12 | **Die App schimpft nicht** (G-5) | ✅ 2026-08-17 | Nicht Erinnertes heißt „Noch nicht dabei“ und steht gedeckt daneben, ohne Kommentar | S |
| O13 | **Das Netz im Hintergrund** (G-8): Knoten und Verbindungen, die atmen | ✅ 2026-08-17 | 30 Knoten, in CSS bewegt statt in JavaScript, aus einem Seed gebaut. Eine Maske hält die Mitte frei — ein Hintergrund, der mit dem Inhalt streitet, ist ein Fehler | M |
| O14 | **Abwechslung** (G-7): nie zweimal derselbe Tag | 🟨 2026-08-17 | wechselnde Begrüßung, aus dem Tagesschlüssel gezogen. Der große Teil kommt mit den Missionen (H) | S |
| O15 | Ergebnis als kleines Netz statt als Liste darstellen | ⬜ | naheliegende Fortsetzung von G-8: die erinnerten Wörter als verbundene Knoten | M |

## P. Qualität

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| P1 | Unit-Tests für den Kern: Scheduler, Scoring, Sessionplanung — deterministisch | ✅ 2026-08-17 | 134 Tests laufen in Node, ganz ohne Browser — was zugleich D-010 belegt. Sessionplanung, Bewertung, Scheduler und Gesichtsgenerator sind abgedeckt | M |
| P2 | E2E gegen den **gebauten** Stand, nicht gegen den Dev-Server | ✅ 2026-08-17 | 32 Läufe in Chromium und im Telefonprofil, darunter eine Einheit von vorn bis hinten und der Abbruch mitten drin. Seit M4 **liest der Test ab, welches Modul kam, statt es vorherzusagen** (`tests/e2e/helpers.ts`) | M |
| P3 | CI bei jedem Push: Typecheck (App **und** Kern getrennt), Tests, Build, E2E | ✅ 2026-08-17 | | S |
| P4 | Performance: Kaltstart unter 2 s, Timer laufen ruckelfrei | ⬜ | | M |
| P5 | Uhrmanipulation darf die Engine nicht zerstören (Streak-Betrug, Intervall-Chaos) | ⬜ | monotone Zeitquelle plus Plausibilitätsprüfung | M |
| P6 | Zeitzonenwechsel und Reisen: was ist „heute“? | ⬜ | | M |
| P7 | Fehlertoleranz: voller Speicher, DB-Fehler, abgelehnte Benachrichtigungsrechte | ⬜ | | M |
| P8 | Gerätedurchgang auf echtem iPhone und echtem Android — manche Dinge lassen sich nicht vom Buildrechner prüfen | ⬜ | eigene Datei wie in RReader | M |

## Q. Weg in die Stores

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| Q1 | PWA so bauen, dass TWA-Verpackung ohne Umbau möglich ist | 🟨 2026-08-17 | Kern ist browserfrei (A4), Manifest trägt schon den endgültigen Namen und ein maskable Icon. Abnahme erst beim tatsächlichen Verpacken | S |
| Q2 | Digital Asset Links vorbereiten (assetlinks.json, Signaturfingerprint) | ⬜ | | S |
| Q3 | Bubblewrap → .aab → Play Console, Signierung, Test-Track | ⬜ | Phase 2 | M |
| Q4 | Play: Datenschutzerklärung, Data-Safety-Formular, Altersfreigabe | ⬜ | | M |
| Q5 | iOS: „Zum Home-Bildschirm → als Web-App öffnen“ dokumentieren und den Weg optimieren | ⬜ | funktioniert heute schon und ist Phase 1 | S |
| Q6 | iOS App Store: Apple lehnt reine Website-Verpackungen ab — eigenständiger Mehrwert / native Funktionen nötig | ❗ | Phase 2, eigene Entscheidung. Nicht „Website in einen Container stecken“ | L |
| Q7 | Icon, Screenshots, Store-Texte — in allen Sprachen aus L2 | ⬜ | | M |

## R. Recht & Lizenzen

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| R1 | `THIRD_PARTY_LICENSES.md` ab dem ersten Paket pflegen | ✅ 2026-08-17 | Ausgeliefertes vom nur Bauenden getrennt. Im ausgelieferten Stand kein Copyleft; die LGPL-Teile (sharp über wrangler) laufen nur auf dem Buildrechner | S |
| R2 | Lizenzen für Icons, Töne und Namenslisten dokumentieren | ⬜ | Gesichter erzeugen wir selbst (D14), damit entfällt der größte Teil | M |
| R3 | Marken- und Namensrecherche für **ANITEW** | ⬜ | **D-001**. Vor Icon und Store-Eintrag, also vor den ersten Ausgaben. Keine Rechtsberatung, aber eine Prüfung, die vorher stattfinden muss | S |
| R4 | Datenschutzerklärung — auch eine App ohne Server braucht eine | ⬜ | | S |
| R5 | Wirkungsaussagen prüfen: keine Gesundheits- oder Heilversprechen (R-2, F7) | ⬜ | betrifft App-Texte und Store-Beschreibung gleichermaßen | S |

## S. Entscheidungen  ✅ 2026-08-17

Alle neun beantwortet. Die Begründungen stehen in [`DECISIONS.md`](DECISIONS.md);
hier nur, was entschieden wurde und welche Aufgaben dadurch frei sind.

| # | Frage | Antwort | → |
|---|---|---|---|
| S1 | Produktname | **ANITEW** | D-001 · A9, R3, Q7 |
| S2 | Geld | kostenlos + Spende; Pro bleibt möglich, darf aber nur Bequemlichkeit hinzufügen, nie Trainingsleistung | D-002 · K9, Q4 |
| S3 | Stack | React 18 + TS strict + Vite 6 + PWA + Dexie | D-003 · A1 ✅ |
| S4 | Wiederholungsalgorithmus | **FSRS**, Standardparameter, später lokal nachoptimiert. Kostenlos, offline, kein Dienst | D-004 · C2, C10 |
| S5 | Bildmaterial | selbst erzeugt: parametrischer SVG-Gesichtsgenerator + CC0-Icons; KI-Bilder nur für Missionsszenen | D-005 · D14–D16 |
| S6 | Benchmark | eigener 3-Minuten-Test mit Quarantäne-Items, alle 14 Tage, gegen den eigenen Tag 0, erste zwei Messungen als Eichung | D-006 · F2, F2a, F2b |
| S7 | Sprache | Quelltexte Deutsch; erster Start in der Systemsprache, sofort umschaltbar | D-007 · L1a, L8 |
| S8 | Streak | 60 Sekunden halten sie; volle Tage getrennt gezählt; ein Schutztag pro Woche, nicht kaufbar | D-008 · J4, K2 |
| S9 | Abgleich | lokal ohne Anmeldung; mit Anmeldung in die **eigene** Cloud des Nutzers (Google Drive, später iCloud). Kein Konto bei uns | D-009 · N6–N10 |

Neu offen, entstanden aus den Antworten:

| # | Frage | Blockiert |
|---|---|---|
| S10 | **iOS App Store**: welcher eigenständige Mehrwert rechtfertigt die App gegenüber der Web-Version | Q6, N8 |
| S11 | **Spenden in den Stores**: Google und Apple regeln das unterschiedlich — erst prüfen, wenn wir dort ankommen | K9, Q4 |

---

## Reihenfolge — Meilensteine

| | Meilenstein | Inhalt | Fertig, wenn |
|---|---|---|---|
| **M0** | Fundament | A1–A11, L1/L1a, P3 | ✅ **2026-08-17** — Push baut, App installiert sich, `src/core/` läuft ohne Browser und wird von der CI daran gehalten |
| **M1** | Walking Skeleton | B1–B3, B5, B6, B9, C5, D4, D6, N1 | ✅ **2026-08-17** — Eine echte Einheit läuft täglich durch, überlebt eine Unterbrechung, und jede Antwort steht im Protokoll |
| **M2** | Die Engine wird echt | C1–C9, D8, E1–E7, B4 | Die App entscheidet begründet, was du heute trainierst, und plant Wiederholungen persönlich |
| **M3** | Ehrlichkeit | F1–F7, F2a, F2b | Es gibt zwei getrennte Zahlen, und die große Prozentzahl ist gemessen. **Vorher kein öffentlicher Release** |
| **M4** | Inhalt & Spiel | D5, D9–D16, G, H, K, J | 🟨 **2026-08-17** — Drei Module laufen: Wörter, Namen & Gesichter (D9/D14), Zahlen (D10). Offen: Merktechniken (D5), Palast (G), Missionen (H), Gamification (K) |
| **M5** | Sprachen | L1–L8 | Man kann heute auf Deutsch und morgen auf Japanisch trainieren |
| **M6** | Echtes Leben | I, M | Eigene Präsentation rein, Wiederholungsplan raus |
| **M7** | Stores & Cloud | Q, R, N7–N10 | .aab im Play-Track; Drive-Abgleich läuft; iOS-Weg entschieden (S10) |

---

## Nicht-Ziele

Bewusst nicht gebaut, damit die Liste oben nicht ausfranst:

- **Keine hundert Minispiele.** Wenige Module, dafür die richtigen, adaptiv
  eingesetzt. Genau das unterscheidet ANITEW von den üblichen Brain Games.
- **Kein Versprechen allgemeiner Intelligenzsteigerung.** Für klassisches
  Brain-Training gibt es dafür keine überzeugende Evidenz; wir trainieren
  gezielt Gedächtnisleistung und messen sie.
- **Kein Konto, kein Server, kein Tracking** in Phase 1.
- **Keine Sprachen ohne eigenen Inhaltspool** — eine übersetzte Oberfläche mit
  deutschen Namen ist keine Sprachunterstützung.
- **Kein Feature, das ohne Netz oder ohne KI-Schlüssel nicht mehr funktioniert.**

---

## Erste Schritte, konkret

1. ~~S1 und S3 entscheiden~~ — erledigt am 2026-08-17, alle neun Fragen
   beantwortet (D-001 bis D-010).
2. ~~M0: Gerüst, PWA, `src/core/` ohne Browser, Datenschicht mit Migrationen,
   i18n, CI~~ — erledigt am 2026-08-17.
3. ~~M1: eine echte, durchlaufbare Einheit aus Einprägen und freiem Abruf~~ —
   erledigt am 2026-08-17. **Ab hier lässt sie sich täglich benutzen** — und
   alles Weitere an echter Erfahrung statt an Vermutungen ausrichten.
4. **M2:** die Engine, die entscheidet, was heute drankommt — Wiederholungsplan
   (C1–C9), Gedächtnisprofil (E1–E7), Spaced Recall (D8). ← *hier stehen wir*

Zwei Dinge nebenher, unabhängig vom Meilenstein:

- **R3** (Markenrecherche ANITEW) sollte laufen, bevor Icon, Domain und
  Store-Eintrag Geld kosten.
- ~~A7: Veröffentlichung einrichten~~ — erledigt, die App läuft unter
  https://anitew.impekaltech.workers.dev
