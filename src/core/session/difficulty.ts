/**
 * Adaptive Schwierigkeit (Backlog D2).
 *
 * Der Zielkorridor liegt um ~80 % Trefferquote: Zu leicht ist Beschäftigung,
 * zu schwer ist Frust — beides bricht das Wiederkommen. Die Stellschraube
 * ist klein und ehrlich: **ein Stück mehr oder weniger je Runde** (bzw. eine
 * Ziffer mehr oder weniger bei der Rückwärtsspanne), nie ein Sprung.
 *
 * Gerechnet, nicht fortgeschrieben (dasselbe Prinzip wie Serie und
 * Wiedersehen): Die Quote entsteht bei jedem Planen neu aus den letzten
 * Antworten des Moduls. Es gibt keinen gespeicherten „Level“, der
 * auseinanderlaufen könnte — und nichts, was sich wie ein Rang anfühlt
 * (D-019). Angezeigt wird die Anpassung nirgends als Zahl; sie ist
 * Planung, keine Aussage über den Menschen (R-1).
 */

/** Aus wie vielen letzten Antworten die Quote entsteht. */
export const DIFFICULTY_WINDOW = 20

/**
 * Unter so vielen Antworten wird nicht angepasst: Drei Treffer sind keine
 * Quote, sondern ein Anfang — dieselbe Vorsicht wie beim Profil (E7).
 */
export const MIN_ANSWERS_TO_ADAPT = 10

/** Der Korridor: darüber wird es mehr, darunter weniger. */
export const EASE_RATE = 0.9
export const STRAIN_RATE = 0.65

export interface DifficultyInput {
  /** Die letzten Antworten dieses Moduls, jüngste zuletzt — nur richtig/falsch. */
  readonly recent: readonly boolean[]
}

/**
 * Ein Stück mehr, eines weniger, oder wie gehabt.
 *
 * `+1` erst ab neun von zehn: Wer fast alles behält, darf mehr tragen.
 * `-1` unter zwei Dritteln: Wer ständig verliert, übt gerade das Verlieren.
 * Dazwischen bleibt alles, wie es ist — ein Regler, der bei jeder kleinen
 * Schwankung zappelt, wäre selbst die Störung.
 */
export function itemsDeltaFor(input: DifficultyInput): -1 | 0 | 1 {
  const window = input.recent.slice(-DIFFICULTY_WINDOW)
  if (window.length < MIN_ANSWERS_TO_ADAPT) return 0
  const rate = window.filter(Boolean).length / window.length
  if (rate >= EASE_RATE) return 1
  if (rate < STRAIN_RATE) return -1
  return 0
}

/**
 * Die Länge der Rückwärtsspanne (D7): fünf ist der Anfang, vier der Boden,
 * sechs die Decke. Dieselbe Quote, dieselben Schwellen — nur wirkt sie hier
 * auf die Folge statt auf die Stückzahl.
 */
export const SPAN_MIN = 4
export const SPAN_BASE = 5
export const SPAN_MAX = 6

export function spanLengthFor(input: DifficultyInput): number {
  const delta = itemsDeltaFor(input)
  return Math.max(SPAN_MIN, Math.min(SPAN_MAX, SPAN_BASE + delta))
}

/**
 * Die Stufen oberhalb des Lernstands (Nutzerwunsch 04.09.).
 *
 * Wörtlich: „Das kann ruhig bis zu dreißig, 60 Zeichen gehen je nachdem. Aber
 * das muss halt stufenweise sein und wenn ich weiterkomme, darf das mehr."
 *
 * Bis sechs geht es Ziffer für Ziffer, denn dort entscheidet der Lernstand.
 * Darüber in **Zweierschritten**, und das ist keine Bequemlichkeit: Das
 * Major-System fasst zwei Ziffern zu einem Wort. Eine ungerade Länge ließe am
 * Ende eine halbe Silbe stehen — sieben Ziffern sind drei Wörter und ein
 * Rest, acht sind vier Wörter.
 *
 * Bei dreißig ist Schluss, obwohl der Wunsch bis sechzig ging. Der Grund ist
 * die Uhr, nicht die Vorsicht: Bei einer Sekunde je Ziffer (siehe
 * `secondsPerItemFor`) braucht eine sechzigstellige Folge eine ganze Minute
 * allein zum Einprägen — mehr als eine Notfall-Einheit im Ganzen hat. Wer
 * dreißig wirklich erreicht, hat den Beleg dafür geliefert, dass die nächste
 * Stufe gebaut werden sollte.
 */
