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
 *    zwei fast gleichen Schreibformen — sonst misst der Abruf, wie gut jemand
 *    ähnliche Dinge auseinanderhält (Interferenz, Backlog C6).
 *
 * Die Listen sind bewusst lang genug, dass eine 15-Minuten-Einheit sie nicht
 * ausschöpft. C6 prüft die Regel zusätzlich zur Laufzeit, damit auch spätere
 * Erweiterungen nicht unbemerkt störende Paare einschleusen.
 */

import { FALLBACK_LANGUAGE, type Language } from '../language.ts'
import { withoutInterference } from './interference.ts'

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

const fr = [
  'ancre', 'ampoule', 'balançoire', 'bougie', 'boussole', 'cactus', 'canoë', 'cerf-volant',
  'chameau', 'cheminée', 'cloche', 'coquillage', 'couronne', 'échelle', 'écureuil', 'éléphant',
  'entonnoir', 'éventail', 'flèche', 'flûte', 'fontaine', 'fourche', 'girafe', 'glacier',
  'hache', 'hamac', 'harpe', 'igloo', 'lanterne', 'lasso', 'marteau', 'montgolfière',
  'moulin', 'oreiller', 'panier', 'phare', 'pinceau', 'pyramide', 'radeau', 'sablier',
  'tambour', 'tente', 'tonneau', 'tortue', 'trompette', 'volcan', 'violon', 'brouette',
  'écharpe', 'enclume',
]

const es = [
  'ancla', 'abeja', 'balcón', 'barril', 'bicicleta', 'brújula', 'campana', 'candado',
  'cañón', 'caracola', 'carretilla', 'castillo', 'cepillo', 'chimenea', 'cohete', 'cometa',
  'corona', 'cubo', 'delfín', 'escalera', 'escoba', 'espejo', 'faro', 'flauta',
  'fogata', 'fuente', 'girasol', 'globo', 'granero', 'guante', 'hamaca', 'hacha',
  'herradura', 'hielo', 'jaula', 'jarrón', 'linterna', 'llave', 'martillo', 'molino',
  'montaña', 'nido', 'paraguas', 'pato', 'peonza', 'pincel', 'pirámide', 'puente',
  'reloj', 'remo', 'rueda', 'sartén', 'serpiente', 'sombrero', 'tambor', 'telescopio',
  'tienda', 'tobogán', 'trompeta', 'túnel', 'vela', 'volcán', 'zapato', 'zanahoria',
  'ardilla', 'armario', 'botella', 'caballo', 'cactus', 'cascada', 'cesta', 'columpio',
  'embudo', 'estatua', 'farol', 'guitarra', 'isla', 'loro', 'nube', 'tractor',
]

const it = [
  'ancora', 'aquilone', 'aratro', 'barile', 'bicicletta', 'bussola', 'campanile', 'candela',
  'cannocchiale', 'cascata', 'castello', 'cavalletto', 'cesto', 'chiave', 'chitarra', 'clessidra',
  'collina', 'corona', 'diga', 'faro', 'fischietto', 'fontana', 'forno', 'fulmine',
  'gabbia', 'ghiacciaio', 'giostra', 'guanto', 'isola', 'lampione', 'lanterna', 'lente',
  'mulino', 'nuvola', 'ombrello', 'pappagallo', 'pennello', 'ponte', 'pozzo', 'razzo',
  'remo', 'ruota', 'sasso', 'scala', 'scarpa', 'secchio', 'slitta', 'specchio',
  'stella', 'tamburo', 'tenda', 'timone', 'torre', 'tromba', 'tunnel', 'vulcano',
  'alveare', 'aquila', 'botte', 'carota', 'ciminiera', 'delfino', 'elmetto', 'fenicottero',
  'fisarmonica', 'foca', 'girasole', 'granaio', 'ippopotamo', 'locomotiva', 'mongolfiera', 'nido',
  'pala', 'piramide', 'sedia', 'treno', 'violino', 'zoccolo', 'zattera', 'boa',
]

const POOLS: Partial<Record<Language, readonly string[]>> = { de, en, fr, es, it }

/**
 * Der Wortvorrat einer Sprache.
 *
 * Für Sprachen ohne eigene Liste (Backlog L6) gibt es bewusst keinen
 * automatischen Ersatz aus einer anderen Sprache — deutsche Wörter in einem
 * japanischen Training wären keine Sprachunterstützung, sondern eine Attrappe.
 * Bis die Liste da ist, wird auf der Rückfallsprache trainiert, und die App
 * sagt das (siehe `hasWordPool`).
 *
 * C6 läuft **hier**, unmittelbar bevor der Vorrat an den Session-Planer geht.
 * Damit bleibt die kuratierte Liste lesbar und überprüfbar, während spätere
 * Ergänzungen trotzdem nicht versehentlich Fast-Dubletten ins freie Abrufen
 * bringen können.
 */
export function wordPool(language: Language): readonly string[] {
  const pool = POOLS[language] ?? (POOLS[FALLBACK_LANGUAGE] as readonly string[])
  return withoutInterference(pool)
}

export function hasWordPool(language: Language): boolean {
  return POOLS[language] !== undefined
}
