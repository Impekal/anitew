# ANITEW — Production Acceptance

Diese Checkliste wird **erst nach einem vollständig grünen Produkt-Gate und einem
bewussten Production-Deploy** ausgeführt. Sie ersetzt keine CI; sie prüft genau
die Dinge, die Browser-Simulation und GitHub Runner nicht beweisen können.

## Voraussetzungen

- Produktbranch ist der beabsichtigte, vollständig grün getestete Commit.
- Kein ungeprüfter Commit wurde nach dem Gate hinzugefügt.
- Production-Deploy wurde bewusst ausgelöst und die ausgelieferte Version ist
  dieser Commit.
- Testgerät: echtes iPhone/iPad mit installierter ANITEW Home-Screen-PWA.
- Für Push und Google-Anmeldung besteht Netz; das Kerntraining wird zusätzlich
  offline geprüft.

## A. Offline / Cold Start

1. ANITEW einmal online öffnen und vollständig laden.
2. PWA schließen.
3. Netz am Gerät deaktivieren.
4. ANITEW vom Home Screen starten.
5. Erwartet:
   - App startet ohne Netzwerkfehler.
   - Startscreen und Kernnavigation sind benutzbar.
   - Eine reine Kern-Trainingseinheit kann gestartet werden.
   - Kein AI-/Drive-/Push-Feature blockiert den Kernstart.

## B. Push bei geschlossener PWA

1. Netz wieder aktivieren.
2. In ANITEW Systembenachrichtigungen aktivieren und erlauben.
3. Eine reale Reminder-Zeit konfigurieren.
4. Home-Screen-PWA vollständig schließen.
5. iPhone sperren.
6. Erwartet:
   - Benachrichtigung erscheint als echte Systemmitteilung auf dem
     Sperrbildschirm.
   - Benachrichtigung enthält keine Trainings- oder Gedächtnisinhalte.
7. Benachrichtigung antippen.
8. Erwartet:
   - ANITEW öffnet sauber.
   - Kein leerer/weißer Zwischenzustand bleibt hängen.

## C. Google / Drive Anmeldung

1. In den Sync-/Drive-Bereich gehen.
2. Google-Anmeldung auslösen.
3. OAuth im realen Safari-/PWA-Kontext abschließen.
4. Zu ANITEW zurückkehren.
5. Erwartet:
   - Redirect kommt zuverlässig zurück.
   - Nutzername und E-Mail werden **sofort** sichtbar, ohne manuelles Reload.
   - Kein alter GIS-/Popup-Flow erscheint.
   - Ein erster Sync kann bewusst gestartet werden.
6. Logout auslösen.
7. Erwartet:
   - Google-Zustand verschwindet sichtbar.
   - Lokale Trainings-/Memory-Daten bleiben erhalten.
   - Kerntraining bleibt ohne Google vollständig benutzbar.

## D. Core Navigation / System Back

1. Vom Startscreen mehrere tiefe Seiten nacheinander öffnen, unter anderem
   Memory, Profil und Einstellungen/Sync.
2. Je Seite die iOS-Zurückgeste bzw. Browser-/System-Zurücknavigation verwenden.
3. Erwartet:
   - genau eine Ebene zurück.
   - kein unbeabsichtigtes Verlassen der App.
   - kein leerer Menü-/Overlay-Zustand.
4. Danach normale UI-Zurückbuttons prüfen.

## E. Memory / Living Memory

1. Eine eigene Erinnerung als Text erfassen.
2. Bestätigungsdialog prüfen und bewusst bestätigen.
3. Erwartet:
   - nichts landet vor Bestätigung im Memory Graph.
   - nach Bestätigung sind Erinnerungen/Verbindungen sichtbar.
4. Eine Deadline setzen und erneut öffnen.
5. Erwartet:
   - Deadline bleibt erhalten.
   - Zieltag und Uhrzeit werden korrekt dargestellt.
6. Foto auswählen, aber **nicht** analysieren.
7. Erwartet:
   - Foto bleibt lokale Referenz.
   - kein Netzwerkrequest wird durch Auswahl allein ausgelöst.
8. Mit eigenem BYOK-Schlüssel bei **Gemini, Anthropic oder OpenAI** (die drei Foto-Anbieter) `Foto auswerten` auslösen.
9. Erwartet:
   - Vorschläge erscheinen editierbar.
   - Persistenz erst nach derselben Bestätigung wie bei Texteingabe.

## F. Trainingssprachen

Für jede im Produkt tatsächlich freigeschaltete Trainingssprache einmal:

- Trainingssprache auswählen, UI-Sprache unverändert lassen.
- kurze Einheit starten.
- Erwartet:
  - Inhalte stammen aus der gewählten Trainingssprache.
  - UI bleibt in der gewählten Oberflächensprache.
  - Wechsel zurück verliert keine bestehende Sprachhistorie.

Sprachen ohne alle sieben Inhaltsquellen dürfen **nicht** als trainierbar
angeboten werden.

## G. Mission Worlds

Mehrere kurze Missionsrunden starten, bis Hotel, Conference und Coworking
sichtbar waren.

Erwartet:

- keine technische Weltkennung oder Suffixe sichtbar.
- Person/Fakten gehören erkennbar zu einer gemeinsamen Szene.
- UI verwendet keine Hotel-only-Bezeichnung für Conference/Coworking.
- Rückfragen nennen den Personenanker und bleiben semantisch zur Szene passend.

## H. Abschlusskriterium

Production gilt erst als abgenommen, wenn:

- alle Punkte A–G ohne reproduzierbaren Fehler durchlaufen,
- der getestete Production-Commit dokumentiert ist,
- keine lokale Datenmigration Daten verloren hat,
- kein Kernfeature Netz, Konto oder AI-Key voraussetzt.

Ein Fehler in Push/OAuth auf dem echten iPhone wird **nicht** durch grüne
Playwright-Tests überstimmt. Umgekehrt werden lokale UX-Eindrücke nicht benutzt,
um einen roten reproduzierbaren Core-/CI-Test zu ignorieren.
