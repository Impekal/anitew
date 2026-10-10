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


## Approved voice update, 2026-10-01

The user accepted the exact short English Atta and Noah recordings and the
French B-to-C voice conversion, then assigned that French voice to Atta.
The story course now has new English recordings for Atta and Noah and a new
French recording for Atta. Other courses retain their existing recordings.
All new audio is local, uses the normal verified download cache, and has
recording-specific cue times and recall boundaries. The full approved greeting
is retained in the same coach voice; no other speaker's name fragment is inserted.

English content was synthesized with Atta's approved Qwen reference. Noah's
full utterances use the same OpenVoice V2 conversion recipe as his approved
sample. French uses Kyutai's Fabien voice at 1.12 tempo followed by conversion
toward CML-TTS French speaker 1406, matching the approved sample. Three French
cues were regenerated after transcription discrepancies; the final full-course
transcription retains the lesson and examples. Automatic transcription is a
content check and cannot certify pronunciation or full listening quality.

The manifest records file hashes, recipes and sources. Player credits link to
Kyutai, CML-TTS and their CC-BY-4.0 licences, and to OpenVoice (MIT). The existing
German recordings' old name handling still needs migration; these new story
recordings do not silently certify or replace every earlier language track.

## Ausbau der bestätigten Stimmen auf die Bibliothek, 2026-10-01

Lin wurde auch auf Englisch und Französisch bestätigt. Die vollständigen zwölf
Kurse erhalten Atta/Noah/Lin auf Englisch und Atta/Lin auf Französisch. Zusammen
mit den 24 deutschen Aufnahmen enthält der Coach-Katalog 84 zusätzliche
Tonspuren; die 36 ursprünglichen Dateien bleiben erhalten. Noahs neue
französische Probe bleibt ausdrücklich ausgeschlossen.

Die Inhaltsprüfung verwendet vollständige, unabhängige Transkriptionen und
gezielte Zweitprüfungen auffälliger Sätze. Französische Formeln werden
sprachlich erklärt; schwierige isolierte Buchstabennamen werden durch
Lautbeispiele wie tapis/dos/nez ergänzt. Gleichsprachige Untertitel und
Sprechtext übernehmen diese dokumentierten Formulierungen, übersetzte
Untertitel behalten den Lerninhalt und die jeweiligen Zeitmarken. Das
ursprüngliche Übungsbeispiel bleibt die Grundlage des Selbstvergleichs.

Diese Prüfung bestätigt keine muttersprachliche Hörqualität. Vollständige
Hörabnahme, Noah Französisch, deutsche Namensstellen und natürliche
Sprechvideos bleiben offen. Die bereits verworfenen Videoproben werden
nicht ausgeliefert. Zusätzliche Medien werden bewusst heruntergeladen;
beim Start wird keine gesamte Coach-Bibliothek vorgeladen.


## Französischer Geschichtenkurs: Gesamtaufnahme bestätigt, 9. Oktober 2026

Der Nutzer hat die vollständige direkte CML-TTS-FR1406-Aufnahme V3 bestätigt
(„Audio in Fr ist jetzt gut. Weiter“). Registriert ist
`atta-story-fr-74f96a4e4728.m4a` mit 88,69675 Sekunden. Sie ersetzt für diesen
Kurs die verworfene Fabien-Aufnahme. Keine Stimmumwandlung oder fremde
Namenseinfügung. Die elf weiteren französischen Atta-Kurse verwenden noch
den verworfenen älteren Stand und müssen vor einer Veröffentlichung ersetzt
werden; diese Freigabe gilt nicht automatisch für neue Gesamtaufnahmen.

Die französischen Untertitel verwenden den tatsächlichen Sprechtext einschließlich
„mémorisation. Elle relie…“, „un ordre. Par exemple…“ und „Ton objectif est de
retrouver…“. Quellen: Kyutai TTS und CML-TTS FR1406 (Oliveira et al., jeweils
CC BY 4.0); Bearbeitung durch ANITEW. Die genaue Quelle, Dateiprüfsumme und
Freigabe stehen im Medienmanifest.

Die lokale Illustrationsvorschau übernimmt die bestätigte AAC-Tonspur unverändert.
Bereits enthaltene Satz- und Tafelpausen werden nicht nochmals verlängert.
Der spätere Coach-Auftritt bleibt eine separate, noch nicht freigegebene Probe.

Prüfung: neun Kernprüfungen, Typecheck, Build und Größenbudget bestanden;
französischer Download und Offline-Wiedergabe auf Desktop und Mobilansicht
(Chromium) bestanden. Vier DE/FR-Vorschauprüfungen bestätigen Untertitel,
Geschwindigkeit, Lesemodus, Abrufsperre und keine externen Medienrequests.
Die dekodierte Videotonspur ist mit der bestätigten Aufnahme identisch.
Keine GitHub Actions, kein Push oder Deployment.


## 2026-10-10 — Shared lively French voice

The user approved the new independent French VoiceDesign voice for all French courses. The story and long-word courses now use complete takes from that exact synthetic reference; all coach choices resolve to this shared French narration for these two courses. Other French courses remain pending replacement. Canonical lesson text is retained; `spokenText` records the actual narration.

Only silence at board changes is extended to about 1.5 seconds total (one second after the story greeting). Original PCM samples are preserved in order. Illustrated previews copy the registered AAC packets without re-encoding. No rejected later coach footage is included. Qwen3-TTS Base and VoiceDesign sources are recorded in the local manifest; no real-person voice reference or cross-voice name splice is used.

Validation: 10 narration/caption checks, typecheck/build/size, and two desktop/mobile offline story playback checks passed. The complete new takes remain subject to listening review; voice approval does not imply approval of every pronunciation. No deployment, push or Actions run.


## 2026-10-10 — French library batch completed

All twelve French courses now resolve to the same user-approved synthetic French reference for every coach selection. The ten remaining full takes replace the old active French narration; previous files are preserved. Four first takes were withheld and regenerated to correct triangle-area repetition, spoken fraction notation, and unclear wording. Canonical reading content stays intact; `spokenText` records the matching narration.

All ten illustrated drafts copy the registered AAC packets without re-encoding, with matching cue text and source notices. Title and purpose share one board for the French loci and self-explanation introductions because there is no safe silent boundary between them. The preview comparison button was repaired after the shared player template changed to `playVideo()`. These remain illustrated drafts without newly approved coach footage.

Local validation: 624 core tests, typecheck/build/size, eight desktop/mobile narration and offline tests, plus 22 French preview checks for subtitles, playback speed, reading mode, recall gate and zero external requests. Complete-recording listening and real-device checks remain open. No push, GitHub Actions, deployment, or merge.


## 2026-10-10 — Media packet audit

The preview inventory now verifies 35 illustrated drafts and 47 current preview links. Its 70 recorded browser checks retain their report dates; these are not claimed as a new full browser run. Twelve new French illustrated integration packets contain the current source hashes, source-specific credits, matching captions and 264 WebVTT files. Both full tracks and tracks restricted before the exercise boundary are validated. Eleven English review packets remain available; two obsolete DE/FR coach packets are explicitly excluded from the active index. No video catalog registration or subjective approval is inferred from packet preparation.
