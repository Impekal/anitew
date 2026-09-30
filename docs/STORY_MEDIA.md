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

Die drei Hauptsprachen erhalten Untertitel zum tatsächlich gesprochenen
Beispiel. Wort-, Schlüsselwort- und Major-Beispiele unterscheiden sich je
Tonspur; ihre Lernwörter werden beim Sprachwechsel erhalten. Fehlende weitere
Übersetzungen werden ausdrücklich angezeigt. Ein erster lokaler M2M100-Versuch
wurde wegen falscher Fachbegriffe und übersetzter Lernwörter verworfen.

Die Lesefassung bleibt verfügbar. Medienwahl, Sprache und Geschwindigkeit
werden gespeichert; sie starten keine automatische Wiedergabe. Die Übung
verwendet das zuvor gehörte Beispiel. Die höheren Kursstufen haben neue
Leseübungen und eigenes Material, keine irreführend wiederverwendete Beispieltonspur.
