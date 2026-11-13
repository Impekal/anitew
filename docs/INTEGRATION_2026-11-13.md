# Produktlinien zusammenführen · 13. November 2026

V4.2 (`b4caa30`) und Redesign (`698160b`, PR #132) teilten seit `804a32d`
(24. August) keine neueren Änderungen. Die 34 lokalen Mediencommits wurden
auf ausdrückliche Anweisung bisher nicht gepusht. Redesign enthält zusätzlich
295 Commits einschließlich der September-Korrekturen für Wärme und Drive.
Am 13. November hat der Nutzer Push und Deployment ausdrücklich autorisiert.

Die Zusammenführung bewahrt die Quellenhistorien und erfolgt auf dem bestehenden
V4.2-Zweig. Die 22 Textkonflikte wurden einzeln behandelt. Kursmedien bleiben
bytegleich. Keine neuen Sprechproben sind damit für die App freigegeben.

## Integrationsentscheidungen

- Die lokalen Fotos ersetzen weiterhin die alten SVG-Gesichter. SVG-Merkmals-
  tests wurden auf feste, verschiedene, lizenzierte Fotos je Sprachpool und
  Runde umgestellt. Bereits gelernte DE/EN/FR/ES-Zuordnungen ändern sich nicht.
  Neue IT/PT-Namen nutzen feste Aliase derselben lizenzierten Bilder.
- Sicherungen filtern sowohl sämtliche `coach.key*`-Zugangsdaten einschließlich
  `coach.keys` als auch gerätegebundenen `sync.*`-Zustand. Kursfortschritt und
  Kurshistorie behalten ihre eigenen Zusammenführungsregeln.
- Die geordnete Mehrfachschlüssel-Ausweichfolge bleibt erhalten; HTTP 401,
  403 und 429 behalten unterschiedliche Diagnosen. Der Anbieteradapter wird
  erst bei einer Frage geladen und behält seine Cooldowns pro Instanz.
- Klang A und die gemeinsame Ton-/Stummschaltungsinstanz bleiben erhalten;
  die einzeln schaltbaren Klangbereiche werden übernommen.
- Die ausgelagerte Sitzungsoberfläche erhält weiterhin die angezeigte
  tatsächliche Dauer samt Antwortreserve. Basisplan-Tests prüfen die nominelle
  Dauer, `answerReserve.test.ts` prüft den darüberliegenden 25%-Vertrag.
- Das sechssekündige erste Markenritual bleibt; spätere Starts dauern drei
  Sekunden, Wiederaufnahme derselben Sitzung überspringt es. Abgelaufene oder
  pausierte Animationen hinterlassen keinen Eingabeblocker.
- Navigationsexklusionen des Service Workers und Offline-Teilantworten für
  Kursmedien gelten gemeinsam. Große Kursdateien bleiben bewusste Downloads.
- Detaillierte Fortschrittsdarstellung und Hilfetexte laden in einem eigenen
  vorgecachten Modul. Die bestehenden Kaltstart-Budgets werden nicht erhöht.
- V4.2 wird Produktzweig. CI prüft Desktop in vier Shards, die mobile
  Release-Auswahl einschließlich Kurse sowie die Layoutmatrix. Nur ein grünes
  Gesamttor desselben Commits darf automatisch veröffentlichen.

## Prüfung

Baseline `b4caa30`: Build bestanden. Erste Unit-Runde 634/637 bestanden;
3 lokale Dateilese-Timeouts, danach unverändert alle 17 betroffenen Tests
in 450 ms bestanden. Kein Assertionsfehler wurde als Timeout umgedeutet.

Zusammenführung: Typecheck und 982 Kern-/Workerprüfungen bestanden.
Browser-, Größen- und Veröffentlichungsergebnisse werden nach ihrem tatsächlichen
Abschluss ergänzt. Ein Testprofil ist keine Prüfung auf echter Hardware.

Lokal bestanden: Typecheck, 982 Kern-/Workerprüfungen, Build, unverändertes
Kaltstartbudget (JS 165.0 / CSS 11.8 / gesamt 176.8 KiB gzip), Worker-Dry-Run,
36 Browserprüfungen im ersten Durchgang sowie 25 Abschlussprüfungen nach den
letzten Änderungen (inklusive echter Sicherungsdatei mit `coach.keys`, Reset,
Offline-Portraits, Schlüsselreihenfolge und Wärmebudget). Vollständige
Desktop-/Mobil-/Layout-Suite folgt am Veröffentlichungscommit in CI.

## Claudes parallel geprüfte Wärme-Korrektur

Die inzwischen veröffentlichten Commits `dde55d9` und `544c316` werden mit
ihrer Historie übernommen. Die dort entfernten bewegten Weichzeichner sind
im September-Stand bereits entfernt; die aktuellen Konturen und Abstände
bleiben erhalten. Claudes zusätzlicher Wächter für große Filterflächen bleibt
neben dem strengeren Animationsbudget erhalten. Die von Claude dokumentierten
FPS-Werte stammen aus dessen Messung, nicht aus einer neuen Hardwaremessung
auf diesem Mac.

Die CI baut mit derselben öffentlichen Google-Client-Konfiguration für Tests
und Produktion. Der Deploy übernimmt exakt das geprüfte `dist`-Artefakt statt
es nach dem Tor unter anderen Einstellungen erneut zu bauen.