const LADDER = [3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 30] as const

/** Die höchste Stufe der Leiter — auch für den Vorrat und die Uhr. */
export const MAX_LADDER_DIGITS = 30

/** Die nächste Stufe über einer Länge — oder die oberste, wenn keine mehr kommt. */
function nextStep(digits: number): number {
  return LADDER.find((step) => step > digits) ?? MAX_LADDER_DIGITS
}

/**
 * Wie lang eine **neue** Zahl höchstens sein darf (Nutzerbefund 04.09.).
 *
 * Der Befund: „Ich lerne (erstmal nur) t und d für 1 und … soll gleich
 * mehrere 6-stellige Ziffern anmerken können. Wie soll das gehen, wenn ich
 * noch nicht viele Wörter im Katalog für 1 habe?"
 *
 * Gemessen, bevor etwas geändert wurde: In einer Fünf-Minuten-Einheit kamen
 * 24 Zahlen, sieben davon sechsstellig — **bei nur gelehrter 1 genau so viele
 * wie bei allen zehn Ziffern**. Die Länge kannte den Lernstand nicht; der
 * frühere Eingriff (01.09.) sortierte nur die Reihenfolge.
 *
 * Warum das nicht bloß unangenehm, sondern sinnlos ist: Das Major-System
 * fasst **zwei** Ziffern zu einem Wort. Ein Paar ist erst brauchbar, wenn
 * beide Ziffern gelehrt sind — bei k von zehn also in (k/10)² der Fälle.
 * Nach der ersten Lektion ist das **ein Prozent**. Eine sechsstellige Zahl in
 * vier Sekunden (`SECONDS_PER_ITEM`) ist dann kein Anwenden der Technik,
 * sondern Auswendiglernen ohne Werkzeug — und wer das erlebt, schließt
 * daraus, die Technik tauge nichts.
 *
 * Deshalb wächst die Decke mit dem Lernstand, langsam am Anfang:
 *
 * | gelehrt | 0–1 | 2–4 | 5–7 | 8–10 |
 * |---------|-----|-----|-----|------|
 * | Ziffern |  3  |  4  |  5  |   6  |
 *
 * Der Boden bleibt bei drei, und unterhalb der Decke wird weiter gestreut:
 * Eine Runde aus zehn gleich langen Folgen wäre leichter, als sie sein soll,
 * weil man dann nur noch die Ziffern und nicht mehr die Länge behalten muss.
 *
 * Die eigene Quote verschiebt die Decke um ein Stück — dieselbe ±1-Regel wie
 * überall (D2) — und darf dabei **über** den Lernstand hinausgehen: Wer die
 * dreistelligen sicher behält, ist nicht dadurch überfordert, dass er erst
 * eine Ziffer gelernt hat. Die Decke ist eine Hilfe, kein Urteil (R-1), und
 * sie wird nirgends als Zahl angezeigt.
 *
 * **Eingesperrt wird niemand.** Eine gewöhnliche Einheit lehrt die nächste
 * Ziffer von selbst (`teach-major`, gespeichert in `useSessionRunner`); der
 * Lernstand wächst also auch ohne den Lernbereich, rund eine Ziffer je
 * Einheit. Nach etwa zehn Einheiten steht die Decke ohnehin bei sechs.
 *
 * **Und über sechs gilt etwas anderes** (Wunsch vom 04.09., gebaut am 06.09.):
 * Dort hebt nicht mehr der Lernstand und auch nicht die Quote, sondern allein
 * der Beleg — siehe `LADDER` oben.
 */
