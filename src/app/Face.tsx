import { useId, useMemo } from 'react'

import { type Face as FaceSpec, type HeadShape, faceFor } from '../core/index.ts'

/**
 * Ein Gesicht, gezeichnet aus den Maßen, die der Kern liefert (D-005).
 *
 * Die Trennung ist Absicht und keine Umständlichkeit: `faceFor()` in
 * `core/content/faces.ts` kennt kein SVG, keinen Browser und keine Farbe auf
 * dem Bildschirm — es liefert Zahlen. Hier werden daraus Formen. Dadurch
 * lässt sich der Generator ohne Browser prüfen (D-010), und eine spätere
 * native Fassung zeichnet dieselben Zahlen anders.
 *
 * Bewusst schlicht gehalten: Es geht nicht um Porträtkunst, sondern darum,
 * dass sich acht Gesichter zuverlässig voneinander unterscheiden. Zu viele
 * Einzelheiten machen sie **ähnlicher**, nicht verschiedener — dann bleibt am
 * Ende nur „der mit der Brille“ hängen.
 *
 * Zum Prüfen gibt es `scripts/facesheet.mjs`: Es legt vierzig Gesichter
 * nebeneinander. Einzeln sieht fast jedes annehmbar aus; erst im Raster fällt
 * auf, wenn alle denselben Haaransatz haben.
 */
