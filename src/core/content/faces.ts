/**
 * Gesichter, aus einer Zahl erzeugt (D-005, Backlog D14).
 *
 * Kein Fotoarchiv, keine gekaufte Bibliothek, keine fremden Menschen. Aus
 * einem Seed entstehen hier die **Maße** eines Gesichts; gezeichnet wird es
 * eine Ebene höher (`app/Face.tsx`), denn der Kern kennt kein SVG und keinen
 * Browser (D-010).
 *
 * Warum ein Generator und keine Sammlung — der Grund ist derselbe wie überall
 * in diesem Projekt und er ist inhaltlich, nicht technisch: **Eine feste
 * Sammlung ist nach zwei Wochen durchgesehen.** Ab dann erkennt man die
 * Gesichter wieder, statt sich Namen zu merken, und die App misst
 * Wiedererkennen statt Gedächtnis. Ein Generator hat kein Ende.
 *
 * Dazu kommt, was man leicht übersieht: Fotos echter Menschen werfen neben dem
 * Urheberrecht auch Persönlichkeitsrechte auf, und die verschwinden nicht
 * dadurch, dass ein Bild „lizenzfrei“ heißt.
 *
 * **Ehrlich benannt** (D-005): Gezeichnete Gesichter sind leichter zu
 * unterscheiden als echte. Das Training hier ist also etwas einfacher als das
 * Leben. Das ist eine Aussage über die Übung — und darf nach R-1 nie als
 * Aussage über den Alltag verkauft werden.
 */

import { createRng } from '../rng.ts'
import { beardFits } from './names.ts'

/**
 * Hauttöne von hell bis dunkel.
 *
 * Bewusst über die ganze Spanne und nicht als Beiwerk: Eine Gedächtnis-App,
 * in der alle Gesichter gleich aussehen, übt genau das nicht, worauf es
 * ankommt — Menschen auseinanderzuhalten.
 */
const SKIN = ['#f6d9c2', '#efc9a6', '#dfa878', '#c98a5b', '#a2653c', '#7a4a2a', '#5b3620'] as const

const HAIR = ['#2b2118', '#4a3423', '#6b4a2b', '#96683a', '#c39b62', '#8a8a8a', '#3d3d46'] as const

const EYES = ['#3d2b1f', '#4b6b52', '#3f5d78', '#5a4632'] as const

/** Frisuren. Die Zeichnung dazu steht in `app/Face.tsx`. */
export const HAIR_STYLES = ['short', 'wave', 'bun', 'curls', 'long', 'bald', 'fringe'] as const
export type HairStyle = (typeof HAIR_STYLES)[number]

export const NOSE_SHAPES = ['line', 'round', 'wide'] as const
export type NoseShape = (typeof NOSE_SHAPES)[number]

export const MOUTH_SHAPES = ['smile', 'straight', 'open', 'smirk'] as const
export type MouthShape = (typeof MOUTH_SHAPES)[number]

/*
 * ── Die zweite Garnitur (Gerätebefund 02.09.) ─────────────────────────────
 *
 * „Sie sehen sich alle einfach zu ähnlich aus. Liegt wohl am
 *  Zeichentricksding."
 *
 * Gemessen, bevor etwas geändert wurde: Die **Daten** sind vielfältig —
 * mittlerer Abstand 4,47 von 7 auffälligen Merkmalen über 48 Namen, nur vier
 * Paare liegen bei 1. Sichtbar waren davon aber nur vier Kanäle: Haare,
 * Hautton, Brille, Bart. Kopfbreite schwankte um 3 Prozent, Augenabstand und
 * -größe um 14 — bei 130 Pixeln Kantenlänge sieht das niemand. Jedes Gesicht
 * hatte dieselbe Silhouette und dieselben Augen.
 *
 * Diese Merkmale sind deshalb **kategorisch** statt fein: Eine runde und eine
 * kantige Kopfform trennt man aus zwei Metern, drei Prozent Breite nicht.
 */

/** Die Silhouette — das Erste, was man aus der Entfernung sieht. */
export const HEAD_SHAPES = ['oval', 'round', 'square', 'long', 'heart'] as const
export type HeadShape = (typeof HEAD_SHAPES)[number]

/** Die Augenform. Bisher hatte jedes Gesicht dieselbe Mandel. */
export const EYE_SHAPES = ['round', 'almond', 'hooded', 'narrow'] as const
export type EyeShape = (typeof EYE_SHAPES)[number]

