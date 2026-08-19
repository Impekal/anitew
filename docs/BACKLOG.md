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
| A5 | Plattform-Adapter-Schicht: Storage, Uhr/Timer, Benachrichtigungen, Audio, Datei-Export | ✅ 2026-08-18 | Vollständig hinter `core/ports.ts`: `platform/web/` liefert Storage (IndexedDB), Uhr (Wand- und monotone Zeit), Ton (erzeugt), Erinnerungen (D-022) — und der Datei-Export ist die Sicherung (N2). Der Kern kennt keinen davon (D-010) | M |
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
| B7 | Weitermachen nach der Tages-Challenge: freies Training, zählt für Fortschritt, aber ohne Druck | ✅ 2026-08-18 | „Noch eine Runde“ am Abschluss, **neben „Zurück“, nicht darüber**, ohne Ausrufezeichen. Ein Tap beginnt eine frische Einheit (neuer `key`, damit der Runner wirklich neu aufsetzt); sie zählt wie jede andere für Serie und Wiedersehen. Wer aufhören will, hört auf. `tests/e2e/session.spec.ts` | S |
| B8 | Tageserinnerung als **lokale** Benachrichtigung, opt-in, feste Uhrzeit wählbar | 🟨 2026-08-18 | **D-022**. Der Mechanismus steht und die Uhrzeit wird gemerkt — aber das Web kann eine Benachrichtigung nicht für später einplanen (`TimestampTrigger` gibt es nirgends dauerhaft, und ein Server-Push kommt nicht in Frage). Die App **sagt das**, vor der Einstellung. Zugesagt werden kann es erst als App aus dem Store (Q) | M |
| B9 | Session-Log: jede Antwort mit Item-ID, richtig/falsch, Latenz, Kontext | ✅ 2026-08-17 | ein Ereignis **je Wort**, nicht „6 von 8“ — ohne diese Auflösung gäbe es später keine Vergessenskurve pro Information. Nur anhängen, nie ändern | M |
| B10 | Kennenlernen (Onboarding): Name, Ziel, Zeitbudget, Tageszeit, Altersband — alles freiwillig | ✅ 2026-08-18 | **D-024**. Fünf Fragen, eine je Bildschirm, jede überspringbar; „Ohne Fragen anfangen“ ist ein echter Knopf auf dem ersten Schritt. Antworten werden Anrede und **Vorschläge** (Startmodus, Schwerpunkt-Fallback, Erinnerungs-Uhrzeit), nie Aussagen (R-1). Nachträglich änderbar unter „Über dich“. `tests/e2e/onboarding.spec.ts` | M |

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
| C6 | Ähnliche Items nicht in derselben Session — und Interferenz **trainieren** | ✅ 2026-08-18 | **D-027**. Die Vermeidung stand (Listen ohne Reimpaare); dazu kam das Zwillingsmodul: kuratierte Verwechselpaare, eingeprägt eines, gefragt mit beiden Knöpfen. Kollisionsfreiheit gegen alle Vorräte per Kerntest erzwungen. Achse „Ähnliches auseinanderhalten“ | M |
| C7 | Überfälligkeitsdruck begrenzen: nie ein Berg von 800 fälligen Items nach einer Pause | ✅ 2026-08-17 | Obergrenze aus dem Zeitbudget (`dueLimitFor`), höchstens 12. Am längsten Überfälliges zuerst. Wer zwei Wochen weg war, holt über mehrere Tage auf — langsamer, aber der einzige Weg, der zu einem zweiten Tag führt | M |
| C8 | Engine deterministisch und seed-basiert, damit testbar | ✅ 2026-08-18 | Die Engine steht (FSRS, Sessionplan, Serie, Messung, Profil) und ist durchgängig aus einem Seed reproduzierbar — `Math.random()` ist verboten, geprüft in 322 Kerntests. Genau das trägt auch die Simulation (C9) | S |
| C9 | Simulator: synthetische Nutzer über 90 Tage, bevor echte Nutzer da sind | ✅ 2026-08-18 | Läuft als deterministischer Test über 120 und 400 Tage: Wer alles behält, wird immer seltener gefragt; wer die Hälfte vergisst, öfter. Zeigt, dass der Scheduler über lange Horizonte stabil bleibt (A11) | M |
| C10 | FSRS-Parameter später **auf dem Gerät** aus der eigenen Historie nachoptimieren | ⬜ | **D-004**, Phase nach M2; bis dahin Standardparameter | L |

