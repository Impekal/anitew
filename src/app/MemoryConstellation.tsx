import { useMemo } from 'react'

import { bandLabel, createRng, memoryClusters, type MemoryGraph, type MemoryNodeType } from '../core/index.ts'

/**
 * Die Memory-Constellation (D-036) — echte Daten, kein Dekor.
 *
 * Jeder Punkt ist eine Erinnerung des Menschen, jede Linie eine bestätigte
 * Verbindung. Die Anordnung ist **deterministisch** aus der Reihenfolge
 * des Merkens gerechnet (goldener Winkel um die Mitte): Dieselben
 * Erinnerungen stehen morgen am selben Ort — eine Konstellation, die bei
 * jedem Öffnen anders stünde, wäre keine.
 *
 * Die Stärke einer Erinnerung ist ihre Helligkeit — Übungsstand, keine
 * Gedächtnisaussage (R-1). Namen stehen an den Ankern (Knoten mit
 * ausgehenden Verbindungen); alles andere bleibt Punkt, sonst wird der
 * Himmel eine Tabelle.
 */

const GOLDEN_ANGLE = 137.50776405003785

/**
 * Das neuronale Netz im Hintergrund (Nutzerwunsch 02.09.).
 *
 * Wörtlich: „Mit Verbindungslinien meinte ich vor allem Design (wie die
 * neuronalen im Hintergrund), abgesehen von den tatsächlichen Verbindungen
 * zwischen den Begriffen."
 *
 * Das ist die Unterscheidung, auf die es hier ankommt — und sie ist im Bild
 * angelegt, nicht nur im Kommentar:
 *
 * - Diese Linien **berühren keinen einzigen Erinnerungspunkt.** Sie liegen
 *   auf einem eigenen Raster, das nur von der Größe der Fläche abhängt und
 *   von keiner Erinnerung. Sie können deshalb gar nicht als Verbindung
 *   zwischen zwei Begriffen missverstanden werden.
 * - Sie sind ein Vielfaches blasser als eine echte Verbindung und liegen
 *   hinter allem, in derselben Gruppe wie die beiden Ringe.
 * - Sie **bewegen sich nicht.** Das Bewegungsbudget der Startseite bleibt bei
 *   22, davon 0 zeichnend. Ein Hintergrund, der blinkt, ist ein Hintergrund,
 *   der stört — und auf einem Telefon ist er Wärme.
 *
 * Die Anordnung kommt aus einem festen Seed (A11, kein `Math.random()`):
 * dasselbe Netz heute wie morgen.
 */
function Netz({ hoehe }: { hoehe: number }) {
  const punkte = useMemo(() => {
    const rng = createRng(`constellation-web:${hoehe}`)
    return Array.from({ length: 16 }, () => ({
      x: 3 + rng.next() * 94,
      y: hoehe * (0.08 + rng.next() * 0.84),
    }))
  }, [hoehe])

  const linien = useMemo(() => {
    const wege: { x1: number; y1: number; x2: number; y2: number }[] = []
    punkte.forEach((eins, i) => {
      // Je Punkt die zwei nächsten Nachbarn — mehr wird ein Gitter, weniger
      // eine Perlenkette.
      const nachbarn = punkte
        .map((zwei, j) => ({ zwei, j, weit: Math.hypot(eins.x - zwei.x, (eins.y - zwei.y) * 2) }))
        .filter((eintrag) => eintrag.j !== i)
        .sort((a, b) => a.weit - b.weit)
        .slice(0, 2)
      for (const { zwei, j } of nachbarn) {
        if (j < i) continue
        wege.push({ x1: eins.x, y1: eins.y, x2: zwei.x, y2: zwei.y })
      }
    })
    return wege
  }, [punkte])

  return (
    /*
      Farbe und Strichstärke stehen an der Gruppe, nicht an jeder Linie: In
      SVG erben Kinder diese Angaben, das sind einmal rund vierzig Zeichen
      statt sechzehnmal. Und sie stehen hier statt im Stylesheet, weil das
      CSS-Budget am 02.09. bei genau 12,0 von 12 KB stand — zwei neue Regeln
      haben es gerissen.

      Die Werte sind bewusst schwächer als eine echte Verbindung
      (`.constellation-edge`) und schwächer als ein Erinnerungspunkt: Das Netz
      soll zu spüren sein, nicht zu lesen.
    */
    <g
      className="constellation-web"
      stroke="rgba(140, 207, 192, .26)"
      strokeWidth="0.22"
      fill="rgba(216, 168, 90, .22)"
    >
      {linien.map((weg) => (
        <line
          key={`${weg.x1},${weg.y1},${weg.x2},${weg.y2}`}
          x1={weg.x1}
          y1={weg.y1}
          x2={weg.x2}
          y2={weg.y2}
        />
      ))}
      {punkte.map((punkt) => (
        <circle
          key={`${punkt.x},${punkt.y}`}
          cx={punkt.x}
          cy={punkt.y}
          r="0.55"
        />
      ))}
    </g>
  )
}

