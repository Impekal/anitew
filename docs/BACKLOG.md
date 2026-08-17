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

---

## A. Fundament & Projektsetup

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| A1 | Stack festlegen und begründen | ❗ | Vorschlag: React 18 + TypeScript (strict) + Vite 6 + vite-plugin-pwa + Dexie/IndexedDB — wie RReader, bewährt, permissiv lizenziert | S |
| A2 | Repo-Grundgerüst, Ordnerstruktur, Lint/Format, tsconfig strict | ⬜ | | S |
| A3 | PWA-Grundlage: Manifest, Service Worker, Offline-Start, Update-Strategie | ⬜ | erster Start nach Installation muss offline funktionieren | M |
| A4 | **Architekturregel: `src/core/` ist reines TypeScript** — keine DOM-, React- oder Browser-API-Zugriffe | ⬜ | Engine, Scheduler, Scoring, Profil, Sessionplanung leben hier. Voraussetzung für R-3 und für Tests ohne Browser | M |
| A5 | Plattform-Adapter-Schicht: Storage, Uhr/Timer, Benachrichtigungen, Audio, Datei-Export | ⬜ | eine Schnittstelle, austauschbare Implementierung (Web heute, TWA/iOS später) | M |
| A6 | Datenschicht: Dexie-Schema **mit Migrationen ab Version 1** | ⬜ | Trainingshistorie ist nicht wiederherstellbar — ein Schemafehler kostet später echte Nutzerdaten | M |
| A7 | Deployment: Auto-Build bei Push, statisches Hosting, kein Backend | ⬜ | Cloudflare Pages/Workers wie RReader; Build muss auf jedem statischen Host laufen | S |
| A8 | Projektgedächtnis anlegen: `PROJECT_STATE.md`, `docs/DECISIONS.md`, diese Liste | 🟨 | BACKLOG steht; die anderen beiden fehlen noch | S |
| A9 | App-Identität: Icon, Splash, Theme-Farben, Statusleiste, Name im Manifest | ⬜ | hängt an S1 (Name) | S |
| A10 | Kein Tracking, keine Analytics-Dritte. Nutzungsstatistik nur lokal auf dem Gerät | ⬜ | | S |

## B. Die 5-Minuten-Session

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| B1 | Startbildschirm: **TODAY'S MEMORY CHALLENGE · 5:00** — ein Knopf, sonst nichts | ⬜ | Weg von „App öffnen“ bis „Training läuft“: höchstens ein Tap | S |
| B2 | Session-Runner: Blockfolge mit hartem Gesamtzeitbudget | ⬜ | die 5 Minuten sind eine Garantie, keine Schätzung | M |
| B3 | Blockstruktur v1: Focus 60 s · Encode 60 s · Recall 90 s · Working Memory 60 s · Spaced Recall 30 s | ⬜ | genau die Aufteilung aus dem Gespräch, als Startpunkt | M |
| B4 | Blocklängen adaptiv umverteilbar (Engine entscheidet), Gesamtzeit bleibt fix | ⬜ | „90 Sekunden Zahlen-Encoding, 60 Sekunden Namen-Recall“ | M |
| B5 | Session ist unterbrechungsfest: App-Wechsel, Anruf, Bildschirm aus, Absturz | ⬜ | Zustand nach jedem Item persistieren, nicht erst am Ende | M |
| B6 | Abschlussbildschirm mit ehrlichen Zahlen (siehe F) | ⬜ | | S |
| B7 | Weitermachen nach der Tages-Challenge: freies Training, zählt für Fortschritt, aber ohne Druck | ⬜ | „Man kann natürlich mehr wählen“ | S |
| B8 | Tageserinnerung als **lokale** Benachrichtigung, opt-in, feste Uhrzeit wählbar | ⬜ | kein Server-Push, kein Konto | M |
| B9 | Session-Log: jede Antwort mit Item-ID, richtig/falsch, Latenz, Kontext | ⬜ | Rohdatenbasis für C, E und F — ohne sie ist alles andere geraten | M |