## D. Übungsmodule

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| D1 | Einheitliche Modulschnittstelle: Aufgabe rein, Score + Rohdaten raus | ✅ 2026-08-17 | **D-012**, **D-014**. Vier Module, und der Planer mischt sie reihum. Ein Modul bringt seine Regeln mit (`isPrompted`, `leniencyFor`); der Planer kennt nur Kennungen und Zeiten. Er kennt nur Kennungen, Zeiten und die Frage „freier oder gestützter Abruf“ — was ein Modul *zeigt*, weiß er nicht. Ein fehlender Modultext ist seit M4 ein Übersetzungsfehler und kein leerer Hinweis | M |
| D2 | Schwierigkeit adaptiv pro Modul, Zielkorridor um ~80 % Trefferquote | ✅ 2026-08-19 | **D-029**. Gerechnet, nicht fortgeschrieben: die letzten 20 Antworten je Modul aus dem Ereignislog, unter 10 Antworten keine Anpassung (E7-Vorsicht), ±1 Stück je Runde innerhalb 3–8; Rückwärtsspanne 4–6 Ziffern nach derselben Regel. Korridor 65–90 % bleibt unangetastet — ~80 % ist das Ziel, kein Fehler | M |
| D3 | **Focus** — Ablenkungen ignorieren, kurze Aufmerksamkeitsschulung | 🟨 2026-08-18 | Die Interferenz-Hälfte übernimmt das Zwillingsmodul (C6/D-027). Ein eigener Fokus-Block (0:00–1:00) bleibt offen | M |
| D4 | **Encode** — 8 Bilder / Wörter / Personen / Orte merken | 🟨 2026-08-17 | Wörter und Personen laufen, ein Stück je 4 Sekunden, 3–8 je Runde. Bilder und Orte kommen mit D12/D15 | M |
| D5 | **Merktechniken werden beigebracht**, nicht nur abgefragt: Verknüpfung, Story-Methode, Major-System, Loci | ✅ 2026-08-19 | **D-013**. Alle vier stehen: Major (eine Ziffer je Lektion), Loci (Palastlektion, G), **Geschichte** (vor den Wörtern) und **Verknüpfung** (vor den Gesichtern) — je eine 14-Sekunden-Lektion, Vorrang Palast → Geschichte → Verknüpfung → Ziffern, sofortige Anwendung in Runde 1. Kein vorgefertigtes Merkbild — selbst gebaute sitzen besser | L |
| D6 | **Recall** — freier Abruf ohne Hinweise | ✅ 2026-08-17 | leeres Feld, Reihenfolge egal, Bewertung in `core/session/grading.ts` | M |
| D7 | **Working Memory** — behalten und gleichzeitig manipulieren | ✅ 2026-08-18 | **D-026**. Rückwärts-Ziffernspanne statt N-Back: Folge kurz sehen (Feld solange gesperrt), verdeckt, rückwärts eingeben — exakt verglichen. Kein Einprägeblock, kein Termin; die Profil-Achse zählt sofortige Antworten und sagt das dazu. `tests/core/reverse.test.ts`, `tests/e2e/reverse.spec.ts` | M |
| D8 | **Spaced Recall** — etwas von gestern / vor 3 Tagen / letzter Woche | ✅ 2026-08-17 | eigener Block am Ende der Einheit, nur wenn etwas fällig ist. Fällige Wörter werden **aus dem Vorrat für neue genommen** — sonst wäre der Abruf ein Wiedererkennen (ein Test hat genau das gefunden). Eigene Zahl im Ergebnis, nicht mit dem heute Gelernten verrechnet | M |
| D9 | **Namen & Gesichter** | ✅ 2026-08-17 | schwächster Bereich im Beispielprofil, also wichtig. Abruf **gestützt**: Das Gesicht steht da, gesucht ist der Name (`gradePrompted`) — „nenne alle Gesichter“ wäre keine Frage. Die Wiedervorlage über D8 gilt genauso wie für Wörter | M |
| D10 | **Zahlen** — Ziffernfolgen, Jahreszahlen, PINs, Telefonnummern | ✅ 2026-08-17 | **D-012**. 3–6 Ziffern, aus dem Seed erzeugt statt aus einer Liste — eine feste Liste wäre nach zwei Wochen durchgesehen. Geschenkte Folgen („1111“, „3456“) fallen raus. **Streng verglichen:** eine vertauschte Ziffer ist eine andere Zahl. Gruppierte Nummern („0176 4392 118“) fehlen noch — der freie Abruf zerlegt an Leerzeichen | M |
| D11 | **Wörter & Listen** | 🟨 2026-08-17 | Wortvorrat je Sprache in `core/content/words.ts` — konkret und bildhaft, je Sprache eigen statt übersetzt, untereinander verschieden. DE und EN mit je ~80 Wörtern | S |
| D12 | **Räumlich** | ⬜ | | M |
| D13 | **Assoziativ** — „Meet 5 people“: Person + Land + Hobby + Stadt, später quer abgefragt | 🟨 2026-08-17 | „Wie hieß die Person aus Indien?“ / „Wer spielte Gitarre?“ — trainiert, was im Alltag wirklich vorkommt. Die Missionen (H) machen die eine Richtung: **von der Person zur Tatsache**. Die Gegenrichtung — von der Tatsache zur Person — fehlt noch | L |
| D14 | **Gesichtsgenerator**: parametrische SVG-Gesichter aus einem Seed (Kopf, Augen, Nase, Mund, Haar, Bart, Brille, Hautton) | ✅ 2026-08-17 | **D-005**. Aus einem Seed immer dasselbe Gesicht, aus vielen Seeds Millionen — Kilobytes statt Megabytes, keine Rechtefragen. Die Maße liegen im Kern (ohne SVG, ohne Browser), gezeichnet wird in `app/Face.tsx`. Geprüft wird mit `scripts/facesheet.mjs`: vierzig Gesichter nebeneinander — einzeln sieht fast jedes annehmbar aus | L |
| D15 | Objekte und Orte: CC0-Icon-Satz auswählen, prüfen, dokumentieren, um eigene Formen ergänzen | ⬜ | **D-005**; Lizenzen nach R2 | M |
| D16 | Fotorealistische Porträts als optionaler Nachladeinhalt | ⬜ | **D-005**, später. Gezeichnete Gesichter sind leichter als echte — der Benchmark (F2) muss das berücksichtigen, und die App darf es nicht als Alltagsleistung ausgeben (R-1) | L |

## E. Memory Profile & Personalisierung

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| E1 | ~~Erstdiagnose („YOUR MEMORY DNA“)~~ | ❌ **abgelehnt** | **D-021**. Ein Profil aus drei Minuten Erstkontakt ist die eindrucksvollste erfundene Zahl der App — es sieht nicht wie eine Punktzahl aus, sondern wie ein Befund über einen Menschen. Es wächst stattdessen aus dem Training | L |
| E2 | Acht Dimensionen … plus eine neunte | ✅ 2026-08-18 | **Zusammenhänge** kam dazu: Die Missionen üben, dass Zimmer, Gegenstand, Uhrzeit und Ort *zu einer Person gehören* (D-014) — eine eigene Fähigkeit, und die alltagsnächste. Seit D7 (Arbeitsgedächtnis, D-026), den Zwillingen (D-027) und den Bildern (D-028) hat **jede der neun Achsen eine echte Quelle** — „nicht gemessen“ sagt keine mehr | M |
| E3 | Profilwerte ausschließlich aus gemessenen Daten (R-1) | ✅ 2026-08-18 | Nur **verzögerter Abruf**: wie oft etwas nach seinem ersten Tag zurückkam und dabei noch da war. Der Lerntag bleibt draußen — das ist Übung und nicht Gedächtnis (F1). Beide Zahlen exakt aus den Terminen | M |
| E4 | Profilanzeige plus Verlauf über die Zeit | 🟨 2026-08-18 | Die Anzeige steht — als **Liste, nicht als Netzdiagramm**: Ein Netz braucht für jede Achse einen Wert und zwingt damit zur erfundenen Zahl. Der Verlauf über die Zeit fehlt noch | M |
| E5 | Adaptive Tagesplanung: Schwächen priorisieren, Stärken erhalten | ✅ 2026-08-18 | Der Schwerpunkt bekommt **jede zweite Runde** — nicht alle: Eine Einheit, die nur noch das Schwächste übt, ist keine Personalisierung, sondern eine Strafe für eine Schwäche, und sie ließe alles andere verfallen. Er entsteht nur, wenn sich zwei Spannen nicht überlappen, und die Lektion geht ihm vor | L |
| E6 | Die App erklärt ihre Entscheidung in einem Satz | ✅ 2026-08-18 | „Heute mit Schwerpunkt: Zahlen — von dem, was zurückkam, ist dort am wenigsten geblieben. Ändert sich, sobald sich die Zahlen ändern.“ Der zweite Halbsatz gehört dazu: Ein Schwerpunkt, der wie ein Urteil klingt, wäre die Diagnose, die D-021 ausschließt. Startbildschirm und Planer benutzen **dieselbe** Regel (`learnableModules`) — sonst verspräche die App einen Schwerpunkt, den der Plan nicht einhält | S |
| E7 | Unsicherheit ehrlich zeigen, solange zu wenig Daten da sind | ✅ 2026-08-18 | Unter 15 Gelegenheiten steht „noch zu wenig“ — als **eigener Fall**, nicht als Null: Eine Null ließe sich als schlechtes Ergebnis lesen. Darüber immer Wert **und** Spanne | S |

