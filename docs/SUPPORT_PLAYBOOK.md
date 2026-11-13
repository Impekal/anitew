# ANITEW Support-Playbook

**Stand: 2026-08-25**

Ziel: Supportfälle reproduzierbar lösen, ohne persönliche Gedächtnisinhalte einzusammeln und ohne kostenpflichtigen Fehlerdienst.

## Bei einem Problem zuerst fragen

1. Gerät und Betriebssystem.
2. Browser oder installierte ANITEW-App.
3. Welcher sichtbare Schritt hat nicht funktioniert?
4. Tritt es nach erneutem Öffnen wieder auf?
5. Betrifft es nur eine Online-Funktion oder auch das lokale Training?

Keine Erinnerungstexte, Fotos, API-Schlüssel oder Google-Tokens anfordern.

## Diagnosebericht

Unter **Sicherung → Support & Beta → Diagnosebericht speichern** kann der Nutzer freiwillig einen technischen Bericht erzeugen.

Er enthält:

- ANITEW-Version, Commit und Build-Zeit,
- Sprache, Online-/Standalone-Status,
- Service-Worker-/Notification-/Storage-Status,
- bis zu 20 lokale technische Fehlerereignisse als Fehlerart + Chunk/Position,
- keine Fehlermeldung oder Stacktrace,
- keine vollständigen URLs,
- keine Erinnerungstexte oder Antworten,
- keine Fotos,
- keine API-Schlüssel oder OAuth-Tokens.

ANITEW überträgt den Bericht nicht selbst.

## Recovery-Reihenfolge

1. App vollständig schließen und erneut öffnen.
2. Netzwerk nur prüfen, wenn die betroffene Funktion Netzwerk braucht.
3. Bei PWA-Updateproblem Safari/Browser einmal öffnen und ANITEW danach erneut vom Home-Bildschirm starten.
4. Vor jeder destruktiven Maßnahme **Sicherung speichern**.
5. Wenn möglich Sicherung auf zweitem Browser/Gerät importieren und prüfen.
6. Erst als letzte Maßnahme „Neu anfangen“ benutzen.

## Typische Fälle

### Offline-Training geht nicht

Das ist ein Release-Blocker. Diagnosebericht + genaue Startfolge sichern. Nicht mit „neu installieren“ beginnen, weil dadurch lokale Daten gefährdet werden können.

### Google Drive verbindet nicht

Lokales Training bleibt unangetastet. OAuth-Rückkehr, angezeigte Identität und Browser/PWA-Modus prüfen. Keine Tokens anfordern.

### Push kommt nicht

Prüfen:
- installierte Home-Screen-PWA auf iPhone/iPad,
- Benachrichtigungsberechtigung,
- Erinnerung in ANITEW aktiv,
- App für den eigentlichen Test vollständig geschlossen und Gerät gesperrt.

### Daten scheinen zu fehlen

Nichts zurücksetzen. Zuerst aktuelle Sicherung exportieren, vorhandene Drive-/Dateisicherung prüfen und Diagnosebericht erzeugen.

## Schweregrade

- **P0:** Datenverlust/-beschädigung oder Sicherheitsproblem.
- **P1:** App startet nicht, Core-Training blockiert, Restore funktioniert nicht.
- **P2:** wichtige optionale Funktion wie Push/OAuth defekt.
- **P3:** Darstellungs-/Komfortproblem.

P0/P1 vor Featurearbeit behandeln.
