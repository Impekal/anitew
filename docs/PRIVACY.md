# Datenschutzerklärung

**Stand: 2026-08-24** · Backlog R4

> Der kurze Teil zuerst: **ANITEW bleibt local-first.** Es gibt **kein Konto**
> bei ANITEW, keine Werbung, keine Analyse-Dienste und keine Tracker.
> Training, Erinnerungen, Messungen und Profil bleiben auf deinem Gerät. Nur
> Funktionen, die du ausdrücklich einschaltest — Google-Drive-Abgleich, Coach
> und Systembenachrichtigungen — benutzen dafür notwendige Netzdienste.

Dieses Dokument ist die Quelle für den Datenschutztext im Store-Eintrag und
für die Fassung in der App. Es steht nur drin, was die aktuelle Fassung tut.

---

## 1. Wer verantwortlich ist

Wer ANITEW betreibt und unter welcher Kontaktadresse, steht im Impressum bzw.
im jeweiligen Store-Eintrag. Diese Angabe gehört dorthin, weil sie sich ändern
kann, ohne dass sich die technische Verarbeitung ändert.

## 2. Was auf deinem Gerät gespeichert wird

Im Browserspeicher (IndexedDB) liegen unter anderem:

| Was | Wofür |
|---|---|
| Trainingseinheiten und Antworten | Wiederholungsplan und Auswertungen |
| Wiederholungstermine | Fällige Wiedersehen |
| Messungen | Vergleich deiner eigenen Messreihe |
| Eigene Erinnerungen, Karten und Gedächtnispalast | Persönliches Training |
| Einstellungen wie Sprache, Ton und Erinnerungszeit | Nächster Start |

Diese Inhalte werden **nicht** für Web Push auf einen ANITEW-Server kopiert.

## 3. Was ANITEW nicht tut

- Keine Werbung, Werbe-ID oder werbliche Profilbildung.
- Keine Analyse-Dienste, Nutzungsstatistik oder Tracker.
- Kein Upload deiner Trainings- oder Gedächtnisinhalte für Push.
- Kein Zugriff auf Kontakte, Standort, Mikrofon oder Kamera.
- Keine öffentliche Bestenliste oder soziale Nutzerprofile.

## 4. Was beim Aufruf technisch passiert

Die App wird über Cloudflare Workers/Static Assets ausgeliefert. Wie bei jedem
Webserver fallen dabei technisch Verbindungsdaten wie IP-Adresse, Zeitpunkt,
Browser- und Dateianfrage beim Infrastruktur-Anbieter an. ANITEW baut daraus
kein Nutzungsprofil.

**Klartext:** Nach dem Laden ist das **Training selbst offlinefähig**.
Netzzugriff wird nur für ausdrücklich gewählte Online-Funktionen benötigt.
Drive-Abgleich, Coach und Systembenachrichtigungen sind aus,
bis du sie anfasst.

## 5. Sicherung und Wiederherstellung

„Sicherung speichern“ erzeugt eine JSON-Datei mit deinem ANITEW-Stand. Du
entscheidest, wo sie liegt. Wer diese Datei besitzt, kann ihren Inhalt lesen.

Beim optionalen Google-Drive-Abgleich legt ANITEW dieselbe Sicherungsdatei in
einem eigenen `Anitew`-Ordner deines Google Drive ab. ANITEW fasst andere
Dateien nicht an.

## 6. Systembenachrichtigungen / Web Push

Wenn du „Benachrichtigungen erlauben“ ausdrücklich antippst und dein Gerät Web
Push unterstützt, erzeugt der Browser eine **technische Push-Adresse** für
dieses Gerät. Für die Zustellung speichert ANITEW serverseitig nur:

- diese technische Push-Adresse,
- die Kennung der Erinnerung (`daily` oder `benchmark`),
- den fälligen Zeitpunkt,
- bei der täglichen Erinnerung Uhrzeit und IANA-Zeitzone,
- den generischen Benachrichtigungstext.

