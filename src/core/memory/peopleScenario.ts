/**
 * I2 · Alltagsszenario „Ich treffe neue Menschen“.
 *
 * Mehrere Personen dürfen nicht durch den allgemeinen Freitext-Parser laufen:
 * dort ist bewusst der erste Fund der Anker des ganzen Merksatzes. Für ein
 * Treffen mit mehreren Menschen wäre das falsch — alle Namen würden an der
 * ersten Person hängen. Dieses kleine Modell hält deshalb Person → Merkmale
 * explizit und gibt danach dieselbe `RememberSuggestions`-Form aus wie der
 * restliche MEMORY MODE.
 */

import { memoryNodeId } from './memoryGraph.ts'
import type { EdgeSuggestion, NodeSuggestion, RememberSuggestions } from './rememberThis.ts'

export const MAX_PEOPLE_SCENARIO = 6
export const MAX_FACTS_PER_PERSON = 4

export interface PersonScenarioInput {
  readonly name: string
  readonly facts: readonly string[]
}

function clean(value: string, max = 80): string {
  return value
    .replace(/[\u0000-\u001f\u007f]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
    .slice(0, max)
}

/**
 * Wandelt höchstens sechs Menschen mit höchstens vier Merkmalen je Person in
 * bestätigbare Graph-Vorschläge um. Gleichlautende Merkmale werden bewusst
 * zu einem gemeinsamen Knoten: Das erlaubt später echte Gegenfragen wie
 * „Wer kommt aus Madrid?“ statt künstlicher Duplikate.
 *
 * Eine Person ohne Merkmal bleibt draußen: Ein isolierter Knoten könnte von
 * der Memory-Mission gar nicht sinnvoll abgefragt werden und wäre nur Datenmüll.
 */
export function peopleScenarioSuggestions(
  input: readonly PersonScenarioInput[],
): RememberSuggestions {
  const nodes = new Map<string, NodeSuggestion>()
  const edges = new Map<string, EdgeSuggestion>()

  for (const entry of input.slice(0, MAX_PEOPLE_SCENARIO)) {
    const name = clean(entry.name)
    if (name.length < 2) continue

    const facts: string[] = []
    const seenFacts = new Set<string>()
    for (const rawFact of entry.facts) {
      const fact = clean(rawFact)
      if (fact.length < 2) continue
      const key = fact.toLocaleLowerCase()
      if (seenFacts.has(key)) continue
      seenFacts.add(key)
      facts.push(fact)
      if (facts.length >= MAX_FACTS_PER_PERSON) break
    }
    if (facts.length === 0) continue

    const personId = memoryNodeId('person', name)
    if (!nodes.has(personId)) {
      nodes.set(personId, { id: personId, type: 'person', label: name })
    }

    for (const fact of facts) {
      const factId = memoryNodeId('fact', fact)
      if (!nodes.has(factId)) {
        nodes.set(factId, { id: factId, type: 'fact', label: fact })
      }
      const edge: EdgeSuggestion = {
        from: personId,
        to: factId,
        relation: 'association',
      }
      edges.set(`${edge.from}→${edge.to}:${edge.relation}`, edge)
    }
  }

  return { nodes: [...nodes.values()], edges: [...edges.values()] }
}
