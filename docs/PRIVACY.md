# Datenschutzerklärung

**Stand: 2026-08-18** · Backlog R4

> Der kurze Teil zuerst: **ANITEW hat keinen Server.** Es gibt kein Konto,
> keine Anmeldung, keine Werbung, keine Analyse-Dienste und keine Tracker.
> Alles, was du eingibst oder was beim Training entsteht, bleibt auf deinem
> Gerät.

Dieses Dokument ist die Quelle für den Datenschutztext im Store-Eintrag und
für die Fassung in der App. Wo beide dasselbe sagen, gilt derselbe Grundsatz
wie für alle Texte (F7): **Es steht nur drin, was stimmt.**

---

## 1. Wer verantwortlich ist

ANITEW wird als quelloffene Anwendung entwickelt. Wer sie betreibt — also
unter welcher Adresse sie ausgeliefert wird —, steht im Store-Eintrag
beziehungsweise im Impressum der Webseite. Die Angabe gehört dorthin und nicht
hierher, weil sie sich ändern kann, ohne dass sich an der Verarbeitung etwas
ändert.

## 2. Was auf deinem Gerät gespeichert wird

Alles Folgende liegt ausschließlich im Speicher deines Browsers
(IndexedDB) und verlässt dein Gerät nicht:

| Was | Wofür |
|---|---|
| Trainingseinheiten und einzelne Antworten (Zeitpunkt, Modul, richtig/falsch, Antwortdauer) | Der Wiederholungsplan und die ehrlichen Zahlen in der Zusammenfassung |
| Wiederholungstermine je Information | Damit etwas zurückkommt, bevor du es vergisst |
| Messungen (Anzahl behaltener Wörter je Abruf) | Die einzige Aussage der App über dein Gedächtnis |
| Einstellungen: Sprache, Trainingssprache, Ton, Lernstand der Merktechniken, dein eigener Gedächtnispalast, die gewählte Erinnerungszeit | Damit die App beim nächsten Start weiß, wo du stehst |

**Es gibt keine Nutzerkennung.** ANITEW vergibt keine ID, kein Pseudonym und
keinen Zählwert, mit dem sich Geräte oder Sitzungen verknüpfen ließen.

## 3. Was ANITEW **nicht** tut

- Keine Übertragung deiner Trainingsdaten an uns oder an Dritte — es gibt
  keine Stelle, an die sie gehen könnten.
- Keine Werbung, keine Werbe-IDs, kein Profiling für Werbung.
- Keine Analyse-Dienste, kein Crash-Reporting, keine Nutzungsstatistik.
- Keine Cookies. Der Browserspeicher wird für die Funktion gebraucht, nicht
  zum Wiedererkennen.
- Kein Zugriff auf Kontakte, Kamera, Mikrofon, Standort oder Dateien —
  abgesehen von der Datei, die du selbst zum Einlesen einer Sicherung
  auswählst.

## 4. Was beim Aufruf trotzdem passiert

Ehrlich bleibt auch das Unangenehme: Damit die App **überhaupt** auf dein
Gerät kommt, muss sie einmal geladen werden. Der Anbieter, der sie
ausliefert (Webhosting oder App Store), sieht dabei technisch bedingt das,
was jeder Webserver sieht — IP-Adresse, Zeitpunkt, angeforderte Datei,
Browserkennung. Darauf haben wir keinen Einfluss, und diese Daten erreichen
uns nicht.

Danach läuft ANITEW **offline**: Der Service Worker legt die App im
Gerätespeicher ab, und ein Training braucht keine Verbindung mehr.

## 5. Sicherung und Wiederherstellung

Die Sicherung ist eine Datei, die **du** speicherst — auf deinem Gerät, in
deiner Cloud, in deiner Mail. ANITEW lädt sie nirgends hoch und weiß nicht,
wohin du sie legst. Sie enthält deine Trainingsgeschichte im Klartext
(JSON); wer die Datei hat, kann sie lesen. Wähle den Ablageort entsprechend.

## 6. Benachrichtigungen

Wenn du eine Erinnerung einstellst, fragt der Browser dich um Erlaubnis. Die
Erinnerung entsteht **auf deinem Gerät** — es gibt keinen Push-Dienst, der
davon erfährt. Die Erlaubnis lässt sich jederzeit in den Einstellungen des
Browsers oder des Betriebssystems zurücknehmen.

## 7. Deine Rechte

Die Datenschutz-Grundverordnung gibt dir Auskunft, Berichtigung, Löschung und
Übertragbarkeit. Praktisch ist das hier ungewöhnlich einfach, weil niemand
sonst deine Daten hat:

- **Auskunft und Übertragbarkeit:** „Sicherung speichern“ gibt dir alles, was
  ANITEW über dich weiß, in einer lesbaren Datei.
- **Löschung:** Den Browserspeicher für ANITEW leeren oder die App
  deinstallieren. Damit ist es weg — auch für uns, denn wir hatten es nie.
- **Berichtigung und Widerspruch:** Es gibt keine Verarbeitung bei uns, gegen
  die sich widersprechen ließe.

## 8. Kinder

ANITEW richtet sich an niemanden bestimmten und sammelt nichts. Es gibt keine
Chatfunktion, keine Bestenliste, keinen Kontakt zu anderen Nutzern und keine
Inhalte von Dritten.

## 9. Was sich ändern wird, bevor es kommt

Zwei geplante Funktionen würden diese Erklärung berühren, und sie stehen
deshalb schon hier:

- **Cloud-Abgleich (Backlog N7/N8)** — falls er kommt, dann als *ausdrückliche
  Wahl* mit dem Speicher, der dir gehört (etwa deinem eigenen Drive), nicht
  als Voreinstellung und nicht auf unseren Servern.
- **KI-Funktionen mit eigenem Schlüssel (Backlog M)** — dabei gingen Inhalte an
  den Anbieter, dessen Schlüssel du einträgst. Das wäre eine Übertragung an
  Dritte, sie wäre freiwillig, sie würde vorher benannt, und ohne Schlüssel
  passiert nichts.

Solange beides nicht in der App ist, gilt Abschnitt 3 ohne Einschränkung.

## 10. Änderungen

Ändert sich etwas an der Verarbeitung, ändert sich zuerst dieses Dokument —
mit neuem Datum. Eine stillschweigende Änderung wäre derselbe Vertrauensbruch
wie eine erfundene Zahl (R-1).
