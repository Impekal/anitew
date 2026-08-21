# Release Hardening — Paket B

Stand: 2026-08-22

Dieses Paket macht aus dem funktional vollständigen ANITEW einen Release Candidate. Es fügt keine neuen Produktversprechen hinzu, sondern verriegelt die kritischen Wege, auf denen echte Nutzerdaten oder die Nutzbarkeit nach einem Update verloren gehen könnten.

## Bestehende Browser-Gates

- **Offline / PWA:** frischer Offline-Start nach Installation sowie warmer Start aus dem Cache.
- **Backup / Restore:** Trainingshistorie lässt sich auf einen zweiten Bestand übertragen; fremde oder ungültige Dateien werden nicht still akzeptiert.
- **Drive-Sync:** erster Abgleich, Zusammenführen eines fremden Stands, Schutz fremder Dateien und stiller Folgeabgleich.
- **Resilience:** Betrieb ohne IndexedDB, voller/privater Speicher, abgelehnte Benachrichtigungen und vollständiges Löschen nur nach Rückfrage.
- **Performance:** früher benutzbarer Startknopf, Offline-Warmstart und Schutz vor langen Main-Thread-Aufgaben.
- **Install / Mobile / Layout:** iPhone-Installationshinweis, Desktop/Android-Verhalten, mobile Overflow-/Layout-Gates und Reduced Motion.
- **Vollregression:** die gesamte Chromium-E2E-Suite läuft zusätzlich zu Typecheck, Core-Tests, Build und Kaltstart-Budget.

## Neu in Paket B — echtes Datenbank-Upgrade

`tests/e2e/upgrade.spec.ts` baut vor dem App-Start einen repräsentativen IndexedDB-V1-Bestand nach und öffnet anschließend die aktuelle App darüber.

Der Test verriegelt drei Release-Regeln:

1. **Kein Datenverlust:** Settings, Sessions, Events, ItemStates und Benchmarks bleiben beim Upgrade erhalten.
2. **Keine rückwirkend erfundenen Daten:** alte ItemStates bekommen nicht plötzlich `stability`, `difficulty`, `fsrsState` oder `lastDay`, wenn diese Werte damals nie gemessen wurden.
3. **Upgrade muss booten:** die aktuelle App muss über dem Altbestand normal bis zum ersten echten Bildschirm starten.

## Release-Gate

Paket B gilt nur dann als abgeschlossen, wenn:

- Typecheck grün ist,
- alle Core-Tests grün sind,
- Production-Build grün ist,
- Kaltstart-Budget eingehalten wird,
- Chromium installiert und die vollständige E2E-Suite grün durchläuft,
- der Merge auf `anitew-redesign-v2` erfolgt ist,
- anschließend Deployment/Live-Smoke auf `https://anitew.impekaltech.workers.dev` bestätigt sind.

Die Deployment-URL und Hosting-Konfiguration werden in diesem Paket nicht geändert.