interface Placed {
  readonly id: string
  readonly label: string
  readonly x: number
  readonly y: number
  readonly strength: number
  readonly anchor: boolean
  readonly type: MemoryNodeType
  readonly degree: number
  readonly activityAt: number
}

export const MAX_VISIBLE_MEMORY_NODES = 72

/**
 * Wie breit ein Zeichen im Band ungefähr ist, in Zeicheneinheiten.
 *
 * Am Telefon gemessen (02.09.): ein Name aus 14 Zeichen war 114 Pixel breit,
 * das Band 388 Pixel für 100 Einheiten. Macht 2,1 Einheiten je Zeichen. Damit
 * lässt sich vorher ausrechnen, wie lang ein Name werden darf — statt es zu
 * raten und hinterher zu sehen, dass zwei sich überschreiben.
 */
const EINHEITEN_JE_ZEICHEN = 2.1

/**
 * Luft zwischen dem äußersten Namen und dem Rand des Kastens, in
 * Zeicheneinheiten.
 *
 * Ohne sie lag der erste Name gemessen bei x = 8 Pixeln, während der Kasten
 * bei 12 beginnt — `overflow: hidden` schnitt „Ticket Ba" weg. Eine Rechnung,
 * die auf den Millimeter aufgeht, geht beim ersten breiten Buchstaben nicht
 * mehr auf.
 */
const BAND_LUFT = 2

/*
  Gekürzt wird im Kern (`memory/label.ts`) — hier stand vorher eine eigene,
  ungeputzte Fassung, und die hat am 03.09. auf dem Telefon einen Namen zu
  „.…" zusammenfallen lassen. Der Grund und die Messung stehen dort.
*/

function visibleNodeIds(graph: MemoryGraph, selectedId?: string): Set<string> {
  if (graph.nodes.length <= MAX_VISIBLE_MEMORY_NODES) return new Set(graph.nodes.map((node) => node.id))

  const neighborhood = new Set<string>(selectedId === undefined ? [] : [selectedId])
  if (selectedId !== undefined) {
    for (const edge of graph.edges) {
      if (edge.from === selectedId) neighborhood.add(edge.to)
      if (edge.to === selectedId) neighborhood.add(edge.from)
    }
  }
  const degree = new Map<string, number>()
  for (const edge of graph.edges) {
    degree.set(edge.from, (degree.get(edge.from) ?? 0) + 1)
    degree.set(edge.to, (degree.get(edge.to) ?? 0) + 1)
  }
  const ranked = [...graph.nodes].sort(
    (a, b) =>
      Number(neighborhood.has(b.id)) - Number(neighborhood.has(a.id)) ||
      (degree.get(b.id) ?? 0) - (degree.get(a.id) ?? 0) ||
      b.createdAt - a.createdAt,
  )
  return new Set(ranked.slice(0, MAX_VISIBLE_MEMORY_NODES).map((node) => node.id))
}

/**
 * Die Zeichenfläche ist ein **Band**, kein Quadrat (Gerätebefund 02.09.).
 *
 * Gemessen wurde: „Ton système de mémoire (mit den Begriffen) ist ziemlich
 * klein, kaum leserlich." Die Ursache war nicht die Schrift, sondern die
 * Geometrie. Die Karte ist 404 × 177 Pixel breit, die Koordinaten waren
 * 100 × 100 — quadratisch. Ein SVG passt seinen Inhalt standardmäßig
 * vollständig ein, hier also auf die **Höhe**: Maßstab 1,765, und 234 der
 * 404 Pixel blieben links und rechts leer. Über die halbe Breite verschenkt,
 * und alles darin auf 1,765 geschrumpft.
 *
 * Trägt die Zeichenfläche dasselbe Seitenverhältnis wie die Karte, entfällt
 * das Einpassen: Der Maßstab steigt auf 3,88, dieselbe Schrift wird von 3,9
 * auf 12,4 Pixel groß, und die Punkte bekommen die ganze Breite. Ohne eine
 * einzige zusätzliche Bewegung — es ist dieselbe Zeichnung, nur nicht mehr
 * in einen Streifen in der Mitte gesperrt.
 */
/**
 * Die Höhe des Bandes — und sie folgt seit dem 08.09. dem **sichtbaren
 * Ausschnitt**, nicht mehr dem Seitenverhältnis einer Karte.
 *
 * Der Befund, mit Bild und zwei roten Kringeln: „Nicht ganz."
 *
 * Am Telefon liegt auf dem Band eine Kreismaske (`anitew-living.css`):
 *
 *     border-radius: 50%;
 *     mask-image: radial-gradient(circle, black 0 64%, transparent 92%);
 *
 * Gezeichnet wurde aber ein **breiter flacher Streifen** — 404 × 177 Pixel
 * bei 16:7 — und der lag in einem **Kreis** von 388 × 290 Pixeln. Der
 * Streifen ragte links und rechts hinaus, während oben und unten im Kreis
 * Platz leer stand. Gemessen bei zwanzig Erinnerungen: **sieben von
 * siebzehn Namen überhaupt sichtbar, vier standen frei.** Die übrigen lagen
 * bei 100 bis 133 Prozent des Radius — dort, wo die Maske nichts mehr
 * durchlässt.
 *
 * Beides stammt aus verschiedenen Zeiten und wurde nie zusammengeführt. Die
 * Zeichenfläche trägt jetzt die Form des Ausschnitts: 100 × 75 ergibt bei
 * 388 Pixeln Breite ein Feld von 291 Pixeln Höhe — dieselbe Größe, die die
 * Maske ohnehin freihält, nur zeichnet die App jetzt hinein statt daneben.
 */
