# Datenschutzerklärung

**Stand: 2026-08-25**

> Der kurze Teil zuerst: **ANITEW bleibt local-first.** Es gibt **kein Konto bei ANITEW**,
> keine Werbung, keine externen Analyse-Dienste und keine Tracker. Training,
> Erinnerungen, Messungen und Profil bleiben auf deinem Gerät. Nur Funktionen,
> die du ausdrücklich einschaltest oder auslöst — Google-Drive-Abgleich, KI-
> Funktionen, Fotoanalyse und Systembenachrichtigungen — benutzen dafür notwendige
> Netzdienste.

Dieses Dokument beschreibt, was die aktuelle Fassung von ANITEW tatsächlich tut.

---

## 1. Verantwortlicher für den Datenschutz

Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO):

**ANITEW by Impekal**  
Inhaber: **Dr. Mèhèza Kalibani**  
Holstenwall 24  
20335 Hamburg  
Deutschland

E-Mail: impekaltech+anitew@gmail.com  
Telefon: +49 151 12784951

Weitere Anbieterangaben stehen im [Impressum](/impressum.html).

## 2. Was auf deinem Gerät gespeichert wird

Im Browserspeicher (vor allem IndexedDB; daneben localStorage/sessionStorage für Gerätevorlieben wie Theme, Erststart-Marken und flüchtige Hinweise) liegen unter anderem:

| Was | Wofür |
|---|---|
| Trainingseinheiten und Antworten | Wiederholungsplan und Auswertungen |
| Wiederholungstermine | Fällige Wiedersehen |
| Messungen | Vergleich deiner eigenen Messreihe |
| Eigene Erinnerungen, Karten und Gedächtnispalast | Persönliches Training |
| Einstellungen wie Sprache, Ton und Erinnerungszeit | Nächster Start |

Diese Inhalte werden **nicht** für Web Push auf einen ANITEW-Server kopiert.

ANITEW kann zusätzlich auf dem Gerät rein technische Diagnoseinformationen und
aggregierte Beta-Messwerte berechnen. Sie enthalten keine Erinnerungstexte,
Antwortinhalte, API-Schlüssel oder OAuth-Tokens und werden **nicht automatisch
übertragen**. Ein Nutzer muss einen solchen Bericht ausdrücklich exportieren,
bevor er ihn freiwillig weitergeben kann.

## 3. Was ANITEW nicht tut

- Keine Werbung, Werbe-ID oder werbliche Profilbildung.
- Keine externen Analyse-Dienste, automatische Nutzungsstatistik oder Tracker.
- Kein Upload deiner Trainings- oder Gedächtnisinhalte für Push.
- Kein Zugriff auf Kontakte oder Standort.
- Keine dauerhafte Aufzeichnung von Mikrofon oder Kamera im Hintergrund.
- Keine öffentliche Bestenliste oder soziale Nutzerprofile.

## 4. Mikrofon, Diktat und Fotos

### Diktat

Wenn du die Diktierfunktion ausdrücklich startest, darf ANITEW das Mikrofon für
**einen kurzen Diktatvorgang** verwenden. Die Spracherkennung wird nur gestartet,
wenn der Browser eine lokale Spracherkennung bestätigt und `processLocally`
unterstützt. ANITEW fällt bewusst **nicht** auf einen entfernten Browser-
Sprachdienst zurück. Ist lokale Verarbeitung nicht verfügbar, bleibt Diktat aus.
Der erkannte Text wird wie selbst eingegebener Text behandelt.

### Fotoauswahl und Kamera

„Foto wählen“ öffnet die vom Gerät bereitgestellte Bild-/Kameraauswahl. Das
gewählte Originalfoto bleibt zunächst als flüchtige lokale Arbeitsvorlage im
Browser-Arbeitsspeicher und wird nicht automatisch in IndexedDB, Backup oder
Google Drive gespeichert.

Erst wenn du zusätzlich **„Foto auswerten“** antippst, erzeugt ANITEW im Browser
eine verkleinerte JPEG-Kopie ohne Datei-/EXIF-Metadaten und sendet diese direkt
an den von dir gewählten und mit deinem eigenen API-Schlüssel eingerichteten
KI-Anbieter. Das Originalfoto wird nicht an den Anbieter geschickt. Die KI-
Antwort ist nur ein Vorschlag; gespeichert wird erst nach deiner ausdrücklichen
Bestätigung.

## 5. Was beim Aufruf technisch passiert

Die App wird über Cloudflare Workers/Static Assets ausgeliefert. Wie bei jedem
Webserver fallen dabei technisch Verbindungsdaten wie IP-Adresse, Zeitpunkt,
Browser- und Dateianfrage beim Infrastruktur-Anbieter an. ANITEW baut daraus
kein Nutzungsprofil.

**Klartext:** Nach dem Laden ist das **Training selbst offlinefähig**.
Netzzugriff wird nur für ausdrücklich gewählte Online-Funktionen benötigt.
Drive-Abgleich, KI-Funktionen und Systembenachrichtigungen sind aus,
bis du sie anfasst. Erst eine ausdrückliche Aktivierung oder Aktion startet den
jeweiligen Online-Weg.

## 6. Sicherung und Wiederherstellung

„Sicherung speichern“ erzeugt eine JSON-Datei mit deinem ANITEW-Stand. Du
entscheidest, wo sie liegt. Wer diese Datei besitzt, kann ihren Inhalt lesen.