/** Der Schwung der Braue. */
export const BROW_SHAPES = ['flat', 'arched', 'angled'] as const
export type BrowShape = (typeof BROW_SHAPES)[number]

export interface Face {
  /** Breite des Kopfes, 1 ist der Normalwert. */
  width: number
  /** Höhe des Kopfes. Zusammen mit `width` ergibt sich rund bis länglich. */
  height: number
  /** Wie eckig das Kinn ist, 0 = rund, 1 = kantig. */
  jaw: number
  skin: string
  hair: string
  hairStyle: HairStyle
  /** Bart: 0 = keiner, 1 = Schnurrbart, 2 = Vollbart. */
  beard: 0 | 1 | 2
  brow: number
  eyes: string
  /** Augenabstand, 1 ist der Normalwert. */
  eyeSpacing: number
  eyeSize: number
  nose: NoseShape
  mouth: MouthShape
  glasses: boolean
  ears: number
  headShape: HeadShape
  eyeShape: EyeShape
  browShape: BrowShape
  /** Wie lang die Nase ist, 1 ist der Normalwert. */
  noseLength: number
  /** Wie breit der Mund ist, 1 ist der Normalwert. */
  mouthWidth: number
  /**
   * Alter, 0 = jung, 1 = alt. Sichtbar an Nasolabialfalte, Stirnfalte und
   * einem tieferen Haaransatz — die Merkmale, an denen man im Alltag ein
   * Alter schätzt, ohne es zu benennen.
   */
  age: number
  /**
   * Wo die Augenlinie sitzt, 0 = hoch, 1 = tief.
   *
   * Das war lange die stillste Ursache dafür, dass alle Gesichter gleich
   * aussahen: Augen, Nase und Mund lagen bei **jedem** Gesicht auf genau
   * derselben Höhe. Zwei Menschen unterscheiden sich aber gerade darin — ein
   * hoher Haaransatz mit tiefliegenden Augen ist ein anderes Gesicht als eine
   * kurze Stirn mit Augen weit oben, auch bei gleicher Kopfform.
   */
  featureY: number
  /** Wie weit Augenlinie und Mund auseinanderliegen, 0 = gedrängt, 1 = lang. */
  featureSpread: number
}

/**
 * Dasselbe Wort ergibt immer dasselbe Gesicht.
 *
 * Genau darauf beruht die Verbindung von Name und Gesicht: „Elena“ sieht
 * heute aus wie in drei Wochen, wenn sie im Wiedersehensblock zurückkommt
 * (D8). Ohne diese Verlässlichkeit wäre die Wiederholung sinnlos — man würde
 * jedes Mal ein neues Gesicht zum alten Namen lernen.
 */
/*
 * Dasselbe Wort ergibt dasselbe Gesicht — dann muss es auch nur einmal
 * gerechnet werden.
 *
 * Gemessen: 50 000 Gesichter frisch zu wuerfeln kostet 23 ms, aus dem
 * Speicher zu holen 2 ms. Gebraucht wird das an zwei Stellen oft — beim
 * Zeichnen jedes Gesichts und seit dieser Aenderung in `spreadFaces`, das
 * beim Planen jeden Namen mit jedem vergleicht. Rechenarbeit ist auf einem
 * Telefon Waerme (BACKLOG P9), und diese hier ist vermeidbar.
 *
 * Der Speicher ist von Natur aus klein und begrenzt: Es gibt je Sprache rund
 * fuenfzig Namen, und mehr Namen als im Vorrat kann niemand anfragen.
 */
const cache = new Map<string, Face>()

export function faceFor(name: string): Face {
  const known = cache.get(name)
  if (known !== undefined) return known
  const face = buildFace(name)
  cache.set(name, face)
  return face
}

