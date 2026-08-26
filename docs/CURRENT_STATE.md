# ANITEW — Current State

**Stand: 2026-08-26** (nach Runde 3 der Zweitprüfung — R3-01…R3-07, D-051…D-055 — sowie Merge von PR #79 „Fix real iPhone closed-app reminders“, dem Reifeprüfungs-Review/PR #80 und der Zweitprüfungs-Runde 2 — F-01…F-13)

Diese Datei ist die kurze, autoritative Zustandsübersicht. `docs/BACKLOG.md` und
`PROJECT_STATE.md` bleiben als historische Arbeits- und Entscheidungsprotokolle
erhalten; ältere Statusangaben dort dürfen diesem Stand nicht widersprechen.

## Produktlinie

- Produktbranch: `anitew-redesign-v2`
- Ein Push auf den Produktbranch deployt nach Production **erst nach dem
  vollen CI-Tor desselben Commits** (Deploy-Job in ci.yml mit
  `needs: check`; D-050) — inklusive VAPID-Bootstrap (idempotent, rotiert
  nie vorhandene Schlüssel) und anschließender Live-Prüfung von
  `/push/vapid-public`. deploy.yml ist nur noch der manuelle Notweg.
  Arbeits- und Feature-Branches deployen nicht.
- Runde 2 der Zweitprüfung (ChatGPT-Review, 2026-08-26) ist umgesetzt:
  Sicherungen ohne BYOK-Schlüssel/Google-Identität (D-047), Push-Endpunkt-
  Allowlist + Notiz-Ablauf (D-048), absolute 180-Tage-Sitzung (D-049),
  ehrliche Benchmark-Formulierungen („Zählunsicherheit“ statt „Zufall“),
  SW-Update-Fix für Erstbesuchs-Tabs, 401/403/429-Diagnosen, sichtbare
  Speicherfehler, DST-Lücken-Policy, Einstellungen-Seite im Core.
- Core bleibt browserfrei und deterministisch; Zeit und Plattform kommen über
  Ports/Adapter.
- Local-first bleibt die Grundregel. Netzwerk, Drive und BYOK-AI sind optionale
  Erweiterungen und keine Voraussetzung für das Kerntraining.
- Keine erfundenen Scores oder ungemessenen Wirkversprechen.

## Bereits umgesetzt

### Training und Gedächtnis-Engine

- FSRS-Zustand pro Item, Fälligkeit, Überfälligkeitsbegrenzung und deterministische
  Sessionplanung.
- Adaptive Sessionverteilung nach belastbarer Schwäche; kein Schwerpunkt aus
  Rauschen.
- Lokale FSRS-Optimierung/WASI und Langzeitsimulation.
- Unterbrechungsfeste Sessions, getrennte Trainingssprachen und getrennte
  Sprachhistorien.
- Profilhistorie aus realen Rohzählungen; keine erfundenen Profilwerte.

### Übungsmodule

- Freier Wortabruf, Namen/Gesichter, Zahlen/Major-System, Interferenz-Zwillinge,
  visuelle Details, räumliches Gedächtnis, assoziativer Hin- und Rückweg,
  Gedächtnispalast und eigene Paläste.
- Memory Missions als stabile Fact-Items mit Hotel, Conference und Coworking.
- Missionen behalten historische Hotel-IDs und Antworten unverändert; neue
  Welten nutzen eigene Personen und deterministische Bausteine.

### Living Memory

- Eigene Erinnerungen aus freiem Text.
- People Scenario: mehrere Personen und Fakten, dedupliziert als Memory Graph.
- Optionale Deadlines auf Memory-Graph-Knoten mit zusätzlicher Wiederholungslogik
  in den letzten sieben Tagen, ohne FSRS-Zustand zu verfälschen.
- Memory Graph, sichtbare Verbindungen, Forecast nach ausreichender Historie und
  korrekte Singular-/Plural-Copy.

### Eingabe und AI

- Lokale Diktier-/Texteingabe.
- Lokale Fotoauswahl bleibt ohne expliziten AI-Tap rein lokal.
- Expliziter Photo→AI→Memory-Flow mit BYOK für Gemini, Anthropic und OpenAI.
- Vor Upload wird nur ein In-Memory-JPEG-Derivat bis 1568 px erzeugt.
- AI-Vorschläge landen zuerst im editierbaren Bestätigungsdialog; Persistenz
  erfolgt erst nach ausdrücklicher Bestätigung.

### PWA, Sync und Push

- Offlinefähige PWA, Service Worker, Manifest, echte Layout-Matrix und
  Kaltstartbudgets.
- Google-Drive-Sync über Redirect-Code-Flow; kein alter Popup/GIS-Flow.
- Push-/Reminder-Infrastruktur mit ehrlicher Trennung zwischen Browsergrenzen
  und systemweiter Home-Screen-/Store-Funktionalität.
- Backup/Restore und lokale Datenhaltung.

## Aktive Release-Arbeit

### H4/H5 Memory Mission Worlds

**Fertig und in Produkt gemerged.**

- Hotel + Conference + Coworking
- DE/EN/FR/ES auf dem gemergten Missionsstand
- historische Hotel-IDs unverändert
- Desktop- und Mobile-Release-Gate grün

### M5 Trainingssprachen

Die Architektur kennt elf Sprachcodes. Trainierbar wird eine Sprache erst,
wenn **alle sieben** Inhaltsquellen vorhanden sind: Wörter, Namen, Missions,
Palast, Zwillinge, visuelle Details und Benchmark.

- Deutsch: fertig
- English: fertig
- Français: fertig
- Español: fertig
- Italiano: fertig und integriert (`tests/core/italian.test.ts` im Produktbaum).
- Português: fertig und integriert (`tests/core/portuguese.test.ts` im Produktbaum).
- Nederlands, Türkçe, العربية, 中文, 日本語: noch keine vollständigen sieben Pools;
  deshalb bewusst noch nicht als Trainingssprache freigeschaltet

### Mission-UI-Polish

- Integriert (`missionUiCopy.test.ts`, `missionLocationCopy.test.ts` im
  Produktbaum); der frühere Arbeitsbranch ist Geschichte.

## Echte offene Produktpunkte

1. **H3 verzögerte Mission-Abfrage — neu entschieden (D-044):** Mit Web
   Push/Durable Objects wäre sie heute technisch möglich, wird aber bewusst
   nicht gebaut: Der 15–45-Minuten-Slot gehört der Messung (mit eigener
   Push-Erinnerung), das Training dem FSRS-Wiedersehen. Eine dritte
   Push-Quelle nach jeder Einheit wäre Benachrichtigungsdruck ohne
   Messgewinn. Falls je: Opt-in pro Einheit, Store-Phase.

2. **Native / Stores**
   - Play-Store-Paketierung und Store-Formulare.
   - iOS-Entscheidung über nativen Mehrwert und Store-Paketierung.
   - iCloud bleibt ein späterer nativer Sync-Pfad; Drive/Backup sind bereits
     vorhanden.

3. **Reale Produktionsabnahme**
   - Kein automatischer Deploy.
   - Nach finalem Produkt-Gate: realer iPhone-Test mit geschlossener Home-Screen-
     PWA, Sperrbildschirm-Push, Google-Anmeldung, sichtbarem Namen/E-Mail,
     Logout und Core-Zurücknavigation.

4. **Weitere Trainingssprachen**
   - Optional für diesen Release. Nicht künstlich halb freischalten.
   - Jede neue Sprache muss wieder alle sieben Inhaltsquellen und eigene
     Abnahmetests erhalten.

## Als erledigt zu betrachten, obwohl ältere Backlog-Zeilen anderes sagen

Die folgenden Punkte sind durch aktuellen Code und Tests bereits umgesetzt und
sollen bei der nächsten Backlog-Konsolidierung nicht erneut als offen geplant
werden:

- B4 adaptive Sessionverteilung
- C10 lokale FSRS-Optimierung
- D12 räumliches Gedächtnis
- D13 assoziativer Rückweg
- E4 Profilhistorie
- H2 Objektposition in Missionen
- H6 adaptive Missionsschwierigkeit / Fact-Anzahl
- I2 People Scenario
- I3 Own Memory Mode / bestätigter Memory Graph
- I5 Deadline Memory
- N3 Offline-First-Launch
- O15 Profil-/Memory-Netz
- M6 expliziter BYOK Photo→AI→Memory-Flow

## Release-Reihenfolge ab diesem Stand

1. ~~Italienisch~~ / ~~Portugiesisch~~ / ~~Mission-UI-Polish~~ — integriert.
2. PR #79 (Closed-App-Push-Härtung): **gemergt am 2026-08-26** nach vollem
   Gate (596 Kern-/Worker-Tests, kompletter Playwright-Lauf; einziger roter
   Lauf war ein isoliert-grüner Last-Flake).
3. Reifeprüfungs-Härtung (Worker-Tests, Wahrheitsschicht PRIVACY/INSTALL/
   STORE/i18n, Claims-Wächter, Sprachwähler-Ehrlichkeit, Precache-Diät,
   A11y-Kleinigkeiten, D-044…D-046) → PR nach vollem Gate.
4. **Reale Produktions-/Geräteabnahme** (PRODUCTION_ACCEPTANCE.md; braucht
   echtes iPhone — der Punkt, an dem Automatisierung endet).
5. Phase-0-Mikropilot (7 Tage, BETA_PROTOCOL) und Usability-Skript
   (USABILITY_TEST.md) mit echten Menschen.
6. Native-/Store-Arbeit und zusätzliche Trainingssprachen als eigene
   Blöcke danach (Blocker je Sprache: TRANSLATION_WORKFLOW §5).
