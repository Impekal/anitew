# ANITEW installieren

Backlog Q5 · Stand 2026-08-18

ANITEW ist eine Webanwendung und läuft in jedem modernen Browser. Sie **auf
den Startbildschirm zu legen** ist trotzdem mehr als Bequemlichkeit — auf iOS
entscheidet es darüber, ob die Trainingsgeschichte erhalten bleibt.

---

## Warum überhaupt

| | Im Browser | Vom Startbildschirm |
|---|---|---|
| Läuft ohne Netz | ja | ja |
| Vollbild ohne Adressleiste | nein | ja |
| **Speicher auf iOS** | **kann nach sieben Tagen ohne Benutzung geräumt werden** | bleibt |
| Speicher auf Android/Desktop | bleibt | bleibt |

Die dritte Zeile ist der Grund, warum die App auf iPhone und iPad von sich aus
darauf hinweist — und **nur dort**. Anderswo ist es ein Angebot, keine
Warnung; die Einladung des Browsers reicht.

Was in jedem Fall gilt: **Die Sicherung ist der zweite Weg** (N2). Wer sie
regelmäßig speichert, hat seine Geschichte als Datei bei sich, und kein
Aufräumen der Welt kommt daran.

## iPhone und iPad (Safari)

1. ANITEW in Safari öffnen.
2. In der Leiste unten auf das **Teilen-Zeichen** tippen (Quadrat mit Pfeil
   nach oben).
3. **„Zum Home-Bildschirm“** wählen und bestätigen.
4. ANITEW ab jetzt von dort starten.

Andere Browser auf iOS (Chrome, Firefox, Edge) benutzen dieselbe Engine, haben
aber teils keinen eigenen Eintrag dafür — der Weg über Safari ist der
verlässliche.

## Android (Chrome und Verwandte)

Der Browser bietet es von sich aus an („App installieren“ oder „Zum
Startbildschirm hinzufügen“). Wenn nicht, steht der Eintrag im Menü mit den
drei Punkten.

Später wird es ANITEW zusätzlich als Paket im Play Store geben (Backlog
Q1–Q4). An der App ändert das nichts — es ist dieselbe, nur anders
ausgeliefert.

## Desktop

Chrome, Edge und Verwandte zeigen ein Installationszeichen in der Adressleiste.
Safari auf dem Mac: „Ablage → Zum Dock hinzufügen“.

## Was die Installation **nicht** tut

- Sie legt kein Konto an und fragt nach nichts.
- Sie legt kein Konto an und überträgt keine Trainingsdaten. Der einzige Servercode ist ein kleiner Endpunkt für die freiwillige Google-Anmeldung und die Push-Zustellung — ohne Nutzerdatenbank (siehe `PRIVACY.md`).
- Sie ändert nichts an deinen Daten: Sie liegen im selben Speicher wie vorher,
  nur unter einem anderen Dach.
