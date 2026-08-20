from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    s = p.read_text()
    assert old in s, f'missing expected text in {path}: {old[:120]!r}'
    p.write_text(s.replace(old, new, 1))


# Daily Mission: no focus from zero-evidence or immediate-only dimensions.
replace_once(
    'src/core/memory/dailyMission.ts',
    "import { type DimensionId, moduleForDimension } from '../profile/dimensions.ts'",
    "import { type DimensionId, isImmediate, moduleForDimension } from '../profile/dimensions.ts'",
)
replace_once(
    'src/core/memory/dailyMission.ts',
    """    const undertrained = (Object.entries(input.dimensions) as [DimensionId, DimensionCounts][])
              .sort((a, b) => a[1].chances - b[1].chances || a[0].localeCompare(b[0]))[0]
""",
    """    const undertrained = (Object.entries(input.dimensions) as [DimensionId, DimensionCounts][])
              // Keine Gelegenheit ist kein Defizit. Und Sofort-Achsen sind eine andere
              // Währung als Wiedersehen nach Tagen (dieselbe Regel wie `weakest`).
              .filter(([id, counts]) =>
                counts.chances > 0 && !isImmediate(id) && moduleForDimension(id) !== undefined,
              )
              .sort((a, b) => a[1].chances - b[1].chances || a[0].localeCompare(b[0]))[0]
""",
)

# Memory Pulse: recent activity is evidence of practice, not necessarily reinforcement.
replace_once(
    'src/core/memory/memoryPulse.ts',
    "| { kind: 'reinforced'; count: number }",
    "| { kind: 'practiced'; count: number }",
)
replace_once(
    'src/core/memory/memoryPulse.ts',
    "signals.push({ kind: 'reinforced', count: recent.length })",
    "signals.push({ kind: 'practiced', count: recent.length })",
)
replace_once('src/app/MemoryPulse.tsx', "case 'reinforced':", "case 'practiced':")
replace_once('src/app/MemoryPulse.tsx', 'return t.reinforced.replace', 'return t.practiced.replace')
replace_once(
    'src/i18n/de.ts',
    "reinforced: '{count} Erinnerungen wurden in den letzten 24 Stunden abgerufen.',",
    "practiced: '{count} Erinnerungen wurden in den letzten 24 Stunden trainiert.',",
)
replace_once(
    'src/i18n/en.ts',
    "reinforced: '{count} memories were recalled in the last 24 hours.',",
    "practiced: '{count} memories were trained in the last 24 hours.',",
)

# UI: once the adaptive mission has resolved, its explicit 'no focus' must not
# fall back to the older profile focus. The fallback exists only while preview
# data has not loaded yet.
replace_once(
    'src/app/App.tsx',
    "{(missionPreview?.focus !== undefined || focus !== undefined) && (",
    "{((missionPreview !== undefined ? missionPreview.focus : focus?.moduleId) !== undefined) && (",
)
replace_once(
    'src/app/App.tsx',
    "(dictionary.profile.modules as Record<string, string>)[missionPreview?.focus ?? focus?.moduleId ?? '']",
    "(dictionary.profile.modules as Record<string, string>)[missionPreview !== undefined ? (missionPreview.focus ?? '') : (focus?.moduleId ?? '')]",
)

# Core regression guards.
p = Path('tests/core/memoryPhase2.test.ts')
s = p.read_text()
assert 'memoryPulse,\n' in s
s = s.replace('    memoryPulse,\n', '    memoryPulse,\n    weakenMemoryNode,\n', 1)
addition = r'''

describe('Phase 2 evidence guards', () => {
  it('macht aus einer Sofort-Achse keinen Tages-Schwerpunkt', () => {
    const decision = composeDailyMission({
      seconds: 300,
      dueByModule: {},
      personalScenes: 0,
      untrainedPersonalItems: 0,
      dimensions: { working: { chances: 20, lost: 3 } },
      interferenceErrors: 0,
    })
    expect(decision.focus).toBeUndefined()
    expect(decision.reason).toBe('balanced')
  })

  it('behandelt null Wiedersehen als fehlende Evidenz, nicht als Untertraining', () => {
    const decision = composeDailyMission({
      seconds: 300,
      dueByModule: {},
      personalScenes: 0,
      untrainedPersonalItems: 0,
      dimensions: { words: { chances: 0, lost: 0 } },
      interferenceErrors: 0,
    })
    expect(decision.focus).toBeUndefined()
    expect(decision.reason).toBe('balanced')
  })

  it('darf eine echte verzögerte Gelegenheit als wenig trainiert priorisieren', () => {
    const decision = composeDailyMission({
      seconds: 300,
      dueByModule: {},
      personalScenes: 0,
      untrainedPersonalItems: 0,
      dimensions: {
        words: { chances: 4, lost: 1 },
        faces: { chances: 9, lost: 2 },
      },
      interferenceErrors: 0,
    })
    expect(decision).toMatchObject({ focus: 'words', reason: 'undertrained' })
  })

  it('nennt auch einen misslungenen Abruf nur Training, nicht Verstärkung', () => {
    const graph = weakenMemoryNode(graphAt(1_000), 'person:daniel', 2_000)
    const signals = memoryPulse({ graph, due: [], today: '2026-08-20', now: 2_000 })
    expect(signals).toContainEqual({ kind: 'practiced', count: 1 })
    expect(signals.some((signal) => signal.kind === 'reinforced')).toBe(false)
  })
})
'''
assert "describe('Phase 2 evidence guards'" not in s
p.write_text(s + addition)
