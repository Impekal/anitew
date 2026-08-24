import { describe, expect, it } from 'vitest'

import {
  MAX_FACTS_PER_PERSON,
  MAX_PEOPLE_SCENARIO,
  peopleScenarioSuggestions,
} from '../../src/core/index.ts'

describe('peopleScenarioSuggestions', () => {
  it('hält mehrere Menschen als getrennte Anker mit ihren eigenen Merkmalen', () => {
    const suggestions = peopleScenarioSuggestions([
      { name: 'Mira', facts: ['Cello', 'Madrid'] },
      { name: 'Daniel', facts: ['Gitarre', 'Berlin'] },
    ])

    const people = suggestions.nodes.filter((node) => node.type === 'person')
    expect(people.map((node) => node.label)).toEqual(['Mira', 'Daniel'])
    expect(suggestions.edges).toHaveLength(4)

    const mira = people.find((node) => node.label === 'Mira')
    const daniel = people.find((node) => node.label === 'Daniel')
    const targetLabels = (personId: string) =>
      suggestions.edges
        .filter((edge) => edge.from === personId)
        .map((edge) => suggestions.nodes.find((node) => node.id === edge.to)?.label)

    expect(targetLabels(mira!.id)).toEqual(['Cello', 'Madrid'])
    expect(targetLabels(daniel!.id)).toEqual(['Gitarre', 'Berlin'])
  })

  it('teilt ein gleiches Merkmal zwischen Menschen statt es zu duplizieren', () => {
    const suggestions = peopleScenarioSuggestions([
      { name: 'Mira', facts: ['Cello'] },
      { name: 'Lea', facts: ['Cello'] },
    ])

    expect(suggestions.nodes.filter((node) => node.type === 'person')).toHaveLength(2)
    expect(suggestions.nodes.filter((node) => node.type === 'fact')).toHaveLength(1)
    expect(suggestions.edges).toHaveLength(2)
    expect(new Set(suggestions.edges.map((edge) => edge.to)).size).toBe(1)
  })

  it('begrenzt das Szenario und lässt untrainierbare Personen ohne Merkmal weg', () => {
    const input = Array.from({ length: MAX_PEOPLE_SCENARIO + 2 }, (_, index) => ({
      name: `Person${index + 1}`,
      facts: index === 0 ? [] : Array.from({ length: MAX_FACTS_PER_PERSON + 2 }, (_, fact) => `Fakt${index}-${fact}`),
    }))
    const suggestions = peopleScenarioSuggestions(input)

    // Person 1 hat kein Merkmal und fällt heraus; die beiden Einträge nach
    // dem Sechser-Limit werden gar nicht betrachtet.
    expect(suggestions.nodes.filter((node) => node.type === 'person')).toHaveLength(
      MAX_PEOPLE_SCENARIO - 1,
    )
    expect(suggestions.edges).toHaveLength((MAX_PEOPLE_SCENARIO - 1) * MAX_FACTS_PER_PERSON)
  })
})
