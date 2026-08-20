/** Quarantäne-Vorrat für den Benchmark (F2a · D-006). */

import { FALLBACK_LANGUAGE, type Language } from '../language.ts'

const de = [
  'Amboss', 'Ballon', 'Bernstein', 'Bohrer', 'Briefkasten', 'Dampfer', 'Delfin', 'Distel',
  'Eichhörnchen', 'Elefant', 'Erdbeere', 'Fackel', 'Falke', 'Fenster', 'Flasche', 'Floß',
  'Gießkanne', 'Gitarre', 'Handschuh', 'Harfe', 'Hocker', 'Hütte', 'Kabel', 'Käfig',
  'Kanu', 'Kessel', 'Kette', 'Kissen', 'Knopf', 'Kran', 'Kürbis', 'Lampe',
  'Lupe', 'Motor', 'Muschel', 'Nest', 'Palme', 'Pfau', 'Pflaume', 'Pinguin',
  'Pyramide', 'Regal', 'Reifen', 'Ring', 'Rutsche', 'Säge', 'Schaufel', 'Schere',
  'Schiff', 'Schnecke', 'Schublade', 'Socke', 'Stern', 'Strohhalm', 'Tafel', 'Tasse',
  'Teekanne', 'Traktor', 'Treppe', 'Truhe',
]

const en = [
  'acorn', 'apron', 'badger', 'basket', 'beehive', 'bellows', 'bookshelf', 'boomerang',
  'brooch', 'cabin', 'cauldron', 'cellar', 'cherry', 'clarinet', 'cobweb', 'corkscrew',
  'cradle', 'curtain', 'dagger', 'dandelion', 'doorbell', 'easel', 'elephant', 'envelope',
  'fireplace', 'flamingo', 'fossil', 'funnel', 'goblet', 'gramophone', 'harbourlight', 'hatchet',
  'jigsaw', 'kayak', 'lampshade', 'lizard', 'mailbox', 'mandolin', 'mitten', 'obelisk',
  'ostrich', 'pancake', 'pinecone', 'pitcher', 'quilt', 'raccoon', 'rooftile', 'seashell',
  'shoelace', 'snowdrift', 'spatula', 'sponge', 'starfish', 'suitcase', 'teapot', 'tractor',
  'trombone', 'walnut', 'wheelbarrow', 'yardstick',
]

const fr = [
  'abricot', 'aiguille', 'ardoise', 'balcon', 'bambou', 'biscuit', 'bouchon', 'brocoli',
  'cadenas', 'carotte', 'ceinture', 'chaussette', 'citron', 'comète', 'coude', 'cravate',
  'crayon', 'domino', 'écrou', 'épingle', 'escargot', 'étoile', 'fauteuil', 'flamant',
  'fossile', 'fourmi', 'framboise', 'grenouille', 'hublot', 'kiwi', 'losange', 'manteau',
  'menotte', 'moufle', 'noisette', 'oignon', 'ortie', 'palette', 'parasol', 'pastèque',
  'pédale', 'pelle', 'perruque', 'punaise', 'piston', 'poêle', 'poulie', 'râteau',
  'rideau', 'robinet', 'ruche', 'sardine', 'savon', 'tabouret', 'tiroir', 'toboggan',
  'trèfle', 'tulipe', 'valise', 'yaourt',
]

const es = [
  'albaricoque', 'alfombra', 'antena', 'azulejo', 'bigote', 'broche', 'burro', 'cabina',
  'calabaza', 'calcetín', 'camello', 'carrete', 'cereza', 'clarinete', 'colador', 'cortina',
  'cuchara', 'dardo', 'dado', 'dominó', 'elefante', 'enchufe', 'escarabajo', 'fósil',
  'frambuesa', 'gafas', 'garrafa', 'gorrión', 'grifo', 'guisante', 'helicóptero', 'imán',
  'jersey', 'kayak', 'ladrillo', 'lagarto', 'lechuza', 'mandolina', 'manopla', 'medusa',
  'melocotón', 'obelisco', 'ostra', 'panqueque', 'piña', 'polea', 'queso', 'raqueta',
  'rinoceronte', 'sacacorchos', 'sandía', 'silbato', 'sofá', 'tenedor', 'tetera', 'urraca',
  'ventilador', 'yogur', 'zorro', 'berenjena',
]

const POOLS: Partial<Record<Language, readonly string[]>> = { de, en, fr, es }

export const BENCHMARK_ITEMS = 20

export function benchmarkPool(language: Language): readonly string[] {
  return POOLS[language] ?? (POOLS[FALLBACK_LANGUAGE] as readonly string[])
}

export function hasBenchmarkPool(language: Language): boolean {
  return POOLS[language] !== undefined
}

export function benchmarkItems(ordinal: number, language: Language): readonly string[] {
  const pool = benchmarkPool(language)
  const start = ((ordinal - 1) * BENCHMARK_ITEMS) % pool.length
  const items = [...pool.slice(start, start + BENCHMARK_ITEMS)]
  if (items.length < BENCHMARK_ITEMS) items.push(...pool.slice(0, BENCHMARK_ITEMS - items.length))
  return items
}

export function poolCycles(language: Language): number {
  return Math.floor(benchmarkPool(language).length / BENCHMARK_ITEMS) + 1
}
