import { useEffect, useMemo } from 'react'

import type { Dictionary } from '../i18n/index.ts'
import { createWebPlatform } from '../platform/web/index.ts'
import { RememberThisPanel } from './RememberThisPanel.tsx'

/**
 * Der MEMORY-MODE-Einstieg aus „Eigene Inhalte“ (I3).
 *
 * Keine zweite Engine und kein zweiter Datenweg: Wir verwenden exakt den
 * bestehenden Memory-Architekten. Der Entwurf wird nur als flüchtiger
 * Startwert hineingereicht; gespeichert wird weiterhin erst hinter dessen
 * ausdrücklicher Bestätigungstür. Der Plattformadapter zeigt auf dieselben
 * lokalen Einstellungen, denselben optionalen BYOK-Coach und denselben
 * stillen Drive-Abgleich wie „Mein Gedächtnis“.
 */
export function OwnMemoryMode({
  draft,
  dictionary,
  onSaved,
}: {
  draft: string
  dictionary: Dictionary
  onSaved: () => void
}) {
  const platform = useMemo(() => createWebPlatform(), [])

  // Ein eigener Adapter darf die bereits getroffene Tonwahl nicht vergessen.
  // Das Lesen bleibt lokal und betrifft nur diesen Komponenten-Lebenszyklus.
  useEffect(() => {
    let active = true
    void platform.settings
      .read<boolean>('sound')
      .then((enabled) => {
        if (active && enabled !== undefined) platform.sound.setEnabled(enabled)
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [platform])

  return (
    <div className="own-memory-mode">
      <RememberThisPanel
        platform={platform}
        dictionary={dictionary}
        initialDraft={draft}
        onSaved={() => onSaved()}
      />
    </div>
  )
}
