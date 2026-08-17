import type { Platform } from '../core/index.ts'
import type { Dictionary } from '../i18n/index.ts'

import { useFoundation } from './useFoundation.ts'

/**
 * Die vorläufige Anzeige aus M0 (siehe useFoundation.ts).
 *
 * Sie zeigt nur Gemessenes und verschwindet, sobald das Training da ist.
 */
export function FoundationPanel({
  platform,
  dictionary,
}: {
  platform: Platform
  dictionary: Dictionary
}) {
  const state = useFoundation(platform)
  const t = dictionary.check

  const storage =
    state.storage === 'ok' ? t.storageOk : state.storage === 'failed' ? t.storageFail : '…'
  const offline =
    state.offline === 'ready'
      ? t.offlineOk
      : state.offline === 'pending'
        ? t.offlinePending
        : t.offlineUnavailable

  return (
    <section className="foundation" aria-labelledby="foundation-heading">
      <h3 id="foundation-heading">{t.heading}</h3>
      <dl>
        <Row label={t.storage} value={storage} bad={state.storage === 'failed'} />
        <Row label={t.offline} value={offline} />
        <Row label={t.installed} value={state.installed ? t.yes : t.no} />
        <Row label={t.today} value={state.today ?? '…'} hint={t.todayHint} />
        {state.firstSeenAt !== undefined && (
          <Row label={t.firstSeen} value={formatDate(state.firstSeenAt)} />
        )}
        {state.openCount !== undefined && (
          <Row label={t.openCount} value={`${state.openCount}× `} />
        )}
        <Row label={t.version} value={__ANITEW_BUILD__.commit} />
      </dl>
      <p className="hint">{t.note}</p>
    </section>
  )
}

function Row({
  label,
  value,
  hint,
  bad,
}: {
  label: string
  value: string
  hint?: string
  bad?: boolean
}) {
  return (
    <div className="row">
      <dt>
        {label}
        {hint !== undefined && <span className="row-hint">{hint}</span>}
      </dt>
      <dd className={bad === true ? 'bad' : undefined}>{value}</dd>
    </div>
  )
}

function formatDate(at: number): string {
  // Absichtlich die Gerätesprache und nicht die App-Sprache: Ein Datum liest
  // man in dem Format, das man vom eigenen Telefon kennt.
  return new Date(at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