## F. Messung & Ehrlichkeit  🔴 Release-Sperre

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| F1 | **Trainingsscore und Benchmark strikt trennen** — zwei Datenreihen, zwei Anzeigen, nie vermischt | ✅ 2026-08-18 | Zwei Tabellen (`sessions`/`events` gegen `benchmarks`), zwei Bausteine (`Summary` gegen `BenchmarkPanel`), keine gemeinsame Zahl. Die Zusammenfassung sagt ausdrücklich, dass ihr Wert *nichts* über das Gedächtnis insgesamt aussagt. Eine abgebrochene Messung fällt aus der Reihe heraus, statt sie zu verdünnen | M |
| F2 | Benchmark-Test: ~3 min, Tag 0 und dann alle 14 Tage; gleicher Aufbau, neuer Inhalt; misst sofort / nach 20 min / am Folgetag | ✅ 2026-08-18 | `core/benchmark/plan.ts`: 20 Wörter × 5 s, Abruf in drei Stufen, das Fenster für die zweite ist 15–45 Minuten. Wer es verpasst, bekommt keinen Vorwurf, sondern die Ansage, dass diese Messung nicht zählt. **Abbrechen geht jederzeit** (D-015): Ist noch keine Zahl entstanden, ist die nächste sofort wieder fällig — steht der erste Abruf schon in der Zeile, gilt der übliche Abstand, sonst würde man wiederholen, bis das Gefühl stimmt | L |
| F3 | „Memory Strength +18 %“ nur aus dem Benchmark, mit Antippen → was genau gemessen wurde | ✅ 2026-08-18 | Die große Zahl ist die Differenz zur eigenen Eichung, und sie steht nur da, wenn die Spanne (±2 Standardfehler) die Null **nicht** enthält. Sonst steht dort, dass kein Unterschied erkennbar ist. Aufklappbar: was gezählt wurde | M |
| F2a | **Quarantäne-Itempool**: Benchmark-Inhalte kommen sonst nirgends vor und wandern nie in die Wiederholung | ✅ 2026-08-18 | 60 Wörter je Sprache in `core/benchmark/pool.ts`, per Test gegen den Trainingswortschatz auf Überschneidungsfreiheit geprüft. Sie erzeugen keinen `itemState`, also auch keinen Termin. `poolCycles()` sagt, ab welcher Messung sich der Vorrat wiederholt — und die App sagt es dann auch | M |
| F2b | Erste zwei Messungen als **Eichung** kennzeichnen (Gewöhnung ans Format), Ergebnis als Spanne solange die Datenlage dünn ist | ✅ 2026-08-18 | `CALIBRATION_RUNS = 2`. Vor der dritten Messung zeigt die App keine Veränderung, sondern erklärt, warum noch keine dasteht. Danach immer Wert **und** Spanne | M |
| F4 | Kein behaupteter Alltagstransfer, der nicht gemessen wurde | ✅ 2026-08-18 | Der Erklärtext endet mit dem Satz, der dem ganzen Genre fehlt: „Über dein Gedächtnis im Alltag sagt es nichts, solange es niemand dort gemessen hat.“ | S |
| F5 | Fortschritt in echten Zahlen: „Day 1: 8/20 · Day 7: 15/20 · Day 30: 18/20 — du erinnerst 10 Dinge mehr als am ersten Tag“ | ✅ 2026-08-18 | Die Reihe steht als Liste unter dem Ergebnis, jede Messung mit ihrem Tag und ihrem Zähler. Unvollständige Läufe stehen nicht darin | M |
| F6 | Wissenschaftsseite in der App: was belegt ist (Spacing, Retrieval Practice), was nicht (allgemeine Intelligenzsteigerung), mit Quellen | ✅ 2026-08-18 | **D-016**. Vier Stufen statt zwei: belegt / belegt-aber-nur-dafür / nicht belegt / nicht gemessen. Jede Aussage nennt, was in der App auf ihr steht — bei den beiden unteren steht dort nichts, und ein Test hält das fest | M |
| F7 | Alle Marketing- und Store-Texte an F1–F6 binden | ✅ 2026-08-18 | `docs/STORE.md`: Store-Texte in beiden Sprachen, jede Aussage mit ihrer Deckung in einer Tabelle. `index.html` und das Manifest tragen jetzt denselben Satz wie die App. Die Sperrliste (R5) ist ein Test über alle Marketingflächen, keine Absichtserklärung | S |

