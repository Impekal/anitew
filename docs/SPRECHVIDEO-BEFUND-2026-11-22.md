# Sprechvideo: der Engpass sitzt vermutlich im Ausgangsbild

Stand 22.11.2026. Untersucht von der Cloud-Sitzung
`session_01RYGV8aVRDTefGWBW3Nrhoo`, ohne GPU und ohne Zugriff auf die
lokalen Videoversuche — also ausschließlich an dem, was im Projekt liegt.

## 1. Was bisher versucht wurde, und das gemeinsame Muster

Drei Modelle, drei Anläufe, **ein** Befund:

| Modell | berichteter Fehler |
|---|---|
| MultiTalk | verschmolzene Zähne, **zu geringe Mundöffnung** |
| MuseTalk (Q4) | **Bart- und Lippenverlust** |
| SoulX-FlashHead Pro | **zu geringe Mundöffnung**, besonders gegen Satzende |

Jedes Mal wurde das Modell gewechselt. Dass dreimal dasselbe herauskommt,
spricht dafür, dass die Ursache **nicht** im Modell liegt.

## 2. Das Ausgangsbild, das bisher niemand vermessen hat

`public/coaches/rafael.webp` ist Atta (die Kennung heißt `rafael`, der
Anzeigename „Atta"). Das Porträt zeigt einen älteren Mann mit **dichtem
weißem Vollbart und Schnurrbart**. Die Oberlippe ist vom Schnurrbart
weitgehend verdeckt.

Für ein lippensynchronisierendes Modell ist das der schwierigste Fall: Der
Mundrand, den es finden muss, ist nur eine von hunderten waagerechten
Hell-Dunkel-Kanten im Bart.

Gemessen am Mundausschnitt (36–62 % Breite, 42–58 % Höhe des Bildes), je
Bildzeile der mittlere senkrechte Helligkeitssprung:

| Porträt | Spitze (Mundlinie) | Grundrauschen | Verhältnis |
|---|---|---|---|
| **rafael / Atta** (Vollbart) | 12,92 | **9,86** | **1,31** |
| lin / Lin (bartlos) | 6,56 | 4,21 | **1,56** |
| original / Noah | 11,45 | 8,05 | 1,42 |

Der Bart **verdoppelt das Grundrauschen** um den Mund, und Attas Mundlinie
hebt sich von allen dreien am wenigsten ab.

**Das ist ein Hinweis, kein Beweis.** Das Maß ist grob, der Ausschnitt nach
Augenschein gesetzt, und der Abstand 1,31 zu 1,56 ist nicht groß. Es sagt
nur: Die Vermutung ist mit den Daten vereinbar und verdient einen Versuch.

## 3. Der Versuch, der es entscheidet — und er kostet einen Durchlauf

`public/coaches/lin.webp` ist **bartlos**, im selben Stil, derselben
Umgebung, demselben Bildausschnitt und derselben Auflösung (1254 × 1254).
Eine bessere Kontrollbedingung gibt es nicht.

> **SoulX einmal mit Lins Porträt laufen lassen, mit genau derselben
> deutschen Tonspur, die bei Atta zu wenig Mundöffnung ergab.**

- **Lins Mund öffnet sich deutlich weiter** → der Bart ist die Ursache.
  Dann liegt die Lösung im Bild, nicht im Modell: ein Porträt mit freierer
  Mundpartie, oder ein eng auf den Mund zugeschnittener Durchlauf.
- **Lins Mund bleibt ebenfalls gedämpft** → das Bild ist entlastet, und
  die Suche geht am Modell oder am Ton weiter.

Gemessen wird mit dem Werkzeug aus derselben Sitzung (Mundbereich über die
zeitliche Streuung finden, dunkle Fläche je Bild zählen, **auf die
Mundbreite** normieren — nicht auf die Kastenhöhe, die entsteht aus der
Bewegung selbst). Es ist an einem Testvideo mit bekannter Öffnung geeicht:
40 px und 16 px wurden als 40,0 px und 16,0 px wiedergefunden.

## 4. Bereits geprüft und ausgeschlossen

- **Der Ton ist nicht das Problem, soweit die Lautstärke betroffen ist.**
  Alle neun Synthese-Varianten liegen in Dynamik (27,3–29,8 dB),
  Scheitelfaktor (9,8–11,8 dB) und Hüllkurvenbewegung dicht beieinander.
  Die deutschen Bänder sind **nicht** flacher als die englischen oder
  französischen. Sie liegen als 24 kHz AAC mono bei 90–98 kbit/s vor.
- **Es fehlen keine Stimmen.** Siehe Abschnitt 5.

## 5. Richtigstellung: die Stimmen sind vollständig

In einer früheren Fassung dieser Untersuchung stand, Atta habe kein
englisches Band und dem voreingestellten Coach fehlten zehn deutsche Kurse.
**Beides war falsch.** Der Fehler: gelesen wurde
`coach-narration-manifest.json` — eine Herkunftsliste — statt
`src/i18n/courseNarrations.ts`, den Katalog, den die App tatsächlich
benutzt. Das Manifest führt zehn deutsche Dateien unter der Kennung `atta`,
der Katalog dieselben Dateien unter `rafael`. Es sind **dieselben
Dateien**; alle zehn Pfade stimmen überein.

Der tatsächliche Stand im Katalog, 84 Einträge, jede Datei auf der Platte
vorhanden:

| Coach | de | en | fr |
|---|---|---|---|
| rafael / **Atta** (Voreinstellung) | 12/12 | 12/12 | 12/12 |
| lin / Lin | 12/12 | 12/12 | 12/12 |
| original / Noah | — | 12/12 | — |

Atta spricht also **jeden** Kurs in **allen drei** Sprachen. Die einzige
Lücke ist Noah außerhalb des Englischen, und die ist plausibel beabsichtigt.

Lehre daraus: Die Herkunftsliste und der Auslieferungskatalog benennen
denselben Coach verschieden. Wer eine Aussage über das Produkt treffen
will, liest den Katalog.

## 6. Was in der Cloud nicht geht

Diese Sitzung hat **keine GPU** (`/dev/nvidia*` fehlt), vier Rechenkerne,
und `huggingface.co` ist durch die Netzregeln gesperrt. Modelle lassen sich
weder laden noch rechnen. Die Videoerzeugung gehört auf den Mac; von hier
kommen Befund, Maß und Versuchsplan.

---

# NACHTRAG 22.11.2026 — der Befund oben ist widerlegt

Die Sitzung auf dem Mac hat Messwerte gefunden, die es schon gab. Sie
widerlegen Abschnitt 2 und 3 dieses Dokuments:

| Durchlauf | Mittel | Maximum | Satzende |
|---|---|---|---|
| Atta, TTS-Ton | 3,5 | 5,2 | **2,9** |
| Atta, HeyGen-Ton | 7,9 | 9,4 | **8,2** |

**Dasselbe bärtige Porträt in beiden Fällen.** Mit anderem Ton öffnet sich
derselbe Mund mehr als doppelt so weit. Der Bart erlaubt also 7,9 — er ist
nicht der Engpass. Die Vermutung oben ist damit erledigt, und der
vorgeschlagene Versuch mit Lins Porträt ist hinfällig.

**Der Ton ist der Engpass, und zwar am Satzende.** 2,9 gegen 8,2 ist fast
das Dreifache und trifft genau das seit Wochen gemeldete Symptom.

## Nachgemessen am Band im Projekt

`atta-story-de-74d05d37735a.m4a`, 21 Sätze, Hüllkurve je Videobild,
letztes Fünftel jedes Satzes gegen seine Mitte:

```
Satz 1   -10,3 dB
Satz 2   -10,1 dB
Satz 3    -3,2 dB
…
über alle 21 Sätze: Mitte -22,4 dB, Ende -25,3 dB, mittlerer Abfall -2,9 dB
```

Die Stimme verhaucht am Satzende, bei kurzen Sätzen auf ein Drittel. Ein
tonbasiertes Modell folgt dieser Hüllkurve und schließt den Mund. Es macht
dabei keinen Fehler — es bildet ab, was es hört.

**Was damit noch nicht gezeigt ist:** Auch natürliche Sprache wird gegen
Satzende leiser. Ob die Synthese *stärker* abfällt als die HeyGen-Spur,
lässt sich nur durch dieselbe Messung an der HeyGen-Spur entscheiden. Die
liegt nicht in diesem Repository.

## Nächster Schritt, und er kostet keinen Durchlauf

1. Dieselbe Satzende-Messung auf der HeyGen-Tonspur. Fällt sie deutlich
   weniger ab, ist die Ursache benannt.
2. Dann die TTS-Spur entsprechend behandeln — Lautheit nachführen, damit
   Satzenden nicht verhauchen — und **einen** Durchlauf damit.
3. Erreicht er die Größenordnung des HeyGen-Durchlaufs, liegt die Behebung
   in der Tonstufe. Das wäre billig und gälte für alle 84 Bänder.

## Lehre

Abschnitt 2 war eine Vermutung aus einem Standbild, ohne Gegenprobe. Die
Gegenprobe gab es bereits, sie lag nur in einem anderen Verzeichnis. Erst
suchen, was schon gemessen wurde.
