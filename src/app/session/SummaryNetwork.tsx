import type { Dictionary } from '../../i18n/index.ts'
import type { ModuleId } from '../../core/index.ts'

export interface SummaryNetworkGroup {
  moduleId?: string
  correct: readonly string[]
  missed: readonly string[]
}

const WIDTH = 320
const HEIGHT = 260
const CX = WIDTH / 2
const CY = HEIGHT / 2
const HUB_RADIUS = 58
const ITEM_RADIUS = 108

/**
 * O15: Das Ergebnis als kleines Netz.
 *
 * Die Kanten behaupten nur eine Sache: Dieses Item kam in dieser Session aus
 * diesem Modul. Keine semantische Verbindung zwischen Items, kein Score, kein
 * "Memory Graph". Die visuelle Form ist neu; die Wahrheit bleibt dieselbe wie
 * in den RoundResults.
 */
export function SummaryNetwork({
  groups,
  dictionary,
}: {
  groups: readonly SummaryNetworkGroup[]
  dictionary: Dictionary
}) {
  const active = groups.filter((group) => group.correct.length + group.missed.length > 0)
  if (active.length === 0) return null

  const allItems = active.flatMap((group) => [
    ...group.correct.map((label) => ({ group, label, correct: true })),
    ...group.missed.map((label) => ({ group, label, correct: false })),
  ])

  const desc = allItems
    .map((item) => `${item.label}: ${item.correct ? '✓' : '–'}`)
    .join(', ')

  return (
    <svg
      className="summary-network"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-labelledby="summary-network-title summary-network-desc"
    >
      <title id="summary-network-title">{dictionary.summary.heading}</title>
      <desc id="summary-network-desc">{desc}</desc>

      {active.map((group, groupIndex) => {
        const angle = angleFor(groupIndex, active.length)
        const hub = point(angle, HUB_RADIUS)
        const items = [
          ...group.correct.map((label) => ({ label, correct: true })),
          ...group.missed.map((label) => ({ label, correct: false })),
        ]
        const sector = (Math.PI * 2) / Math.max(active.length, 1)

        return (
          <g key={`${group.moduleId ?? 'legacy'}-${groupIndex}`}>
            <line x1={CX} y1={CY} x2={hub.x} y2={hub.y} stroke="var(--net)" strokeWidth="1" />
            {items.map((item, itemIndex) => {
              const spread = items.length <= 1 ? 0 : ((itemIndex / (items.length - 1)) - 0.5) * sector * 0.68
              const node = point(angle + spread, ITEM_RADIUS)
              return (
                <g key={`${item.label}-${itemIndex}`}>
                  <line x1={hub.x} y1={hub.y} x2={node.x} y2={node.y} stroke="var(--net)" strokeWidth="1" />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="4.5"
                    fill={item.correct ? 'var(--accent)' : 'var(--card)'}
                    stroke={item.correct ? 'var(--accent)' : 'var(--line)'}
                    strokeWidth="1"
                  >
                    <title>{item.label}</title>
                  </circle>
                  <text
                    x={node.x}
                    y={node.y + (node.y < CY ? -9 : 14)}
                    textAnchor="middle"
                    fontSize="8.5"
                    fill={item.correct ? 'var(--ink-soft)' : 'var(--ink-faint)'}
                  >
                    {shortLabel(item.label)}
                  </text>
                </g>
              )
            })}
            <circle cx={hub.x} cy={hub.y} r="13" fill="var(--card)" stroke="var(--net-strong)" strokeWidth="1" />
            <text x={hub.x} y={hub.y + 3} textAnchor="middle" fontSize="7.5" fill="var(--ink-soft)">
              {moduleLabel(group.moduleId, dictionary)}
            </text>
          </g>
        )
      })}

      <circle cx={CX} cy={CY} r="17" fill="var(--card)" stroke="var(--accent)" strokeWidth="1.2" />
      <text x={CX} y={CY + 3} textAnchor="middle" fontSize="8" fill="var(--ink)">
        {dictionary.app.name}
      </text>
    </svg>
  )
}

function angleFor(index: number, count: number): number {
  return -Math.PI / 2 + (index * Math.PI * 2) / count
}

function point(angle: number, radius: number): { x: number; y: number } {
  return { x: CX + Math.cos(angle) * radius, y: CY + Math.sin(angle) * radius }
}

function shortLabel(label: string): string {
  return label.length <= 15 ? label : `${label.slice(0, 13)}…`
}

function moduleLabel(moduleId: string | undefined, dictionary: Dictionary): string {
  if (moduleId === undefined) return dictionary.summary.heading
  const names = dictionary.profile.modules as Partial<Record<ModuleId, string>>
  return names[moduleId as ModuleId] ?? moduleId
}
