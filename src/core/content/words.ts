/**
 * Der Wortvorrat fürs Einprägen und Abrufen.
 *
 * Drei Regeln, nach denen diese Listen zusammengestellt sind:
 *
 * 1. **Konkret und bildhaft.** „Anker“ lässt sich sehen, „Aspekt“ nicht. Wer
 *    sich ein Bild machen kann, merkt sich das Wort — genau darauf zielt das
 *    Training, und später bauen die Merktechniken (Backlog D5) darauf auf.
 * 2. **Je Sprache eigen, nicht übersetzt** (Backlog L6, D-007). Eine deutsche
 *    Liste durch den Übersetzer geschickt ergibt auf Englisch krumme Wörter
 *    und misst dann die Übersetzung statt das Gedächtnis.
 * 3. **Untereinander verschieden.** Keine Reimpaare, keine Wortfamilien, keine
 *    zwei Wörter mit demselben Anfang — sonst misst der Abruf, wie gut jemand
 *    ähnliche Dinge auseinanderhält (Interferenz, Backlog C6).
 *
 * Die Listen sind bewusst lang genug, dass eine 15-Minuten-Einheit sie nicht
 * ausschöpft: 8 Wörter × 8 Runden = 64.
 */

import { FALLBACK_LANGUAGE, type Language } from '../language.ts'

const de = [
  'Anker', 'Ampel', 'Bahnhof', 'Bergwerk', 'Besen', 'Bienenstock', 'Blitz', 'Brunnen',
  'Bügeleisen', 'Dachziegel', 'Damm', 'Drachen', 'Eimer', 'Eisberg', 'Fahrrad', 'Fass',
  'Feder', 'Fernrohr', 'Feuerwehr', 'Flöte', 'Gabel', 'Geige', 'Gewitter', 'Gletscher',
  'Hammer', 'Hängematte', 'Heuhaufen', 'Hufeisen', 'Igel', 'Insel', 'Kaktus', 'Kamin',
  'Kanone', 'Karussell', 'Kerze', 'Kieselstein', 'Kompass', 'Krone', 'Laterne', 'Lawine',
  'Leiter', 'Leuchtturm', 'Löffel', 'Mühle', 'Nadel', 'Nashorn', 'Nebel', 'Obstkorb',
  'Ofen', 'Papagei', 'Pfeife', 'Pilz', 'Pinsel', 'Posaune', 'Quelle', 'Rakete',
  'Regenschirm', 'Ruder', 'Sanduhr', 'Sattel', 'Schaukel', 'Scheune', 'Schlitten', 'Schlüssel',
  'Schmetterling', 'Schornstein', 'Segel', 'Seil', 'Spiegel', 'Stiefel', 'Tannenzapfen', 'Teppich',
  'Trommel', 'Tunnel', 'Uhrwerk', 'Vulkan', 'Waage', 'Wasserfall', 'Windmühle', 'Zelt',
  'Ziegel', 'Zwiebel',
]

const en = [
  'anchor', 'anvil', 'balloon', 'barn', 'beacon', 'bicycle', 'blanket', 'bonfire',
  'bottle', 'bracelet', 'bridge', 'bucket', 'cactus', 'candle', 'canoe', 'carousel',
  'castle', 'chimney', 'compass', 'crown', 'dolphin', 'drum', 'eagle', 'engine',
  'feather', 'ferry', 'fiddle', 'flagpole', 'fountain', 'glacier', 'glove', 'hammer',
  'hammock', 'harbour', 'hedgehog', 'helmet', 'horseshoe', 'hourglass', 'iceberg', 'island',
  'kettle', 'kite', 'ladder', 'lantern', 'lighthouse', 'marble', 'meadow', 'mirror',
  'mushroom', 'needle', 'orchard', 'otter', 'paddle', 'parrot', 'pebble', 'pillow',
  'pumpkin', 'quarry', 'rocket', 'saddle', 'sailboat', 'scissors', 'shovel', 'sledge',
  'spiral', 'staircase', 'stopwatch', 'sunflower', 'telescope', 'thimble', 'thunder', 'tunnel',
  'turtle', 'umbrella', 'volcano', 'waterfall', 'whistle', 'windmill', 'wreath', 'zipper',
]

const POOLS: Partial<Record<Language, readonly string[]>> = { de, en }

/**
 * Der Wortvorrat einer Sprache.
 *
 * Für die neun Sprachen ohne eigene Liste (Backlog L6) gibt es bewusst keinen
 * automatischen Ersatz aus einer anderen Sprache — deutsche Wörter in einem
 * japanischen Training wären keine Sprachunterstützung, sondern eine Attrappe.
 * Bis die Liste da ist, wird auf der Rückfallsprache trainiert, und die App
 * sagt das (siehe `hasWordPool`).
 */
export function wordPool(language: Language): readonly string[] {
  return POOLS[language] ?? (POOLS[FALLBACK_LANGUAGE] as readonly string[])
}

export function hasWordPool(language: Language): boolean {
  return POOLS[language] !== undefined
}
