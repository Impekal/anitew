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