## C. Memory Engine — Spacing & Retrieval

Das wissenschaftlich belastbare Fundament: verteiltes Wiederholen plus
Abruftraining. Hier entscheidet sich, ob die App wirkt.

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| C1 | Item-Modell definieren: was genau ist ein „Gedächtnis-Item“, wie sieht sein Zustand aus | ⬜ | trägt Sprache, Typ, Herkunft (App-Inhalt vs. eigener Inhalt), Schwierigkeit, Stabilität | M |
| C2 | Scheduler mit Zustand pro Item (Stabilität + Schwierigkeit), nicht mit festen Intervallen | ❗ | FSRS-artig; Algorithmus **und dessen Lizenz** vor der Umsetzung prüfen (S4) | L |
| C3 | Persönliche Vergessenskurve schätzen: „Diese Information vergisst DU wahrscheinlich in ~5 Tagen“ | ⬜ | Kern des Gesprächs. Zielretention einstellbar (z. B. 90 %) | L |
| C4 | Kaltstart: sinnvolle erste Intervalle ohne jede Historie | ⬜ | | M |
| C5 | **Abruf, nicht Wiedererkennen**: freie Eingabe als Standard, Multiple Choice nur wo unvermeidbar | ⬜ | Wiedererkennen fühlt sich leichter an und trainiert weniger | M |
| C6 | Ähnliche Items nicht in derselben Session (Interferenz vermeiden) | ⬜ | | M |
| C7 | Überfälligkeitsdruck begrenzen: nie ein Berg von 800 fälligen Items nach einer Pause | ⬜ | genau hier steigen Nutzer bei Karteikarten-Apps aus | M |
| C8 | Engine deterministisch und seed-basiert, damit testbar | ⬜ | folgt aus A4 | S |
| C9 | Simulator: synthetische Nutzer über 90 Tage, bevor echte Nutzer da sind | ⬜ | prüft, ob der Scheduler tut, was er soll — billiger als es an Menschen zu merken | M |

## D. Übungsmodule

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| D1 | Einheitliche Modulschnittstelle: Aufgabe rein, Score + Rohdaten raus | ⬜ | ohne sie wird jedes neue Modul ein Sonderfall | M |
| D2 | Schwierigkeit adaptiv pro Modul, Zielkorridor um ~80 % Trefferquote | ⬜ | zu leicht = langweilig, zu schwer = Frust; beides bricht die Streak | M |
| D3 | **Focus** — Ablenkungen ignorieren, kurze Aufmerksamkeitsschulung | ⬜ | 0:00–1:00 der Session | M |
| D4 | **Encode** — 8 Bilder / Wörter / Personen / Orte merken | ⬜ | | M |
| D5 | **Merktechniken werden beigebracht**, nicht nur abgefragt: Verknüpfung, Story-Methode, Major-System, Loci | ⬜ | „nicht stumpf auswendig lernen — die App bringt automatisch Merktechniken bei“. Das ist der Unterschied zu jeder Brain-Game-App | L |
| D6 | **Recall** — freier Abruf ohne Hinweise | ⬜ | | M |
| D7 | **Working Memory** — behalten und gleichzeitig manipulieren (N-Back-artig) | ⬜ | | M |
| D8 | **Spaced Recall** — etwas von gestern / vor 3 Tagen / letzter Woche | ⬜ | zieht seine Items direkt aus C | M |
| D9 | **Namen & Gesichter** | ⬜ | schwächster Bereich im Beispielprofil, also wichtig | M |
| D10 | **Zahlen** — Ziffernfolgen, Jahreszahlen, PINs, Telefonnummern | ⬜ | | M |
| D11 | **Wörter & Listen** | ⬜ | | S |
| D12 | **Räumlich** | ⬜ | | M |
| D13 | **Assoziativ** — „Meet 5 people“: Person + Land + Hobby + Stadt, später quer abgefragt | ⬜ | „Wie hieß die Person aus Indien?“ / „Wer spielte Gitarre?“ — trainiert, was im Alltag wirklich vorkommt | L |
| D14 | Bild- und Gesichtsmaterial beschaffen: lizenzfrei, offline, klein genug fürs Bundle | ❗ | eigener Punkt, weil es ein echtes Problem ist (S5) | M |

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
| F2 | Benchmark-Test: standardisiert, unverändert, nicht trainiert, alle N Tage | ❗ | Design ist die schwierigste offene Frage des Projekts (S6) | L |
| F3 | „Memory Strength +18 %“ nur aus dem Benchmark, mit Antippen → was genau gemessen wurde | ⬜ | | M |
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
| J2 | Jeder Modus ist ein Zeitbudget-Profil derselben Engine, kein eigener Code | ⬜ | folgt aus B2/B4 | S |
| J3 | Auswahl in einem Tap direkt vom Startbildschirm | ⬜ | | S |
| J4 | Zählt der 60-Sekunden-Modus für die Streak? | ❗ | Ja wäre ehrlicher gegenüber schlechten Tagen; nein wäre strenger. Entscheiden (S8) | S |

