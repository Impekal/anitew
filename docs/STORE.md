# Store- und Marketingtexte

> **F7 · gebunden an F1–F6.** Jeder Satz in diesem Dokument darf entweder
> beschreiben, **was die App tut**, oder wiedergeben, **was gemessen wurde**.
> Ein dritter Fall ist nicht vorgesehen.

Dieses Dokument ist die einzige Quelle für alles, was ANITEW über sich selbst
sagt, wo der Nutzer die App noch nicht offen hat: Store-Eintrag, Webseite,
Bildunterschriften, geteilte Sätze. Die Texte *in* der App stehen in
`src/i18n/`; wo beide dasselbe behaupten, gilt dieselbe Regel.

---

## Die drei Prüffragen

Bevor ein Satz hier hineingeschrieben wird:

1. **Steht die Zahl fest?** Jede Zahl muss aus der Messung stammen (F1, F3)
   oder eine Eigenschaft der App sein („20 Wörter“, „5 Minuten“). Eine Zahl
   über den Nutzer, die niemand erhoben hat, gibt es nicht (R-1).
2. **Verspricht der Satz einen Transfer?** „Du merkst dir Namen besser“ ist
   ein Versprechen über den Alltag, und den hat niemand gemessen (F4,
   `science.everyday`). Erlaubt ist, was die App *tut*: „bringt dir die
   Technik bei“.
3. **Ist es ein Gesundheitsversprechen?** Dann fällt es raus, ohne Diskussion
   (R5). Siehe die Sperrliste unten.

Die Sperrliste ist kein Vorsatz, sondern ein Test:
`tests/core/claims.test.ts` liest die Marketingflächen — dieses Dokument,
`index.html`, das Manifest in `vite.config.ts` und die Texte in `src/i18n/` —
und wird rot, wenn ein gesperrter Ausdruck darin auftaucht.

---

## Deutsch

### Name

**ANITEW**

### Kurzbeschreibung (Play Store, max. 80 Zeichen)

> Gedächtnis ist Technik, kein Talent. Fünf Minuten am Tag.

### Untertitel (App Store, max. 30 Zeichen)

> Merken kann man lernen

### Vollständige Beschreibung

> **Gedächtnis ist Technik, kein Talent.**
>
> Merken ist eine Fertigkeit. ANITEW bringt sie dir bei — in fünf Minuten am
> Tag, an Namen, Gesichtern, Zahlen und kleinen Szenen.
>
> **Was die App tut**
>
> Sie fragt ab, statt vorzuzeigen: Etwas aus dem Kopf zu holen ist der
> Lernvorgang selbst, Wiederlesen fühlt sich nur besser an. Sie plant die
> Wiederholung, statt dich üben zu lassen, bis es sitzt — verteilt über Tage
> bringt derselbe Aufwand deutlich mehr. Und sie bringt dir Merktechniken
> bei, mit denen aus Ziffern Bilder werden.
>
> **Was die App misst**
>
> Alle zwei Wochen eine Messung: zwanzig Wörter, drei Minuten. Diese Wörter
> kommen im Training nie vor — sonst würde die Messung nur zeigen, wie oft du
> deine eigenen Testwörter geübt hast. Gezählt wird, wie viele davon am
> Folgetag noch da sind.
>
> Die ersten beiden Messungen zählen als Eichung, weil man auch besser wird,
> indem man sich an den Ablauf gewöhnt. Ab der dritten steht eine Zahl da —
> und zwar nur dann, wenn sie sich von Zufall unterscheiden lässt. Sonst
> steht dort: kein Unterschied. Verglichen wirst du mit dir selbst, nie mit
> anderen.
>
> **Was die App nicht behauptet**
>
> Dass sie dich klüger macht. Dass sie dein Gedächtnis im Alltag verbessert.
> Beides ist nicht belegt, und für diese App hat es niemand gemessen — auch
> wir nicht. In der App gibt es eine Seite, auf der genau das steht, mit
> Quellen.
>
> **Ohne alles**
>
> Ohne Konto, ohne Werbung, ohne Tracker. Alles bleibt auf
> deinem Gerät; die Sicherung ist eine Datei, die dir gehört. Läuft offline.
> Der Kern ist und bleibt kostenlos.

### Bildunterschriften

