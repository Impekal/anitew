# ANITEW translation workflow

ANITEW follows decision D-007: **German is the source language for interface prose.** Other interface languages are translations of that source. Training content pools are a separate concern and are never produced by mechanically translating the UI or another language's training pool.

This file is the maintenance contract for L8. It is deliberately procedural so a new language cannot quietly grow a second, incompatible source of truth.

## 1. Source of truth

- New or changed interface copy is written in the German dictionary first.
- Existing translated dictionaries follow the German key structure. The TypeScript shape derived from the German source remains the compile-time guard against missing or invented keys.
- Do not introduce user-facing prose directly in React/CSS when it belongs in the dictionary. Technical identifiers, provider names and externally fixed product names are exceptions.
- A translation may be idiomatic; it must preserve the meaning and evidential strength of the German source. In particular, R-1/R-2 language must never become stronger in translation.

## 2. One change, one translation pass

For every interface-copy change:

1. Change the German source text/key.
2. Run typecheck immediately. A missing key in another dictionary is a build failure, not a runtime fallback.
3. Update every currently shipped interface language in the same change when a competent translation is available.
4. If a language cannot be reviewed to release quality yet, do not advertise that interface language as complete. Record the gap instead of inserting machine-translated filler and calling it finished.
5. Run the relevant browser test when layout, directionality, labels or accessible names can change.

## 3. Interface language is not training language

Keep these two layers separate:

- **Interface language:** menus, explanations, buttons, consent/privacy copy and coach UI.
- **Training language:** words, names, missions, palace objects, benchmark quarantine items and other material whose cultural or linguistic properties affect the task itself.

A training language is enabled only when its own content pools are complete and validated. Do not create a new training language by translating German lists one-to-one. Item IDs continue to carry the training language so scheduling histories cannot collide across languages.

## 4. Review rules

Before an interface language is called complete:

- A fluent reviewer checks the full visible flow, not only the dictionary file.
- Scientific/measurement wording is checked against the German source and the claims rules. Percentages, uncertainty, benchmark wording and statements about memory must remain equally cautious.
- Privacy and BYOK wording must name the same data flows and providers as the source.
- Buttons and labels are checked on a narrow phone viewport for truncation/wrapping.
- Screen-reader labels and visible labels must stay semantically aligned.

Machine translation may be used as a draft aid only. It is not release validation.

## 5. RTL and CJK

Arabic and other RTL interfaces require an actual layout pass after translation: document direction, logical margins/padding, icon direction where semantic, focus order and mixed LTR tokens such as numbers or API names.

Japanese/Chinese support additionally requires checking line breaking, system font fallback and free-recall input/IME behaviour. These are product tests, not dictionary-completeness checks.

Konkrete, im Code verifizierte Blocker (Stand 2026-08-26, Review):

- **TR:** `grading.ts` nutzt locale-unabhängiges `toLowerCase()` — `IŞIK`/`ışık` werden falsch gewertet (Fix: `toLocaleLowerCase(language)` durchreichen). One-Edit-Leniency ist bei agglutinierenden Suffixen zu großzügig zu prüfen.
- **AR:** Ta marbuta (`ة`/`ه`) und Alef maqsura (`ى`/`ي`) werden nicht gefaltet; Tatweel überlebt die Normalisierung; arabisch-indische Ziffern (`٣١٤`) scheitern an ASCII-`\d` in `numbers.ts`; `rememberThis` erkennt ohne Großbuchstaben keine Kandidaten; RTL-Layout: 0 von 27 Stylesheets nutzen logische Richtungen, kein `[dir]`-Selektor, kein RTL-E2E.
- **ZH/JA:** `splitEntries` kennt weder Fullwidth- (`，`) noch ideografisches Komma (`、`) — freier Abruf unbenutzbar; Typo-Leniency-Schwelle (≥5 Zeichen) ist eine Latin-Annahme; keine Kana-Faltung (JA); Fullwidth-Ziffern scheitern; Missions-Wortstellung ist ein binärer Latin-Schalter; `own.ts`-Trenner verlangen ASCII. Erst `Intl.Segmenter`-basiertes Splitting und schriftspezifische Leniency machen diese Sprachen tragfähig.
- **NL:** keine technischen Blocker — reiner Inhalts- und Review-Aufwand.

## 6. Adding a new interface language

A new interface language is accepted only when all of the following are true:

- the locale is represented in the language-selection model;
- the dictionary satisfies the German source shape under TypeScript;
- the complete main flow has been reviewed in-browser;
- accessibility names have been checked;
- any RTL/CJK-specific acceptance work is complete;
- the language is covered by at least one end-to-end smoke path before it is advertised as supported.

## 7. Removing or changing keys

Never leave compatibility aliases in user-facing dictionaries just to silence TypeScript. Rename/remove the German key and all translations in the same change. If persisted data stores a language-independent identifier, keep that identifier stable and change only its presentation text.

## 8. What this process prevents

This workflow specifically prevents:

- German and English independently becoming competing source texts;
- a missing translation silently falling back to unrelated prose;
- training pools being passed off as culturally adapted after literal translation;
- stronger health/performance claims appearing only in one language;
- adding a language selector entry before the language is actually usable.

The CI typecheck is the mechanical guard; human language review and browser acceptance are the semantic guard.
## Review-Stand

**2026-08-30 — fr/es/it/pt eingeführt (Interface).** Vier vollständige
Wörterbücher aus der deutschen Quelle (Kaltstart unberührt: de/en statisch,
die vier als vorab gecachte Lazy-Chunks; Wörterbuch wird vor dem sichtbaren
Umschalten geladen, nie halbübersetzt). Ebenfalls übersetzt: die fünf
Overlay-Pakete der Wahrheitsschicht, das Install-Gate und die beiden
First-Run-Schichten (jetzt eine gemeinsame Quelle in
`src/app/firstRunLayerCopy.ts` statt binärer de/en-Blöcke je Schicht).
Je Sprache ein E2E-Smoke-Pfad (`tests/e2e/languages.spec.ts`, §6) und ein
Browser-Durchgang des Hauptflusses.

Status nach §4: **Modell-Entwurf, Muttersprachler-Review offen** (USER
ACTION). Bis dahin gilt: Entwurfsqualität ist eingebaut, nicht beworben —
Wortlaut-Korrekturen ändern nur die Sprachdateien.

Bekannte, bewusste Lücke (§2.4): Diese Copy-Inseln außerhalb des
Wörterbuchs sprechen bei fr/es/it/pt weiterhin Englisch (der dokumentierte
Fallback der App), alle in verzögerten Panels außerhalb des Erstkontakts:
`ReminderPanelImpl.tsx`, `driveRedirectFeedback.ts`, `ResetPanel.tsx`,
`localPhotoCopy.ts`, `localDictationCopy.ts`, `BackupPanelImpl.tsx`
(Support-Text), `SyncPanelImpl.tsx` (Drive-Text), `peopleScenarioCopy.ts`,
`memoryDeadline.ts`. Nachziehen heißt: dieselben vier Sprachen dort
ergänzen — keine neue Mechanik nötig.