export function Face({ name, size = 132 }: { name: string; size?: number }) {
  const face = useMemo(() => faceFor(name), [name])
  const w = 50 * face.width
  const h = 58 * face.height
  const head = headPath(w, h, face.jaw, face.headShape)
  /* Wo das Kinn endet, hängt von Kopfhöhe **und Form** ab — Hals und
     Schultern müssen mitwandern, sonst schwebt bei einem kurzen Kopf der
     Kragen und steht bei einem langen im Gesicht. */
  const chin = 64 + h * chinDepth(face.headShape)
  // Doppelpunkte aus `useId` vertragen sich nicht mit `url(#…)`.
  const clipId = `face-${useId().replace(/:/g, '')}`

  /*
   * Brauen in drei Schwüngen (02.09.). Vorher hatte jedes Gesicht denselben
   * flachen Bogen, nur unterschiedlich dick — und Dicke allein trennt zwei
   * Gesichter nicht. Gerade, gerundet und geknickt trennen sie sofort.
   *
   * Mit dem Alter rücken sie näher an die Augen: Eine tiefer sitzende Braue
   * ist eines der Merkmale, an denen man ein Alter schätzt, ohne es zu
   * benennen.
   */
  /*
   * Die Lage der Züge (02.09.).
   *
   * Bis hierher lagen die Augen bei **jedem** Gesicht auf y = 64 und der Mund
   * auf y = 90. Das ist der stillste Grund dafür, dass sich alle ähnlich
   * sahen: Man kann Kopfform, Haare und Nase wechseln — wenn die Züge immer
   * am selben Fleck sitzen, bleibt der Eindruck derselbe.
   */
  const augenY = 64 + (face.featureY - 0.5) * 8
  const spanne = 0.85 + face.featureSpread * 0.35
  const mundY = augenY + 28 * spanne
  const browY = augenY - 6 - 6 * face.brow + face.age * 3
  const browBogen = (x: number): string =>
    face.browShape === 'flat'
      ? `M ${x} ${browY} q 7 0 14 0`
      : face.browShape === 'angled'
        ? `M ${x} ${browY + 1.6} l 7 -3.6 l 7 1.8`
        : `M ${x} ${browY} q 7 ${-5 * face.brow} 14 0`
  const brows = [browBogen(60 - 20 * face.eyeSpacing), browBogen(60 + 6 * face.eyeSpacing)]

  return (
    <svg
      className="face"
      /*
        Der Ausschnitt beginnt bei -18 und nicht bei 0: Ein hoher Kopf reicht
        bis y = -1, ein Haarknoten darüber noch einmal sechzehn Einheiten
        weiter. Vorher war der Knoten oben abgeschnitten und sah aus wie eine
        angeklebte Lasche.
      */
      viewBox="0 -18 120 148"
      width={size}
      height={size * (148 / 120)}
      role="img"
      /* Für den Screenreader ist ein erzeugtes Gesicht nicht beschreibbar —
         und es *soll* auch nicht beschrieben werden: Die Aufgabe besteht
         darin, sich das Bild zu merken. Der Name steht daneben im Text. */
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/*
          Der Bart wird am Kopf beschnitten.
          Vorher war er eine feste Form, und weil das Kinn je nach Maß höher
          oder tiefer sitzt, hing er bei manchen Gesichtern darunter hervor —
          auf dem Bogen sah das aus wie ein Lätzchen. Mit dem Kopf als Maske
          kann das für keine Kombination mehr passieren.
        */}
        <clipPath id={clipId}>
          <path d={head} />
        </clipPath>
      </defs>

      {/*
        Hals: breit, kurz, unten auslaufend.
        Als Kuppel sah er aus wie ein zweites Kinn, bei dunkler Haut wie ein
        Ziegenbart; als Rechteck wie ein Schornstein mit scharfen Ecken. Er
        endet knapp **unter** der Schulterlinie und nicht darunter hinaus: Die
        Schultern sind durchscheinend, ein längerer Hals schimmerte als
        dunkler Kasten durch sie hindurch.
      */}
      <path
        d={`M ${60 - w * 0.34} ${chin - 14}
            C ${60 - w * 0.34} ${chin + 2} ${60 - w * 0.4} ${chin + 5} ${60 - w * 0.48} ${chin + 8}
            L ${60 + w * 0.48} ${chin + 8}
            C ${60 + w * 0.4} ${chin + 5} ${60 + w * 0.34} ${chin + 2} ${60 + w * 0.34} ${chin - 14} Z`}
        fill={face.skin}
      />
      {/* Der Schatten des Kinns auf dem Hals — ohne ihn klebt der Kopf auf. */}
      <ellipse cx="60" cy={chin - 2} rx={w * 0.34} ry="5" fill="#00000018" />

      {/*
        Schultern, für alle gleich und ohne eigene Farbe.
        Das ist kein Sparen, sondern Absicht: Ein farbiges Hemd wäre das
        bequemste Merkmal von allen — man würde sich „der in Blau“ merken
        statt des Gesichts, und die App misst dann Kleidung. Als angeschnittene
        Ellipse sah es vorher aus, als stünde der Kopf auf einem Teller.

        Die Unterkante liegt fest bei 8 und 112 und hängt **nicht** an der
        Kopfbreite: Sonst reichten die Schultern eines breiten Kopfes über den
        Rand hinaus und wurden dort senkrecht abgeschnitten — zwei harte
        Kanten mitten im Bild. Unten am Bildrand ist der Schnitt richtig, das
        ist die gewohnte Form einer Büste; an den Seiten wäre er ein Fehler.
      */}
      <path
        d={`M 60 ${chin + 2}
            C ${60 - w * 0.9} ${chin + 3} ${60 - w * 1.3} ${chin + 14} 8 130
            L 112 130
            C ${60 + w * 1.3} ${chin + 14} ${60 + w * 0.9} ${chin + 3} 60 ${chin + 2} Z`}
        fill="currentColor"
        opacity="0.12"
      />

      {/* Ohren — vor dem Kopf gezeichnet, also liegen sie dahinter. */}
      <ellipse cx={60 - w * HEAD_METRICS[face.headShape].wange} cy="66" rx={5 * face.ears} ry={8 * face.ears} fill={face.skin} />
      <ellipse cx={60 + w * HEAD_METRICS[face.headShape].wange} cy="66" rx={5 * face.ears} ry={8 * face.ears} fill={face.skin} />

      {/* Kopf: je kantiger der Kiefer, desto kleiner der untere Radius */}
      <path d={head} fill={face.skin} />

      <Hair face={face} w={w} h={h} />

      {/* Brauen */}
      <g strokeWidth={2.6 * face.brow} strokeLinecap="round" fill="none">
        <g stroke={face.hair}>
          {brows.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        {/*
          Ein dunkler Hauch darüber. Sehr helle Haare auf heller Haut ergeben
          sonst Brauen, die man nicht sieht — und die Braue ist eines der
          wenigen Merkmale, die ein Gesicht wirklich unterscheiden.
        */}
        <g stroke="#000" opacity="0.22">
          {brows.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </g>

      {/*
        Augen in vier Formen (02.09.).

        Vorher trug **jedes** Gesicht dieselbe Mandel — 6 × 4,2 Einheiten,
        nur um bis zu 14 Prozent skaliert. Zwei Augenpaare, die sich um 14
        Prozent unterscheiden, sind für den Abruf dasselbe Augenpaar. Rund,
        mandelförmig, mit schwerem Lid und schmal sind vier verschiedene
        Gesichter, auch wenn sonst nichts anderes ist.
      */}
      <Eyes face={face} y={augenY} />

      {/*
        Reihenfolge von unten nach oben: Bart, Nase, Mund.
        Der Bart liegt auf der Haut, Nase und Mund liegen auf dem Bart — so
        wie bei einem Gesicht. Zeichnet man ihn zuletzt, verdeckt er beides.
      */}
      {face.beard !== 0 && (
        <g clipPath={`url(#${clipId})`}>
          <Beard face={face} w={w} y={mundY} />
        </g>
      )}
      <Nose face={face} y={augenY} spanne={spanne} />
      <Mouth face={face} y={mundY} />
      <Age face={face} w={w} y={augenY} mundY={mundY} />
      {face.glasses && <Glasses face={face} y={augenY} />}
    </svg>
  )
}

/**
 * Die fünf Silhouetten (Gerätebefund 02.09.).
 *
 * Vorher gab es **eine** Kopfform, aus der Kopfbreite (0,88–1,12) und dem
 * Kiefer leicht abgewandelt. Drei Prozent Breite sieht bei 130 Pixeln
 * Kantenlänge niemand — deshalb sahen alle Gesichter gleich aus, obwohl die
 * Zahlen dahinter verschieden waren.
 *
 * Diese fünf trennt man dagegen aus zwei Metern. Jede Zahl ist ein Anteil der
 * Grundbreite: `krone` am Schädel, `wange` am Jochbein, `kiefer` am
 * Unterkiefer, `kinn` als Tiefe. Das Herz ist oben breit und unten spitz, das
 * Kantige läuft gerade herunter, das Lange ist schmal und tief.
 *
 * Die erste Fassung dieser Tabelle war zu zaghaft: Auf dem Bogen sah man die
 * fünf Formen kaum, weil sie sich nur um wenige Prozent unterschieden — genau
 * der Fehler, den sie beheben sollte, eine Ebene höher wiederholt. Ein runder
 * Kopf ist jetzt 1,2 mal so breit wie die Grundbreite, ein langer 0,82 — das
 * ist knapp die Hälfte Unterschied und **das** sieht man.
 *
 * Die Oberkante bleibt bei allen `64 − h`: Darauf setzt die Haarhaube auf,
 * und eine Frisur, die je nach Kopfform schwebt oder einsinkt, wäre ein
 * schlechterer Tausch als eine Form weniger.
 */
const HEAD_METRICS: Record<HeadShape, { krone: number; wange: number; kiefer: number; kinn: number }> = {
  oval: { krone: 0.9, wange: 0.98, kiefer: 0.68, kinn: 0.68 },
  round: { krone: 1.1, wange: 1.2, kiefer: 1.02, kinn: 0.52 },
  square: { krone: 1.02, wange: 1.06, kiefer: 1.1, kinn: 0.58 },
  long: { krone: 0.78, wange: 0.82, kiefer: 0.6, kinn: 0.88 },
  heart: { krone: 1.12, wange: 1.02, kiefer: 0.44, kinn: 0.76 },
}

/** Wie tief das Kinn sitzt — Hals und Schultern müssen mitwandern. */
function chinDepth(shape: HeadShape): number {
  return HEAD_METRICS[shape].kinn
}

/**
 * Die vier Augenformen (02.09.).
 *
 * Gezeichnet wird jeweils Weiß, Iris und Pupille — und bei `hooded` ein Lid
 * in Hautfarbe darüber, das das obere Drittel verdeckt. Das ist derselbe
 * Trick wie im Gesicht selbst: Ein schweres Lid ist keine andere Augenfarbe,
 * sondern ein Stück Haut mehr.
 */
function Eyes({ face, y }: { face: FaceSpec; y: number }) {
  const links = 60 - 13 * face.eyeSpacing
  const rechts = 60 + 13 * face.eyeSpacing
  const s = face.eyeSize
  const masse =
    face.eyeShape === 'round'
      ? { rx: 5.4 * s, ry: 5.2 * s, pupille: 2.8 * s }
      : face.eyeShape === 'narrow'
        ? { rx: 6.8 * s, ry: 2.6 * s, pupille: 2.2 * s }
        : face.eyeShape === 'hooded'
          ? { rx: 6.2 * s, ry: 4.4 * s, pupille: 2.5 * s }
          : { rx: 6.6 * s, ry: 3.8 * s, pupille: 2.6 * s }

  return (
    <g>
      {[links, rechts].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy={y} rx={masse.rx} ry={masse.ry} fill="#fffdf8" />
          <circle cx={cx} cy={y} r={masse.pupille} fill={face.eyes} />
          <circle cx={cx} cy={y} r={masse.pupille * 0.45} fill="#1a1410" />
          {face.eyeShape === 'hooded' && (
            <path
              d={`M ${cx - masse.rx - 0.6} ${y - masse.ry * 0.2} a ${masse.rx + 0.6} ${masse.ry + 1.4} 0 0 1 ${2 * masse.rx + 1.2} 0 z`}
              fill={face.skin}
            />
          )}
          {/* Die Lidkante gibt dem Auge eine Oberkante — ohne sie schwimmt
              das Weiß im Gesicht. */}
          <path
            d={`M ${cx - masse.rx} ${y - masse.ry * 0.55} a ${masse.rx} ${masse.ry} 0 0 1 ${2 * masse.rx} 0`}
            stroke="#00000055"
            strokeWidth="1.1"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ))}
    </g>
  )
}