## G. Memory-Palace-Modus

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| G1 | Palast-Datenmodell: Räume, Stationen, feste Reihenfolge | ✅ 2026-08-18 | **D-017**. Ein Gang ist eine Szene wie eine Mission (D-014): Anker `home~3`, Stück `home~3#hall`. Fünf Stationen, feste Reihenfolge — die ist nicht Zierde, sondern die halbe Technik | M |
| G2 | Vorgefertigte Paläste: Wohnung, Straße, Körper | ✅ 2026-08-18 | Drei Wege zu je fünf Stationen. Absichtlich die banalsten Orte der Welt: Ein Palast wirkt, weil man ihn kennt. **Erst ab drei Minuten** (D-020) — darunter blieben für fünf Fragen zehn Sekunden | M |
| G3 | Eigener Palast: Nutzer legt Räume und Stationen selbst an | ✅ 2026-08-18 | Fünf Orte und ein Name. **Feste Kennungen, freie Beschriftungen**: In der Datenbank steht `own~7#own3`, das Schild liegt in den Einstellungen — wer seinen Balkon umbenennt, verliert nicht, was er dort abgelegt hat. Ein Gang durch einen weggeworfenen Palast wird übergangen, nicht ohne Schild gefragt | M |
| G4 | Automatische Zuordnung Item → Station | ✅ 2026-08-18 | Aus dem Anker gerechnet, ohne Zurücklegen. „Such dir selbst aus, was wohin gehört“ wäre eine Aufgabe vor der Aufgabe — Zuordnung ist Verwaltung, das Bild ist die Technik (D-017) | M |
| G5 | Merkbilder erzeugen | ❗ **umgeschrieben** | **D-017**: Die App liefert **kein** Bild. Ein selbst gebautes sitzt besser als ein vorgesetztes — wer „qualmender Toaster“ vorgesetzt bekommt, hat einen Satz gelesen. Sie verlangt das Bild, sagt wie eins aussieht, das trägt, und gibt dem Palast dafür sechs Sekunden je Station statt vier | L |
| G6 | Begehungsmodus als Abfrage: „Gehe durch dein Wohnzimmer“ → Sofa → 1884 | ✅ 2026-08-18 | Der Abruf ist gestützt und geht Station für Station: das Schild zeigt „Deine Wohnung · Flur“, die Frage lautet „Was lag hier?“ | M |
| G7 | Palastinhalte hängen in der Spacing-Engine (C) wie jedes andere Item | ✅ 2026-08-18 | Fällt aus der Bauform ab: Ein Gang hat dieselbe Form wie eine Mission, also plant der Scheduler ihn wie alles andere. Möglich nur, weil ein Gang **gerechnet** und nicht gespeichert wird — dieselbe Frage hat in drei Wochen dieselbe Antwort | S |

## H. Memory Missions

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| H1 | Szenenformat: Szene + Fakten + Fragen als Datenmodell | ✅ 2026-08-17 | **D-014**. `Mission` = Person + Tatsachen; die Kennung `Elena#room` trägt den Anker mit. **Gefragt wird nach dem Wert, verbucht wird die Kennung** — überall sonst ist das dasselbe, hier nicht | M |
| H2 | Referenzmission „The Hotel“ vollständig umgesetzt | 🟨 2026-08-17 | Zimmer · Gegenstand · Person · Abfahrt · Restaurant laufen. „Schlüssel auf Tisch“ fehlt noch: Eine **Ortsangabe zu einem Gegenstand** ist eine andere Art Tatsache und braucht eine eigene Frage | M |
| H3 | **Verzögerter Abruf**: 20 Minuten später fragt die App nach | ⬜ | wartet weiter auf B8 — und nach **D-022** ist klar, dass „einen Weg, wenn die App zu ist“ im Browser gar nicht existiert. Der verzögerte Abruf einer Mission ist deshalb ein Store-Thema (Q), kein Web-Thema. Die Messung kommt bereits ohne ihn aus, weil ihr Fenster 30 Minuten breit ist | M |
| H4 | Prozedurale Missionsgenerierung aus Bausteinen — offline, ohne KI | 🟨 2026-08-17 | sonst ist der Vorrat nach zwei Wochen leer. Eine Vorlage (Hotel) mit Farben, Gegenständen, Lokalnamen, Zimmern und Zeiten — aus dem Namen erzeugt, also unbegrenzt. Weitere Vorlagen fehlen | L |
| H5 | Missionsbibliothek, mehrsprachig und kulturell passend bestückt | ⬜ | hängt an L6 | M |
| H6 | Schwierigkeitsstufen: Faktenzahl, Ablenkung, Betrachtungszeit, Abrufabstand | ⬜ | Die Betrachtungszeit ist seit H1 eine Moduleigenschaft (`secondsPerItemFor`) — der Haken, an dem das hängen kann | M |

## I. Real Life Memory

Der Punkt, der aus einem Spiel einen Gedächtnistrainer macht.

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| I1 | Eigene Inhalte eingeben: Text, Foto, Diktat | 🟨 2026-08-19 | **D-032**. Text steht: einfügen → Paar-Vorschau (Nicht-Erkanntes sichtbar) → übernehmen → Modul `facts` im normalen Rundenlauf samt FSRS-Wiedersehen. Foto und Diktat offen | M |
| I2 | „Ich treffe morgen 6 neue Kollegen“ → daraus wird ein Training | ⬜ | | L |
| I3 | MEMORY MODE für eigenes Material: Fakten extrahieren → strukturieren → Merkbilder → Retrieval-Fragen → Wiederholungsplan | ⬜ | die fünf Schritte aus dem Gespräch, in dieser Reihenfolge | L |
| I4 | Funktioniert auch **ohne** KI: halbautomatisch, mit Nutzerbestätigung | ✅ 2026-08-19 | **D-032**. Der Parser schlägt vor (Strich, Doppelpunkt, Tabulator), der Mensch bestätigt; keine KI im Spiel | M |
| I5 | Termingebundene Items: „Das Treffen ist morgen um 9“ → Wiederholungen davor legen, nicht danach | ⬜ | für Prüfungen und Präsentationen das eigentlich Wertvolle | M |
| I6 | Eigene Inhalte bleiben lokal. Versand an eine KI nur nach ausdrücklicher Freigabe pro Vorgang | ✅ 2026-08-19 | **D-032**. Lokal in den Einstellungen (wandert mit der Sicherung, N2); es gibt keinen Codepfad, der Karten ins Netz trägt — auch der Coach bekommt sie nicht | S |

## J. Zeitmodi (Emergency Mode)

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| J1 | Vier Modi: 60 Sekunden · 3 Minuten · 5 Minuten (Standard) · 15 Minuten | ✅ 2026-08-18 | Alle vier auf dem Startbildschirm, `core/modes.ts`. Der Standard ist voreingestellt | M |
| J2 | Jeder Modus ist ein Zeitbudget-Profil derselben Engine, kein eigener Code | ✅ 2026-08-18 | `core/modes.ts` legt vier Budgets fest; `planSession` teilt jedes in Runden und Blöcke — ein Codeweg für alle vier. Die Summe der Blöcke ist auf die Sekunde die Moduslänge (B2) | M |
| J3 | Auswahl in einem Tap direkt vom Startbildschirm | ✅ 2026-08-18 | Vier Knöpfe unter „Beginnen“, ein Tap wählt, ein Tap startet (O1). 44 px Mindesthöhe (O5) | S |
| J4 | 60-Sekunden-Modus hält die Streak am Leben | ✅ 2026-08-18 | **D-008**: Eine zu Ende gelaufene 60-Sekunden-Einheit zählt als Trainingstag, geprüft im Streak-E2E. Das getrennte Zählen voller Challenges ist eine spätere Beigabe, keine Voraussetzung | S |

