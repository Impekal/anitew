/**
 * Zwillingspaare — Ähnliches auseinanderhalten (Backlog C6/D3).
 *
 * Je Paar zwei echte Wörter, die sich zum Verwechseln ähnlich sind: ein
 * Buchstabe anders, eine Silbe vertauscht. Eingeprägt wird **eines** davon;
 * gefragt wird später mit beiden — „Welches stand da?“ Das trainiert genau
 * die Fähigkeit, die beim Lernen am häufigsten reißt: zwei ähnliche
 * Einträge nicht ineinanderlaufen zu lassen (Interferenz).
 *
 * Kuratiert, nicht erzeugt: Ob zwei Wörter zum Verwechseln ähnlich sind,
 * entscheidet keine Levenshtein-Distanz, sondern das Lesen. Und **ohne
 * Überschneidung mit den anderen Vorräten** — ein Zwilling, der zugleich im
 * Wortmodul oder gar im Quarantänevorrat der Messung läge, machte aus zwei
 * getrennten Übungen eine (C6) oder verseuchte die Messung (F2a).
 */

import { createRng } from '../rng.ts'
import type { Language } from '../language.ts'

export const TWIN_SEPARATOR = '%'

const PAIRS: Readonly<Partial<Record<Language, readonly (readonly [string, string])[]>>> = {
  de: [
    ['Kirche', 'Kirsche'], ['Mantel', 'Mangel'], ['Fliege', 'Fliese'], ['Karte', 'Kante'],
    ['Bogen', 'Boden'], ['Wolke', 'Wolle'], ['Hacke', 'Harke'], ['Dackel', 'Deckel'],
    ['Angel', 'Engel'], ['Wanne', 'Wange'], ['Blume', 'Bluse'], ['Ente', 'Ernte'],
    ['Birke', 'Birne'], ['Hummel', 'Himmel'], ['Rose', 'Dose'],
  ],
  en: [
    ['desert', 'dessert'], ['angel', 'angle'], ['medal', 'metal'], ['spider', 'cider'],
    ['button', 'mutton'], ['monkey', 'donkey'], ['lemon', 'melon'], ['pepper', 'copper'],
    ['pedal', 'petal'], ['goat', 'coat'], ['mouse', 'moose'], ['beard', 'bread'],
    ['plate', 'plane'], ['stable', 'staple'], ['tower', 'towel'],
  ],
  fr: [
    ['cheval', 'cheveu'], ['poisson', 'poison'], ['désert', 'dessert'], ['raisin', 'raison'],
    ['bouton', 'mouton'], ['poule', 'boule'], ['carte', 'carpe'], ['sable', 'table'],
    ['pomme', 'paume'], ['tour', 'four'], ['cheville', 'chenille'], ['chapeau', 'château'],
    ['pêche', 'bêche'], ['mur', 'mûre'], ['plume', 'prune'],
  ],
  es: [
    ['casa', 'caza'], ['valla', 'vaya'], ['hola', 'ola'], ['tubo', 'tuvo'],
    ['bello', 'vello'], ['cocer', 'coser'], ['grabar', 'gravar'], ['rallar', 'rayar'],
    ['hasta', 'asta'], ['honda', 'onda'], ['botar', 'votar'], ['barón', 'varón'],
    ['baca', 'vaca'], ['sabia', 'savia'], ['rebelar', 'revelar'],
  ],
  it: [
    ['cassa', 'casa'], ['penna', 'panna'], ['sete', 'seta'], ['mela', 'vela'],
    ['collo', 'colpo'], ['manto', 'mento'], ['sale', 'sole'], ['cane', 'carne'],
    ['vetro', 'metro'], ['notte', 'note'], ['palco', 'parco'], ['riso', 'viso'],
    ['lana', 'luna'], ['pasta', 'posta'], ['tetto', 'letto'],
  ],
  pt: [
    ['acento', 'assento'], ['censo', 'senso'], ['cela', 'sela'], ['cozer', 'coser'],
    ['concerto', 'conserto'], ['comprimento', 'cumprimento'], ['descrição', 'discrição'],
    ['emergir', 'imergir'], ['eminente', 'iminente'], ['mandado', 'mandato'],
    ['peão', 'pião'], ['soar', 'suar'], ['tráfego', 'tráfico'], ['sessão', 'seção'],
    ['ratificar', 'retificar'],
  ],
}

/** Gibt es für diese Sprache Zwillingspaare? */
export function hasTwinPool(language: Language): boolean {
  return (PAIRS[language]?.length ?? 0) > 0
}

/** Alle Paare einer Sprache — für Prüfungen und Zählungen. */
export function twinPairs(language: Language): readonly (readonly [string, string])[] {
  return PAIRS[language] ?? []
}

/**
 * Der Vorrat einer Einheit: je Paar eine Kennung `gezeigt%köder`, wobei
 * der Seed entscheidet, **welche** Seite gezeigt wird.
 */
export function twinPool(language: Language, seed: string): string[] {
  const rng = createRng(`twins:${seed}`)
  const items = (PAIRS[language] ?? []).map(([first, second]) => {
    const flip = rng.int(2) === 1
    return flip ? `${second}${TWIN_SEPARATOR}${first}` : `${first}${TWIN_SEPARATOR}${second}`
  })
  return rng.shuffle(items)
}

export function twinShown(item: string): string {
  return item.split(TWIN_SEPARATOR)[0] ?? item
}

export function twinFoil(item: string): string {
  return item.split(TWIN_SEPARATOR)[1] ?? item
}

export function twinChoices(item: string): readonly [string, string] {
  const pair = [twinShown(item), twinFoil(item)].sort((a, b) => a.localeCompare(b, 'de'))
  return pair as [string, string]
}