/**
 * Was ein Alter sichtbar macht (02.09.).
 *
 * Keine Zahl im Bild und keine Behauptung — nur die zwei Linien, an denen ein
 * Mensch im Alltag ein Alter schätzt: die Falte von der Nase zum Mundwinkel
 * und eine über der Stirn. Sie erscheinen erst ab der Hälfte und werden
 * kräftiger, nie hart.
 */
function Age({ face, w, y, mundY }: { face: FaceSpec; w: number; y: number; mundY: number }) {
  if (face.age < 0.5) return null
  const staerke = (face.age - 0.5) * 2
  return (
    <g stroke="#00000030" fill="none" strokeLinecap="round" opacity={0.35 + staerke * 0.5}>
      <path d={`M ${60 - w * 0.42} ${mundY - 8} q -2 6 1 11`} strokeWidth="1.6" />
      <path d={`M ${60 + w * 0.42} ${mundY - 8} q 2 6 -1 11`} strokeWidth="1.6" />
      {face.age > 0.78 && <path d={`M ${60 - w * 0.34} ${y - 17} q ${w * 0.34} -3 ${w * 0.68} 0`} strokeWidth="1.4" />}
    </g>
  )
}

/** Der Umriss des Kopfes — einmal beschrieben, zweimal gebraucht: als Fläche und als Maske. */
function headPath(w: number, h: number, jaw: number, shape: HeadShape): string {
  const m = HEAD_METRICS[shape]
  const top = 64 - h
  const wKrone = w * m.krone
  // Der Kiefer folgt zusätzlich dem feinen Maß: kantig heißt breiter unten.
  const wKiefer = w * m.kiefer * (0.9 + jaw * 0.24)
  const wWange = w * m.wange
  const yWange = 64 + h * 0.12
  const yKinn = 64 + h * m.kinn
  const rund = 1 - jaw * 0.55

  return `M 60 ${top}
          C ${60 + wKrone} ${top} ${60 + wWange} ${top + h * 0.42} ${60 + wWange} ${yWange}
          C ${60 + wWange} ${yKinn - h * 0.30} ${60 + wKiefer} ${yKinn - h * 0.10 * rund} 60 ${yKinn}
          C ${60 - wKiefer} ${yKinn - h * 0.10 * rund} ${60 - wWange} ${yKinn - h * 0.30} ${60 - wWange} ${yWange}
          C ${60 - wWange} ${top + h * 0.42} ${60 - wKrone} ${top} 60 ${top} Z`
}