## K. Gamification

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| K1 | ~~XP und Level~~ → **Das Wiedersehen** | ✅ 2026-08-18 · ❗ **ersetzt** | **D-019**. Ein neuer Name für XP hätte nichts geheilt: Eine Punktewährung ist von Bauart erfunden. Gezählt wird stattdessen ein Ereignis — eine Information, die nach ihrem ersten Tag zurückkam. **Nicht farmbar**: Wer heute länger übt, verschiebt nur Termine. Keine Level, kein Balken — jede Marke wäre ausgedacht | M |
| K2 | Streak inklusive Schutztag: einer pro Woche, bis zu zwei angespart, **nicht kaufbar und nicht durch Werbung verdienbar** | ✅ 2026-08-17 | **D-008**, **D-015**. Ein Tag zählt, sobald eine Einheit zu Ende gelaufen ist — die kürzeste dauert 60 Sekunden. Je sieben Trainingstage ein Schutztag, höchstens zwei. **Aus den Trainingstagen gerechnet, nicht fortgeschrieben:** ein Zähler wäre eine Behauptung, die nach einem Absturz oder einem eingelesenen Backup danebenliegen kann | M |
| K3 | Achievements | ✅ 2026-08-18 · Baum 2026-08-19 | **D-019**, **D-030**. Benannte Tatsachen, keine Ränge: aus vorhandenen Zahlen gerechnet (Serie, Wiedersehen, Lernstand, Messungen, Palast, Achsen-Zählungen), **nur was erreicht ist** — keine gesperrten Felder, kein Fortschrittsbalken, kein „0 von 8“. Am Anfang steht gar nichts. Seit dem Ausbau als **Fähigkeitsbaum**: zwölf Tatsachen, gruppiert unter acht Fähigkeiten (Dranbleiben, Abruf, Arbeitsgedächtnis, Unterscheiden, Bilder, Räume, Menschen, Gemessen); leere Fähigkeiten stehen nicht da. `core/progress/achievements.ts`, `core/progress/tree.ts` | M |
| K4 | Daily Missions und Memory Quests | ❌ **abgelehnt** | **D-019**. Manufacturierte Verpflichtung. Was täglich ansteht, entscheidet der Wiederholungsplan — der weiß es aus der Vergessenskurve und nicht aus der Bindungsabsicht. Ein ausgedachter Tagesauftrag daneben nähme dem echten die Glaubwürdigkeit | M |
| K5 | Persönliche Rekorde | 🟨 2026-08-18 | Die längste je erreichte Serie, und seit D-019 der **längste Fall**: wie oft dieselbe Information schon zurückkam. Er lässt sich an keinem Nachmittag holen — darum taugt er als Rekord. Weitere (längste Zahl) fehlen | S |
| K6 | Unlockable Worlds — rein kosmetisch | ⬜ | | M |
| K7 | **Anti-Dark-Pattern-Regel**: keine künstliche Verknappung, kein Angstdruck, keine erfundenen Zahlen | ✅ 2026-08-17 | **D-015** — jetzt eine bindende Regel mit Namen und nicht nur ein Vorsatz im Backlog | S |
| K8 | Die wichtigste Belohnung ist F5: der Nutzer merkt selbst, dass er besser wird | ✅ 2026-08-18 | Die Messung steht seit M3, und daneben jetzt das Wiedersehen (K1) — zwei gezählte Größen, keine vergebene | — |
| K9 | Spendenweg: externer Link (Ko-fi / PayPal / GitHub Sponsors) im Web; Store-Regeln für Spenden getrennt prüfen, wenn wir dort ankommen | ⬜ | **D-002**. Kern bleibt dauerhaft kostenlos; ein späteres Pro darf nur Bequemlichkeit hinzufügen, nie Trainingsleistung | S |

## L. Mehrsprachigkeit

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| L1 | i18n-Grundgerüst, Sprachwechsel zur Laufzeit, von Anfang an | ✅ 2026-08-17 | die Form der Wörterbücher wird aus der deutschen Quelle abgeleitet — ein vergessener Schlüssel ist ein Übersetzungsfehler, kein leerer Text zur Laufzeit | M |
| L1a | Beim ersten Start die **Systemsprache** übernehmen; Umschalten sichtbar auf dem ersten Bildschirm | ✅ 2026-08-17 | **D-007**. Die Regel liegt in `core/language.ts` und ist ohne Browser prüfbar; E2E prüft sie zusätzlich echt (de-DE, en-GB, sv-SE → Englisch) | S |
| L2 | Elf Sprachen: DE · EN · FR · ES · IT · PT · NL · TR · AR · ZH · JA | 🟨 2026-08-18 | Als Sprache alle elf wählbar. **Trainieren** kann man in DE, EN und jetzt **FR** (voller Inhalt); **Oberfläche** übersetzt in DE und EN. Französische Oberfläche (fr.ts) fehlt noch — braucht eine muttersprachliche Durchsicht der Prosa | L |
| L3 | RTL für Arabisch — Layout, nicht nur Text | 🟨 2026-08-17 | `dir` wird gesetzt; das Layout ist noch nicht daraufhin geprüft | M |
| L4 | CJK: Schriftschnitte, Zeilenumbruch, Eingabemethoden bei freiem Abruf (C5) | ⬜ | freier Abruf auf Japanisch ist ein eigenes Problem | M |
| L5 | Engine bleibt sprachunabhängig; Sprache ist ein Attribut am Item | ✅ 2026-08-18 | Steht seit M1 im Datenmodell (`words:de:Anker`) und wird jetzt auch benutzt: Eine E2E-Prüfung trainiert einmal auf Deutsch und einmal auf Englisch und liest zwei getrennte Reihen aus der Datenbank | M |
| L6 | Inhaltspools je Sprache: Wörter, Namen, Orte — kulturell passend, nicht durchübersetzt | 🟨 2026-08-18 | DE, EN **und FR** vollständig: eigene Wörter, Namen, Missionsbausteine, Palastgegenstände, Quarantänewörter — überschneidungsfrei per Test. Für die Missionen ein **Sprachschalter für die Wortstellung** (im Französischen steht die Farbe hinter dem Substantiv: „sac rouge“), keine Grammatik-Engine. `tests/core/french.test.ts` | L |
| L7 | Trainingssprache getrennt von Oberflächensprache | ✅ 2026-08-18 | Eigene Auswahl neben der Oberflächensprache. **Angeboten wird nur, wofür es vollständigen eigenen Inhalt gibt** — Wörter, Namen, Szenen, Gänge und Quarantänewörter. Eine Sprache anzubieten und dann englische Wörter zu zeigen wäre keine Trainingssprache, sondern eine Zusage ohne Deckung (R-2). Heute also DE und EN; die App sagt, warum nicht mehr | M |
| L8 | Übersetzungsprozess: Quelltexte **auf Deutsch**, von dort übersetzt; Pflege ohne Wildwuchs | ⬜ | **D-007** | S |