const BAND_HOEHE = 75

/**
 * Der Anteil des Radius, bis zu dem die Maske **voll** durchlässt (64 %),
 * und der, ab dem gar nichts mehr durchkommt (92 %). Beide Zahlen stehen so
 * in `anitew-living.css`; sie stehen hier, weil die Anordnung sie kennen
 * muss — eine Anordnung, die den Ausschnitt nicht kennt, parkt Namen dort,
 * wo niemand sie je sieht. Genau das war der Fehler.
 */
const MASKE_FREI = 0.64

/**
 * Das Band gilt nur für die **schmückende** Konstellation der Startseite.
 *
 * Auf der Gedächtnis-Seite ist jeder Punkt ein Knopf mit einer Trefferfläche
 * von zehn mal zehn Einheiten. Drückt man die Anordnung dort flach, rücken
 * die Punkte senkrecht zusammen und ihre Trefferflächen überlappen — dann
 * fängt der Nachbar die Berührung ab, die einem anderen galt. Ein Test hat
 * genau das gefangen: „Madrid" schluckte den Tipp auf „Gitarre". Am Gerät
 * hieße das, die falsche Erinnerung zu öffnen.
 *
 * Die Fläche dort ist ohnehin nicht 16:7 — das Seitenverhältnis der Karte
 * gilt nur unter `.today`. Beide Formen sind also richtig, jede an ihrem Ort.
 */
function feld(tappable: boolean, hoehe = BAND_HOEHE): { hoehe: number; mitte: number; flach: number } {
  return tappable
    ? { hoehe: 100, mitte: 50, flach: 1 }
    : { hoehe, mitte: hoehe / 2, flach: hoehe / 100 }
}

/** Ein Kasten in der Streuung: Mitte und halbe Breite, in Bandeinheiten. */
interface Kasten {
  x: number
  y: number
  w: number
}

/*
 * Der Kasten eines Punktes ist **nicht symmetrisch**, und das war ein Fehler
 * (Gerätebefund 08.09.): Der Name steht über dem Punkt, der Punkt darunter.
 * Gemessen reicht ein Name 5,6 Einheiten über die Mitte hinauf und der Punkt
 * 3,3 hinunter. Gerechnet wurde mit vier nach jeder Seite — deshalb stand
 * „Darbo" zwei Pixel über der Oberkante und wurde abgeschnitten.
 */
const UEBER = 6
const UNTER = 4
/** Der senkrechte Abstand, den zwei Punkte brauchen. */
const KASTEN_HOEHE = UEBER + UNTER
/**
 * Die Drift-Reserve. Die größte Auslenkung beträgt 2,6 Einheiten; drei
 * ließen nur 0,4 Einheiten übrig — 1,5 Pixel, weniger als die zwei Pixel
 * Luft, die der Wächter am Rand verlangt. Seit die Punkte ebenenweise
 * wandern, trifft eine ganze Ebene diesen Ausschlag gleichzeitig, und aus
 * dem seltenen Fall wurde der Regelfall.
 */
const DRIFT = 3.5
/**
 * Die Höhen, unter denen das Band gewählt wird — und warum es überhaupt
 * wächst (Gerätebefund 08.09., mit Bild: drei Punkte eingekringelt, „Nicht
 * ganz").
 *
 * Bis dahin war das Band immer 44 Einheiten hoch, und wurde es eng, trug nur
 * **jeder zweite Punkt** einen Namen. Am Gerät hieß das: zwanzig
 * Erinnerungen, zehn Namen, zehn stumme Punkte — und niemand erfuhr, warum.
 * Genau das war der ursprüngliche Befund „Man sieht nicht alles", und er war
 * nach dem Umbau der Anordnung noch da.
 *
 * Nachgemessen, wie viele Zeichen bei welcher Höhe überlappungsfrei
 * unterzubringen sind:
 *
 *          H=44        H=56        H=68
 *   n=12   8 Zeichen   12          12
 *   n=16   passt nicht  8           8
 *   n=20   passt nicht  4           8
 *   n=24   passt nicht  3           7
 *
 * Bei 44 Einheiten passt ab sechzehn Erinnerungen **keine einzige**
 * Namenslänge, auch keine dreistellige. Das Verstecken war also keine
 * Bequemlichkeit, sondern die einzige Möglichkeit bei dieser Höhe. Der Hebel
 * ist die Höhe, nicht die Beschriftung.
 */
const MINDEST_ZEICHEN = 6
/** Länger lohnt nicht: `bandLabel` deckelt ohnehin bei achtzehn. */
const HOECHST_ZEICHEN = 12