/**
 * Die Haube, auf der fast jede Frisur aufsetzt.
 *
 * Zwei Zahlen entscheiden über den Eindruck. `drop` ist die Höhe an den
 * Schläfen, `dip` sagt, wie weit der Ansatz in der Mitte nach oben ausweicht.
 * Ein `dip` von 0 ergibt eine schnurgerade Linie quer übers Gesicht — genau
 * das ließ auf dem ersten Bogen die halbe Reihe wie Helme aussehen. Eine
 * sichtbare Stirn ist eines der stärksten Unterscheidungsmerkmale überhaupt.
 *
 * Die Haube ist um vier Prozent breiter und drei Einheiten höher als der
 * Schädel: Sonst blitzt an der Rundung eine helle Linie Kopfhaut durch.
 */
function cap(w: number, h: number, drop: number, dip: number, shape: HeadShape): string {
  const top = 64 - h - 3
  /*
   * Die Haube folgt seit dem 02.09. der **Kopfform**.
   *
   * Vorher war sie immer gleich breit (`w * 1.04`), egal ob darunter ein
   * runder oder ein kantiger Schädel saß. Damit war die neue Silhouette auf
   * dem Bogen praktisch unsichtbar: Bei allen außer den Glatzen verdeckte die
   * immer gleiche Haube genau den Teil, an dem man eine Kopfform erkennt.
   * Ein breiterer Schädel braucht eine breitere Haube — sonst blitzt seitlich
   * Kopfhaut durch, und die Form bleibt trotzdem verborgen.
   */
  const m = HEAD_METRICS[shape]
  const hw = w * Math.max(m.krone, m.wange) * 1.04
  return `M ${60 - hw} ${drop}
          q 0 ${top - drop + 2} ${hw} ${top - drop}
          q ${hw} 2 ${hw} ${drop - top}
          q ${-hw * 0.9} ${-dip} ${-1.8 * hw} 0 z`
}

