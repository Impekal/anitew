from pathlib import Path
import re


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    s = p.read_text()
    assert old in s, f'missing expected text in {path}: {old[:120]!r}'
    p.write_text(s.replace(old, new, 1))


def regex_once(path: str, pattern: str, replacement: str) -> None:
    p = Path(path)
    s = p.read_text()
    out, count = re.subn(pattern, replacement, s, count=1, flags=re.MULTILINE)
    assert count == 1, f'expected exactly one regex match in {path}, got {count}: {pattern[:120]!r}'
    p.write_text(out)


# Daily Mission: no focus from zero-evidence or immediate-only dimensions.
# "Undertrained" is comparative: one eligible delayed dimension must have
# strictly fewer opportunities than the next. Equal exposure has no winner.
replace_once(
    'src/core/memory/dailyMission.ts',
    "import { type DimensionId, moduleForDimension } from '../profile/dimensions.ts'",
    "import { type DimensionId, isImmediate, moduleForDimension } from '../profile/dimensions.ts'",
)
regex_once(
    'src/core/memory/dailyMission.ts',
    r"(?P<head>const undertrained = \(Object\.entries\(input\.dimensions\) as \[DimensionId, DimensionCounts\]\[\]\)\s*)\.sort\(\(a, b\) => a\[1\]\.chances - b\[1\]\.chances \|\| a\[0\]\.localeCompare\(b\[0\]\)\)\[0\]",
    r"""const undertrainedRanked = (Object.entries(input.dimensions) as [DimensionId, DimensionCounts][])
      .filter(([id, counts]) =>
        counts.chances > 0 && !isImmediate(id) && moduleForDimension(id) !== undefined,
      )
      .sort((a, b) => a[1].chances - b[1].chances || a[0].localeCompare(b[0]))
    const undertrained =
      undertrainedRanked.length >= 2 &&
      undertrainedRanked[0]![1].chances < undertrainedRanked[1]![1].chances
        ? undertrainedRanked[0]
        : undefined""",
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

# Phase 2 intentionally gives the focus a new adaptive explanation. Keep the
# browser contract semantic: a real focus must explain itself, without pinning
# the test to the Phase 1 copy.
replace_once(
    'tests/e2e/profile.spec.ts',
    "  await expect(page.getByText(/Ändert sich, sobald sich die Zahlen ändern/)).toBeVisible()",
    "  await expect(page.locator('.focus-why')).toBeVisible()\n  await expect(page.locator('.focus-why')).not.toHaveText('')",
)

# Core regression guards.
p = Path('tests/core/memoryPhase2.test.ts')
s = p.read_text()
s = "import { weakenMemoryNode } from '../../src/core/memory/memoryGraph.ts'\n" + s
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

  it('erfindet bei gleich viel Training keinen untertrainierten Gewinner', () => {
    const decision = composeDailyMission({
      seconds: 300,
      dueByModule: {},
      personalScenes: 0,
      untrainedPersonalItems: 0,
      dimensions: {
        words: { chances: 21, lost: 5 },
        numbers: { chances: 21, lost: 6 },
      },
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
  })
})
'''
assert "describe('Phase 2 evidence guards'" not in s
p.write_text(s + addition)