## K. Gamification

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| K1 | XP und Level — an **Abrufleistung** gekoppelt, nicht an verbrachte Zeit | ⬜ | sonst belohnt die App Anwesenheit statt Lernen | M |
| K2 | Streak inklusive Schutztag/Freeze | ⬜ | Sucht ja, Schuldgefühl nein — ein verpasster Tag darf nicht 60 Tage vernichten | M |
| K3 | Achievements | ⬜ | | M |
| K4 | Daily Missions und Memory Quests | ⬜ | | M |
| K5 | Persönliche Rekorde | ⬜ | | S |
| K6 | Unlockable Worlds — rein kosmetisch | ⬜ | | M |
| K7 | **Anti-Dark-Pattern-Regel**: keine künstliche Verknappung, kein Angstdruck, keine erfundenen Zahlen | ⬜ | „nicht mit billigen Belohnungen“. Gehört als Regel in DECISIONS.md, nicht nur hierher | S |
| K8 | Die wichtigste Belohnung ist F5: der Nutzer merkt selbst, dass er besser wird | ⬜ | | — |

## L. Mehrsprachigkeit

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| L1 | i18n-Grundgerüst, Sprachwechsel zur Laufzeit, von Anfang an | ⬜ | nachträglich eingezogen kostet es das Zehnfache | M |
| L2 | Elf Sprachen: DE · EN · FR · ES · IT · PT · NL · TR · AR · ZH · JA | ⬜ | | L |
| L3 | RTL für Arabisch — Layout, nicht nur Text | ⬜ | | M |
| L4 | CJK: Schriftschnitte, Zeilenumbruch, Eingabemethoden bei freiem Abruf (C5) | ⬜ | freier Abruf auf Japanisch ist ein eigenes Problem | M |
| L5 | Engine bleibt sprachunabhängig; Sprache ist ein Attribut am Item | ⬜ | Voraussetzung für L7 | M |
| L6 | Inhaltspools je Sprache: Wörter, Namen, Orte — kulturell passend, nicht durchübersetzt | ⬜ | ein deutscher Namenspool auf Japanisch trainiert nichts Sinnvolles | L |
| L7 | Trainingssprache getrennt von Oberflächensprache: „Train your memory in Japanese today“ | ⬜ | Gedächtnis- und Sprachtraining zugleich — ein echtes Alleinstellungsmerkmal | M |
| L8 | Übersetzungsprozess und Ausgangssprache festlegen | ❗ | (S7) | S |

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
| N1 | Alles lokal in IndexedDB, kein Konto, keine Anmeldung | ⬜ | | S |
| N2 | Export/Backup als Datei, Import auf einem neuen Gerät | ⬜ | ohne Server ist das der einzige Weg, Fortschritt nicht zu verlieren | M |
| N3 | Vollständig offline nutzbar, auch beim allerersten Start nach der Installation | ⬜ | | M |
| N4 | Löschen: einzelne Items, eigene Inhalte, alles | ⬜ | | S |
| N5 | Speicherbedarf im Blick behalten (Bilder!) und dem Nutzer zeigen | ⬜ | | S |
| N6 | Sync zwischen Geräten | ❗ | (S9) — entweder Ende-zu-Ende-verschlüsselt oder gar nicht | L |

