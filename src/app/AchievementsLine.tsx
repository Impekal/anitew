import {
  type AchievementId,
  achievementsOf,
  type AchievementInput,
  domainFacts,
  SKILL_DOMAINS,
  type SkillDomain,
} from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'

/**
 * Erreichtes, gruppiert nach Fähigkeit (Backlog K3 · D-019 · D-030).
 *
 * Kein Trophäenschrank mit gesperrten Feldern — das wäre die Aufforderung,
 * die K7 ausschließt. Die Tatsachen stehen unter ihrer Fähigkeit (Dranbleiben,
 * Abruf, Arbeitsgedächtnis, …); eine Fähigkeit ohne Tatsache steht gar nicht
 * da, und ohne jede Tatsache steht hier nichts — dann fehlt auch der
 * Menüpunkt. Kein Rang, kein Balken, keine Zahl, die nicht gezählt ist.
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
  const domains: Record<SkillDomain, string> = dictionary.achievements.domains

  return (
    <div className="skills">
      {SKILL_DOMAINS.map((domain) => {
        const own = domainFacts(domain, reached)
        if (own.length === 0) return null
        return (
          <section key={domain} className="skill">
            <h3>{domains[domain]}</h3>
            <ul className="reached">
              {own.map((id) => (
                <li key={id}>{facts[id]}</li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
