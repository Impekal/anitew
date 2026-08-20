/** Zwillingspaare — Ähnliches auseinanderhalten (Backlog C6/D3). */

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
}

export function hasTwinPool(language: Language): boolean {
  return (PAIRS[language]?.length ?? 0) > 0
}

export function twinPairs(language: Language): readonly (readonly [string, string])[] {
  return PAIRS[language] ?? []
}

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