function Hair({ face, w, h }: { face: FaceSpec; w: number; h: number }) {
  const top = 64 - h - 3
  switch (face.hairStyle) {
    case 'bald':
      return null

    case 'fringe':
      // Der Pony ist die eine Frisur, die die Stirn **verdecken darf** — ein
      // negativer `dip` zieht den Ansatz in der Mitte nach unten.
      return <path d={cap(w, h, 48, -16, face.headShape)} fill={face.hair} />

    case 'bun':
      return (
        <g fill={face.hair}>
          <circle cx="60" cy={top - 2} r={w * 0.32} />
          <path d={cap(w, h, 48, 14, face.headShape)} />
        </g>
      )

    case 'curls':
      return (
        <g fill={face.hair}>
          {[-0.86, -0.44, 0, 0.44, 0.86].map((offset, index) => (
            <circle key={index} cx={60 + offset * w} cy={top + 5 + Math.abs(offset) * 11} r={w * 0.3} />
          ))}
          <path d={cap(w, h, 48, 12, face.headShape)} />
        </g>
      )

    case 'long': {
      /*
       * Vorher fing das lange Haar erst weit unterhalb des Scheitels an: Der
       * Kopf blieb oben kahl und links und rechts hingen zwei Vorhänge übers
       * Gesicht. Jetzt ist es eine Haube mit zwei Strähnen daran — und die
       * Strähne wird gespiegelt statt zweimal beschrieben, damit sie nicht
       * eines Tages auf einer Seite anders aussieht als auf der anderen.
       */
      const sw = w * 1.02
      const strand = `M ${60 - sw} 44
                      C ${60 - sw - 7} 76 ${60 - sw - 3} 96 ${60 - sw + 3} 110
                      C ${60 - sw + 15} 110 ${60 - sw + 17} 94 ${60 - sw + 13} 64 Z`
      return (
        <g fill={face.hair}>
          <path d={strand} />
          <path d={strand} transform="matrix(-1 0 0 1 120 0)" />
          <path d={cap(w, h, 48, 14, face.headShape)} />
        </g>
      )
    }

    case 'wave': {
      // Asymmetrisch: rechts hoch, links tief. Der Unterschied zwischen zwei
      // Frisuren muss man auf einen Blick sehen, sonst trägt er nichts bei.
      const hw = w * 1.04
      const crown = 64 - h - 3
      return (
        <path
          d={`M ${60 - hw} 52
              q 0 ${crown - 50} ${hw} ${crown - 52}
              q ${hw} 2 ${hw} ${52 - crown}
              q ${-hw * 0.55} -18 ${-hw} -10
              q ${-hw * 0.5} 12 ${-hw} 10 z`}
          fill={face.hair}
        />
      )
    }

    default:
      return <path d={cap(w, h, 48, 14, face.headShape)} fill={face.hair} />
  }
}