/**
 * Streuen (R2-Folge) und danach so lange auseinanderschieben, bis nichts
 * mehr kollidiert. Steht als eigene Funktion da, weil die Anordnung sie
 * einmal für das fertige Bild braucht — und vorher mehrmals als **Probe**,
 * um Höhe und Namenslänge zu finden.
 */
function streueUndEntzerre(breiten: number[], hoehe: number): Kasten[] {
  const mx = 50
  const my = hoehe / 2
  /*
   * Der Radius, den die Maske **voll** durchlässt. `radial-gradient(circle,
   * …)` misst ohne weitere Angabe bis zur entferntesten Ecke — bei 100 × 75
   * sind das 62,5 Einheiten, und 64 Prozent davon sind 40.
   */
  const frei = MASKE_FREI * Math.hypot(mx, my)
  /** Wie weit ein Kasten von seiner Mitte aus reicht (Name oben, Punkt unten). */
  const reichweite = (w: number) => Math.hypot(w, UEBER)

  /*
   * Gestreut wird in der **Scheibe**, nicht im Rechteck: `sqrt` auf dem
   * Radius, sonst drängt sich alles in der Mitte. Die beiden Zahlen sind
   * die R2-Folge (goldenes Verhältnis in zwei Achsen) — sie streut
   * gleichmäßig, ohne je ein Gitter zu bilden, und sie ist deterministisch
   * (A11: kein `Math.random()`).
   */
  const a1 = 0.7548776662466927
  const a2 = 0.5698402909980532
  const kaesten: Kasten[] = breiten.map((w, i) => {
    const platz = Math.max(0, frei - reichweite(w) - DRIFT)
    const r = platz * Math.sqrt((0.5 + a1 * (i + 1)) % 1)
    const winkel = 2 * Math.PI * ((0.5 + a2 * (i + 1)) % 1)
    return { w, x: mx + r * Math.cos(winkel), y: my + r * Math.sin(winkel) }
  })

  const zurueckInDenKreis = (eintrag: Kasten): void => {
    const platz = Math.max(0, frei - reichweite(eintrag.w) - DRIFT)
    const dx = eintrag.x - mx
    const dy = eintrag.y - my
    const weit = Math.hypot(dx, dy)
    if (weit <= platz || weit === 0) return
    eintrag.x = mx + (dx / weit) * platz
    eintrag.y = my + (dy / weit) * platz
  }

  for (let runde = 0; runde < 20; runde++) {
    for (let i = 0; i < kaesten.length; i++) {
      for (let j = i + 1; j < kaesten.length; j++) {
        const eins = kaesten[i] as Kasten
        const zwei = kaesten[j] as Kasten
        const dx = zwei.x - eins.x
        const dy = zwei.y - eins.y
        // Nötiger Abstand: halbe Breiten plus die Drift beider Punkte.
        const noetigX = eins.w + zwei.w + 2 * DRIFT
        const noetigY = KASTEN_HOEHE + 2 * DRIFT
        const fehltX = noetigX - Math.abs(dx)
        const fehltY = noetigY - Math.abs(dy)
        if (fehltX <= 0 || fehltY <= 0) continue
        /*
         * Auseinander in der Achse, in der weniger fehlt — der kürzere Weg
         * aus der Überlappung. Die Achsen sind verschieden lang, deshalb
         * wird auf dieselbe Skala gebracht, bevor verglichen wird.
         */
        if (fehltX / noetigX < fehltY / noetigY) {
          const schub = ((fehltX + 0.01) / 2) * (dx < 0 ? -1 : 1)
          eins.x -= schub
          zwei.x += schub
        } else {
          const schub = ((fehltY + 0.01) / 2) * (dy < 0 ? -1 : 1)
          eins.y -= schub
          zwei.y += schub
        }
      }
    }
    /*
     * Nach jedem Durchgang zurück in den Kreis. Vorher stand hier das
     * Rechteck — und genau deshalb landeten Namen dort, wo die Maske sie
     * wegblendet.
     */
    for (const eintrag of kaesten) zurueckInDenKreis(eintrag)
  }
  return kaesten
}

/** Steht am Ende noch etwas übereinander? Ohne Drift-Reserve — das ist das Bild. */
function stossenAn(kaesten: Kasten[]): boolean {
  for (let i = 0; i < kaesten.length; i++) {
    for (let j = i + 1; j < kaesten.length; j++) {
      const eins = kaesten[i] as Kasten
      const zwei = kaesten[j] as Kasten
      if (Math.abs(zwei.x - eins.x) < eins.w + zwei.w && Math.abs(zwei.y - eins.y) < KASTEN_HOEHE) {
        return true
      }
    }
  }
  return false
}

/**
 * Die Anordnung **und die Höhe des Bandes** — beides gehört zusammen, seit
 * das Band mit der Anzahl wächst. Käme die Höhe aus einer zweiten Quelle,
 * liefen Zeichenfläche und Anordnung auseinander, sobald eine der beiden
 * angefasst wird. Genau so ist die doppelte Modulliste entstanden.
 */
