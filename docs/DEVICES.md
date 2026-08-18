# Gerätedurchgang — ANITEW auf echten Geräten

**Stand: 2026-08-18** · Backlog P6, P8

Zwei Sorten Prüfung, und sie ergänzen sich:

- **Was der Rechner prüft (automatisch):** Ob das *Layout* auf jeder Größe
  hält — iPhone SE, iPhone 14 Pro, iPad hoch und quer, Android-Tablet,
  Schreibtisch schmal und breit. Das läuft bei jedem `npm run test:e2e` mit
  (`tests/e2e/layout.spec.ts`, sieben Geräteprofile). Kein seitliches
  Schieben, Knöpfe im Rahmen, Einprägen passt, Desktop zentriert.
- **Was nur echte Geräte prüfen (von Hand, dieser Durchgang):** Die
  **Safari-Engine**, echte Berührungen, „Zum Home-Bildschirm“, der erste Ton
  nach dem ersten Tippen, Benachrichtigungsrechte, das Verhalten im
  Flugmodus. Das kann der Buildrechner nicht — dort ist nur Chromium, und ein
  emuliertes iPhone ist kein iPhone.

> **Diese Prüfung kostet nichts.** Es braucht **keine** Domain und **kein**
> Store-Konto — nur eine kostenlose Adresse, unter der die App läuft.

---

## Schritt 1: Die App kostenlos ins Netz stellen

Damit iPhone, iPad, Mac, Windows und Android **dieselbe** Fassung sehen,
braucht es eine Adresse. Cloudflare Workers gibt eine kostenlose
`*.workers.dev`-Adresse — keine Domain, keine Kosten.

1. Kostenloses Cloudflare-Konto anlegen.
2. *My Profile → API Tokens* → Vorlage **„Edit Cloudflare Workers“** → Token
   kopieren.
3. Im GitHub-Repo: *Settings → Secrets and variables → Actions* → neues Secret
   **`CLOUDFLARE_API_TOKEN`** mit dem Token.
4. Einmal auf den Arbeitszweig pushen (oder in *Actions* den Lauf „Deploy“ von
   Hand starten). Danach steht die Adresse im Lauf-Protokoll.

Fertig. Diese Adresse öffnest du auf jedem Gerät unten.

**Ohne Cloudflare, nur im eigenen WLAN:** `npm run build && npm run preview --
--host` zeigt eine Adresse im lokalen Netz (`http://192.168.x.x:4173`), die
Geräte im selben WLAN erreichen. Für „Zum Home-Bildschirm“ und Offline muss es
aber **HTTPS** sein — dafür ist der Cloudflare-Weg der richtige.

---

## Schritt 2: Auf jedem Gerät durchgehen

Überall gleich: Öffnen, eine 60-Sekunden-Einheit ganz durchspielen, dann die
Klappfächer am Fuß aufmachen. Achte auf das, was **je Gerät** danebensteht.

### iPhone (Safari) — der wichtigste Durchgang

- [ ] Nichts lässt sich seitlich schieben, kein Text klebt am Rand.
- [ ] Am oberen Rand läuft der Hintergrund unter die Uhr, aber **Titel und
      Text bleiben darunter** (sichere Ränder).
- [ ] Quer gehalten ragt nichts in die Kerbe.
- [ ] **Ton:** Beim ersten Tippen auf „Beginnen“ kommt der Ton — nicht erst
      beim zweiten. (iOS gibt keinen Ton ohne Berührung; genau das ist der
      Fall, den `sound.ts` abfängt.)
- [ ] Das Fach **„Auf den Startbildschirm“** ist da. Dem Weg folgen, ANITEW
      von dort starten — jetzt läuft es ohne Adressleiste, im Vollbild.
- [ ] Flugmodus an, ANITEW vom Startbildschirm öffnen: Es **läuft weiter**
      (offline).
- [ ] Bei **„Erinnerung“** steht, dass sie nur bei offener App gilt — und die
      Uhrzeit lässt sich wählen (das Zeit-Feld ist Safaris eigenes Rad).

### iPad (Safari)

- [ ] Wie iPhone. Zusätzlich: quer gehalten steht die Spalte **mittig**, nicht
      über die ganze Breite gezerrt.
- [ ] „Zum Home-Bildschirm“ funktioniert wie auf dem iPhone.

### Mac (Safari)

- [ ] Die Spalte steht mittig, der Rest ist ruhige Fläche — kein Text quer
      über den ganzen Schirm.
- [ ] Eine Einheit läuft, Ton kommt, alle Fächer öffnen sauber.
- [ ] „Ablage → Zum Dock hinzufügen“ legt ANITEW als App ab (optional).

### Windows (Chrome/Edge)

- [ ] Wie am Mac. In der Adressleiste erscheint ein **Installationszeichen**;
      installiert läuft ANITEW in einem eigenen Fenster.
- [ ] Mit der Tastatur bedienbar: Tab springt sichtbar von Knopf zu Knopf, im
      Abruf lässt sich frei tippen.

### Android-Telefon (Chrome)

- [ ] Nichts schiebt seitlich, die vier Zeitknöpfe stehen ohne Umbruch.
- [ ] Der Browser bietet **„App installieren“** an; installiert im Vollbild.
- [ ] Beim Zahlenmodul erscheint die **Zifferntastatur**, nicht die
      Buchstabentastatur.
- [ ] Flugmodus an → läuft weiter.

### Android-Tablet (Chrome)

- [ ] Wie das Telefon. Quer gehalten die Spalte mittig.

---

## Schritt 3: Was zurückkommt

Für jedes Gerät genügt **„läuft sauber“** oder eine kurze Zeile, **was**
klemmt und **wo** (Gerät, Hoch/Quer, welcher Bildschirm). Ein Bildschirmfoto
sagt mehr als eine Beschreibung.

Alles, was hier auffällt, wird — wo möglich — zu einem automatischen Test im
Layout-Durchlauf, damit es nicht ein zweites Mal passiert. Das ist die Regel
des ganzen Projekts: **Der Test liest ab, was das Gerät zeigt.**

---

## Der ehrliche Rest

Die Safari-Engine lässt sich hier nicht automatisch prüfen, weil der
Buildrechner nur Chromium hat. Zwei Dinge sind deshalb **allein** über den
Durchgang oben abgesichert und über nichts sonst: das Ton-Freischalten beim
ersten Tippen auf iOS und die Darstellung von `input[type=time]` und
`input[type=file]` (Sicherung einlesen) in echtem Safari. Wenn diese beiden
auf deinem iPhone und iPad sitzen, ist der Rest über die Layout-Matrix und die
138 Funktionsläufe abgedeckt.
