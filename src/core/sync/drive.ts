/**
 * Der Abgleich über den eigenen Google-Drive-App-Ordner (Backlog N7/N8/N10 · D-033).
 *
 * Kein eigener Server, kein Konto bei uns (R-3): Die Daten liegen in
 * **deinem** Drive, in einem App-Ordner, den nur diese App sieht — und was
 * dort liegt, ist exakt die Sicherungsdatei (N2), die es schon gibt.
 *
 * Der Ablauf ist bewusst das vorhandene Mischwerk und kein zweites:
 *
 * 1. **Herunterladen**, was im App-Ordner liegt (oder nichts).
 * 2. **Einmischen** mit den Regeln der Sicherung (N9): nie löschen, bei
 *    zwei Fassungen gewinnt die reichere — zwei Geräte, die eine Woche
 *    getrennt liefen, haben beide recht.
 * 3. Die **Vereinigung hochladen**. Danach tragen Gerät und Drive
 *    denselben Stand.
 *
 * Damit ist der Abgleich idempotent: zweimal abgleichen ändert nichts
 * mehr. Und er ist genau so vertrauenswürdig wie die Sicherung, weil er
 * die Sicherung **ist**.
 *
 * Der Kern kennt weder Netz noch Google — nur diese Schnittstellen. OAuth,
 * Drive-Aufrufe und die Datenbank stehen in der Plattform (D-010).
 */

import { type BackupFile, readBackup } from '../backup.ts'

/** Der Dateiname im App-Ordner — eine Datei, immer der ganze Stand. */
export const DRIVE_FILE_NAME = 'anitew-sicherung.json'

/** Der engste Google-Zugriff, der das kann: nur der eigene App-Ordner. */
export const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.appdata'

export interface SyncPorts {
  /** Die Datei aus dem App-Ordner, JSON-geparst — oder nichts. */
  download(): Promise<unknown | undefined>
  /** Schreibt die Datei in den App-Ordner (anlegen oder ersetzen). */
  upload(file: BackupFile): Promise<void>
  /** Die ganze lokale Datenbank als Sicherungsdatei. */
  exportLocal(): Promise<BackupFile>
  /** Mischt eine gültige Sicherung ein (N9) und meldet, was neu war. */
  importRemote(file: BackupFile): Promise<{ addedTotal: number }>
}

export interface SyncReport {
  /** Wie viele Datensätze vom Drive neu auf dieses Gerät kamen. */
  readonly pulled: number
  /** Lag im App-Ordner schon eine Datei? */
  readonly hadRemote: boolean
}

/**
 * Was schiefgehen kann, benennbar. `remote-invalid` ist der wichtigste
 * Fall: Eine Datei, die keine gültige Sicherung ist, wird **nicht**
 * überschrieben — sie könnte der einzige Stand eines anderen Geräts sein,
 * und ein Abgleich, der bei Zweifel löscht, wäre keiner.
 */
export type SyncFailure = 'remote-invalid'

export class SyncError extends Error {
  constructor(readonly reason: SyncFailure) {
    super(reason)
    this.name = 'SyncError'
  }
}

/** Ein voller Abgleich: herunterladen → einmischen → Vereinigung hochladen. */
export async function syncOnce(ports: SyncPorts): Promise<SyncReport> {
  const raw = await ports.download()

  let pulled = 0
  const hadRemote = raw !== undefined
  if (hadRemote) {
    const reading = readBackup(raw)
    if (!reading.ok) throw new SyncError('remote-invalid')
    pulled = (await ports.importRemote(reading.file)).addedTotal
  }

  await ports.upload(await ports.exportLocal())
  return { pulled, hadRemote }
}