function buildFace(name: string): Face {
  const rng = createRng(`face:${name}`)
  /*
   * Ein **zweiter** Strom für die neuen Merkmale — und das ist kein Zufall.
   *
   * Wer „Elena" schon gelernt hat, erkennt sie an Haarfarbe, Frisur, Hautton,
   * Bart und Brille wieder. Zöge man die neuen Merkmale aus demselben Strom,
   * verschöbe sich jeder folgende Wurf, und **jedes** Gesicht sähe von einem
   * Tag auf den anderen völlig anders aus — bei laufenden Wiederholungen
   * hieße das: gelernte Paare wären wertlos, und der Wiederholungsplan
   * behauptete Wissen, das es nicht mehr gibt.
   *
   * Aus einem eigenen Strom bleiben die alten Werte Wort für Wort dieselben.
   * Elena bleibt Elena — sie bekommt nur ein eigenes Gesicht.
   */
  const form = createRng(`face-shape:${name}`)
  return {
    width: 0.88 + rng.next() * 0.24,
    height: 0.9 + rng.next() * 0.22,
    jaw: rng.next(),
    skin: rng.pick(SKIN),
    hair: rng.pick(HAIR),
    hairStyle: rng.pick(HAIR_STYLES),
    beard: beardOf(rng.next(), name),
    brow: 0.7 + rng.next() * 0.6,
    eyes: rng.pick(EYES),
    eyeSpacing: 0.86 + rng.next() * 0.28,
    eyeSize: 0.85 + rng.next() * 0.35,
    nose: rng.pick(NOSE_SHAPES),
    mouth: rng.pick(MOUTH_SHAPES),
    glasses: rng.next() < 0.27,
    ears: 0.85 + rng.next() * 0.3,
    headShape: form.pick(HEAD_SHAPES),
    eyeShape: form.pick(EYE_SHAPES),
    browShape: form.pick(BROW_SHAPES),
    noseLength: 0.78 + form.next() * 0.5,
    mouthWidth: 0.76 + form.next() * 0.5,
    age: form.next(),
    featureY: form.next(),
    featureSpread: form.next(),
  }
}

/**
 * Bart aus **einem** Wurf.
 *
 * Vorher standen hier zwei verschachtelte Würfe, und der zweite fiel nur,
 * wenn der erste durchkam. Damit hing alles, was danach gezogen wird — Brauen,
 * Augen, Nase, Mund —, daran, ob dieses Gesicht einen Bart hat. Das ist zwar
 * je Name gleichbleibend und deshalb nie aufgefallen, aber es ist eine Falle:
 * Wer die Bartschwelle ändert, ändert damit alle Gesichter. Ein Wurf, eine
 * Entscheidung.
 *
 * Zu welchen Namen ein Bart passt, entscheidet `names.ts` — mitsamt der
 * Begründung, warum das überhaupt eine Frage ist.
 */
function beardOf(roll: number, name: string): 0 | 1 | 2 {
  if (!beardFits(name)) return 0
  if (roll < 0.1) return 1
  if (roll < 0.24) return 2
  return 0
}

/**
 * Die Merkmale, an denen man zwei Menschen aus zwei Metern unterscheidet.
 *
 * Bewusst nur die kategorischen: Frisur, Haarfarbe, Hautton, Bart, Brille,
 * Nase, Mund. Die feinen Maße (Kopfbreite, Kinn, Augenabstand, Ohren) machen
 * ein Gesicht eigen, aber sie taugen nicht zum Auseinanderhalten — zwei
 * Gesichter, die sich nur um drei Prozent Kopfbreite unterscheiden, sind für
 * den Abruf dasselbe Gesicht.
 */
const STRONG_FEATURES = [
  'hairStyle',
  'hair',
  'skin',
  'beard',
  'glasses',
  'nose',
  'mouth',
  // Seit dem 02.09. dazu: Diese drei sieht man wirklich, anders als die
  // feinen Maße daneben.
  'headShape',
  'eyeShape',
  'browShape',
] as const

/**
 * Wie viele auffällige Merkmale trennen zwei Gesichter? (0 bis 10)
 *
 * Gerätemeldung 01.09.: „die Menschen sehen sich zu ähnlich aus. Im echten
 * Leben ist es nicht so." Der Vorrat ist vielfältig — aber wer eine Runde
 * sieht, sieht sechs Gesichter, und die wurden unabhängig voneinander
 * gezogen. Greta und Zora etwa teilen alles außer dem Hautton. Diese Zahl
 * macht „sieht ähnlich aus" prüfbar; wer sie nutzt, steht in `planBase.ts`.
 */
export function faceDistance(oneName: string, otherName: string): number {
  const one = faceFor(oneName)
  const other = faceFor(otherName)
  return STRONG_FEATURES.filter((feature) => one[feature] !== other[feature]).length
}