## M. KI (BYOK)

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| M1 | Bring-your-own-key: Gemini, Anthropic, OpenAI, Mistral, Groq, OpenRouter | 🟨 2026-08-19 | **D-031**, **D-034**. Fünf Anbieter stehen: Gemini (empfohlen, kostenlos mit Grenzen), Anthropic, Groq, OpenRouter, Mistral — je mit Schlüssel-Anleitung und Direktlink in der App; Schlüssel je Anbieter lokal, jede Frage direkt zum gewählten Anbieter. Offen: OpenAI | M |
| M2 | Die App ist ohne KI vollständig benutzbar | ✅ 2026-08-19 | harte Regel, eingehalten: Der Coach hat einen Pflichtteil aus den eigenen Zahlen (R-1), der ohne Schlüssel und ohne Netz spricht; alles andere in der App war nie KI-abhängig | S |
| M3 | Schlüssel bleiben lokal, standardmäßig nur für die Sitzung | 🟨 2026-08-19 | lokal: ja (IndexedDB, geht nirgendwohin außer in den einen Header). **Bewusst dauerhaft statt sitzungsweise** (D-031): ein erklärter Schlüssel mit sichtbarem Entfernen-Knopf statt stillem Wiederverlangen bei jedem Öffnen | S |
| M4 | KI-Aufgaben: Merkbilder (G5), Missionen (H4), Extraktion aus eigenem Material (I3), Erklärungen | 🟨 2026-08-19 | Erklärungen laufen (freie Fragen mit Zahlenkontext). Merkbilder bleiben ausgeschlossen — die Anweisung verbietet sie ausdrücklich (D-013: selbst gebaute sitzen besser). Extraktion kommt mit I | M |
| M5 | Offline-Fallback für jede einzelne KI-Funktion | ✅ 2026-08-19 | für die einzige KI-Funktion: Die Hinweise aus den Zahlen stehen immer, jeder Fehlerfall sagt das dazu | M |

## N. Daten, Offline, Export

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| N1 | Alles lokal in IndexedDB. **Kein Konto bei uns, kein Server, keine Nutzerdatenbank** — auch nicht, wenn später abgeglichen wird | ✅ 2026-08-17 | **D-009**. Fünf Tabellen in `data/db.ts`, Version 1 wird nie mehr angefasst | S |
| N2 | Export/Backup als Datei, Import auf einem neuen Gerät | ✅ 2026-08-17 | ohne Server ist das der einzige Weg, Fortschritt nicht zu verlieren. Eigene Fassungsnummer, **getrennt** vom Datenbankschema — sonst änderte eine Migration stillschweigend das Dateiformat. Einlesen führt zusammen und löscht nie; dieselbe Datei zweimal ändert nichts | M |
| N3 | Vollständig offline nutzbar, auch beim allerersten Start nach der Installation | ⬜ | | M |
| N4 | Löschen: einzelne Items, eigene Inhalte, alles | 🟨 2026-08-18 | **„Alles löschen“ steht** (`data/reset.ts`) — der praktische Vollzug des Löschrechts aus der Datenschutzerklärung (§7), mit einer **echten Rückfrage**, dem einzigen Ort, an dem die App warnt statt beruhigt, und dem Rat, vorher zu sichern. Einzelne Items und eigene Inhalte: erst wenn es sie gibt (I). `tests/e2e/resilience.spec.ts` | M |
| N5 | Speicherbedarf im Blick behalten (Bilder!) und dem Nutzer zeigen | 🟨 2026-08-18 | Die belegte Größe steht im Datenbereich (`navigator.storage.estimate`), **gemessen mit „etwa“** — der Browser hält den Wert bewusst grob, damit er nichts über andere Seiten verrät. Solange es keine Bilder gibt (D16/I), ist die Zahl klein; die Anzeige ist da, sobald sie groß wird | M |
| N6 | **Stufe 1 (Phase 1):** ohne Anmeldung, alles lokal; Sicherung und Gerätewechsel über die Exportdatei aus N2 — die der Nutzer selbst in iCloud Drive oder Google Drive legen kann | ✅ 2026-08-17 | **D-009**. Der Gerätewechsel ist als E2E-Lauf geprüft: zwei getrennte Umgebungen, wie zwei Telefone | S |
| N7 | **Stufe 2 (Phase 2):** Anmeldung bei Google, Abgleich in den **app-privaten Ordner des eigenen Google Drive** (kein Backend) | 🟨 2026-08-19 | **D-009**, **D-033**. Gebaut und gegen gemocktes Google geprüft: Google-Identity-Token (`drive.appdata`, Skript erst bei Bedarf), Abgleich = herunterladen → einmischen (N9) → Vereinigung hochladen, idempotent; stiller Wiederholungsversuch beim Start. Live erst mit der Client-Kennung aus deiner Google-Cloud-Konsole (`VITE_GOOGLE_CLIENT_ID`, Anleitung in OFFEN.md) | L |
| N8 | **Stufe 3 (Phase 3):** iCloud — realistisch erst mit der nativen iOS-App, weil CloudKit ein Apple-Entwicklerkonto und einen App-Container braucht | ⬜ | **D-009**, hängt an Q6 | L |
| N9 | Konfliktauflösung bei zwei Geräten (gleicher Tag, zwei Sessions) | ✅ 2026-08-19 | Trainingshistorie ist additiv — zusammenführen statt überschreiben. Die Regeln stehen im Kern (`core/backup.ts`): Es gewinnt die **längere Geschichte**, nicht der jüngere Termin; Ereignisse werden am Fingerabdruck erkannt, nicht an der laufenden Nummer. Der Abgleich (D-033) benutzt genau dieses Mischwerk — „gleichzeitig geändert“ ist damit derselbe Fall wie „getrennt gelaufen“: vereinigen | M |
| N10 | Googles Freigabeverfahren für den Drive-Zugriff samt Datenschutzerklärung | ✅ 2026-08-19 | Vorbereitet: `drive.appdata` ist nach Kenntnisstand ein **nicht-sensibler** Scope — dann genügt „Testing → In Produktion“ ohne Prüfverfahren (die Konsole sagt es beim Veröffentlichen verbindlich). Die öffentliche Datenschutz-URL steht: `/datenschutz.html`, beim Build aus `docs/PRIVACY.md` erzeugt (eine Quelle, F7). Veröffentlicht am selben Tag: Status „In Produktion“, ohne Prüfverfahren — der Abgleich steht damit jedem Google-Konto offen | M |

