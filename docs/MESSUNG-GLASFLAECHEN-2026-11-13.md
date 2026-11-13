# Ganzflächige Glasflächen: gemessen, Ergebnis „nicht anfassen"

Stand 13.11.2026, auf `anitew-v4-2-living-memory` nach der Zusammenführung
(`813670f`). **Dieses Dokument begründet eine Nicht-Änderung.** Es steht
hier, damit niemand — auch nicht der Verfasser in zwei Wochen — auf
Grundlage von Container-Zahlen an einer Gestaltung dreht.

## 1. Die Hitze-Behebung hält, in der Wirkung

Der Commit `44dccb6` („Preserve Claude heat fixes") behauptet im Wortlaut,
die Behebungen aus `dde55d9` und `544c316` seien erhalten. Geprüft wurde die
**Wirkung**, nicht die Formulierung:

| | gemessen |
|---|---|
| Startbildschirm, CPU 6-fach gedrosselt, 412 × 915 | **59,9 fps** |
| Kontrolle: leere Seite, gleiche Drosselung | 60,3 fps |

Positivkontrolle — dieselben Filter zur Laufzeit wieder eingesetzt:

| | fps |
|---|---|
| Ist-Zustand | 59,9 |
| `body::after { filter: blur(25px) }` zurück | 42,5 |
| zusätzlich `.neural { drop-shadow(...) }` zurück | **20,4** |

Der Messaufbau beißt also. Die 59,9 sind ein Ergebnis, keine Decke.

## 2. Kursvideos kosten nichts

Weg: Startbildschirm → Lernkurse → Kurs „Begriffe durch Geschichten
verbinden" → Anhören und ansehen → Format `video`, Sprache `de`.

| | fps |
|---|---|
| Startbildschirm | 59,9 |
| Kurs, Lesefassung | 60,0 |
| Video geladen, angehalten | 59,9 |
| **Video läuft** (960 × 540, Abspielzeit erreicht) | **60,1** |

Die Fassung mit Videos und Ton hat das Bildbudget, das die Hitze-Behebung
freigeräumt hat. Nichts davon wird vom Abspielen wieder ausgegeben.

## 3. Zwei ganzflächige Glasflächen — und warum sie bleiben

Die App hat genau zwei Flächen mit `backdrop-filter` über dem ganzen Schirm:

| Fläche | Filter | wann sichtbar |
|---|---|---|
| `.first-run-guide-veil` | `blur(2px)` | nur beim ersten Besuch |
| `.drawer-veil` | `blur(24px) saturate(1.16)` | bei **jeder** Menüöffnung |

Gemessen in diesem Container (frischer Browser je Messung, abwechselnd,
Mediane):

| | mit Glas | ohne Glas | Preis |
|---|---|---|---|
| Erstbesuch-Führung | 33,9 fps | 59,7 fps | 25,8 fps |
| Schublade offen | 31,8 fps | 56,5 fps | **24,7 fps** |

Sichtbarkeit, Pixel gegen Pixel bei angehaltener Bewegung:

| | Mittel | größte | geänderte Kanäle |
|---|---|---|---|
| Führungs-Schleier | 0,562 | **42** von 255 | 18 % |
| Schubladen-Glas | 0,013 | 12 von 255 | 1 % |

**Trotzdem wird nichts geändert.** Der Grund ist stärker als diese Zahlen:

1. Dieser Container rastert in Software — `ANGLE (SwiftShader)`, keine GPU.
   Ein ganzflächiger `backdrop-filter` kostet hier ~25 fps, **auch wenn
   dahinter nichts in Bewegung ist**. Auf einem Telefon rechnet die GPU das.
2. Die Live-Fassung trägt dasselbe Schubladen-Glas
   (`src/anitew-redesign.css`: `.drawer-veil { backdrop-filter: blur(18px) }`).
3. Der Nutzer hat am 13.11. die Live-App geöffnet, einen Screenshot **des
   geöffneten Menüs** geschickt — also mit genau diesem Glas auf dem Schirm
   — und berichtet: „ist nicht heiß".

Das Gerät hat damit entschieden, nicht die Messung. Wer diese Flächen
künftig anfassen will, braucht eine **Gerätemessung**, nicht eine aus diesem
Container.

## 4. Zwei eigene Korrekturen

**Erstens: Der Mechanismus war falsch angenommen.** Die Erwartung war, ein
`backdrop-filter` sei teuer, weil er **bewegte** Inhalte in jedem Bild neu
abtastet — und es genüge, die Bewegung dahinter anzuhalten. Gemessen
(frischer Browser je Messung, Reihenfolge rotierend, 4 Runden):

| | Median |
|---|---|
| ohne Eingriff | 33,9 fps |
| Bewegung dahinter angehalten | 37,5 fps (**+3,6**) |
| Weichzeichner entfernt | 59,7 fps (**+25,8**) |

Die Bewegung dahinter ist also fast nebensächlich; die Fläche selbst kostet.
Das ist das Gegenteil des Befundes vom September, wo ein `filter` über einem
bewegten Teilbaum teuer war und über einem stillen nichts kostete. `filter`
und `backdrop-filter` verhalten sich hier verschieden.

**Zweitens: Einzelmessungen taugen auf dieser Maschine nicht.** Für denselben
Zustand kamen 47,4 / 45,1 / 35,9 fps heraus. Erst gepaarte, abwechselnde
Messungen mit frischem Browser und Medianen über mehrere Runden waren
belastbar. Eine zwischenzeitlich notierte Zahl von „+20 fps" für das
Anhalten der Bewegung war ein solcher Einzelschuss und ist falsch; richtig
sind +3,6.

## 5. Nicht verallgemeinern

Die Schranke „ein Achtel Telefonschirm" aus dem Wächter in
`tests/e2e/performance.spec.ts` gilt weiter für `filter` über **bewegten**
Teilbäumen — dort ist sie am Gerät bestätigt. Für `backdrop-filter` gilt sie
nicht, und ein Wächter darauf wäre nach heutigem Wissen ein Wächter gegen
ein Nicht-Problem. Deshalb wurde keiner hinzugefügt.
