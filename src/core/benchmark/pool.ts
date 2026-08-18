/**
 * Der Quarantäne-Vorrat für den Benchmark (Backlog F2a · D-006).
 *
 * Das ist die Liste, die den Unterschied zwischen einer Messung und einer
 * Selbsttäuschung ausmacht — und zwar aus einem Grund, der das ganze Genre
 * betrifft:
 *
 * **Wer eine Übung dreißig Tage lang macht, wird in dieser Übung besser.**
 * Das beweist nicht, dass sein Gedächtnis besser geworden ist; er kennt
 * vielleicht nur die Übung. Würde der Benchmark aus demselben Wortvorrat
 * ziehen wie das Training, dann misst er genau das: geübte Wörter. Die Zahl
 * stiege, und sie hieße nichts.
 *
 * Deshalb liegen diese Wörter **nur hier**. Sie kommen im Training nicht vor,
 * wandern nie in den Wiederholungsplan und tauchen in keinem Modul auf. Dass
 * die beiden Listen sich nicht überschneiden, ist nicht Sorgfalt beim
 * Schreiben, sondern eine geprüfte Eigenschaft (siehe `tests/core`).
 *
 * Zusammengestellt nach denselben drei Regeln wie der Trainingsvorrat:
 * konkret und bildhaft, je Sprache eigen statt übersetzt, untereinander
 * verschieden.
 *
 * ── Was diese Liste **nicht** kann, und was daraus folgt ──────────────────
 *
 * Sie ist endlich. Bei zwanzig Wörtern je Messung und einer Messung alle
 * vierzehn Tage reicht sie für drei Messungen, danach wiederholt sich der
 * Inhalt. Ein Wort, das man vor sechs Wochen einmal drei Minuten lang gesehen
 * hat, verfälscht wenig — aber es verfälscht.
 *
 * Die App **sagt das**, statt es zu verschweigen: `poolCycles` meldet, ab
 * welcher Messung der Vorrat von vorn beginnt. Wer die Liste verlängert,
 * schiebt diesen Punkt hinaus; wegdefinieren lässt er sich nicht.
 */

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

const POOLS: Partial<Record<Language, readonly string[]>> = { de, en }

/** Wörter je Messung. Zwanzig — die Zahl aus F5 („Day 1: 8/20“). */
export const BENCHMARK_ITEMS = 20

export function benchmarkPool(language: Language): readonly string[] {
  return POOLS[language] ?? (POOLS[FALLBACK_LANGUAGE] as readonly string[])
}

export function hasBenchmarkPool(language: Language): boolean {
  return POOLS[language] !== undefined
}

/**
 * Die Wörter der `ordinal`-ten Messung, ab 1 gezählt.
 *
 * Der Reihe nach durch den Vorrat, nicht zufällig: Zufällig gezogen
 * überschnitten sich zwei aufeinanderfolgende Messungen mit hoher
 * Wahrscheinlichkeit, und dann wäre die zweite teils eine Wiederholung der
 * ersten. Der Reihe nach sind sie so lange **überschneidungsfrei**, bis der
 * Vorrat einmal herum ist.
 */
export function benchmarkItems(ordinal: number, language: Language): readonly string[] {
  const pool = benchmarkPool(language)
  const start = ((ordinal - 1) * BENCHMARK_ITEMS) % pool.length
  const items = [...pool.slice(start, start + BENCHMARK_ITEMS)]
  // Am Ende der Liste wieder von vorn — sonst käme eine kürzere Messung
  // heraus, und „gleicher Aufbau“ (D-006) wäre gebrochen.
  if (items.length < BENCHMARK_ITEMS) items.push(...pool.slice(0, BENCHMARK_ITEMS - items.length))
  return items
}

/**
 * Ab welcher Messung sich der Vorrat wiederholt.
 *
 * Wird angezeigt, nicht verschwiegen: Ab dieser Messung enthält der Benchmark
 * Wörter, die schon einmal darin vorkamen — die Zahl wird dadurch etwas zu
 * freundlich. Ehrlichkeit heißt hier, die Grenze zu nennen, nicht sie zu
 * bestreiten.
 */
export function poolCycles(language: Language): number {
  return Math.floor(benchmarkPool(language).length / BENCHMARK_ITEMS) + 1
}