## O. Bedienung & Barrierefreiheit

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| O1 | Vom Öffnen zum laufenden Training: ein Tap, unter zwei Sekunden | ⬜ | „super technisch und einfach und nicht anstrengend“ | M |
| O2 | Kein Onboarding-Wall, keine Registrierung, kein Einwilligungslabyrinth | ⬜ | | S |
| O3 | Hell/Dunkel nach Systemeinstellung | ⬜ | | S |
| O4 | Barrierefreiheit: Kontrast, große Schrift, Screenreader, Fokusreihenfolge, reduzierte Bewegung | ⬜ | | M |
| O5 | Einhändig bedienbar, alles Wichtige in der Daumenzone | ⬜ | | M |
| O6 | Haptik und Ton dezent und abschaltbar | ⬜ | | S |
| O7 | Nie zwei harte Blöcke hintereinander — Anstrengung dosieren | ⬜ | „angenehm, nicht anstrengend“ ist eine Anforderung an die Sessionplanung, nicht an die Grafik | M |

## P. Qualität

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| P1 | Unit-Tests für den Kern: Scheduler, Scoring, Sessionplanung — deterministisch | ⬜ | möglich, weil A4 den Kern browserfrei hält | M |
| P2 | E2E-Test: eine vollständige 5-Minuten-Session durchlaufen | ⬜ | Playwright | M |
| P3 | CI bei jedem Push: Typecheck, Tests, Build | ⬜ | | S |
| P4 | Performance: Kaltstart unter 2 s, Timer laufen ruckelfrei | ⬜ | | M |
| P5 | Uhrmanipulation darf die Engine nicht zerstören (Streak-Betrug, Intervall-Chaos) | ⬜ | monotone Zeitquelle plus Plausibilitätsprüfung | M |
| P6 | Zeitzonenwechsel und Reisen: was ist „heute“? | ⬜ | | M |
| P7 | Fehlertoleranz: voller Speicher, DB-Fehler, abgelehnte Benachrichtigungsrechte | ⬜ | | M |
| P8 | Gerätedurchgang auf echtem iPhone und echtem Android — manche Dinge lassen sich nicht vom Buildrechner prüfen | ⬜ | eigene Datei wie in RReader | M |

## Q. Weg in die Stores

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| Q1 | PWA so bauen, dass TWA-Verpackung ohne Umbau möglich ist | ⬜ | ist R-3 / A4 / A5 — hier nur die Abnahme | S |
| Q2 | Digital Asset Links vorbereiten (assetlinks.json, Signaturfingerprint) | ⬜ | | S |
| Q3 | Bubblewrap → .aab → Play Console, Signierung, Test-Track | ⬜ | Phase 2 | M |
| Q4 | Play: Datenschutzerklärung, Data-Safety-Formular, Altersfreigabe | ⬜ | | M |
| Q5 | iOS: „Zum Home-Bildschirm → als Web-App öffnen“ dokumentieren und den Weg optimieren | ⬜ | funktioniert heute schon und ist Phase 1 | S |
| Q6 | iOS App Store: Apple lehnt reine Website-Verpackungen ab — eigenständiger Mehrwert / native Funktionen nötig | ❗ | Phase 2, eigene Entscheidung. Nicht „Website in einen Container stecken“ | L |
| Q7 | Icon, Screenshots, Store-Texte — in allen Sprachen aus L2 | ⬜ | | M |

## R. Recht & Lizenzen

