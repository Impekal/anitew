/**
 * Alles löschen (Backlog N4).
 *
 * Das Gegenstück zur Sicherung — und der praktische Vollzug des Rechts auf
 * Löschung aus der Datenschutzerklärung (§7). Wer geht, soll gehen können,
 * und zwar restlos: keine verwaisten Reste, keine Zeile, die den nächsten
 * Nutzer desselben Geräts überrascht.
 *
 * **Unwiderruflich, und das ist der Punkt.** Deshalb steht in der Oberfläche
 * eine echte Rückfrage davor (anders als beim Messungs-Abbruch, der nichts
 * kostet) und der Hinweis, vorher zu sichern. Hier wird nicht beruhigt,
 * sondern gewarnt — weil danach wirklich nichts mehr da ist.
 */

import { db } from './db.ts'

/** Leert jede Tabelle und widerruft auch die technische Web-Push-Adresse. */
export async function wipeEverything(): Promise<void> {
  // Push ist kein Kaltstartpfad. Beim seltenen Voll-Reset wird der Browser-
  // Teil erst hier geladen. Ein nicht erreichbarer Push-Worker darf das lokale
  // Recht auf Löschung nicht blockieren: unsubscribe() invalidiert die Adresse
  // bestmöglich, danach werden die eigentlichen Nutzerdaten immer gelöscht.
  await import('../platform/web/reminders.ts')
    .then((module) => module.clearWebPushRegistration())
    .catch(() => undefined)

  await db.transaction(
    'rw',
    [db.settings, db.sessions, db.events, db.itemStates, db.benchmarks],
    async () => {
      await Promise.all([
        db.settings.clear(),
        db.sessions.clear(),
        db.events.clear(),
        db.itemStates.clear(),
        db.benchmarks.clear(),
      ])
    },
  )
}