| # | Bild | Text |
|---|---|---|
| 1 | Startbildschirm | „Fünf Minuten. Oder sechzig Sekunden, wenn nur die sind.“ |
| 2 | Einprägen | „Zeigen, dann fragen — abrufen ist das Training.“ |
| 3 | Merktechnik | „Aus 4–7 wird r–k. Welches Bild du daraus machst, ist deins.“ |
| 4 | Messung | „Zwanzig Wörter, die im Training nie vorkommen.“ |
| 5 | Ergebnis | „Eine Zahl steht nur da, wenn sie sich vom Zufall trennen lässt.“ |
| 6 | Wissenschaftsseite | „Was belegt ist — und was nicht.“ |

---

## English

### Short description (Play Store, max. 80 characters)

> Memory is a skill, not a gift. Five minutes a day.

### Subtitle (App Store, max. 30 characters)

> Remembering is learnable

### Full description

> **Memory is a skill, not a gift.**
>
> Remembering is a craft. ANITEW teaches it to you — five minutes a day, on
> names, faces, numbers and small scenes.
>
> **What the app does**
>
> It asks instead of showing: pulling something out of your head is the
> learning event itself, rereading merely feels better. It schedules the
> review instead of letting you drill — the same effort spread over days does
> markedly more. And it teaches you mnemonic techniques that turn digits into
> pictures.
>
> **What the app measures**
>
> Every two weeks, a measurement: twenty words, three minutes. Those words
> never appear in training — otherwise the measurement would only show how
> often you had practised your own test words. What is counted is how many of
> them are still there the next day.
>
> The first two measurements count as calibration, because you also improve
> simply by getting used to the format. From the third onwards a number
> appears — and only if it can be told apart from chance. Otherwise it says:
> no difference. You are compared with yourself, never with other people.
>
> **What the app does not claim**
>
> That it makes you cleverer. That it improves your memory in everyday life.
> Neither is established, and for this app nobody has measured it — us
> included. There is a page inside the app that says exactly that, with
> sources.
>
> **Without all of it**
>
> No account, no ads, no trackers. Everything stays on your
> device; the backup is a file that belongs to you. Works offline. The core
> is free and stays free.

---

## Woher jeder Anspruch kommt

Die Tabelle ist der eigentliche Inhalt von F7. Wer einen Satz ändert, muss
seine Zeile hier ändern können — geht das nicht, ist der Satz nicht belegt.

| Aussage im Text | Deckung |
|---|---|
| „Merken ist eine Fertigkeit, ANITEW bringt sie bei“ | D5, G · `science.mnemonics` (eng belegt) |
| „fragt ab, statt vorzuzeigen“ | C5, B2 · `science.retrieval` |
| „plant die Wiederholung“ | C1–C3 · `science.spacing`, `science.forgetting` |
| „zwanzig Wörter, drei Minuten, alle zwei Wochen“ | F2 — Eigenschaft der App, keine Aussage über den Nutzer |
| „kommen im Training nie vor“ | F2a, per Test gegen den Trainingswortschatz geprüft |
| „erste beide als Eichung“ | F2b |
| „nur, wenn sie sich von Zufall unterscheiden lässt“ | F3 — die Spanne aus zwei Standardfehlern |
| „mit dir selbst, nie mit anderen“ | F3 |
| „macht nicht klüger“ | `science.brainTraining` (nicht belegt) |
| „im Alltag hat es niemand gemessen“ | `science.everyday` (nicht gemessen) · F4, R-2 |
| „ohne Konto, offline“ | N1, A-Reihe — Eigenschaft der App |
| „Kern bleibt kostenlos“ | D-002 |

## Sperrliste (R5)

Diese Ausdrücke kommen in keinem Text vor, in keiner Sprache, auf keiner
Fläche — sie sind entweder Heilversprechen oder Behauptungen, die ANITEW nicht
belegen kann:

- Demenz, Alzheimer, heilt, Heilung, Therapie, therapeutisch
- dementia, cure, cures, therapy, therapeutic
- garantiert, guaranteed
- wissenschaftlich bewiesen, scientifically proven, klinisch
- doppelt so viel, twice as much, X‑mal besser

„Belegt“ ist erlaubt und steht auf der Wissenschaftsseite — mit Quelle daneben.
„Bewiesen“ ist es nicht: In dieser Sache beweist niemand etwas, und ein Wort,
das mehr behauptet als die Studienlage hergibt, ist derselbe Fehler wie eine
erfundene Zahl.
