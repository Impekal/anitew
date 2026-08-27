# Gesamt-Audit ANITEW

Stand: 27. August 2026 · Ausgangspunkt `b69bb8c` (Produktbranch `anitew-redesign-v2`,
einschließlich des Splash-Umbaus aus PR #86).

Auftrag: „Fehlersuche, kleine Dinge, Überlappungen, Schönheitsfehler, Feinheiten."

Vorgehen in drei Durchgängen: statisch über den Quelltext, im laufenden Browser
über alle erreichbaren Bildschirme (iPhone SE 375, iPhone 14 Pro 393, 320 und
430 px Breite, Schreibtisch 1280) und zuletzt über die Logik einzelner Module.
Jeder Befund unten wurde am laufenden Programm nachgemessen, nicht aus dem
Quelltext erschlossen. Jede Korrektur hat eine Gegenprobe: Der neue Test wurde
gegen den Stand **ohne** Korrektur laufen gelassen und musste dort rot werden.

---

## Behoben

### A-01 — Der Startbildschirm ließ sich seitlich schieben (P1)

Auf dem Telefon war die Seite breiter als der Bildschirm. Gemessen jeweils auf
dem fertigen Startbildschirm:

| Breite | Überlauf |
| --- | --- |
| 320 px | 27 px |
| 375 px (iPhone SE) | 31 px |
| 393 px (iPhone 14 Pro) | 28 px |
| 430 px | 11 px |

Ursache ist **kein** herausragender Inhalt, sondern die Zierschicht. Mehrere
Verläufe treten absichtlich über ihren Kasten hinaus — am deutlichsten
`.challenge::before` mit `inset: 8% -10% 24%`, dazu `.today::before` mit
`width: min(92vw, 640px)`. Das ist so gewollt: Ein Leuchten, das an der Kante
endet, sieht abgeschnitten aus. Nur darf daraus keine schiebbare Seite werden.

Korrektur: `html, body { overflow-x: clip }` in `src/styles.css`. Bewusst
`clip` und nicht `hidden` — `hidden` macht aus dem Wurzelelement einen
Scroll-Container und nimmt damit `position: sticky` die Grundlage. Nach der
Korrektur ist der Überlauf auf allen vier Breiten exakt 0.

### A-02 — Der Layout-Gate konnte diesen Fehler nicht sehen (P1)

Der wichtigere Teil des Befunds. `tests/e2e/layout.spec.ts` prüft seit Langem
auf waagerechten Überlauf, auf genau diesen Gerätebreiten — und blieb grün.

Der Grund liegt im Helfer `visit()`: Er ist auf Tempo gebaut, klickt den
Ankunftsbildschirm weg, sobald er da ist, und überspringt die Einführung.
Genau dieser Weg ist der einzige, auf dem die Seite nicht schiebt:

| Weg durch den Erstlauf | Überlauf (iPhone 14 Pro) |
| --- | --- |
| sofort weiterklicken — der bisherige Gate-Weg | 2 px |
| vier Sekunden auf dem Ankunftsbildschirm bleiben | **30 px** |
| die Einführung durchklicken statt überspringen | **25 px** |

Die lebende Schicht setzt ihre Verläufe erst, wenn der Startbildschirm fertig
steht. Der Gate maß also eine Seite, die noch nicht fertig angezogen war — und
damit einen Zustand, den kein Mensch je zu sehen bekommt.

Korrektur: ein zusätzlicher Test in `layout.spec.ts`, der sich die Zeit nimmt,
die ein Mensch sich nimmt, und über das Ankommen hinweg misst statt einmal.
Gegenprobe ohne die CSS-Korrektur: `iphone-se` und `iphone-15` rot (2 px und
20 px), `desktop-small` grün — genau das erwartete Bild.

### A-03 — Drei Eingabefelder ohne Beschriftung (P2)

`coach-key-input`, `remember-input` und `own-input` trugen nur einen
Platzhalter. Ein Platzhalter ist keine Beschriftung: Er verschwindet beim
Tippen und wird von Screenreadern nicht zuverlässig als Name des Feldes
gelesen (WCAG 4.1.2 und 3.3.2).

Korrektur: `aria-label` aus drei neuen Textbausteinen in `de.ts` und `en.ts`.

### A-04 — Impressum und Datenschutz waren 14 Pixel hoch (P2)

Auf **jedem** Bildschirm: 67 × 14 px und 75 × 14 px. Das liegt unter dem
Mindestmaß von 24 × 24 px aus WCAG 2.5.8 und weit unter dem, was ein Daumen
trifft. Die Schrift bleibt klein und zurückhaltend; nur die anfassbare Fläche
wächst über Polsterung auf 44 px.

### A-05 — „Schlüssel-Seite öffnen" war 17 Pixel hoch (P2)

Ein Link mitten im Fließtext und damit genauso hoch wie eine Zeile
(163 × 17 px). Gleiche Behandlung: Schrift unverändert, Fläche auf das
Mindestmaß gepolstert, ohne den Absatz auseinanderzuziehen.

### A-06 — Überschriftenränge sprangen von h1 auf h3 (P2)

Auf fast jeder Core-Seite fehlte die Ebene dazwischen — Start, Messung, Coach,
Mein Gedächtnis, Eigene Inhalte, Einstellungen. Auf dem Startbildschirm kam ein
h3 sogar **vor** dem ersten h2. Für einen Screenreader ist die
Überschriftenliste die Inhaltsangabe der Seite; eine übersprungene Ebene liest
sich wie ein fehlendes Kapitel (WCAG 1.3.1).

Korrektur: 22 Überschriften eine Stufe hoch. Die zugehörigen CSS-Selektoren
wurden mitgenommen (`.note h2`, `.standing h2`, `.claim h3`, `.wipe h2`), damit
sich am Bild nichts ändert — `.coach-source` legt Größe und Gewicht ohnehin
selbst fest.

### A-07 — Sieben tote Textbausteine (P3)

`resultTitle`, `ofItems`, `phaseImmediate`, `phaseAfter`, `phaseNextDay`,
`ownNote`, `wipeDone` standen in beiden Wörterbüchern, wurden aber nirgends
mehr gelesen. Entfernt.

---

## Gefunden, bewusst nicht geändert

### A-08 — 138 Exporte ohne Nutzer außerhalb ihrer Datei

55 Laufzeitwerte und 83 Typen. Der überwiegende Teil ist **kein toter Code**,
sondern ein unnötiges `export` vor einer Konstante, die nur im eigenen Modul
gebraucht wird (`FIELD_WIDTH`, `GAZE_PREFIX`, `WALK_SEPARATOR` und so weiter).
Aufräumen wäre reine Umbauarbeit ohne Gewinn — und ChatGPT arbeitet parallel am
selben Baum. Die Liste liegt vor und kann jederzeit abgearbeitet werden.

Einzeln geprüft wurden die Fälle, die auf einen echten Verdrahtungsfehler
hätten hindeuten können. `finishGoogleDriveRedirect` etwa wird über einen
dynamischen Import in `main.tsx` aufgerufen; `clearOptimizedSchedulerWeights`
wird beim Voll-Reset nicht gebraucht, weil `wipeEverything()` die ganze
Einstellungstabelle leert. Kein Fund.

### A-09 — Tap-Ziele zwischen 24 und 44 Pixeln

`sound-toggle` 63 × 30, `theme-choice` 108 × 40, die beiden Sprachauswahlen
102 × 34 und 115 × 34, `first-run-drive-connect` 287 × 42. Alle erfüllen das
AA-Mindestmaß (24 px), keines erreicht die 44 px aus Apples Richtlinie. Sie
größer zu machen zieht die Einstellungsleiste spürbar auseinander — das ist
eine Gestaltungsfrage, keine Fehlerbehebung. Vorschlag: im Mikropiloten
beobachten, ob jemand danebentippt.

### A-10 — Der Splash bleibt im DOM

`#anitew-launch` bleibt nach der Animation dauerhaft stehen
(`visibility: hidden`, z-index 99999). Er nimmt keine Eingaben mehr an, ist
also kein Fehler — aber auch nicht nötig. Nicht angefasst, weil der Splash
gerade aus anderer Hand umgebaut wurde (PR #86).

### A-11 — Die Stylesheet-Landschaft ist der eigentliche Risikofaktor

28 CSS-Dateien, rund 7.600 Zeilen, rund 870 `!important`. `.drawer` wird in 62
Regeln angefasst, `.start` und `.drawer-item` in je 20. A-01 ist kein Zufall,
sondern die erwartbare Folge: Wenn eine Zierschicht in Datei 19 eine Geometrie
setzt, die Datei 7 nicht kennt, fällt das niemandem auf. Eine Zusammenführung
ist eine eigene Aufgabe und nichts, was vor dem Piloten begonnen werden sollte.

---

## Ohne Befund

- **Sprachparität**: 539 Schlüssel in DE, 539 in EN, keine abweichenden
  Platzhalter, keine identischen Langtexte.
- **Konsole**: kein einziger Fehler auf allen geprüften Seiten.
- **Überlappungen und abgeschnittener Text**: keine. Frühere Treffer aus
  meinem eigenen Messwerkzeug waren Messfehler — Elemente hinter der offenen
  Schublade und ein `scrollHeight`, den ein rein zierendes `::after`
  aufgebläht hatte.
- **Quelltext**: kein TODO, FIXME oder HACK; kein `console.*` im Produktivcode.
- **„Alle Daten löschen"**: `wipeEverything()` deckt alle fünf Dexie-Tabellen
  ab — es bleibt nichts zurück.
- **Typprüfung**: sauber. **662 Unit-Tests**: grün.
