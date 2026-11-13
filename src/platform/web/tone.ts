/**
 * Die Tonleiter von ANITEW — eine Zeile Rechnung, zwei Nutzer.
 *
 * Sie steht in einer eigenen Datei, seit der Dauerklang der Einheit
 * (`ambient.ts`) verzoegert geladen wird: Beide Seiten brauchen dieselben
 * Frequenzen, und eine geteilte Konstante ist billiger als eine Kopie —
 * und sicherer, als sie auseinanderlaufen zu lassen.
 */

/** Grundton A3. Tief genug, dass nichts schrill wird. */
export const BASE_HZ = 220

/** Pentatonisch: grosse Sekunde, Terz, Quinte, Sexte. Keine Halbtoene. */
export const SCALE = [0, 2, 4, 7, 9]

export function frequency(step: number): number {
  const octave = Math.floor(step / SCALE.length)
  const degree = SCALE[((step % SCALE.length) + SCALE.length) % SCALE.length] as number
  return BASE_HZ * 2 ** (octave + degree / 12)
}