**Nicht gespeichert werden dafür:** Trainingsantworten, Gedächtnisinhalte,
Profil, Name, E-Mail-Adresse, Messwerte oder Sicherungsdateien.

Die Speicherung erfolgt in einem nur aus der Push-Adresse abgeleiteten
Cloudflare Durable Object. Es gibt dafür kein ANITEW-Nutzerkonto und keine
plattformübergreifende Nutzer-ID. Der eigentliche Zustellweg läuft über den vom
Browser/Betriebssystem bestimmten Push-Dienst (auf Apple-Geräten die
entsprechende Apple-Infrastruktur).

„Keine Erinnerung“ löscht die tägliche Erinnerung. „Neu anfangen“ versucht,
den serverseitigen Push-Eintrag zu löschen und widerruft zusätzlich das lokale
Push-Abonnement; dadurch wird die bisherige Push-Adresse ungültig, selbst wenn
der Server gerade nicht erreichbar ist. Die Benachrichtigungsberechtigung kann
außerdem jederzeit in den System-/Browser-Einstellungen entzogen werden.

Auf iPhone und iPad funktioniert Web Push nur für eine zum Home-Bildschirm
hinzugefügte Web-App auf unterstützten iOS/iPadOS-Versionen. Wenn Web Push auf
einem Gerät nicht verfügbar ist, verspricht ANITEW keine geschlossene
Systembenachrichtigung und fällt auf den Hinweis „nur solange offen“ zurück.

## 7. Löschen und Übertragbarkeit

- **Übertragbarkeit:** „Sicherung speichern“ exportiert deinen lokalen Stand.
- **Vollständiger Neustart:** „Neu anfangen“ löscht die lokalen ANITEW-Daten,
  trennt Google und widerruft das Push-Abonnement. Optional kann dabei auch
  ANITEWs eigene Sicherungsdatei in deinem Google Drive gelöscht werden.
- **Nur Erinnerung aus:** „Keine Erinnerung“ beendet die tägliche Erinnerung,
  ohne deine Trainingsdaten zu löschen.

## 8. Google-Drive-Abgleich

Google Drive ist aus, bis du ihn selbst einschaltest. Die Anmeldung erfolgt
über Google OAuth. Der Cloudflare Worker tauscht den Google-
Autorisierungscode gegen Tokens und hält die Sitzung verschlüsselt in einem
`HttpOnly`-Cookie des Browsers; der Token wird nicht in einer ANITEW-
Nutzerdatenbank gespeichert. Das Gerät nutzt den Zugriff anschließend für den
ANITEW-Ordner im eigenen Drive. Name/E-Mail, die in der Oberfläche zur
Kontokontrolle angezeigt werden, werden lokal in ANITEWs Gerätespeicher
gehalten und beim Trennen entfernt.

Für Google gelten zusätzlich Googles Datenschutzbedingungen.

## 9. Coach mit eigenem API-Schlüssel

Der Coach ist aus, bis du einen eigenen Schlüssel hinterlegst und eine Frage
stellst. Unterstützt werden **Gemini, Anthropic, Groq, OpenRouter und Mistral**.
Dann gehen Frage und der dafür beschriebene Zahlenkontext direkt an den von dir
gewählten KI-Anbieter. Eigene Erinnerungstexte werden nur bei einer von dir
ausgelösten KI-Vorschlagsfunktion übertragen. Der API-Schlüssel bleibt auf
deinem Gerät. Für die Verarbeitung beim jeweiligen Anbieter gilt dessen
Datenschutzerklärung.

## 10. Kinder

ANITEW hat keine Chatfunktion zwischen Nutzern, keine öffentliche Bestenliste
und keine Werbung. Die oben beschriebenen freiwilligen Online-Funktionen
folgen denselben Regeln unabhängig vom Alter.

## 11. Änderungen

Ändert sich die Verarbeitung, wird diese Erklärung mit neuem Datum angepasst.
Eine Funktion, die zusätzliche Daten überträgt, darf nicht stillschweigend
unter einem alten Datenschutztext erscheinen.