Beim optionalen Google-Drive-Abgleich legt ANITEW dieselbe Sicherungsdatei in
einem eigenen `Anitew`-Ordner deines Google Drive ab. ANITEW fasst andere
Dateien nicht an.

## 7. Systembenachrichtigungen / Web Push

Wenn du „Benachrichtigungen erlauben“ ausdrücklich antippst und dein Gerät Web
Push unterstützt, erzeugt der Browser eine **technische Push-Adresse** für
dieses Gerät. Für die Zustellung speichert ANITEW serverseitig nur:

- diese technische Push-Adresse,
- die Kennung der Erinnerung (`daily` oder `benchmark`),
- den fälligen Zeitpunkt,
- bei der täglichen Erinnerung Uhrzeit und IANA-Zeitzone,
- den generischen Benachrichtigungstext — auch als kurze Zustell-Notiz, die
  nach dem Auslösen so lange beim Server bereitliegt, bis dein Gerät sie
  abholt oder das Push-Abonnement endet.

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

## 8. Löschen und Übertragbarkeit

- **Übertragbarkeit:** „Sicherung speichern“ exportiert deinen lokalen Stand.
- **Vollständiger Neustart:** „Neu anfangen“ löscht die lokalen ANITEW-Daten,
  trennt Google und widerruft das Push-Abonnement. Optional kann dabei auch
  ANITEWs eigene Sicherungsdatei in deinem Google Drive gelöscht werden.
- **Nur Erinnerung aus:** „Keine Erinnerung“ beendet die tägliche Erinnerung,
  ohne deine Trainingsdaten zu löschen.

## 9. Google-Drive-Abgleich

Google Drive ist aus, bis du ihn selbst einschaltest. Die Anmeldung erfolgt
über Google OAuth. ANITEW fordert dabei neben dem Drive-Zugriff die
Google-Basisauskunft (`openid email profile`) an — nur damit die Oberfläche
zeigen kann, als wer du verbunden bist. Der Cloudflare Worker tauscht den
Google-Autorisierungscode gegen Tokens und hält die Sitzung — einschließlich
des Google-Refresh-Tokens — verschlüsselt in einem `HttpOnly`-Cookie deines
Browsers (Laufzeit bis zu 180 Tage; beim Abmelden sofort gelöscht und bei
Google widerrufen). Es gibt keine ANITEW-Nutzerdatenbank, in der Tokens
lägen. Das Gerät nutzt den Zugriff anschließend für den ANITEW-Ordner im
eigenen Drive. Name/E-Mail, die in der Oberfläche zur Kontokontrolle
angezeigt werden, werden lokal in ANITEWs Gerätespeicher gehalten und beim
Trennen entfernt.

Für Google gelten zusätzlich Googles Datenschutzbedingungen.

## 10. KI-Funktionen mit eigenem API-Schlüssel

Der Coach und KI-Vorschläge sind aus, bis du einen eigenen Schlüssel hinterlegst
und eine entsprechende Funktion ausdrücklich auslöst. Beim Text-Coach werden je
nach Auswahl Gemini, Anthropic, OpenAI, Groq, OpenRouter oder Mistral
unterstützt. Dann gehen Frage und der dafür beschriebene Zahlenkontext direkt an
den gewählten KI-Anbieter. Eigene Erinnerungstexte werden nur bei einer von dir
ausgelösten KI-Vorschlagsfunktion übertragen.

Für die Fotoanalyse werden ausschließlich Gemini, Anthropic oder OpenAI
unterstützt. Wie in Abschnitt 4 beschrieben, wird dabei erst nach „Foto auswerten“
eine vorbereitete Bildkopie übertragen.

Der API-Schlüssel bleibt auf deinem Gerät. Für die Verarbeitung beim jeweiligen
Anbieter gilt zusätzlich dessen Datenschutzerklärung.

## 11. Rechtsgrundlagen und Speicherdauer

Soweit ANITEW Daten nur auf deinem Gerät verarbeitet, bestimmst du durch Nutzung,
Export und Löschen über ihren Bestand. Bei freiwillig aktivierten Online-
Funktionen erfolgt die Verarbeitung zur Bereitstellung der jeweils ausdrücklich
gewählten Funktion. Konkrete Fristen: Das verschlüsselte Google-Sitzungs-Cookie
läuft nach spätestens 180 Tagen ab (beim Abmelden sofort); serverseitige
Push-Einträge bestehen, bis der Termin zugestellt und abgeholt ist, du die
Erinnerung beendest oder das Push-Abonnement endet. Technische Infrastrukturprotokolle und Daten bei externen
Anbietern unterliegen zusätzlich deren gesetzlichen und vertraglichen
Aufbewahrungsregeln.

## 12. Deine Rechte

Soweit personenbezogene Daten durch den Verantwortlichen verarbeitet werden,
hast du im gesetzlichen Umfang insbesondere Rechte auf Auskunft, Berichtigung,
Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch.
Außerdem besteht das Recht, sich bei einer zuständigen Datenschutzaufsichtsbehörde
zu beschweren. Für Anfragen genügt die oben genannte E-Mail-Adresse.

## 13. Kinder

ANITEW hat keine Chatfunktion zwischen Nutzern, keine öffentliche Bestenliste
und keine Werbung. Die oben beschriebenen freiwilligen Online-Funktionen folgen
denselben technischen Regeln unabhängig vom Alter.

## 14. Änderungen

Ändert sich die Verarbeitung, wird diese Erklärung mit neuem Datum angepasst.
Eine Funktion, die zusätzliche Daten überträgt, darf nicht stillschweigend unter
einem alten Datenschutztext erscheinen.