| # | Aufgabe | Status | Notizen | Aufwand |
|---|---|---|---|---|
| R1 | `THIRD_PARTY_LICENSES.md` ab dem ersten Paket pflegen | ⬜ | wie in RReader | S |
| R2 | Lizenzen für Bilder, Gesichter, Töne, Namenslisten dokumentieren | ⬜ | hängt an D14 | M |
| R3 | Namens- und Markenrecherche für den Produktnamen | ❗ | vor dem ersten Icon (S1) | S |
| R4 | Datenschutzerklärung — auch eine App ohne Server braucht eine | ⬜ | | S |
| R5 | Wirkungsaussagen prüfen: keine Gesundheits- oder Heilversprechen (R-2, F7) | ⬜ | betrifft App-Texte und Store-Beschreibung gleichermaßen | S |

## S. Offene Entscheidungen  ❗

Diese Punkte kann niemand außer dir entscheiden. Sie blockieren jeweils
konkrete Aufgaben.

| # | Frage | Blockiert |
|---|---|---|
| S1 | **Produktname**: ANITEW · MEMORA · MNEMO · RECALL · MEMORY QUEST | A9, R3, Q7 |
| S2 | **Geld**: dauerhaft kostenlos? Spende? Pro-Funktionen? Und wenn ja, welche dürfen es sein, ohne K7 zu verletzen | K, Q4 |
| S3 | **Stack** bestätigen (Vorschlag in A1) | A2 ff. |
| S4 | **Scheduler-Algorithmus** und dessen Lizenz | C2, C3 |
| S5 | **Bildmaterial**: woher kommen Gesichter, Objekte, Orte — lizenzfrei, offline, klein | D14, R2 |
| S6 | **Benchmark-Design**: was genau ist die Zahl hinter „+18 %“, und wie oft wird sie gemessen | F2, F3 |
| S7 | **Ausgangssprache** für Übersetzungen: Deutsch oder Englisch | L8 |
| S8 | **Streak-Regeln**: zählt der 60-Sekunden-Modus, gibt es Schutztage | J4, K2 |
| S9 | **Sync**: nie, oder später Ende-zu-Ende-verschlüsselt | N6 |

---

## Reihenfolge — Meilensteine

| | Meilenstein | Inhalt | Fertig, wenn |
|---|---|---|---|
| **M0** | Fundament | A1–A8, S1/S3 entschieden | Push baut, App installiert sich, `src/core/` läuft ohne Browser |
| **M1** | Walking Skeleton | B1–B3, B5, B9, D1, zwei Module (D4 Encode + D6 Recall), N1 | Eine echte 5-Minuten-Session lässt sich täglich durchlaufen, Ergebnisse bleiben erhalten |
| **M2** | Die Engine wird echt | C1–C9, D8, E1–E7, B4 | Die App entscheidet begründet, was du heute trainierst, und plant Wiederholungen persönlich |
| **M3** | Ehrlichkeit | F1–F7 | Es gibt zwei getrennte Zahlen, und die große Prozentzahl ist gemessen. **Vorher kein öffentlicher Release** |
| **M4** | Inhalt & Spiel | D5, D9–D13, G, H, K, J | Es macht Spaß, und der Vorrat geht nicht aus |
| **M5** | Sprachen | L1–L8 | Man kann heute auf Deutsch und morgen auf Japanisch trainieren |
| **M6** | Echtes Leben | I, M | Eigene Präsentation rein, Wiederholungsplan raus |
| **M7** | Stores | Q, R | .aab im Play-Track; iOS-Weg entschieden |

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

1. S1 und S3 entscheiden (Name, Stack) — beides blockiert M0.
2. M0 umsetzen: Gerüst, PWA, `src/core/`, Datenschicht mit Migrationen, CI.
3. M1 umsetzen: eine echte, durchlaufbare 5-Minuten-Session mit zwei Modulen.
   Ab hier kannst du sie selbst täglich benutzen — und alles Weitere an echter
   Erfahrung statt an Vermutungen ausrichten.
