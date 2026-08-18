import { type AchievementId, achievementsOf, type AchievementInput } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'

/**
 * Erreichtes (Backlog K3 · D-019).
 *
 * Kein Trophäenschrank mit gesperrten Feldern — das wäre die Aufforderung,
 * die K7 ausschließt. Nur die Tatsachen, die wirklich zutreffen, jede in
 * einem Satz, im ruhigen Ton der Serie. Ist noch keine erreicht, steht hier
 * gar nichts.
 */
export function AchievementsLine({
  input,
  dictionary,
}: {
  input: AchievementInput
  dictionary: Dictionary
}) {
  const reached = achievementsOf(input)
  if (reached.length === 0) return null

  const facts: Record<AchievementId, string> = dictionary.achievements.facts

  return (
    <details className="details">
      <summary>{dictionary.achievements.heading}</summary>
      <ul className="reached">
        {reached.map((id) => (
          <li key={id}>{facts[id]}</li>
        ))}
      </ul>
    </details>
  )
}