export function numberLengthFor(
  input: DifficultyInput & {
    readonly taught: readonly number[]
    /**
     * Die längste Folge, die dieser Mensch **je richtig** hatte (in Ziffern).
     *
     * Der Motor für alles oberhalb von sechs. Nicht die Trefferquote, denn
     * die sagt nur, wie es bei der zuletzt gestellten Länge lief — und wer
     * bei drei Ziffern glänzt, hat damit nichts über dreißig gesagt.
     * Gerechnet aus den Rohereignissen, nie gespeichert (`loadLongestRecalled`).
     */
    readonly longestRecalled?: number
  },
): number {
  const gelehrt = new Set(input.taught).size
  const ausLernstand = gelehrt >= 8 ? 6 : gelehrt >= 5 ? 5 : gelehrt >= 2 ? 4 : 3

  /*
   * **Oberhalb von sechs hebt nur der Beleg** — eine Stufe über dem Längsten,
   * das wirklich gelungen ist.
   *
   * Nicht mehr: Sonst stünde nach einer guten Woche eine dreißigstellige Zahl
   * da, die nie jemand geübt hat. Und die Trefferquote darf dort senken, aber
   * nicht heben — wer noch nie eine sechsstellige Folge richtig hatte,
   * bekommt auch mit zwanzig richtigen Dreistelligen keine achte Ziffer.
   * Sonst hinge die anspruchsvollste Übung der App an einer Quote, die über
   * ganz andere Längen gesammelt wurde.
   */
  const belegt = input.longestRecalled ?? 0
  const obergrenze = belegt >= 6 ? nextStep(belegt) : 6
  const decke = belegt >= 6 ? obergrenze : ausLernstand

  /*
   * Die eigene Quote verschiebt wie überall um ein Stück (D2) — aber in
   * **Stufen**, nicht in Ziffern: Über sechs wäre „eine Ziffer weniger" eine
   * ungerade Länge und damit ein halbes Wort.
   */
  const versatz = itemsDeltaFor(input)
  const stelle = LADDER.indexOf(decke as (typeof LADDER)[number])
  const verschoben =
    stelle < 0
      ? decke
      : (LADDER[Math.max(0, Math.min(LADDER.length - 1, stelle + versatz))] as number)

  return Math.max(3, Math.min(obergrenze, verschoben))
}

/**
 * H6 — adaptive Missionsschwierigkeit über die Betrachtungszeit.
 *
 * Eine Mission bleibt immer dieselbe vollständige Szene. Wir entfernen keine
 * Tatsachen und erfinden keine Level. Stattdessen verschiebt dieselbe bereits
 * vorhandene ±1-Regel nur das Verhältnis zwischen Einprägen und Abrufen:
 *
 * - bei Überlastung (`-1`) sechs Sekunden je Tatsache,
 * - im Zielkorridor (`0`) fünf Sekunden,
 * - bei sehr sicherer Leistung (`+1`) vier Sekunden.
 *
 * Das Gesamtbudget der Runde bleibt dadurch unverändert; mehr Zeit beim
 * Einprägen bedeutet entsprechend weniger Abrufzeit und umgekehrt.
 */
export const MISSION_SECONDS_MIN = 4
export const MISSION_SECONDS_BASE = 5
export const MISSION_SECONDS_MAX = 6

/**
 * Die Sekunden je Tatsache, gemessen an dem, was für diese Runde geplant war.
 *
 * `base` ist neu (Nutzerbefund 05.09.). Vorher stand die Fünf hier fest, und
 * das ging gut, solange eine Mission immer fünf Sekunden je Tatsache bekam.
 * Seit der Takt vom Lernstand und vom eingestellten Tempo abhängt, wäre die
 * feste Fünf eine zweite Wahrheit: Bei `delta = 0` ließ H6 den Plan in Ruhe
 * (sieben Sekunden), bei ±1 schrieb es ihn auf sechs oder vier um — ein
 * Sprung nach unten, obwohl „leichter" gemeint war. Zwei Kerntests haben
 * genau das gefangen.
 *
 * Der Vorgabewert hält die alte Bedeutung für jeden Aufrufer, der keinen
 * eigenen Takt kennt.
 */
export function missionSecondsPerFact(
  delta: -1 | 0 | 1,
  base: number = MISSION_SECONDS_BASE,
): number {
  // Ein Stück mehr oder weniger als geplant, nie ein Sprung — dieselbe
  // ±1-Regel wie überall (D2). Mit dem Vorgabewert kommen genau die alten
  // vier, fünf und sechs Sekunden heraus.
  return Math.max(1, base - delta)
}