## O. Bedienung & Barrierefreiheit

Seit **D-011** ist dieser Abschnitt kein Nachklapp mehr, sondern eine
Anforderung wie jede andere. Die acht Regeln G-1 bis G-8 stehen in
[`DECISIONS.md`](DECISIONS.md); hier steht, was daraus gebaut ist.

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| O1 | Vom Öffnen zum laufenden Training: ein Tap, unter zwei Sekunden | ✅ 2026-08-17 | | M |
| O2 | Kein Onboarding-Wall, keine Registrierung, kein Einwilligungslabyrinth | ✅ 2026-08-17 | Das Kennenlernen (B10) ist kein Wall: ein Tap („Ohne Fragen anfangen“) und man ist drin — geprüft im E2E | S |
| O2a | Menü: Schublade mit Gruppen, eine Seite je Punkt | ✅ 2026-08-18 | **D-025**. Menüknopf oben rechts; „Dein Stand“ / „App & Gerät“; Zurück-Geste des Systems schließt die Seite (ein History-Eintrag). Die Messung bleibt außerhalb — sie meldet sich selbst | M |
| O3 | Hell/Dunkel nach Systemeinstellung | ✅ 2026-08-17 | warmes Papier im Hellen, warmes Dunkel im Dunklen — nirgends reines Weiß oder Schwarz (G-4) | S |
| O4 | Barrierefreiheit: Kontrast, große Schrift, Screenreader, Fokusreihenfolge, reduzierte Bewegung | ✅ 2026-08-18 | „weniger Bewegung“ schaltet alles still (`prefers-reduced-motion`). **Sichtbarer Fokusring auf jedem bedienbaren Element** (`:focus-visible`, deutlich auf Dunkel), Bilder benannt oder `aria-hidden`, die Uhr der Einheit als `progressbar` mit Werten. Große Schrift: relative Einheiten, Browser-Zoom trägt. `tests/e2e/accessibility.spec.ts` | M |
| O5 | Einhändig bedienbar, alles Wichtige in der Daumenzone | ✅ 2026-08-18 | Startknopf mittig-groß, „Fertig“/„Zurück“ am unteren Rand, Abbruch unten. Die zwei häufigsten Knöpfe (Zeitwahl, „Beginnen“) auf 44 px Mindesthöhe angehoben | M |
| O6 | Haptik und Ton dezent und abschaltbar | ✅ 2026-08-18 | Ton erzeugt statt mitgeliefert, pentatonisch. **Haptik hängt am selben Schalter** — ein Schalter für beides, nicht zwei —, und nur bei den bedeutsamen Wechseln (Block zu Ende, Einheit geschafft), nicht bei jedem Wort. iOS kennt `vibrate` nicht: stiller Verzicht, kein Fehler | M |
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
| P1 | Unit-Tests für den Kern: Scheduler, Scoring, Sessionplanung — deterministisch | ✅ 2026-08-18 | 322 Tests laufen in Node, ganz ohne Browser — was zugleich D-010 belegt. Sessionplanung, Bewertung, Scheduler, Gesichtsgenerator, Messung, Profil, Reise-/Uhrfestigkeit und drei Trainingssprachen sind abgedeckt | M |
| P2 | E2E gegen den **gebauten** Stand, nicht gegen den Dev-Server | ✅ 2026-08-18 | 160 Funktionsläufe plus ein **Layout-Durchlauf über sieben Geräteprofile** (iPhone SE/14 Pro, iPad hoch/quer, Android-Tablet, Schreibtisch schmal/breit): kein seitliches Schieben, Knöpfe im Rahmen, Einprägen passt, Desktop zentriert. 144 Läufe in Chromium und im Telefonprofil, darunter eine Einheit von vorn bis hinten und der Abbruch mitten drin. Seit M4 **liest der Test ab, welches Modul kam, statt es vorherzusagen** (`tests/e2e/helpers.ts`) | M |
| P3 | CI bei jedem Push: Typecheck (App **und** Kern getrennt), Tests, Build, E2E | ✅ 2026-08-17 | | S |
| P4 | Performance: Kaltstart unter 2 s, Timer laufen ruckelfrei | ✅ 2026-08-18 | Bündel **126 KB gzip**, danach aus dem Service Worker sofort. **Größenbudget als Wächter** (`scripts/size-budget.mjs`, in der CI): bricht ab, wenn eine achtlose Abhängigkeit den Kaltstart aufbläht. `tests/e2e/performance.spec.ts`: früh bedienbar, zweites Laden offline aus dem Cache, **keine lange Aufgabe im Leerlauf** — der Hintergrund bewegt sich in CSS, nicht im Hauptthread | M |
| P5 | Uhrmanipulation darf die Engine nicht zerstören (Streak-Betrug, Intervall-Chaos) | ✅ 2026-08-18 | **D-023**. Dauern über `elapsed()` (monoton, `performance.now()`) — ein Uhrsprung verkürzt keinen Block. Die Serie übergeht jeden Zukunftstag, eine vorgestellte Uhr erzeugt keine. Das 20-Minuten-Fenster der Messung hängt an absoluter Zeit. `tests/core/travel.test.ts`. Betrug lohnt nicht: Er kostet nur die eigene gemessene Zahl (F1) — monotone Zeitquelle plus Plausibilitätsprüfung | M |
| P6 | Zeitzonenwechsel und Reisen: was ist „heute“? | ✅ 2026-08-18 | **D-023**: „heute“ ist der **lokale Kalendertag am aktuellen Standort**. Ostreise springt vor (Schutztag federt), Westreise wiederholt (zählt einmal). `tests/core/travel.test.ts`, plus Layout-Matrix über sieben Geräte | M |
| P7 | Fehlertoleranz: voller Speicher, DB-Fehler, abgelehnte Benachrichtigungsrechte | ✅ 2026-08-18 | `tests/e2e/resilience.spec.ts`. **Kein weißer Bildschirm ohne Datenbank** (privater Safari-Modus), stattdessen eine ruhige, ehrliche Zeile ganz oben mit Ausweg (P7/N2) — und kein Fehlalarm, wo gespeichert wird. Eine ganze Einheit läuft bis zur Zusammenfassung, auch wenn **jeder** Schreibvorgang wirft (voller Speicher); die Zahl kommt aus dem Kopf, nicht aus der Datenbank. Abgelehnte Benachrichtigungen: Seite bleibt heil, kein irreführender Knopf | M |
| P8 | Gerätedurchgang auf echtem iPhone und echtem Android — manche Dinge lassen sich nicht vom Buildrechner prüfen | 🟨 2026-08-18 | `docs/DEVICES.md`: Checkliste je Gerät (iPhone, iPad, Mac, Windows, Android Phone/Tablet) plus der **kostenlose** Weg, die App über eine `*.workers.dev`-Adresse auf echte Geräte zu bekommen — ohne Domain, ohne Store-Konto. Der Durchgang selbst gehört auf echte Hardware; die Layout-Matrix (P2) nimmt ihm die Größenfragen ab, offen bleibt die Safari-Engine | M |

