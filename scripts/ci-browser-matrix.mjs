/** Same cases, separate machines; one worker per machine. */
import { execFileSync } from 'node:child_process'
const DESKTOP_SHARDS = 8
const MOBILE_SHARDS = 2
const MOBILE_FILES = [
  "tests/e2e/accessibility.spec.ts",
  "tests/e2e/install.spec.ts",
  "tests/e2e/livingInterface.spec.ts",
  "tests/e2e/memory.spec.ts",
  "tests/e2e/offlineFirstLaunch.spec.ts",
  "tests/e2e/resilience.spec.ts",
  "tests/e2e/session.spec.ts",
  "tests/e2e/sync.spec.ts",
  "tests/e2e/oauthResume.spec.ts",
  "tests/e2e/reset.spec.ts",
  "tests/e2e/coreNavigation.spec.ts",
  "tests/e2e/reminders.spec.ts",
  "tests/e2e/privacy.spec.ts",
  "tests/e2e/upgrade.spec.ts",
  "tests/e2e/portraits.spec.ts",
  "tests/e2e/coach.spec.ts",
  "tests/e2e/journey.spec.ts",
  "tests/e2e/courses.spec.ts",
  "tests/e2e/course-default.spec.ts",
  "tests/e2e/course-playback.spec.ts",
  "tests/e2e/course-accessibility.spec.ts",
  "tests/e2e/course-backup.spec.ts",
  "tests/e2e/course-subtitles.spec.ts",
  "tests/e2e/course-video.spec.ts",
  "tests/e2e/course-voices.spec.ts"
]

const groups = [
  { name: 'Desktop-Chromium', args: ['--project=chromium'], shards: DESKTOP_SHARDS },
  { name: 'Mobile Release Gate', args: ['--project=mobile', ...MOBILE_FILES], shards: MOBILE_SHARDS },
]

function count(args) {
  const output = execFileSync('npx', ['playwright', 'test', ...args, '--list', '--reporter=json'],
    { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })
  const report = JSON.parse(output)
  function specs(suite) { return (suite.specs?.length ?? 0) + (suite.suites ?? []).reduce((n, child) => n + specs(child), 0) }
  return (report.suites ?? []).reduce((n, suite) => n + specs(suite), 0)
}
const include = []
for (const group of groups) {
  const total = count(group.args)
  const parts = Array.from({ length: group.shards }, (_, index) =>
    count([...group.args, `--shard=${index + 1}/${group.shards}`]))
  const sum = parts.reduce((n, part) => n + part, 0)
  if (total === 0 || sum !== total) throw new Error(`${group.name}: incomplete browser matrix`)
  if (process.argv.includes('--verify')) console.log(`${group.name}: ${parts.join(' + ')} = ${sum}; unsharded ${total}`)
  parts.forEach((cases, index) => {
    // File-based Playwright sharding can legitimately leave the last slot empty.
    // Omit that machine; the equality above still accounts for every case.
    if (cases > 0) include.push({
      name: `${group.name} ${index + 1}/${group.shards}`,
      args: [...group.args, `--shard=${index + 1}/${group.shards}`].join(' '),
    })
  })
}
include.push({ name: 'Layout-Matrix', args: 'tests/e2e/layout.spec.ts' })
if (!process.argv.includes('--verify')) console.log(JSON.stringify({ include }))