function layout(
  graph: MemoryGraph,
  tappable: boolean,
  selectedId?: string,
): { punkte: Placed[]; hoehe: number } {
  const { mitte: BAND_MID, flach: FLACH } = feld(tappable)
  const anchors = new Set(graph.edges.map((edge) => edge.from))
  const degree = new Map<string, number>()
  for (const edge of graph.edges) {
    degree.set(edge.from, (degree.get(edge.from) ?? 0) + 1)
    degree.set(edge.to, (degree.get(edge.to) ?? 0) + 1)
  }
  const visible = visibleNodeIds(graph, selectedId)
  const clusters = memoryClusters({
    ...graph,
    nodes: graph.nodes.filter((node) => visible.has(node.id)),
    edges: graph.edges.filter((edge) => visible.has(edge.from) && visible.has(edge.to)),
  })
  /*
   * Wenn **nichts** verbunden ist, ist jede Erinnerung ihr eigener Cluster.
   * Der Kranz aus Clustern drängt sie dann in die Mitte, jede von ihnen ist
   * Anker, jede trägt ihren Namen — und die Namen überschreiben einander
   * (gemeldet 02.09. mit Bild: „Alassane anrufen" lag auf „Daniel Morrat").
   *
   * Für diesen Fall ist die ruhige Welle die ehrlichere Anordnung: gleicher
   * Abstand über die ganze Breite, abwechselnd höher und tiefer. Immer noch
   * deterministisch aus der Reihenfolge des Merkens — dieselben Erinnerungen
   * stehen morgen am selben Ort.
   *
   * Nur für das schmückende Band. Auf der Gedächtnis-Seite ist jeder Punkt
   * ein Knopf mit Trefferfläche; dort bleibt der Kranz.
   *
   * Mehr als vierundzwanzig Punkte nimmt das Band nicht: Ab da ist der
   * Abstand kleiner als ein Punkt breit ist, und aus der Konstellation wird
   * eine Perlenschnur. Der ganze Bestand steht in „Mein Gedächtnis".
   */
  if (!tappable && clusters.length > 2) {
    /*
     * Die Zeilen gelten für **jedes** Band, nicht nur für den unverbundenen
     * Stand — und das war ein Fund im Bild, kein Vorsatz.
     *
     * Der erste Anlauf griff nur, solange gar nichts verbunden war. Kaum stand
     * **eine** Verbindung, fiel die Anordnung auf den Cluster-Kranz zurück,
     * und mit ihm kamen Überlappung und abgeschnittene Namen sofort wieder.
     * Und Verbindungen entstehen jetzt laufend — das Verbinden von Hand kam
     * im selben Zug dazu. Eine Behebung, die genau so lange hält, bis jemand
     * die neue Funktion benutzt, ist keine.
     *
     * Die Reihenfolge folgt den Clustern: Was zusammengehört, steht
     * nebeneinander, und die echten Verbindungslinien laufen dadurch kurze
     * Wege statt quer über das Band.
     */
    const einzeln = clusters
      .flatMap((cluster) => [...cluster.nodes].sort((a, b) => a.createdAt - b.createdAt))
      .slice(0, 24)
    /*
     * Wie lang darf ein Name sein, damit nichts überschreibt und nichts
     * abgeschnitten wird? Das ist eine Gleichung, keine Schätzung.
     *
     * Bei drei Zeilen stehen zwei Punkte derselben Zeile 3 × Schritt
     * auseinander. Ein Name der Breite w braucht links und rechts vom Rand
     * w/2 Platz, sonst ragt der äußerste aus dem Bild. Also:
     *
     *     Schritt = (100 − w) / (n − 1)     und    3 × Schritt ≥ w
     *     ⟹  300 − 3w ≥ w·(n−1)  ⟹  w ≤ (300 − 6·L) / (n + 2)
     *
     * `L` ist die Luft am Rand. Sie steht hier, weil die erste Fassung ohne
     * sie gemessen abgeschnitten wurde: Der äußerste Name lag bei x = 8
     * Pixeln, der Kasten beginnt bei 12, und `overflow: hidden` nahm den Rest.
     * Die 2,1 Einheiten je Zeichen sind ein Mittelwert — bei breiten
     * Buchstaben reicht er nicht, und dann fehlt ein halbes Wort.
     *
     * Beim ersten Versuch stand hier eine geratene Zahl (14 Zeichen), und
     * gemessen überschrieben sich zwei Namen um 13 Pixel.
     */
    /*
     * Wie hoch das Band wird und wie lang die Namen sein dürfen, sagt die
     * Probe (`bandMass`) — beides hängt allein an der Anzahl. Vorher stand
     * hier eine Formel aus der Zeit der drei Zeilen; sie schätzte zu streng
     * und ließ ab sechzehn Erinnerungen die Hälfte der Namen verschwinden.
     */
    const halbBreite = (text: string) => (text.length * EINHEITEN_JE_ZEICHEN) / 2 + BAND_LUFT

    /*
     * **Die Probe rechnet mit denselben Namen, die nachher dastehen.**
     *
     * Vorher lief sie mit lauter gleich breiten Kästen — der Höchstlänge für
     * alle. Das ist bei der Breite die vorsichtigere Annahme, aber es ist
     * eine **andere Rechnung**: Andere Breiten ergeben andere Schübe und
     * damit ganz andere Plätze. „Passt" in der Probe hieß deshalb nicht
     * „passt auf dem Glas". Gemessen bei einer Bandhöhe von 85 Einheiten:
     * Die Probe meldete frei, die Zeichnung hatte Überlappungen.
     *
     * Jetzt wird für jede Kandidatenlänge wirklich gekürzt, wirklich
     * gestreut, wirklich entzerrt — und geprüft. Das kostet ein paar tausend
     * Rechenschritte einmal beim Bauen der Anordnung und nie wieder ein Bild.
     */
    const hoehe = BAND_HOEHE
    type Knoten = (typeof einzeln)[number]
    const versuch = (
      auswahl: readonly Knoten[],
      zeichen: number,
    ): { plaetze: Kasten[]; labels: string[] } | undefined => {
      const labels = auswahl.map((node) => bandLabel(node.label, Math.min(18, zeichen)))
      const plaetze = streueUndEntzerre(labels.map(halbBreite), hoehe)
      return stossenAn(plaetze) ? undefined : { plaetze, labels }
    }

    /*
     * Passen nicht alle, kommen die **stärksten** ins Bild — vorher
     * entschied der Listenplatz (`index % 2`), eine Münze, die nichts über
     * die Erinnerung aussagt. Und die übrigen verschwinden ganz, statt als
     * namenlose Punkte dazustehen: Der Zähler nennt sie.
     */
    const nachStaerke = [...einzeln].sort((a, b) => b.strength - a.strength)
    let gewaehlt: { plaetze: Kasten[]; labels: string[] } | undefined
    let gemischt: { node: Knoten; index: number }[] = []
    for (let punkte = einzeln.length; punkte >= 1 && gewaehlt === undefined; punkte--) {
      const auswahl = punkte >= einzeln.length ? einzeln : nachStaerke.slice(0, punkte)
      // Erst mischen, dann probieren: Die Reihenfolge entscheidet die Plätze.
      const misch = createRng(`constellation-scatter:${punkte}`).shuffle(
        auswahl.map((node, index) => ({ node, index })),
      )
      for (let zeichen = HOECHST_ZEICHEN; zeichen >= MINDEST_ZEICHEN; zeichen--) {
        const ergebnis = versuch(
          misch.map(({ node }) => node),
          zeichen,
        )
        if (ergebnis !== undefined) {
          gewaehlt = ergebnis
          gemischt = misch
          break
        }
      }
    }
    const treffer = gewaehlt ?? { plaetze: [] as Kasten[], labels: [] as string[] }
    const beschriftet = gemischt.map(({ node, index }, i) => ({
      node,
      index,
      label: treffer.labels[i] as string,
    }))
    const plaetze = treffer.plaetze
    const gestreut = beschriftet.map((eintrag, i) => ({
      ...eintrag,
      x: (plaetze[i] as Kasten).x,
      y: (plaetze[i] as Kasten).y,
    }))

    return { hoehe, punkte: gestreut.map(({ node, label, x, y }) => ({
      id: node.id,
      // Das Band ist `aria-hidden`; der ganze Name steht in „Mein Gedächtnis".
      label,
      x: einzeln.length === 1 ? 50 : x,
      y: einzeln.length === 1 ? hoehe / 2 : y,
      strength: node.strength,
      /*
       * Wird es zu eng für jeden Namen, trägt nur jeder zweite Punkt einen —
       * die übrigen bleiben stille Punkte. Ein Himmel mit ein paar benannten
       * Sternen ist eine Konstellation; einer, in dem jeder Punkt beschriftet
       * ist, ist eine Tabelle.
       */
      anchor: true,
      type: node.type,
      degree: 0,
      activityAt: node.lastRecalledAt ?? node.createdAt,
    })) }
  }

  return { hoehe: BAND_HOEHE, punkte: clusters.flatMap((cluster, clusterIndex) => {
    const clusterAngle = ((clusterIndex * GOLDEN_ANGLE) % 360) * (Math.PI / 180)
    const clusterRadius = clusters.length === 1 ? 0 : 27 * Math.sqrt((clusterIndex + 1) / clusters.length)
    const centerX = 50 + clusterRadius * Math.cos(clusterAngle)
    const centerY = BAND_MID + FLACH * clusterRadius * Math.sin(clusterAngle)
    const ordered = [...cluster.nodes].sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id))
    return ordered.map((node, index) => {
      const angle = ((index * GOLDEN_ANGLE) % 360) * (Math.PI / 180)
      const radius = index === 0 ? 0 : Math.min(17, 5 + 3.2 * Math.sqrt(index))
      return {
        id: node.id,
        label: node.label,
        x: centerX + radius * Math.cos(angle),
        y: centerY + FLACH * radius * Math.sin(angle),
        strength: node.strength,
        anchor: anchors.has(node.id) || node.id === cluster.anchor.id,
        type: node.type,
        degree: degree.get(node.id) ?? 0,
        activityAt: node.lastRecalledAt ?? node.createdAt,
      }
    })
  }) }
}

