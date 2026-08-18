import type { Reminder, ReminderAbility, ReminderPermission, Reminders } from '../../core/index.ts'

/**
 * Erinnerungen im Browser (Backlog B8 · D-022).
 *
 * ── Die unbequeme Wahrheit zuerst ─────────────────────────────────────────
 *
 * **Das Web kann keine Benachrichtigung für später einplanen.** Der Weg, der
 * das könnte (`TimestampTrigger`), ist über einen Versuch nie hinausgekommen
 * und in keinem Browser dauerhaft verfügbar. Der übliche Ersatz ist ein
 * Server, der zur richtigen Zeit pusht — den es hier nicht gibt und nicht
 * geben soll (D-003, R-3).
 *
 * Was bleibt, ist ein Wecker **innerhalb der laufenden Seite**. Der
 * funktioniert, solange ANITEW offen ist — auch im Hintergrund, dort nur
 * gedrosselt, was bei einem Zwanzig-Minuten-Wecker nichts ausmacht. Wird der
 * Tab geschlossen oder vom Betriebssystem entsorgt, ist er weg.
 *
 * Diese Datei tut deshalb zwei Dinge:
 *
 * 1. Sie **sagt**, was sie kann (`ability`), statt es anzunehmen.
 * 2. Sie plant, was sie planen kann — und gibt `false` zurück, wenn nicht.
 *
 * Der Rest der App darf daraufhin nichts versprechen, was hier nicht
 * ankommt. Eine App, die eine Erinnerung ankündigt und keine schickt, hat
 * schlimmer gelogen, als wenn sie gar keine angeboten hätte (R-2).
 */
export function createWebReminders(): Reminders {
  const timers = new Map<string, ReturnType<typeof setTimeout>>()

  const supported = () =>
    typeof window !== 'undefined' && 'Notification' in window && window.isSecureContext

  const permission = (): ReminderPermission => {
    if (!supported()) return 'denied'
    const state = Notification.permission
    return state === 'default' ? 'unasked' : state
  }

  return {
    ability(): ReminderAbility {
      if (!supported() || permission() === 'denied') return 'none'
      /*
       * Kein `scheduled` — siehe oben. Der Zweig bleibt trotzdem in der
       * Schnittstelle: Als TWA oder native App (Backlog Q) ist genau das der
       * Unterschied, und dann tritt hier eine zweite Umsetzung an, ohne dass
       * der Kern etwas merkt.
       */
      return 'whileOpen'
    },

    permission,

    async ask(): Promise<ReminderPermission> {
      if (!supported()) return 'denied'
      if (Notification.permission !== 'default') return permission()
      const answer = await Notification.requestPermission().catch(() => 'denied' as const)
      return answer === 'default' ? 'unasked' : answer
    },

    async schedule(reminder: Reminder): Promise<boolean> {
      if (!supported() || Notification.permission !== 'granted') return false

      // Dieselbe Erinnerung ersetzt sich selbst, statt sich zu verdoppeln.
      const running = timers.get(reminder.id)
      if (running !== undefined) clearTimeout(running)

      const delay = reminder.at - Date.now()
      // In der Vergangenheit wird nicht erinnert. Sofort zu klingeln wäre
      // keine Erinnerung, sondern eine Störung.
      if (delay <= 0) return false

      const timer = setTimeout(() => {
        timers.delete(reminder.id)
        try {
          new Notification(reminder.title, { body: reminder.body, tag: reminder.id })
        } catch {
          // Manche Browser erlauben den Aufruf nur aus einem Service Worker.
          // Dann fällt die Erinnerung eben aus — sie war nie eine Zusage.
        }
      }, delay)
      timers.set(reminder.id, timer)
      return true
    },

    async cancel(id: string): Promise<void> {
      const running = timers.get(id)
      if (running !== undefined) clearTimeout(running)
      timers.delete(id)
    },
  }
}
