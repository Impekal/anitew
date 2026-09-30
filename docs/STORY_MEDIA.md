# Geschichten-Kursmedien — 2026-09-30

Die App bündelt drei synthetische Tonspuren (zusammen rund 3 MB), eigene
Vektorillustrationen und 21 Textabschnitte in elf Untertitelsprachen. Es werden
keine Modelle, Syntheseprogramme oder fremden Beispielaufnahmen ausgeliefert.
Die Dateien und ihre SHA-256-Prüfsummen stehen in
`public/course-media/story/manifest.json`. Die Medien sind vollständig lokal;
die Quellenlinks sind freiwillige Verweise und keine Wiedergabeabhängigkeit.

## Herstellung und Quellen

- Deutsch: Thorsten medium; Datensatz von Thorsten Müller, CC0 laut
  [Modellkarte](https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/thorsten/medium/MODEL_CARD).
- Englisch: Joe medium; CC0-Datensatz laut
  [Modellkarte](https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/joe/medium/MODEL_CARD).
- Französisch: Tom medium; Modell und Datensatz laut
  [Modellkarte](https://huggingface.co/rhasspy/piper-voices/blob/main/fr/fr_FR/tom/medium/MODEL_CARD)
  und [Projekt](https://git.bksp.space/Tjiho/French-tts-model-piper) unter AGPLv3.
- Lokale Synthese: Piper 1.8.0 (GPL-3.0). Modell-/Programmlizenzen werden hier
  dokumentiert, nicht pauschal als Lizenz der erzeugten Audiodateien ausgegeben.
- Texte, Übersetzungsentwürfe und Vektorillustrationen wurden für ANITEW erstellt.
  Keine Aussage oder Empfehlung der ursprünglichen Sprecher wird behauptet.

Die akzeptierte deutsche Tonspur wird unverändert übernommen. In Englisch und
Französisch ist derselbe akzeptierte Namensausschnitt eingesetzt; Französisch
verwendet die passende Abtastrate, ohne Tempo-/Tonhöhenänderung. Die private
Nutzeraufnahme ist nicht enthalten. Die englische und französische Stimme
sowie Übersetzungen benötigen weiterhin die abschließende Hör-/Sprachprüfung.

## Bedienung und Offline-Verhalten

Deutsch/Englisch/Französisch wählen automatisch die entsprechende Tonspur,
alle anderen App-Sprachen Englisch. Eine ausdrückliche Tonwahl hat Vorrang;
Untertitel und Sprechtext bleiben in der App-Sprache. Tonwahl und Tempo werden
lokal gespeichert. Kein Autoplay. Lesen pausiert und entfernt den Audioplayer.

Der Player wechselt vor der gesprochenen Lösung in dieselbe Abrufübung wie
Lesen; dabei werden Player, Untertitel, Transkript und Beispiel entfernt.
Vergleichen setzt eine eigene Eingabe voraus. Erst die bestehenden bewussten
Selbstprüfungen speichern den gemeinsamen Kursabschluss. Anhören allein zählt
nicht als abgeschlossene Übung. Eigenes Material wird weiterhin ohne die
Beispieltonspur geübt.

Nur diese drei kleinen M4A-Dateien werden bei der PWA-Installation vollständig
in einen versionierten Mediencache geladen. Workbox liefert daraus auch
HTTP-Teilantworten (206) fürs Offline-Vorspulen; Audio verwendet CORS-Modus.
Bei Änderungen an den Dateien muss die Cacheversion in Vite und
course-media-sw.js gemeinsam erhöht werden. Grundlage:
https://developer.chrome.com/docs/workbox/serving-cached-audio-and-video .
Große Videos werden weiterhin nicht automatisch geladen. Die Darstellung ist
eine illustrierte Audiollektion mit statischem Coach, kein natürlich animiertes
Sprechvideo. Automatisierte Medien-/Steuerungstests ersetzen keine Hörprüfung.

## Erweiterung: elf weitere Kurse

`public/course-media/library/manifest.json` dokumentiert 33 weitere Tonspuren
(DE/EN/FR, zusammen 34,53 MB). Gleiche lokale Synthese und Stimmen wie oben;
keine Modelle oder privaten Aufnahmen werden ausgeliefert. Der akzeptierte
Namensausschnitt aus Probe 14 wird auch in den beiden weiteren Kursen mit
ANITEW-Nennung eingesetzt. `nameReference: approved-v14` kennzeichnet sie.
Andere Passagen enthalten keine Nennung des App-Namens.

Diese Dateien werden bewusst einzeln geladen. Dateinamen enthalten den
SHA-256-Präfix, der vollständige Hash wird vor der Offline-Freigabe geprüft.
Fortschritt, Abbruch, Fortsetzung über HTTP Range, Speicherfehler und Entfernen
sind abgedeckt. Normales Streaming lädt kein dauerhaftes Paket. Workbox liefert
Teilantworten aus dem ausdrücklich gefüllten Mediencache. Alle URLs bleiben
auf der eigenen Origin; die Wiedergabe benötigt weder API-Schlüssel noch KI.

Alle elf App-Sprachen erhalten Untertitel zum tatsächlich gesprochenen
Beispiel, unabhängig von der gewählten DE/EN/FR-Tonspur. Für die elf weiteren
Kurse sind 264 zusätzliche Untertitelspuren für ES/IT/PT/NL/TR/AR/ZH/JA
lokal gebündelt. Wort-, Schlüsselwort- und Major-Beispiele erhalten ihre
ursprünglichen Lernwörter. Arabische Absätze verwenden RTL-Ausrichtung.
Beim wortgetreuen Abruf erklärt ein Hinweis die ursprüngliche Ton-Sprache.

Ein lokaler M2M100-Versuch wurde wegen falscher Fachbegriffe und übersetzter
Lernwörter verworfen. Weitere Entwürfe wurden lokal mit
[Qwen3-4B-Instruct-2507](https://huggingface.co/Qwen/Qwen3-4B-Instruct-2507)
(Apache 2.0, MLX-4bit-Konvertierung) erzeugt, anschließend abschnittsweise
korrigiert; die arabischen Texte wurden vollständig neu formuliert.
Lernwörter, Listen, Bruchrechnung und Merkbilder wurden gezielt abgeglichen.
Das Modell und seine Laufzeit werden nicht ausgeliefert. Die Untertitel sind
weiterhin als Entwürfe gekennzeichnet: technische Vollständigkeit ersetzt
keine abschließende Prüfung durch Muttersprachler.

Die Lesefassung bleibt verfügbar. Medienwahl, Sprache und Geschwindigkeit
werden gespeichert; sie starten keine automatische Wiedergabe. Die Übung
verwendet das zuvor gehörte Beispiel. Die höheren Kursstufen haben neue
Leseübungen und eigenes Material, keine irreführend wiederverwendete Beispieltonspur.


## Sprechvideos: Qualitätskorrektur vom 30. September 2026

Die kurze SadTalker-/LivePortrait-Probe wurde vom Nutzer abgelehnt: Der Mund
öffnet sich zu wenig und passt nicht zur Stimme. Der lange Renderlauf wurde
gestoppt. Keine dieser Proben und keine Testdateien werden ausgeliefert.
Die vorbereitete Video-Infrastruktur ist noch nicht mit freigegebenen Clips befüllt.

Neu gilt: Noah behält die akzeptierte Männerstimme; Lin und Atta erhalten
je eine eigene, natürlich sprechende Männerstimme. Keine künstlich gebrochene
Sprache oder aus dem Aussehen abgeleitete Akzente. Zuerst kurze Stimm- und
Lippensynchronproben, anschließend vollständige Kurse. Die bestätigte
ANITEW-Aussprache bleibt die Referenz für alle Stimmen und Tonsprachen.

Die neuen kurzen deutschen Qwen-VoiceDesign-Proben für Lin und Atta wurden
vom Nutzer ausdrücklich bestätigt. Atta wird Standardcoach. Die anschließende
LivePortrait/MuseTalk-Lippenkorrektur wurde wegen Unschärfe und weiterhin
unpassender Bewegung abgelehnt. Keine solche Videodatei ist gebündelt.

## Individuelle Kursstimmen

Für alle zwölf deutschen Kurse liegen separate vollständige Tonspuren mit
Atta und Lin vor. Die Auswahl des Coaches wählt auch die passende Aufnahme.
Noahs Originaltonspur bleibt unverändert. Zusätzliche Spuren werden bewusst
heruntergeladen und danach vollständig lokal wiedergegeben. Cue-Zeiten,
Untertitel, Kapitel und Lösungssperre richten sich nach der jeweiligen Aufnahme.
Fehlende Kurs-/Sprachkombinationen nennen die tatsächlich verfügbare Stimme.

Die vom Nutzer bestätigten synthetischen Kurzstimmen dienen als Referenzen für
Qwen3-TTS Base. Der Markenname verwendet den akzeptierten v14-Ausschnitt.
Die neuen Vollaufnahmen sind dekodiert und automatisch transkribiert; diese
Prüfung ersetzt keine vollständige Hörabnahme. Es werden keine Modelle oder
privaten Nutzeraufnahmen gebündelt. Quellen und Hashes stehen im lokalen
`public/course-media/coach-narration-manifest.json`.