export function MemoryConstellation({
  graph,
  selectedId,
  onSelect,
  selectLabel,
  newNodeIds = new Set(),
  newEdgeIds = new Set(),
  ariaLabel,
  recalledNodeIds = new Set(),
  dueNodeIds = new Set(),
}: {
  graph: MemoryGraph
  selectedId?: string
  onSelect?: (id: string) => void
  selectLabel?: (label: string) => string
  newNodeIds?: ReadonlySet<string>
  newEdgeIds?: ReadonlySet<string>
  ariaLabel?: string
  recalledNodeIds?: ReadonlySet<string>
  /** Heute wirklich über FSRS fällige persönliche Knoten — kein zweiter Terminplan. */
  dueNodeIds?: ReadonlySet<string>
}) {
  const tappable = onSelect !== undefined
  const anordnung = useMemo(
    () => layout(graph, tappable, selectedId),
    [graph, tappable, selectedId],
  )
  const raum = feld(tappable, anordnung.hoehe)
  const placed = anordnung.punkte
  /*
   * Höchstens sechs Ebenen, und bei wenigen Punkten nur so viele wie Punkte
   * — eine leere Ebene würde eine Bewegung kosten und nichts bewegen.
   * Reihum verteilt, damit Nachbarn in der Anordnung auf verschiedenen
   * Ebenen landen und nicht im Gleichschritt wandern.
   */
  const ebenen = useMemo(() => {
    const zahl = Math.max(1, Math.min(6, placed.length))
    const listen: { node: Placed }[][] = Array.from({ length: zahl }, () => [])
    placed.forEach((node, index) => {
      ;(listen[index % zahl] as { node: Placed }[]).push({ node })
    })
    return listen
  }, [placed])
  const byId = useMemo(() => new Map(placed.map((node) => [node.id, node])), [placed])
  const activity = placed.map((node) => node.activityAt)
  const oldestActivity = Math.min(...activity)
  const newestActivity = Math.max(...activity)
  const hasReturn = placed.some((node) => dueNodeIds.has(node.id))
  const hasRecall = placed.some((node) => recalledNodeIds.has(node.id))

  if (placed.length === 0) return null

  return (
    <div
      className={`constellation${onSelect === undefined ? '' : ' constellation-tappable'}${hasReturn ? ' constellation-has-return' : ''}${hasRecall ? ' constellation-has-recall' : ''}`}
      data-world-state={hasRecall ? 'retrieve' : hasReturn ? 'return' : 'quiet'}
    >
      <svg
        viewBox={`0 0 100 ${raum.hoehe}`}
        /*
         * Das Seitenverhältnis muss der Zeichenfläche folgen, sobald das Band
         * wächst (Gerätebefund 08.09.). Die Stilvorlage nagelt es auf 16:7
         * fest; mit einer höheren Zeichenfläche im selben Kasten skaliert der
         * Browser die ganze Zeichnung **kleiner**, statt sie höher zu
         * zeichnen — gemessen schrumpfte sie von 388 auf 250 Pixel Breite und
         * stand mit Rändern in der Mitte. Gesetzt wird nur im Ausnahmefall:
         * Bleibt das Band bei seiner gewohnten Höhe, entscheidet weiter die
         * Stilvorlage, und für alle mit wenigen Erinnerungen ändert sich
         * nichts.
         */
        style={{ aspectRatio: `100 / ${raum.hoehe}` }}
        aria-hidden={onSelect === undefined ? true : undefined}
        aria-label={onSelect === undefined ? undefined : ariaLabel}
      >
        <g className="constellation-atmosphere" aria-hidden="true">
          <Netz hoehe={raum.hoehe} />
          <ellipse cx="50" cy={raum.mitte} rx="46" ry={46 * raum.flach} className="constellation-orbit constellation-orbit-outer" />
          <ellipse cx="50" cy={raum.mitte} rx="33" ry={33 * raum.flach} className="constellation-orbit constellation-orbit-inner" />
        </g>
        {graph.edges.map((edge, index) => {
          const from = byId.get(edge.from)
          const to = byId.get(edge.to)
          if (from === undefined || to === undefined) return null
          const selectedPath = selectedId !== undefined && (edge.from === selectedId || edge.to === selectedId)
          const returnPath = dueNodeIds.has(edge.from) || dueNodeIds.has(edge.to)
          const recallPath = recalledNodeIds.has(edge.from) || recalledNodeIds.has(edge.to)
          const fresh = newEdgeIds.has(edge.id) || newNodeIds.has(edge.from) || newNodeIds.has(edge.to)
          return (
            <line
              key={edge.id}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className={`constellation-edge${fresh ? ' constellation-edge-new' : ''}${selectedPath ? ' constellation-edge-selected' : ''}${returnPath ? ' constellation-edge-return' : ''}${recallPath ? ' constellation-edge-recalled' : ''}`}
              style={{ animationDelay: `${(index * 240) % 1800}ms` }}
            />
          )
        })}
        {/*
          * **Die Bewegung sitzt auf Ebenen, nicht auf jedem Punkt**
          * (Gerätebefund 08.09.).
          *
          * Vorher trieb jeder Punkt für sich. Das sah richtig aus und war
          * teuer: Die Zahl der Dauerbewegungen wuchs mit der Zahl der
          * Erinnerungen. Gemessen am Telefon, Startseite:
          *
          *   ohne Erinnerungen    7    zwölf Erinnerungen   23
          *   zwanzig Erinnerungen 31   ← Schranke ist 24
          *
          * Elf davon sind fest (Kopfzeile, Knöpfe, Bahnen); alles darüber
          * waren die Punkte. Wer zwanzig Dinge gemerkt hat, hatte damit ein
          * wärmeres Telefon als wer zwölf gemerkt hat — die Belohnung fürs
          * Üben war Hitze (Gerätemeldung 01.09.: „Le téléphone chauffe
          * toujours").
          *
          * Auf höchstens sechs Ebenen ist die Zahl **konstant**: siebzehn,
          * bei zwölf Erinnerungen wie bei zweihundert. Jede Ebene hat ihre
          * eigene Dauer und ihren eigenen Vorlauf, drei bis vier Punkte
          * teilen sich eine Bahn — nah genug an eigenen Körpern, und weit
          * weg vom einen Atemzug des ganzen Bildes.
          */}
        <g className="constellation-reise">
        {ebenen.map((ebene, ebeneIndex) => (
          <g
            key={ebeneIndex}
            className="constellation-layer"
            style={
              {
                '--drift': `${19 + ((ebeneIndex * 7) % 13)}s`,
                animationDelay: `-${(ebeneIndex * 2300) % 19000}ms`,
              } as React.CSSProperties
            }
          >
        {ebene.map(({ node }) => {
          const isDue = dueNodeIds.has(node.id)
          const isRecalled = recalledNodeIds.has(node.id)
          return (
            <g
              key={node.id}
              className={`${node.id === selectedId ? 'constellation-memory constellation-memory-selected' : 'constellation-memory'}${newNodeIds.has(node.id) ? ' constellation-memory-new' : ''}${isRecalled ? ' constellation-memory-recalled' : ''}${isDue ? ' constellation-memory-due' : ''}`}
              role={onSelect === undefined ? undefined : 'button'}
              tabIndex={onSelect === undefined ? undefined : 0}
              aria-label={selectLabel?.(node.label) ?? node.label}
              onClick={() => onSelect?.(node.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelect?.(node.id)
                }
              }}
            >
              {onSelect !== undefined && (
                <rect
                  x={node.x - 5}
                  y={node.y - 5}
                  width="10"
                  height="10"
                  rx="5"
                  className="constellation-hit"
                  aria-hidden="true"
                />
              )}
              {isDue && (
                <>
                  <circle cx={node.x} cy={node.y} r="4.3" className="constellation-return-ring constellation-return-ring-a" aria-hidden="true" />
                  <circle cx={node.x} cy={node.y} r="6.2" className="constellation-return-ring constellation-return-ring-b" aria-hidden="true" />
                </>
              )}
              {isRecalled && (
                <circle cx={node.x} cy={node.y} r="5.2" className="constellation-recall-wave" aria-hidden="true" />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={(node.anchor ? 2.1 : 1.25) + Math.min(1.2, node.degree * 0.18)}
                className={`${node.anchor ? 'constellation-node constellation-node-anchor' : 'constellation-node'} constellation-node-${node.type}`}
                style={{
                  opacity:
                    0.25 +
                    node.strength * 0.5 +
                    (newestActivity === oldestActivity
                      ? 0.25
                      : ((node.activityAt - oldestActivity) / (newestActivity - oldestActivity)) * 0.25),
                }}
              />
              {/*
                `node.label !== ''` gehört dazu: Bleibt nach dem Putzen nichts
                Lesbares übrig, bekommt der Punkt keinen Namen statt eines
                nackten „…". Ein Rest mit Pünktchen ist keine Auskunft.
              */}
              {node.anchor && node.label !== '' && (
                /*
                 * Im Band wechseln die Namen zeilenweise die Seite und werden
                 * bei Bedarf gekürzt. Beides aus demselben Grund: Ein Name
                 * wie „Fils Le grand Senegal" ist bei dieser Schriftgröße
                 * über ein Drittel der Breite lang — zwei davon nebeneinander
                 * passen nicht, und übereinander gedruckt sind beide
                 * unlesbar. Der ganze Name steht in „Mein Gedächtnis", einen
                 * Fingertipp entfernt.
                 */
                <text
                  x={node.x}
                  y={node.y - 2.4}
                  className="constellation-label"
                  textAnchor="middle"
                >
                  {node.label}
                </text>
              )}
            </g>
          )
        })}
          </g>
        ))}
        </g>
      </svg>
      {graph.nodes.length > placed.length && (
        <span className="constellation-window" aria-live="polite">
          {placed.length} / {graph.nodes.length}
        </span>
      )}
    </div>
  )
}
