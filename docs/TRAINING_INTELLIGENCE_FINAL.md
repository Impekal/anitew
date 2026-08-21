# Training Intelligence Final — Paket A

Stand: 2026-08-22

Dieses Paket bündelt die letzten Intelligenzbausteine vor dem Release-Hardening. Es erfindet keine neue Metrik und ersetzt keine bestehende Scheduler-Wahrheit.

## Abgeschlossen

- **C3 — persönliche Vergessensprognose:** `memoryForgettingForecasts()` bleibt unterhalb der Mindesthistorie still und zeigt danach die aus dem persönlichen FSRS-Zustand abgeleitete Zeit bis zur 90-%-Schwelle. Die Prognose ist im Detail einer gespeicherten Erinnerung sichtbar.
- **E4 — Profilverlauf:** tägliche Snapshots speichern ausschließlich Rohzählungen (`chances`, `lost`) je Trainingssprache. Die Profilseite zeigt zwei belastbare Messstände mit ihren Spannen, ohne daraus künstlich „verbessert/verschlechtert“ abzuleiten.
- **H2 — Missions-Ort:** Missionen enthalten eine eigene Orts-/Positionsfrage in der Oberfläche; der Ort ist ein echter Bestandteil des Abrufs und keine Dekoration.
- **H6 — adaptive Missionsschwierigkeit:** die Missionsschwierigkeit verändert die Einprägezeit konservativ, ohne Fakten zu entfernen und ohne das feste Session-Zeitbudget zu verletzen.
- **C6 — Runtime-Interferenzschutz:** neue Wortvorräte werden zur Laufzeit deterministisch von Fast-Dubletten bereinigt; kuratierte Zwillingsaufgaben bleiben als bewusstes Interferenztraining erhalten.
- **O7 — kognitive Last:** schwere Module werden nicht direkt hintereinander geplant, wenn eine leichte Alternative verfügbar ist. Gibt es keine Alternative, wird kein künstlicher Block erfunden.

## Produktverdrahtung

- `MemoryPanel` lädt echte Due-/FSRS-Zustände und zeigt C3 nur bei belastbarer persönlicher Historie.
- `ProfilePanel` + `useProfileHistory` persistieren E4 über den bestehenden Settings-/Backup-/Drive-Pfad; kein zweiter Datensilo.
- Die App importiert `planSession` aus dem adaptiven Kern, sodass H6 und O7 im echten Sessionstart wirken.
- `wordPool()` wendet C6 bereits beim Erzeugen der Trainingsvorräte an.

## Gate

`tests/core/trainingIntelligenceFinal.test.ts` verriegelt C3, E4, C6, H6 und O7 als gemeinsames Paket. H2 bleibt zusätzlich durch `tests/core/missionLocationCopy.test.ts` abgedeckt.

Paket A gilt erst als abgeschlossen, wenn Typecheck, alle Core-Tests, Build, Kaltstart-Budget und die vollständige Chromium-E2E-Suite grün sind.
