# Gerätedurchgang — ANITEW auf echten Geräten

**Stand: 2026-08-19** · Backlog P6, P8 · Die App ist live:
`https://anitew.impekaltech.workers.dev`

Zwei Sorten Prüfung, und sie ergänzen sich:

- **Was der Rechner prüft (automatisch):** Ob das *Layout* auf jeder Größe
  hält — iPhone SE, iPhone 14 Pro, iPad hoch und quer, Android-Tablet,
  Schreibtisch schmal und breit. Das läuft bei jedem `npm run test:e2e` mit
  (`tests/e2e/layout.spec.ts`, sieben Geräteprofile). Kein seitliches
  Schieben, Knöpfe im Rahmen, Einprägen passt, Desktop zentriert.
- **Was nur echte Geräte prüfen (von Hand, dieser Durchgang):** Die
  **Safari-Engine**, echte Berührungen, „Zum Home-Bildschirm“, der erste Ton
  nach dem ersten Tippen, Benachrichtigungsrechte, das Verhalten im
  Flugmodus — und neu: das **Google-Anmeldefenster** des Abgleichs in der
  installierten App. Das kann der Buildrechner nicht — dort ist nur
  Chromium, und ein emuliertes iPhone ist kein iPhone.

> **Diese Prüfung kostet nichts** und braucht kein Konto — nur die Geräte
> und die Adresse oben. Einzig der Abgleich-Punkt braucht dein Google-Konto.

---

## Der Durchgang je Gerät

Überall gleich, in dieser Reihenfolge:

1. Adresse öffnen → das **Ankommen** durchspielen (oder ehrlich
   überspringen — beides muss gehen).
2. Eine **60-Sekunden-Einheit** ganz durchspielen.
3. Das **Menü (☰)** öffnen und jede Seite einmal aufrufen.
4. Dann die Punkte, die **je Gerät** danebenstehen.

### iPhone (Safari) — der wichtigste Durchgang

- [ ] Nichts lässt sich seitlich schieben, kein Text klebt am Rand; quer
      gehalten ragt nichts in die Kerbe, Titel bleiben unter der Uhr.
- [ ] **Ton:** Beim ersten Tippen auf „Beginnen“ kommt der Ton — nicht erst
      beim zweiten. (iOS gibt keinen Ton ohne Berührung; genau das ist der
      Fall, den `sound.ts` abfängt.)
- [ ] **Einheit:** Bei Zahlen und Rückwärts erscheint die
      **Zifferntastatur**; die Rückwärts-Folge verschwindet nach kurzem
      Zeigen wirklich; beim Unterscheiden sind die zwei Wortknöpfe gut
      treffbar; ein Bild (Schirm, Hut …) ist scharf und die Farben klar
      unterscheidbar.
- [ ] **Eigene Inhalte:** Zwei Zeilen eintippen oder aus einer Notiz
      einfügen („Frage – Antwort“) — die Vorschau erscheint beim Tippen,
      Übernehmen legt die Karten an, die Tastatur verdeckt das Feld nicht.
- [ ] **Coach:** Die Anbieter-Auswahl lässt sich bedienen, der Link
      „Schlüssel-Seite öffnen“ öffnet die Seite. (Einen Schlüssel
      einzutragen ist fürs Gerät nicht nötig — das ist überall gleich.)
- [ ] **Abgleich (im Browser-Safari):** „Mit Google anmelden und
      abgleichen“ → Googles Fenster erscheint, danach steht die Meldung
      über den Drive-Stand da.
- [ ] Das Menü-Fach **„Auf den Startbildschirm“** ist da. Dem Weg folgen,
      ANITEW von dort starten — jetzt läuft es ohne Adressleiste im
      Vollbild.
- [ ] **Abgleich (vom Startbildschirm):** noch einmal „Jetzt abgleichen“.
      Das ist der heikelste Punkt des Durchgangs: In der installierten
      App öffnet iOS Anmeldefenster anders als im Browser. Wenn hier
      nichts erscheint oder ein leeres Fenster hängen bleibt → genau das
      melden.
- [ ] Flugmodus an, ANITEW vom Startbildschirm öffnen: Es **läuft
      weiter**, und die Coach-Hinweise aus den Zahlen stehen da (nur die
      freien Fragen und der Abgleich sagen ehrlich, dass das Netz fehlt).
- [ ] Bei **„Erinnerung“** steht, dass sie nur bei offener App gilt — und
      die Uhrzeit lässt sich wählen (das Zeit-Feld ist Safaris eigenes Rad).
- [ ] **Sicherung:** „Sicherung speichern“ legt eine Datei ab und
      „einlesen“ öffnet Safaris Dateiwahl (das ist einer der zwei Punkte,
      die nur echtes Safari zeigt).

### iPad (Safari)

- [ ] Wie iPhone. Zusätzlich: quer gehalten steht die Spalte **mittig**,
      nicht über die ganze Breite gezerrt.
- [ ] „Zum Home-Bildschirm“ und der Abgleich von dort — wie beim iPhone.

### Mac (Safari)

- [ ] Die Spalte steht mittig, der Rest ist ruhige Fläche.
- [ ] Eine Einheit läuft, Ton kommt, alle Menüseiten öffnen sauber.
- [ ] „Ablage → Zum Dock hinzufügen“ legt ANITEW als App ab (optional).

### Windows (Chrome/Edge)

- [ ] Wie am Mac. In der Adressleiste erscheint ein **Installationszeichen**;
      installiert läuft ANITEW in einem eigenen Fenster.
- [ ] Mit der Tastatur bedienbar: Tab springt sichtbar von Knopf zu Knopf,
      im Abruf lässt sich frei tippen, das Menü ist per Tastatur erreichbar.

### Android-Telefon (Chrome)

- [ ] Nichts schiebt seitlich, die vier Zeitknöpfe stehen ohne Umbruch.
- [ ] Der Browser bietet **„App installieren“** an; installiert im Vollbild.
- [ ] Zahlen/Rückwärts: **Zifferntastatur**. Eigene Inhalte: Einfügen aus
      der Zwischenablage funktioniert.
- [ ] Abgleich einmal im Browser und einmal installiert.
- [ ] Flugmodus an → läuft weiter.

### Android-Tablet (Chrome)

- [ ] Wie das Telefon. Quer gehalten die Spalte mittig.

---

## Was zurückkommt

Für jedes Gerät genügt **„läuft sauber“** oder eine kurze Zeile, **was**
klemmt und **wo** (Gerät, Hoch/Quer, welcher Bildschirm, im Browser oder
installiert). Ein Bildschirmfoto sagt mehr als eine Beschreibung.

Alles, was hier auffällt, wird — wo möglich — zu einem automatischen Test,
damit es nicht ein zweites Mal passiert. Das ist die Regel des ganzen
Projekts: **Der Test liest ab, was das Gerät zeigt.**

---

## Der ehrliche Rest

Die Safari-Engine lässt sich nicht automatisch prüfen, weil der
Buildrechner nur Chromium hat. Drei Dinge sind deshalb **allein** über
diesen Durchgang abgesichert und über nichts sonst:

1. das Ton-Freischalten beim ersten Tippen auf iOS,
2. `input[type=time]` (Erinnerung) und `input[type=file]` (Sicherung
   einlesen) in echtem Safari,
3. das Google-Anmeldefenster des Abgleichs in der **installierten** App —
   Googles Skript und iOS-Fensterverhalten lassen sich nicht ehrlich
   nachbauen.

Sitzen diese drei auf deinem iPhone und iPad, ist der Rest über die
Layout-Matrix und die gut 230 Funktionsläufe abgedeckt.