/**
 * Die Nase — jetzt sichtbar (02.09.).
 *
 * Auf dem Bogen vom 02.09. war sie auf den meisten Gesichtern gar nicht zu
 * finden: 18 bis 30 Prozent Schwarz auf hautfarbenem Grund verschwinden. Sie
 * war damit einer von sieben „auffälligen" Kanälen, der nichts beitrug.
 * Kräftiger gezeichnet und in der Länge veränderlich trägt sie wirklich.
 */
function Nose({ face, y, spanne }: { face: FaceSpec; y: number; spanne: number }) {
  const laenge = 10 * face.noseLength * spanne
  const oben = y + 5
  if (face.nose === 'round') {
    return (
      <g>
        <path
          d={`M 60 ${oben + 1} l 0 ${laenge}`}
          stroke="#00000026"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="60" cy={oben + laenge + 2} r={3.4 + face.noseLength} fill="#00000026" />
      </g>
    )
  }
  if (face.nose === 'wide') {
    return (
      <path
        d={`M ${60 - 4 - 3 * face.noseLength} ${oben + laenge + 1} q ${4 + 3 * face.noseLength} ${5} ${8 + 6 * face.noseLength} 0`}
        stroke="#00000042"
        strokeWidth="2.8"
        fill="none"
        strokeLinecap="round"
      />
    )
  }
  return (
    <path
      d={`M 60 ${oben - 2} l 0 ${laenge + 2} l ${-4} 2`}
      stroke="#0000003a"
      strokeWidth="2.4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
}

/** Der Mund — vier Formen wie bisher, jetzt zusätzlich in der Breite veränderlich. */
function Mouth({ face, y }: { face: FaceSpec; y: number }) {
  const halb = 8 * face.mouthWidth
  const dick = 2.6 + face.mouthWidth * 0.8
  switch (face.mouth) {
    case 'open':
      return <ellipse cx="60" cy={y + 2} rx={halb * 0.9} ry={4 + face.mouthWidth} fill="#7d3b3b" />
    case 'straight':
      return (
        <path
          d={`M ${60 - halb} ${y + 2} l ${2 * halb} 0`}
          stroke="#8c4a45"
          strokeWidth={dick}
          strokeLinecap="round"
        />
      )
    case 'smirk':
      return (
        <path
          d={`M ${60 - halb} ${y + 1} q ${halb} 6 ${2 * halb} -2`}
          stroke="#8c4a45"
          strokeWidth={dick}
          fill="none"
          strokeLinecap="round"
        />
      )
    default:
      return (
        <path
          d={`M ${60 - halb} ${y - 1} q ${halb} 8 ${2 * halb} 0`}
          stroke="#8c4a45"
          strokeWidth={dick}
          fill="none"
          strokeLinecap="round"
        />
      )
  }
}

function Beard({ face, w, y }: { face: FaceSpec; w: number; y: number }) {
  if (face.beard === 1) {
    // Schnurrbart, als Fläche und nicht als Strich: Ein Strich in Haarfarbe
    // sieht neben einem Vollbart aus wie ein vergessener Bleistiftstrich.
    return (
      <path
        d={`M 47 ${y - 5} q 7 -6 13 -1 q 6 -5 13 1 q -6 6 -13 4 q -7 2 -13 -4 z`}
        fill={face.hair}
        opacity="0.94"
        stroke="#00000030"
        strokeWidth="1.2"
      />
    )
  }
  /*
   * Der Vollbart ist absichtlich **größer als das Gesicht**: Die Form wird am
   * Kopf beschnitten (siehe `clipPath` oben), und dadurch folgt sie jedem
   * Kiefer von selbst. Beschrieben ist nur die Oberkante — an den Koteletten
   * auf Ohrhöhe, in der Mitte knapp unter der Nase.
   *
   * Die erste Fassung setzte die Koteletten auf y = 56, also **über** den
   * Augen. Das war kein Bart mehr, sondern eine Maske über der halben unteren
   * Gesichtshälfte; auf dem Bogen sah jeder Bärtige gleich aus. Koteletten
   * enden auf Höhe des Ohrs, nicht der Braue.
   */
  return (
    <path
      d={`M ${60 - w * 1.2} ${y - 20}
          Q 60 ${y + 8} ${60 + w * 1.2} ${y - 20}
          L ${60 + w * 1.2} 130
          L ${60 - w * 1.2} 130 Z`}
      fill={face.hair}
      opacity="0.94"
      /*
        Der dunkle Rand ist nicht Zierde, sondern das, was den Bart überhaupt
        sichtbar macht: Dunkles Haar auf dunkler Haut ergibt sonst eine Fläche
        in einer Fläche. Von den vier bärtigen Gesichtern im Prüfbogen waren
        zwei ohne diese Linie schlicht nicht als bärtig zu erkennen.

        Nur die Oberkante bekommt ihn zu sehen — Seiten und Unterkante liegen
        außerhalb des Kopfes und werden mit der Maske weggeschnitten.
      */
      stroke="#00000030"
      strokeWidth="1.6"
    />
  )
}

function Glasses({ face, y }: { face: FaceSpec; y: number }) {
  const dx = 13 * face.eyeSpacing
  return (
    <g stroke="#3a332b" strokeWidth="2" fill="none" opacity="0.85">
      <circle cx={60 - dx} cy={y} r={9 * face.eyeSize} />
      <circle cx={60 + dx} cy={y} r={9 * face.eyeSize} />
      <path d={`M ${60 - dx + 9 * face.eyeSize} ${y} l ${2 * dx - 18 * face.eyeSize} 0`} />
    </g>
  )
}
