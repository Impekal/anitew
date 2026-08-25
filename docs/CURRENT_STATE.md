# ANITEW — Current State

**Stand: 2026-08-25**

Diese Datei ist die kurze, autoritative Zustandsübersicht. `docs/BACKLOG.md` und
`PROJECT_STATE.md` bleiben als historische Arbeits- und Entscheidungsprotokolle
erhalten; ältere Statusangaben dort dürfen diesem Stand nicht widersprechen.

## Produktlinie

- Produktbranch: `anitew-redesign-v2`
- Kein automatischer Production-Deploy während Entwicklungs-/Release-Gates.
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
- Italiano: vollständig implementiert; finaler PR #74 auf Head `b108c87f237d6c06d9f1fa0d4f6d612afe9d1543`. Typecheck, Core, Build, Push/Worker, Kaltstart, Smoke, OAuth/Reset/Core, Core-Endzustände, Layout und Desktop-Vollregression sind grün; Mobile Release Gate läuft noch.
- Português: vollständig implementiert; bereinigter Head `002ee062dcfe9c3d8a83399c41241d7e7f35244a` lokal gezielt final grün: Core, Build, Kaltstartbudget und 2/2 relevante E2E. Finaler Integrations-PR folgt nach Italienisch.
- Nederlands, Türkçe, العربية, 中文, 日本語: noch keine vollständigen sieben Pools;
  deshalb bewusst noch nicht als Trainingssprache freigeschaltet

### Mission-UI-Polish

- Branch `anitew-mission-ui-world-labels`
- Head `935a7ae7df8d587a1178573150a643c7315e18d8`
- Hotel-only Copy für gemeinsame Mission-Fact-Kinds durch weltneutrale Semantik ersetzt, ohne Mission-Daten, IDs oder Scheduler zu ändern.
- Lokale gezielte Abnahme final grün: Core-i18n-Test, Build, Kaltstartbudget und Missions-E2E 1/1.
- Integration erst nach dem laufenden Sprachblock, damit keine redundanten Vollgates entstehen.

## Echte offene Produktpunkte

1. **H3 verzögerte Mission-Abfrage**
   - Ein garantiertes Wiederfragen nach 20 Minuten bei geschlossener App ist
     als reine Browser-PWA nicht zuverlässig planbar.
   - Gehört in den Native-/Store-Block; Browsercode soll dafür keine falsche
     Garantie vortäuschen.

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

1. Italienisch #74: Mobile Gate grün → merge.
2. Portugiesisch auf neuen Produkt-HEAD → ein finaler Integrations-Gate → merge.
3. Mission-UI-Polish auf neuen Produkt-HEAD → nur notwendige Integrationsprüfung → merge.
4. Docs-State-Sync integrieren.
5. Produktions-/Geräteabnahme.
6. Native-/Store-Arbeit und zusätzliche Trainingssprachen nur danach oder als
   ausdrücklich separater Release-Block.
