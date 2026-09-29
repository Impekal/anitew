/**
 * Namen fürs Modul „Namen & Gesichter“ (Backlog D9, L6).
 *
 * Drei Regeln, nach denen diese Listen gebaut sind — dieselben wie bei den
 * Wörtern, nur schärfer:
 *
 * 1. **Untereinander verschieden.** Kein Anna neben Hanna, kein Martin neben
 *    Marvin. Sonst misst der Abruf, wie gut jemand Ähnliches auseinanderhält,
 *    und nicht, ob er sich den Namen gemerkt hat (Interferenz, C6).
 * 2. **Je Sprachraum eigen, nicht übersetzt.** Ein deutscher Namenspool in
 *    einem englischen Training wäre kein Training, sondern eine Vokabelprüfung.
 * 3. **Gemischt.** Geschlechter und Herkünfte über die Liste verteilt — wer
 *    nur eine Sorte Namen übt, übt nur eine Sorte Namen.
 *
 * Die Portraits sind fest zugeordnet (siehe `portraitAssignments.ts`): Derselbe Name
 * ergibt immer dasselbe Gesicht, heute wie in drei Wochen.
 */

import { FALLBACK_LANGUAGE, type Language } from '../language.ts'

/* Existing name groups remain stable for saved sessions and spaced review.
 * The names are fictional labels, not identities of the photographed people.
 */
const deFeminine = [
  'Beata', 'Dilara', 'Farida', 'Hedwig', 'Jolanda', 'Ludmilla', 'Nadja', 'Pia',
  'Rosalie', 'Theresa', 'Valeska', 'Xenia', 'Zora', 'Carlotta', 'Elif', 'Greta',
  'Ingrid', 'Katharina', 'Margarethe', 'Olivia', 'Rebekka', 'Tamara', 'Viktoria', 'Yasmin',
]

const deMasculine = [
  'Anton', 'Clemens', 'Emil', 'Gustav', 'Ibrahim', 'Konrad', 'Matteo', 'Oskar',
  'Quentin', 'Samir', 'Ulrich', 'Wilhelm', 'Yusuf', 'Bruno', 'Detlef', 'Ferdinand',
  'Hannes', 'Jakob', 'Leopold', 'Norbert', 'Piotr', 'Severin', 'Urs', 'Waldemar',
]

const enFeminine = [
  'Bridget', 'Delphine', 'Fiona', 'Harriet', 'Josephine', 'Lorraine', 'Nadine', 'Penelope',
  'Rosalind', 'Tabitha', 'Vivienne', 'Ximena', 'Yolanda', 'Cordelia', 'Eleanor', 'Gwendolyn',
  'Imogen', 'Kimberly', 'Matilda', 'Ottoline', 'Rowena', 'Theodora', 'Winifred',
]

const enMasculine = [
  'Alfred', 'Casper', 'Edmund', 'Gerald', 'Ignatius', 'Kenneth', 'Malcolm', 'Osborne',
  'Quincy', 'Sullivan', 'Ulysses', 'Wendell', 'Zachary', 'Bartholomew', 'Desmond', 'Fitzgerald',
  'Horace', 'Jasper', 'Leonard', 'Nathaniel', 'Percival', 'Sebastian', 'Vernon',
]

/** Fügt die beiden Hälften abwechselnd zusammen. */
function interleave(a: readonly string[], b: readonly string[]): readonly string[] {
  const out: string[] = []
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const first = a[i]
    const second = b[i]
    if (first !== undefined) out.push(first)
    if (second !== undefined) out.push(second)
  }
  return out
}

const frFeminine = [
  'Amandine', 'Bérénice', 'Coralie', 'Delphine', 'Émeline', 'Fanny', 'Gaëlle', 'Hortense',
  'Inès', 'Joséphine', 'Léonie', 'Margaux', 'Noémie', 'Ombeline', 'Pauline', 'Rachel',
  'Solène', 'Tiphaine', 'Violette', 'Yseult', 'Capucine', 'Élodie', 'Maëlys', 'Sidonie',
]

const frMasculine = [
  'Aurélien', 'Baptiste', 'Corentin', 'Damien', 'Émile', 'Fabrice', 'Gaspard', 'Hugo',
  'Isidore', 'Joachim', 'Ludovic', 'Maxime', 'Nicolas', 'Octave', 'Pascal', 'Quentin',
  'Rémi', 'Sylvain', 'Thibault', 'Valentin', 'Xavier', 'Yann', 'Basile', 'Côme',
]

const esFeminine = [
  'Almudena', 'Beatriz', 'Candela', 'Dolores', 'Estrella', 'Fátima', 'Gloria', 'Inés',
  'Jimena', 'Leonor', 'Marisol', 'Nuria', 'Paloma', 'Raquel', 'Soledad', 'Teresa',
  'Verónica', 'Yolanda', 'Adela', 'Celia', 'Elvira', 'Irene', 'Lucía', 'Pilar',
]

const esMasculine = [
  'Agustín', 'Baltasar', 'César', 'Damián', 'Eloy', 'Fabián', 'Gonzalo', 'Héctor',
  'Ismael', 'Joaquín', 'Leandro', 'Mateo', 'Nicolás', 'Óscar', 'Pablo', 'Rodrigo',
  'Salvador', 'Tomás', 'Vicente', 'Xabier', 'Bruno', 'Gael', 'Íñigo', 'Ramiro',
]

const POOLS: Partial<Record<Language, readonly string[]>> = {
  de: interleave(deMasculine, deFeminine),
  en: interleave(enMasculine, enFeminine),
  fr: interleave(frMasculine, frFeminine),
  es: interleave(esMasculine, esFeminine),
}

const FEMININE: ReadonlySet<string> = new Set([
  ...deFeminine,
  ...enFeminine,
  ...frFeminine,
  ...esFeminine,
])

export function namePool(language: Language): readonly string[] {
  return POOLS[language] ?? (POOLS[FALLBACK_LANGUAGE] as readonly string[])
}

export function hasNamePool(language: Language): boolean {
  return POOLS[language] !== undefined
}

/** Legacy name-group lookup, retained for data compatibility. */
export function beardFits(name: string): boolean {
  return !FEMININE.has(name)
}
