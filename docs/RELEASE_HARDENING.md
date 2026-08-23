# Release Hardening — ANITEW V4.2

Stand: 2026-08-23

Dieses Paket macht aus dem funktional vollständigen ANITEW V4.2 einen Release Candidate. Es fügt keine künstlichen Produktversprechen hinzu, sondern verriegelt die kritischen Wege, auf denen echte Nutzerdaten, Offline-Fähigkeit oder mobile Nutzbarkeit verloren gehen könnten.

## Automatische Release-Gates

- **Typecheck / Core:** App und DOM-freier Kern müssen typisieren; alle Core-Tests müssen grün sein.
- **Build / Budget:** Production-Build muss grün sein. Die harten Kaltstart-Budgets bleiben unverändert: JavaScript <= 165 KB gzip, CSS <= 12 KB gzip, zusammen <= 180 KB gzip.
- **Desktop-Vollregression:** die komplette Chromium-E2E-Suite läuft gegen den gebauten `dist/`-Stand inklusive Service Worker und Manifest.
- **Mobile Release Gate:** die kritischen Telefonpfade laufen zusätzlich im Pixel-7-Profil: Accessibility, Installation, Living Memory, echte Erinnerungen, Offline First Launch, Resilience, vollständige Session, Google-Drive-Sync/OAuth und Datenbank-Upgrade.
- **Layout-Matrix:** `layout.spec.ts` läuft über iPhone SE, randloses iPhone, iPad hoch und quer, Android-Tablet sowie schmalen und breiten Desktop.
- **Flakes:** ein Test, der nur im Retry grün wird, wird vor Freigabe untersucht; ein Retry ist kein Ersatz für eine erklärte Ursache.

## Daten- und PWA-Härtung

- **Offline / PWA:** frischer Offline-Start nach Installation sowie warmer Start aus dem Cache.
- **Backup / Restore:** Trainingshistorie lässt sich auf einen zweiten Bestand übertragen; fremde oder ungültige Dateien werden nicht still akzeptiert.
- **Drive-Sync:** Full-page Google OAuth, erster Abgleich, Zusammenführen eines fremden Stands, Schutz fremder Dateien, stiller Folgeabgleich und Abmelden.
- **Resilience:** Betrieb ohne IndexedDB, voller/privater Speicher, abgelehnte Benachrichtigungen und vollständiges Löschen nur nach Rückfrage.
- **Upgrade:** ein repräsentativer IndexedDB-V1-Bestand öffnet in der aktuellen App ohne Datenverlust und ohne rückwirkend erfundene FSRS-Werte.
- **Performance:** früher benutzbarer Startknopf, Offline-Warmstart und Schutz vor langen Main-Thread-Aufgaben.

## Was Automation ehrlich nicht beweisen kann

Die iPhone-Profile der Layoutmatrix laufen absichtlich auf Chromium. Sie beweisen Größe, Ausrichtung, sichere Ränder und horizontale Stabilität, aber nicht die Safari/WebKit-Engine.

Vor dem Produktionsdeploy bleiben deshalb als **USER ACTIONS AT END** auf einem echten iPhone:

1. Ton nach dem ersten echten Tap entsperrt und Sound-off bleibt still.
2. Installierte Home-Screen-PWA startet und bleibt offline benutzbar.
3. Google-Drive-Synchronisierung öffnet Full-page OAuth, kehrt in die installierte App zurück und synchronisiert erfolgreich; Abmelden und Kontowechsel funktionieren.
4. Native Safari-Datei-/Zeiteingaben sind bedienbar und nichts wird von Safe Areas abgeschnitten.

## Release-Regel

V4.2 gilt erst dann als automatischer Release Candidate, wenn alle oben genannten CI-Gates auf `anitew-v4-2-living-memory` grün sind. Während des Hardening wird **nicht** auf `anitew-redesign-v2` gemergt und **nicht** aus ChatGPT in Produktion deployt.

Der Produktionsdeploy erfolgt ausschließlich lokal durch den Nutzer nach dem echten iPhone-Endcheck. Die Hosting-Konfiguration und Produktions-URL werden durch dieses Hardening nicht verändert.
