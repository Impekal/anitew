import { useId, useMemo } from 'react'

import { type Face as FaceSpec, faceFor } from '../core/index.ts'

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
  const head = headPath(w, h, face.jaw)
  /* Wo das Kinn endet, hängt von der Kopfhöhe ab — Hals und Schultern müssen
     mitwandern, sonst schwebt bei einem kurzen Kopf der Kragen. */
  const chin = 64 + h * 0.66
  // Doppelpunkte aus `useId` vertragen sich nicht mit `url(#…)`.
  const clipId = `face-${useId().replace(/:/g, '')}`

  const browY = 58 - 6 * face.brow
  const brows = [
    `M ${60 - 20 * face.eyeSpacing} ${browY} q 7 ${-4 * face.brow} 14 0`,
    `M ${60 + 6 * face.eyeSpacing} ${browY} q 7 ${-4 * face.brow} 14 0`,
  ]

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
      <ellipse cx={60 - w} cy="66" rx={5 * face.ears} ry={8 * face.ears} fill={face.skin} />
      <ellipse cx={60 + w} cy="66" rx={5 * face.ears} ry={8 * face.ears} fill={face.skin} />

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

      {/* Augen */}
      <g>
        <ellipse cx={60 - 13 * face.eyeSpacing} cy="64" rx={6 * face.eyeSize} ry={4.2 * face.eyeSize} fill="#fffdf8" />
        <ellipse cx={60 + 13 * face.eyeSpacing} cy="64" rx={6 * face.eyeSize} ry={4.2 * face.eyeSize} fill="#fffdf8" />
        <circle cx={60 - 13 * face.eyeSpacing} cy="64" r={2.6 * face.eyeSize} fill={face.eyes} />
        <circle cx={60 + 13 * face.eyeSpacing} cy="64" r={2.6 * face.eyeSize} fill={face.eyes} />
      </g>

      {/*
        Reihenfolge von unten nach oben: Bart, Nase, Mund.
        Der Bart liegt auf der Haut, Nase und Mund liegen auf dem Bart — so
        wie bei einem Gesicht. Zeichnet man ihn zuletzt, verdeckt er beides.
      */}
      {face.beard !== 0 && (
        <g clipPath={`url(#${clipId})`}>
          <Beard face={face} w={w} />
        </g>
      )}
      <Nose face={face} />
      <Mouth face={face} />
      {face.glasses && <Glasses face={face} />}
    </svg>
  )
}

/** Der Umriss des Kopfes — einmal beschrieben, zweimal gebraucht: als Fläche und als Maske. */
function headPath(w: number, h: number, jaw: number): string {
  return `M 60 ${64 - h}
          q ${w} 0 ${w} ${h}
          q 0 ${h * (0.62 - jaw * 0.34)} ${-w * (0.55 + jaw * 0.4)} ${h * 0.52}
          q ${-w * (0.45 - jaw * 0.4)} ${h * 0.14} ${-w * (0.9 - jaw * 0.8)} 0
          q ${-w * (0.55 + jaw * 0.4)} ${-h * 0.38} ${-w * (0.55 + jaw * 0.4)} ${-h * 0.52}
          q 0 ${-h} ${w} ${-h} z`
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
function cap(w: number, h: number, drop: number, dip: number): string {
  const top = 64 - h - 3
  const hw = w * 1.04
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
      return <path d={cap(w, h, 48, -16)} fill={face.hair} />

    case 'bun':
      return (
        <g fill={face.hair}>
          <circle cx="60" cy={top - 2} r={w * 0.32} />
          <path d={cap(w, h, 48, 14)} />
        </g>
      )

    case 'curls':
      return (
        <g fill={face.hair}>
          {[-0.86, -0.44, 0, 0.44, 0.86].map((offset, index) => (
            <circle key={index} cx={60 + offset * w} cy={top + 5 + Math.abs(offset) * 11} r={w * 0.3} />
          ))}
          <path d={cap(w, h, 48, 12)} />
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
          <path d={cap(w, h, 48, 14)} />
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
      return <path d={cap(w, h, 48, 14)} fill={face.hair} />
  }
}

function Nose({ face }: { face: FaceSpec }) {
  if (face.nose === 'round') {
    return <circle cx="60" cy="78" r="4" fill="#00000018" />
  }
  if (face.nose === 'wide') {
    return <path d="M 54 80 q 6 5 12 0" stroke="#00000030" strokeWidth="2.4" fill="none" strokeLinecap="round" />
  }
  return <path d="M 60 68 l 0 12 l -4 2" stroke="#00000028" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
}

function Mouth({ face }: { face: FaceSpec }) {
  switch (face.mouth) {
    case 'open':
      return <ellipse cx="60" cy="92" rx="7" ry="5" fill="#7d3b3b" />
    case 'straight':
      return <path d="M 52 92 l 16 0" stroke="#8c4a45" strokeWidth="2.8" strokeLinecap="round" />
    case 'smirk':
      return <path d="M 52 91 q 8 6 16 -2" stroke="#8c4a45" strokeWidth="2.8" fill="none" strokeLinecap="round" />
    default:
      return <path d="M 51 89 q 9 8 18 0" stroke="#8c4a45" strokeWidth="2.8" fill="none" strokeLinecap="round" />
  }
}

function Beard({ face, w }: { face: FaceSpec; w: number }) {
  if (face.beard === 1) {
    // Schnurrbart, als Fläche und nicht als Strich: Ein Strich in Haarfarbe
    // sieht neben einem Vollbart aus wie ein vergessener Bleistiftstrich.
    return (
      <path
        d="M 47 85 q 7 -6 13 -1 q 6 -5 13 1 q -6 6 -13 4 q -7 2 -13 -4 z"
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
      d={`M ${60 - w * 1.2} 70
          Q 60 98 ${60 + w * 1.2} 70
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

function Glasses({ face }: { face: FaceSpec }) {
  const dx = 13 * face.eyeSpacing
  return (
    <g stroke="#3a332b" strokeWidth="2" fill="none" opacity="0.85">
      <circle cx={60 - dx} cy="64" r={9 * face.eyeSize} />
      <circle cx={60 + dx} cy="64" r={9 * face.eyeSize} />
      <path d={`M ${60 - dx + 9 * face.eyeSize} 64 l ${2 * dx - 18 * face.eyeSize} 0`} />
    </g>
  )
}