## Q. Weg in die Stores

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| Q1 | PWA so bauen, dass TWA-Verpackung ohne Umbau möglich ist | 🟨 2026-08-17 | Kern ist browserfrei (A4), Manifest trägt schon den endgültigen Namen und ein maskable Icon. Abnahme erst beim tatsächlichen Verpacken | S |
| Q2 | Digital Asset Links vorbereiten (assetlinks.json, Signaturfingerprint) | ⬜ | | S |
| Q3 | Bubblewrap → .aab → Play Console, Signierung, Test-Track | ⬜ | Phase 2 | M |
| Q4 | Play: Datenschutzerklärung, Data-Safety-Formular, Altersfreigabe | ⬜ | | M |
| Q5 | iOS: „Zum Home-Bildschirm → als Web-App öffnen“ dokumentieren und den Weg optimieren | ✅ 2026-08-18 | `docs/INSTALL.md` und ein Hinweis **nur auf iPhone/iPad im Browser**: Dort kann Safari den Speicher nach sieben Tagen ohne Benutzung räumen — für eine App aus Terminen über Wochen der Totalverlust. Der Grund steht vor der Anleitung; anderswo steht gar nichts, weil es dort ein Angebot wäre und keine Warnung (K7). Dazu Vollbild-Metaangaben und sichere Ränder auf allen vier Seiten | S |
| Q6 | iOS App Store: Apple lehnt reine Website-Verpackungen ab — eigenständiger Mehrwert / native Funktionen nötig | ❗ | Phase 2, eigene Entscheidung. Nicht „Website in einen Container stecken“ | L |
| Q7 | Icon, Screenshots, Store-Texte — in allen Sprachen aus L2 | ⬜ | | M |

## R. Recht & Lizenzen

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| R1 | `THIRD_PARTY_LICENSES.md` ab dem ersten Paket pflegen | ✅ 2026-08-17 | Ausgeliefertes vom nur Bauenden getrennt. Im ausgelieferten Stand kein Copyleft; die LGPL-Teile (sharp über wrangler) laufen nur auf dem Buildrechner | S |
| R2 | Lizenzen für Icons, Töne und Namenslisten dokumentieren | ✅ 2026-08-18 | In `THIRD_PARTY_LICENSES.md` unter „Eigene Bestandteile“. Der größte Teil entfällt, weil ANITEW seine Inhalte **erzeugt** statt sie zu lizenzieren: Töne aus Sinusschwingungen, Gesichter aus dem Namen, alle Listen selbst zusammengestellt. Bei den Wortlisten ist die **Auswahl und Anordnung** der schutzfähige Teil — deshalb steht dort, dass sie eigene Arbeit ist | M |
| R3 | Marken- und Namensrecherche für **ANITEW** | ✅ 2026-08-18 | **Auftraggeber bestätigt: vor Projektbeginn geprüft, ANITEW ist frei und sauber.** Die eigene Vorprüfung (`docs/TRADEMARK.md`) stützt das: keine gleichnamige App, kein exakter Markentreffer, Domains ohne aktiven Auftritt. Anmerkung dort festgehalten: „anitew“ ist ein Twi-Wort (Ghana) — kein Hindernis, aber die D-001-Annahme „sagt nichts“ gilt nur außerhalb des Twi | S |
| R4 | Datenschutzerklärung — auch eine App ohne Server braucht eine | ✅ 2026-08-18 | `docs/PRIVACY.md`, plus fünf Zeilen in der App neben der Sicherung. Enthält ausdrücklich auch das Unbequeme: Damit die App aufs Gerät kommt, wird sie einmal geladen, und der Anbieter sieht dabei das, was jeder Webserver sieht. Und was sich ändern **würde**, falls Cloud-Abgleich (N7) oder KI (M) kommen | S |
| R5 | Wirkungsaussagen prüfen: keine Gesundheits- oder Heilversprechen (R-2, F7) | ✅ 2026-08-18 | `tests/core/claims.test.ts` liest `index.html`, das Manifest, `docs/STORE.md` und beide Wörterbücher. Gesperrt ist nur, was sich nicht ehrlich verwenden lässt — „klüger“ steht in der App, in dem Satz, dass Gehirnjogging das nicht bewirkt | S |

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
| **M2** | Die Engine wird echt | C1–C9, D8, E1–E7, B4 | 🟨 **2026-08-18** — Die App entscheidet begründet, was du heute trainierst (E5/E6), und plant Wiederholungen persönlich (FSRS). Offen: der Verlauf des Profils über die Zeit (E4), Interferenzprüfung zur Laufzeit (C6), B4 |
| **M3** | Ehrlichkeit | F1–F7, F2a, F2b | ✅ **2026-08-18** — Zwei getrennte Zahlen, und die große ist gemessen: Sie steht nur da, wenn ihre Spanne die Null nicht enthält. Daneben eine Seite, die sagt, was belegt ist und was nicht (F6), und Store-Texte, die jede Aussage auf ihre Deckung zurückführen (F7). **Die Release-Sperre ist gefallen** |
| **M4** | Inhalt & Spiel | D5, D9–D16, G, H, K, J | 🟨 **2026-08-18** — Fünf Module, zwei Merktechniken (D5 Major, G Palast), die Serie mit Schutztagen (K2). Offen: Achievements (K3), weitere Missionsvorlagen, H3 (verzögerter Abruf, braucht B8) |
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
