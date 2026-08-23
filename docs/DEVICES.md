# Gerätedurchgang — ANITEW auf echten Geräten

**Stand: 2026-08-24** · Backlog P6, P8 · Produktion:
`https://anitew.impekaltech.workers.dev`

Automatische Tests prüfen Chromium, Layout, Offlinepfade, Push-Requests und
Worker-Konfiguration. Echte Safari-/iOS-Eigenschaften bleiben Hardwaretests.
Ein emuliertes iPhone ist dafür kein Ersatz.

## iPhone — Release-Gate

ANITEW aus Safari **zum Home-Bildschirm hinzufügen** und alle folgenden Punkte
in der installierten PWA prüfen:

- [ ] Startet direkt im vorgesehenen Dunkelmodus; Inhalte liegen unter der
      Status-/Safe-Area und lassen sich nicht seitlich schieben.
- [ ] Ton kommt nach dem ersten echten Tippen; Ton aus bleibt still.
- [ ] Eine Einheit lässt sich vollständig spielen; native Zahlen-/Zeitfelder
      sind bedienbar.
- [ ] Flugmodus → PWA schließen → erneut öffnen: Training und lokale Daten sind
      weiter verfügbar.
- [ ] Core: „Menü schließen“ kollidiert nicht mit Google-Name/E-Mail.
- [ ] Core → Unterseite → sichtbarer Zurück-Knopf führt zurück in den **Core**.
- [ ] Core → Unterseite → iOS-Zurückgeste führt ebenfalls in den **Core**.
- [ ] Google Drive: „Synchronisieren“ öffnet die Google-Anmeldung als
      Full-page-Redirect, kehrt zu ANITEW zurück und zeigt Name/E-Mail sofort,
      ohne dass die PWA erst geschlossen werden muss.
- [ ] Google-Konto trennen und erneut verbinden funktioniert.
- [ ] Sicherung speichern/einlesen funktioniert mit der nativen Dateiauswahl.

### Web Push — geschlossene PWA

Dieser Punkt ist **releasekritisch** und kann nicht durch Chromium-CI ersetzt
werden:

1. In Core → „Erinnerung“ auf **Benachrichtigungen erlauben** tippen.
2. iOS-Systemabfrage erlauben.
3. Eine Uhrzeit wenige Minuten in der Zukunft einstellen und speichern.
4. Prüfen, dass ANITEW ausdrücklich sagt, dass die Systemmitteilung auch bei
   geschlossener App ankommt.
5. ANITEW aus dem App-Umschalter vollständig schließen.
6. iPhone sperren und ANITEW **nicht** erneut öffnen.
7. Zur gewählten Uhrzeit muss eine ANITEW-Systemmitteilung auf dem
   Sperrbildschirm/Notification Center erscheinen.
8. Mitteilung antippen → ANITEW öffnet sich.
9. Danach „Keine Erinnerung“ wählen und einen weiteren Termin abwarten bzw.
   neu setzen: Der ausgeschaltete Tages-Push darf nicht weiterlaufen.
10. „Neu anfangen“ durchführen: danach darf die alte Push-Adresse ebenfalls
    keine Erinnerung mehr erzeugen.

Wenn Schritt 7 nicht funktioniert, ist Web Push in V4.2 **nicht abgenommen**,
auch wenn alle automatischen Tests grün sind.

## iPad

Wie iPhone. Zusätzlich quer prüfen: Spalte bleibt mittig und Safe Areas halten.
Web Push ebenfalls aus der zum Home-Bildschirm hinzugefügten App testen.

## Android

- Installation als PWA/Vollbild.
- Offline-Neustart.
- Google-Abgleich.
- Web Push bei geschlossener PWA.
- Zahlen-/Eingabefelder und Hoch-/Querformat.

## Desktop

Safari sowie Chrome/Edge: Spalte zentriert, Tastaturbedienung, Ton, alle
Core-Seiten. Wo der Browser Web Push unterstützt, darf die Reminder-Seite
„geschlossen“ anzeigen; andernfalls muss sie den eingeschränkten Pfad ehrlich
benennen.

## Was zurückkommt

Für ein Gerät genügt „läuft sauber“ oder eine kurze Angabe aus Gerät,
Browser/installierter PWA, Bildschirm und beobachtetem Fehler. Bei visuellen
Fehlern ist ein Screenshot am hilfreichsten.

Alles Reproduzierbare wird anschließend als automatischer Regressionstest
festgehalten. Safari-Engine, iOS-Push-Zustellung, native Dateiauswahl und der
Google-Redirect in der installierten PWA bleiben dennoch echte Hardware-Gates.
