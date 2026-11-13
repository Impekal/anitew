const DIAGNOSTIC_KEY = 'anitew.diagnostics.errors.v1'
const MAX_DIAGNOSTIC_EVENTS = 20

export type DiagnosticEventKind = 'error' | 'unhandledrejection'

export interface LocalDiagnosticEvent {
  readonly at: string
  readonly kind: DiagnosticEventKind
  readonly name: string
  readonly source?: string
  readonly line?: number
  readonly column?: number
}

export interface DiagnosticReport {
  readonly schema: 1
  readonly createdAt: string
  readonly build: {
    readonly version: string
    readonly commit: string
    readonly builtAt: string
  }
  readonly runtime: {
    readonly language: string
    readonly online: boolean
    readonly standalone: boolean
    readonly serviceWorkerSupported: boolean
    readonly serviceWorkerControlled: boolean
    readonly notifications: 'unsupported' | NotificationPermission
    readonly indexedDbSupported: boolean
    readonly localStorageAvailable: boolean
    readonly storagePersisted?: boolean
    readonly storageUsageBytes?: number
    readonly storageQuotaBytes?: number
  }
  readonly recentTechnicalErrors: readonly LocalDiagnosticEvent[]
  readonly privacy: {
    readonly includesMemoryContent: false
    readonly includesAnswers: false
    readonly includesPhotos: false
    readonly includesApiKeys: false
    readonly includesOauthTokens: false
    readonly includesRawUrls: false
  }
}

function canUseLocalStorage(): boolean {
  try {
    const key = 'anitew.diagnostics.probe'
    window.localStorage.setItem(key, '1')
    window.localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export function diagnosticErrorName(value: unknown): string {
  if (value instanceof Error) return value.name || 'Error'
  if (value !== null && typeof value === 'object') {
    const name = (value as { name?: unknown }).name
    if (typeof name === 'string' && name.trim() !== '') return name.slice(0, 80)
    const constructorName = (value as { constructor?: { name?: unknown } }).constructor?.name
    if (typeof constructorName === 'string' && constructorName.trim() !== '') {
      return constructorName.slice(0, 80)
    }
  }
  return typeof value
}

export function sanitizeDiagnosticSource(source: string | undefined): string | undefined {
  if (source === undefined || source.trim() === '') return undefined
  try {
    const url = new URL(source, window.location.origin)
    const part = url.pathname.split('/').filter(Boolean).at(-1)
    return part === undefined || part === '' ? undefined : part.slice(0, 120)
  } catch {
    const part = source.split(/[\\/]/).filter(Boolean).at(-1)
    return part === undefined || part === '' ? undefined : part.slice(0, 120)
  }
}

function readEvents(): LocalDiagnosticEvent[] {
  try {
    const raw = window.localStorage.getItem(DIAGNOSTIC_KEY)
    if (raw === null) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((entry): entry is LocalDiagnosticEvent => {
        if (entry === null || typeof entry !== 'object') return false
        const candidate = entry as Partial<LocalDiagnosticEvent>
        return (
          typeof candidate.at === 'string' &&
          (candidate.kind === 'error' || candidate.kind === 'unhandledrejection') &&
          typeof candidate.name === 'string'
        )
      })
      .slice(-MAX_DIAGNOSTIC_EVENTS)
  } catch {
    return []
  }
}

function writeEvent(event: LocalDiagnosticEvent): void {
  try {
    const next = [...readEvents(), event].slice(-MAX_DIAGNOSTIC_EVENTS)
    window.localStorage.setItem(DIAGNOSTIC_KEY, JSON.stringify(next))
  } catch {
    // Diagnose darf den App-Start nie beeinflussen.
  }
}

export function readLocalDiagnosticEvents(): readonly LocalDiagnosticEvent[] {
  return readEvents()
}

export function clearLocalDiagnosticEvents(): void {
  try {
    window.localStorage.removeItem(DIAGNOSTIC_KEY)
  } catch {
    // Geblocktes localStorage ist selbst schon Teil des Diagnoseberichts.
  }
}

/**
 * Lokale Fehlerbeobachtung ohne Sentry, Analytics oder Netzwerk.
 *
 * Absichtlich werden weder Fehlermeldung noch Stack noch die vollständige URL
 * gespeichert: Darin könnten Nutzereingaben oder Tokens auftauchen. Für einen
 * reproduzierbaren Supportfall reichen Fehlerart, Chunk-Datei und Position.
 */
export function installLocalDiagnostics(): void {
  window.addEventListener('error', (event) => {
    writeEvent({
      at: new Date().toISOString(),
      kind: 'error',
      name: diagnosticErrorName(event.error),
      source: sanitizeDiagnosticSource(event.filename),
      line: event.lineno || undefined,
      column: event.colno || undefined,
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    writeEvent({
      at: new Date().toISOString(),
      kind: 'unhandledrejection',
      name: diagnosticErrorName(event.reason),
    })
  })
}

export async function createDiagnosticReport(): Promise<DiagnosticReport> {
  let storagePersisted: boolean | undefined
  let storageUsageBytes: number | undefined
  let storageQuotaBytes: number | undefined

  try {
    storagePersisted = await navigator.storage?.persisted?.()
  } catch {
    storagePersisted = undefined
  }

  try {
    const estimate = await navigator.storage?.estimate?.()
    storageUsageBytes = estimate?.usage
    storageQuotaBytes = estimate?.quota
  } catch {
    storageUsageBytes = undefined
    storageQuotaBytes = undefined
  }

  const standalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as { standalone?: boolean }).standalone === true

  return {
    schema: 1,
    createdAt: new Date().toISOString(),
    build: { ...__ANITEW_BUILD__ },
    runtime: {
      language: document.documentElement.lang || navigator.language || 'unknown',
      online: navigator.onLine,
      standalone,
      serviceWorkerSupported: 'serviceWorker' in navigator,
      serviceWorkerControlled: navigator.serviceWorker?.controller !== null,
      notifications:
        typeof Notification === 'undefined' ? 'unsupported' : Notification.permission,
      indexedDbSupported: 'indexedDB' in window,
      localStorageAvailable: canUseLocalStorage(),
      ...(storagePersisted === undefined ? {} : { storagePersisted }),
      ...(storageUsageBytes === undefined ? {} : { storageUsageBytes }),
      ...(storageQuotaBytes === undefined ? {} : { storageQuotaBytes }),
    },
    recentTechnicalErrors: readEvents(),
    privacy: {
      includesMemoryContent: false,
      includesAnswers: false,
      includesPhotos: false,
      includesApiKeys: false,
      includesOauthTokens: false,
      includesRawUrls: false,
    },
  }
}
